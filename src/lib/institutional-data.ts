export const INSTITUTIONAL_DOC = {
  missao: [
    "Reconhecer e acolher as pessoas identificadas com Altas Habilidades/Superdotação (AH/SD) em suas próprias formas de ser, legitimando e respeitando a singularidade e a diversidade existentes dentro do que hoje se compreende como critérios de identificação.",
    "Fomentar a divulgação responsável de informações e a expressão em primeira pessoa, e promover ambientes saudáveis de convivência.",
    "Fomentar o autocuidado e, quando houver sofrimento ou dificuldades específicas, incentivar a busca por profissionais especializados e tratamentos com evidência comprovada.",
  ],
  visao: [
    "As altas habilidades/superdotação constituem um fenômeno neurofisiológico, sendo estudado por áreas como a psicologia e a educação há mais de um século, embora ainda existam importantes divergências teóricas e metodológicas sobre sua definição, identificação e caracterização. Porém, sua compreensão pública enfrenta problemas graves, com estereótipos que associam a superdotação com alto desempenho e sucesso profissional, o que aliado à falta de acesso a informações de qualidade e profissionais qualificados, mistifica e desconsidera as diferentes trajetórias individuais.",
    "A disseminação de conteúdos simplificados, generalizações e interpretações pouco fundamentadas pode contribuir para a romantização ou patologização das AH/SD, bem como para a atribuição automática de diferentes formas de sofrimento psicológico à superdotação. Divulgar o conhecimento científico de qualidade é essencial para rebater mal-entendidos do senso comum, dando sentido às vivências.",
    "A identificação com AH/SD não determina sucesso, sofrimento, personalidade ou trajetória de vida, assim como experiências de sofrimento não devem ser automaticamente explicadas pela superdotação. Cada pessoa deve ser compreendida em sua singularidade e em seu contexto.",
    "Acreditamos que a experiência em primeira pessoa possui papel fundamental nesse processo. Pessoas identificadas com AH/SD devem ter espaço para falar sobre suas próprias experiências, sem que suas vozes sejam substituídas por estereótipos, interpretações externas ou discursos generalizantes. Ao mesmo tempo, valorizamos o conhecimento científico e a atuação de profissionais qualificados, entendendo que experiência pessoal, ciência e prática profissional podem dialogar e se complementar.",
    "Nossa visão é de uma sociedade na qual pessoas com AH/SD possam compreender suas características, expressar-se com liberdade e construir suas trajetórias sem a necessidade de corresponder às expectativas estereotipadas sobre o que significa ser superdotado.",
  ],
  valores: [
    {
      title: "Respeito à diferença",
      body: "Reconhecemos e valorizamos a diversidade entre pessoas com AH/SD. Neurodivergentes podem enfrentar pressão para ocultar ou adaptar continuamente suas características às expectativas sociais. Valorizamos a liberdade de expressar diferenças sem mascaramento (masking).",
    },
    {
      title: "Respeito ao lugar de fala",
      body: "A experiência em primeira pessoa é insubstituível para compreender as vivências das pessoas com AH/SD. Fomentamos a expressão e os relatos em primeira pessoa de experiências, trajetórias, desafios e potencialidades.",
    },
    {
      title: "Ética na divulgação científica",
      body: "Conteúdos teóricos e informativos devem ser produzidos com clareza, com os devidos créditos e referências às fontes, e com assessoria de profissionais especializados.",
    },
    {
      title: "Acolhimento",
      body: "Acolher não significa diagnosticar ou substituir o trabalho de profissionais especializados. Muitas pessoas estão vulneráveis, sendo superdotadas ou não, e precisam ser orientadas a buscar tratamentos efetivos, profissionais especializados, redes de apoio e hábitos saudáveis.",
    },
    {
      title: "Não exclusivismo",
      body: "Não buscamos criar uma comunidade isolada da sociedade em que pessoas superdotadas se escondam do mundo, mas sim construir diálogo com toda a sociedade. Divulgar informações a pessoas neurotípicas e recebê-las em nossas comunidades é fundamental.",
    },
    {
      title: "Boa convivência",
      body: "Segurança e respeito são condições fundamentais. Moderação ativa é tão importante quanto ética na difusão de conteúdos. Não toleramos assédio, discriminação, ameaças, violência ou exposição indevida.",
    },
  ],
};

export interface KnowledgeItem {
  id: string;
  title: string;
  category: "Ferramenta Interativa" | "Ciência & Mitos" | "Direitos & Políticas" | "Neuroinclusão";
  summary: string;
  detail: string;
  source: string;
  href: string;
  external?: boolean;
  featured?: boolean;
}

