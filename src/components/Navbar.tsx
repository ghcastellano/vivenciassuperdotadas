"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SlidersHorizontal,
  Sun,
  Moon,
  Menu,
  X,
  Eye,
  Sparkles,
  Type,
  User,
} from "lucide-react";
import { useSensory } from "@/components/SensoryProvider";

const NAV_LINKS = [
  { href: "/sobre", label: "Associação" },
  { href: "/exploracao", label: "Exploração" },
  { href: "/conhecimento", label: "Conhecimento" },
  { href: "/profissionais", label: "Profissionais" },
  { href: "/eventos", label: "Eventos" },
  { href: "/comunidade", label: "Comunidade" },
  { href: "/apoie", label: "Apoie & Transparência" },
  { href: "/loja", label: "Lojinha" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sensoryOpen, setSensoryOpen] = useState(false);
  const {
    theme,
    font,
    textScale,
    reducedMotion,
    focusMode,
    customCursor,
    setTheme,
    setFont,
    setTextScale,
    setReducedMotion,
    setFocusMode,
    setCustomCursor,
  } = useSensory();

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{
        backgroundColor: theme === "dark" ? "rgba(18, 22, 25, 0.90)" : "rgba(250, 247, 242, 0.92)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="flex min-h-[44px] items-center gap-3 font-display text-lg font-semibold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          <img
            src="/images/logo-vivencias.jpg"
            alt="Logo Vivências Superdotadas"
            className="h-9 w-9 rounded-lg object-cover border"
            style={{ borderColor: "var(--border-subtle)" }}
          />
          <span className="hidden sm:inline">Vivências Superdotadas</span>
          <span className="sm:hidden">Vivências</span>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Navegação principal" className="hidden xl:flex items-center gap-1">
          {NAV_LINKS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="min-h-[40px] flex items-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                style={{
                  color: active ? "var(--accent-emerald)" : "var(--text-secondary)",
                  backgroundColor: active ? "var(--bg-surface)" : "transparent",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setSensoryOpen((v) => !v)}
              aria-expanded={sensoryOpen}
              aria-label="Abrir painel de conforto sensorial"
              className="flex min-h-[44px] items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors"
              style={{
                borderColor: "var(--border-subtle)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-primary)",
              }}
            >
              <SlidersHorizontal className="h-4 w-4" style={{ color: "var(--accent-emerald)" }} />
              <span className="hidden md:inline">Conforto Sensorial</span>
            </button>

            {sensoryOpen && (
              <div
                role="dialog"
                aria-label="Preferências sensoriais e de leitura"
                className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border p-4 shadow-xl z-50"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-display text-sm font-semibold">Conforto Sensorial</span>
                  <button
                    type="button"
                    onClick={() => setSensoryOpen(false)}
                    className="rounded-lg p-1.5"
                    aria-label="Fechar painel sensorial"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      Tema Visual
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setTheme("light")}
                        className="rounded-lg px-2.5 py-1 text-xs font-medium border"
                        style={{
                          borderColor: theme === "light" ? "var(--accent-emerald)" : "var(--border-subtle)",
                          backgroundColor: theme === "light" ? "var(--bg-surface)" : "transparent",
                        }}
                      >
                        Papel Quente
                      </button>
                      <button
                        type="button"
                        onClick={() => setTheme("dark")}
                        className="rounded-lg px-2.5 py-1 text-xs font-medium border"
                        style={{
                          borderColor: theme === "dark" ? "var(--accent-emerald)" : "var(--border-subtle)",
                          backgroundColor: theme === "dark" ? "var(--bg-surface)" : "transparent",
                        }}
                      >
                        Escuro
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Fonte
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setFont("atkinson")}
                        className="rounded-lg px-2.5 py-1 text-xs font-medium border"
                        style={{
                          borderColor: font === "atkinson" ? "var(--accent-emerald)" : "var(--border-subtle)",
                          backgroundColor: font === "atkinson" ? "var(--bg-surface)" : "transparent",
                        }}
                      >
                        Atkinson
                      </button>
                      <button
                        type="button"
                        onClick={() => setFont("lexend")}
                        className="rounded-lg px-2.5 py-1 text-xs font-medium border"
                        style={{
                          borderColor: font === "lexend" ? "var(--accent-emerald)" : "var(--border-subtle)",
                          backgroundColor: font === "lexend" ? "var(--bg-surface)" : "transparent",
                        }}
                      >
                        Lexend
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Tamanho do Texto</span>
                    <div className="flex gap-1">
                      {(["base", "lg", "xl"] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setTextScale(s)}
                          className="rounded-lg px-2.5 py-1 text-xs font-medium border"
                          style={{
                            borderColor: textScale === s ? "var(--accent-emerald)" : "var(--border-subtle)",
                            backgroundColor: textScale === s ? "var(--bg-surface)" : "transparent",
                          }}
                        >
                          {s === "base" ? "Padrão" : s === "lg" ? "A+" : "A++"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-center justify-between pt-1">
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Reduzir movimento
                    </span>
                    <input
                      type="checkbox"
                      checked={reducedMotion}
                      onChange={(e) => setReducedMotion(e.target.checked)}
                      className="h-4 w-4 accent-[#0F5C4D]"
                    />
                  </label>

                  <label className="flex cursor-pointer items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Modo Foco (sem enfeites)
                    </span>
                    <input
                      type="checkbox"
                      checked={focusMode}
                      onChange={(e) => setFocusMode(e.target.checked)}
                      className="h-4 w-4 accent-[#0F5C4D]"
                    />
                  </label>

                  <label className="hidden md:flex cursor-pointer items-center justify-between">
                    <span>Cursor editorial suave</span>
                    <input
                      type="checkbox"
                      checked={customCursor}
                      onChange={(e) => setCustomCursor(e.target.checked)}
                      className="h-4 w-4 accent-[#0F5C4D]"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/associe-se"
            className="btn-primary hidden sm:inline-flex min-h-[44px] items-center rounded-xl px-4 py-2 text-sm font-semibold"
          >
            Associe-se
          </Link>

          <Link
            href="/entrar"
            aria-label="Entrar na conta"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
          >
            <User className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            className="flex xl:hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Navegação mobile"
          className="xl:hidden border-t px-5 py-4 space-y-1"
          style={{ backgroundColor: "var(--bg-canvas)", borderColor: "var(--border-subtle)" }}
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex min-h-[44px] items-center rounded-xl px-3 py-2 text-base font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/associe-se"
            onClick={() => setMobileOpen(false)}
            className="btn-primary mt-2 flex min-h-[44px] items-center justify-center rounded-xl px-4 py-2.5 text-base font-semibold"
          >
            Associe-se e crie seu Avatar
          </Link>
        </nav>
      )}
    </header>
  );
}
