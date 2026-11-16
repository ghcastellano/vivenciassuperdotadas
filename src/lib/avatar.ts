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
    color: "#0F5C4D",
    description: "Potencial elevado em uma ou mais áreas combinadas ou isoladas.",
  },
  {
    id: "dupla-excepcionalidade",
    label: "Dupla Excepcionalidade (2e)",
    short: "2e",
    color: "#C83E37",
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
};

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  seed: "vivencias",
  top: "shortWaved",
  hairColor: "2c1b18",
  skinColor: "d08b5b",
  eyes: "default",
  eyebrows: "defaultNatural",
  mouth: "smile",
  accessories: "round",
  clothing: "hoodie",
  clothesColor: "0f5c4d",
  backgroundColor: "f2ece1",
};

export function renderAvatarSvg(config: Partial<AvatarConfig> = {}): string {
  const c = { ...DEFAULT_AVATAR_CONFIG, ...config };
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
    accessories: c.accessories === "none" ? [] : [c.accessories as any],
    accessoriesProbability: c.accessories === "none" ? 0 : 100,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clothing: [c.clothing as any],
    clothesColor: [c.clothesColor],
    backgroundColor: [c.backgroundColor],
    radius: 50,
  });
  return avatar.toString();
}
