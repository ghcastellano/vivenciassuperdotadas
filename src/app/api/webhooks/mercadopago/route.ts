import crypto from "crypto";
import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { query, isDatabaseConfigured } from "@/lib/db";
import { sendVivenciasEmail } from "@/lib/email";

function verifyMercadoPagoSignature(
  signatureHeader: string | null,
  requestId: string | null,
  dataId: string | null,
  secret: string
): boolean {
  if (!signatureHeader || !requestId || !dataId) return false;
  const parts: Record<string, string> = {};
  for (const part of signatureHeader.split(",")) {
    const [k, v] = part.split("=").map((s) => s.trim());
    if (k && v) parts[k] = v;
  }
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const computed = crypto.createHmac("sha256", secret).update(manifest).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(v1, "hex"));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json({ error: "Mercado Pago not configured" }, { status: 503 });
  }

  const url = new URL(req.url);
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const dataObj = (body.data as Record<string, unknown> | undefined) || {};
  const dataId =
    url.searchParams.get("data.id") ||
    url.searchParams.get("id") ||
    (dataObj.id ? String(dataObj.id) : null);

  const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (webhookSecret) {
    const ok = verifyMercadoPagoSignature(
      req.headers.get("x-signature"),
      req.headers.get("x-request-id"),
      dataId,
      webhookSecret
    );
    if (!ok) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const topic = String(body.type || url.searchParams.get("type") || url.searchParams.get("topic") || "");
  if (topic !== "payment" || !dataId) {
    return NextResponse.json({ received: true, ignored: true });
  }

  try {
    const client = new MercadoPagoConfig({ accessToken });
    const paymentApi = new Payment(client);
    const payment = await paymentApi.get({ id: dataId });

    if (payment.status !== "approved") {
      return NextResponse.json({ received: true, status: payment.status });
    }

    const amountCents = Math.round(Number(payment.transaction_amount || 0) * 100);
    const metadata = (payment.metadata || {}) as Record<string, unknown>;
    const kind = metadata.kind === "store" ? "store" : "donation";
    const description =
      String(metadata.description || payment.description || (kind === "store" ? "Venda Lojinha (Mercado Pago)" : "Doação (Mercado Pago)"));
    const email = payment.payer?.email || "";

    const feeSumReais = Array.isArray(payment.fee_details)
      ? payment.fee_details.reduce((acc, f) => acc + Number(f.amount || 0), 0)
      : 0;
    const feeCents = feeSumReais > 0 ? Math.round(feeSumReais * 100) : Math.round(amountCents * 0.0399);

    if (isDatabaseConfigured()) {
      await query(
        `INSERT INTO stripe_transactions (id, stripe_session_id, kind, amount_cents, fee_cents, currency, description, customer_email, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'completed')
         ON CONFLICT (stripe_session_id) DO NOTHING`,
        [
          crypto.randomUUID(),
          `mp_${payment.id}`,
          kind,
          amountCents,
          feeCents,
          String(payment.currency_id || "BRL").toLowerCase(),
          description,
          email,
        ]
      );
    }

    if (email) {
      await sendVivenciasEmail({
        to: email,
        subject: "Obrigado por apoiar o Vivências Superdotadas!",
        heading: "Pagamento confirmado via Mercado Pago",
        intro: `Recebemos com gratidão sua contribuição (${description}).`,
        bodyHtml: `<p>O valor já entra automaticamente no nosso Portal de Transparência para manter a associação ativa, acessível e gratuita para a comunidade.</p>`,
        ctaLabel: "Ver Transparência",
        ctaUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://vivenciassuperdotadas.vercel.app"}/apoie`,
      });
    }

    return NextResponse.json({ received: true, status: "approved" });
  } catch (err) {
    console.error("Mercado Pago webhook error:", err);
    return NextResponse.json({ error: "Erro ao processar webhook Mercado Pago" }, { status: 500 });
  }
}
