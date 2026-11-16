import { NextResponse } from "next/server";
import Stripe from "stripe";
import { query, isDatabaseConfigured } from "@/lib/db";
import { sendVivenciasEmail } from "@/lib/email";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 503 });
  }

  const stripe = new Stripe(secret);
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const amountCents = session.amount_total || 0;
    const kind = session.metadata?.kind === "store" ? "store" : "donation";
    const description = session.metadata?.description || (kind === "store" ? "Venda Lojinha" : "Doação");
    const email = session.customer_details?.email || "";
    const estimatedFeeCents = Math.round(amountCents * 0.0399 + 39);

    if (isDatabaseConfigured()) {
      await query(
        `INSERT INTO stripe_transactions (id, stripe_session_id, kind, amount_cents, fee_cents, currency, description, customer_email, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'completed')
         ON CONFLICT (stripe_session_id) DO NOTHING`,
        [
          crypto.randomUUID(),
          session.id,
          kind,
          amountCents,
          estimatedFeeCents,
          session.currency || "brl",
          description,
          email,
        ]
      );
    }

    if (email) {
      await sendVivenciasEmail({
        to: email,
        subject: "Obrigado por apoiar o Vivências Superdotadas!",
        heading: "Sua contribuição faz diferença",
        intro: `Recebemos com gratidão sua contribuição (${description}).`,
        bodyHtml: `<p>O valor já entra automaticamente no nosso Portal de Transparência para manter a associação ativa, acessível e gratuita para a comunidade.</p>`,
        ctaLabel: "Ver Transparência",
        ctaUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://vivenciassuperdotadas.vercel.app"}/apoie`,
      });
    }
  }

  return NextResponse.json({ received: true });
}
