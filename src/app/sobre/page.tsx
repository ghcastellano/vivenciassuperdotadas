import { INSTITUTIONAL_DOC } from "@/lib/institutional-data";
import { AssynchronyDiagram } from "@/components/editorial/AssynchronyDiagram";

export const metadata = {
  title: "Missão, Visão e Valores",
};

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:px-12">
      <div className="space-y-4 border-b pb-8" style={{ borderColor: "var(--border-subtle)" }}>
        <p className="font-mono-num text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--accent-emerald)" }}>
          Documento Institucional
        </p>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          Missão, Visão e Valores —{" "}
          <em className="italic font-normal" style={{ color: "var(--accent-emerald)" }}>
            Vivências Superdotadas
          </em>
        </h1>
        <p className="max-w-3xl text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Nossa atuação nasce do encontro entre a experiência em primeira pessoa e o conhecimento científico de
          qualidade, rejeitando estereótipos, romantizações e exclusivismos.
        </p>
      </div>

      {/* Missão */}
      <section className="mt-12 grid gap-4 border-b pb-10 md:grid-cols-[200px_1fr]" style={{ borderColor: "var(--border-subtle)" }}>
        <div>
          <span className="font-mono-num text-xs font-semibold" style={{ color: "var(--accent-emerald)" }}>
            01
          </span>
          <h2 className="mt-1 font-display text-2xl font-semibold">Missão</h2>
        </div>
        <div className="max-w-[65ch] space-y-4 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {INSTITUTIONAL_DOC.missao.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Visão */}
      <section className="mt-12 grid gap-4 border-b pb-10 md:grid-cols-[200px_1fr]" style={{ borderColor: "var(--border-subtle)" }}>
        <div>
          <span className="font-mono-num text-xs font-semibold" style={{ color: "var(--accent-emerald)" }}>
            02
          </span>
          <h2 className="mt-1 font-display text-2xl font-semibold">Visão</h2>
        </div>
        <div className="max-w-[65ch] space-y-4 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {INSTITUTIONAL_DOC.visao.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Valores */}
      <section id="convivencia" className="mt-12 space-y-8">
        <div>
          <span className="font-mono-num text-xs font-semibold" style={{ color: "var(--accent-emerald)" }}>
            03 · Código de Boa Convivência
          </span>
          <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">Princípios que sustentam a associação</h2>
        </div>
        <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
          {INSTITUTIONAL_DOC.valores.map((val, idx) => (
            <div key={val.title} className="border-t pt-5" style={{ borderColor: "var(--border-subtle)" }}>
              <span className="font-mono-num text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
                0{idx + 1}
              </span>
              <h3 className="mt-1 font-display text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
                {val.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {val.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <AssynchronyDiagram />
      </section>
    </div>
  );
}
