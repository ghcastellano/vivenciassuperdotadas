"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Compass, BookOpen, Users, HeartHandshake, Sparkles, Calendar, MessageCircle } from "lucide-react";
import { BlurRevealText, SpotlightCard } from "@/components/ReactBitsText";

type JourneyKey = "investigando" | "identificado" | "aliado" | "apoiar";

const PATHFINDER: Record<
  JourneyKey,
  { title: string; summary: string; ctaLabel: string; ctaHref: string; secondaryLabel: string; secondaryHref: string }
> = {
  investigando: {
    title: "Comece pela autoexploração responsável — sem diagnóstico apressado",
    summary:
      "Explore indicadores de AH/SD e desafios de raciocínio fluido gratuitamente e sem senha, entendendo o que a ciência diz e quando buscar um profissional habilitado (CRP).",
    ctaLabel: "Iniciar Exploração Pessoal",
    ctaHref: "/exploracao",
    secondaryLabel: "Encontrar Profissionais Parceiros",
    secondaryHref: "/profissionais",
  },
  identificado: {
    title: "Expressão em primeira pessoa, comunidade e criação sem mascaramento",
    summary:
      "Compartilhe vivências, artes e links de conhecimento, crie seu Avatar Único marcando suas neurodivergências e conecte-se com quem entende essa travessia.",
    ctaLabel: "Associe-se e crie seu Avatar",
    ctaHref: "/associe-se",
    secondaryLabel: "Explorar Comunidade",
    secondaryHref: "/comunidade",
  },
  aliado: {
    title: "Diálogo aberto com familiares, educadores e pessoas neurotípicas",
    summary:
      "Não buscamos isolamento: acesse guias sem estereótipos, direitos educacionais (LDB/AEE), o Atlas de Vieses Cognitivos e nossos próximos encontros abertos.",
    ctaLabel: "Acessar Área de Conhecimento",
    ctaHref: "/conhecimento",
    secondaryLabel: "Ler Missão, Visão e Valores",
    secondaryHref: "/sobre",
  },
  apoiar: {
    title: "Transparência total em cada doação, compra e custo de infraestrutura",
    summary:
      "Acompanhe em tempo real tudo o que entra via Stripe (doações e lojinha) e tudo o que sai em impostos, domínio e infraestrutura.",
    ctaLabel: "Apoiar & Ver Transparência",
    ctaHref: "/apoie",
    secondaryLabel: "Conhecer a Lojinha",
    secondaryHref: "/loja",
  },
};

