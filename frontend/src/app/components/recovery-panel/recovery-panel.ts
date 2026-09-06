import { Component, input, computed } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { ErrorType, RecoveryResult, SimulationMetrics } from '../../models/simulation.models';

@Component({
  selector: 'app-recovery-panel',
  imports: [TranslatePipe],
  templateUrl: './recovery-panel.html',
  styleUrl: './recovery-panel.scss',
})
export class RecoveryPanel {
  result = input<RecoveryResult | null>(null);
  metrics = input<SimulationMetrics | null>(null);
  originalText = input('');

  successPercent = computed(() => {
    const r = this.result();
    return r ? Math.round(r.successRate * 100) : 0;
  });

  readonly errorTypeList: ErrorType[] = [
    'substitution',
    'insertion',
    'deletion',
    'burst',
    'dropout',
  ];
}
