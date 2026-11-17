"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { ScrollReveal } from "@/components/EditorialEffects";
import { BotanicalSpecimenFrame } from "@/components/editorial/BotanicalSpecimenFrame";
import { EditorialIndexRail, type IndexJourneyItem } from "@/components/editorial/EditorialIndexRail";
import { AssynchronyDiagram } from "@/components/editorial/AssynchronyDiagram";

const JOURNEYS: IndexJourneyItem[] = [
  {
    key: "entender",
    num: "01",
    shortLabel: "Estou buscando entender o tema",
    eyebrow: "Leitura & Encaminhamento",
    title: "Informação científica sem mitos — e encaminhamento ético",
    summary:
      "A superdotação não é sinônimo de genialidade solitária nem de nota 10 em tudo. Conheça nosso guia para leigos, leia sobre dupla excepcionalidade e encontre especialistas.",
    ctaLabel: "Explorar Conhecimento",
    ctaHref: "/conhecimento",
    secondaryLabel: "Buscar Profissionais",
    secondaryHref: "/profissionais",
  },
  {
    key: "identificado",
    num: "02",
    shortLabel: "Sou ou me identifico como AH/SD",
    eyebrow: "Comunidade & Pertencimento",
    title: "Um lugar para existir em primeira pessoa, sem precisar performar",
    summary:
      "Associe-se gratuitamente, crie seu avatar único com traços de neurodivergência e compartilhe vivências, artes e referências na comunidade.",
    ctaLabel: "Criar Meu Avatar",
    ctaHref: "/associe-se",
    secondaryLabel: "Ver Comunidade",
    secondaryHref: "/comunidade",
  },
  {
    key: "aliado",
    num: "03",
    shortLabel: "Sou neurodivergente, familiar ou educador",
    eyebrow: "Convivência & Direitos",
    title: "Pontes entre neurotipos para convivência e educação inclusiva",
    summary:
      "Acesse guias práticos sem estereótipos, direitos educacionais (LDB/AEE), o Atlas de Vieses Cognitivos e nossos próximos encontros abertos.",
    ctaLabel: "Ler Missão e Princípios",
    ctaHref: "/sobre",
    secondaryLabel: "Próximos Eventos",
    secondaryHref: "/eventos",
  },
  {
    key: "apoiar",
    num: "04",
    shortLabel: "Quero apoiar ou ver transparência",
    eyebrow: "Sustentabilidade Aberta",
    title: "Transparência total em cada doação, compra e custo operacional",
    summary:
      "Acompanhe tudo o que entra via Mercado Pago (Pix, Cartão e Boleto) e tudo o que sai em impostos, domínio e infraestrutura.",
    ctaLabel: "Portal de Transparência",
    ctaHref: "/apoie",
    secondaryLabel: "Conhecer a Lojinha",
    secondaryHref: "/loja",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* ATO 1: Abertura Editorial + Prancha Botânica da Obra Fundadora */}
      <section className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div className="space-y-6">
              <p
                className="font-mono-num text-[11px] font-semibold uppercase tracking-[0.14em]"
                style={{ color: "var(--accent-emerald)" }}
              >
                Associação · Altas Habilidades / Superdotação &amp; 2e
              </p>

              <h1 className="font-display text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-[3.45rem]">
                Compreender a superdotação{" "}
                <em className="italic font-normal" style={{ color: "var(--accent-emerald)" }}>
                  sem mitos
                </em>
                , em primeira pessoa.
              </h1>

              <p className="max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: "var(--text-secondary)" }}>
                Espaço aberto e baseado em evidências para reconhecer a superdotação como fenômeno neurofisiológico
                plural — sem romantização, sem patologização e sem exclusivismo.
              </p>

              <div className="flex flex-wrap items-center gap-5 pt-2">
                <Link
                  href="/associe-se"
                  className="btn-primary inline-flex min-h-[46px] items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold"
                >
                  <span>Associe-se e crie seu Avatar</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/profissionais"
                  className="link-editorial inline-flex items-center gap-1.5 py-2 text-sm font-semibold"
                >
                  <span>Rede de Profissionais</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="lg:justify-self-end w-full">
              <BotanicalSpecimenFrame />
            </div>
          </div>
        </div>
      </section>

      {/* ATO 2: Navegação por Intenção (Índice Editorial) */}
      <section className="mx-auto max-w-[1400px] px-5 pt-16 sm:px-8 lg:px-10">
        <ScrollReveal>
          <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono-num text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--accent-emerald)" }}>
                Índice de Entrada
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
                Por onde você quer começar?
              </h2>
            </div>
            <p className="text-xs sm:text-sm max-w-sm" style={{ color: "var(--text-muted)" }}>
              Escolha seu momento atual para ir direto ao conteúdo ou serviço adequado.
            </p>
          </div>
        </ScrollReveal>

        <EditorialIndexRail items={JOURNEYS} />
      </section>

      {/* ATO 3: Diagrama de Assincronia */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-10">
        <AssynchronyDiagram />
      </section>

      {/* ATO 4: Faixa Editorial de Transparência, Apoio & Convivência */}
      <section
        className="border-y py-14"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
      >
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:px-10">
          <div className="max-w-2xl space-y-2">
            <p className="font-mono-num text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--accent-emerald)" }}>
              Sustentabilidade &amp; Contas Abertas
            </p>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              Cada real investido em acolhimento e ciência é público.
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Apoie a associação via Mercado Pago (Pix, Cartão e Boleto), APOIA.se ou na nossa Lojinha oficial — com
              prestação de contas aberta no Portal de Transparência.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/apoie"
              className="btn-primary inline-flex min-h-[44px] items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold"
            >
              <span>Apoiar &amp; Ver Transparência</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/loja"
              className="btn-secondary inline-flex min-h-[44px] items-center rounded-lg px-4 py-2.5 text-sm font-semibold"
            >
              Lojinha Oficial
            </Link>
            <a
              href="https://chat.whatsapp.com/IkD3gldncwsBmvSH1j8N6b"
              target="_blank"
              rel="noopener noreferrer"
              className="link-editorial inline-flex items-center gap-1 py-2 text-sm font-semibold"
            >
              <span>Grupo WhatsApp</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
