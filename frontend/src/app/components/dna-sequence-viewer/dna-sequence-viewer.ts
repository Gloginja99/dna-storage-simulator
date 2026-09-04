import { Component, input } from '@angular/core';
import { DnaStrand, DnaBase } from '../../models/simulation.models';

@Component({
  selector: 'app-dna-sequence-viewer',
  imports: [],
  templateUrl: './dna-sequence-viewer.html',
  styleUrl: './dna-sequence-viewer.scss',
})
export class DnaSequenceViewer {
  strands = input<DnaStrand[]>([]);
  originalStrands = input<DnaStrand[]>([]);
  mode = input<'original' | 'errors' | 'recovered'>('original');
  showLabels = input(true);
  compact = input(false);

  isModified(strand: DnaStrand, baseIndex: number): boolean {
    if (this.mode() === 'original') return false;
    const orig = this.originalStrands().find((s) => s.id === strand.id);
    if (!orig) return false;
    return !orig.bases[baseIndex] || strand.bases[baseIndex] !== orig.bases[baseIndex];
  }

  isExtra(strand: DnaStrand, baseIndex: number): boolean {
    if (this.mode() !== 'errors') return false;
    const orig = this.originalStrands().find((s) => s.id === strand.id);
    if (!orig) return false;
    return baseIndex >= orig.bases.length;
  }

  getBaseClass(strand: DnaStrand, base: DnaBase, baseIndex: number): string {
    const cls = [`base-${base}`];
    if (this.isExtra(strand, baseIndex)) cls.push('extra');
    else if (this.isModified(strand, baseIndex)) cls.push('modified');
    return cls.join(' ');
  }
}
