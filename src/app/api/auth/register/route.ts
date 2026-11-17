import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query, isDatabaseConfigured } from "@/lib/db";
import { sendVivenciasEmail } from "@/lib/email";
import { isValidEmail } from "@/lib/security";

export async function POST(req: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: "Banco de dados ainda não configurado (DATABASE_URL ausente)." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const name = String(body.name || "").trim().slice(0, 120);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!name || !email || !isValidEmail(email) || password.length < 6 || password.length > 72) {
      return NextResponse.json(
        { error: "Informe nome, e-mail válido e senha entre 6 e 72 caracteres." },
        { status: 400 }
      );
    }

    const existing = await query("SELECT id FROM users WHERE LOWER(email) = $1 LIMIT 1", [email]);
    if (existing.length > 0) {
      return NextResponse.json({ error: "Este e-mail já possui conta." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();
    const membershipRows = await query<{
      avatar_config: unknown;
      neurodivergences: string[];
      manifesto: string;
      has_medical_report: string;
    }>(
      `SELECT avatar_config, neurodivergences, manifesto, has_medical_report
       FROM memberships
       WHERE LOWER(email) = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [email]
    );
    const m = membershipRows[0];

    await query(
      `INSERT INTO users (id, name, email, password_hash, role, avatar_config, neurodivergences, manifesto, has_medical_report)
       VALUES ($1, $2, $3, $4, 'member', $5, $6, $7, $8)`,
      [
        id,
        name,
        email,
        passwordHash,
        m?.avatar_config ? JSON.stringify(m.avatar_config) : null,
        m?.neurodivergences || [],
        m?.manifesto || "",
        m?.has_medical_report || "nao_informado",
      ]
    );

    if (m) {
      await query("UPDATE memberships SET user_id = $1 WHERE LOWER(email) = $2 AND user_id IS NULL", [id, email]);
    }

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
