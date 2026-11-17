import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/vivenciassuperdotadas/" },
  { label: "YouTube", href: "https://www.youtube.com/@Viv%C3%AAnciasSuperdotadas" },
  { label: "TikTok", href: "https://www.tiktok.com/@vivenciassuperdotadas" },
  { label: "WhatsApp", href: "https://chat.whatsapp.com/IkD3gldncwsBmvSH1j8N6b" },
  { label: "APOIA.se", href: "https://apoia.se/vivenciassuperdotadas" },
  { label: "Livro Vivi Goods", href: "https://bio.uiclap.com/Vivenciassuperdotadas" },
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
          className="flex flex-col justify-between gap-8 border-b pb-10 lg:flex-row lg:items-end"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <div className="flex items-start gap-3.5 max-w-xl">
            <BrandMark size={38} />
            <div>
              <p className="font-display text-xl font-semibold tracking-tight">Vivências Superdotadas</p>
              <p className="text-xs sm:text-sm mt-1 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Associação de Apoio às Altas Habilidades/Superdotação e Dupla Excepcionalidade
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {SOCIAL_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold transition-colors hover:underline"
                style={{ color: "var(--text-primary)" }}
              >
                <span>{item.label}</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
              </a>
            ))}
          </div>
        </div>

        {/* Clean 3-Column Editorial Grid */}
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-mono-num text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--accent-emerald)" }}>
              01 · Propósito
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Espaço aberto e baseado em evidências para compreender a superdotação sem romantização, sem patologização e sem exclusivismo.
            </p>
          </div>

          <div>
            <p className="font-mono-num text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--accent-emerald)" }}>
              02 · Navegação
            </p>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
              <li><Link href="/sobre" className="hover:underline">Associação</Link></li>
              <li><Link href="/conhecimento" className="hover:underline">Conhecimento</Link></li>
              <li><Link href="/profissionais" className="hover:underline">Profissionais</Link></li>
              <li><Link href="/eventos" className="hover:underline">Eventos</Link></li>
              <li><Link href="/comunidade" className="hover:underline">Comunidade</Link></li>
              <li><Link href="/associe-se" className="hover:underline">Associe-se</Link></li>
              <li><Link href="/apoie" className="hover:underline">Transparência</Link></li>
              <li><Link href="/loja" className="hover:underline">Lojinha</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-mono-num text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--accent-emerald)" }}>
              03 · Aviso Ético
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Este portal não realiza diagnósticos clínicos. Avaliação e acompanhamento devem ser feitos por profissionais habilitados (CRP / CRM / Psicopedagogia).
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
              <Link href="/entrar" className="underline">Entrar / Perfil</Link>
              <Link href="/admin" className="underline">Área Administrativa</Link>
            </div>
          </div>
        </div>

        <div
          className="mt-10 flex flex-col items-start justify-between gap-2 border-t pt-6 text-xs sm:flex-row sm:items-center"
          style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
        >
          <span>© {new Date().getFullYear()} Associação Vivências Superdotadas.</span>
          <span className="font-mono-num">Cada pessoa é única · ∞</span>
        </div>
      </div>
    </footer>
  );
}
