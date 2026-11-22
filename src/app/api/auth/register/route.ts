import crypto from "crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query, isDatabaseConfigured } from "@/lib/db";
import { sendVivenciasEmail } from "@/lib/email";
import { isValidEmail } from "@/lib/security";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit("auth_register", ip, 5, 15 * 60 * 1000);
    if (!rl.allowed) return rateLimitResponse(rl.retryAfterSeconds);

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

    const existing = await query<{ id: string }>(
      "SELECT id FROM users WHERE LOWER(email) = $1 LIMIT 1",
      [email]
    );
    if (existing.length > 0) {
      return NextResponse.json({ error: "Este e-mail já possui conta." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();
    const verificationToken = crypto.randomBytes(32).toString("hex");

    await query(
      `INSERT INTO users (id, name, email, password_hash, role, email_verified, verification_token, verification_expires, account_status)
       VALUES ($1, $2, $3, $4, 'member', FALSE, $5, NOW() + INTERVAL '24 hours', 'active')`,
      [id, name, email, passwordHash, verificationToken]
    );

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vivenciassuperdotadas.vercel.app";
    const verifyUrl = `${siteUrl}/api/auth/verify?token=${encodeURIComponent(verificationToken)}`;

    await sendVivenciasEmail({
      to: email,
      subject: "Confirme seu e-mail — Vivências Superdotadas",
      heading: `Confirme seu acesso, ${name}`,
      intro: "Recebemos seu cadastro na Associação Vivências Superdotadas. Para proteger sua conta, confirme que este endereço de e-mail pertence a você.",
      bodyHtml: `
        <p>Clique no botão abaixo para validar seu e-mail e ativar seu acesso completo ao portal (o link expira em 24 horas).</p>
        <p style="font-size:13px;color:#595F61;">Se você não solicitou este cadastro, basta ignorar esta mensagem.</p>
      `,
      ctaLabel: "Confirmar meu e-mail",
      ctaUrl: verifyUrl,
    });

    return NextResponse.json(
      {
        ok: true,
        id,
        requiresVerification: true,
        message: "Conta criada! Enviamos um link de confirmação para o seu e-mail.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao criar conta." }, { status: 500 });
  }
}
