import { NextResponse } from "next/server";
import { query, isDatabaseConfigured } from "@/lib/db";
import { sendVivenciasEmail } from "@/lib/email";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ professionals: [] });
  }
  try {
    const rows = await query(
      `SELECT id, name, email, registry_code, specialty, approach, region, state, city, city_state, online_available, whatsapp, social_url, other_qualifications, service_type, bio, contact_url, created_at
       FROM partner_professionals
       WHERE status = 'approved'
       ORDER BY name ASC`
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
    const region = String(body.region || "").trim();
    const state = String(body.state || "").trim();
    const city = String(body.city || "").trim();
    const cityState = [city, state].filter(Boolean).join(" - ") || String(body.cityState || "").trim();
    const onlineAvailable = Boolean(body.onlineAvailable ?? true);
    const whatsapp = String(body.whatsapp || "").trim();
    const socialUrl = String(body.socialUrl || "").trim();
    const otherQualifications = String(body.otherQualifications || "").trim();
    const serviceType = String(body.serviceType || "ambos").trim();
    const bio = String(body.bio || otherQualifications || "").trim();
    const contactUrl = socialUrl || String(body.contactUrl || "").trim();
    const acceptedDataPolicy = Boolean(body.acceptedDataPolicy);

    if (!name || !specialty || !region || !state) {
      return NextResponse.json(
        { error: "Preencha os campos obrigatórios: nome, especialização, região e estado." },
        { status: 400 }
      );
    }

    if (!acceptedDataPolicy) {
      return NextResponse.json(
        { error: "É necessário concordar com a Política de Tratamento de Dados para enviar o cadastro." },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    await query(
      `INSERT INTO partner_professionals
       (id, name, email, registry_code, specialty, approach, region, state, city, city_state, online_available, whatsapp, social_url, other_qualifications, service_type, bio, contact_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 'pending')`,
      [
        id,
        name,
        email,
        registryCode,
        specialty,
        approach,
        region,
        state,
        city,
        cityState,
        onlineAvailable,
        whatsapp,
        socialUrl,
        otherQualifications,
        serviceType,
        bio,
        contactUrl,
      ]
    );

    if (email) {
      await sendVivenciasEmail({
        to: email,
        subject: "Recebemos seu cadastro de Profissional Parceiro",
        heading: "Cadastro em análise",
        intro: `Olá, ${name}. Recebemos sua submissão para integrar o diretório de Profissionais Parceiros do Vivências Superdotadas.`,
        bodyHtml: `
          <p>Nossa equipe administrativa verificará suas informações (<strong>${specialty}</strong>) para publicação no portal.</p>
          <p>Assim que aprovado, seu perfil ficará visível para quem busca atendimento e você receberá um novo e-mail de confirmação.</p>
        `,
      });
    }

    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao enviar cadastro profissional." }, { status: 500 });
  }
}
