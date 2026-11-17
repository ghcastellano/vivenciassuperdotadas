import crypto from "crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { query, isDatabaseConfigured } from "@/lib/db";
import { sendVivenciasEmail } from "@/lib/email";
import { escapeHtml, isValidEmail, sanitizeHttpUrl } from "@/lib/security";

const MASTER_ADMIN_EMAIL = "ghcastellano@gmail.com";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const emailLower = session.user.email.toLowerCase();
  const envAdmins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (emailLower === MASTER_ADMIN_EMAIL || envAdmins.includes(emailLower)) {
    return session;
  }

  // Revalidate admin role against PostgreSQL so revocations take effect immediately
  if (isDatabaseConfigured()) {
    const rows = await query<{ role: string }>(
      "SELECT role FROM users WHERE LOWER(email) = $1 LIMIT 1",
      [emailLower]
    );
    if (rows[0]?.role === "admin") {
      return session;
    }
  }
  return null;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Acesso restrito a administradores." }, { status: 403 });
  }
  const readOnly = false;
  if (!isDatabaseConfigured()) {
    return NextResponse.json({
      readOnly,
      professionals: [],
      submissions: [],
      events: [],
      expenses: [],
      users: [],
      memberships: [],
      membersCount: 0,
    });
  }

  const [professionals, submissions, events, expenses, users, memberships] = await Promise.all([
    query("SELECT * FROM partner_professionals ORDER BY created_at DESC"),
    query("SELECT * FROM community_submissions ORDER BY created_at DESC"),
    query("SELECT * FROM events ORDER BY event_date ASC"),
    query("SELECT * FROM financial_expenses ORDER BY reference_date DESC, created_at DESC"),
    query("SELECT id, name, email, role, created_at FROM users ORDER BY CASE WHEN role = 'admin' THEN 0 ELSE 1 END, created_at DESC"),
    query(
      `SELECT id, name, email, profile, city_state, has_medical_report, manifesto, membership_status, member_number, accepted_at, created_at
       FROM memberships
       ORDER BY CASE WHEN membership_status = 'pending' THEN 0 WHEN membership_status = 'active' THEN 1 ELSE 2 END, created_at DESC`
    ),
  ]);

  return NextResponse.json({
    readOnly,
    professionals,
    submissions,
    events,
    expenses,
    users,
    memberships,
    membersCount: memberships.filter((m: Record<string, unknown>) => m.membership_status === "active").length,
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
    revalidatePath("/profissionais");
    return NextResponse.json({ ok: true });
  }

  if (action === "moderate_submission") {
    const id = String(body.id || "");
    const status = body.status === "approved" ? "approved" : "rejected";
    await query("UPDATE community_submissions SET status = $1 WHERE id = $2", [status, id]);
    revalidatePath("/comunidade");
    return NextResponse.json({ ok: true });
  }

  if (action === "create_event") {
    const title = String(body.title || "").trim().slice(0, 160);
    const description = String(body.description || "").trim().slice(0, 2000);
    const eventDate = String(body.eventDate || "");
    const format = String(body.format || "Online").slice(0, 80);
    const imageUrl = sanitizeHttpUrl(body.imageUrl, true);
    const eventLink = sanitizeHttpUrl(body.eventLink);

    if (!title || !description || !eventDate || !eventLink) {
      return NextResponse.json({ error: "Preencha título, descrição, data e link válido (https://) do evento." }, { status: 400 });
    }

    await query(
      `INSERT INTO events (id, title, description, event_date, format, image_url, event_link, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)`,
      [crypto.randomUUID(), title, description, eventDate, format, imageUrl, eventLink]
    );
    revalidatePath("/eventos");
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  if (action === "delete_event") {
    await query("DELETE FROM events WHERE id = $1", [String(body.id || "")]);
    revalidatePath("/eventos");
    return NextResponse.json({ ok: true });
  }

  if (action === "create_expense") {
    const category = String(body.category || "infraestrutura").slice(0, 60);
    const description = String(body.description || "").trim().slice(0, 300);
    const amountReais = Number(body.amountReais);
    const amountCents = Number.isFinite(amountReais) ? Math.round(amountReais * 100) : 0;
    const referenceDate = String(body.referenceDate || new Date().toISOString().slice(0, 10)).slice(0, 20);

    if (!description || !Number.isFinite(amountCents) || amountCents <= 0) {
      return NextResponse.json({ error: "Descrição e valor positivo válido são obrigatórios." }, { status: 400 });
    }

    await query(
      `INSERT INTO financial_expenses (id, category, description, amount_cents, reference_date)
       VALUES ($1, $2, $3, $4, $5)`,
      [crypto.randomUUID(), category, description, amountCents, referenceDate]
    );
    revalidatePath("/apoie");
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  if (action === "delete_expense") {
    await query("DELETE FROM financial_expenses WHERE id = $1", [String(body.id || "")]);
    revalidatePath("/apoie");
    return NextResponse.json({ ok: true });
  }

  if (action === "set_user_role") {
    const email = String(body.email || "").trim().toLowerCase();
    const role = body.role === "admin" ? "admin" : "member";
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
    }
    if (email === MASTER_ADMIN_EMAIL && role !== "admin") {
      return NextResponse.json({ error: "O Admin Master não pode ser removido." }, { status: 400 });
    }

    const existing = await query<{ id: string }>("SELECT id FROM users WHERE LOWER(email) = $1 LIMIT 1", [email]);
    if (existing.length > 0) {
      await query("UPDATE users SET role = $1 WHERE id = $2", [role, existing[0].id]);
    } else {
      await query(
        "INSERT INTO users (id, name, email, role) VALUES ($1, $2, $3, $4)",
        [crypto.randomUUID(), email.split("@")[0], email, role]
      );
    }
    return NextResponse.json({ ok: true });
  }

  if (action === "moderate_membership") {
    const id = String(body.id || "");
    const status =
      body.status === "active"
        ? "active"
        : body.status === "suspended"
        ? "suspended"
        : "rejected";
    const approver = session.user?.email || "admin";

    const existing = await query<{ name: string; email: string; member_number: string }>(
      "SELECT name, email, member_number FROM memberships WHERE id = $1 LIMIT 1",
      [id]
    );
    if (!existing[0]) {
      return NextResponse.json({ error: "Solicitação de associação não encontrada." }, { status: 404 });
    }

    const memberNumber =
      status === "active"
        ? existing[0].member_number ||
          `VS-${new Date().getFullYear()}-${crypto.randomInt(1000, 10000)}`
        : existing[0].member_number || "";

    await query(
      `UPDATE memberships
       SET membership_status = $1,
           member_number = $2,
           approved_at = CASE WHEN $1 = 'active' THEN COALESCE(approved_at, NOW()) ELSE approved_at END,
           approved_by = CASE WHEN $1 = 'active' THEN $3 ELSE approved_by END
       WHERE id = $4`,
      [status, memberNumber, approver, id]
    );

    if (status === "active" && existing[0].email) {
      await sendVivenciasEmail({
        to: existing[0].email,
        subject: `Associação aprovada (${memberNumber}) — Vivências Superdotadas`,
        heading: `Boas-vindas oficiais, ${existing[0].name}!`,
        intro: `Sua associação foi aprovada pela diretoria. Sua matrícula é ${memberNumber}.`,
        bodyHtml: `<p>Você já pode publicar relatos, artes e links na Comunidade, exibir seu Avatar Único no Mural da Singularidade e acessar o grupo oficial de convivência.</p>`,
        ctaLabel: "Entrar no grupo do WhatsApp",
        ctaUrl: "https://chat.whatsapp.com/IkD3gldncwsBmvSH1j8N6b",
      });
    }

    revalidatePath("/comunidade");
    revalidatePath("/perfil");
    return NextResponse.json({ ok: true, memberNumber });
  }

  return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
}
