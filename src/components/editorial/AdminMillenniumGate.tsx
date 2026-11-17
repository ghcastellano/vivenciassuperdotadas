"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Lock, Sparkles, Terminal } from "lucide-react";

interface UnsolvedProblem {
  id: string;
  code: string;
  title: string;
  formula: string;
  bounty: string;
  challenge: string;
  verdicts: string[];
}

const PROBLEMS: UnsolvedProblem[] = [
  {
    id: "riemann",
    code: "MP-01 · HILBERT #8",
    title: "A Hipótese de Riemann",
    formula: "ζ(s) = ∑ n⁻ˢ = 0  ⟹  Re(s) = ½",
    bounty: "Em aberto desde 1859 · Prêmio Clay US$ 1.000.000",
    challenge:
      "Demonstre que todos os zeros não-triviais da função zeta de Riemann possuem parte real igual a 1/2.",
    verdicts: [
      "Quase! Você verificou apenas os primeiros 10¹³ zeros (Platt & Trudgian já chegaram lá em 2021). Faltam ∞ − 10¹³.",
      "Passo 3 inválido: a continuação analítica no semiplano Re(s) ≤ 1 recusou a sua passagem por indução.",
      "O Clay Mathematics Institute analisou seu argumento e respondeu com um respeitoso silêncio algébrico.",
      "Belo 'trivial, fica como exercício ao leitor' — mas Riemann tentou esse mesmo truque em 1859 e ainda estamos esperando.",
    ],
  },
  {
    id: "pnp",
    code: "MP-02 · COOK-LEVIN",
    title: "O Problema P vs. NP",
    formula: "P = NP  ∨  P ≠ NP",
    bounty: "Em aberto desde 1971 · Ciência da Computação",
    challenge:
      "Prove de forma construtiva se todo problema cuja solução pode ser verificada em tempo polinomial também pode ser resolvido em tempo polinomial.",
    verdicts: [
      "Atenção: sua redução polinomial colapsou a hierarquia polinomial inteira e derrubou a criptografia RSA do servidor.",
      "Contraexemplo detectado: seu algoritmo resolveu 3-SAT em O(n²), mas apenas quando n ≤ 3.",
      "Relativização barrada pelo Teorema de Baker–Gill–Solovay. Tente um argumento não-relativizante!",
    ],
  },
  {
    id: "collatz",
    code: "MP-03 · 3n + 1",
    title: "Conjectura de Collatz",
    formula: "f(n) = n/2 (par) | 3n+1 (ímpar)  ⟹  1",
    bounty: "Em aberto desde 1937 · \"A matemática não está pronta\" — Erdős",
    challenge:
      "Prove que, para absolutamente todo inteiro positivo n ∈ ℕ, a sequência eventualmente atinge o ciclo 4 → 2 → 1.",
    verdicts: [
      "Terence Tao provou que vale para 'quase todos' os números em 2019. Infelizmente 'quase todos' ainda deixa espaço para ∞ contraexemplos.",
      "Seu caso base n = 27 subiu até 9.232 em 111 passos e deixou o verificador sem fôlego.",
      "Detectamos um loop secreto suspeito em algum lugar acima de 2⁶⁸. Acesso administrativo negado!",
    ],
  },
];

const ZETA_ZEROS_Y = [42, 68, 92, 118, 144, 168];

