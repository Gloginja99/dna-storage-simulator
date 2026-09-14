import { DnaBase } from '../models/simulation.models';

type Symbol = DnaBase | null;

/** Globalno poravnanje: poklapanje +2, nepoklapanje -1, linearna kazna za prazninu -2.
 * Pri jednakim skorovima povratno praćenje bira dijagonalu, zatim brisanje, pa umetanje.
 */
export function needlemanWunsch(a: readonly DnaBase[], b: readonly DnaBase[]) {
  const scores = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++) scores[i][0] = -2 * i;
  for (let j = 1; j <= b.length; j++) scores[0][j] = -2 * j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      scores[i][j] = Math.max(
        scores[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 2 : -1),
        scores[i - 1][j] - 2, scores[i][j - 1] - 2,
      );
    }
  }
  const alignedA: Symbol[] = [], alignedB: Symbol[] = [];
  let i = a.length, j = b.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && scores[i][j] === scores[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 2 : -1)) {
      alignedA.push(a[--i]); alignedB.push(b[--j]);
    } else if (i > 0 && scores[i][j] === scores[i - 1][j] - 2) {
      alignedA.push(a[--i]); alignedB.push(null);
    } else {
      alignedA.push(null); alignedB.push(b[--j]);
    }
  }
  return { score: scores[a.length][b.length], a: alignedA.reverse(), b: alignedB.reverse() };
}

/** Poravnanje oko centralnog oslonca, zatim glasanje strogom većinom, uključujući praznine.
 * Prazna čitanja ne pružaju informacije. Oslonac biramo isključivo među posmatranim
 * čitanjima prema najvećem zbiru parnih skorova; jednakosti razrešavamo leksikografski.
 */
export function needlemanWunschConsensus(reads: readonly (readonly DnaBase[])[]): DnaBase[] | null {
  const observed = reads.filter((read) => read.length > 0)
    .map((read) => [...read]).sort((a, b) => a.join('') < b.join('') ? -1 : a.join('') > b.join('') ? 1 : 0);
  if (!observed.length) return null;
  let anchor = observed[0], best = -Infinity;
  for (const candidate of observed) {
    const score = observed.reduce((sum, read) => sum + needlemanWunsch(candidate, read).score, 0);
    if (score > best) { best = score; anchor = candidate; }
  }
  // Spajamo parna poravnanja prema koordinatama oslonca. Nizove umetanja na
  // istom mestu poravnavamo ulevo i dopunjavamo prazninama do dužine najdužeg niza.
  const aligned = observed.map((read) => {
    const pair = needlemanWunsch(anchor, read);
    const insertions: DnaBase[][] = Array.from({ length: anchor.length + 1 }, () => []);
    const positions: Symbol[] = [];
    let position = 0;
    pair.a.forEach((base, column) => {
      if (base === null) insertions[position].push(pair.b[column]!);
      else { positions.push(pair.b[column]); position++; }
    });
    return { insertions, positions };
  });
  const result: DnaBase[] = [];
  const vote = (column: Symbol[]): boolean => {
    const counts = new Map<Symbol, number>();
    for (const base of column) counts.set(base, (counts.get(base) ?? 0) + 1);
    const winner = [...counts].find(([, count]) => count > observed.length / 2);
    if (!winner) return false;
    if (winner[0] !== null) result.push(winner[0]);
    return true;
  };
  for (let slot = 0; slot <= anchor.length; slot++) {
    const width = Math.max(...aligned.map((read) => read.insertions[slot].length));
    for (let column = 0; column < width; column++) {
      if (!vote(aligned.map((read) => read.insertions[slot][column] ?? null))) return null;
    }
    if (slot < anchor.length && !vote(aligned.map((read) => read.positions[slot]))) return null;
  }
  // Koder propisuje četiri baze po karakteru; rezultat ne dopunjavamo niti skraćujemo.
  return result.length === 4 ? result : null;
}
