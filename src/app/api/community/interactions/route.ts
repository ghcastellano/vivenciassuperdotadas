import crypto from "crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { isDatabaseConfigured, query } from "@/lib/db";
import { sendVivenciasEmail, signEmailPrefToken } from "@/lib/email";
import { escapeHtml } from "@/lib/security";

interface ActorProfile {
  id: string;
  name: string;
  avatar_config: Record<string, unknown> | null;
}

async function notifyRecipientByEmail(params: {
  recipientUserId: string;
  actorName: string;
  type: "like" | "comment";
  submissionId: string;
  submissionTitle: string;
  commentPreview?: string;
}) {
  try {
    const rows = await query<{
      email: string;
      name: string;
      notify_email_likes: boolean;
      notify_email_comments: boolean;
    }>(
      "SELECT email, name, notify_email_likes, notify_email_comments FROM users WHERE id = $1 LIMIT 1",
      [params.recipientUserId]
    );
    const recipient = rows[0];
    if (!recipient?.email) return;

    if (params.type === "like" && recipient.notify_email_likes === false) return;
    if (params.type === "comment" && recipient.notify_email_comments === false) return;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vivenciassuperdotadas.vercel.app";
    const postUrl = `${siteUrl}/comunidade?post=${encodeURIComponent(params.submissionId)}`;
    const token = signEmailPrefToken(params.recipientUserId, params.type);
    const unsubscribeUrl = `${siteUrl}/api/notifications/preferences?token=${encodeURIComponent(token)}`;
    const firstName = (recipient.name || "").split(" ")[0] || "Pessoa associada";

    const footerExtraHtml = `
      <p style="margin:12px 0 0;padding-top:10px;border-top:1px solid #CDD8D5;font-size:11px;color:#595F61;">
        Prefere acompanhar apenas pelo sininho no portal?
        <a href="${unsubscribeUrl}" style="color:#BD4626;text-decoration:underline;font-weight:600;">
          Desabilitar avisos por e-mail sobre ${params.type === "like" ? "curtidas" : "comentários"}
        </a>.
      </p>`;

    if (params.type === "like") {
      await sendVivenciasEmail({
        to: recipient.email,
        subject: `Ressonância na comunidade: ${params.actorName} curtiu sua publicação`,
        heading: `Sua ideia encontrou eco, ${firstName}`,
        intro: `Mentes atípicas costumam reconhecer quando algo é dito com profundidade e verdade. ${params.actorName} acabou de curtir sua publicação na Comunidade.`,
        bodyHtml: `
          <div style="border-left:3px solid #BD4626;background:#EDEFF0;padding:14px 18px;border-radius:0 10px 10px 0;margin:16px 0;">
            <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#595F61;font-weight:700;">Publicação curtida</p>
            <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#191B1C;">“${escapeHtml(params.submissionTitle)}”</p>
          </div>
          <p style="margin:0;">Pequenos sinais de reconhecimento sustentam diálogos que raramente cabem em espaços superficiais.</p>
        `,
        ctaLabel: "Ver curtida na Comunidade",
        ctaUrl: postUrl,
        footerExtraHtml,
      });
    } else {
      await sendVivenciasEmail({
        to: recipient.email,
        subject: `Novo diálogo aberto: ${params.actorName} comentou na sua publicação`,
        heading: `Alguém puxou conversa com você, ${firstName}`,
        intro: `${params.actorName} deixou um comentário reflexivo na sua publicação “${params.submissionTitle}”.`,
        bodyHtml: `
          <div style="border-left:3px solid #18492D;background:#EDEFF0;padding:14px 18px;border-radius:0 10px 10px 0;margin:16px 0;">
            <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#18492D;font-weight:700;">${escapeHtml(params.actorName)} escreveu:</p>
            <p style="margin:6px 0 0;font-size:15px;font-style:italic;color:#191B1C;">“${escapeHtml(params.commentPreview || "")}”</p>
          </div>
          <p style="margin:0;">Quando quiser, responda diretamente no cartão da comunidade — sem recarregar a página.</p>
        `,
        ctaLabel: "Responder na Comunidade",
        ctaUrl: postUrl,
        footerExtraHtml,
      });
    }
  } catch (err) {
    console.error("[notifyRecipientByEmail]", err);
  }
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
          void notifyRecipientByEmail({
            recipientUserId: recipientId,
            actorName: actor.name,
            type: "like",
            submissionId,
            submissionTitle: subRows[0].title,
          });
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
        void notifyRecipientByEmail({
          recipientUserId: recipientId,
          actorName: actor.name,
          type: "comment",
          submissionId,
          submissionTitle: subRows[0].title,
          commentPreview: content.slice(0, 220),
        });
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
