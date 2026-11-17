import crypto from "crypto";
import { MercadoPagoConfig } from "mercadopago";

export function getMercadoPagoClient(accessToken?: string): MercadoPagoConfig | null {
  const token = accessToken || process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) return null;
  return new MercadoPagoConfig({ accessToken: token, options: { timeout: 5000 } });
}

/**
 * Verifies Mercado Pago `x-signature` HMAC-SHA256 header against `x-request-id` and `data.id`.
 * Manifest format per official docs: `id:[data.id_lowercase];request-id:[x-request-id];ts:[ts];`
 */
export function verifyMercadoPagoSignature(
  signatureHeader: string | null,
  requestId: string | null,
  dataId: string | null,
  secret: string
): boolean {
  if (!signatureHeader || !requestId || !dataId || !secret) return false;
  const parts: Record<string, string> = {};
  for (const part of signatureHeader.split(",")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k && v) parts[k] = v;
  }
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  // Enforce 5-minute replay window (Mercado Pago `ts` may be seconds or milliseconds)
  const tsNum = Number(ts);
  if (!Number.isFinite(tsNum)) return false;
  const tsMs = tsNum > 1e12 ? tsNum : tsNum * 1000;
  if (Math.abs(Date.now() - tsMs) > 5 * 60 * 1000) {
    return false;
  }

  const manifest = `id:${String(dataId).toLowerCase()};request-id:${requestId};ts:${ts};`;
  const computed = crypto.createHmac("sha256", secret).update(manifest).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(v1, "hex"));
  } catch {
    return false;
  }
}