export const KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  {
    id: "atlas-vieses",
    title: "Entrelinhas — Atlas de Vieses Cognitivos",
    category: "Ferramenta Interativa",
    summary:
      "Mapeamento interativo de vieses cognitivos para treinar pensamento crítico, reconhecer atalhos mentais e evitar armadilhas interpretativas.",
    detail:
      "Mesmo mentes analíticas e com alta capacidade de abstração estão sujeitas a vieses cognitivos — inclusive ao interpretar a própria trajetória. O Atlas de Vieses é um dos recursos recomendados da nossa Área de Conhecimento.",
    source: "Projeto Entrelinhas · Atlas de Vieses Cognitivos",
    href: "https://atlasvieses.vercel.app/",
    external: true,
    featured: true,
  },
  {
    id: "mitos-fatos",
    title: "AH/SD sem Romantização e sem Patologização",
    category: "Ciência & Mitos",
    summary:
      "Por que superdotação não é garantia de sucesso acadêmico/profissional — e por que todo sofrimento psíquico não deve ser reduzido automaticamente à AH/SD.",
    detail:
      "Revisão acessível baseada na literatura brasileira (Delou, Virgolim, Fleith & Alencar) e internacional sobre divergências metodológicas, assincronia e singularidade de trajetória.",
    source: "Literatura AH/SD · MEC/SEESP & Delou",
    href: "/sobre",
  },
  {
    id: "avaliacao-crp",
    title: "Como funciona a Avaliação Oficial (CRP) e por que envolve QI",
    category: "Ciência & Mitos",
    summary:
      "Entenda a diferença entre autoexploração aberta e avaliação neuropsicológica/psicológica oficial conduzida por profissional habilitado.",
    detail:
      "No Brasil, a identificação formal considera múltiplas dimensões (intelectual, criatividade, comprometimento, liderança, arte/psicomotora) e inclui instrumentos padronizados de inteligência (QI) privativos de psicólogos.",
    source: "Resoluções CFP / SATEPSI",
    href: "/profissionais",
  },
  {
    id: "direitos-ldb",
    title: "Direitos Educacionais no Brasil (LDB / AEE)",
    category: "Direitos & Políticas",
    summary:
      "O que diz a Lei nº 12.796/2013 sobre o Atendimento Educacional Especializado (AEE) e o direito à aceleração e enriquecimento curricular.",
    detail:
      "Estudantes com AH/SD integram o público da Educação Especial na perspectiva inclusiva, com direito a enriquecimento, suplementação e registro no Censo Escolar.",
    source: "Lei nº 9.394/1996 (alterada pela Lei nº 12.796/2013)",
    href: "/conhecimento#glossario",
  },
  {
    id: "dupla-excepcionalidade",
    title: "Dupla Excepcionalidade (2e) & Mascaramento (Masking)",
    category: "Neuroinclusão",
    summary:
      "Quando AH/SD coexiste com TDAH, TEA, Dislexia ou outras condições, gerando compensações que atrasam a identificação.",
    detail:
      "O esforço contínuo para esconder diferenças (masking) gera exaustão. Compreender o próprio funcionamento ajuda a buscar suporte específico baseado em evidências.",
    source: "Pesquisas sobre Twice-Exceptionality (2e)",
    href: "/conhecimento#glossario",
  },
];

export const GLOSSARY_ITEMS = [
  {
    term: "AH/SD (Altas Habilidades / Superdotação)",
    definition:
      "Fenômeno neurofisiológico caracterizado por potencial elevado em uma ou mais áreas (intelectual, acadêmica, liderança, criatividade, psicomotora ou artística), isoladas ou combinadas.",
  },
  {
    term: "Dupla Excepcionalidade (2e)",
    definition:
      "Presença simultânea de Altas Habilidades/Superdotação e outra neurodivergência ou transtorno (como TDAH, TEA, dislexia ou transtorno de ansiedade).",
  },
  {
    term: "Masking (Mascaramento Social)",
    definition:
      "Esforço consciente ou inconsciente de ocultar características neurodivergentes para se ajustar às expectativas sociais, frequentemente associado à exaustão.",
  },
  {
    term: "Raciocínio Fluido",
    definition:
      "Capacidade de identificar padrões, relações lógicas e resolver problemas novos independentemente de conhecimento escolar prévio.",
  },
  {
    term: "Assincronia",
    definition:
      "Descompasso entre o ritmo de desenvolvimento cognitivo, emocional, social e psicomotor de uma pessoa.",
  },
];

export const DEFAULT_PRODUCTS = [
  {
    id: "prod-camiseta-flor",
    name: "Camiseta Manifesto — Flor & Infinito",
    description: "Algodão 100% penteado em tom Papel Quente com a arte original pintada à mão do Vivências Superdotadas.",
    price_cents: 8900,
    image_url: "/images/logo-vivencias.jpg",
    category: "Vestuário",
  },
  {
    id: "prod-print-tela",
    name: "Print Fine Art — Obra Original Vivências",
    description: "Impressão em papel algodão 300g mantendo fielmente as pinceladas e textura da tela original.",
    price_cents: 6500,
    image_url: "/images/logo-vivencias.jpg",
    category: "Arte",
  },
  {
    id: "prod-caneca-esmeralda",
    name: "Caneca Esmeralda — Primeira Pessoa",
    description: "Cerâmica fosca 325ml. 100% do lucro revertido para manter a infraestrutura e eventos gratuitos da associação.",
    price_cents: 4900,
    image_url: "/images/logo-vivencias.jpg",
    category: "Cotidiano",
  },
];
