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

    let userId = (session?.user as { id?: string } | undefined)?.id || null;
    if (!userId) {
      const matchedUsers = await query<{ id: string }>(
        "SELECT id FROM users WHERE LOWER(email) = $1 LIMIT 1",
        [email]
      );
      if (matchedUsers[0]?.id) {
        userId = matchedUsers[0].id;
      }
    }
    const existingMembership = await query<{ id: string }>(
      "SELECT id FROM memberships WHERE LOWER(email) = $1 OR ($2::text IS NOT NULL AND user_id = $2) ORDER BY created_at DESC LIMIT 1",
      [email, userId]
    );

    let id = existingMembership[0]?.id;
    const isUpdate = Boolean(id);

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
             accepted_code = $10
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
        `INSERT INTO memberships (id, user_id, name, email, profile, city_state, neurodivergences, avatar_config, manifesto, has_medical_report, show_in_directory, accepted_code)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
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
        subject: "Associação confirmada — Vivências Superdotadas",
        heading: `Bem-vindo(a), ${name}!`,
        intro: "Sua solicitação de associação e seu Avatar Único foram registrados.",
        bodyHtml: `
          <p>Ficamos muito felizes em caminhar com você. Nossa associação reúne pessoas com AH/SD, familiares, educadores e aliados neurotípicos em torno do respeito à singularidade e da divulgação científica responsável.</p>
          <p><strong>Perfil selecionado:</strong> ${profile}</p>
          <p>Você também pode participar do nosso grupo de convivência no WhatsApp respeitando o Código de Boa Convivência.</p>
        `,
        ctaLabel: "Entrar no grupo do WhatsApp",
        ctaUrl: "https://chat.whatsapp.com/IkD3gldncwsBmvSH1j8N6b",
      });
    }

    return NextResponse.json({ ok: true, id, updated: isUpdate }, { status: isUpdate ? 200 : 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Não foi possível salvar a associação." }, { status: 500 });
  }
}
