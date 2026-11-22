import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { isDatabaseConfigured, query } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  const emailLower = session?.user?.email?.toLowerCase() || "";
  if (!emailLower) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 503 });
  }

  try {
    const body = await req.json();
    const confirmText = String(body.confirmText || "").trim().toUpperCase();
    const mode = body.mode === "anonymize" ? "anonymize" : "deactivate";

    if (confirmText !== "EXCLUIR") {
      return NextResponse.json(
        { error: "Digite EXCLUIR para confirmar o encerramento da conta." },
        { status: 400 }
      );
    }

    const userRows = await query<{ id: string }>(
      "SELECT id FROM users WHERE LOWER(email) = $1 LIMIT 1",
      [emailLower]
    );
    const userId = userRows[0]?.id;

    if (mode === "anonymize") {
      const anonEmail = `deleted-${userId || Date.now()}@anon.vivencias.local`;
      if (userId) {
        await Promise.all([
          query(
            `UPDATE users
             SET name = 'Conta Encerrada',
                 email = $1,
                 password_hash = NULL,
                 avatar_config = NULL,
                 neurodivergences = '{}',
                 manifesto = '',
                 has_medical_report = 'nao_informado',
                 notify_email_likes = FALSE,
                 notify_email_comments = FALSE,
                 account_status = 'deleted',
                 deleted_at = NOW()
             WHERE id = $2`,
            [anonEmail, userId]
          ),
          query(
            `UPDATE memberships
             SET name = 'Conta Encerrada',
                 email = $1,
                 city_state = '',
                 manifesto = '',
                 has_medical_report = 'nao_informado',
                 avatar_config = '{}'::jsonb,
                 show_in_directory = FALSE,
                 membership_status = 'deleted'
             WHERE user_id = $2 OR LOWER(email) = $3`,
            [anonEmail, userId, emailLower]
          ),
          query(
            `UPDATE community_submissions
             SET author_name = 'Ex-associado(a)',
                 author_avatar = NULL
             WHERE user_id = $1`,
            [userId]
          ),
          query(
            `UPDATE community_comments
             SET user_name = 'Ex-associado(a)',
                 user_avatar = NULL
             WHERE user_id = $1`,
            [userId]
          ),
          query("DELETE FROM community_likes WHERE user_id = $1", [userId]),
          query("DELETE FROM notifications WHERE recipient_user_id = $1 OR actor_user_id = $1", [userId]),
        ]);
      } else {
        await query(
          `UPDATE memberships
           SET name = 'Conta Encerrada',
               email = $1,
               city_state = '',
               manifesto = '',
               has_medical_report = 'nao_informado',
               avatar_config = '{}'::jsonb,
               show_in_directory = FALSE,
               membership_status = 'deleted'
           WHERE LOWER(email) = $2`,
          [anonEmail, emailLower]
        );
      }
    } else {
      if (userId) {
        await query(
          "UPDATE users SET account_status = 'deleted', deleted_at = NOW() WHERE id = $1",
          [userId]
        );
      }
      await query(
        `UPDATE memberships
         SET show_in_directory = FALSE, membership_status = 'deleted'
         WHERE LOWER(email) = $1 OR ($2::text IS NOT NULL AND user_id = $2)`,
        [emailLower, userId || null]
      );
    }

    revalidatePath("/comunidade");
    return NextResponse.json({ ok: true, mode });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Não foi possível encerrar a conta." }, { status: 500 });
  }
}
