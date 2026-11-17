"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Link2, MessageSquareQuote, MessageCircle, ExternalLink, CheckCircle2, Users } from "lucide-react";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import type { AvatarConfig } from "@/lib/avatar";
import { ImageCurtainReveal } from "@/components/EditorialEffects";

export interface MemberAvatarCard {
  id: string;
  avatar_config: Partial<AvatarConfig> | null;
  neurodivergences: string[];
}

export interface CommunitySubmissionItem {
  id: string;
  author_name: string;
  author_avatar: Partial<AvatarConfig> | null;
  author_neurodivergences: string[];
  kind: string;
  title: string;
  content: string;
  external_url: string;
  image_url: string;
  credits: string;
  created_at: string;
  isMock?: boolean;
}

export function ComunidadeClient({
  initialSubmissions,
  initialMembers = [],
  totalMembers = 0,
}: {
  initialSubmissions: CommunitySubmissionItem[];
  initialMembers?: MemberAvatarCard[];
  totalMembers?: number;
}) {
  const [submissions] = useState<CommunitySubmissionItem[]>(initialSubmissions);
  const [kindFilter, setKindFilter] = useState("todos");
  const [showAllAvatars, setShowAllAvatars] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    kind: "relato",
    title: "",
    content: "",
    externalUrl: "",
    imageUrl: "",
    credits: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const res = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erro ao enviar.");
      return;
    }
    setMessage("Enviado com sucesso! Sua publicação entrará no ar após aprovação dos administradores.");
    setForm({ kind: "relato", title: "", content: "", externalUrl: "", imageUrl: "", credits: "" });
    setFormOpen(false);
  };

  const filtered = kindFilter === "todos" ? submissions : submissions.filter((s) => s.kind === kindFilter);

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-10">
      <div
        className="flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-end"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
            Voz em Primeira Pessoa & Criações
          </p>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Comunidade Vivências</h1>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            Espaço para artes, criações, links de conhecimento e relatos em primeira pessoa. Cada publicação traz o
            Avatar Único e as marcas de neurodivergência de quem a criou.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="https://chat.whatsapp.com/IkD3gldncwsBmvSH1j8N6b"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
          >
            <MessageCircle className="h-4 w-4" style={{ color: "var(--accent-emerald)" }} />
            <span>Grupo WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => setFormOpen((v) => !v)}
            className="btn-primary min-h-[44px] rounded-md px-5 py-2.5 text-sm font-semibold"
          >
            {formOpen ? "Fechar envio" : "Enviar arte, link ou relato"}
          </button>
        </div>
      </div>

      {message && (
        <div
          className="mt-6 flex items-center gap-2 rounded-2xl border p-4 text-sm"
          style={{ borderColor: "var(--accent-emerald)", backgroundColor: "var(--bg-surface)" }}
        >
          <CheckCircle2 className="h-5 w-5" style={{ color: "var(--accent-emerald)" }} />
          <span>{message}</span>
        </div>
      )}

      {formOpen && (
        <form
          onSubmit={submit}
          className="mt-8 space-y-4 rounded-2xl border p-6"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl font-semibold">Nova contribuição (moderada pelos admins)</h2>
            <Link href="/entrar" className="text-xs font-semibold underline" style={{ color: "var(--accent-emerald)" }}>
              Precisa estar logado(a) · Entrar com Google ou E-mail
            </Link>
          </div>

          {error && (
            <p className="text-sm font-semibold" style={{ color: "var(--accent-crimson)" }}>
              {error}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <select
              value={form.kind}
              onChange={(e) => setForm({ ...form, kind: e.target.value })}
              className="min-h-[44px] rounded-xl border px-3.5 text-sm"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
            >
              <option value="relato">Relato em Primeira Pessoa (Vivência)</option>
              <option value="arte">Arte ou Criação</option>
              <option value="link">Link de Conhecimento</option>
            </select>
            <input
              required
              placeholder="Título da publicação"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="min-h-[44px] rounded-xl border px-3.5 text-sm"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
            />
            <input
              placeholder="Link externo (opcional — para links de conhecimento ou portfólio)"
              value={form.externalUrl}
              onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
              className="min-h-[44px] rounded-xl border px-3.5 text-sm"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
            />
            <input
              placeholder="URL de imagem (opcional — para artes e criações)"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="min-h-[44px] rounded-xl border px-3.5 text-sm"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
            />
          </div>

          <textarea
            required
            rows={4}
            placeholder="Escreva seu relato, descrição da arte ou resumo do link de conhecimento..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full rounded-xl border p-3.5 text-sm"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
          />
          <input
            placeholder="Créditos / Referência da fonte (opcional)"
            value={form.credits}
            onChange={(e) => setForm({ ...form, credits: e.target.value })}
            className="w-full min-h-[44px] rounded-xl border px-3.5 text-sm"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
          />
          <button type="submit" className="btn-primary min-h-[44px] rounded-md px-6 py-2.5 text-sm font-semibold">
            Enviar para moderação
          </button>
        </form>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        {(
          [
            ["todos", "Tudo"],
            ["relato", "Relatos em 1ª Pessoa"],
            ["arte", "Artes & Criações"],
            ["link", "Links de Conhecimento"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setKindFilter(k)}
            className="min-h-[40px] rounded-md border px-3.5 py-1.5 text-xs sm:text-sm font-semibold"
            style={{
              backgroundColor: kindFilter === k ? "var(--accent-emerald)" : "var(--bg-card)",
              color: kindFilter === k ? "#FFFFFF" : "var(--text-primary)",
              borderColor: kindFilter === k ? "var(--accent-emerald)" : "var(--border-subtle)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          className="mt-6 rounded-2xl border p-8 text-center text-sm"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-subtle)",
            color: "var(--text-muted)",
          }}
        >
          Nenhuma publicação aprovada nesta categoria ainda. Seja a primeira pessoa associada a compartilhar um relato, arte ou link de conhecimento!
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <article key={s.id} className="editorial-card min-w-0 rounded-2xl p-5 flex flex-col justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3 border-b pb-3" style={{ borderColor: "var(--border-subtle)" }}>
                <AvatarDisplay
                  config={s.author_avatar}
                  neurodivergences={s.author_neurodivergences}
                  size={48}
                  showBadges={false}
                />
                <div>
                  <p className="text-sm font-semibold">{s.author_name}</p>
                  <p className="text-[11px] uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
                    {s.kind === "arte" ? "Arte / Criação" : s.kind === "link" ? "Conhecimento" : "1ª Pessoa"}
                  </p>
                </div>
              </div>

              {s.image_url && (
                <div className="mt-4 aspect-[16/10] w-full overflow-hidden rounded-xl">
                  <ImageCurtainReveal src={s.image_url} alt={s.title} className="h-full w-full object-cover" />
                </div>
              )}

              <h2 className="mt-4 font-display text-lg font-semibold flex items-center gap-2 break-words [overflow-wrap:anywhere]">
                {s.kind === "link" ? (
                  <Link2 className="h-4 w-4 shrink-0" />
                ) : (
                  <MessageSquareQuote className="h-4 w-4 shrink-0" />
                )}
                <span className="min-w-0">{s.title}</span>
              </h2>
              <p className="mt-2 text-sm leading-relaxed break-words [overflow-wrap:anywhere]" style={{ color: "var(--text-secondary)" }}>
                {s.content}
              </p>
            </div>

            <div
              className="mt-4 pt-3 border-t text-xs flex items-center justify-between"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <span style={{ color: "var(--text-muted)" }}>{s.credits || "Autoria da comunidade"}</span>
              {s.external_url && (
                <a
                  href={s.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold underline"
                  style={{ color: "var(--accent-emerald)" }}
                >
                  Abrir <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </article>
        ))}
        </div>
      )}

      {/* Mural da Singularidade — Contagem pública e avatares consentidos (sem exposição de nomes) */}
      {(totalMembers > 0 || initialMembers.length > 0) && (() => {
        const displayCount = totalMembers > 0 ? totalMembers : initialMembers.length;
        const AVATAR_PREVIEW_LIMIT = 48;
        const visibleAvatars = showAllAvatars
          ? initialMembers
          : initialMembers.slice(0, AVATAR_PREVIEW_LIMIT);
        const remainingCount = initialMembers.length - visibleAvatars.length;

        return (
          <section className="mt-16 border-t pt-12" style={{ borderColor: "var(--border-subtle)" }}>
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div className="max-w-2xl space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
                  Cada pessoa é única
                </p>
                <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                  Mural da Singularidade — Quem faz o Vivências
                </h2>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Para preservar a privacidade em uma comunidade em crescimento, exibimos apenas a contagem pública de
                  membros e os avatares de quem concordou expressamente em compartilhá-los.
                </p>
              </div>

              <div
                className="inline-flex shrink-0 items-center gap-2.5 rounded-md border px-4 py-2.5"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
              >
                <Users className="h-4 w-4" style={{ color: "var(--accent-emerald)" }} />
                <span className="font-mono-num text-sm font-semibold">
                  {displayCount} {displayCount === 1 ? "pessoa associada" : "pessoas associadas"}
                </span>
              </div>
            </div>

            {visibleAvatars.length > 0 && (
              <div
                className="rounded-xl border p-6"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
              >
                <div className="flex flex-wrap items-center gap-3">
                  {visibleAvatars.map((m) => (
                    <div key={m.id} className="shrink-0">
                      <AvatarDisplay
                        config={m.avatar_config}
                        neurodivergences={m.neurodivergences?.length ? m.neurodivergences : ["ahsd"]}
                        size={56}
                        showBadges={false}
                      />
                    </div>
                  ))}
                  {remainingCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAllAvatars(true)}
                      className="btn-secondary inline-flex h-[64px] items-center rounded-md px-4 text-xs font-semibold"
                    >
                      +{remainingCount} avatares
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>
        );
      })()}
    </div>
  );
}
