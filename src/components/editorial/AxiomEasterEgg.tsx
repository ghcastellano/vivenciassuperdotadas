"use client";

import React, { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";

const AXIOMS = [
  {
    code: "e^{iπ} + 1 = 0",
    title: "Identidade de Euler",
    note: "Cinco constantes fundamentais de domínios distintos reunidas em uma única equação silenciosa — como mentes que conectam arte, lógica e emoção sem fronteiras.",
  },
  {
    code: "ℵ₀ < c",
    title: "Cardinais Transfinitos (Cantor)",
    note: "Mesmo entre infinitos, existem ordens distintas de grandeza e estrutura. Cada perfil cognitivo carrega sua própria topologia.",
  },
  {
    code: "G ⊬ Con(G)",
    title: "Incompletude de Gödel",
    note: "Nenhum sistema formal consistente consegue esgotar todas as verdades sobre si mesmo. Nenhum rótulo único esgota uma pessoa.",
  },
  {
    code: "α⁻¹ ≈ 137.036",
    title: "Constante de Estrutura Fina",
    note: "Um número adimensional puro que governa o quanto a luz interage com a matéria — lembrando que intensidade depende da escala em que se observa.",
  },
];

export function AxiomEasterEgg() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (e.shiftKey && e.key === "?") {
        e.preventDefault();
        setIdx((i) => (i + 1) % AXIOMS.length);
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const current = AXIOMS[idx];

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIdx((i) => (i + 1) % AXIOMS.length);
          setOpen(true);
        }}
        title="Identidade de Euler & Transfinitos — clique ou pressione Shift + ?"
        className="font-mono-num text-[10px] tracking-wider opacity-45 hover:opacity-90 transition-opacity select-none"
        style={{ color: "var(--text-muted)" }}
      >
        e^(iπ) + 1 = 0 · ℵ₀ · № 137
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span
                className="inline-flex items-center gap-1.5 font-mono-num text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--accent-emerald)" }}
              >
                <Sparkles className="h-3.5 w-3.5" /> Sala de Axiomas · Shift + ?
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="flex h-7 w-7 items-center justify-center rounded-full border hover:bg-black/5"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div
              className="rounded-xl border p-4 text-center"
              style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
            >
              <p className="font-mono-num text-xl font-bold tracking-wide" style={{ color: "var(--accent-emerald)" }}>
                {current.code}
              </p>
              <p className="mt-1 font-display text-base font-semibold">{current.title}</p>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {current.note}
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="font-mono-num text-[11px]" style={{ color: "var(--text-muted)" }}>
                Axioma {idx + 1} / {AXIOMS.length}
              </span>
              <button
                type="button"
                onClick={() => setIdx((i) => (i + 1) % AXIOMS.length)}
                className="btn-secondary rounded-md px-3.5 py-1.5 text-xs font-semibold"
              >
                Próximo axioma →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
