"use client";

import React, { useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { DEFAULT_AVATAR_CONFIG, type AvatarConfig } from "@/lib/avatar";
import { AvatarStudio } from "@/components/AvatarStudio";
import { AvatarDisplay } from "@/components/AvatarDisplay";

export default function AssocieSePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState("Pessoa com AH/SD");
  const [cityState, setCityState] = useState("");
  const [manifesto, setManifesto] = useState("");
  const [acceptedCode, setAcceptedCode] = useState(false);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(DEFAULT_AVATAR_CONFIG);
  const [neurodivergences, setNeurodivergences] = useState<string[]>(["ahsd"]);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg("");

    const res = await fetch("/api/memberships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        profile,
        cityState,
        manifesto,
        acceptedCode,
        avatarConfig,
        neurodivergences,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus("error");
      setErrorMsg(data.error || "Não foi possível concluir.");
      return;
    }
    setStatus("done");
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-12">
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
          <Sparkles className="h-4 w-4" />
          <span>Associação & Identidade Única</span>
        </div>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          Associe-se ao Vivências Superdotadas e crie seu Avatar Único
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Recebemos pessoas com AH/SD, dupla excepcionalidade, familiares, educadores e aliados neurotípicos. Personalize
          seu avatar marcando suas neurodivergências — ele será sua assinatura nas publicações da comunidade.
        </p>
      </div>

      {status === "done" ? (
        <div
          className="mt-8 rounded-2xl border p-8 text-center space-y-5"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--accent-emerald)" }}
        >
          <CheckCircle2 className="mx-auto h-10 w-10" style={{ color: "var(--accent-emerald)" }} />
          <h2 className="font-display text-2xl font-semibold">Boas-vindas à Associação, {name}!</h2>
          <div className="flex justify-center">
            <AvatarDisplay config={avatarConfig} neurodivergences={neurodivergences} size={140} />
          </div>
          <p className="mx-auto max-w-xl text-sm" style={{ color: "var(--text-secondary)" }}>
            Seu cadastro e seu Avatar Único foram salvos. Enviamos um e-mail de boas-vindas com os próximos passos e o
            convite para o nosso grupo no WhatsApp.
          </p>
          <a
            href="https://chat.whatsapp.com/IkD3gldncwsBmvSH1j8N6b"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex min-h-[44px] items-center rounded-xl px-6 py-2.5 text-sm font-semibold"
          >
            Entrar no Grupo do WhatsApp
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <AvatarStudio
            config={avatarConfig}
            onChange={setAvatarConfig}
            neurodivergences={neurodivergences}
            onNeuroChange={setNeurodivergences}
            personName={name || "Seu Nome"}
            manifesto={manifesto}
          />

          <div
            className="space-y-4 rounded-2xl border p-6"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
          >
            <h2 className="font-display text-xl font-semibold">Seus dados de associação</h2>
            {errorMsg && <p className="text-sm font-semibold" style={{ color: "var(--accent-crimson)" }}>{errorMsg}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                placeholder="Nome ou como prefere ser chamado(a)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="min-h-[44px] rounded-xl border px-3.5 text-sm"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
              />
              <input
                required
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-h-[44px] rounded-xl border px-3.5 text-sm"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
              />
              <select
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                className="min-h-[44px] rounded-xl border px-3.5 text-sm"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
              >
                <option value="Pessoa com AH/SD">Pessoa com AH/SD</option>
                <option value="Pessoa em investigação de AH/SD">Pessoa em investigação de AH/SD</option>
                <option value="Familiar / Responsável">Familiar / Responsável</option>
                <option value="Educador(a) / Pesquisador(a)">Educador(a) / Pesquisador(a)</option>
                <option value="Aliado(a) Neurotípico(a)">Aliado(a) Neurotípico(a)</option>
              </select>
              <input
                placeholder="Cidade / UF (opcional)"
                value={cityState}
                onChange={(e) => setCityState(e.target.value)}
                className="min-h-[44px] rounded-xl border px-3.5 text-sm"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
              />
              <input
                placeholder="Frase curta ou manifesto para seu cartão único (opcional)"
                value={manifesto}
                onChange={(e) => setManifesto(e.target.value)}
                maxLength={200}
                className="min-h-[44px] rounded-xl border px-3.5 text-sm sm:col-span-2"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
              />
            </div>

            <label className="flex items-start gap-3 pt-2 text-sm">
              <input
                type="checkbox"
                required
                checked={acceptedCode}
                onChange={(e) => setAcceptedCode(e.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <span style={{ color: "var(--text-secondary)" }}>
                Li e concordo com o <strong>Código de Boa Convivência</strong> (respeito à diversidade, diálogo não
                exclusivista, tolerância zero a assédio e ética na divulgação científica).
              </span>
            </label>

            <button
              type="submit"
              disabled={status === "saving"}
              className="btn-primary min-h-[46px] rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-60"
            >
              {status === "saving" ? "Salvando..." : "Concluir Associação com meu Avatar"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
