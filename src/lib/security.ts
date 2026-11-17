const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && EMAIL_REGEX.test(email);
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Allows only safe http(s) URLs (and optional relative `/...` paths starting with single `/`).
 * Blocks `javascript:`, `data:`, `vbscript:`, protocol-relative `//`, etc.
 */
export function sanitizeHttpUrl(raw: string | null | undefined, allowRelative = false): string {
  const trimmed = String(raw || "").trim();
  if (!trimmed) return "";
  if (allowRelative && trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.toString();
    }
    return "";
  } catch {
    return "";
  }
}
