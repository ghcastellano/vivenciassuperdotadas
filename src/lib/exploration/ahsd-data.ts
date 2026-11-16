export interface Subscale {
  key: string;
  name: string;
  description: string;
}

export interface AhsdQuestion {
  id: string;
  subscale: string;
  text: string;
}

export const AHSD_SUBSCALES: Subscale[] = [
  { key: "intelectual", name: "Intelectual / Aprendizagem", description: "Rapidez de aprendizagem, raciocínio, memória e curiosidade." },
  { key: "criatividade", name: "Pensamento Criador", description: "Originalidade, fluência de ideias e imaginação." },
  { key: "motivacao", name: "Comprometimento com a Tarefa", description: "Persistência, envolvimento profundo e altos padrões." },
  { key: "lideranca", name: "Liderança / Social", description: "Influência, comunicação, responsabilidade e senso de justiça." },
  { key: "artistica", name: "Talento Artístico", description: "Expressão em artes visuais, música, teatro, escrita." },
  { key: "psicomotora", name: "Capacidade Psicomotora", description: "Energia física, coordenação e desempenho motor." },
];

export const LIKERT_OPTIONS = [
  { value: 1, label: "1 · Quase nunca" },
  { value: 2, label: "2 · Raramente" },
  { value: 3, label: "3 · Às vezes" },
  { value: 4, label: "4 · Frequentemente" },
  { value: 5, label: "5 · Quase sempre" },
];

const RAW_QUESTIONS: [string, string][] = [
  ["intelectual", "Aprendo conceitos novos com muita rapidez, às vezes antes de uma explicação completa."],
  ["intelectual", "Tenho um vocabulário amplo e gosto de usar as palavras com precisão."],
  ["intelectual", "Faço perguntas profundas e questiono o 'porquê' das coisas com frequência."],
  ["intelectual", "Relaciono ideias de áreas diferentes e enxergo conexões que outros não percebem."],
  ["intelectual", "Guardo com facilidade grande quantidade de informação sobre assuntos que me interessam."],
  ["intelectual", "Sinto tédio ou impaciência com tarefas repetitivas e pouco desafiadoras."],
  ["intelectual", "Raciocino bem de forma abstrata e gosto de resolver problemas complexos."],

  ["criatividade", "Tenho muitas ideias e soluções originais para um mesmo problema."],
  ["criatividade", "Costumo dar usos inesperados a objetos ou conceitos comuns."],
  ["criatividade", "Minha imaginação é vívida; crio cenários, histórias ou invenções na mente."],
  ["criatividade", "Questiono regras e convenções quando não fazem sentido para mim."],
  ["criatividade", "Tenho um senso de humor criativo, com trocadilhos e associações inusitadas."],
  ["criatividade", "Prefiro caminhos próprios e não convencionais para resolver as coisas."],

  ["motivacao", "Quando um assunto me fascina, mergulho nele por horas e perco a noção do tempo."],
  ["motivacao", "Tenho padrões elevados e busco fazer as coisas com excelência."],
  ["motivacao", "Persisto em problemas difíceis mesmo sem recompensa externa."],
  ["motivacao", "Minha motivação vem mais de dentro do que de elogios ou notas."],
  ["motivacao", "Sou autocrítico(a) e reviso meu trabalho até ficar satisfeito(a)."],
  ["motivacao", "Dedico-me intensamente a interesses específicos por longos períodos."],

  ["lideranca", "As pessoas costumam me procurar para organizar atividades ou resolver impasses."],
  ["lideranca", "Percebo as habilidades dos outros e articulo o grupo em torno delas."],
  ["lideranca", "Tenho forte senso de justiça e me incomodo com situações injustas."],
  ["lideranca", "Comunico minhas ideias com clareza e consigo influenciar as pessoas."],
  ["lideranca", "Assumo responsabilidades e as pessoas confiam em mim para conduzir tarefas."],
  ["lideranca", "Às vezes me sinto 'fora de sintonia' com pessoas da minha idade."],

  ["artistica", "Tenho facilidade e prazer em uma ou mais artes (música, desenho, teatro, escrita, dança…)."],
  ["artistica", "Percebo detalhes estéticos (cores, sons, ritmos, formas) que passam despercebidos."],
  ["artistica", "Expresso ideias e emoções com originalidade por meio de alguma linguagem artística."],
  ["artistica", "Consigo improvisar ou criar com desenvoltura na minha área artística."],
  ["artistica", "As pessoas comentam sobre o meu talento em alguma forma de arte."],

  ["psicomotora", "Tenho energia física elevada e gosto de atividades vigorosas."],
  ["psicomotora", "Aprendo movimentos e habilidades físicas com facilidade e precisão."],
  ["psicomotora", "Destaco-me em esportes ou atividades que exigem coordenação e agilidade."],
  ["psicomotora", "Tenho bom controle corporal e destreza manual."],
];

export const AHSD_QUESTIONS: AhsdQuestion[] = RAW_QUESTIONS.map(([subscale, text], i) => ({
  id: `q${i + 1}`,
  subscale,
  text,
}));

export function scoreAhsd(responses: Record<string, number>) {
  const bySubscale = AHSD_SUBSCALES.map((sub) => {
    const qs = AHSD_QUESTIONS.filter((q) => q.subscale === sub.key);
    const answered = qs.filter((q) => responses[q.id] !== undefined);
    const mean =
      answered.length > 0
        ? Math.round((answered.reduce((acc, q) => acc + responses[q.id], 0) / answered.length) * 100) / 100
        : 0;
    return { ...sub, mean, answered: answered.length, total: qs.length };
  }).sort((a, b) => b.mean - a.mean);

  const allAnswered = AHSD_QUESTIONS.filter((q) => responses[q.id] !== undefined);
  const overallMean =
    allAnswered.length > 0
      ? Math.round((allAnswered.reduce((acc, q) => acc + responses[q.id], 0) / allAnswered.length) * 100) / 100
      : 0;

  let label = "Indicadores pouco presentes neste autorrelato";
  if (overallMean >= 4.3) label = "Indicadores fortes e consistentes";
  else if (overallMean >= 3.7) label = "Indicadores consistentes";
  else if (overallMean >= 3.0) label = "Alguns indicadores presentes";

  return { overallMean, label, bySubscale, answeredCount: allAnswered.length };
}
