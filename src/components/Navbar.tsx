"use client";

import React, { useEffect, useState } from "react";
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
import { useSession } from "next-auth/react";
import { ReadingProgressBar } from "@/components/EditorialEffects";
import { BrandMark } from "@/components/BrandMark";

const NAV_LINKS = [
  { href: "/sobre", label: "Associação" },
  { href: "/conhecimento", label: "Conhecimento" },
  { href: "/profissionais", label: "Profissionais" },
  { href: "/eventos", label: "Eventos" },
  { href: "/comunidade", label: "Comunidade" },
  { href: "/apoie", label: "Transparência" },
  { href: "/loja", label: "Lojinha" },
];

function TactileSwitch({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors"
      style={{
        backgroundColor: checked ? "var(--accent-emerald)" : "var(--bg-surface)",
        borderColor: checked ? "var(--accent-emerald)" : "var(--border-subtle)",
      }}
    >
      <span
        className="inline-block h-3.5 w-3.5 rounded-full transition-transform"
        style={{
          backgroundColor: checked ? "#FAF7F2" : "var(--text-muted)",
          transform: checked ? "translateX(17px)" : "translateX(2px)",
        }}
      />
    </button>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sensoryOpen, setSensoryOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [hintName, setHintName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("vivencias-auth-hint");
      if (saved) setHintName(saved);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      if (status === "authenticated" && session?.user) {
        const first = session.user.name?.split(" ")[0] || "Perfil";
        sessionStorage.setItem("vivencias-auth-hint", first);
        setHintName(first);
      } else if (status === "unauthenticated") {
        sessionStorage.removeItem("vivencias-auth-hint");
        setHintName(null);
      }
    } catch {
      // ignore
    }
  }, [status, session]);

  const isLoggedIn = Boolean(session?.user) || (status === "loading" && Boolean(hintName));
  const displayFirstName = session?.user?.name?.split(" ")[0] || hintName || "Perfil";

  useEffect(() => {
    setPendingHref(null);
    setMobileOpen(false);
  }, [pathname]);
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
    <>
      <ReadingProgressBar />
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{
          backgroundColor: theme === "dark" ? "rgba(17, 21, 20, 0.92)" : "rgba(250, 247, 242, 0.94)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
          <Link
            href="/"
            className="flex min-h-[44px] shrink-0 items-center gap-2.5"
            style={{ color: "var(--text-primary)" }}
          >
            <BrandMark size={30} />
            <span className="font-display text-[15px] sm:text-[17px] font-semibold tracking-tight whitespace-nowrap">
              Vivências Superdotadas
            </span>
          </Link>

          {/* Editorial Single-Line Nav with instant optimistic active underline */}
          <nav aria-label="Navegação principal" className="hidden xl:flex items-center gap-1 2xl:gap-2">
            {NAV_LINKS.map((item) => {
              const currentPath = pendingHref || pathname;
              const active = currentPath === item.href || currentPath.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setPendingHref(item.href)}
                  className="relative flex min-h-[40px] shrink-0 items-center whitespace-nowrap px-2.5 2xl:px-3 py-1.5 text-[13px] font-medium transition-colors hover:opacity-80"
                  style={{
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  }}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 left-2.5 right-2.5 h-[2px] transition-opacity duration-150"
                    style={{
                      backgroundColor: "var(--accent-emerald)",
                      opacity: active ? 1 : 0,
                    }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Actions: Sensory calibration + 1 primary CTA + User */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setSensoryOpen((v) => !v)}
                aria-expanded={sensoryOpen}
                aria-label="Abrir calibração sensorial e tipográfica"
                title="Conforto Sensorial"
                className="flex min-h-[38px] sm:min-h-[40px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-black/5"
                style={{
                  borderColor: sensoryOpen ? "var(--accent-emerald)" : "var(--border-subtle)",
                  backgroundColor: "transparent",
                  color: "var(--text-secondary)",
                }}
              >
                <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--accent-emerald)" }} />
                <span className="hidden 2xl:inline">Sensorial</span>
              </button>

              {sensoryOpen && (
                <div
                  role="dialog"
                  aria-label="Calibração sensorial e tipográfica"
                  className="absolute right-0 mt-2.5 w-80 max-w-[calc(100vw-2rem)] rounded-xl border p-4 shadow-lg z-50"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-subtle)",
                  }}
                >
                  <div className="mb-3 flex items-center justify-between border-b pb-2.5" style={{ borderColor: "var(--border-subtle)" }}>
                    <div>
                      <span className="font-mono-num text-[10px] uppercase tracking-wider block" style={{ color: "var(--accent-emerald)" }}>
                        Calibração de Leitura
                      </span>
                      <span className="font-display text-sm font-semibold">Conforto Sensorial</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSensoryOpen(false)}
                      className="rounded-md p-1 hover:bg-black/5"
                      aria-label="Fechar calibração sensorial"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 font-medium">
                        {theme === "dark" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                        Superfície
                      </span>
                      <div className="flex rounded-lg border p-0.5" style={{ borderColor: "var(--border-subtle)" }}>
                        <button
                          type="button"
                          onClick={() => setTheme("light")}
                          className="rounded-md px-2.5 py-1 font-medium transition-colors"
                          style={{
                            backgroundColor: theme === "light" ? "var(--bg-surface)" : "transparent",
                            color: theme === "light" ? "var(--text-primary)" : "var(--text-muted)",
                          }}
                        >
                          Papel
                        </button>
                        <button
                          type="button"
                          onClick={() => setTheme("dark")}
                          className="rounded-md px-2.5 py-1 font-medium transition-colors"
                          style={{
                            backgroundColor: theme === "dark" ? "var(--bg-surface)" : "transparent",
                            color: theme === "dark" ? "var(--text-primary)" : "var(--text-muted)",
                          }}
                        >
                          Carvão
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 font-medium">
                        <Type className="h-3.5 w-3.5" />
                        Tipografia
                      </span>
                      <div className="flex rounded-lg border p-0.5" style={{ borderColor: "var(--border-subtle)" }}>
                        <button
                          type="button"
                          onClick={() => setFont("atkinson")}
                          className="rounded-md px-2.5 py-1 font-medium transition-colors"
                          style={{
                            backgroundColor: font === "atkinson" ? "var(--bg-surface)" : "transparent",
                            color: font === "atkinson" ? "var(--text-primary)" : "var(--text-muted)",
                          }}
                        >
                          Atkinson
                        </button>
                        <button
                          type="button"
                          onClick={() => setFont("lexend")}
                          className="rounded-md px-2.5 py-1 font-medium transition-colors"
                          style={{
                            backgroundColor: font === "lexend" ? "var(--bg-surface)" : "transparent",
                            color: font === "lexend" ? "var(--text-primary)" : "var(--text-muted)",
                          }}
                        >
                          Lexend
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-medium">Escala</span>
                      <div className="flex rounded-lg border p-0.5 font-mono-num" style={{ borderColor: "var(--border-subtle)" }}>
                        {(["base", "lg", "xl"] as const).map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setTextScale(s)}
                            className="rounded-md px-2.5 py-1 font-medium transition-colors"
                            style={{
                              backgroundColor: textScale === s ? "var(--bg-surface)" : "transparent",
                              color: textScale === s ? "var(--text-primary)" : "var(--text-muted)",
                            }}
                          >
                            {s === "base" ? "A" : s === "lg" ? "A+" : "A++"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-2.5 space-y-2.5" style={{ borderColor: "var(--border-subtle)" }}>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-medium">
                          <Sparkles className="h-3.5 w-3.5" />
                          Reduzir movimento
                        </span>
                        <TactileSwitch
                          checked={reducedMotion}
                          onToggle={() => setReducedMotion(!reducedMotion)}
                          label="Reduzir movimento"
                        />
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <span className="flex items-center gap-2 font-medium">
                            <Eye className="h-3.5 w-3.5" />
                            Modo Foco
                          </span>
                          <span className="block text-[10px]" style={{ color: "var(--text-muted)" }}>
                            Atenua menus e oculta distrações visuais
                          </span>
                        </div>
                        <TactileSwitch
                          checked={focusMode}
                          onToggle={() => setFocusMode(!focusMode)}
                          label="Modo Foco"
                        />
                      </div>

                      <div className="hidden md:flex items-center justify-between">
                        <span className="font-medium">Cursor editorial</span>
                        <TactileSwitch
                          checked={customCursor}
                          onToggle={() => setCustomCursor(!customCursor)}
                          label="Cursor editorial"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/associe-se"
              className="btn-primary hidden sm:inline-flex min-h-[40px] shrink-0 items-center whitespace-nowrap rounded px-4 py-1.5 text-xs sm:text-sm font-semibold"
            >
              {isLoggedIn ? "Meu Avatar" : "Associe-se"}
            </Link>

            <Link
              href={isLoggedIn ? "/perfil" : "/entrar"}
              aria-label={isLoggedIn ? "Abrir meu perfil" : "Entrar na conta"}
              title={session?.user ? `Logado como ${session.user.name || session.user.email}` : isLoggedIn ? "Abrir meu perfil" : "Entrar ou criar conta"}
              className="flex min-h-[38px] sm:min-h-[40px] items-center gap-1.5 rounded border px-2.5 text-xs font-medium transition-colors hover:bg-black/5"
              style={{
                borderColor: isLoggedIn ? "var(--accent-emerald)" : "var(--border-subtle)",
                backgroundColor: "transparent",
                color: "var(--text-primary)",
              }}
            >
              <User className="h-3.5 w-3.5" style={{ color: isLoggedIn ? "var(--accent-emerald)" : "var(--text-secondary)" }} />
              <span className="hidden sm:inline max-w-[96px] truncate">
                {status === "loading" && !hintName ? "..." : isLoggedIn ? displayFirstName : "Entrar"}
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              className="flex xl:hidden min-h-[38px] min-w-[38px] sm:min-h-[40px] sm:min-w-[40px] items-center justify-center rounded-md border"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "transparent" }}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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
            {NAV_LINKS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-[44px] items-center justify-between border-b px-1 text-sm font-medium"
                  style={{
                    borderColor: "var(--border-subtle)",
                    color: active ? "var(--accent-emerald)" : "var(--text-primary)",
                  }}
                >
                  <span>{item.label}</span>
                  <span className="text-xs opacity-50">→</span>
                </Link>
              );
            })}
            <div className="pt-3 flex gap-2">
              <Link
                href="/associe-se"
                onClick={() => setMobileOpen(false)}
                className="btn-primary flex-1 min-h-[44px] inline-flex items-center justify-center rounded-md px-4 text-sm font-semibold"
              >
                {session?.user ? "Meu Avatar" : "Associe-se"}
              </Link>
              <Link
                href={session?.user ? "/perfil" : "/entrar"}
                onClick={() => setMobileOpen(false)}
                className="btn-secondary min-h-[44px] inline-flex items-center justify-center rounded-md px-4 text-sm font-semibold"
              >
                {session?.user ? "Meu Perfil" : "Entrar"}
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
