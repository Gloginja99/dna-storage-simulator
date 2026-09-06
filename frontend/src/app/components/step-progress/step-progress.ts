import { Component, input, computed } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { SimulationStep } from '../../models/simulation.models';

interface Step {
  key: SimulationStep;
  labelKey: string;
}

const STEPS: Step[] = [
  { key: 'input', labelKey: 'steps.input' },
  { key: 'encoded', labelKey: 'steps.encoded' },
  { key: 'errors', labelKey: 'steps.errors' },
  { key: 'recovered', labelKey: 'steps.recovered' },
];

@Component({
  selector: 'app-step-progress',
  imports: [TranslatePipe],
  templateUrl: './step-progress.html',
  styleUrl: './step-progress.scss',
})
export class StepProgress {
  currentStep = input<SimulationStep>('input');
  steps = STEPS;
  currentIndex = computed(() => STEPS.findIndex((s) => s.key === this.currentStep()));

  isCompleted(step: Step): boolean {
    return STEPS.findIndex((s) => s.key === step.key) < this.currentIndex();
  }

  isActive(step: Step): boolean {
    return step.key === this.currentStep();
  }
}
