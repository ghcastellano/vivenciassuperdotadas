import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query, isDatabaseConfigured } from "@/lib/db";
import { sendVivenciasEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { error: "Banco de dados ainda não configurado (DATABASE_URL ausente)." },
        { status: 503 }
      );
    }

    const session = await auth();
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const profile = String(body.profile || "Pessoa com AH/SD").trim();
    const cityState = String(body.cityState || "").trim();
    const manifesto = String(body.manifesto || "").trim().slice(0, 240);
    const hasMedicalReport = String(body.hasMedicalReport || "nao_informado").trim();
    const showInDirectory = body.showInDirectory !== false;
    const neurodivergences = Array.isArray(body.neurodivergences) ? body.neurodivergences : ["ahsd"];
    const avatarConfig = body.avatarConfig || {};
    const acceptedCode = Boolean(body.acceptedCode);

    if (!name || !email || !acceptedCode) {
      return NextResponse.json(
        { error: "Nome, e-mail e aceite do Código de Boa Convivência são obrigatórios." },
        { status: 400 }
      );
    }

    let userId: string | null = null;
    const matchedUsers = await query<{ id: string }>(
      "SELECT id FROM users WHERE LOWER(email) = $1 LIMIT 1",
      [email]
    );
    if (matchedUsers[0]?.id) {
      userId = matchedUsers[0].id;
    } else if ((session?.user as { id?: string } | undefined)?.id) {
      const candidateId = String((session?.user as { id?: string }).id);
      const byId = await query<{ id: string }>("SELECT id FROM users WHERE id = $1 LIMIT 1", [candidateId]);
      if (byId[0]?.id) userId = byId[0].id;
    }
    const existingMembership = await query<{ id: string; membership_status: string; member_number: string }>(
      "SELECT id, membership_status, member_number FROM memberships WHERE LOWER(email) = $1 OR ($2::text IS NOT NULL AND user_id = $2) ORDER BY created_at DESC LIMIT 1",
      [email, userId]
    );

    let id = existingMembership[0]?.id;
    const isUpdate = Boolean(id);
    const membershipStatus = existingMembership[0]?.membership_status || "pending";
    const memberNumber = existingMembership[0]?.member_number || "";

    if (id) {
      await query(
        `UPDATE memberships
         SET user_id = COALESCE($1, user_id),
             name = $2,
             profile = $3,
             city_state = $4,
             neurodivergences = $5,
             avatar_config = $6,
             manifesto = $7,
             has_medical_report = $8,
             show_in_directory = $9,
             accepted_code = $10,
             accepted_at = COALESCE(accepted_at, NOW())
         WHERE id = $11`,
        [
          userId,
          name,
          profile,
          cityState,
          neurodivergences,
          JSON.stringify(avatarConfig),
          manifesto,
          hasMedicalReport,
          showInDirectory,
          acceptedCode,
          id,
        ]
      );
    } else {
      id = crypto.randomUUID();
      await query(
        `INSERT INTO memberships (id, user_id, name, email, profile, city_state, neurodivergences, avatar_config, manifesto, has_medical_report, show_in_directory, accepted_code, membership_status, terms_version, accepted_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending', 'estatuto-v1-2026', NOW())`,
        [
          id,
          userId,
          name,
          email,
          profile,
          cityState,
          neurodivergences,
          JSON.stringify(avatarConfig),
          manifesto,
          hasMedicalReport,
          showInDirectory,
          acceptedCode,
        ]
      );
    }

    if (userId) {
      await query(
        "UPDATE users SET name = $1, avatar_config = $2, neurodivergences = $3, manifesto = $4, has_medical_report = $5 WHERE id = $6",
        [name, JSON.stringify(avatarConfig), neurodivergences, manifesto, hasMedicalReport, userId]
      );
    }

    if (!isUpdate) {
      await sendVivenciasEmail({
        to: email,
        subject: "Solicitação de associação recebida — Vivências Superdotadas",
        heading: `Recebemos sua solicitação, ${name}!`,
        intro: "Seu cadastro e seu Avatar Único foram registrados e estão em análise pela diretoria.",
        bodyHtml: `
          <p>Separamos a criação de conta do processo formal de associação: sua ficha (Estatuto + Código de Boa Convivência) já está na fila de aprovação da equipe.</p>
          <p><strong>Perfil selecionado:</strong> ${profile}</p>
          <p>Assim que a diretoria confirmar sua associação, você receberá sua matrícula e o acesso completo às áreas exclusivas.</p>
        `,
        ctaLabel: "Acompanhar no Meu Perfil",
        ctaUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://vivenciassuperdotadas.vercel.app"}/perfil`,
      });
    }

    return NextResponse.json(
      { ok: true, id, updated: isUpdate, membershipStatus, memberNumber },
      { status: isUpdate ? 200 : 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Não foi possível salvar a associação." }, { status: 500 });
  }
}
