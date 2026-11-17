import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

export type NeurodivergenceId =
  | "ahsd"
  | "tdah"
  | "tea"
  | "dislexia"
  | "dupla-excepcionalidade"
  | "alta-sensibilidade"
  | "aliado";

export interface NeurodivergenceBadge {
  id: NeurodivergenceId;
  label: string;
  short: string;
  color: string;
  description: string;
}

export const NEURODIVERGENCE_BADGES: NeurodivergenceBadge[] = [
  {
    id: "ahsd",
    label: "Altas Habilidades / Superdotação",
    short: "AH/SD",
    color: "#18492D",
    description: "Potencial elevado em uma ou mais áreas combinadas ou isoladas.",
  },
  {
    id: "dupla-excepcionalidade",
    label: "Dupla Excepcionalidade (2e)",
    short: "2e",
    color: "#BD4626",
    description: "AH/SD coexistindo com outra neurodivergência ou condição.",
  },
  {
    id: "tdah",
    label: "TDAH",
    short: "TDAH",
    color: "#D98A2B",
    description: "Transtorno do Déficit de Atenção com Hiperatividade.",
  },
  {
    id: "tea",
    label: "TEA (Autismo)",
    short: "TEA",
    color: "#2B6CB0",
    description: "Transtorno do Espectro Autista.",
  },
  {
    id: "dislexia",
    label: "Dislexia / Discalculia",
    short: "Dislexia",
    color: "#7C3AED",
    description: "Diferenças específicas de processamento de leitura, escrita ou cálculo.",
  },
  {
    id: "alta-sensibilidade",
    label: "Alta Sensibilidade",
    short: "TAS",
    color: "#0D9488",
    description: "Processamento sensorial e emocional aprofundado.",
  },
  {
    id: "aliado",
    label: "Aliado(a) / Familiar / Educador(a)",
    short: "Aliado",
    color: "#57655F",
    description: "Pessoa neurotípica, familiar ou profissional que caminha junto.",
  },
];

export interface AvatarConfig {
  seed: string;
  top: string;
  hairColor: string;
  skinColor: string;
  eyes: string;
  eyebrows: string;
  mouth: string;
  facialHair?: string;
  facialHairColor?: string;
  foreheadMark?: string;
  neuroAccessory?: string;
  accessories: string;
  clothing: string;
  clothesColor: string;
  backgroundColor: string;
}

