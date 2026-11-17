"use client";

import React, { useState } from "react";
import Link from "next/link";

const REGIONS_FORM = ["Norte", "Nordeste", "Centro-oeste", "Sudeste", "Sul", "Exterior"] as const;

export function ProfessionalRegisterForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
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
  });

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!acceptedPrivacy) {
      setError("Você precisa concordar com a Política de Tratamento de Dados para enviar seu cadastro.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/professionals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, acceptedPrivacy }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Não foi possível enviar.");
        setSaving(false);
        return;
      }
      onSuccess();
    } catch {
      setError("Erro de conexão ao enviar cadastro.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={submitForm}
      className="mt-8 editorial-card p-6 sm:p-8 space-y-5"
    >
      <div>
        <h2 className="font-display text-xl font-semibold">Cadastro de Profissional Parceiro</h2>
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
          Preencha seus dados para curadoria pela equipe do Vivências Superdotadas antes da publicação no diretório.
        </p>
      </div>

      {error && (
        <p className="text-xs font-medium" style={{ color: "var(--accent-crimson)" }}>
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <input
          required
          placeholder="Nome completo *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="min-h-[44px] rounded border px-3.5 text-sm"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
        />
        <input
          required
          placeholder="Especialidade (ex: Psicólogo(a), Neuropsicólogo(a)) *"
          value={form.specialty}
          onChange={(e) => setForm({ ...form, specialty: e.target.value })}
          className="min-h-[44px] rounded border px-3.5 text-sm"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
        />
        <select
          value={form.serviceType}
          onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
          className="min-h-[44px] rounded border px-3.5 text-sm"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
        >
          <option value="avaliacao">Faz Avaliação</option>
          <option value="acompanhamento">Faz Acompanhamento (Terapêutico/Pedagógico)</option>
          <option value="ambos">Faz Avaliação e Acompanhamento</option>
        </select>
        <input
          placeholder="Registro profissional (ex: CRP 06/123456)"
          value={form.registryCode}
          onChange={(e) => setForm({ ...form, registryCode: e.target.value })}
          className="min-h-[44px] rounded border px-3.5 text-sm"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
        />
        <select
          value={form.region}
          onChange={(e) => setForm({ ...form, region: e.target.value })}
          className="min-h-[44px] rounded border px-3.5 text-sm"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
        >
          {REGIONS_FORM.map((r) => (
            <option key={r} value={r}>
              Região: {r}
            </option>
          ))}
        </select>
        <input
          required
          placeholder="Estado (UF, ex: SP) *"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
          className="min-h-[44px] rounded border px-3.5 text-sm"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
        />
        <input
          required
          placeholder="Cidade *"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="min-h-[44px] rounded border px-3.5 text-sm"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
        />
        <input
          required
          placeholder="WhatsApp (ex: (11) 99999-9999) *"
          value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          className="min-h-[44px] rounded border px-3.5 text-sm"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
        />
        <input
          required
          type="email"
          placeholder="E-mail profissional *"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="min-h-[44px] rounded border px-3.5 text-sm"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
        />
        <input
          placeholder="Rede social ou site (opcional)"
          value={form.socialUrl}
          onChange={(e) => setForm({ ...form, socialUrl: e.target.value })}
          className="min-h-[44px] rounded border px-3.5 text-sm sm:col-span-2 lg:col-span-3"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
        />
      </div>

      <textarea
        rows={3}
        placeholder="Outras qualificações e apresentação clínica/pedagógica (opcional)"
        value={form.otherQualifications}
        onChange={(e) => setForm({ ...form, otherQualifications: e.target.value })}
        className="w-full rounded border p-3.5 text-sm"
        style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
      />

      <div className="space-y-3 border-t pt-4" style={{ borderColor: "var(--border-subtle)" }}>
        <label className="flex items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={form.onlineAvailable}
            onChange={(e) => setForm({ ...form, onlineAvailable: e.target.checked })}
            className="h-4 w-4"
          />
          <span>Atende na modalidade Online</span>
        </label>

        <label className="flex items-start gap-2.5 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <input
            type="checkbox"
            required
            checked={acceptedPrivacy}
            onChange={(e) => setAcceptedPrivacy(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0"
          />
          <span>
            Li a{" "}
            <Link href="/privacidade" className="underline font-semibold" style={{ color: "var(--accent-emerald)" }}>
              Política de Tratamento de Dados (LGPD)
            </Link>{" "}
            e autorizo explicitamente o armazenamento e a exposição pública dos meus dados profissionais (nome,
            registro, especialidade, cidade/UF, WhatsApp e e-mail) no diretório após aprovação.
          </span>
        </label>
      </div>

      <button type="submit" disabled={saving} className="btn-primary min-h-[44px] px-6 py-2.5 text-sm font-semibold disabled:opacity-60">
        {saving ? "Enviando..." : "Enviar cadastro para análise"}
      </button>
    </form>
  );
}
