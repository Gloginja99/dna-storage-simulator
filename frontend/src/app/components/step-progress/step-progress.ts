import { Component, input, computed } from '@angular/core';
import { SimulationStep } from '../../models/simulation.models';

interface Step {
  key: SimulationStep;
  label: string;
}

const STEPS: Step[] = [
  { key: 'input', label: 'Input' },
  { key: 'encoded', label: 'Encoded' },
  { key: 'errors', label: 'Errors' },
  { key: 'recovered', label: 'Recovered' },
];

@Component({
  selector: 'app-step-progress',
  imports: [],
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
