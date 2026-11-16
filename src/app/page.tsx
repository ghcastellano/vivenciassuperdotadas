"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Users,
  HeartHandshake,
  Sparkles,
  Calendar,
  MessageCircle,
  Stethoscope,
} from "lucide-react";
import { SpotlightCard } from "@/components/ReactBitsText";
import {
  AuroraMesh,
  InfiniteMarquee,
  MagneticWrapper,
  RotatingPhrase,
  ScrollReveal,
  SplitHeadline,
  TiltedArtworkCard,
} from "@/components/EditorialEffects";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import { MOCK_SUBMISSIONS } from "@/lib/mock-data";

type JourneyKey = "entender" | "identificado" | "aliado" | "apoiar";

const PATHFINDER: Record<
  JourneyKey,
  { title: string; summary: string; ctaLabel: string; ctaHref: string; secondaryLabel: string; secondaryHref: string }
> = {
  entender: {
    title: "Informação científica sem mitos — e encaminhamento ético para profissionais",
    summary:
      "Não oferecemos testes ou diagnósticos online. Reunimos literatura confiável sobre AH/SD e uma rede verificada de psicólogos e neuropsicólogos parceiros (CRP) para avaliação oficial.",
    ctaLabel: "Encontrar Profissionais Parceiros",
    ctaHref: "/profissionais",
    secondaryLabel: "Acessar Área de Conhecimento",
    secondaryHref: "/conhecimento",
  },
  identificado: {
    title: "Expressão em primeira pessoa, comunidade e Avatar Único sem mascaramento",
    summary:
      "Crie seu Avatar Único marcando suas neurodivergências (∞), compartilhe artes, links de conhecimento e relatos reais em um ambiente acolhedor e moderado.",
    ctaLabel: "Associe-se e crie seu Avatar",
    ctaHref: "/associe-se",
    secondaryLabel: "Explorar Comunidade",
    secondaryHref: "/comunidade",
  },
  aliado: {
    title: "Diálogo aberto com familiares, educadores e pessoas neurotípicas",
    summary:
      "Não buscamos isolamento: acesse guias sem estereótipos, direitos educacionais (LDB/AEE), o Atlas de Vieses Cognitivos e nossos próximos encontros abertos.",
    ctaLabel: "Ler Missão, Visão e Valores",
    ctaHref: "/sobre",
    secondaryLabel: "Ver Próximos Eventos",
    secondaryHref: "/eventos",
  },
  apoiar: {
    title: "Transparência total em cada doação, compra e custo de infraestrutura",
    summary:
      "Acompanhe tudo o que entra via Stripe (doações e lojinha) e tudo o que sai em impostos, domínio e infraestrutura.",
    ctaLabel: "Apoiar & Ver Transparência",
    ctaHref: "/apoie",
    secondaryLabel: "Conhecer a Lojinha",
    secondaryHref: "/loja",
  },
};

