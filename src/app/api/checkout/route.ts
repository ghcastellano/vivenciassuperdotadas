import { NextResponse } from "next/server";
import Stripe from "stripe";
import { DEFAULT_PRODUCTS } from "@/lib/institutional-data";

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
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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

    const productId = String(body.productId || "");
    const product = DEFAULT_PRODUCTS.find((p) => p.id === productId);
    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.price_cents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        kind: "store",
        productId: product.id,
        description: `Lojinha: ${product.name}`,
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
