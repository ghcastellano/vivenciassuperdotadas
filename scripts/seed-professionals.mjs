import fs from "node:fs";
import path from "node:path";
import { Pool } from "pg";

function loadDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const envPath = path.join(process.cwd(), ".env.local");
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^DATABASE_URL=(.+)$/);
    if (match) return match[1].trim().replace(/^"|"$/g, "");
  }
  throw new Error("DATABASE_URL not found");
}

const REAL_PROFESSIONALS = [
  {
    id: "prof-mariana-valenca",
    name: "Mariana Valença",
    specialty: "Psicólogo(a) · Neuropsicólogo(a)",
    approach: "Atendimento presencial e virtual",
    region: "Sul",
    state: "Santa Catarina",
    city: "Florianópolis",
    city_state: "Florianópolis - SC",
    online_available: true,
    whatsapp: "48 99624-8160",
    email: "",
    social_url: "https://www.instagram.com/marianavalenca_psi/",
    other_qualifications: "Atendimento presencial em Florianópolis (SC) e atendimento online.",
  },
  {
    id: "prof-adriana-mendonca",
    name: "Adriana Mendonça",
    specialty: "Psicóloga especialista em AH/SD",
    approach: "Parceria com psicólogo(a) local",
    region: "Online · Todo o Brasil",
    state: "Qualquer geografia (Online)",
    city: "Parceria com psicólogo(a) local",
    city_state: "Online · Todo o Brasil (parceria local)",
    online_available: true,
    whatsapp: "19 99175-9893",
    email: "",
    social_url: "",
    other_qualifications: "Atendimento online para qualquer geografia; parceria com psicólogo(a) local.",
  },
  {
    id: "prof-lucia-lamb",
    name: "Lúcia Lamb",
    specialty: "Avaliação Pedagógica · Mestre em Educação Especialista em AH/SD",
    approach: "Educação Especial / Avaliação Pedagógica",
    region: "Sul",
    state: "RS presencial e restante online",
    city: "Porto Alegre",
    city_state: "Porto Alegre - RS (e Online)",
    online_available: true,
    whatsapp: "51 99378-1998",
    email: "",
    social_url: "",
    other_qualifications: "Mestre em Educação especialista em AH/SD. Atendimento presencial no RS e online para o restante do país.",
  },
  {
    id: "prof-carolina-drummond",
    name: "Carolina Drummond",
    specialty: "Neuropsicóloga · Especialista em Superdotação, Psicologia da Saúde e Escolar",
    approach: "Neuropsicologia / Psicologia Escolar e da Saúde",
    region: "Sudeste e Online",
    state: "São Paulo (e DF*)",
    city: "São Paulo",
    city_state: "São Paulo - SP (e DF* / Online)",
    online_available: true,
    whatsapp: "11 98493-6660",
    email: "cacadrummond@gmail.com",
    social_url: "https://www.instagram.com/carolcdrummond/",
    other_qualifications: "Especialista em superdotação, psicologia da saúde e psicologia escolar e da educação. Instagram: @carolcdrummond e @eu.divergente.",
  },
  {
    id: "prof-tatiane-oliveira",
    name: "Tatiane Oliveira",
    specialty: "Psicopedagogia, Neuropsicopedagogia, Educação Especial e Musicoterapia",
    approach: "Educação Especial e Inclusiva / Musicoterapia",
    region: "Sudeste",
    state: "MG presencial · Brasil e exterior online",
    city: "Poço Fundo",
    city_state: "Poço Fundo - MG (Brasil e exterior online)",
    online_available: true,
    whatsapp: "35 99805-5807",
    email: "psicopedagogatatianeoliveira@gmail.com",
    social_url: "https://www.instagram.com/psicopedagogatatianeoliveira/",
    other_qualifications: "Psicopedagogia e Neuropsicopedagogia. Especialista em Altas Habilidades/Superdotação, Educação Especial e Inclusiva e Musicoterapia.",
  },
  {
    id: "prof-juliana-andreatta-faber",
    name: "Juliana Andreatta Faber",
    specialty: "Avaliação Pedagógica · Mestre em Educação Especialista em AH/SD",
    approach: "Equipe multidisciplinar (psicóloga e neuropsicopedagoga)",
    region: "Sul",
    state: "Santa Catarina",
    city: "Balneário Camboriú",
    city_state: "Balneário Camboriú - SC (e Online)",
    online_available: true,
    whatsapp: "47 99842-6209",
    email: "",
    social_url: "https://www.instagram.com/juli.anaandreattafaber/",
    other_qualifications: "Equipe multidisciplinar com psicóloga e neuropsicopedagoga. Avaliação online, atendimento, enriquecimento, PEI, palestras em escolas, etc. (@juli.anaandreattafaber / @juliana_faber.ahsd).",
  },
  {
    id: "prof-aurea-spricigo",
    name: "Áurea Spricigo",
    specialty: "Psicóloga especialista em TEA e AH/SD · Mestra em Educação",
    approach: "Abordagem TCC",
    region: "Sul",
    state: "Paraná",
    city: "Curitiba",
    city_state: "Curitiba - PR (e Online)",
    online_available: true,
    whatsapp: "",
    email: "",
    social_url: "https://www.instagram.com/psicologa.aureaspricigo/",
    other_qualifications: "Psicóloga especialista em TEA e AH/SD, Mestra em Educação, abordagem TCC. Site: https://psicoaurea.wixsite.com/psicologia",
  },
  {
    id: "prof-flavio-nunes",
    name: "Flávio Nunes",
    specialty: "Neuropsicólogo · Neuropsicopedagogia, Arteterapia e Neurociências",
    approach: "Neuroaprendizagem, Arteterapia e Comportamento Humano",
    region: "Sudeste",
    state: "Rio de Janeiro",
    city: "Rio de Janeiro",
    city_state: "Rio de Janeiro - RJ (e Online)",
    online_available: true,
    whatsapp: "(21) 98582-2097",
    email: "",
    social_url: "https://www.instagram.com/flavionunes.oficiall/",
    other_qualifications: "Neuropsicopedagogia, Neuroaprendizagem, Arteterapia, Comportamento Humano, AH/SD e Neurociências.",
  },
  {
    id: "prof-denise-rodrigues",
    name: "Denise Rodrigues",
    specialty: "Avaliação Pedagógica · Psicopedagoga e Neuropsicopedagoga",
    approach: "Equipe multidisciplinar / Educação Parental",
    region: "Sudeste",
    state: "São Paulo / Rio de Janeiro",
    city: "Paulínia",
    city_state: "Paulínia - SP / RJ (e Online)",
    online_available: true,
    whatsapp: "19 99991-2112",
    email: "",
    social_url: "https://www.instagram.com/deniserodrigues.ahsd/",
    other_qualifications: "Neuropsicopedagoga, Educadora Parental. Trabalho junto a uma equipe multidisciplinar.",
  },
];

