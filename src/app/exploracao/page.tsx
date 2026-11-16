"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Compass, RotateCcw, Stethoscope } from "lucide-react";
import { AHSD_QUESTIONS, LIKERT_OPTIONS, scoreAhsd } from "@/lib/exploration/ahsd-data";
import { cellAt, MATRIX_ITEMS, optionsFor, type CellSpec } from "@/lib/exploration/matrix-engine";

function CellSvg({ spec }: { spec: CellSpec }) {
  const scale = spec.size === 1 ? 0.55 : spec.size === 2 ? 0.8 : 1;
  const fillColor = spec.fill === "solid" ? "#0F5C4D" : spec.fill === "half" ? "url(#halfFill)" : "none";
  const positions: [number, number][] =
    spec.count === 1
      ? [[50, 50]]
      : spec.count === 2
      ? [[32, 50], [68, 50]]
      : spec.count === 3
      ? [[30, 34], [70, 34], [50, 68]]
      : [[32, 32], [68, 32], [32, 68], [68, 68]];

  const r = (spec.count > 1 ? 11 : 18) * scale;

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <defs>
        <linearGradient id="halfFill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="50%" stopColor="#0F5C4D" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
      {positions.map(([cx, cy], idx) => (
        <g key={idx} transform={`translate(${cx},${cy}) rotate(${spec.rotation})`}>
          {spec.shape === "circle" && (
            <circle r={r} fill={fillColor} stroke="#0F5C4D" strokeWidth="3.5" />
          )}
          {spec.shape === "square" && (
            <rect x={-r} y={-r} width={r * 2} height={r * 2} fill={fillColor} stroke="#0F5C4D" strokeWidth="3.5" />
          )}
          {spec.shape === "triangle" && (
            <polygon
              points={`0,${-r * 1.15} ${r * 1.05},${r * 0.9} ${-r * 1.05},${r * 0.9}`}
              fill={fillColor}
              stroke="#0F5C4D"
              strokeWidth="3.5"
            />
          )}
          {spec.shape === "diamond" && (
            <polygon
              points={`0,${-r * 1.15} ${r * 1.1},0 0,${r * 1.15} ${-r * 1.1},0`}
              fill={fillColor}
              stroke="#0F5C4D"
              strokeWidth="3.5"
            />
          )}
          {spec.shape === "cross" && (
            <path
              d={`M${-r * 0.38},${-r} H${r * 0.38} V${-r * 0.38} H${r} V${r * 0.38} H${r * 0.38} V${r} H${-r * 0.38} V${r * 0.38} H${-r} V${-r * 0.38} H${-r * 0.38} Z`}
              fill={fillColor}
              stroke="#0F5C4D"
              strokeWidth="3"
            />
          )}
          {spec.shape === "star" && (
            <polygon
              points={Array.from({ length: 10 }, (_, k) => {
                const rad = k % 2 === 0 ? r * 1.15 : r * 0.48;
                const ang = (Math.PI / 5) * k - Math.PI / 2;
                return `${Math.cos(ang) * rad},${Math.sin(ang) * rad}`;
              }).join(" ")}
              fill={fillColor}
              stroke="#0F5C4D"
              strokeWidth="3"
            />
          )}
        </g>
      ))}
    </svg>
  );
}

