"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ExternalLink, BookOpen, Sparkles } from "lucide-react";
import { GLOSSARY_ITEMS, KNOWLEDGE_ITEMS } from "@/lib/institutional-data";
import { SpotlightCard } from "@/components/ReactBitsText";

const CATEGORIES = ["Todas", "Ferramenta Interativa", "Ciência & Mitos", "Direitos & Políticas", "Neuroinclusão"] as const;

export default function ConhecimentoPage() {
  const [selectedCat, setSelectedCat] = useState<string>("Todas");

  const filtered =
    selectedCat === "Todas"
      ? KNOWLEDGE_ITEMS
      : KNOWLEDGE_ITEMS.filter((item) => item.category === selectedCat);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
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
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold underline"
                  style={{ color: "var(--accent-emerald)" }}
                >
                  <span>Abrir recurso externo</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                <Link
                  href={item.href}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold underline"
                  style={{ color: "var(--accent-emerald)" }}
                >
                  <span>Ler mais no portal</span>
                </Link>
              )}
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
    </div>
  );
}
