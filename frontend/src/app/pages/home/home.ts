import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  helixPairs = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 0.18,
    left: (['A', 'T', 'C', 'G'] as const)[i % 4],
    right: (['T', 'A', 'G', 'C'] as const)[i % 4],
  }));

  baseLegend = [
    { base: 'A', bits: '00', name: 'Adenine', complement: 'T' },
    { base: 'T', bits: '01', name: 'Thymine', complement: 'A' },
    { base: 'C', bits: '10', name: 'Cytosine', complement: 'G' },
    { base: 'G', bits: '11', name: 'Guanine', complement: 'C' },
  ];
}
