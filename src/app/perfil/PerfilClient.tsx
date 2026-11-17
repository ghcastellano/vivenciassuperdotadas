"use client";

import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut, Sparkles, MessageSquarePlus, Shield } from "lucide-react";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import type { AvatarConfig } from "@/lib/avatar";

export interface MeUser {
  name: string;
  email: string;
  role: string;
  avatar_config: Partial<AvatarConfig> | null;
  neurodivergences: string[];
  manifesto: string;
  has_medical_report: string;
  membership_status?: string;
  member_number?: string;
}

const REPORT_LABELS: Record<string, string> = {
  sim: "Laudo / avaliação formal informado(a)",
  em_avaliacao: "Em processo de avaliação",
  nao: "Sem laudo (em investigação ou aliado/neurotípico)",
  nao_informado: "Não informado",
};

export function PerfilClient({ initialMe }: { initialMe: MeUser | null }) {
  if (!initialMe) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16 text-center">
        <div
          className="rounded-2xl border p-8 space-y-4"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
        >
          <h1 className="font-display text-2xl font-semibold">Você ainda não entrou na sua conta</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Entre com Google ou e-mail e senha para visualizar seu Avatar Único, suas neurodivergências e publicar na
            comunidade.
          </p>
          <Link href="/entrar" className="btn-primary inline-flex min-h-[44px] items-center rounded-md px-5 py-2.5 text-sm font-semibold">
            Entrar ou Criar Conta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <div
        className="rounded-2xl border p-6 sm:p-8 space-y-6"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5" style={{ borderColor: "var(--border-subtle)" }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
              Meu Espaço no Vivências
            </p>
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">{initialMe.name || "Membro"}</h1>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {initialMe.email}
            </p>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sair</span>
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 rounded-2xl border p-6 text-center" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
          <AvatarDisplay
            config={initialMe.avatar_config}
            neurodivergences={initialMe.neurodivergences?.length ? initialMe.neurodivergences : ["ahsd"]}
            size={130}
          />
          {initialMe.manifesto && (
            <p className="max-w-md text-sm italic" style={{ color: "var(--text-secondary)" }}>
              “{initialMe.manifesto}”
            </p>
          )}
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Avaliação / Laudo: <strong>{REPORT_LABELS[initialMe.has_medical_report || "nao_informado"]}</strong>
          </p>
        </div>

        {/* Legal Membership Status */}
        <div
          className="rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-canvas)" }}
        >
          <div className="space-y-0.5">
            <p className="font-mono-num text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
              Vínculo Associativo Legal
            </p>
            <p className="text-sm font-semibold">
              {initialMe.membership_status === "active"
                ? `Associado(a) Ativo(a)${initialMe.member_number ? ` · Matrícula ${initialMe.member_number}` : ""}`
                : initialMe.membership_status === "pending"
                ? "Solicitação em análise pela diretoria"
                : initialMe.membership_status === "suspended"
                ? "Vínculo suspenso — fale com a administração"
                : initialMe.membership_status === "rejected"
                ? "Solicitação não aprovada — revise sua ficha"
                : "Conta criada · Associação formal pendente"}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {initialMe.membership_status === "active"
                ? "Você tem acesso completo para publicar na comunidade e aparecer no Mural da Singularidade."
                : "Publicar na comunidade e acessar áreas exclusivas exige aprovação formal da associação."}
            </p>
          </div>
          {initialMe.membership_status !== "active" && (
            <Link
              href="/associe-se"
              className="btn-secondary shrink-0 inline-flex min-h-[38px] items-center rounded-md px-3.5 text-xs font-semibold"
            >
              {initialMe.membership_status === "pending" ? "Ver ficha enviada" : "Completar associação →"}
            </Link>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/associe-se" className="btn-primary inline-flex min-h-[44px] items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold">
            <Sparkles className="h-4 w-4" />
            <span>{initialMe.avatar_config ? "Personalizar meu Avatar" : "Criar meu Avatar Único"}</span>
          </Link>
          <Link href="/comunidade" className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold" style={{ borderColor: "var(--border-subtle)" }}>
            <MessageSquarePlus className="h-4 w-4" />
            <span>Publicar na Comunidade</span>
          </Link>
          {initialMe.role === "admin" && (
            <Link href="/admin" className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold" style={{ borderColor: "var(--accent-amber)" }}>
              <Shield className="h-4 w-4" />
              <span>Painel Admin</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
