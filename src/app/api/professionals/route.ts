import { NextResponse } from "next/server";
import { query, isDatabaseConfigured } from "@/lib/db";
import { sendVivenciasEmail } from "@/lib/email";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ professionals: [] });
  }
  try {
    const rows = await query(
      `SELECT id, name, registry_code, specialty, approach, city_state, online_available, bio, contact_url, created_at
       FROM partner_professionals
       WHERE status = 'approved'
       ORDER BY created_at DESC`
    );
    return NextResponse.json({ professionals: rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ professionals: [] });
  }
}

export async function POST(req: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: "Banco de dados ainda não configurado." },
        { status: 503 }
      );
    }
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const registryCode = String(body.registryCode || "").trim();
    const specialty = String(body.specialty || "").trim();
    const approach = String(body.approach || "").trim();
    const cityState = String(body.cityState || "").trim();
    const onlineAvailable = Boolean(body.onlineAvailable ?? true);
    const bio = String(body.bio || "").trim();
    const contactUrl = String(body.contactUrl || "").trim();

    if (!name || !email || !registryCode || !specialty || !approach || !bio) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatórios (nome, e-mail, registro CRP/conselho, especialidade, abordagem e bio)." },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    await query(
      `INSERT INTO partner_professionals (id, name, email, registry_code, specialty, approach, city_state, online_available, bio, contact_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending')`,
      [id, name, email, registryCode, specialty, approach, cityState, onlineAvailable, bio, contactUrl]
    );

    await sendVivenciasEmail({
      to: email,
      subject: "Recebemos seu cadastro de Profissional Parceiro",
      heading: "Cadastro em análise",
      intro: `Olá, ${name}. Recebemos sua submissão para integrar o diretório de Profissionais Parceiros do Vivências Superdotadas.`,
      bodyHtml: `
        <p>Nossa equipe administrativa verificará seu registro profissional (<strong>${registryCode}</strong>) e alinhamento com práticas baseadas em evidências.</p>
        <p>Assim que aprovado, seu perfil ficará visível no portal e você receberá um novo e-mail de confirmação.</p>
      `,
    });

    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao enviar cadastro profissional." }, { status: 500 });
  }
}
