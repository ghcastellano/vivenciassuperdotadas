"use client";

import React, { useEffect, useState } from "react";
import { HeartHandshake, Receipt, Server, Landmark, TrendingUp, AlertCircle } from "lucide-react";
import { formatBRL } from "@/lib/format";

interface TransparencyData {
  configured: boolean;
  donationsCents: number;
  salesCents: number;
  stripeFeesCents: number;
  expensesByCategory: Record<string, number>;
  totalExpensesCents: number;
  netBalanceCents: number;
  recentExpenses: {
    id: string;
    category: string;
    description: string;
    amount_cents: number;
    reference_date: string;
  }[];
  recentTransactions: {
    id: string;
    kind: string;
    amount_cents: number;
    description: string;
    created_at: string;
  }[];
}

export default function ApoiePage() {
  const [amountReais, setAmountReais] = useState(35);
  const [recurring, setRecurring] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TransparencyData | null>(null);

  useEffect(() => {
    fetch("/api/transparency")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {});
  }, []);

  const startDonation = async () => {
    setCheckoutError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "donation", amountReais, recurring }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        setCheckoutError(json.error || "Não foi possível iniciar o pagamento.");
        setLoading(false);
        return;
      }
      window.location.href = json.url;
    } catch {
      setCheckoutError("Erro ao conectar com o checkout.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] items-start">
        {/* Donation Box */}
        <section
          className="rounded-2xl border p-6 sm:p-8 space-y-5"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
        >
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-crimson)" }}>
            <HeartHandshake className="h-4 w-4" />
            <span>Apoio via Stripe</span>
          </div>
          <h1 className="font-display text-3xl font-semibold">Apoie o Vivências Superdotadas</h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Sua doação financia domínio, hospedagem, banco de dados, eventos gratuitos e produção de conteúdo científico
            acessível. Tudo entra automaticamente no nosso Painel de Transparência ao lado.
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRecurring(false)}
              className="min-h-[42px] rounded-xl border text-xs sm:text-sm font-semibold"
              style={{
                backgroundColor: !recurring ? "var(--accent-emerald)" : "var(--bg-surface)",
                color: !recurring ? "#FAF7F2" : "var(--text-primary)",
                borderColor: !recurring ? "var(--accent-emerald)" : "var(--border-subtle)",
              }}
            >
              Doação Pontual
            </button>
            <button
              type="button"
              onClick={() => setRecurring(true)}
              className="min-h-[42px] rounded-xl border text-xs sm:text-sm font-semibold"
              style={{
                backgroundColor: recurring ? "var(--accent-emerald)" : "var(--bg-surface)",
                color: recurring ? "#FAF7F2" : "var(--text-primary)",
                borderColor: recurring ? "var(--accent-emerald)" : "var(--border-subtle)",
              }}
            >
              Apoio Mensal
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[20, 35, 60, 120].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setAmountReais(v)}
                className="font-mono-num min-h-[44px] rounded-xl border text-sm font-semibold"
                style={{
                  backgroundColor: amountReais === v ? "var(--bg-surface)" : "transparent",
                  borderColor: amountReais === v ? "var(--accent-emerald)" : "var(--border-subtle)",
                }}
              >
                R$ {v}
              </button>
            ))}
          </div>

          <label className="block space-y-1 text-sm">
            <span style={{ color: "var(--text-secondary)" }}>Outro valor (R$)</span>
            <input
              type="number"
              min={5}
              value={amountReais}
              onChange={(e) => setAmountReais(Number(e.target.value))}
              className="font-mono-num w-full min-h-[44px] rounded-xl border px-3.5 text-sm"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
            />
          </label>

          {checkoutError && (
            <div className="flex items-start gap-2 rounded-xl border p-3 text-xs" style={{ borderColor: "var(--accent-amber)", backgroundColor: "var(--bg-surface)" }}>
              <AlertCircle className="h-4 w-4 shrink-0" style={{ color: "var(--accent-amber)" }} />
              <span>{checkoutError}</span>
            </div>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={startDonation}
            className="btn-primary min-h-[48px] w-full rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-60"
          >
            {loading
              ? "Abrindo Stripe..."
              : `Contribuir com ${formatBRL(amountReais * 100)} ${recurring ? "/ mês" : ""}`}
          </button>
        </section>

        {/* Financial Transparency Panel */}
        <section className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
              Prestação de Contas Aberta
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
              Portal de Transparência Financeira
            </h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              Entradas sincronizadas do Stripe (doações + vendas) e saídas lançadas pela administração (impostos,
              domínio, infraestrutura e custos operacionais).
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
              <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                <span>Entradas em Doações (Stripe)</span>
                <TrendingUp className="h-4 w-4" style={{ color: "var(--accent-emerald)" }} />
              </div>
              <p className="font-mono-num mt-2 text-2xl font-bold" style={{ color: "var(--accent-emerald)" }}>
                {formatBRL(data?.donationsCents || 0)}
              </p>
            </div>

            <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
              <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                <span>Entradas da Lojinha (Stripe)</span>
                <Receipt className="h-4 w-4" style={{ color: "var(--accent-amber)" }} />
              </div>
              <p className="font-mono-num mt-2 text-2xl font-bold">
                {formatBRL(data?.salesCents || 0)}
              </p>
            </div>

            <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
              <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                <span>Impostos & Taxas Stripe</span>
                <Landmark className="h-4 w-4" style={{ color: "var(--accent-crimson)" }} />
              </div>
              <p className="font-mono-num mt-2 text-2xl font-bold" style={{ color: "var(--accent-crimson)" }}>
                {formatBRL((data?.stripeFeesCents || 0) + (data?.expensesByCategory?.impostos || 0))}
              </p>
            </div>

            <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
              <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                <span>Infraestrutura, Domínio & Outros</span>
                <Server className="h-4 w-4" />
              </div>
              <p className="font-mono-num mt-2 text-2xl font-bold">
                {formatBRL(
                  (data?.expensesByCategory?.infraestrutura || 0) +
                    (data?.expensesByCategory?.eventos || 0) +
                    (data?.expensesByCategory?.outros || 0)
                )}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold">Saldo Líquido Disponível para a Associação</span>
              <span className="font-mono-num text-2xl font-bold" style={{ color: "var(--accent-emerald)" }}>
                {formatBRL(data?.netBalanceCents || 0)}
              </span>
            </div>
          </div>

          {data && (data.recentExpenses.length > 0 || data.recentTransactions.length > 0) && (
            <div className="rounded-2xl border p-5 space-y-3" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
              <h3 className="font-display text-lg font-semibold">Últimos registros</h3>
              <ul className="space-y-2 text-xs">
                {data.recentExpenses.map((e) => (
                  <li key={e.id} className="flex justify-between gap-2 border-b pb-1.5" style={{ borderColor: "var(--border-subtle)" }}>
                    <span>
                      <strong className="uppercase">[{e.category}]</strong> {e.description}
                    </span>
                    <span className="font-mono-num shrink-0" style={{ color: "var(--accent-crimson)" }}>
                      - {formatBRL(e.amount_cents)}
                    </span>
                  </li>
                ))}
                {data.recentTransactions.map((t) => (
                  <li key={t.id} className="flex justify-between gap-2 border-b pb-1.5" style={{ borderColor: "var(--border-subtle)" }}>
                    <span>
                      <strong className="uppercase">[{t.kind === "store" ? "lojinha" : "doação"}]</strong>{" "}
                      {t.description}
                    </span>
                    <span className="font-mono-num shrink-0" style={{ color: "var(--accent-emerald)" }}>
                      + {formatBRL(t.amount_cents)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