export const AVATAR_OPTIONS = {
  top: [
    { value: "shortFlat", label: "Curto Clássico" },
    { value: "shortCurly", label: "Curto Cacheado" },
    { value: "shortWaved", label: "Curto Ondulado" },
    { value: "bob", label: "Chanel" },
    { value: "curly", label: "Cacheado Volumoso" },
    { value: "longButNotTooLong", label: "Médio Solto" },
    { value: "straight01", label: "Longo Liso" },
    { value: "bun", label: "Coque" },
    { value: "fro", label: "Black Power" },
    { value: "dreads", label: "Dreads" },
    { value: "hijab", label: "Hijab" },
    { value: "hat", label: "Chapéu" },
    { value: "beanie", label: "Gorro" },
  ],
  hairColor: [
    { value: "2c1b18", label: "Castanho Escuro" },
    { value: "4a312c", label: "Castanho" },
    { value: "a55728", label: "Ruivo / Acobreado" },
    { value: "d6b370", label: "Loiro" },
    { value: "e8e1e1", label: "Grisalho / Prata" },
    { value: "0f5c4d", label: "Esmeralda Artístico" },
    { value: "c83e37", label: "Carmesim Artístico" },
  ],
  skinColor: [
    { value: "ffdbb4", label: "Clara Rosada" },
    { value: "edb98a", label: "Clara Dourada" },
    { value: "d08b5b", label: "Média" },
    { value: "ae5d29", label: "Parda / Bronze" },
    { value: "614335", label: "Negra Retinta" },
  ],
  eyes: [
    { value: "default", label: "Sereno" },
    { value: "happy", label: "Sorridente" },
    { value: "wink", label: "Piscando" },
    { value: "side", label: "Curioso" },
    { value: "squint", label: "Focado" },
  ],
  eyebrows: [
    { value: "defaultNatural", label: "Natural" },
    { value: "raisedExcitedNatural", label: "Curiosa" },
    { value: "flatNatural", label: "Neutra" },
  ],
  mouth: [
    { value: "smile", label: "Sorriso Acolhedor" },
    { value: "default", label: "Sereno" },
    { value: "twinkle", label: "Leve Sorriso" },
    { value: "serious", label: "Concentrado" },
  ],
  accessories: [
    { value: "none", label: "Sem acessório" },
    { value: "round", label: "Óculos Redondos" },
    { value: "prescription02", label: "Óculos Retangulares" },
    { value: "wayfarers", label: "Óculos Escuros" },
    { value: "kurt", label: "Óculos Retrô" },
  ],
  clothing: [
    { value: "hoodie", label: "Moletom Confortável" },
    { value: "collarAndSweater", label: "Suéter" },
    { value: "shirtCrewNeck", label: "Camiseta" },
    { value: "blazerAndShirt", label: "Blazer" },
    { value: "overall", label: "Jardineira Criativa" },
  ],
  clothesColor: [
    { value: "0f5c4d", label: "Esmeralda Vivências" },
    { value: "c83e37", label: "Carmesim Flor" },
    { value: "d98a2b", label: "Âmbar Ocre" },
    { value: "262e33", label: "Carvão" },
    { value: "3c4f5c", label: "Ardósia" },
    { value: "e6e6e6", label: "Linho" },
  ],
  backgroundColor: [
    { value: "faf7f2", label: "Papel Quente" },
    { value: "f2ece1", label: "Linho Suave" },
    { value: "d9ebe6", label: "Menta Suave" },
    { value: "f9e5e2", label: "Coral Suave" },
    { value: "fbf0dc", label: "Âmbar Suave" },
  ],
  facialHair: [
    { value: "none", label: "Sem barba / bigode" },
    { value: "beardLight", label: "Barba Curta / Cavanhaque" },
    { value: "beardMedium", label: "Barba Média" },
    { value: "beardMajestic", label: "Barba Longa" },
    { value: "moustacheFancy", label: "Bigode Estilizado" },
    { value: "moustacheMagnum", label: "Bigode Cheio" },
  ],
  facialHairColor: [
    { value: "2c1b18", label: "Castanho Escuro" },
    { value: "4a312c", label: "Castanho" },
    { value: "e8e1e1", label: "Grisalho / Prata" },
    { value: "a55728", label: "Ruivo / Acobreado" },
    { value: "d6b370", label: "Loiro" },
  ],
  foreheadMark: [
    { value: "none", label: "Nenhuma" },
    { value: "crescentMoon", label: "Meia-Lua na Testa" },
  ],
  neuroAccessory: [
    { value: "none", label: "Nenhum" },
    { value: "sunflowerLanyard", label: "Cordão de Girassol (Deficiências Ocultas / Neurodivergência)" },
    { value: "infinityLanyard", label: "Cordão Infinito (Neurodiversidade)" },
    { value: "puzzleLanyard", label: "Cordão Quebra-Cabeça (TEA)" },
    { value: "noiseHeadphones", label: "Abafador / Fone Sensorial" },
  ],
};

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  seed: "vivencias",
  top: "shortWaved",
  hairColor: "2c1b18",
  skinColor: "d08b5b",
  eyes: "default",
  eyebrows: "defaultNatural",
  mouth: "smile",
  facialHair: "none",
  facialHairColor: "2c1b18",
  foreheadMark: "none",
  neuroAccessory: "none",
  accessories: "round",
  clothing: "hoodie",
  clothesColor: "0f5c4d",
  backgroundColor: "f2ece1",
};