export default function HomePage() {
  const [journey, setJourney] = useState<JourneyKey>("entender");
  const current = PATHFINDER[journey];

  return (
    <div>
      {/* Hero Editorial com AuroraMesh, SplitHeadline, RotatingPhrase e TiltedArtworkCard */}
      <section className="relative overflow-hidden">
        <AuroraMesh />
        <div className="relative z-10 mx-auto max-w-[1400px] px-5 pb-16 pt-10 sm:px-8 sm:pt-14 lg:px-10 lg:pb-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div className="space-y-6">
              <div
                className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider"
                style={{
                  borderColor: "var(--border-subtle)",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--accent-emerald)",
                }}
              >
                <span>∞</span>
                <span>Associação Vivências Superdotadas</span>
              </div>

              <SplitHeadline
                text="Acolhimento, ciência e voz em primeira pessoa para Altas Habilidades."
                className="font-display text-3xl font-semibold leading-[1.12] sm:text-5xl lg:text-[3.35rem]"
              />

              <div className="text-lg sm:text-xl font-display font-medium" style={{ color: "var(--accent-crimson)" }}>
                <span>Construindo compreensão </span>
                <RotatingPhrase
                  phrases={[
                    "sem romantização.",
                    "sem patologização.",
                    "sem exclusivismo.",
                    "em primeira pessoa.",
                  ]}
                  className="underline decoration-2 underline-offset-4"
                />
              </div>

              <p className="max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: "var(--text-secondary)" }}>
                Um espaço aberto para compreender a superdotação como fenômeno neurofisiológico plural, combater
                estereótipos e construir convivência saudável entre pessoas AH/SD, familiares, educadores e
                neurotípicos.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <MagneticWrapper>
                  <Link
                    href="/associe-se"
                    data-cursor-label="Criar Avatar"
                    className="btn-primary inline-flex min-h-[48px] items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-sm"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Associe-se e crie seu Avatar</span>
                  </Link>
                </MagneticWrapper>

                <MagneticWrapper>
                  <Link
                    href="/profissionais"
                    data-cursor-label="Ver Rede"
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-colors"
                    style={{
                      borderColor: "var(--border-subtle)",
                      backgroundColor: "var(--bg-card)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <Stethoscope className="h-4 w-4" style={{ color: "var(--accent-emerald)" }} />
                    <span>Profissionais Parceiros (CRP)</span>
                  </Link>
                </MagneticWrapper>
              </div>
            </div>

            {/* 3D Tilted Artwork Frame */}
            <div className="flex justify-center lg:justify-end">
              <TiltedArtworkCard
                src="/images/logo-vivencias.jpg"
                alt="Obra original pintada à mão — símbolo da Associação Vivências Superdotadas com flor carmesim, espiral esmeralda, borboleta e infinito nas folhas"
                captionLeft="Arte original pintada à mão"
                captionRight="∞ Cada pessoa é única"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Marquee */}
      <InfiniteMarquee
        items={[
          "Respeito à diferença",
          "Protagonismo em 1ª pessoa",
          "Divulgação científica ética",
          "Acolhimento sem diagnóstico",
          "Diálogo não exclusivista",
          "Boa convivência e segurança",
        ]}
      />

      {/* Pathfinder Interactive Strip */}
      <section
        className="border-b py-14"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
      >
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
          <ScrollReveal>
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
                  ["entender", "Quero entender AH/SD com rigor"],
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
          </ScrollReveal>
        </div>
      </section>

      {/* Asymmetric Editorial Bento Grid */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-10">
        <ScrollReveal>
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
              Ecossistema Vivências
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
              Mosaico da associação — cada peça com seu propósito
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid gap-5 md:grid-cols-6">
          {/* Wide Feature Card: Avatar Único & Comunidade */}
          <ScrollReveal className="md:col-span-4" delay={0.05}>
            <SpotlightCard className="h-full p-6 sm:p-8 flex flex-col justify-between">
              <div className="grid gap-6 sm:grid-cols-[1.2fr_0.8fr] items-center">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
                    <Sparkles className="h-4 w-4" /> Identidade Única
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-semibold">
                    Seu Avatar Único com selos de neurodivergência (∞)
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Ao se associar, você customiza cabeça, rosto, roupas e acessórios — e marca visualmente suas
                    neurodivergências. Ele acompanha suas artes, links e relatos em primeira pessoa na comunidade.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link href="/associe-se" className="btn-primary inline-flex min-h-[42px] items-center gap-1.5 rounded-xl px-4 text-xs sm:text-sm font-semibold">
                      Personalizar meu Avatar <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link href="/comunidade" className="inline-flex min-h-[42px] items-center rounded-xl border px-4 text-xs sm:text-sm font-semibold" style={{ borderColor: "var(--border-subtle)" }}>
                      Ver publicações
                    </Link>
                  </div>
                </div>

                {/* Live Mini Gallery of Member Avatars */}
                <div className="flex items-center justify-center gap-3 rounded-2xl border p-4" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
                  {MOCK_SUBMISSIONS.slice(0, 3).map((m) => (
                    <AvatarDisplay
                      key={m.id}
                      config={m.author_avatar}
                      neurodivergences={m.author_neurodivergences}
                      size={64}
                      showBadges={false}
                    />
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </ScrollReveal>

          {/* Tall Side Card: Profissionais Parceiros */}
          <ScrollReveal className="md:col-span-2" delay={0.1}>
            <SpotlightCard className="h-full p-6 flex flex-col justify-between">
              <div>
                <Users className="h-6 w-6" style={{ color: "var(--accent-amber)" }} />
                <h3 className="mt-4 font-display text-xl font-semibold">Profissionais Parceiros</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Avaliação e acompanhamento clínico exigem profissionais habilitados (CRP). Busque especialistas
                  aprovados pela nossa curadoria.
                </p>
              </div>
              <Link href="/profissionais" data-cursor-label="Abrir" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold underline" style={{ color: "var(--accent-emerald)" }}>
                Explorar diretório <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </SpotlightCard>
          </ScrollReveal>

          {/* Knowledge Card */}
          <ScrollReveal className="md:col-span-2" delay={0.12}>
            <SpotlightCard className="h-full p-6 flex flex-col justify-between">
              <div>
                <BookOpen className="h-6 w-6" style={{ color: "var(--accent-crimson)" }} />
                <h3 className="mt-4 font-display text-xl font-semibold">Área de Conhecimento</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Mitos vs. fatos, direitos (LDB/AEE), glossário desmistificador e o{" "}
                  <strong>Atlas de Vieses Cognitivos (Entrelinhas)</strong>.
                </p>
              </div>
              <Link href="/conhecimento" data-cursor-label="Ler" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold underline" style={{ color: "var(--accent-emerald)" }}>
                Acessar biblioteca <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </SpotlightCard>
          </ScrollReveal>

          {/* Events Card */}
          <ScrollReveal className="md:col-span-2" delay={0.16}>
            <SpotlightCard className="h-full p-6 flex flex-col justify-between">
              <div>
                <Calendar className="h-6 w-6" style={{ color: "var(--accent-emerald)" }} />
                <h3 className="mt-4 font-display text-xl font-semibold">Eventos & Encontros</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Rodas de conversa e lives abertas para troca em primeira pessoa e diálogo com toda a sociedade.
                </p>
              </div>
              <Link href="/eventos" data-cursor-label="Agenda" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold underline" style={{ color: "var(--accent-emerald)" }}>
                Ver próximos eventos <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </SpotlightCard>
          </ScrollReveal>

          {/* Transparency & Store Card */}
          <ScrollReveal className="md:col-span-2" delay={0.2}>
            <SpotlightCard className="h-full p-6 flex flex-col justify-between">
              <div>
                <HeartHandshake className="h-6 w-6" style={{ color: "var(--accent-amber)" }} />
                <h3 className="mt-4 font-display text-xl font-semibold">Apoio & Transparência</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Doações via Stripe, lojinha oficial e prestação de contas aberta com impostos, domínio e custos.
                </p>
              </div>
              <div className="mt-5 flex gap-4">
                <Link href="/apoie" className="inline-flex items-center gap-1 text-sm font-semibold underline" style={{ color: "var(--accent-emerald)" }}>
                  Transparência <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/loja" className="inline-flex items-center gap-1 text-sm font-semibold underline" style={{ color: "var(--accent-crimson)" }}>
                  Lojinha
                </Link>
              </div>
            </SpotlightCard>
          </ScrollReveal>
        </div>

        {/* WhatsApp & Instagram Community Callout */}
        <ScrollReveal delay={0.1}>
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
        </ScrollReveal>
      </section>
    </div>
  );
}
