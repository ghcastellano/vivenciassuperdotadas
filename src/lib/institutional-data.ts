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
  category: "Legislação Federal" | "Diretrizes MEC" | "Regulamentação";
  summary: string;
  detail: string;
  source: string;
  href: string;
  external?: boolean;
  featured?: boolean;
  fullBody?: string[];
  officialRefUrl?: string;
  officialRefLabel?: string;
}

export const KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  {
    id: "cf-art-208",
    title: "Constituição Federal — Art. 208, inciso V",
    category: "Legislação Federal",
    summary:
      "Texto constitucional literal que garante acesso aos níveis mais elevados do ensino, da pesquisa e da criação artística, segundo a capacidade de cada um.",
    detail:
      "“Art. 208. O dever do Estado com a educação será efetivado mediante a garantia de: [...] V - acesso aos níveis mais elevados do ensino, da pesquisa e da criação artística, segundo a capacidade de cada um.”",
    source: "Constituição da República Federativa do Brasil de 1988",
    href: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm#art208",
    external: true,
    fullBody: [
      "Art. 208. O dever do Estado com a educação será efetivado mediante a garantia de:",
      "III - atendimento educacional especializado aos portadores de deficiência, preferencialmente na rede regular de ensino;",
      "V - acesso aos níveis mais elevados do ensino, da pesquisa e da criação artística, segundo a capacidade de cada um.",
    ],
    officialRefUrl: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm#art208",
    officialRefLabel: "Consultar Constituição Federal (Planalto)",
  },
  {
    id: "ldb-arts-58-59",
    title: "LDB — Lei nº 9.394/1996 (Arts. 58, 59 e 59-A)",
    category: "Legislação Federal",
    summary:
      "Texto literal da Lei de Diretrizes e Bases da Educação Nacional sobre Educação Especial, aceleração para superdotados e Cadastro Nacional.",
    detail:
      "Inclui educandos com altas habilidades ou superdotação no público da Educação Especial, assegura aceleração para concluir em menor tempo e institui o cadastro nacional.",
    source: "Lei nº 9.394/1996 (redação dada pelas Leis nº 12.796/2013 e nº 13.234/2015)",
    href: "https://www.planalto.gov.br/ccivil_03/leis/l9394.htm#art58",
    external: true,
    fullBody: [
      "Art. 58. Entende-se por educação especial, para os efeitos desta Lei, a modalidade de educação escolar oferecida preferencialmente na rede regular de ensino, para educandos com deficiência, transtornos globais do desenvolvimento e altas habilidades ou superdotação. (Redação dada pela Lei nº 12.796, de 2013)",
      "Art. 59. Os sistemas de ensino assegurarão aos educandos com deficiência, transtornos globais do desenvolvimento e altas habilidades ou superdotação: I - currículos, métodos, técnicas, recursos educativos e organização específicos, para atender às suas necessidades; II - terminalidade específica para aqueles que não puderem atingir o nível exigido para a conclusão do ensino fundamental, em virtude de suas deficiências, e aceleração para concluir em menor tempo o programa escolar para os superdotados;",
      "Art. 59-A. O poder público deverá instituir cadastro nacional de alunos com altas habilidades ou superdotação matriculados na educação básica e na educação superior, a fim de fomentar a execução de políticas públicas destinadas ao desenvolvimento pleno das potencialidades desse alunado. (Incluído pela Lei nº 13.234, de 2015)",
    ],
    officialRefUrl: "https://www.planalto.gov.br/ccivil_03/leis/l9394.htm#art58",
    officialRefLabel: "Texto Integral — LDB (Planalto)",
  },
  {
    id: "resolucao-cne-4-2009",
    title: "Resolução CNE/CEB nº 4/2009 — Diretrizes do AEE (MEC)",
    category: "Diretrizes MEC",
    summary:
      "Diretrizes Operacionais para o Atendimento Educacional Especializado na Educação Básica: suplementação e enriquecimento curricular.",
    detail:
      "Estabelece que o AEE para estudantes com altas habilidades/superdotação tem caráter de suplementação e enriquecimento curricular em salas de recursos multifuncionais ou núcleos específicos.",
    source: "Ministério da Educação · Conselho Nacional de Educação (CNE/CEB)",
    href: "https://portal.mec.gov.br/dmdocuments/rceb004_09.pdf",
    external: true,
    fullBody: [
      "Art. 4º Para fins destas Diretrizes, considera-se público-alvo do AEE: [...] III – Alunos com altas habilidades/superdotação: aqueles que apresentam um potencial elevado e grande envolvimento com as áreas do conhecimento humano, isoladas ou combinadas: intelectual, liderança, psicomotora, artes e criatividade.",
      "Art. 7º Os alunos com altas habilidades/superdotação terão suas atividades de enriquecimento curricular desenvolvidas no âmbito de escolas públicas de ensino regular em interface com os núcleos de atividades para altas habilidades/superdotação e com as instituições de ensino superior e institutos voltados ao desenvolvimento e promoção da pesquisa, das artes e dos esportes.",
    ],
    officialRefUrl: "https://portal.mec.gov.br/dmdocuments/rceb004_09.pdf",
    officialRefLabel: "PDF Oficial — Resolução CNE/CEB nº 4/2009 (MEC)",
  },
  {
    id: "pnee-mec-2008",
    title: "Política Nacional de Educação Especial — MEC (2008)",
    category: "Diretrizes MEC",
    summary:
      "Definição oficial adotada pelo Ministério da Educação para Altas Habilidades/Superdotação na perspectiva da educação inclusiva.",
    detail:
      "Documento-base do MEC/SEESP que conceitua Altas Habilidades/Superdotação e orienta o Atendimento Educacional Especializado.",
    source: "Ministério da Educação · SECADI/SEESP (2008)",
    href: "https://portal.mec.gov.br/arquivos/pdf/politicaeducespecial.pdf",
    external: true,
    fullBody: [
      "“Alunos com altas habilidades/superdotação demonstram potencial elevado em qualquer uma das seguintes áreas, isoladas ou combinadas: intelectual, acadêmica, liderança, psicomotricidade e artes. Também apresentam elevada criatividade, grande envolvimento na aprendizagem e realização de tarefas em áreas de seu interesse.” (Política Nacional de Educação Especial na Perspectiva da Educação Inclusiva, MEC, 2008).",
      "Para consulta completa sobre identificação, núcleos (NAAH/S) e orientações pedagógicas, acesse diretamente os documentos oficiais do Ministério da Educação.",
    ],
    officialRefUrl: "https://portal.mec.gov.br/arquivos/pdf/politicaeducespecial.pdf",
    officialRefLabel: "Documento Oficial — MEC (2008)",
  },
  {
    id: "satepsi-cfp",
    title: "SATEPSI — Sistema de Avaliação de Testes Psicológicos (CFP)",
    category: "Regulamentação",
    summary:
      "Sistema oficial do Conselho Federal de Psicologia para consulta pública de instrumentos psicológicos padronizados e privativos.",
    detail:
      "Avaliações formais são conduzidas exclusivamente por profissionais habilitados (CRP). Consulte diretamente os instrumentos aprovados pelo CFP.",
    source: "Conselho Federal de Psicologia (CFP)",
    href: "https://satepsi.cfp.org.br/",
    external: true,
    officialRefUrl: "https://satepsi.cfp.org.br/",
    officialRefLabel: "Acessar SATEPSI Oficial (CFP)",
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
