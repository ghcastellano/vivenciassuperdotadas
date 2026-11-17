"use client";

import React, { useState } from "react";
import { motion } from "motion/react";

interface AxisPoint {
  label: string;
  value: number; // 0-100
}

interface AsyncProfile {
  id: string;
  code: string;
  label: string;
  summary: string;
  axes: AxisPoint[];
}

const PROFILES: AsyncProfile[] = [
  {
    id: "verbal-exec",
    code: "P-01",
    label: "Alta Abstração & Função Executiva Assíncrona",
    summary:
      "Vocabulário complexo e síntese rápida coexistindo com dificuldade em rotinas burocráticas ou organização sequencial.",
    axes: [
      { label: "Síntese Abstrata", value: 94 },
      { label: "Senso de Justiça", value: 88 },
      { label: "Organização Rotineira", value: 42 },
      { label: "Filtro Sensorial", value: 58 },
      { label: "Tolerância ao Tédio", value: 26 },
    ],
  },
  {
    id: "dupla-2e",
    code: "P-02",
    label: "Dupla Excepcionalidade (AH/SD + TEA ou TDAH)",
    summary:
      "Altas habilidades mascarando dificuldades reais — ou dificuldades encobrindo o potencial elevado por anos.",
    axes: [
      { label: "Síntese Abstrata", value: 90 },
      { label: "Senso de Justiça", value: 92 },
      { label: "Organização Rotineira", value: 34 },
      { label: "Filtro Sensorial", value: 30 },
      { label: "Tolerância ao Tédio", value: 38 },
    ],
  },
  {
    id: "sistemico",
    code: "P-03",
    label: "Pensamento Sistêmico & Hipersensibilidade",
    summary:
      "Percepção aguçada de padrões, emoções alheias e estímulos ambientais (luz, som, textura) com alto custo energético.",
    axes: [
      { label: "Síntese Abstrata", value: 86 },
      { label: "Senso de Justiça", value: 95 },
      { label: "Organização Rotineira", value: 68 },
      { label: "Filtro Sensorial", value: 24 },
      { label: "Tolerância ao Tédio", value: 44 },
    ],
  },
];

export function AssynchronyDiagram() {
  const [idx, setIdx] = useState(0);
  const profile = PROFILES[idx];

  return (
    <div
      className="border p-6 sm:p-8"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
    >
      <div className="flex flex-col justify-between gap-4 border-b pb-5 lg:flex-row lg:items-end" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="max-w-xl">
          <span className="font-mono-num text-[11px] uppercase tracking-widest" style={{ color: "var(--accent-emerald)" }}>
            Modelo Conceitual · Assincronia
          </span>
          <h3 className="mt-1 font-display text-xl sm:text-2xl font-semibold">
            Superdotação não é <em className="italic font-normal">&ldquo;nota 10 em tudo&rdquo;</em>
          </h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {PROFILES.map((p, i) => {
            const active = i === idx;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setIdx(i)}
                className="rounded-lg border px-3 py-1.5 font-mono-num text-xs font-semibold transition-colors"
                style={{
                  borderColor: active ? "var(--accent-emerald)" : "var(--border-subtle)",
                  backgroundColor: active ? "var(--accent-emerald)" : "transparent",
                  color: active ? "#FAF7F2" : "var(--text-secondary)",
                }}
              >
                {p.code}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="font-mono-num text-xs font-semibold" style={{ color: "var(--accent-emerald)" }}>
            {profile.code}
          </p>
          <p className="mt-1 font-display text-lg font-semibold">{profile.label}</p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {profile.summary}
          </p>
          <p className="mt-4 text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Ilustração educativa de variabilidade intraindividual; não constitui instrumento psicométrico.
          </p>
        </div>

        {/* Clean SVG/CSS hairline spectrum bars */}
        <div className="space-y-3.5">
          {profile.axes.map((ax) => (
            <div key={ax.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>{ax.label}</span>
                <span className="font-mono-num text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {ax.value}%
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-surface)" }}>
                <motion.div
                  initial={false}
                  animate={{ width: `${ax.value}%` }}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                  className="h-full"
                  style={{
                    backgroundColor: ax.value < 45 ? "var(--accent-crimson)" : "var(--accent-emerald)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
