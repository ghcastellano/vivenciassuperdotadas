import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="border-t mt-20"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo-vivencias.jpg"
                alt="Vivências Superdotadas"
                className="h-11 w-11 rounded-xl object-cover border"
                style={{ borderColor: "var(--border-subtle)" }}
              />
              <div>
                <p className="font-display text-base font-semibold">Vivências Superdotadas</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Acolhimento, ciência e voz em primeira pessoa
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Associação dedicada a reconhecer e acolher pessoas com AH/SD e neurodivergências sem
              romantização, sem patologização e sem exclusivismo.
            </p>
          </div>

          <div className="space-y-2.5 text-sm">
            <p className="font-semibold">Portal</p>
            <ul className="space-y-1.5" style={{ color: "var(--text-secondary)" }}>
              <li><Link href="/sobre" className="hover:underline">Missão, Visão e Valores</Link></li>
              <li><Link href="/exploracao" className="hover:underline">Exploração Pessoal (não é diagnóstico)</Link></li>
              <li><Link href="/conhecimento" className="hover:underline">Área de Conhecimento</Link></li>
              <li><Link href="/profissionais" className="hover:underline">Profissionais Parceiros</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5 text-sm">
            <p className="font-semibold">Comunidade & Apoio</p>
            <ul className="space-y-1.5" style={{ color: "var(--text-secondary)" }}>
              <li><Link href="/associe-se" className="hover:underline">Associe-se e crie seu Avatar</Link></li>
              <li><Link href="/comunidade" className="hover:underline">Artes, Links e Vivências</Link></li>
              <li><Link href="/eventos" className="hover:underline">Próximos Eventos</Link></li>
              <li><Link href="/apoie" className="hover:underline">Doações & Transparência</Link></li>
              <li><Link href="/loja" className="hover:underline">Lojinha da Associação</Link></li>
            </ul>
          </div>

          <div className="space-y-3 text-sm">
            <p className="font-semibold">Conexão & Cuidado</p>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.instagram.com/vivenciassuperdotadas/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "var(--accent-emerald)" }}
              >
                Instagram @vivenciassuperdotadas
              </a>
              <a
                href="https://chat.whatsapp.com/IkD3gldncwsBmvSH1j8N6b"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "var(--accent-emerald)" }}
              >
                Grupo da Comunidade no WhatsApp
              </a>
            </div>
            <div
              className="rounded-xl border p-3 text-xs leading-relaxed"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
            >
              <strong>Cuidado imediato:</strong> A associação acolhe, mas não substitui atendimento
              clínico. Em sofrimento agudo, ligue <strong>188 (CVV)</strong> ou procure o{" "}
              <strong>CAPS / SUS</strong>.
            </div>
          </div>
        </div>

        <div
          className="mt-10 flex flex-col gap-2 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
        >
          <p>© {new Date().getFullYear()} Associação Vivências Superdotadas. Código aberto à comunidade.</p>
          <p>
            <Link href="/admin" className="hover:underline">Administração</Link> ·{" "}
            <Link href="/sobre#convivencia" className="hover:underline">Código de Boa Convivência</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
