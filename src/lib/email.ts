import nodemailer from "nodemailer";

interface EmailPayload {
  to: string;
  subject: string;
  heading: string;
  intro: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

function buildVivenciasTemplate({
  heading,
  intro,
  bodyHtml,
  ctaLabel,
  ctaUrl,
}: Omit<EmailPayload, "to" | "subject">): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vivenciassuperdotadas.vercel.app";
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${heading}</title>
</head>
<body style="margin:0;padding:0;background-color:#FAF7F2;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1E2422;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#FAF7F2;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border:1px solid #E5DDD0;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background-color:#0F5C4D;padding:24px 32px;text-align:left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display:inline-block;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#E5A93C;font-weight:700;">Associação Vivências Superdotadas</span>
                    <h1 style="margin:6px 0 0;font-size:22px;line-height:1.3;color:#FAF7F2;font-weight:700;">${heading}</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#C83E37 0%,#D98A2B 50%,#0F5C4D 100%);"></td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#1E2422;">${intro}</p>
              <div style="font-size:15px;line-height:1.7;color:#2E3633;">
                ${bodyHtml}
              </div>
              ${
                ctaLabel && ctaUrl
                  ? `<div style="margin:28px 0 8px;">
                      <a href="${ctaUrl}" style="display:inline-block;background-color:#0F5C4D;color:#FAF7F2;text-decoration:none;font-weight:600;font-size:15px;padding:13px 24px;border-radius:10px;">${ctaLabel}</a>
                    </div>`
                  : ""
              }
            </td>
          </tr>
          <tr>
            <td style="background-color:#F2ECE1;padding:20px 32px;border-top:1px solid #E5DDD0;">
              <p style="margin:0 0 6px;font-size:13px;line-height:1.5;color:#47524E;">
                <strong>Vivências Superdotadas</strong> — Acolhimento, ciência e expressão em primeira pessoa, sem romantização e sem exclusivismo.
              </p>
              <p style="margin:0;font-size:12px;color:#626F6A;">
                <a href="${siteUrl}" style="color:#0F5C4D;text-decoration:underline;">Portal</a> ·
                <a href="https://www.instagram.com/vivenciassuperdotadas/" style="color:#0F5C4D;text-decoration:underline;">Instagram</a> ·
                <a href="https://chat.whatsapp.com/IkD3gldncwsBmvSH1j8N6b" style="color:#0F5C4D;text-decoration:underline;">Comunidade WhatsApp</a>
              </p>
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
