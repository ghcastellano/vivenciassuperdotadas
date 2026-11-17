import crypto from "crypto";
import nodemailer from "nodemailer";
import { escapeHtml, sanitizeHttpUrl } from "@/lib/security";

interface EmailPayload {
  to: string;
  subject: string;
  heading: string;
  intro: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footerExtraHtml?: string;
}

function getEmailPrefSecret(): string {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "vivencias-email-prefs-fallback";
}

export function signEmailPrefToken(userId: string, type: "like" | "comment"): string {
  const payload = `${userId}:${type}`;
  const sig = crypto.createHmac("sha256", getEmailPrefSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`, "utf8").toString("base64url");
}

export function verifyEmailPrefToken(token: string): { userId: string; type: "like" | "comment" } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return null;
    const [userId, type, sig] = parts;
    if (!userId || (type !== "like" && type !== "comment") || !sig) return null;
    const expected = crypto.createHmac("sha256", getEmailPrefSecret()).update(`${userId}:${type}`).digest("hex");
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    return { userId, type };
  } catch {
    return null;
  }
}

function buildVivenciasTemplate({
  heading,
  intro,
  bodyHtml,
  ctaLabel,
  ctaUrl,
  footerExtraHtml,
}: Omit<EmailPayload, "to" | "subject">): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vivenciassuperdotadas.vercel.app";
  const safeHeading = escapeHtml(heading);
  const safeIntro = escapeHtml(intro);
  const safeCtaLabel = ctaLabel ? escapeHtml(ctaLabel) : "";
  const safeCtaUrl = ctaUrl ? sanitizeHttpUrl(ctaUrl) : "";
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeHeading}</title>
</head>
<body style="margin:0;padding:0;background-color:#EDEFF0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#191B1C;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#EDEFF0;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border:1px solid #CDD8D5;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background-color:#18492D;padding:24px 32px;text-align:left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display:inline-block;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#9C9AAF;font-weight:700;">∞ Associação Vivências Superdotadas</span>
                    <h1 style="margin:6px 0 0;font-size:22px;line-height:1.3;color:#EDEFF0;font-weight:700;">${safeHeading}</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#BD4626 0%,#9C9AAF 50%,#18492D 100%);"></td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#191B1C;">${safeIntro}</p>
              <div style="font-size:15px;line-height:1.7;color:#383B3D;">
                ${bodyHtml}
              </div>
              ${
                safeCtaLabel && safeCtaUrl
                  ? `<div style="margin:28px 0 8px;">
                      <a href="${safeCtaUrl}" style="display:inline-block;background-color:#18492D;color:#FFFFFF;text-decoration:none;font-weight:600;font-size:15px;padding:13px 24px;border-radius:8px;">${safeCtaLabel}</a>
                    </div>`
                  : ""
              }
            </td>
          </tr>
          <tr>
            <td style="background-color:#E2E7E5;padding:20px 32px;border-top:1px solid #CDD8D5;">
              <p style="margin:0 0 6px;font-size:13px;line-height:1.5;color:#383B3D;">
                <strong>Vivências Superdotadas</strong> — Acolhimento, ciência e expressão em primeira pessoa, sem romantização e sem exclusivismo.
              </p>
              <p style="margin:0;font-size:12px;color:#595F61;">
                <a href="${siteUrl}" style="color:#18492D;text-decoration:underline;">Portal</a> ·
                <a href="https://www.instagram.com/vivenciassuperdotadas/" style="color:#18492D;text-decoration:underline;">Instagram</a> ·
                <a href="https://chat.whatsapp.com/IkD3gldncwsBmvSH1j8N6b" style="color:#18492D;text-decoration:underline;">Comunidade WhatsApp</a>
              </p>
              ${footerExtraHtml || ""}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendVivenciasEmail(payload: EmailPayload): Promise<boolean> {
  const html = buildVivenciasTemplate(payload);
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.info(`[Email Preview -> ${payload.to}] ${payload.subject}`);
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Vivências Superdotadas" <${user}>`,
      to: payload.to,
      subject: payload.subject,
      html,
    });
    return true;
  } catch (err) {
    console.error("Failed to send email:", err);
    return false;
  }
}
