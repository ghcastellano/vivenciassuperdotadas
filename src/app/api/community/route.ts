import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query, isDatabaseConfigured } from "@/lib/db";
import { sendVivenciasEmail } from "@/lib/email";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ submissions: [] });
  }
  try {
    const rows = await query(
      `SELECT id, author_name, author_avatar, author_neurodivergences, kind, title, content, external_url, image_url, credits, created_at
       FROM community_submissions
       WHERE status = 'approved'
       ORDER BY created_at DESC`
    );
    return NextResponse.json({ submissions: rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ submissions: [] });
  }
}

export async function POST(req: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Banco de dados ainda não configurado." }, { status: 503 });
    }

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Entre com sua conta (Google ou e-mail) para enviar contribuições à comunidade." },
        { status: 401 }
      );
    }

    const userRole = (session.user as { role?: string; membershipStatus?: string }).role;
    const membershipStatus = (session.user as { membershipStatus?: string }).membershipStatus;
    if (userRole !== "admin" && membershipStatus !== "active") {
      return NextResponse.json(
        {
          error:
            membershipStatus === "pending"
              ? "Sua solicitação de associação está em análise pela diretoria. Assim que for aprovada, você poderá publicar na comunidade."
              : "Apenas associados ativos podem publicar na comunidade. Conclua o processo formal de associação em /associe-se.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const kind = String(body.kind || "relato").trim();
    const title = String(body.title || "").trim();
    const content = String(body.content || "").trim();
    const externalUrl = String(body.externalUrl || "").trim();
    const imageUrl = String(body.imageUrl || "").trim();
    const credits = String(body.credits || "").trim();

    if (!title || !content) {
      return NextResponse.json({ error: "Título e descrição/texto são obrigatórios." }, { status: 400 });
    }

    const userEmail = session.user.email.toLowerCase();
    const userRows = await query<{
      id: string;
      name: string;
      avatar_config: unknown;
      neurodivergences: string[];
    }>("SELECT id, name, avatar_config, neurodivergences FROM users WHERE LOWER(email) = $1 LIMIT 1", [
      userEmail,
    ]);
    const dbUser = userRows[0];

    const id = crypto.randomUUID();
    await query(
      `INSERT INTO community_submissions
       (id, user_id, author_name, author_avatar, author_neurodivergences, kind, title, content, external_url, image_url, credits, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending')`,
      [
        id,
        dbUser?.id || null,
        dbUser?.name || session.user.name || "Membro Vivências",
        dbUser?.avatar_config ? JSON.stringify(dbUser.avatar_config) : null,
        dbUser?.neurodivergences || ["ahsd"],
        kind,
        title,
        content,
        externalUrl,
        imageUrl,
        credits,
      ]
    );

    await sendVivenciasEmail({
      to: userEmail,
      subject: "Contribuição recebida — Vivências Superdotadas",
      heading: "Recebemos sua criação!",
      intro: `Olá, ${session.user.name || "membro"}. Sua submissão "${title}" foi recebida e entrou na fila de moderação.`,
      bodyHtml: `<p>Assim que os administradores revisarem o conteúdo e os créditos, ela será publicada na área da Comunidade com seu Avatar Único.</p>`,
    });

    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao enviar contribuição." }, { status: 500 });
  }
}
