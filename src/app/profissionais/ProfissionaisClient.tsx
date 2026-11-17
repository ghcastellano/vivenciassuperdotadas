"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, CheckCircle2, Mail, ExternalLink, MessageCircle } from "lucide-react";

function toWhatsAppHref(rawPhone: string, profName: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  const full = digits.startsWith("55") ? digits : `55${digits}`;
  const msg = encodeURIComponent(
    `Olá ${profName}, vim pelo site Vivências Superdotadas e gostaria de mais informações sobre seu atendimento.`
  );
  return `https://wa.me/${full}?text=${msg}`;
}

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

const SERVICE_TYPE_LABELS: Record<string, string> = {
  avaliacao: "Avaliação",
  acompanhamento: "Acompanhamento",
  ambos: "Avaliação e Acompanhamento",
};

const REGIONS = [
  "Todas",
  "Norte",
  "Nordeste",
  "Centro-oeste",
  "Sudeste",
  "Sul",
  "Online",
] as const;

function normalizeText(value?: string | null): string {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const SPECIALTY_FILTERS = [
  { key: "todas", label: "Todas Especialidades", pattern: null },
  { key: "psicologia", label: "Psicologia", pattern: /\bpsicolog|\btcc\b/ },
  { key: "neuropsicologia", label: "Neuropsicologia", pattern: /\bneuropsicolog/ },
  {
    key: "psicopedagogia",
    label: "Psicopedagogia / Neuropsicopedagogia",
    pattern: /\bpsicopedagog|\bneuropsicopedagog|\bneuroaprendizagem/,
  },
  {
    key: "educacao",
    label: "Avaliação Pedagógica / Educação",
    pattern: /\bpedagog|\beducac|\bpei\b|\benriquecimento/,
  },
  {
    key: "terapias",
    label: "Musicoterapia / Arteterapia",
    pattern: /\bmusicoterapia|\barteterapia/,
  },
] as const;

export function ProfissionaisClient({ initialPartners }: { initialPartners: PartnerItem[] }) {
  const [partners] = useState<PartnerItem[]>(initialPartners);
  const [filter, setFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("Todas");
  const [specialtyFilter, setSpecialtyFilter] = useState("todas");
  const [serviceFilter, setServiceFilter] = useState("todos");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    onlineAvailable: true,
    region: "Sudeste",
    state: "",
    city: "",
    specialty: "",
    serviceType: "ambos",
    name: "",
    registryCode: "",
    whatsapp: "",
    email: "",
    socialUrl: "",
    otherQualifications: "",
    acceptedDataPolicy: false,
  });

  const filtered = partners.filter((p) => {
    const q = normalizeText(filter.trim());
    const haystack = normalizeText(
      [
        p.name,
        p.specialty,
        p.approach,
        p.region,
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
    const matchesRegion =
      regionFilter === "Todas" ||
      normalizeText(p.region).includes(normalizeText(regionFilter)) ||
      (regionFilter === "Online" && p.online_available);

    const specObj = SPECIALTY_FILTERS.find((s) => s.key === specialtyFilter);
    const specialtyTarget = normalizeText([p.specialty, p.approach].filter(Boolean).join(" "));
    const matchesSpecialty = !specObj || !specObj.pattern || specObj.pattern.test(specialtyTarget);

    const svc = normalizeText(p.service_type || "ambos");
    const matchesService =
      serviceFilter === "todos" ||
      svc === serviceFilter ||
      svc === "ambos" ||
      svc.includes(serviceFilter);

    const matchesOnline = !onlineOnly || p.online_available;
    return matchesText && matchesRegion && matchesSpecialty && matchesService && matchesOnline;
  });

  const hasActiveFilters =
    filter.trim() !== "" ||
    regionFilter !== "Todas" ||
    specialtyFilter !== "todas" ||
    serviceFilter !== "todos" ||
    onlineOnly;

  const clearFilters = () => {
    setFilter("");
    setRegionFilter("Todas");
    setSpecialtyFilter("todas");
    setServiceFilter("todos");
    setOnlineOnly(false);
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/professionals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Não foi possível enviar.");
      return;
    }
    setSubmitted(true);
    setFormOpen(false);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-10">
      <div
        className="flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-end"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
            Rede de Cuidado Baseada em Evidências
          </p>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Profissionais Especializados em AH/SD</h1>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            Psicólogos(as), neuropsicólogos(as), psicopedagogos(as) e avaliadores pedagógicos cadastrados e verificados
            pela equipe do Vivências Superdotadas.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setFormOpen((v) => !v)}
          className="btn-primary min-h-[44px] shrink-0 rounded-md px-5 py-2.5 text-sm font-semibold"
        >
          {formOpen ? "Fechar formulário" : "Sou profissional · Quero me cadastrar"}
        </button>
      </div>

      {submitted && (
        <div
          className="mt-6 flex items-center gap-3 rounded-2xl border p-4 text-sm"
          style={{ borderColor: "var(--accent-emerald)", backgroundColor: "var(--bg-surface)" }}
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: "var(--accent-emerald)" }} />
          <span>
            Submissão recebida! Seus dados serão revisados pela administração antes da publicação no diretório.
          </span>
        </div>
      )}

      {formOpen && (
        <form
          onSubmit={submitForm}
          className="mt-8 space-y-5 rounded-2xl border p-6"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
        >
          <div>
            <h2 className="font-display text-xl font-semibold">Cadastro de Profissional Especializado em AH/SD</h2>
            <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              Dúvidas? Escreva para vsuperdotadas@gmail.com. Campos com * são obrigatórios.
            </p>
          </div>
          {error && (
            <p className="text-sm font-medium" style={{ color: "var(--accent-crimson)" }}>
              {error}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1 text-xs">
              <span className="font-semibold">Por qual nome e sobrenome gostaria de ser chamado(a)? *</span>
              <input
                required
                placeholder="Ex: Mariana Valença"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full min-h-[44px] rounded-xl border px-3.5 text-sm"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
              />
            </label>

            <label className="block space-y-1 text-xs">
              <span className="font-semibold">Qual a sua especialização? *</span>
              <input
                required
                placeholder="Ex: Psicólogo(a), Neuropsicólogo(a), Psicopedagogo(a), Avaliação pedagógica"
                value={form.specialty}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                className="w-full min-h-[44px] rounded-xl border px-3.5 text-sm"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
              />
            </label>

            <label className="block space-y-1 text-xs">
              <span className="font-semibold">Atende online? *</span>
              <select
                value={form.onlineAvailable ? "sim" : "nao"}
                onChange={(e) => setForm({ ...form, onlineAvailable: e.target.value === "sim" })}
                className="w-full min-h-[44px] rounded-xl border px-3.5 text-sm"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
              >
                <option value="sim">Sim, atendo online</option>
                <option value="nao">Não, apenas presencial</option>
              </select>
            </label>

            <label className="block space-y-1 text-xs">
              <span className="font-semibold">Em qual região do país você atende presencialmente? *</span>
              <select
                required
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="w-full min-h-[44px] rounded-xl border px-3.5 text-sm"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
              >
                <option value="Norte">Norte</option>
                <option value="Nordeste">Nordeste</option>
                <option value="Centro-oeste">Centro-oeste</option>
                <option value="Sudeste">Sudeste</option>
                <option value="Sul">Sul</option>
                <option value="Não atendo presencialmente.">Não atendo presencialmente.</option>
              </select>
            </label>

            <label className="block space-y-1 text-xs">
              <span className="font-semibold">Em qual estado do país você atende presencialmente? *</span>
              <input
                required
                placeholder="Ex: Santa Catarina (ou Todo o Brasil / Online)"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full min-h-[44px] rounded-xl border px-3.5 text-sm"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
              />
            </label>

            <label className="block space-y-1 text-xs">
              <span className="font-semibold">Em que cidade você atende presencialmente?</span>
              <input
                placeholder="Ex: Florianópolis"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full min-h-[44px] rounded-xl border px-3.5 text-sm"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
              />
            </label>

            <label className="block space-y-1 text-xs">
              <span className="font-semibold">Tem WhatsApp profissional? Se sim, informe:</span>
              <input
                placeholder="Ex: (48) 99624-8160"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full min-h-[44px] rounded-xl border px-3.5 text-sm"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
              />
            </label>

            <label className="block space-y-1 text-xs">
              <span className="font-semibold">Tem e-mail profissional? Se sim, informe:</span>
              <input
                type="email"
                placeholder="contato@profissional.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full min-h-[44px] rounded-xl border px-3.5 text-sm"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
              />
            </label>

            <label className="block space-y-1 text-xs">
              <span className="font-semibold">Tem rede social profissional? Se sim, informe o link:</span>
              <input
                placeholder="https://instagram.com/..."
                value={form.socialUrl}
                onChange={(e) => setForm({ ...form, socialUrl: e.target.value })}
                className="w-full min-h-[44px] rounded-xl border px-3.5 text-sm"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
              />
            </label>

            <label className="block space-y-1 text-xs">
              <span className="font-semibold">Tipo de atuação *</span>
              <select
                value={form.serviceType}
                onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                className="w-full min-h-[44px] rounded-xl border px-3.5 text-sm"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
              >
                <option value="avaliacao">Avaliação</option>
                <option value="acompanhamento">Acompanhamento (terapêutico ou pedagógico)</option>
                <option value="ambos">Ambos (Avaliação e Acompanhamento)</option>
              </select>
            </label>

            <label className="block space-y-1 text-xs">
              <span className="font-semibold">Registro profissional (CRP/Conselho, se aplicável)</span>
              <input
                placeholder="Ex: CRP 06/123456"
                value={form.registryCode}
                onChange={(e) => setForm({ ...form, registryCode: e.target.value })}
                className="w-full min-h-[44px] rounded-xl border px-3.5 text-sm"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
              />
            </label>
          </div>

          <label className="block space-y-1 text-xs">
            <span className="font-semibold">Alguma informação que gostaria de acrescentar sobre o seu trabalho?</span>
            <textarea
              rows={3}
              placeholder="Outras qualificações, equipe multidisciplinar, abordagem ou público atendido..."
              value={form.otherQualifications}
              onChange={(e) => setForm({ ...form, otherQualifications: e.target.value })}
              className="w-full rounded-xl border p-3.5 text-sm"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
            />
          </label>

          <label className="flex items-start gap-3 pt-1 text-xs sm:text-sm">
            <input
              type="checkbox"
              required
              checked={form.acceptedDataPolicy}
              onChange={(e) => setForm({ ...form, acceptedDataPolicy: e.target.checked })}
              className="mt-1 h-4 w-4 shrink-0"
            />
            <span style={{ color: "var(--text-secondary)" }}>
              Li e concordo com a{" "}
              <Link href="/privacidade" target="_blank" className="underline font-semibold" style={{ color: "var(--accent-emerald)" }}>
                Política de Tratamento de Dados (LGPD)
              </Link>{" "}
              e autorizo explicitamente o tratamento e a exposição pública dos dados informados (nome, especialidade,
              registro, localização e contatos profissionais) no diretório do portal após aprovação. *
            </span>
          </label>

          <button type="submit" className="btn-primary min-h-[44px] rounded-md px-6 py-2.5 text-sm font-semibold">
            Enviar para aprovação
          </button>
        </form>
      )}

      {/* Search & Filters */}
      <div className="mt-8 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            placeholder="Buscar por nome, especialidade, abordagem, estado ou cidade..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full max-w-md min-h-[44px] rounded-xl border px-4 text-sm"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
          />
          <select
            aria-label="Filtrar por região"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="min-h-[44px] rounded-xl border px-3.5 text-sm"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                Região: {r}
              </option>
            ))}
          </select>
          <select
            aria-label="Filtrar por tipo de atuação"
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="min-h-[44px] rounded-xl border px-3.5 text-sm"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
          >
            <option value="todos">Atuação: Todas</option>
            <option value="avaliacao">Avaliação</option>
            <option value="acompanhamento">Acompanhamento (terapêutico/pedagógico)</option>
            <option value="ambos">Ambos</option>
          </select>
          <label className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border px-3.5 text-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
            <input type="checkbox" checked={onlineOnly} onChange={(e) => setOnlineOnly(e.target.checked)} />
            <span>Atendimento Online</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          {SPECIALTY_FILTERS.map((spec) => (
            <button
              key={spec.key}
              type="button"
              onClick={() => setSpecialtyFilter(spec.key)}
              className="min-h-[38px] rounded-md border px-3.5 py-1.5 text-xs font-semibold transition-colors"
              style={{
                backgroundColor: specialtyFilter === spec.key ? "var(--accent-emerald)" : "var(--bg-card)",
                color: specialtyFilter === spec.key ? "#FFFFFF" : "var(--text-primary)",
                borderColor: specialtyFilter === spec.key ? "var(--accent-emerald)" : "var(--border-subtle)",
              }}
            >
              {spec.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <span>
            {filtered.length === 1
              ? "1 profissional encontrado"
              : `${filtered.length} profissionais encontrados`}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-md border px-3 py-1 font-semibold transition-colors hover:opacity-80"
              style={{ borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Professionals Grid */}
      {filtered.length === 0 ? (
        <div
          className="mt-8 rounded-xl border p-8 text-center text-sm space-y-3"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
        >
          <p>Nenhum profissional encontrado com os filtros selecionados.</p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="btn-secondary inline-flex min-h-[38px] items-center rounded-md px-4 py-1.5 text-xs font-semibold"
            >
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.id} className="editorial-card rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold">{p.name}</h2>
              <p className="mt-1 text-xs font-semibold" style={{ color: "var(--accent-emerald)" }}>
                {p.specialty}
              </p>
              <p className="mt-1 text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                {SERVICE_TYPE_LABELS[p.service_type || "ambos"] || "Avaliação e Acompanhamento"}
                {p.approach ? ` · ${p.approach}` : ""}
              </p>
              {p.registry_code && (
                <p className="font-mono-num text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
                  {p.registry_code}
                </p>
              )}

              {(p.other_qualifications || p.bio) && (
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {p.other_qualifications || p.bio}
                </p>
              )}

              <div className="mt-4 space-y-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                {p.whatsapp && (
                  <a
                    href={toWhatsAppHref(p.whatsapp, p.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex min-h-[38px] items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-semibold"
                    title="Abrir conversa no WhatsApp"
                  >
                    <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-mono-num">WhatsApp · {p.whatsapp}</span>
                  </a>
                )}
                {p.email && (
                  <p className="flex items-center gap-2 break-all" style={{ color: "var(--text-muted)" }}>
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span>{p.email}</span>
                  </p>
                )}
              </div>
            </div>

            <div
              className="mt-5 border-t pt-3 flex items-center justify-between gap-2 text-xs"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <span className="inline-flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>{p.city_state || [p.city, p.state].filter(Boolean).join(" - ") || "Brasil"}</span>
              </span>
              {(p.social_url || p.contact_url) && (
                <a
                  href={p.social_url || p.contact_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold underline shrink-0"
                  style={{ color: "var(--accent-emerald)" }}
                >
                  <span>Perfil / Site</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
