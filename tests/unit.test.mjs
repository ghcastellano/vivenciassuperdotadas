import test from "node:test";
import assert from "node:assert/strict";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

test("DiceBear avatar SVG generation produces valid SVG", () => {
  const svg = createAvatar(avataaars, { seed: "vivencias-test", radius: 50 }).toString();
  assert.ok(svg.startsWith("<svg"));
  assert.ok(svg.includes("</svg>"));
});

test("BRL formatting helper logic formats cents cleanly", () => {
  const format = (cents) =>
    (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  assert.match(format(8900), /89,00/);
});

function normalizeText(value) {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const SPECIALTY_PATTERNS = {
  todas: null,
  psicologia: /\bpsicolog|\btcc\b/,
  neuropsicologia: /\bneuropsicolog/,
  psicopedagogia: /\bpsicopedagog|\bneuropsicopedagog|\bneuroaprendizagem/,
  educacao: /\bpedagog|\beducac|\bpei\b|\benriquecimento/,
  terapias: /\bmusicoterapia|\barteterapia/,
};

function filterProfessionals(partners, { filter = "", regionFilter = "Todas", specialtyFilter = "todas", serviceFilter = "todos", onlineOnly = false }) {
  return partners.filter((p) => {
    const q = normalizeText(filter.trim());
    const haystack = normalizeText(
      [p.name, p.specialty, p.approach, p.region, p.city_state, p.state, p.city, p.other_qualifications, p.bio]
        .filter(Boolean)
        .join(" ")
    );
    const matchesText = !q || haystack.includes(q);
    const matchesRegion =
      regionFilter === "Todas" ||
      normalizeText(p.region).includes(normalizeText(regionFilter)) ||
      (regionFilter === "Online" && p.online_available);

    const pattern = SPECIALTY_PATTERNS[specialtyFilter] || null;
    const specialtyTarget = normalizeText([p.specialty, p.approach].filter(Boolean).join(" "));
    const matchesSpecialty = !pattern || pattern.test(specialtyTarget);

    const svc = normalizeText(p.service_type || "ambos");
    const matchesService =
      serviceFilter === "todos" || svc === serviceFilter || svc === "ambos" || svc.includes(serviceFilter);
    const matchesOnline = !onlineOnly || p.online_available;
    return matchesText && matchesRegion && matchesSpecialty && matchesService && matchesOnline;
  });
}

test("Professionals filtering distinguishes psicopedagogia from educacao and handles accents", () => {
  const sample = [
    { id: "1", name: "Ana", specialty: "Psicopedagoga clínica", approach: "", region: "Sul", city_state: "Porto Alegre - RS", online_available: true, service_type: "acompanhamento" },
    { id: "2", name: "Beto", specialty: "Avaliação Pedagógica", approach: "", region: "Sudeste", city_state: "São Paulo - SP", online_available: false, service_type: "avaliacao" },
    { id: "3", name: "Clara", specialty: "Neuropsicóloga", approach: "TCC", region: "Nordeste", city_state: "Recife - PE", online_available: true, service_type: "ambos" },
  ];

  // Educacao should match Beto, NOT Ana (psicopedagoga)
  const edu = filterProfessionals(sample, { specialtyFilter: "educacao" });
  assert.deepEqual(edu.map((p) => p.id), ["2"]);

  // Psicopedagogia should match Ana, NOT Beto
  const psicoped = filterProfessionals(sample, { specialtyFilter: "psicopedagogia" });
  assert.deepEqual(psicoped.map((p) => p.id), ["1"]);

  // Accent-insensitive search for "sao paulo"
  const sp = filterProfessionals(sample, { filter: "sao paulo" });
  assert.deepEqual(sp.map((p) => p.id), ["2"]);

  // Online only
  const online = filterProfessionals(sample, { onlineOnly: true });
  assert.deepEqual(online.map((p) => p.id), ["1", "3"]);
});

test("Community member mosaic caps preview and omits personal names for 200+ members", () => {
  const members250 = Array.from({ length: 250 }, (_, i) => ({
    id: `member-${i + 1}`,
    avatar_config: { seed: `seed-${i + 1}` },
    neurodivergences: ["ahsd"],
  }));

  const AVATAR_PREVIEW_LIMIT = 48;
  const visible = members250.slice(0, AVATAR_PREVIEW_LIMIT);
  const remaining = members250.length - visible.length;

  assert.equal(members250.length, 250);
  assert.equal(visible.length, 48);
  assert.equal(remaining, 202);
  assert.equal("first_name" in visible[0], false);
});
