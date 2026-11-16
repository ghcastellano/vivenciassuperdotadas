import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query, isDatabaseConfigured } from "@/lib/db";
import { sendVivenciasEmail } from "@/lib/email";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "admin") {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Acesso restrito a administradores." }, { status: 403 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({
      professionals: [],
      submissions: [],
      events: [],
      expenses: [],
      membersCount: 0,
    });
  }

  const [professionals, submissions, events, expenses, members] = await Promise.all([
    query("SELECT * FROM partner_professionals ORDER BY created_at DESC"),
    query("SELECT * FROM community_submissions ORDER BY created_at DESC"),
    query("SELECT * FROM events ORDER BY event_date ASC"),
    query("SELECT * FROM financial_expenses ORDER BY reference_date DESC, created_at DESC"),
    query<{ count: string }>("SELECT COUNT(*) AS count FROM memberships"),
  ]);

  return NextResponse.json({
    professionals,
    submissions,
    events,
    expenses,
    membersCount: Number(members[0]?.count || 0),
  });
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Acesso restrito a administradores." }, { status: 403 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "DATABASE_URL ausente." }, { status: 503 });
  }

  const body = await req.json();
  const action = String(body.action || "");

  if (action === "moderate_professional") {
    const id = String(body.id || "");
    const status = body.status === "approved" ? "approved" : "rejected";
    const rows = await query<{ name: string; email: string }>(
      "UPDATE partner_professionals SET status = $1 WHERE id = $2 RETURNING name, email",
      [status, id]
    );
    if (rows[0] && status === "approved") {
      await sendVivenciasEmail({
        to: rows[0].email,
        subject: "Seu perfil de Profissional Parceiro foi aprovado!",
        heading: "Boas-vindas à rede de parceiros",
        intro: `Olá, ${rows[0].name}. Seu cadastro foi aprovado pela equipe do Vivências Superdotadas.`,
        bodyHtml: `<p>Seu perfil já está publicado no diretório oficial de Profissionais Parceiros para que a comunidade possa encontrá-lo(a).</p>`,
        ctaLabel: "Ver Diretório",
        ctaUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://vivenciassuperdotadas.vercel.app"}/profissionais`,
      });
    }
    return NextResponse.json({ ok: true });
  }

  if (action === "moderate_submission") {
    const id = String(body.id || "");
    const status = body.status === "approved" ? "approved" : "rejected";
    await query("UPDATE community_submissions SET status = $1 WHERE id = $2", [status, id]);
    return NextResponse.json({ ok: true });
  }

  if (action === "create_event") {
    const title = String(body.title || "").trim();
    const description = String(body.description || "").trim();
    const eventDate = String(body.eventDate || "");
    const format = String(body.format || "Online");
    const imageUrl = String(body.imageUrl || "").trim();
    const eventLink = String(body.eventLink || "").trim();

    if (!title || !description || !eventDate || !eventLink) {
      return NextResponse.json({ error: "Preencha título, descrição, data e link do evento." }, { status: 400 });
    }

    await query(
      `INSERT INTO events (id, title, description, event_date, format, image_url, event_link, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)`,
      [crypto.randomUUID(), title, description, eventDate, format, imageUrl, eventLink]
    );
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  if (action === "delete_event") {
    await query("DELETE FROM events WHERE id = $1", [String(body.id || "")]);
    return NextResponse.json({ ok: true });
  }

  if (action === "create_expense") {
    const category = String(body.category || "infraestrutura");
    const description = String(body.description || "").trim();
    const amountCents = Math.round(Number(body.amountReais || 0) * 100);
    const referenceDate = String(body.referenceDate || new Date().toISOString().slice(0, 10));

    if (!description || amountCents <= 0) {
      return NextResponse.json({ error: "Descrição e valor positivo são obrigatórios." }, { status: 400 });
    }

    await query(
      `INSERT INTO financial_expenses (id, category, description, amount_cents, reference_date)
       VALUES ($1, $2, $3, $4, $5)`,
      [crypto.randomUUID(), category, description, amountCents, referenceDate]
    );
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  if (action === "delete_expense") {
    await query("DELETE FROM financial_expenses WHERE id = $1", [String(body.id || "")]);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
}
