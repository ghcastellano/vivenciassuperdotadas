"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ExternalLink, BookOpen, X, ArrowRight } from "lucide-react";
import { GLOSSARY_ITEMS, KNOWLEDGE_ITEMS, type KnowledgeItem } from "@/lib/institutional-data";

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
      <div className="max-w-3xl space-y-3 border-b pb-8" style={{ borderColor: "var(--border-subtle)" }}>
        <p className="font-mono-num text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--accent-emerald)" }}>
          Acervo &amp; Divulgação Científica
        </p>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          Conhecimento, direitos e{" "}
          <em className="italic font-normal" style={{ color: "var(--accent-emerald)" }}>
            ferramentas críticas
          </em>
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Referências baseadas em evidências para combater estereótipos, orientar famílias e educadores — incluindo o
          Atlas de Vieses Cognitivos como instrumento de estudo.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="mt-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const active = selectedCat === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className="min-h-[40px] rounded-lg border px-3.5 py-2 text-xs sm:text-sm font-semibold transition-colors"
              style={{
                backgroundColor: active ? "var(--accent-emerald)" : "transparent",
                color: active ? "#FAF7F2" : "var(--text-secondary)",
                borderColor: active ? "var(--accent-emerald)" : "var(--border-subtle)",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* CatalogIndex (Library / Are.na editorial table) */}
      <div className="mt-8 border-t divide-y" style={{ borderColor: "var(--border-subtle)" }}>
        {filtered.map((item, idx) => {
          const code = `VS-${String(idx + 1).padStart(2, "0")}`;
          return (
            <article
              key={item.id}
              className="grid gap-4 py-6 transition-colors md:grid-cols-[120px_1fr_auto] md:items-start md:gap-8"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-1">
                <span className="font-mono-num text-xs font-semibold" style={{ color: "var(--accent-emerald)" }}>
                  {code}
                </span>
                <span className="font-mono-num text-[11px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  {item.category}
                </span>
              </div>

              <div className="min-w-0 space-y-1.5">
                <h2 className="font-display text-xl font-semibold leading-snug">{item.title}</h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {item.summary}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {item.detail} · <span className="font-mono-num">Fonte: {item.source}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 md:justify-end">
                {item.fullBody && (
                  <button
                    type="button"
                    onClick={() => setActiveArticle(item)}
                    className="btn-primary inline-flex min-h-[40px] items-center gap-2 rounded-md px-4 py-2 text-xs sm:text-sm font-semibold"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Ler guia</span>
                  </button>
                )}
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-editorial inline-flex items-center gap-1.5 py-1.5 text-xs sm:text-sm font-semibold"
                  >
                    <span>Recurso oficial</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  !item.fullBody && (
                    <Link
                      href={item.href}
                      className="link-editorial inline-flex items-center gap-1.5 py-1.5 text-xs sm:text-sm font-semibold"
                    >
                      <span>Acessar no portal</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Glossary as 2-column hairline lexicon */}
      <section id="glossario" className="mt-20 border-t pt-12" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="mb-8 max-w-2xl">
          <p className="font-mono-num text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--accent-emerald)" }}>
            Léxico Desmistificador
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
            Conceitos essenciais sem jargão vazio
          </h2>
        </div>

        <div className="grid gap-x-12 gap-y-6 md:grid-cols-2">
          {GLOSSARY_ITEMS.map((g) => (
            <div key={g.term} className="border-b pb-5" style={{ borderColor: "var(--border-subtle)" }}>
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

      {/* Comfortable Side ReaderDrawer (max 65ch) */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-xs">
          <article
            role="dialog"
            aria-label={activeArticle.title}
            className="h-full w-full max-w-2xl overflow-y-auto border-l p-6 sm:p-10 shadow-2xl flex flex-col justify-between gap-8"
            style={{ backgroundColor: "var(--bg-canvas)", borderColor: "var(--border-subtle)" }}
          >
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 border-b pb-5" style={{ borderColor: "var(--border-subtle)" }}>
                <div>
                  <span className="font-mono-num text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--accent-emerald)" }}>
                    {activeArticle.category}
                  </span>
                  <h2 className="mt-1.5 font-display text-2xl font-semibold leading-snug sm:text-3xl">
                    {activeArticle.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  aria-label="Fechar gaveta de leitura"
                  className="rounded-lg border p-2 hover:bg-black/5"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-w-[65ch] space-y-4 text-base leading-[1.75]" style={{ color: "var(--text-secondary)" }}>
                {activeArticle.fullBody?.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            <div className="border-t pt-5 flex flex-wrap items-center justify-between gap-4" style={{ borderColor: "var(--border-subtle)" }}>
              <span className="font-mono-num text-xs" style={{ color: "var(--text-muted)" }}>
                Fonte: {activeArticle.source}
              </span>
              {activeArticle.officialRefUrl && (
                <a
                  href={activeArticle.officialRefUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex min-h-[42px] items-center gap-2 rounded-md px-4 py-2 text-xs sm:text-sm font-semibold"
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