function renderCustomOverlays(c: AvatarConfig): string {
  const overlays: string[] = [];

  if (c.foreheadMark === "crescentMoon") {
    // Bold, thick crescent moon positioned on the forehead above the eyebrows (matching member's tattoo)
    overlays.push(
      `<g transform="translate(131, 66) scale(0.92)" opacity="0.92">
        <path d="M16 2C7.2 2.4 1.5 8.5 1.5 15.5C1.5 22.5 7.2 28.6 16 29C10.8 25.6 8.8 20.9 8.8 15.5C8.8 10.1 10.8 5.4 16 2Z" fill="#232629" />
      </g>`
    );
  }

  if (c.neuroAccessory === "sunflowerLanyard") {
    overlays.push(
      `<g>
        <path d="M108 194 L140 248 L172 194" stroke="#18492D" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <circle cx="118" cy="211" r="4" fill="#F2B705"/><circle cx="118" cy="211" r="1.6" fill="#5C3A21"/>
        <circle cx="129" cy="230" r="4" fill="#F2B705"/><circle cx="129" cy="230" r="1.6" fill="#5C3A21"/>
        <circle cx="162" cy="211" r="4" fill="#F2B705"/><circle cx="162" cy="211" r="1.6" fill="#5C3A21"/>
        <circle cx="151" cy="230" r="4" fill="#F2B705"/><circle cx="151" cy="230" r="1.6" fill="#5C3A21"/>
        <rect x="131" y="244" width="18" height="22" rx="3" fill="#FAF7F2" stroke="#18492D" stroke-width="2"/>
        <circle cx="140" cy="255" r="4.5" fill="#F2B705"/><circle cx="140" cy="255" r="2" fill="#5C3A21"/>
      </g>`
    );
  } else if (c.neuroAccessory === "infinityLanyard") {
    overlays.push(
      `<g>
        <path d="M108 194 L140 248 L172 194" stroke="#3B9963" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M108 194 L140 248 L172 194" stroke="#F2B705" stroke-width="4" stroke-dasharray="6 8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <rect x="130" y="244" width="20" height="22" rx="3" fill="#FAF7F2" stroke="#18492D" stroke-width="2"/>
        <text x="140" y="259" text-anchor="middle" fill="#BD4626" font-family="system-ui,sans-serif" font-size="13" font-weight="700">∞</text>
      </g>`
    );
  } else if (c.neuroAccessory === "puzzleLanyard") {
    overlays.push(
      `<g>
        <path d="M108 194 L140 248 L172 194" stroke="#2563EB" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <circle cx="119" cy="213" r="3.5" fill="#FACC15"/>
        <circle cx="130" cy="231" r="3.5" fill="#EF4444"/>
        <circle cx="161" cy="213" r="3.5" fill="#22C55E"/>
        <circle cx="150" cy="231" r="3.5" fill="#FACC15"/>
        <rect x="131" y="244" width="18" height="22" rx="3" fill="#FAF7F2" stroke="#2563EB" stroke-width="2"/>
        <rect x="136" y="250" width="8" height="8" rx="1.5" fill="#EF4444"/>
      </g>`
    );
  } else if (c.neuroAccessory === "noiseHeadphones") {
    overlays.push(
      `<g>
        <path d="M74 114 C74 48, 206 48, 206 114" stroke="#252827" stroke-width="9" stroke-linecap="round" fill="none"/>
        <rect x="65" y="102" width="16" height="32" rx="8" fill="#18492D" stroke="#252827" stroke-width="2.5"/>
        <rect x="199" y="102" width="16" height="32" rx="8" fill="#18492D" stroke="#252827" stroke-width="2.5"/>
      </g>`
    );
  }

  return overlays.join("");
}

