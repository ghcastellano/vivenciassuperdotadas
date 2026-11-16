// Motor de exercícios de raciocínio fluido (matrizes progressivas 3x3).
// Itens originais gerados por regras determinísticas (forma, preenchimento, rotação, tamanho, quantidade).
// Uso exclusivo para autoexploração e estímulo cognitivo — NÃO constitui teste normativo de QI nem diagnóstico.

export type Shape = "circle" | "square" | "triangle" | "diamond" | "cross" | "star";
export type Fill = "none" | "half" | "solid";
export type Tier = "facil" | "medio" | "dificil";
export type Attr = "shape" | "fill" | "rotation" | "size" | "count";

export interface CellSpec {
  shape: Shape;
  fill: Fill;
  rotation: number;
  size: 1 | 2 | 3;
  count: 1 | 2 | 3 | 4;
}

export interface Rule {
  attr: Attr;
  kind: "byRow" | "byCol" | "latin" | "latin2";
  values: (string | number)[];
}

export interface MatrixItem {
  id: number;
  tier: Tier;
  base: CellSpec;
  rules: Rule[];
}

const BASE: CellSpec = { shape: "circle", fill: "solid", rotation: 0, size: 2, count: 1 };

const DOMAINS: Record<Attr, (string | number)[]> = {
  shape: ["circle", "square", "triangle", "diamond", "cross", "star"],
  fill: ["none", "half", "solid"],
  rotation: [0, 45, 90],
  size: [1, 2, 3],
  count: [1, 2, 3, 4],
};

function item(id: number, tier: Tier, rules: Rule[], base: Partial<CellSpec> = {}): MatrixItem {
  return { id, tier, base: { ...BASE, ...base }, rules };
}

export const MATRIX_ITEMS: MatrixItem[] = [
  item(1, "facil", [{ attr: "count", kind: "byCol", values: [1, 2, 3] }]),
  item(2, "facil", [{ attr: "size", kind: "byCol", values: [1, 2, 3] }], { shape: "square" }),
  item(3, "facil", [{ attr: "fill", kind: "byCol", values: ["none", "half", "solid"] }], { shape: "triangle" }),
  item(4, "facil", [{ attr: "rotation", kind: "byCol", values: [0, 45, 90] }], { shape: "triangle" }),
  item(5, "facil", [{ attr: "shape", kind: "latin", values: ["circle", "square", "triangle"] }]),

  item(6, "medio", [
    { attr: "shape", kind: "latin", values: ["circle", "square", "triangle"] },
    { attr: "fill", kind: "byRow", values: ["none", "half", "solid"] },
  ]),
  item(7, "medio", [
    { attr: "count", kind: "latin", values: [1, 2, 3] },
    { attr: "shape", kind: "byRow", values: ["square", "circle", "triangle"] },
  ]),
  item(8, "medio", [
    { attr: "size", kind: "latin", values: [1, 2, 3] },
    { attr: "shape", kind: "byCol", values: ["star", "diamond", "cross"] },
  ]),
  item(9, "medio", [
    { attr: "rotation", kind: "latin", values: [0, 45, 90] },
    { attr: "size", kind: "byRow", values: [1, 2, 3] },
  ], { shape: "triangle" }),

  item(10, "dificil", [
    { attr: "shape", kind: "latin", values: ["circle", "square", "triangle"] },
    { attr: "fill", kind: "latin2", values: ["none", "half", "solid"] },
    { attr: "count", kind: "byRow", values: [1, 2, 3] },
  ]),
  item(11, "dificil", [
    { attr: "shape", kind: "byRow", values: ["diamond", "cross", "star"] },
    { attr: "size", kind: "latin", values: [1, 2, 3] },
    { attr: "fill", kind: "byCol", values: ["solid", "half", "none"] },
  ]),
  item(12, "dificil", [
    { attr: "rotation", kind: "latin", values: [0, 45, 90] },
    { attr: "fill", kind: "latin2", values: ["none", "half", "solid"] },
    { attr: "count", kind: "byCol", values: [1, 2, 3] },
  ], { shape: "triangle" }),
];

export function cellAt(it: MatrixItem, row: number, col: number): CellSpec {
  const cell: CellSpec = { ...it.base };
  for (const r of it.rules) {
    let idx = 0;
    if (r.kind === "byRow") idx = row;
    else if (r.kind === "byCol") idx = col;
    else if (r.kind === "latin") idx = (row + col) % r.values.length;
    else idx = (2 * row + col) % r.values.length;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (cell as any)[r.attr] = r.values[idx];
  }
  return cell;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function key(c: CellSpec): string {
  const rot = c.shape === "triangle" ? c.rotation : 0;
  return `${c.shape}|${c.fill}|${rot}|${c.size}|${c.count}`;
}

function mutate(c: CellSpec, attr: Attr, delta: number): CellSpec {
  const domain = DOMAINS[attr];
  const i = domain.indexOf(c[attr]);
  const next = domain[(i + delta + domain.length) % domain.length];
  return { ...c, [attr]: next } as CellSpec;
}

export function optionsFor(it: MatrixItem, seed = 42): { options: CellSpec[]; answerIndex: number } {
  const answer = cellAt(it, 2, 2);
  const seen = new Set<string>([key(answer)]);
  const distractors: CellSpec[] = [];
  const candidates: CellSpec[] = [];

  for (const rule of it.rules) {
    for (const v of rule.values) {
      if (v !== answer[rule.attr]) candidates.push({ ...answer, [rule.attr]: v } as CellSpec);
    }
  }
  candidates.push(cellAt(it, 2, 1), cellAt(it, 1, 2), cellAt(it, 2, 0), cellAt(it, 0, 2));
  const attrs: Attr[] = ["shape", "fill", "count", "size", "rotation"];
  for (const attr of attrs) {
    candidates.push(mutate(answer, attr, 1), mutate(answer, attr, -1));
  }

  for (const c of candidates) {
    if (c.rotation !== 0 && c.shape !== "triangle") continue;
    const k = key(c);
    if (!seen.has(k)) {
      seen.add(k);
      distractors.push(c);
      if (distractors.length === 5) break;
    }
  }

  const options = [answer, ...distractors];
  const rand = mulberry32(it.id * 7919 + 13 + (seed >>> 0) * 31);
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return { options, answerIndex: options.findIndex((o) => key(o) === key(answer)) };
}
