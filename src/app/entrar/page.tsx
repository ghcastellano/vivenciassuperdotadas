"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";

export default function EntrarPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
    }

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);
    if (res?.error) {
      setError("E-mail ou senha incorretos.");
      return;
    }

    router.push("/comunidade");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md px-5 py-16 sm:px-8">
      <div
        className="rounded-2xl border p-6 sm:p-8 space-y-6"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
      >
        <div className="space-y-1.5 text-center">
          <h1 className="font-display text-2xl font-semibold">Entrar no Vivências</h1>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Login opcional — necessário apenas para publicar na comunidade ou acessar o painel administrativo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/comunidade" })}
          className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-surface)" }}
        >
          <span>Continuar com Google (Gmail)</span>
        </button>

        <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
          <div className="h-px flex-1" style={{ backgroundColor: "var(--border-subtle)" }} />
          <span>ou com e-mail e senha</span>
          <div className="h-px flex-1" style={{ backgroundColor: "var(--border-subtle)" }} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMode("login")}
            className="min-h-[40px] rounded-xl text-xs font-semibold"
            style={{
              backgroundColor: mode === "login" ? "var(--accent-emerald)" : "var(--bg-surface)",
              color: mode === "login" ? "#FAF7F2" : "var(--text-primary)",
            }}
          >
            Já tenho conta
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className="min-h-[40px] rounded-xl text-xs font-semibold"
            style={{
              backgroundColor: mode === "register" ? "var(--accent-emerald)" : "var(--bg-surface)",
              color: mode === "register" ? "#FAF7F2" : "var(--text-primary)",
            }}
          >
            Criar conta
          </button>
        </div>

        {error && (
          <p className="text-center text-sm font-medium" style={{ color: "var(--accent-crimson)" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleCredentials} className="space-y-3">
          {mode === "register" && (
            <input
              required
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full min-h-[44px] rounded-xl border px-3.5 text-sm"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
            />
          )}
          <input
            required
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full min-h-[44px] rounded-xl border px-3.5 text-sm"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
          />
          <input
            required
            type="password"
            minLength={6}
            placeholder="Senha (mínimo 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full min-h-[44px] rounded-xl border px-3.5 text-sm"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {mode === "login" ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            <span>{loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta gratuita"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