export function renderAvatarSvg(config: Partial<AvatarConfig> = {}): string {
  const c = { ...DEFAULT_AVATAR_CONFIG, ...config };
  const facialHair = c.facialHair && c.facialHair !== "none" ? [c.facialHair] : [];
  const avatar = createAvatar(avataaars, {
    seed: c.seed,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    top: [c.top as any],
    hairColor: [c.hairColor],
    skinColor: [c.skinColor],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    eyes: [c.eyes as any],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    eyebrows: [c.eyebrows as any],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mouth: [c.mouth as any],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    facialHair: facialHair as any,
    facialHairProbability: facialHair.length > 0 ? 100 : 0,
    facialHairColor: [c.facialHairColor || c.hairColor || "2c1b18"],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    accessories: c.accessories === "none" ? [] : [c.accessories as any],
    accessoriesProbability: c.accessories === "none" ? 0 : 100,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clothing: [c.clothing as any],
    clothesColor: [c.clothesColor],
    backgroundColor: [c.backgroundColor],
    radius: 50,
  });
  const baseSvg = avatar.toString();
  const customOverlays = renderCustomOverlays(c);
  if (!customOverlays) return baseSvg;
  return baseSvg.replace(/<\/svg>\s*$/i, `${customOverlays}</svg>`);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Generates a complete standalone SVG card including the DiceBear avatar,
 * neurodiversity infinity ring, selected neurodivergence badges, and name.
 */
export function renderShareableAvatarSvg(
  config: Partial<AvatarConfig> = {},
  neurodivergences: string[] = ["ahsd"],
  personName = "Vivências Superdotadas"
): string {
  const innerSvg = renderAvatarSvg(config)
    .replace(/^<\?xml[^>]*\?>\s*/i, "")
    .replace(/<svg[^>]*>/i, "")
    .replace(/<\/svg>\s*$/i, "");

  const activeBadges = NEURODIVERGENCE_BADGES.filter((b) =>
    neurodivergences.includes(b.id)
  );
  const primary = activeBadges[0]?.color || "#18492D";
  const secondary = activeBadges[1]?.color || primary;

  const shownBadges = activeBadges.slice(0, 4);
  const badgePills = shownBadges
    .map((b, idx) => {
      const row = Math.floor(idx / 2);
      const col = idx % 2;
      const itemsInThisRow = Math.min(2, shownBadges.length - row * 2);
      const pillW = 160;
      const gap = 16;
      const rowStartX = (420 - (itemsInThisRow * pillW + (itemsInThisRow - 1) * gap)) / 2;
      const x = rowStartX + col * (pillW + gap);
      const y = 342 + row * 38;
      return `<g transform="translate(${x},${y})">
        <rect width="${pillW}" height="28" rx="4" fill="${b.color}" />
        <text x="${pillW / 2}" y="18" text-anchor="middle" fill="#FAF7F2" font-family="system-ui,Segoe UI,sans-serif" font-size="11.5" font-weight="700">${escapeXml(b.short)}</text>
      </g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 470" width="420" height="470">
  <defs>
    <linearGradient id="neuroRing" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primary}" />
      <stop offset="100%" stop-color="${secondary}" />
    </linearGradient>
    <clipPath id="avatarClip">
      <circle cx="210" cy="170" r="102" />
    </clipPath>
  </defs>
  <rect width="420" height="470" rx="12" fill="#F7F9F8" stroke="#CDD8D5" stroke-width="2" />
  <text x="210" y="42" text-anchor="middle" fill="#18492D" font-family="system-ui,Segoe UI,sans-serif" font-size="11" font-weight="700" letter-spacing="2">CADA PESSOA É ÚNICA</text>
  <circle cx="210" cy="170" r="110" fill="url(#neuroRing)" />
  <circle cx="210" cy="170" r="102" fill="#FFFFFF" />
  <g clip-path="url(#avatarClip)">
    <svg x="108" y="68" width="204" height="204" viewBox="0 0 280 280">${innerSvg}</svg>
  </g>
  <text x="210" y="315" text-anchor="middle" fill="#090A0A" font-family="Georgia,serif" font-size="22" font-weight="700">${escapeXml(personName || "Você")}</text>
  ${badgePills}
  <text x="210" y="446" text-anchor="middle" fill="#656B6A" font-family="system-ui,Segoe UI,sans-serif" font-size="11">Associação Vivências Superdotadas</text>
</svg>`;
}
