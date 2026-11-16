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
    const neurodivergences = Array.isArray(body.neurodivergences) ? body.neurodivergences : ["ahsd"];
    const avatarConfig = body.avatarConfig || {};
    const acceptedCode = Boolean(body.acceptedCode);

    if (!name || !email || !acceptedCode) {
      return NextResponse.json(
        { error: "Nome, e-mail e aceite do Código de Boa Convivência são obrigatórios." },
        { status: 400 }
      );
    }

    const userId = (session?.user as { id?: string } | undefined)?.id || null;
    const id = crypto.randomUUID();

    await query(
      `INSERT INTO memberships (id, user_id, name, email, profile, city_state, neurodivergences, avatar_config, manifesto, accepted_code)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
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
        acceptedCode,
      ]
    );

    if (userId) {
      await query(
        "UPDATE users SET avatar_config = $1, neurodivergences = $2, manifesto = $3 WHERE id = $4",
        [JSON.stringify(avatarConfig), neurodivergences, manifesto, userId]
      );
    }

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

    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Não foi possível salvar a associação." }, { status: 500 });
  }
}
