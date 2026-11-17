import crypto from "crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { isDatabaseConfigured, query } from "@/lib/db";

interface ActorProfile {
  id: string;
  name: string;
  avatar_config: Record<string, unknown> | null;
}

async function resolveActor(): Promise<{ userId: string; name: string; avatar: Record<string, unknown> | null; role: string } | null> {
  const session = await auth();
  const user = session?.user as { id?: string; email?: string; name?: string; role?: string } | undefined;
  if (!user?.email) return null;

  const emailLower = user.email.toLowerCase();
  const rows = await query<ActorProfile>(
    "SELECT id, name, avatar_config FROM users WHERE LOWER(email) = $1 LIMIT 1",
    [emailLower]
  );

  if (rows[0]) {
    return {
      userId: rows[0].id,
      name: rows[0].name || user.name || emailLower.split("@")[0],
      avatar: rows[0].avatar_config || null,
      role: user.role || "member",
    };
  }

  if (!user.id) return null;
  return {
    userId: user.id,
    name: user.name || emailLower.split("@")[0],
    avatar: null,
    role: user.role || "member",
  };
}

export async function GET(req: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ likes: [], comments: [], likedIds: [], counts: {} });
  }

  const { searchParams } = new URL(req.url);
  const submissionId = searchParams.get("submissionId")?.trim();
  const summary = searchParams.get("summary") === "1";

  if (summary) {
    const session = await auth();
    const emailLower = session?.user?.email?.toLowerCase();
    let userId: string | null = (session?.user as { id?: string } | undefined)?.id || null;
    if (emailLower) {
      const u = await query<{ id: string }>("SELECT id FROM users WHERE LOWER(email) = $1 LIMIT 1", [emailLower]);
      if (u[0]) userId = u[0].id;
    }

    const [likeCounts, commentCounts, myLikes] = await Promise.all([
      query<{ submission_id: string; count: number }>(
        "SELECT submission_id, COUNT(*)::int AS count FROM community_likes GROUP BY submission_id"
      ),
      query<{ submission_id: string; count: number }>(
        "SELECT submission_id, COUNT(*)::int AS count FROM community_comments GROUP BY submission_id"
      ),
      userId
        ? query<{ submission_id: string }>(
            "SELECT submission_id FROM community_likes WHERE user_id = $1",
            [userId]
          )
        : Promise.resolve([]),
    ]);

    const counts: Record<string, { likes: number; comments: number }> = {};
    for (const r of likeCounts) {
      counts[r.submission_id] = { likes: r.count, comments: 0 };
    }
    for (const r of commentCounts) {
      counts[r.submission_id] = {
        likes: counts[r.submission_id]?.likes || 0,
        comments: r.count,
      };
    }

    return NextResponse.json({
      currentUserId: userId,
      likedIds: myLikes.map((l) => l.submission_id),
      counts,
    });
  }

  if (!submissionId) {
    return NextResponse.json({ error: "submissionId obrigatório." }, { status: 400 });
  }

  const [likes, comments] = await Promise.all([
    query<{
      user_id: string;
      user_name: string;
      user_avatar: Record<string, unknown> | null;
      created_at: string;
    }>(
      `SELECT user_id, user_name, user_avatar, created_at::text
       FROM community_likes
       WHERE submission_id = $1
       ORDER BY created_at DESC`,
      [submissionId]
    ),
    query<{
      id: string;
      submission_id: string;
      user_id: string;
      user_name: string;
      user_avatar: Record<string, unknown> | null;
      content: string;
      created_at: string;
      updated_at: string | null;
    }>(
      `SELECT id, submission_id, user_id, user_name, user_avatar, content, created_at::text, updated_at::text
       FROM community_comments
       WHERE submission_id = $1
       ORDER BY created_at ASC`,
      [submissionId]
    ),
  ]);

  return NextResponse.json({ likes, comments });
}