export default function ExploracaoPage() {
  const [step, setStep] = useState<"intro" | "ahsd" | "matrix" | "resultado">("intro");
  const [ahsdResponses, setAhsdResponses] = useState<Record<string, number>>({});
  const [matrixIdx, setMatrixIdx] = useState(0);
  const [matrixAnswers, setMatrixAnswers] = useState<Record<number, number>>({});

  const ahsdResult = useMemo(() => scoreAhsd(ahsdResponses), [ahsdResponses]);
  const currentMatrix = MATRIX_ITEMS[matrixIdx];
  const matrixOpts = useMemo(() => optionsFor(currentMatrix, 42), [currentMatrix]);

  const matrixScore = useMemo(() => {
    let correct = 0;
    MATRIX_ITEMS.forEach((it) => {
      const opt = optionsFor(it, 42);
      if (matrixAnswers[it.id] === opt.answerIndex) correct++;
    });
    return correct;
  }, [matrixAnswers]);

  const finishExploration = async () => {
    setStep("resultado");
    try {
      await fetch("/api/exploration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "unificado",
          ahsdScore: Math.round(ahsdResult.overallMean * 100),
          reasoningScore: matrixScore,
          reasoningTotal: MATRIX_ITEMS.length,
        }),
      });
    } catch {
      // non-blocking stats
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-12">
      {/* Permanent Ethical / Non-Diagnostic Banner */}
      <div
        role="note"
        className="mb-8 flex items-start gap-3 rounded-2xl border p-4 sm:p-5"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--accent-crimson)",
        }}
      >
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--accent-crimson)" }} />
        <div className="text-sm leading-relaxed">
          <strong className="block font-semibold">
            Aviso Ético Importante: Exploração Pessoal NÃO é Diagnóstico
          </strong>
          <p style={{ color: "var(--text-secondary)" }}>
            Esta área é 100% aberta (sem senha) para autoexploração educativa. Ela <strong>não substitui</strong>{" "}
            avaliação psicológica ou neuropsicológica oficial. Pela regulamentação do <strong>CRP</strong>, a
            identificação formal de AH/SD envolve instrumentos padronizados (incluindo avaliação de QI privativa de
            psicólogos) e olhar multidimensional clínico.
          </p>
        </div>
      </div>

      {step === "intro" && (
        <div className="space-y-6 rounded-2xl border p-6 sm:p-8" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
            <Compass className="h-4 w-4" />
            <span>Percurso Unificado de Autoexploração</span>
          </div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">
            Exploração Pessoal: Vivências AH/SD & Raciocínio Fluido
          </h1>
          <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Unimos em um só percurso dois olhares complementares usados apenas como ponto de partida reflexivo:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-surface)" }}>
              <h2 className="font-display text-lg font-semibold">1. Indicadores de Vivência AH/SD</h2>
              <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                34 afirmações em seis dimensões (intelectual, criatividade, motivação, liderança, arte e
                psicomotricidade) sem nota de aprovação ou corte.
              </p>
            </div>
            <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-surface)" }}>
              <h2 className="font-display text-lg font-semibold">2. Desafios de Raciocínio Fluido</h2>
              <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                12 matrizes progressivas de padrões visuais, sem cronômetro punitivo. Na avaliação oficial pelo CRP,
                o desempenho cognitivo (QI) também compõe o processo multidimensional.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep("ahsd")}
              className="btn-primary inline-flex min-h-[46px] items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
            >
              <span>Começar Exploração Pessoal</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setStep("matrix")}
              className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <span>Ir direto aos Desafios de Padrões</span>
            </button>
          </div>
        </div>
      )}

      {step === "ahsd" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-semibold sm:text-3xl">
                Etapa 1 · Indicadores de Vivência AH/SD
              </h1>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Respondidas {ahsdResult.answeredCount} de {AHSD_QUESTIONS.length} afirmações.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep("matrix")}
              className="btn-primary inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
            >
              <span>Avançar para Etapa 2 (Padrões)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {AHSD_QUESTIONS.map((q, idx) => (
              <div
                key={q.id}
                className="rounded-2xl border p-4 sm:p-5"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
              >
                <p className="text-sm font-medium sm:text-base">
                  <span className="font-mono-num mr-2 text-xs" style={{ color: "var(--text-muted)" }}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  {q.text}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {LIKERT_OPTIONS.map((opt) => {
                    const selected = ahsdResponses[q.id] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setAhsdResponses((prev) => ({ ...prev, [q.id]: opt.value }))}
                        className="min-h-[40px] rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-colors"
                        style={{
                          backgroundColor: selected ? "var(--accent-emerald)" : "var(--bg-surface)",
                          color: selected ? "#FAF7F2" : "var(--text-primary)",
                          borderColor: selected ? "var(--accent-emerald)" : "var(--border-subtle)",
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setStep("matrix");
              }}
              className="btn-primary inline-flex min-h-[46px] items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
            >
              <span>Continuar para Desafios de Raciocínio Fluido</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === "matrix" && (
        <div className="space-y-6 rounded-2xl border p-5 sm:p-8" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
                Etapa 2 · Raciocínio Fluido e Padrões (Nível: {currentMatrix.tier})
              </p>
              <h1 className="font-display text-2xl font-semibold">
                Matriz {matrixIdx + 1} de {MATRIX_ITEMS.length}
              </h1>
            </div>
            <span className="font-mono-num rounded-lg border px-3 py-1 text-xs" style={{ borderColor: "var(--border-subtle)" }}>
              Sem cronômetro · Ritmo livre
            </span>
          </div>

          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Observe as regras nas linhas e colunas e escolha qual peça completa o espaço vazio (?):
          </p>

          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] items-start">
            {/* 3x3 Matrix */}
            <div className="mx-auto grid w-full max-w-[340px] grid-cols-3 gap-2 rounded-2xl border p-3" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
              {[0, 1, 2].flatMap((row) =>
                [0, 1, 2].map((col) => {
                  const isTarget = row === 2 && col === 2;
                  return (
                    <div
                      key={`${row}-${col}`}
                      className="aspect-square rounded-xl border p-2 flex items-center justify-center"
                      style={{
                        backgroundColor: "var(--bg-card)",
                        borderColor: isTarget ? "var(--accent-amber)" : "var(--border-subtle)",
                      }}
                    >
                      {isTarget ? (
                        <span className="font-display text-2xl font-bold" style={{ color: "var(--accent-amber)" }}>
                          ?
                        </span>
                      ) : (
                        <CellSvg spec={cellAt(currentMatrix, row, col)} />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Options */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Escolha uma alternativa:
              </p>
              <div className="grid grid-cols-3 gap-3">
                {matrixOpts.options.map((opt, idx) => {
                  const selected = matrixAnswers[currentMatrix.id] === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMatrixAnswers((prev) => ({ ...prev, [currentMatrix.id]: idx }))}
                      className="aspect-square rounded-xl border p-2.5 transition-all"
                      style={{
                        backgroundColor: selected ? "var(--bg-surface)" : "var(--bg-canvas)",
                        borderColor: selected ? "var(--accent-emerald)" : "var(--border-subtle)",
                        boxShadow: selected ? "0 0 0 2px var(--accent-emerald)" : "none",
                      }}
                    >
                      <CellSvg spec={opt} />
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap justify-between gap-3 pt-4">
                <button
                  type="button"
                  disabled={matrixIdx === 0}
                  onClick={() => setMatrixIdx((i) => Math.max(0, i - 1))}
                  className="min-h-[44px] rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-40"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  Anterior
                </button>
                {matrixIdx < MATRIX_ITEMS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setMatrixIdx((i) => i + 1)}
                    className="btn-primary min-h-[44px] rounded-xl px-5 py-2 text-sm font-semibold"
                  >
                    Próxima Matriz
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={finishExploration}
                    className="btn-primary inline-flex min-h-[44px] items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Concluir Autoexploração</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === "resultado" && (
        <div className="space-y-6">
          <div className="rounded-2xl border p-6 sm:p-8" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
            <h1 className="font-display text-3xl font-semibold">Síntese da sua Autoexploração</h1>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Estes números refletem apenas suas respostas neste momento. Eles servem para organizar suas observações
              pessoais — <strong>não constituem laudo nem diagnóstico</strong>.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
                  Perfil de Vivências AH/SD
                </p>
                <p className="font-mono-num mt-2 text-3xl font-bold">{ahsdResult.overallMean.toFixed(2)} / 5.00</p>
                <p className="mt-1 text-sm font-semibold">{ahsdResult.label}</p>
              </div>

              <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-amber)" }}>
                  Desafios de Raciocínio Fluido
                </p>
                <p className="font-mono-num mt-2 text-3xl font-bold">
                  {matrixScore} / {MATRIX_ITEMS.length}
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                  Acertos nos padrões visuais progressivos (exercício educativo, sem validade normativa de QI).
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-2.5">
              <h2 className="font-display text-lg font-semibold">Dimensões de destaque no seu autorrelato</h2>
              {ahsdResult.bySubscale.map((sub) => (
                <div key={sub.key} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{sub.name}</span>
                    <span className="font-mono-num font-semibold">{sub.mean.toFixed(2)}</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--bg-surface)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(sub.mean / 5) * 100}%`, backgroundColor: "var(--accent-emerald)" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/profissionais"
                className="btn-primary inline-flex min-h-[46px] items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
              >
                <Stethoscope className="h-4 w-4" />
                <span>Buscar Profissional Parceiro (CRP)</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setAhsdResponses({});
                  setMatrixAnswers({});
                  setMatrixIdx(0);
                  setStep("intro");
                }}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <RotateCcw className="h-4 w-4" />
                <span>Refazer Exploração</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
