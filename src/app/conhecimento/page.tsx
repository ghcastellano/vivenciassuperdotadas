"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ExternalLink, BookOpen, Sparkles, X } from "lucide-react";
import { GLOSSARY_ITEMS, KNOWLEDGE_ITEMS, type KnowledgeItem } from "@/lib/institutional-data";
import { SpotlightCard } from "@/components/ReactBitsText";

const CATEGORIES = ["Todas", "Ferramenta Interativa", "Ciência & Mitos", "Direitos & Políticas", "Neuroinclusão"] as const;

export default function ConhecimentoPage() {
  const [selectedCat, setSelectedCat] = useState<string>("Todas");
  const [activeArticle, setActiveArticle] = useState<KnowledgeItem | null>(null);

  const filtered =
    selectedCat === "Todas"
      ? KNOWLEDGE_ITEMS
      : KNOWLEDGE_ITEMS.filter((item) => item.category === selectedCat);

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-10">
      <div className="max-w-3xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
          Área de Conhecimento
        </p>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          Divulgação científica, direitos e ferramentas críticas
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Reunimos referências baseadas em evidências para combater estereótipos, orientar famílias e educadores e
          oferecer instrumentos práticos — incluindo o Atlas de Vieses Cognitivos como um dos nossos itens de estudo.
        </p>
      </div>

      {/* Category filter */}
      <div className="mt-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCat(cat)}
            className="min-h-[40px] rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-semibold transition-colors"
            style={{
              backgroundColor: selectedCat === cat ? "var(--accent-emerald)" : "var(--bg-card)",
              color: selectedCat === cat ? "#FAF7F2" : "var(--text-primary)",
              borderColor: selectedCat === cat ? "var(--accent-emerald)" : "var(--border-subtle)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Knowledge Cards */}
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <SpotlightCard key={item.id} className="flex flex-col justify-between p-6">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    color: item.featured ? "var(--accent-crimson)" : "var(--accent-emerald)",
                  }}
                >
                  {item.featured ? <Sparkles className="h-3 w-3" /> : <BookOpen className="h-3 w-3" />}
                  {item.category}
                </span>
              </div>
              <h2 className="mt-3 font-display text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {item.summary}
              </p>
              <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {item.detail}
              </p>
            </div>

            <div className="mt-5 border-t pt-4" style={{ borderColor: "var(--border-subtle)" }}>
              <p className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
                Fonte: {item.source}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-4">
                {item.fullBody && (
                  <button
                    type="button"
                    onClick={() => setActiveArticle(item)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold underline"
                    style={{ color: "var(--accent-emerald)" }}
                  >
                    Ler guia completo
                  </button>
                )}
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold underline"
                    style={{ color: item.fullBody ? "var(--accent-crimson)" : "var(--accent-emerald)" }}
                  >
                    <span>Abrir recurso oficial</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  !item.fullBody && (
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold underline"
                      style={{ color: "var(--accent-emerald)" }}
                    >
                      <span>Acessar no portal</span>
                    </Link>
                  )
                )}
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* Glossary */}
      <section id="glossario" className="mt-16">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-amber)" }}>
            Glossário Desmistificador
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold">Conceitos essenciais sem jargão vazio</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {GLOSSARY_ITEMS.map((g) => (
            <div
              key={g.term}
              className="rounded-2xl border p-5"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
            >
              <h3 className="font-display text-lg font-semibold" style={{ color: "var(--accent-emerald)" }}>
                {g.term}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {g.definition}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Distraction-free Article Reading Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <article
            role="dialog"
            aria-label={activeArticle.title}
            className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl border p-6 sm:p-8 shadow-2xl space-y-5"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
          >
            <div className="flex items-start justify-between gap-4 border-b pb-4" style={{ borderColor: "var(--border-subtle)" }}>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
                  {activeArticle.category}
                </span>
                <h2 className="mt-1 font-display text-2xl font-semibold">{activeArticle.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                aria-label="Fechar leitura"
                className="rounded-lg p-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {activeArticle.fullBody?.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="border-t pt-4 flex flex-wrap items-center justify-between gap-3" style={{ borderColor: "var(--border-subtle)" }}>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                Fonte: {activeArticle.source}
              </span>
              {activeArticle.officialRefUrl && (
                <a
                  href={activeArticle.officialRefUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex min-h-[40px] items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold"
                >
                  <span>{activeArticle.officialRefLabel || "Ver fonte oficial"}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
