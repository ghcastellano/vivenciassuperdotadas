import { INSTITUTIONAL_DOC } from "@/lib/institutional-data";
import { ShieldCheck, Heart, BookOpen } from "lucide-react";

export const metadata = {
  title: "Missão, Visão e Valores",
};

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:px-12">
      <div className="space-y-4 border-b pb-8" style={{ borderColor: "var(--border-subtle)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
          Documento Institucional
        </p>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          Missão, Visão e Valores — Vivências Superdotadas
        </h1>
        <p className="max-w-3xl text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Nossa atuação nasce do encontro entre a experiência em primeira pessoa e o conhecimento científico de
          qualidade, rejeitando estereótipos, romantizações e exclusivismos.
        </p>
      </div>

      {/* Missão */}
      <section className="mt-10 space-y-4">
        <div className="flex items-center gap-2.5">
          <Heart className="h-5 w-5" style={{ color: "var(--accent-crimson)" }} />
          <h2 className="font-display text-2xl font-semibold">Missão</h2>
        </div>
        <div className="space-y-3 rounded-2xl border p-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
          {INSTITUTIONAL_DOC.missao.map((p, i) => (
            <p key={i} className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* Visão */}
      <section className="mt-10 space-y-4">
        <div className="flex items-center gap-2.5">
          <BookOpen className="h-5 w-5" style={{ color: "var(--accent-emerald)" }} />
          <h2 className="font-display text-2xl font-semibold">Visão</h2>
        </div>
        <div className="space-y-4 rounded-2xl border p-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
          {INSTITUTIONAL_DOC.visao.map((p, i) => (
            <p key={i} className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* Valores */}
      <section id="convivencia" className="mt-10 space-y-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5" style={{ color: "var(--accent-amber)" }} />
          <h2 className="font-display text-2xl font-semibold">Valores & Código de Boa Convivência</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {INSTITUTIONAL_DOC.valores.map((val) => (
            <div
              key={val.title}
              className="rounded-2xl border p-5"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
            >
              <h3 className="font-display text-lg font-semibold" style={{ color: "var(--accent-emerald)" }}>
                {val.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {val.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
