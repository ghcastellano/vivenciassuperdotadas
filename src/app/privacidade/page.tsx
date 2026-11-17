import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade e Tratamento de Dados",
};

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 lg:px-12">
      <div className="space-y-3 border-b pb-8" style={{ borderColor: "var(--border-subtle)" }}>
        <p
          className="font-mono-num text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "var(--accent-emerald)" }}
        >
          LGPD · Transparência no Tratamento de Dados
        </p>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          Política de Privacidade e Tratamento de Dados
        </h1>
        <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          A Associação Vivências Superdotadas trata dados pessoais em conformidade com a Lei Geral de Proteção de Dados
          (Lei nº 13.709/2018 — LGPD), com foco em transparência, finalidade específica e consentimento explícito.
        </p>
      </div>

      <div className="mt-10 space-y-10 text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            1. Cadastro de Profissionais Parceiros
          </h2>
          <p>
            Os dados informados no formulário de cadastro de profissionais (nome, especialização, registro profissional,
            região, estado, cidade, modalidade de atendimento, WhatsApp, e-mail profissional, rede social e resumo de
            atuação) são coletados exclusivamente para análise pela equipe administrativa e, após aprovação,{" "}
            <strong>exibição pública no diretório de Profissionais Especializados</strong> em{" "}
            <Link href="/profissionais" className="underline" style={{ color: "var(--accent-emerald)" }}>
              /profissionais
            </Link>
            .
          </p>
          <p>
            O envio do cadastro depende de anuência explícita da pessoa profissional quanto à publicação e exposição
            desses dados de contato no portal para que pessoas interessadas possam encontrá-la e entrar em contato.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            2. Cadastro de Associados(as) e Comunidade
          </h2>
          <p>
            Dados de conta e associação (como e-mail, cidade/UF, perfil e informação sobre laudo/avaliação) são
            utilizados apenas para gestão interna da associação, comunicação institucional e acesso às funcionalidades do
            portal. <strong>Seu e-mail nunca é exibido publicamente.</strong>
          </p>
          <p>
            A exibição do seu Avatar Único na página pública{" "}
            <Link href="/comunidade" className="underline" style={{ color: "var(--accent-emerald)" }}>
              /comunidade
            </Link>{" "}
            ocorre somente mediante concordância explícita (opção marcada voluntariamente no cadastro ou perfil), sem
            exposição de dados pessoais sensíveis.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            3. Direitos do Titular e Remoção de Dados
          </h2>
          <p>
            A qualquer momento, você pode solicitar confirmação de tratamento, atualização, revogação do consentimento ou
            exclusão definitiva dos seus dados enviando um e-mail para{" "}
            <a href="mailto:vsuperdotadas@gmail.com" className="underline" style={{ color: "var(--accent-emerald)" }}>
              vsuperdotadas@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