export default function HomePage() {
  const [journey, setJourney] = useState<JourneyKey>("investigando");
  const current = PATHFINDER[journey];

  return (
    <div>
      {/* Hero Section — One focused editorial screen */}
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pt-16 lg:px-12 lg:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div className="space-y-6">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider"
              style={{
                borderColor: "var(--border-subtle)",
                backgroundColor: "var(--bg-surface)",
                color: "var(--accent-emerald)",
              }}
            >
              <span>∞</span>
              <span>Associação Vivências Superdotadas</span>
            </div>

            <BlurRevealText
              text="Acolhimento, ciência e voz em primeira pessoa para Altas Habilidades/Superdotação."
              className="font-display text-3xl font-semibold leading-[1.15] sm:text-5xl lg:text-[3.25rem]"
            />

            <p className="max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: "var(--text-secondary)" }}>
              Sem romantização, sem patologização e sem exclusivismo. Um espaço aberto para compreender a
              superdotação como fenômeno neurofisiológico plural, combater estereótipos e construir convivência
              saudável com toda a sociedade.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/exploracao"
                className="btn-primary inline-flex min-h-[46px] items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
              >
                <Compass className="h-4 w-4" />
                <span>Exploração Pessoal (aberta)</span>
              </Link>
              <Link
                href="/associe-se"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-colors"
                style={{
                  borderColor: "var(--border-subtle)",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-primary)",
                }}
              >
                <Sparkles className="h-4 w-4" style={{ color: "var(--accent-amber)" }} />
                <span>Associe-se e crie seu Avatar</span>
              </Link>
            </div>
          </div>

          {/* Hand-painted original logo framed respectfully */}
          <div className="flex justify-center lg:justify-end">
            <div
              className="relative w-full max-w-[360px] overflow-hidden rounded-3xl border p-3 shadow-lg"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-subtle)",
              }}
            >
              <div className="overflow-hidden rounded-2xl">
                <img
                  src="/images/logo-vivencias.jpg"
                  alt="Obra original pintada à mão — símbolo da Associação Vivências Superdotadas com flor carmesim, espiral esmeralda, borboleta e infinito nas folhas"
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>
              <div className="mt-3 flex items-center justify-between px-1 text-xs" style={{ color: "var(--text-muted)" }}>
                <span>Arte original pintada à mão</span>
                <span className="font-semibold" style={{ color: "var(--accent-emerald)" }}>∞ Cada pessoa é única</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pathfinder Interactive Strip */}
      <section
        className="border-y py-14"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-6 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-crimson)" }}>
              Por onde começar
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
              Qual caminho faz mais sentido para você hoje?
            </h2>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {(
              [
                ["investigando", "Estou investigando AH/SD"],
                ["identificado", "Já sou identificado(a)"],
                ["aliado", "Familiar, educador(a) ou neurotípico(a)"],
                ["apoiar", "Quero apoiar e ver transparência"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setJourney(key)}
                className="min-h-[44px] rounded-xl border px-4 py-2 text-sm font-semibold transition-all"
                style={{
                  backgroundColor: journey === key ? "var(--accent-emerald)" : "var(--bg-card)",
                  color: journey === key ? "#FAF7F2" : "var(--text-primary)",
                  borderColor: journey === key ? "var(--accent-emerald)" : "var(--border-subtle)",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div
            className="mt-6 rounded-2xl border p-6 sm:p-8"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
          >
            <h3 className="font-display text-xl font-semibold sm:text-2xl">{current.title}</h3>
            <p className="mt-2 max-w-3xl text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {current.summary}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={current.ctaHref}
                className="btn-primary inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
              >
                <span>{current.ctaLabel}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={current.secondaryHref}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <span>{current.secondaryLabel}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Pillars */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
            Ecossistema Vivências
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
            Tudo conectado em um único lugar
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <SpotlightCard className="p-6">
            <Compass className="h-6 w-6" style={{ color: "var(--accent-emerald)" }} />
            <h3 className="mt-4 font-display text-xl font-semibold">Exploração Pessoal</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Indicadores de AH/SD e desafios de raciocínio fluido em um só lugar, sem senha. Nunca é diagnóstico:
              sempre orientamos a busca por profissionais (CRP).
            </p>
            <Link href="/exploracao" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold underline" style={{ color: "var(--accent-emerald)" }}>
              Explorar agora <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </SpotlightCard>

          <SpotlightCard className="p-6">
            <BookOpen className="h-6 w-6" style={{ color: "var(--accent-crimson)" }} />
            <h3 className="mt-4 font-display text-xl font-semibold">Área de Conhecimento</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Artigos referenciados, mitos vs. fatos, direitos (LDB/AEE), glossário e o{" "}
              <strong>Atlas de Vieses Cognitivos (Entrelinhas)</strong>.
            </p>
            <Link href="/conhecimento" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold underline" style={{ color: "var(--accent-emerald)" }}>
              Acessar biblioteca <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </SpotlightCard>

          <SpotlightCard className="p-6">
            <Users className="h-6 w-6" style={{ color: "var(--accent-amber)" }} />
            <h3 className="mt-4 font-display text-xl font-semibold">Profissionais Parceiros</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Rede de psicólogos, neuropsicólogos e educadores verificados e aprovados pela administração, com foco
              em prática baseada em evidências.
            </p>
            <Link href="/profissionais" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold underline" style={{ color: "var(--accent-emerald)" }}>
              Ver profissionais <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </SpotlightCard>

          <SpotlightCard className="p-6">
            <Sparkles className="h-6 w-6" style={{ color: "var(--accent-emerald)" }} />
            <h3 className="mt-4 font-display text-xl font-semibold">Comunidade & Avatar Único</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Crie seu avatar customizável com suas neurodivergências e compartilhe artes, links e relatos em primeira
              pessoa com moderação ativa.
            </p>
            <Link href="/comunidade" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold underline" style={{ color: "var(--accent-emerald)" }}>
              Entrar na comunidade <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </SpotlightCard>

          <SpotlightCard className="p-6">
            <Calendar className="h-6 w-6" style={{ color: "var(--accent-crimson)" }} />
            <h3 className="mt-4 font-display text-xl font-semibold">Eventos & Encontros</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Rodas de conversa, lives e encontros para pessoas AH/SD, familiares e neurotípicos dialogarem em
              ambiente seguro.
            </p>
            <Link href="/eventos" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold underline" style={{ color: "var(--accent-emerald)" }}>
              Ver agenda <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </SpotlightCard>

          <SpotlightCard className="p-6">
            <HeartHandshake className="h-6 w-6" style={{ color: "var(--accent-amber)" }} />
            <h3 className="mt-4 font-display text-xl font-semibold">Apoio & Transparência</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Doações via Stripe, lojinha oficial e prestação de contas aberta com entradas, impostos e custos de
              infraestrutura.
            </p>
            <Link href="/apoie" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold underline" style={{ color: "var(--accent-emerald)" }}>
              Ver transparência <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </SpotlightCard>
        </div>

        {/* WhatsApp & Instagram Community Callout */}
        <div
          className="mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl border p-6 sm:flex-row sm:items-center sm:p-8"
          style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
        >
          <div className="space-y-1.5">
            <h3 className="font-display text-xl font-semibold">Participe da nossa convivência diária</h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Grupo aberto no WhatsApp (com Código de Boa Convivência e moderação ativa) e conteúdos no Instagram.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://chat.whatsapp.com/IkD3gldncwsBmvSH1j8N6b"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Grupo no WhatsApp</span>
            </a>
            <a
              href="https://www.instagram.com/vivenciassuperdotadas/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
            >
              <span>@vivenciassuperdotadas</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
