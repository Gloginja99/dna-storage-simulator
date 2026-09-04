import { Component, signal, inject, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DnaEncoder } from '../../services/dna-encoder';
import { ErrorSimulator } from '../../services/error-simulator';
import { Recovery } from '../../services/recovery';
import { DnaSequenceViewer } from '../../components/dna-sequence-viewer/dna-sequence-viewer';
import { ErrorControls } from '../../components/error-controls/error-controls';
import { RecoveryPanel } from '../../components/recovery-panel/recovery-panel';
import { StepProgress } from '../../components/step-progress/step-progress';
import {
  SimulationConfig,
  SimulationMetrics,
  SimulationStep,
  DnaStrand,
  ErrorEvent,
  RecoveryResult,
  ErrorType,
} from '../../models/simulation.models';

const DEFAULT_CONFIG: SimulationConfig = {
  enableSubstitution: true,
  enableInsertion: false,
  enableDeletion: false,
  enableBurst: false,
  enableDropout: false,
  errorRate: 0.15,
  burstLength: 3,
};

@Component({
  selector: 'app-simulator',
  imports: [DnaSequenceViewer, ErrorControls, RecoveryPanel, StepProgress],
  templateUrl: './simulator.html',
  styleUrl: './simulator.scss',
})
export class Simulator {
  private encoder = inject(DnaEncoder);
  private errorSim = inject(ErrorSimulator);
  private recovery = inject(Recovery);

  step = signal<SimulationStep>('input');
  inputText = signal('Hello DNA!');
  encodedStrands = signal<DnaStrand[]>([]);
  erroneousStrands = signal<DnaStrand[]>([]);
  errorEvents = signal<ErrorEvent[]>([]);
  metrics = signal<SimulationMetrics | null>(null);
  recoveryResult = signal<RecoveryResult | null>(null);
  erroneousText = signal('');
  requestPending = signal(false);
  apiError = signal<string | null>(null);
  config = signal<SimulationConfig>({ ...DEFAULT_CONFIG });

  charCount = computed(() => this.inputText().trim().length);
  encodedBaseCount = computed(() => this.encodedStrands().length * 4);

  readonly baseLegend = [
    { base: 'A', bits: '00' },
    { base: 'T', bits: '01' },
    { base: 'C', bits: '10' },
    { base: 'G', bits: '11' },
  ];
  readonly errorTypeKeys: ErrorType[] = [
    'substitution',
    'insertion',
    'deletion',
    'burst',
    'dropout',
  ];

  async onEncode() {
    const text = this.inputText().trim().slice(0, 60);
    if (!text) return;
    this.requestPending.set(true);
    this.apiError.set(null);

    try {
      const response = await firstValueFrom(this.encoder.encode(text));
      this.inputText.set(response.text);
      this.encodedStrands.set(response.strands);
      this.erroneousStrands.set([]);
      this.erroneousText.set('');
      this.errorEvents.set([]);
      this.metrics.set(null);
      this.recoveryResult.set(null);
      this.step.set('encoded');
    } catch {
      this.apiError.set('Failed to encode. Make sure backend is running on port 3000.');
    } finally {
      this.requestPending.set(false);
    }
  }

  onGoToErrors() {
    this.step.set('errors');
  }

  async onSimulateErrors() {
    this.requestPending.set(true);
    this.apiError.set(null);

    try {
      const response = await firstValueFrom(
        this.errorSim.simulate(this.encodedStrands(), this.config()),
      );
      this.erroneousStrands.set(response.strands);
      this.erroneousText.set(response.decodedText);
      this.errorEvents.set(response.events);
      this.metrics.set(response.metrics);
      this.step.set('errors');
    } catch {
      this.apiError.set('Failed to simulate errors. Please try again.');
    } finally {
      this.requestPending.set(false);
    }
  }

  async onRecover() {
    this.requestPending.set(true);
    this.apiError.set(null);

    try {
      const response = await firstValueFrom(
        this.recovery.recover(this.erroneousStrands(), this.encodedStrands()),
      );
      this.recoveryResult.set(response);
      this.step.set('recovered');
    } catch {
      this.apiError.set('Failed to recover data. Please try again.');
    } finally {
      this.requestPending.set(false);
    }
  }

  onGoBack() {
    const s = this.step();
    if (s === 'encoded') this.step.set('input');
    else if (s === 'errors') {
      this.erroneousStrands.set([]);
      this.erroneousText.set('');
      this.step.set('encoded');
    } else if (s === 'recovered') this.step.set('errors');
  }

  onReset() {
    this.step.set('input');
    this.encodedStrands.set([]);
    this.erroneousStrands.set([]);
    this.erroneousText.set('');
    this.errorEvents.set([]);
    this.metrics.set(null);
    this.recoveryResult.set(null);
    this.apiError.set(null);
    this.config.set({ ...DEFAULT_CONFIG });
  }

  onConfigChange(config: SimulationConfig) {
    this.config.set(config);
  }
  onInputChange(e: Event) {
    this.inputText.set((e.target as HTMLTextAreaElement).value);
  }
}
