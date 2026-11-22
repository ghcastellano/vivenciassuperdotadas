"use client";

import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

function GoogleGIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.3 0 6.08-1.09 8.1-2.96l-3.88-3.05c-1.09.73-2.49 1.16-4.22 1.16-3.24 0-5.99-2.19-6.97-5.13H1.04v3.14C3.05 21.14 7.21 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.03 14.02c-.25-.73-.39-1.52-.39-2.32 0-.8.14-1.59.39-2.32V6.24H1.04A11.98 11.98 0 0 0 0 11.7c0 1.93.46 3.76 1.04 5.46l3.99-3.14Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.65c1.8 0 3.41.62 4.68 1.84l3.51-3.51C18.07 1.09 15.3 0 12 0 7.21 0 3.05 2.86 1.04 6.24l3.99 3.14c.98-2.94 3.73-5.13 6.97-5.13Z"
      />
    </svg>
  );
}

export default function EntrarPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("/perfil");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified") === "1") {
      setNotice("E-mail confirmado com sucesso! Já pode entrar com sua senha.");
    }
    const cb = params.get("callbackUrl");
    if (cb && cb.startsWith("/")) {
      setCallbackUrl(cb);
    }
  }, []);

  const handleGoogle = () => {
    setError("");
    setGoogleLoading(true);
    signIn("google", { callbackUrl });
  };

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    try {
      if (mode === "register") {
        const reg = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await reg.json();
        if (!reg.ok) {
          setError(data.error || "Erro ao criar conta.");
          setLoading(false);
          return;
        }
        if (data.requiresVerification) {
          setLoading(false);
          setMode("login");
          setNotice(
            data.message ||
              "Conta criada! Enviamos um link de confirmação para o seu e-mail. Confirme antes de entrar."
          );
          return;
        }
      }

      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      setLoading(false);
      if (!res || res.error || res.ok === false) {
        setError(
          mode === "login"
            ? "E-mail/senha inválidos ou e-mail ainda não confirmado. Verifique sua caixa de entrada."
            : "Conta criada, mas não foi possível iniciar a sessão automaticamente. Tente entrar na aba 'Já tenho conta'."
        );
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setLoading(false);
      setError("Erro de conexão ao autenticar. Tente novamente.");
    }
  };

  return (
    <div className="mx-auto max-w-[440px] px-5 py-14 sm:py-20">
      <div
        className="border p-7 sm:p-9 space-y-6"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
      >
        <div className="space-y-3 text-center">
          <div className="flex justify-center">
            <BrandMark size={38} />
          </div>
          <div>
            <p className="font-mono-num text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--accent-emerald)" }}>
              Acesso à Comunidade
            </p>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-semibold">
              Entrar no <em className="italic font-normal">Vivências</em>
            </h1>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Acesse seu Avatar Único, compartilhe publicações na comunidade ou gerencie a associação.
          </p>
        </div>

        {/* Official Google OAuth button */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading}
          className="flex min-h-[46px] w-full items-center justify-center gap-3 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors hover:border-[#0F5C4D] focus:outline-none focus:ring-2 focus:ring-[#0F5C4D]/30 disabled:opacity-60"
          style={{
            borderColor: "var(--border-subtle)",
            backgroundColor: "var(--bg-canvas)",
            color: "var(--text-primary)",
          }}
        >
          <GoogleGIcon />
          <span>{googleLoading ? "Conectando ao Google..." : "Continuar com Google (Gmail)"}</span>
        </button>

        <div className="flex items-center gap-3 text-[11px] font-mono-num uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          <div className="h-px flex-1" style={{ backgroundColor: "var(--border-subtle)" }} />
          <span>ou com e-mail</span>
          <div className="h-px flex-1" style={{ backgroundColor: "var(--border-subtle)" }} />
        </div>

        {/* Clean segmented control */}
        <div
          className="grid grid-cols-2 rounded-lg border p-1"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-surface)" }}
        >
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className="min-h-[36px] rounded-md text-xs font-semibold transition-colors"
            style={{
              backgroundColor: mode === "login" ? "var(--bg-card)" : "transparent",
              color: mode === "login" ? "var(--text-primary)" : "var(--text-muted)",
            }}
          >
            Já tenho conta
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
            }}
            className="min-h-[36px] rounded-md text-xs font-semibold transition-colors"
            style={{
              backgroundColor: mode === "register" ? "var(--bg-card)" : "transparent",
              color: mode === "register" ? "var(--text-primary)" : "var(--text-muted)",
            }}
          >
            Criar conta
          </button>
        </div>

        {notice && (
          <p
            role="status"
            className="rounded-lg border p-3 text-center text-xs font-medium"
            style={{ borderColor: "var(--accent-emerald)", color: "var(--accent-emerald)", backgroundColor: "var(--bg-surface)" }}
          >
            {notice}
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-lg border p-3 text-center text-xs font-medium"
            style={{ borderColor: "var(--accent-crimson)", color: "var(--accent-crimson)", backgroundColor: "var(--bg-surface)" }}
          >
            {error}
          </p>
        )}

        <form onSubmit={handleCredentials} className="space-y-3.5">
          {mode === "register" && (
            <div className="space-y-1">
              <label className="block text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                Nome completo
              </label>
              <input
                required
                placeholder="Como prefere ser chamado(a)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full min-h-[42px] rounded-lg border px-3.5 text-sm focus:outline-none focus:border-[#0F5C4D]"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              E-mail
            </label>
            <input
              required
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-[42px] rounded-lg border px-3.5 text-sm focus:outline-none focus:border-[#0F5C4D]"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              Senha
            </label>
            <input
              required
              minLength={6}
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full min-h-[42px] rounded-lg border px-3.5 text-sm focus:outline-none focus:border-[#0F5C4D]"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex min-h-[44px] w-full items-center justify-center gap-2 rounded-md text-sm font-semibold disabled:opacity-60"
          >
            <span>{loading ? "Processando..." : mode === "login" ? "Entrar" : "Criar conta e entrar"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
