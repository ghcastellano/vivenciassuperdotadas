"use client";

import React, { useEffect, useState } from "react";
import { Stethoscope, MapPin, Globe, CheckCircle2 } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  registry_code: string;
  specialty: string;
  approach: string;
  city_state: string;
  online_available: boolean;
  bio: string;
  contact_url: string;
}

export default function ProfissionaisPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filter, setFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    registryCode: "",
    specialty: "Neuropsicologia / Avaliação AH/SD",
    approach: "",
    cityState: "",
    onlineAvailable: true,
    bio: "",
    contactUrl: "",
  });

  useEffect(() => {
    fetch("/api/professionals")
      .then((r) => r.json())
      .then((d) => setPartners(d.professionals || []))
      .catch(() => {});
  }, []);

  const filtered = partners.filter((p) => {
    const q = filter.toLowerCase();
    return (
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.specialty.toLowerCase().includes(q) ||
      p.city_state.toLowerCase().includes(q) ||
      p.approach.toLowerCase().includes(q)
    );
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
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
      <div className="flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-end" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
            Rede de Cuidado Baseada em Evidências
          </p>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Profissionais Parceiros</h1>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            Psicólogos(as), neuropsicólogos(as), psiquiatras e educadores(as) verificados pela administração para
            avaliação oficial (CRP) e acompanhamento clínico ou educacional.
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
        <div className="mt-6 flex items-center gap-3 rounded-2xl border p-4 text-sm" style={{ borderColor: "var(--accent-emerald)", backgroundColor: "var(--bg-surface)" }}>
          <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: "var(--accent-emerald)" }} />
          <span>
            Submissão recebida! Seu perfil será revisado pelos administradores e publicado após aprovação do registro
            profissional.
          </span>
        </div>
      )}

      {formOpen && (
        <form
          onSubmit={submitForm}
          className="mt-8 space-y-4 rounded-2xl border p-6"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
        >
          <h2 className="font-display text-xl font-semibold">Cadastro de Profissional Parceiro</h2>
          {error && <p className="text-sm font-medium" style={{ color: "var(--accent-crimson)" }}>{error}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              placeholder="Nome completo"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="min-h-[44px] rounded-xl border px-3.5 text-sm"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
            />
            <input
              required
              type="email"
              placeholder="E-mail profissional"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="min-h-[44px] rounded-xl border px-3.5 text-sm"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
            />
            <input
              required
              placeholder="Registro (ex: CRP 06/123456, CRM, etc.)"
              value={form.registryCode}
              onChange={(e) => setForm({ ...form, registryCode: e.target.value })}
              className="min-h-[44px] rounded-xl border px-3.5 text-sm"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
            />
            <input
              required
              placeholder="Especialidade (ex: Avaliação Neuropsicológica AH/SD)"
              value={form.specialty}
              onChange={(e) => setForm({ ...form, specialty: e.target.value })}
              className="min-h-[44px] rounded-xl border px-3.5 text-sm"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
            />
            <input
              required
              placeholder="Abordagem baseada em evidências (ex: TCC, Neuropsicologia)"
              value={form.approach}
              onChange={(e) => setForm({ ...form, approach: e.target.value })}
              className="min-h-[44px] rounded-xl border px-3.5 text-sm"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
            />
            <input
              placeholder="Cidade / UF (ex: São Paulo - SP)"
              value={form.cityState}
              onChange={(e) => setForm({ ...form, cityState: e.target.value })}
              className="min-h-[44px] rounded-xl border px-3.5 text-sm"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
            />
            <input
              placeholder="Site, Instagram ou link de agendamento"
              value={form.contactUrl}
              onChange={(e) => setForm({ ...form, contactUrl: e.target.value })}
              className="min-h-[44px] rounded-xl border px-3.5 text-sm sm:col-span-2"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
            />
          </div>
          <textarea
            required
            rows={3}
            placeholder="Breve apresentação da sua experiência com AH/SD e neurodivergências..."
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full rounded-xl border p-3.5 text-sm"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.onlineAvailable}
              onChange={(e) => setForm({ ...form, onlineAvailable: e.target.checked })}
            />
            <span>Realizo atendimento online</span>
          </label>
          <button type="submit" className="btn-primary min-h-[44px] rounded-xl px-6 py-2.5 text-sm font-semibold">
            Enviar para aprovação
          </button>
        </form>
      )}

      {/* Search */}
      <div className="mt-8">
        <input
          type="search"
          placeholder="Filtrar por nome, especialidade, abordagem ou cidade..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-md min-h-[44px] rounded-xl border px-4 text-sm"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
        />
      </div>

      {/* Directory */}
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 rounded-2xl border p-8 text-center" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}>
            <Stethoscope className="mx-auto h-8 w-8" style={{ color: "var(--accent-emerald)" }} />
            <p className="mt-3 font-display text-lg font-semibold">Rede em credenciamento</p>
            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              Os perfis aprovados pela administração aparecerão aqui. Se você é profissional qualificado(a), clique em
              “Sou profissional · Quero me cadastrar”.
            </p>
          </div>
        ) : (
          filtered.map((p) => (
            <div key={p.id} className="editorial-card rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-num rounded-lg px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: "var(--bg-surface)", color: "var(--accent-emerald)" }}>
                    {p.registry_code}
                  </span>
                  {p.online_available && (
                    <span className="inline-flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                      <Globe className="h-3.5 w-3.5" /> Online
                    </span>
                  )}
                </div>
                <h2 className="mt-3 font-display text-xl font-semibold">{p.name}</h2>
                <p className="text-sm font-medium" style={{ color: "var(--accent-crimson)" }}>{p.specialty}</p>
                <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>Abordagem: {p.approach}</p>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{p.bio}</p>
              </div>
              <div className="mt-4 border-t pt-3 flex items-center justify-between text-xs" style={{ borderColor: "var(--border-subtle)" }}>
                <span className="inline-flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                  <MapPin className="h-3.5 w-3.5" /> {p.city_state || "Brasil"}
                </span>
                {p.contact_url && (
                  <a href={p.contact_url} target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: "var(--accent-emerald)" }}>
                    Contato
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
