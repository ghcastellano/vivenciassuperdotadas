import { NextResponse } from "next/server";
import Stripe from "stripe";
import { DEFAULT_PRODUCTS } from "@/lib/institutional-data";

interface CartItemPayload {
  productId: string;
  quantity?: number;
  variant?: string;
}

export async function POST(req: Request) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        {
          error:
            "Stripe ainda não configurado neste ambiente (adicione STRIPE_SECRET_KEY no .env.local / Vercel).",
        },
        { status: 503 }
      );
    }

    const stripe = new Stripe(secret);
    const body = await req.json();
    const kind = body.kind === "store" ? "store" : "donation";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vivenciassuperdotadas.vercel.app";

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

      return NextResponse.json({ url: session.url });
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

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao iniciar checkout do Stripe." }, { status: 500 });
  }
}
