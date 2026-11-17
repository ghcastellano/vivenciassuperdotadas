import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isDatabaseConfigured, query } from "@/lib/db";

async function resolveUserId(): Promise<string | null> {
  const session = await auth();
  const user = session?.user as { id?: string; email?: string } | undefined;
  if (!user?.email) return null;

  const rows = await query<{ id: string }>("SELECT id FROM users WHERE LOWER(email) = $1 LIMIT 1", [
    user.email.toLowerCase(),
  ]);
  return rows[0]?.id || user.id || null;
}

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }

  const userId = await resolveUserId();
  if (!userId) {
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }

  const notifications = await query<{
    id: string;
    actor_name: string;
    actor_avatar: Record<string, unknown> | null;
    type: string;
    submission_id: string;
    submission_title: string;
    comment_preview: string;
    is_read: boolean;
    created_at: string;
  }>(
    `SELECT id, actor_name, actor_avatar, type, submission_id, submission_title, comment_preview, is_read, created_at::text
     FROM notifications
     WHERE recipient_user_id = $1
     ORDER BY created_at DESC
     LIMIT 30`,
    [userId]
  );

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  return NextResponse.json({ notifications, unreadCount });
}

export async function POST(req: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: true });
  }

  const userId = await resolveUserId();
  if (!userId) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (body.markAll) {
      await query("UPDATE notifications SET is_read = TRUE WHERE recipient_user_id = $1 AND is_read = FALSE", [
        userId,
      ]);
      return NextResponse.json({ ok: true });
    }

    const notificationId = String(body.notificationId || "").trim();
    if (notificationId) {
      await query("UPDATE notifications SET is_read = TRUE WHERE id = $1 AND recipient_user_id = $2", [
        notificationId,
        userId,
      ]);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar notificações." }, { status: 500 });
  }
}