export async function POST(req: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 503 });
  }

  const actor = await resolveActor();
  if (!actor) {
    return NextResponse.json({ error: "Entre na sua conta para curtir ou comentar." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const action = String(body.action || "");

    if (action === "toggle_like") {
      const submissionId = String(body.submissionId || "").trim();
      if (!submissionId) {
        return NextResponse.json({ error: "Publicação inválida." }, { status: 400 });
      }

      const subRows = await query<{ id: string; user_id: string | null; title: string }>(
        "SELECT id, user_id, title FROM community_submissions WHERE id = $1 AND status = 'approved' LIMIT 1",
        [submissionId]
      );
      if (!subRows[0]) {
        return NextResponse.json({ error: "Publicação não encontrada." }, { status: 404 });
      }

      const existing = await query<{ submission_id: string }>(
        "SELECT submission_id FROM community_likes WHERE submission_id = $1 AND user_id = $2 LIMIT 1",
        [submissionId, actor.userId]
      );

      let likedByMe = false;
      if (existing.length > 0) {
        await query("DELETE FROM community_likes WHERE submission_id = $1 AND user_id = $2", [
          submissionId,
          actor.userId,
        ]);
        await query(
          "DELETE FROM notifications WHERE submission_id = $1 AND actor_user_id = $2 AND type = 'like' AND is_read = FALSE",
          [submissionId, actor.userId]
        );
        likedByMe = false;
      } else {
        await query(
          `INSERT INTO community_likes (submission_id, user_id, user_name, user_avatar)
           VALUES ($1, $2, $3, $4::jsonb)
           ON CONFLICT (submission_id, user_id) DO NOTHING`,
          [submissionId, actor.userId, actor.name, JSON.stringify(actor.avatar)]
        );
        likedByMe = true;

        const recipientId = subRows[0].user_id;
        if (recipientId && recipientId !== actor.userId) {
          await query(
            `INSERT INTO notifications (id, recipient_user_id, actor_user_id, actor_name, actor_avatar, type, submission_id, submission_title)
             VALUES ($1, $2, $3, $4, $5::jsonb, 'like', $6, $7)`,
            [
              crypto.randomUUID(),
              recipientId,
              actor.userId,
              actor.name,
              JSON.stringify(actor.avatar),
              submissionId,
              subRows[0].title.slice(0, 120),
            ]
          );
        }
      }

      const likes = await query<{
        user_id: string;
        user_name: string;
        user_avatar: Record<string, unknown> | null;
        created_at: string;
      }>(
        `SELECT user_id, user_name, user_avatar, created_at::text
         FROM community_likes
         WHERE submission_id = $1
         ORDER BY created_at DESC`,
        [submissionId]
      );

      revalidatePath("/comunidade");
      return NextResponse.json({ ok: true, likedByMe, likesCount: likes.length, likes });
    }

    if (action === "add_comment") {
      const submissionId = String(body.submissionId || "").trim();
      const content = String(body.content || "").trim().slice(0, 1000);
      if (!submissionId || !content) {
        return NextResponse.json({ error: "Escreva um comentário antes de enviar." }, { status: 400 });
      }

      const subRows = await query<{ id: string; user_id: string | null; title: string }>(
        "SELECT id, user_id, title FROM community_submissions WHERE id = $1 AND status = 'approved' LIMIT 1",
        [submissionId]
      );
      if (!subRows[0]) {
        return NextResponse.json({ error: "Publicação não encontrada." }, { status: 404 });
      }

      const id = crypto.randomUUID();
      const inserted = await query<{
        id: string;
        submission_id: string;
        user_id: string;
        user_name: string;
        user_avatar: Record<string, unknown> | null;
        content: string;
        created_at: string;
        updated_at: string | null;
      }>(
        `INSERT INTO community_comments (id, submission_id, user_id, user_name, user_avatar, content)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6)
         RETURNING id, submission_id, user_id, user_name, user_avatar, content, created_at::text, updated_at::text`,
        [id, submissionId, actor.userId, actor.name, JSON.stringify(actor.avatar), content]
      );

      const recipientId = subRows[0].user_id;
      if (recipientId && recipientId !== actor.userId) {
        await query(
          `INSERT INTO notifications (id, recipient_user_id, actor_user_id, actor_name, actor_avatar, type, submission_id, submission_title, comment_preview)
           VALUES ($1, $2, $3, $4, $5::jsonb, 'comment', $6, $7, $8)`,
          [
            crypto.randomUUID(),
            recipientId,
            actor.userId,
            actor.name,
            JSON.stringify(actor.avatar),
            submissionId,
            subRows[0].title.slice(0, 120),
            content.slice(0, 140),
          ]
        );
      }

      revalidatePath("/comunidade");
      return NextResponse.json({ ok: true, comment: inserted[0] }, { status: 201 });
    }

    if (action === "edit_comment") {
      const commentId = String(body.commentId || "").trim();
      const content = String(body.content || "").trim().slice(0, 1000);
      if (!commentId || !content) {
        return NextResponse.json({ error: "O comentário não pode ficar vazio." }, { status: 400 });
      }

      const updated = await query<{
        id: string;
        submission_id: string;
        user_id: string;
        user_name: string;
        user_avatar: Record<string, unknown> | null;
        content: string;
        created_at: string;
        updated_at: string | null;
      }>(
        `UPDATE community_comments
         SET content = $1, updated_at = NOW()
         WHERE id = $2 AND user_id = $3
         RETURNING id, submission_id, user_id, user_name, user_avatar, content, created_at::text, updated_at::text`,
        [content, commentId, actor.userId]
      );

      if (!updated[0]) {
        return NextResponse.json({ error: "Comentário não encontrado ou sem permissão." }, { status: 404 });
      }

      return NextResponse.json({ ok: true, comment: updated[0] });
    }

    if (action === "delete_comment") {
      const commentId = String(body.commentId || "").trim();
      if (!commentId) {
        return NextResponse.json({ error: "Comentário inválido." }, { status: 400 });
      }

      const isAdmin = actor.role === "admin";
      const deleted = isAdmin
        ? await query<{ id: string }>("DELETE FROM community_comments WHERE id = $1 RETURNING id", [commentId])
        : await query<{ id: string }>(
            "DELETE FROM community_comments WHERE id = $1 AND user_id = $2 RETURNING id",
            [commentId, actor.userId]
          );

      if (!deleted[0]) {
        return NextResponse.json({ error: "Comentário não encontrado ou sem permissão." }, { status: 404 });
      }

      revalidatePath("/comunidade");
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Não foi possível processar a interação." }, { status: 500 });
  }
}
