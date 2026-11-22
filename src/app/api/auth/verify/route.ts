import { NextResponse } from "next/server";
import { isDatabaseConfigured, query } from "@/lib/db";

function renderVerifyHtml(title: string, message: string, ctaHref: string, ctaLabel: string) {
  return new NextResponse(
    `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — Vivências Superdotadas</title>
</head>
<body style="margin:0;padding:32px 16px;background:#EDEFF0;font-family:system-ui,-apple-system,sans-serif;color:#191B1C;">
  <main style="max-width:520px;margin:40px auto;background:#FFFFFF;border:1px solid #CDD8D5;border-radius:16px;overflow:hidden;box-shadow:0 8px 28px rgba(0,0,0,0.06);">
    <div style="background:#18492D;padding:24px 28px;color:#EDEFF0;">
      <p style="margin:0;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#9C9AAF;font-weight:700;">∞ Vivências Superdotadas</p>
      <h1 style="margin:8px 0 0;font-size:20px;">${title}</h1>
    </div>
    <div style="padding:28px;line-height:1.65;">
      <p style="margin:0 0 24px;font-size:15px;color:#383B3D;">${message}</p>
      <a href="${ctaHref}" style="display:inline-block;background:#18492D;color:#FFFFFF;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:8px;">${ctaLabel}</a>
    </div>
  </main>
</body>
</html>`,
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

export async function GET(req: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vivenciassuperdotadas.vercel.app";
  const token = new URL(req.url).searchParams.get("token")?.trim() || "";

  if (!token || !isDatabaseConfigured()) {
    return renderVerifyHtml(
      "Link inválido",
      "Não foi possível validar seu e-mail com este link.",
      `${siteUrl}/entrar`,
      "Ir para login"
    );
  }

  const rows = await query<{ id: string; email: string }>(
    `SELECT id, email FROM users
     WHERE verification_token = $1
       AND (verification_expires IS NULL OR verification_expires > NOW())
       AND account_status = 'active'
     LIMIT 1`,
    [token]
  );

  if (!rows[0]) {
    return renderVerifyHtml(
      "Link inválido ou expirado",
      "Este link de confirmação já foi utilizado ou expirou. Tente entrar ou criar um novo cadastro.",
      `${siteUrl}/entrar`,
      "Voltar para login"
    );
  }

  const { id, email } = rows[0];
  await query(
    `UPDATE users
     SET email_verified = TRUE, verification_token = '', verification_expires = NULL
     WHERE id = $1`,
    [id]
  );

  // Safely link pending membership only after e-mail ownership is verified
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
    [email.toLowerCase()]
  );

  if (membershipRows[0]) {
    const m = membershipRows[0];
    await Promise.all([
      query("UPDATE memberships SET user_id = $1 WHERE LOWER(email) = $2 AND user_id IS NULL", [
        id,
        email.toLowerCase(),
      ]),
      query(
        `UPDATE users
         SET avatar_config = COALESCE(avatar_config, $1::jsonb),
             neurodivergences = CASE WHEN COALESCE(array_length(neurodivergences, 1), 0) = 0 THEN $2 ELSE neurodivergences END,
             manifesto = CASE WHEN COALESCE(manifesto, '') = '' THEN $3 ELSE manifesto END,
             has_medical_report = CASE WHEN COALESCE(has_medical_report, 'nao_informado') = 'nao_informado' THEN $4 ELSE has_medical_report END
         WHERE id = $5`,
        [
          m.avatar_config ? JSON.stringify(m.avatar_config) : null,
          m.neurodivergences || [],
          m.manifesto || "",
          m.has_medical_report || "nao_informado",
          id,
        ]
      ),
    ]);
  }

  return NextResponse.redirect(`${siteUrl}/entrar?verified=1`);
}