async function main() {
  const pool = new Pool({ connectionString: loadDatabaseUrl() });
  for (const p of REAL_PROFESSIONALS) {
    await pool.query(
      `INSERT INTO partner_professionals
       (id, name, email, registry_code, specialty, approach, region, state, city, city_state, online_available, whatsapp, social_url, other_qualifications, bio, contact_url, status)
       VALUES ($1, $2, $3, '', $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $13, $12, 'approved')
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         email = EXCLUDED.email,
         specialty = EXCLUDED.specialty,
         approach = EXCLUDED.approach,
         region = EXCLUDED.region,
         state = EXCLUDED.state,
         city = EXCLUDED.city,
         city_state = EXCLUDED.city_state,
         online_available = EXCLUDED.online_available,
         whatsapp = EXCLUDED.whatsapp,
         social_url = EXCLUDED.social_url,
         other_qualifications = EXCLUDED.other_qualifications,
         bio = EXCLUDED.bio,
         contact_url = EXCLUDED.contact_url,
         status = 'approved'`,
      [
        p.id,
        p.name,
        p.email,
        p.specialty,
        p.approach,
        p.region,
        p.state,
        p.city,
        p.city_state,
        p.online_available,
        p.whatsapp,
        p.social_url,
        p.other_qualifications,
      ]
    );
  }
  const res = await pool.query("SELECT COUNT(*) FROM partner_professionals WHERE status = 'approved'");
  console.log("Updated approved professionals:", res.rows[0].count);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
