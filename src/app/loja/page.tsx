"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ShoppingBag, AlertCircle, Plus, Minus, Trash2, X, ShoppingCart, CheckCircle2 } from "lucide-react";
import { DEFAULT_PRODUCTS } from "@/lib/institutional-data";
import { formatBRL } from "@/lib/format";
import { ImageCurtainReveal } from "@/components/EditorialEffects";

interface CartItem {
  productId: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  variant?: string;
  quantity: number;
}

const CATEGORIES = ["Todas", "Vestuário", "Arte", "Cotidiano"] as const;
const SIZES = ["P", "M", "G", "GG"];

export default function LojaPage() {
  const [category, setCategory] = useState<string>("Todas");
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [error, setError] = useState("");
  const [addedToast, setAddedToast] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("vivencias-cart");
      if (saved) setCart(JSON.parse(saved));
    } catch {
      // ignore storage error
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("vivencias-cart", JSON.stringify(cart));
    } catch {
      // ignore storage error
    }
  }, [cart]);

  const filteredProducts =
    category === "Todas"
      ? DEFAULT_PRODUCTS
      : DEFAULT_PRODUCTS.filter((p) => p.category === category);

  const totalCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
  const subtotalCents = useMemo(
    () => cart.reduce((acc, item) => acc + item.priceCents * item.quantity, 0),
    [cart]
  );

  const addToCart = (product: (typeof DEFAULT_PRODUCTS)[number]) => {
    const variant = product.category === "Vestuário" ? selectedSize : undefined;
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.productId === product.id && i.variant === variant);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          priceCents: product.price_cents,
          imageUrl: product.image_url,
          variant,
          quantity: 1,
        },
      ];
    });
    setAddedToast(`${product.name} adicionado ao carrinho`);
    setTimeout(() => setAddedToast(""), 2400);
  };

  const updateQty = (idx: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item, i) => (i === idx ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (idx: number) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  };

  const checkoutCart = async () => {
    if (cart.length === 0) return;
    setError("");
    setLoadingCheckout(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "store",
          items: cart.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            variant: i.variant,
          })),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        setError(json.error || "Não foi possível abrir o checkout.");
        setLoadingCheckout(false);
        return;
      }
      window.location.href = json.url;
    } catch {
      setError("Erro ao conectar com o Stripe.");
      setLoadingCheckout(false);
    }
  };

  const CartItemsBody = () => (
    <div className="space-y-3">
      {cart.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
          Seu carrinho está vazio. Clique em “Adicionar” nos produtos ao lado.
        </p>
      ) : (
        cart.map((item, idx) => (
          <div
            key={`${item.productId}-${item.variant || "std"}`}
            className="flex items-center gap-3 rounded-xl border p-2.5"
            style={{ backgroundColor: "var(--bg-canvas)", borderColor: "var(--border-subtle)" }}
          >
            <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold">{item.name}</p>
              {item.variant && (
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  Tam: {item.variant}
                </p>
              )}
              <p className="font-mono-num text-xs font-bold">{formatBRL(item.priceCents * item.quantity)}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => updateQty(idx, -1)}
                className="h-7 w-7 rounded-lg border flex items-center justify-center"
                style={{ borderColor: "var(--border-subtle)" }}
                aria-label="Diminuir quantidade"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="font-mono-num w-5 text-center text-xs font-semibold">{item.quantity}</span>
              <button
                type="button"
                onClick={() => updateQty(idx, 1)}
                className="h-7 w-7 rounded-lg border flex items-center justify-center"
                style={{ borderColor: "var(--border-subtle)" }}
                aria-label="Aumentar quantidade"
              >
                <Plus className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="p-1"
                style={{ color: "var(--accent-crimson)" }}
                aria-label="Remover item"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-10">
      <div
        className="flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-end"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-amber)" }}>
            Sustentabilidade da Associação
          </p>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Lojinha Vivências Superdotadas</h1>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            Cada item adquirido ajuda a custear domínio, servidores, eventos gratuitos e produção de conteúdo. Toda
            venda é contabilizada no nosso Portal de Transparência.
          </p>
        </div>

        {/* Mobile/Tablet Drawer Trigger */}
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="btn-primary lg:hidden inline-flex min-h-[46px] shrink-0 items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-semibold"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Carrinho</span>
          <span className="font-mono-num rounded-full bg-white/20 px-2 py-0.5 text-xs">{totalCount}</span>
        </button>
      </div>

      {addedToast && (
        <div
          role="status"
          className="mt-5 flex items-center gap-2 rounded-xl border p-3.5 text-sm"
          style={{ borderColor: "var(--accent-emerald)", backgroundColor: "var(--bg-surface)" }}
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "var(--accent-emerald)" }} />
          <span>{addedToast}</span>
        </div>
      )}

      {/* Category Filter */}
      <div className="mt-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className="min-h-[40px] rounded-xl border px-4 py-1.5 text-xs sm:text-sm font-semibold transition-colors"
            style={{
              backgroundColor: category === cat ? "var(--accent-emerald)" : "var(--bg-card)",
              color: category === cat ? "#FAF7F2" : "var(--text-primary)",
              borderColor: category === cat ? "var(--accent-emerald)" : "var(--border-subtle)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Web Grid: Products + Sticky Cart on the Same Page */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] items-start">
        <div className="grid gap-6 md:grid-cols-2">
          {filteredProducts.map((p) => (
            <article key={p.id} className="editorial-card overflow-hidden rounded-2xl flex flex-col justify-between">
              <div>
                <div className="aspect-[4/3] w-full overflow-hidden bg-black/5">
                  <ImageCurtainReveal src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--accent-emerald)" }}
                  >
                    {p.category}
                  </span>
                  <h2 className="mt-1 font-display text-xl font-semibold">{p.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {p.description}
                  </p>

                  {p.category === "Vestuário" && (
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                        Tamanho:
                      </span>
                      {SIZES.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className="h-8 w-8 rounded-lg border text-xs font-semibold"
                          style={{
                            borderColor: selectedSize === sz ? "var(--accent-emerald)" : "var(--border-subtle)",
                            backgroundColor: selectedSize === sz ? "var(--bg-surface)" : "transparent",
                          }}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 pb-5 flex items-center justify-between gap-3">
                <span className="font-mono-num text-xl font-bold">{formatBRL(p.price_cents)}</span>
                <button
                  type="button"
                  onClick={() => addToCart(p)}
                  className="btn-primary inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Adicionar</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Sticky Inline Cart on Desktop */}
        <aside
          aria-label="Resumo do carrinho"
          className="hidden lg:flex flex-col gap-4 sticky top-24 rounded-2xl border p-5"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
        >
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--border-subtle)" }}>
            <h2 className="font-display text-lg font-semibold flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" style={{ color: "var(--accent-emerald)" }} />
              <span>Seu Carrinho</span>
            </h2>
            <span
              className="font-mono-num rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{ backgroundColor: "var(--bg-surface)", color: "var(--accent-emerald)" }}
            >
              {totalCount} {totalCount === 1 ? "item" : "itens"}
            </span>
          </div>

          <div className="max-h-[380px] overflow-y-auto pr-1">
            <CartItemsBody />
          </div>

          {error && (
            <div
              className="flex items-start gap-2 rounded-xl border p-3 text-xs"
              style={{ borderColor: "var(--accent-amber)", backgroundColor: "var(--bg-surface)" }}
            >
              <AlertCircle className="h-4 w-4 shrink-0" style={{ color: "var(--accent-amber)" }} />
              <span>{error}</span>
            </div>
          )}

          <div className="border-t pt-3 space-y-3" style={{ borderColor: "var(--border-subtle)" }}>
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Subtotal</span>
              <span className="font-mono-num text-xl">{formatBRL(subtotalCents)}</span>
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              100% do resultado líquido entra no Portal de Transparência da associação.
            </p>
            <button
              type="button"
              disabled={cart.length === 0 || loadingCheckout}
              onClick={checkoutCart}
              className="btn-primary min-h-[46px] w-full rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {loadingCheckout ? "Abrindo Stripe Checkout..." : "Finalizar Compra no Stripe"}
            </button>
          </div>
        </aside>
      </div>

      {/* Mobile/Tablet Slide-over Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-xs lg:hidden">
          <aside
            aria-label="Carrinho de compras"
            className="flex h-full w-full max-w-md flex-col justify-between border-l p-6 shadow-2xl"
            style={{ backgroundColor: "var(--bg-canvas)", borderColor: "var(--border-subtle)" }}
          >
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--border-subtle)" }}>
              <h2 className="font-display text-xl font-semibold">Seu Carrinho ({totalCount})</h2>
              <button type="button" onClick={() => setCartOpen(false)} aria-label="Fechar carrinho" className="rounded-lg p-2">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-5">
              <CartItemsBody />
            </div>
            <div className="border-t pt-4 space-y-4" style={{ borderColor: "var(--border-subtle)" }}>
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Subtotal</span>
                <span className="font-mono-num text-xl">{formatBRL(subtotalCents)}</span>
              </div>
              <button
                type="button"
                disabled={cart.length === 0 || loadingCheckout}
                onClick={checkoutCart}
                className="btn-primary min-h-[48px] w-full rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-50"
              >
                {loadingCheckout ? "Abrindo Stripe Checkout..." : "Finalizar Compra no Stripe"}
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
