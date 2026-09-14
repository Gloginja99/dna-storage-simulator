import { DnaBase } from '../models/simulation.models';

const BASES: DnaBase[] = ['A', 'T', 'C', 'G'];
// Postojeće kodiranje smešta jedan bajt u četiri baze. Pretražujemo ceo
// prostor kodova, uključujući neštampajuće bajtove, bez korišćenja originala.
const CANDIDATES: DnaBase[][] = Array.from({ length: 256 }, (_, value) =>
  [6, 4, 2, 0].map((shift) => BASES[(value >> shift) & 3]),
);

export function levenshtein(a: readonly DnaBase[], b: readonly DnaBase[]): number {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    previous = current;
  }
  return previous[b.length];
}

/** Tačna medijana fiksne dužine uz jediničnu cenu zamene, umetanja i brisanja.
 * Više jednakih optimuma daje neodređen rezultat, bez nagađanja. Prazna čitanja
 * dodaju istu cenu svakom kandidatu i zato ne pružaju informacije.
 */
export function consensus(reads: readonly (readonly DnaBase[])[]): DnaBase[] | null {
  if (!reads.some((read) => read.length > 0)) return null;
  let bestScore = Infinity;
  let best: DnaBase[] | null = null;
  for (const candidate of CANDIDATES) {
    let score = 0;
    for (const read of reads) {
      score += levenshtein(candidate, read);
      if (score > bestScore) break;
    }
    if (score < bestScore) {
      bestScore = score;
      best = candidate;
    } else if (score === bestScore) {
      best = null;
    }
  }
  return best ? [...best] : null;
}