export function AdminMillenniumGate() {
  const [problemIdx, setProblemIdx] = useState(0);
  const [proof, setProof] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [checking, setChecking] = useState(false);
  const [verdict, setVerdict] = useState<string | null>(null);

  const current = PROBLEMS[problemIdx];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proof.trim()) return;
    setChecking(true);
    setVerdict(null);
    setTimeout(() => {
      const nextAttempt = attempt + 1;
      setAttempt(nextAttempt);
      setVerdict(current.verdicts[(nextAttempt - 1) % current.verdicts.length]);
      setChecking(false);
    }, 450);
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
      <div
        className="border p-6 sm:p-10 space-y-8"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
      >
        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center border-b pb-8" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 font-mono-num text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--accent-crimson)" }}>
              <Lock className="h-3.5 w-3.5" />
              <span>Acesso Restrito · Portão do Milênio</span>
            </div>

            <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Área exclusiva para admins — ou para quem resolver um{" "}
              <em className="italic font-normal" style={{ color: "var(--accent-emerald)" }}>
                problema impossível
              </em>
              .
            </h1>

            <p className="text-sm leading-relaxed sm:text-base" style={{ color: "var(--text-secondary)" }}>
              Não encontramos permissão administrativa na sua sessão. Para liberar o painel sem ser administrador,
              basta enviar abaixo uma demonstração matemática formal completa e inédita de um dos problemas em aberto
              mais difíceis da história.
            </p>
          </div>

          {/* Animated Critical Strip / Zeta Spiral SVG */}
          <div
            className="relative flex flex-col items-center justify-center border p-5"
            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
          >
            <span className="font-mono-num text-[10px] uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
              Faixa Crítica · Re(s) = ½
            </span>
            <svg width="210" height="190" viewBox="0 0 210 190" fill="none" aria-hidden="true">
              {/* Grid lines */}
              <line x1="20" y1="95" x2="190" y2="95" stroke="currentColor" strokeOpacity="0.16" strokeWidth="1" />
              <line x1="60" y1="15" x2="60" y2="175" stroke="currentColor" strokeOpacity="0.14" strokeDasharray="3 3" />
              <line x1="150" y1="15" x2="150" y2="175" stroke="currentColor" strokeOpacity="0.14" strokeDasharray="3 3" />

              {/* Critical Line Re(s) = 1/2 */}
              <motion.line
                x1="105"
                y1="15"
                x2="105"
                y2="175"
                stroke="#0F5C4D"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />

              {/* Orbiting Zeta curve */}
              <motion.path
                d="M105 95 C 148 95, 162 48, 105 42 C 56 36, 44 128, 105 118 C 156 110, 150 62, 105 68 C 68 72, 72 148, 105 144"
                stroke="#A8322D"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0.4 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              />

              {/* Non-trivial zeros */}
              {ZETA_ZEROS_Y.map((y, idx) => (
                <motion.circle
                  key={y}
                  cx="105"
                  cy={y}
                  r="3.2"
                  fill="#0F5C4D"
                  stroke="#FAF7F2"
                  strokeWidth="1.2"
                  animate={{ scale: [1, 1.35, 1], opacity: [0.75, 1, 0.75] }}
                  transition={{ duration: 2.2, delay: idx * 0.25, repeat: Infinity }}
                />
              ))}
            </svg>
            <span className="font-mono-num text-[10px] mt-1" style={{ color: "var(--accent-emerald)" }}>
              zeros não-triviais → ∞
            </span>
          </div>
        </div>

        {/* Problem Selector */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {PROBLEMS.map((p, idx) => {
              const active = idx === problemIdx;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setProblemIdx(idx);
                    setVerdict(null);
                  }}
                  className="rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors"
                  style={{
                    borderColor: active ? "var(--accent-emerald)" : "var(--border-subtle)",
                    backgroundColor: active ? "var(--accent-emerald)" : "transparent",
                    color: active ? "#FAF7F2" : "var(--text-secondary)",
                  }}
                >
                  {p.title}
                </button>
              );
            })}
          </div>

          <div
            className="border p-5 space-y-2"
            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono-num text-[11px] font-semibold" style={{ color: "var(--accent-emerald)" }}>
                {current.code}
              </span>
              <span className="font-mono-num text-[11px]" style={{ color: "var(--text-muted)" }}>
                {current.bounty}
              </span>
            </div>
            <p className="font-mono-num text-base sm:text-lg font-semibold py-1" style={{ color: "var(--text-primary)" }}>
              {current.formula}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {current.challenge}
            </p>
          </div>
        </div>

        {/* Proof Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="flex items-center gap-2 font-mono-num text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            <Terminal className="h-3.5 w-3.5" />
            <span>Submeter Demonstração Formal (LaTeX ou texto)</span>
          </label>
          <textarea
            rows={3}
            required
            placeholder="Ex.: Seja s = σ + it com ζ(s) = 0 e 0 < σ < 1. Suponha por absurdo que σ ≠ 1/2..."
            value={proof}
            onChange={(e) => setProof(e.target.value)}
            className="w-full rounded-lg border p-3.5 font-mono-num text-xs sm:text-sm focus:outline-none focus:border-[#0F5C4D]"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
          />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="submit"
              disabled={checking}
              className="btn-primary inline-flex min-h-[44px] items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              <span>{checking ? "Verificando axiomas..." : "Verificar Demonstração & Desbloquear"}</span>
            </button>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <Link href="/entrar" className="link-editorial font-semibold inline-flex items-center gap-1">
                <span>Sou admin · Entrar na conta</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/" className="underline" style={{ color: "var(--text-muted)" }}>
                Voltar ao início
              </Link>
            </div>
          </div>
        </form>

        <AnimatePresence mode="wait">
          {verdict && (
            <motion.div
              key={attempt}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="status"
              className="border-l-2 p-4 text-sm leading-relaxed"
              style={{
                borderColor: "var(--accent-crimson)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-primary)",
              }}
            >
              <span className="font-mono-num text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "var(--accent-crimson)" }}>
                Veredicto do Árbitro Formal (Tentativa #{attempt})
              </span>
              {verdict}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
