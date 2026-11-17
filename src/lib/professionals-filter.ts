export interface PartnerItem {
  id: string;
  name: string;
  email?: string;
  registry_code: string;
  specialty: string;
  approach: string;
  region?: string;
  state?: string;
  city?: string;
  city_state: string;
  online_available: boolean;
  whatsapp?: string;
  social_url?: string;
  other_qualifications?: string;
  service_type?: string;
  bio: string;
  contact_url: string;
}

export const SERVICE_TYPE_LABELS: Record<string, string> = {
  avaliacao: "Avaliação",
  acompanhamento: "Acompanhamento",
  ambos: "Avaliação e Acompanhamento",
};

export const REGIONS = [
  "Todas",
  "Norte",
  "Nordeste",
  "Centro-oeste",
  "Sudeste",
  "Sul",
  "Online",
] as const;

export const SPECIALTY_FILTERS = [
  { key: "todas", label: "Todas Especialidades", terms: [] as string[] },
  { key: "psicologia", label: "Psicologia", terms: ["psicolog", "tcc"] },
  { key: "neuropsicologia", label: "Neuropsicologia", terms: ["neuropsicolog"] },
  {
    key: "psicopedagogia",
    label: "Psicopedagogia / Neuropsicopedagogia",
    terms: ["psicopedagog", "neuropsicopedagog", "neuroaprendizagem"],
  },
  {
    key: "educacao",
    label: "Avaliação Pedagógica / Educação",
    terms: ["pedagog", "educacao", "pei", "enriquecimento"],
  },
  {
    key: "terapias",
    label: "Musicoterapia / Arteterapia",
    terms: ["musicoterapia", "arteterapia"],
  },
] as const;

const STATE_TO_REGION: Record<string, string> = {
  AC: "Norte", AP: "Norte", AM: "Norte", PA: "Norte", RO: "Norte", RR: "Norte", TO: "Norte",
  AL: "Nordeste", BA: "Nordeste", CE: "Nordeste", MA: "Nordeste", PB: "Nordeste", PE: "Nordeste", PI: "Nordeste", RN: "Nordeste", SE: "Nordeste",
  DF: "Centro-oeste", GO: "Centro-oeste", MT: "Centro-oeste", MS: "Centro-oeste",
  ES: "Sudeste", MG: "Sudeste", RJ: "Sudeste", SP: "Sudeste",
  PR: "Sul", RS: "Sul", SC: "Sul",
};

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function inferRegion(p: Pick<PartnerItem, "region" | "state" | "city_state">): string {
  if (p.region && p.region.trim()) return p.region.trim();
  const haystack = `${p.state || ""} ${p.city_state || ""}`.toUpperCase();
  for (const [uf, reg] of Object.entries(STATE_TO_REGION)) {
    if (new RegExp(`\\b${uf}\\b`).test(haystack)) {
      return reg;
    }
  }
  return "";
}

export function classifySpecialty(rawSpecialty: string): string {
  const norm = normalizeText(rawSpecialty);
  if (norm.includes("neuropsicopedagog") || norm.includes("psicopedagog")) return "Psicopedagogia";
  if (norm.includes("neuropsic")) return "Neuropsicologia";
  if (norm.includes("psicolog")) return "Psicologia";
  if (norm.includes("pedagog") || norm.includes("educac")) return "Avaliação Pedagógica";
  if (norm.includes("musicoterapia") || norm.includes("arteterapia")) return "Terapias Expressivas";
  return "Especialista AH/SD";
}

export interface ProfessionalFilterCriteria {
  query: string;
  region: string;
  specialtyKey: string;
  serviceType: string;
  onlineOnly: boolean;
}

export function filterProfessionals(partners: PartnerItem[], criteria: ProfessionalFilterCriteria): PartnerItem[] {
  const q = normalizeText(criteria.query);
  const regNorm = normalizeText(criteria.region);
  const specObj = SPECIALTY_FILTERS.find((s) => s.key === criteria.specialtyKey);

  return partners.filter((p) => {
    const haystack = normalizeText(
      [
        p.name,
        p.specialty,
        p.approach,
        p.city_state,
        p.state,
        p.city,
        p.other_qualifications,
        p.bio,
      ]
        .filter(Boolean)
        .join(" ")
    );

    const matchesText = !q || haystack.includes(q);

    const inferredRegion = normalizeText(inferRegion(p));
    const matchesRegion =
      criteria.region === "Todas" ||
      inferredRegion.includes(regNorm) ||
      (criteria.region === "Online" && p.online_available) ||
      (p.online_available && normalizeText(p.city_state || "").includes("todo o brasil"));

    const matchesSpecialty =
      !specObj ||
      specObj.terms.length === 0 ||
      specObj.terms.some((term) => haystack.includes(term));

    const profService = p.service_type || "ambos";
    const matchesService =
      criteria.serviceType === "todos" ||
      profService === criteria.serviceType ||
      (criteria.serviceType !== "ambos" && profService === "ambos");

    const matchesOnline = !criteria.onlineOnly || p.online_available;

    return matchesText && matchesRegion && matchesSpecialty && matchesService && matchesOnline;
  });
}
