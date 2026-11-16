import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query, isDatabaseConfigured } from "@/lib/db";
import { sendVivenciasEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: "Banco de dados ainda não configurado (DATABASE_URL ausente)." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!name || !email || password.length < 6) {
      return NextResponse.json(
        { error: "Informe nome, e-mail válido e senha com pelo menos 6 caracteres." },
        { status: 400 }
      );
    }

    const existing = await query("SELECT id FROM users WHERE LOWER(email) = $1 LIMIT 1", [email]);
    if (existing.length > 0) {
      return NextResponse.json({ error: "Este e-mail já possui conta." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();
    await query(
      "INSERT INTO users (id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, 'member')",
      [id, name, email, passwordHash]
    );

    await sendVivenciasEmail({
      to: email,
      subject: "Boas-vindas ao Vivências Superdotadas",
      heading: `Olá, ${name}!`,
      intro: "Sua conta na Associação Vivências Superdotadas foi criada com sucesso.",
      bodyHtml: `
        <p>Agora você pode enviar artes, criações, links de conhecimento e relatos em primeira pessoa na nossa área da comunidade, além de personalizar seu avatar único.</p>
        <p>Lembramos que todas as publicações passam por moderação para manter nosso espaço acolhedor, ético e seguro.</p>
      `,
      ctaLabel: "Acessar a Comunidade",
      ctaUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://vivenciassuperdotadas.vercel.app"}/comunidade`,
    });

    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao criar conta." }, { status: 500 });
  }
}
