import { NextResponse } from "next/server";
import { isDatabaseConfigured, query } from "@/lib/db";
import { verifyEmailPrefToken } from "@/lib/email";

function htmlPage(title: string, message: string, submessage: string, siteUrl: string) {
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
      <p style="margin:0 0 12px;font-size:16px;font-weight:600;">${message}</p>
      <p style="margin:0 0 24px;font-size:14px;color:#383B3D;">${submessage}</p>
      <a href="${siteUrl}/comunidade" style="display:inline-block;background:#18492D;color:#FFFFFF;text-decoration:none;font-weight:600;font-size:14px;padding:11px 20px;border-radius:8px;">Voltar para a Comunidade</a>
    </div>
  </main>
</body>
</html>`,
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

export async function GET(req: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vivenciassuperdotadas.vercel.app";
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") || "";
  const parsed = verifyEmailPrefToken(token);

  if (!parsed) {
    return htmlPage(
      "Link inválido ou expirado",
      "Não foi possível confirmar sua preferência por este link.",
      "Você pode acessar o portal normalmente para acompanhar suas notificações no sininho do topo.",
      siteUrl
    );
  }

  if (isDatabaseConfigured()) {
    const column = parsed.type === "like" ? "notify_email_likes" : "notify_email_comments";
    await query(`UPDATE users SET ${column} = FALSE WHERE id = $1`, [parsed.userId]);
  }

  const label = parsed.type === "like" ? "curtidas" : "comentários";
  return htmlPage(
    "Preferência atualizada",
    `Avisos por e-mail sobre ${label} foram desativados.`,
    "Fique tranquilo(a): o sininho de notificações no topo do portal continuará registrando todas as suas interações em tempo real.",
    siteUrl
  );
}
