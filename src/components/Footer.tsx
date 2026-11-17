import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

const SOCIAL_PILLS = [
  { label: "Instagram", href: "https://www.instagram.com/vivenciassuperdotadas/" },
  { label: "YouTube", href: "https://www.youtube.com/@Viv%C3%AAnciasSuperdotadas" },
  { label: "TikTok", href: "https://www.tiktok.com/@vivenciassuperdotadas" },
  { label: "WhatsApp", href: "https://chat.whatsapp.com/IkD3gldncwsBmvSH1j8N6b" },
  { label: "APOIA.se", href: "https://apoia.se/vivenciassuperdotadas", accent: "var(--accent-crimson)" },
  { label: "Livro Vivi Goods", href: "https://bio.uiclap.com/Vivenciassuperdotadas", accent: "var(--accent-amber)" },
];

export function Footer() {
  return (
    <footer
      className="border-t mt-24"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 lg:px-10">
        {/* Top Editorial Band */}
        <div
          className="flex flex-col justify-between gap-8 border-b pb-10 lg:flex-row lg:items-center"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <div className="flex items-start gap-3.5 max-w-xl">
            <BrandMark size={40} />
            <div>
              <p className="font-display text-xl font-semibold tracking-tight">Vivências Superdotadas</p>
              <p className="text-xs sm:text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                Associação de Apoio às Altas Habilidades/Superdotação e Dupla Excepcionalidade
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {SOCIAL_PILLS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: item.accent || "var(--border-subtle)",
                  color: item.accent || "var(--text-primary)",
                }}
              >
                <span>{item.label}</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
              </a>
            ))}
          </div>
        </div>

        {/* Clean 3-Column Grid */}
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Associação
            </p>
            <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <li><Link href="/sobre" className="hover:opacity-75 transition-opacity">Missão, Visão e Valores</Link></li>
              <li><Link href="/conhecimento" className="hover:opacity-75 transition-opacity">Área de Conhecimento</Link></li>
              <li><Link href="/profissionais" className="hover:opacity-75 transition-opacity">Profissionais Especializados</Link></li>
              <li><Link href="/eventos" className="hover:opacity-75 transition-opacity">Próximos Eventos</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Comunidade & Sustentabilidade
            </p>
            <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <li><Link href="/associe-se" className="hover:opacity-75 transition-opacity">Associe-se e crie seu Avatar</Link></li>
              <li><Link href="/comunidade" className="hover:opacity-75 transition-opacity">Artes, Links e Vivências</Link></li>
              <li><Link href="/apoie" className="hover:opacity-75 transition-opacity">Apoie & Portal de Transparência</Link></li>
              <li><Link href="/loja" className="hover:opacity-75 transition-opacity">Lojinha da Associação</Link></li>
            </ul>
          </div>

          <div
            className="border-l-2 pl-5 space-y-2 text-sm"
            style={{ borderColor: "var(--accent-emerald)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-emerald)" }}>
              Acolhimento & Cuidado Imediato
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              A associação reconhece e acolhe vivências em primeira pessoa, mas <strong>não substitui diagnóstico nem
              atendimento clínico</strong>. Em momentos de sofrimento emocional agudo, ligue{" "}
              <strong>188 (CVV)</strong> ou procure o <strong>CAPS / SUS</strong>.
            </p>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div
          className="mt-12 flex flex-col gap-3 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
        >
          <p>© {new Date().getFullYear()} Vivências Superdotadas · Sem romantização, sem patologização e sem exclusivismo.</p>
          <div className="flex items-center gap-5">
            <Link href="/admin" className="hover:opacity-80">Administração</Link>
            <Link href="/sobre#convivencia" className="hover:opacity-80">Código de Boa Convivência</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
