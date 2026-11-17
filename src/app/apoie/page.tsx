"use client";

import React, { useEffect, useState } from "react";
import { HeartHandshake, Receipt, Server, Landmark, TrendingUp, ExternalLink } from "lucide-react";
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
  const [data, setData] = useState<TransparencyData | null>(null);

  useEffect(() => {
    fetch("/api/transparency")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start">
        {/* Official APOIA.se Card */}
        <section
          className="rounded-2xl border p-6 sm:p-8 space-y-5"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
        >
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-crimson)" }}>
            <HeartHandshake className="h-4 w-4" />
            <span>Apoio Oficial · APOIA.se</span>
          </div>
          <h1 className="font-display text-3xl font-semibold">Apoie o Vivências Superdotadas</h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Centralizamos nossas doações recorrentes e pontuais no <strong>APOIA.se</strong> para facilitar o apoio da
            comunidade com total segurança.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Sua contribuição financia domínio, hospedagem, banco de dados, eventos gratuitos e produção de conteúdo
            científico acessível — e todas as movimentações e custos ficam visíveis ao lado no nosso Portal de
            Transparência.
          </p>

          <a
            href="https://apoia.se/vivenciassuperdotadas"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
          >
            <span>Apoiar no APOIA.se/vivenciassuperdotadas</span>
            <ExternalLink className="h-4 w-4" />
          </a>

          <a
            href="https://bio.uiclap.com/Vivenciassuperdotadas"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-surface)" }}
          >
            <span>Ou apoie comprando o livro Vivi Goods (UICLAP)</span>
            <ExternalLink className="h-4 w-4" />
          </a>
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
              Entradas da Lojinha (Stripe) e apoios registrados, junto às saídas lançadas pela administração (impostos,
              domínio, infraestrutura e custos operacionais).
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
              <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                <span>Entradas em Doações</span>
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
                <span>Impostos & Taxas</span>
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
