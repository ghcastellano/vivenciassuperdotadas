"use client";

import React, { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CheckCircle2, UserPlus } from "lucide-react";
import {
  filterProfessionals,
  REGIONS,
  SPECIALTY_FILTERS,
  type PartnerItem,
} from "@/lib/professionals-filter";
import { ProfessionalCard } from "@/components/professionals/ProfessionalCard";
import { ProfessionalRegisterForm } from "@/components/professionals/ProfessionalRegisterForm";

export type { PartnerItem };

export function ProfissionaisClient({ initialPartners }: { initialPartners: PartnerItem[] }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [partners] = useState<PartnerItem[]>(initialPartners);
  const [queryText, setQueryText] = useState("");
  const [regionFilter, setRegionFilter] = useState("Todas");
  const [specialtyFilter, setSpecialtyFilter] = useState("todas");
  const [serviceFilter, setServiceFilter] = useState("todos");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filtered = useMemo(
    () =>
      filterProfessionals(partners, {
        query: queryText,
        region: regionFilter,
        specialtyKey: specialtyFilter,
        serviceType: serviceFilter,
        onlineOnly,
      }),
    [partners, queryText, regionFilter, specialtyFilter, serviceFilter, onlineOnly]
  );

  const hasActiveFilters =
    queryText !== "" ||
    regionFilter !== "Todas" ||
    specialtyFilter !== "todas" ||
    serviceFilter !== "todos" ||
    onlineOnly;

  const clearFilters = () => {
    setQueryText("");
    setRegionFilter("Todas");
    setSpecialtyFilter("todas");
    setServiceFilter("todos");
    setOnlineOnly(false);
  };

  const handleRegisterClick = (scrollToForm = false) => {
    if (!session?.user) {
      router.push("/entrar?callbackUrl=/profissionais");
      return;
    }
    if (scrollToForm) {
      setFormOpen(true);
      setTimeout(() => {
        document.getElementById("cadastro-profissional")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    } else {
      setFormOpen((v) => !v);
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-10">
      <div
        className="flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-end"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="max-w-2xl space-y-3">
          <p className="font-mono-num text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--accent-emerald)" }}>
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
          onClick={() => handleRegisterClick(false)}
          className="btn-secondary inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold"
        >
          <UserPlus className="h-4 w-4" />
          <span>{formOpen ? "Fechar cadastro" : "Sou profissional · Cadastrar-se"}</span>
        </button>
      </div>

      <div id="cadastro-profissional" />

      {submitted && (
        <div
          className="mt-6 flex items-center gap-3 rounded border p-4 text-sm"
          style={{ borderColor: "var(--accent-emerald)", backgroundColor: "var(--bg-card)" }}
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: "var(--accent-emerald)" }} />
          <span>
            Cadastro recebido! Nossa equipe fará a curadoria e validação ética antes de publicar no diretório.
          </span>
        </div>
      )}

      {formOpen && (
        <ProfessionalRegisterForm
          onSuccess={() => {
            setSubmitted(true);
            setFormOpen(false);
          }}
        />
      )}

      {/* Search & Filters */}
      <div className="mt-8 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            placeholder="Buscar por nome, especialidade, abordagem, estado ou cidade..."
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            aria-label="Buscar profissionais"
            className="min-h-[44px] flex-1 min-w-[240px] rounded border px-4 text-sm"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
          />
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            aria-label="Filtrar por região"
            className="min-h-[44px] rounded border px-3.5 text-sm"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
          >
            {REGIONS.map((reg) => (
              <option key={reg} value={reg}>
                Região: {reg}
              </option>
            ))}
          </select>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            aria-label="Filtrar por tipo de atuação"
            className="min-h-[44px] rounded border px-3.5 text-sm"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
          >
            <option value="todos">Atuação: Todas</option>
            <option value="avaliacao">Faz Avaliação</option>
            <option value="acompanhamento">Faz Acompanhamento</option>
            <option value="ambos">Avaliação e Acompanhamento</option>
          </select>
          <label
            className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded border px-3.5 text-sm"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
          >
            <input
              type="checkbox"
              checked={onlineOnly}
              onChange={(e) => setOnlineOnly(e.target.checked)}
              className="h-4 w-4"
            />
            <span>Atendimento Online</span>
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {SPECIALTY_FILTERS.map((spec) => {
              const active = specialtyFilter === spec.key;
              return (
                <button
                  key={spec.key}
                  type="button"
                  onClick={() => setSpecialtyFilter(spec.key)}
                  className="min-h-[36px] rounded border px-3 py-1 text-xs font-semibold transition-colors"
                  style={{
                    borderColor: active ? "var(--accent-emerald)" : "var(--border-subtle)",
                    backgroundColor: active ? "var(--accent-emerald)" : "var(--bg-card)",
                    color: active ? "#FAF7F2" : "var(--text-primary)",
                  }}
                >
                  {spec.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
            <span className="font-mono-num">
              {filtered.length} {filtered.length === 1 ? "profissional" : "profissionais"}
            </span>
            {hasActiveFilters && (
              <button type="button" onClick={clearFilters} className="underline font-semibold" style={{ color: "var(--accent-crimson)" }}>
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Professionals Grid */}
      {filtered.length === 0 ? (
        <div className="mt-8 editorial-card p-10 text-center space-y-3">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Nenhum profissional encontrado com os filtros selecionados.
          </p>
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="btn-secondary px-4 py-2 text-xs font-semibold">
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProfessionalCard key={p.id} partner={p} />
          ))}
        </div>
      )}

      {/* Convite dedicado para profissionais após a grade */}
      <section
        className="mt-14 rounded-2xl border p-6 sm:p-8 flex flex-col justify-between gap-6 md:flex-row md:items-center"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
      >
        <div className="max-w-xl space-y-1.5">
          <p className="font-mono-num text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--accent-emerald)" }}>
            Rede de Encaminhamento Ético
          </p>
          <h2 className="font-display text-xl font-semibold sm:text-2xl">
            Atende pessoas com AH/SD ou Dupla Excepcionalidade?
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Psicólogos(as), neuropsicólogos(as), psicopedagogos(as) e educadores(as) podem solicitar inclusão gratuita no
            diretório oficial após validação da diretoria.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleRegisterClick(true)}
          className="btn-primary inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold"
        >
          <UserPlus className="h-4 w-4" />
          <span>Quero me cadastrar</span>
        </button>
      </section>
    </div>
  );
}
