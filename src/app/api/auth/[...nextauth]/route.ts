import { handlers } from "@/lib/auth";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

export const GET = handlers.GET;

export async function POST(req: Request) {
  const url = new URL(req.url);
  if (url.pathname.includes("/callback/credentials")) {
    const ip = getClientIp(req);
    const rl = checkRateLimit("auth_login", ip, 15, 5 * 60 * 1000);
    if (!rl.allowed) return rateLimitResponse(rl.retryAfterSeconds);
  }
  return handlers.POST(req as never);
}
