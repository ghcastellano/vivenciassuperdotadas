"use client";

import React, { useState } from "react";
import { ShoppingBag, AlertCircle } from "lucide-react";
import { DEFAULT_PRODUCTS } from "@/lib/institutional-data";
import { formatBRL } from "@/lib/format";

export default function LojaPage() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const buy = async (productId: string) => {
    setError("");
    setLoadingId(productId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "store", productId }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        setError(json.error || "Não foi possível abrir o checkout.");
        setLoadingId(null);
        return;
      }
      window.location.href = json.url;
    } catch {
      setError("Erro ao conectar com o Stripe.");
      setLoadingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
      <div className="max-w-3xl space-y-3 border-b pb-8" style={{ borderColor: "var(--border-subtle)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-amber)" }}>
          Sustentabilidade da Associação
        </p>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Lojinha Vivências Superdotadas</h1>
        <p className="text-base" style={{ color: "var(--text-secondary)" }}>
          Cada item adquirido ajuda a custear domínio, servidores, eventos gratuitos e produção de conteúdo. Toda venda
          é contabilizada no nosso Portal de Transparência.
        </p>
      </div>

      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-2xl border p-4 text-sm" style={{ borderColor: "var(--accent-amber)", backgroundColor: "var(--bg-surface)" }}>
          <AlertCircle className="h-5 w-5 shrink-0" style={{ color: "var(--accent-amber)" }} />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {DEFAULT_PRODUCTS.map((p) => (
          <article key={p.id} className="editorial-card overflow-hidden rounded-2xl flex flex-col justify-between">
            <div>
              <div className="aspect-[4/3] w-full overflow-hidden bg-black/5">
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
                  {p.category}
                </span>
                <h2 className="mt-1 font-display text-xl font-semibold">{p.name}</h2>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {p.description}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 flex items-center justify-between gap-3">
              <span className="font-mono-num text-xl font-bold">{formatBRL(p.price_cents)}</span>
              <button
                type="button"
                disabled={loadingId === p.id}
                onClick={() => buy(p.id)}
                className="btn-primary inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-60"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{loadingId === p.id ? "Abrindo..." : "Comprar"}</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
