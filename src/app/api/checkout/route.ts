import crypto from "crypto";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Preference } from "mercadopago";
import { auth } from "@/lib/auth";
import { getMercadoPagoClient } from "@/lib/mercadopago";
import { DEFAULT_PRODUCTS } from "@/lib/institutional-data";

interface CartItemPayload {
  productId: string;
  quantity?: number;
  variant?: string;
}

export async function GET() {
  return NextResponse.json({
    mercadopago: Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN),
    stripe: Boolean(process.env.STRIPE_SECRET_KEY),
  });
}

export async function POST(req: Request) {
  try {
    const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const stripeSecret = process.env.STRIPE_SECRET_KEY;

    const body = await req.json();
    const kind = body.kind === "store" ? "store" : "donation";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vivenciassuperdotadas.vercel.app";

    const requestedProvider = body.provider === "stripe" ? "stripe" : "mercadopago";
    const useMercadoPago = Boolean(mpToken) && (requestedProvider === "mercadopago" || !stripeSecret);
    const useStripe = !useMercadoPago && Boolean(stripeSecret);

    if (!useMercadoPago && !useStripe) {
      return NextResponse.json(
        {
          error:
            "Gateway de pagamento ainda não configurado neste ambiente (adicione MERCADOPAGO_ACCESS_TOKEN ou STRIPE_SECRET_KEY no .env.local / Vercel).",
        },
        { status: 503 }
      );
    }

    if (useMercadoPago && mpToken) {
      const client = getMercadoPagoClient(mpToken)!;
      const preference = new Preference(client);
      const isSandbox = mpToken.startsWith("TEST-");
      const session = await auth().catch(() => null);
      const payerEmail = session?.user?.email || undefined;

      if (kind === "donation") {
        const amountReais = Math.max(5, Math.min(50000, Number(body.amountReais || 25)));
        const recurring = Boolean(body.recurring);
        const description = recurring
          ? "Apoio Mensal — Associação Vivências Superdotadas"
          : "Doação Pontual — Associação Vivências Superdotadas";

        const result = await preference.create({
          body: {
            items: [
              {
                id: recurring ? "doacao-mensal" : "doacao-pontual",
                title: description,
                description: "Contribuição transparente para manter infraestrutura, divulgação científica e eventos gratuitos.",
                quantity: 1,
                unit_price: Number(amountReais.toFixed(2)),
                currency_id: "BRL",
              },
            ],
            ...(payerEmail ? { payer: { email: payerEmail } } : {}),
            statement_descriptor: "VIVENCIAS",
            external_reference: `don_${crypto.randomUUID()}`,
            back_urls: {
              success: `${siteUrl}/apoie?status=sucesso`,
              failure: `${siteUrl}/apoie?status=cancelado`,
              pending: `${siteUrl}/apoie?status=pendente`,
            },
            auto_return: "approved",
            notification_url: `${siteUrl}/api/webhooks/mercadopago`,
            metadata: { kind: "donation", description },
          },
        });

        const url = isSandbox ? result.sandbox_init_point || result.init_point : result.init_point;
        return NextResponse.json({ url, provider: "mercadopago", preferenceId: result.id });
      }

      const rawItems: CartItemPayload[] = Array.isArray(body.items)
        ? body.items
        : body.productId
        ? [{ productId: String(body.productId), quantity: 1 }]
        : [];

      const mpItems: {
        id: string;
        title: string;
        description: string;
        quantity: number;
        unit_price: number;
        currency_id: string;
      }[] = [];
      const summaryNames: string[] = [];

      for (const item of rawItems) {
        const product = DEFAULT_PRODUCTS.find((p) => p.id === item.productId);
        if (!product) continue;
        const qty = Math.max(1, Math.min(20, Number(item.quantity || 1)));
        const label = item.variant ? `${product.name} (${item.variant})` : product.name;
        summaryNames.push(`${qty}x ${label}`);
        mpItems.push({
          id: product.id,
          title: label,
          description: product.description,
          quantity: qty,
          unit_price: Number((product.price_cents / 100).toFixed(2)),
          currency_id: "BRL",
        });
      }

      if (mpItems.length === 0) {
        return NextResponse.json({ error: "Carrinho vazio ou produto inválido." }, { status: 400 });
      }

      const result = await preference.create({
        body: {
          items: mpItems,
          ...(payerEmail ? { payer: { email: payerEmail } } : {}),
          statement_descriptor: "VIVENCIAS",
          external_reference: `loja_${crypto.randomUUID()}`,
          back_urls: {
            success: `${siteUrl}/loja?status=sucesso`,
            failure: `${siteUrl}/loja?status=cancelado`,
            pending: `${siteUrl}/loja?status=pendente`,
          },
          auto_return: "approved",
          notification_url: `${siteUrl}/api/webhooks/mercadopago`,
          metadata: {
            kind: "store",
            description: `Lojinha: ${summaryNames.join(", ").slice(0, 200)}`,
          },
        },
      });

      const url = isSandbox ? result.sandbox_init_point || result.init_point : result.init_point;
      return NextResponse.json({ url, provider: "mercadopago", preferenceId: result.id });
    }

    // Stripe fallback
    const stripe = new Stripe(stripeSecret!);

    if (kind === "donation") {
      const amountReais = Math.max(5, Math.min(50000, Number(body.amountReais || 25)));
      const recurring = Boolean(body.recurring);
      const amountCents = Math.round(amountReais * 100);

      const session = await stripe.checkout.sessions.create({
        mode: recurring ? "subscription" : "payment",
        line_items: [
          {
            price_data: {
              currency: "brl",
              product_data: {
                name: recurring
                  ? "Apoio Mensal — Associação Vivências Superdotadas"
                  : "Doação Pontual — Associação Vivências Superdotadas",
                description:
                  "Contribuição transparente para manter infraestrutura, divulgação científica e eventos gratuitos.",
              },
              unit_amount: amountCents,
              ...(recurring ? { recurring: { interval: "month" } } : {}),
            },
            quantity: 1,
          },
        ],
        metadata: {
          kind: "donation",
          description: recurring ? "Doação mensal via Stripe" : "Doação pontual via Stripe",
        },
        success_url: `${siteUrl}/apoie?status=sucesso`,
        cancel_url: `${siteUrl}/apoie?status=cancelado`,
      });

      return NextResponse.json({ url: session.url, provider: "stripe" });
    }

    const rawItems: CartItemPayload[] = Array.isArray(body.items)
      ? body.items
      : body.productId
      ? [{ productId: String(body.productId), quantity: 1 }]
      : [];

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const summaryNames: string[] = [];

    for (const item of rawItems) {
      const product = DEFAULT_PRODUCTS.find((p) => p.id === item.productId);
      if (!product) continue;
      const qty = Math.max(1, Math.min(20, Number(item.quantity || 1)));
      const label = item.variant ? `${product.name} (${item.variant})` : product.name;
      summaryNames.push(`${qty}x ${label}`);
      lineItems.push({
        price_data: {
          currency: "brl",
          product_data: {
            name: label,
            description: product.description,
          },
          unit_amount: product.price_cents,
        },
        quantity: qty,
      });
    }

    if (lineItems.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio ou produto inválido." }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      metadata: {
        kind: "store",
        description: `Lojinha: ${summaryNames.join(", ").slice(0, 200)}`,
      },
      success_url: `${siteUrl}/loja?status=sucesso`,
      cancel_url: `${siteUrl}/loja?status=cancelado`,
    });

    return NextResponse.json({ url: session.url, provider: "stripe" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao iniciar checkout de pagamento." }, { status: 500 });
  }
}
