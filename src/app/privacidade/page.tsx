import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade e Tratamento de Dados (LGPD)",
};

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <div className="space-y-3 border-b pb-8" style={{ borderColor: "var(--border-subtle)" }}>
        <p className="font-mono-num text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--accent-emerald)" }}>
          Conformidade LGPD · Lei nº 13.709/2018
        </p>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          Política de Tratamento de Dados
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Transparência sobre como a Associação Vivências Superdotadas coleta, armazena e exibe dados de associados e
          profissionais parceiros.
        </p>
      </div>

      <div className="mt-8 space-y-8 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        <section className="space-y-2 border-b pb-6" style={{ borderColor: "var(--border-subtle)" }}>
          <h2 className="font-display text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            1. Dados de Profissionais Parceiros
          </h2>
          <p>
            Ao preencher o formulário de cadastro em <Link href="/profissionais" className="underline">/profissionais</Link>,
            os dados profissionais informados (nome, registro profissional, especialidade, tipo de atuação, cidade/UF,
            WhatsApp comercial, e-mail profissional e link de rede/site) passam por moderação administrativa e, uma vez
            aprovados, são exibidos publicamente no diretório para viabilizar o contato direto da comunidade.
          </p>
        </section>

        <section className="space-y-2 border-b pb-6" style={{ borderColor: "var(--border-subtle)" }}>
          <h2 className="font-display text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            2. Dados de Associados &amp; Dados Sensíveis (Art. 11)
          </h2>
          <p>
            O login cria apenas identidade de acesso. A solicitação de associação registra perfil, cidade/UF e aceite do
            Estatuto e do Código de Boa Convivência. Informações relacionadas à saúde ou avaliação neuropsicológica não
            são expostas publicamente em nenhuma página e são utilizadas exclusivamente para fins internos e
            estatutários.
          </p>
        </section>

        <section className="space-y-2 border-b pb-6" style={{ borderColor: "var(--border-subtle)" }}>
          <h2 className="font-display text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            3. Exibição Pública na Comunidade
          </h2>
          <p>
            Em <Link href="/comunidade" className="underline">/comunidade</Link>, exibimos apenas a contagem agregada de
            associados ativos e uma amostra anônima de avatares daqueles que marcaram explicitamente a opção de
            consentimento, sem expor nome completo ou e-mail.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            4. Direitos do Titular (Exclusão e Correção)
          </h2>
          <p>
            Você pode atualizar suas preferências a qualquer momento em <Link href="/associe-se" className="underline">/associe-se</Link>{" "}
            ou solicitar a alteração/remoção definitiva de seus dados junto à administração pelo canal oficial da associação.
          </p>
        </section>
      </div>
    </div>
  );
}
