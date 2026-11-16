"use client";

import React, { useState } from "react";
import { MapPin, Globe, CheckCircle2, Phone, Mail, ExternalLink } from "lucide-react";

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
  bio: string;
  contact_url: string;
}

const REGIONS = [
  "Todas",
  "Norte",
  "Nordeste",
  "Centro-oeste",
  "Sudeste",
  "Sul",
  "Não atendo presencialmente.",
] as const;

export function ProfissionaisClient({ initialPartners }: { initialPartners: PartnerItem[] }) {
  const [partners] = useState<PartnerItem[]>(initialPartners);
  const [filter, setFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("Todas");
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
    name: "",
    registryCode: "",
    whatsapp: "",
    email: "",
    socialUrl: "",
    otherQualifications: "",
  });

  const filtered = partners.filter((p) => {
    const q = filter.toLowerCase();
    const matchesText =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.specialty.toLowerCase().includes(q) ||
      (p.city_state || "").toLowerCase().includes(q) ||
      (p.state || "").toLowerCase().includes(q) ||
      (p.city || "").toLowerCase().includes(q) ||
      (p.other_qualifications || "").toLowerCase().includes(q);
    const matchesRegion = regionFilter === "Todas" || (p.region || "").toLowerCase() === regionFilter.toLowerCase();
    const matchesOnline = !onlineOnly || p.online_available;
    return matchesText && matchesRegion && matchesOnline;
  });

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
          className="btn-primary min-h-[44px] shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold"
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

          <button type="submit" className="btn-primary min-h-[44px] rounded-xl px-6 py-2.5 text-sm font-semibold">
            Enviar para aprovação
          </button>
        </form>
      )}

      {/* Search & Filters */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Buscar por nome, especialidade, estado ou cidade..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-sm min-h-[44px] rounded-xl border px-4 text-sm"
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
        <label className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border px-3.5 text-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
          <input type="checkbox" checked={onlineOnly} onChange={(e) => setOnlineOnly(e.target.checked)} />
          <span>Atendimento Online</span>
        </label>
      </div>

      {/* Professionals Grid */}
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.id} className="editorial-card rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className="rounded-lg px-2.5 py-1 text-xs font-semibold"
                  style={{ backgroundColor: "var(--bg-surface)", color: "var(--accent-emerald)" }}
                >
                  {p.specialty}
                </span>
                {p.online_available && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: "var(--accent-emerald)" }}>
                    <Globe className="h-3.5 w-3.5" /> Online
                  </span>
                )}
              </div>

              <h2 className="mt-3 font-display text-xl font-semibold">{p.name}</h2>
              {p.registry_code && (
                <p className="font-mono-num text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {p.registry_code}
                </p>
              )}

              {(p.other_qualifications || p.bio) && (
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {p.other_qualifications || p.bio}
                </p>
              )}

              <div className="mt-4 space-y-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                {p.whatsapp && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--accent-emerald)" }} />
                    <span className="font-mono-num">{p.whatsapp}</span>
                  </p>
                )}
                {p.email && (
                  <p className="flex items-center gap-2 break-all">
                    <Mail className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--accent-crimson)" }} />
                    <span>{p.email}</span>
                  </p>
                )}
              </div>
            </div>

            <div
              className="mt-4 border-t pt-3 flex items-center justify-between gap-2 text-xs"
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
    </div>
  );
}
