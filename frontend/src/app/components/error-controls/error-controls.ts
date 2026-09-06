import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { SimulationConfig } from '../../models/simulation.models';

type ErrorTypeKey =
  'enableSubstitution' | 'enableInsertion' | 'enableDeletion' | 'enableBurst' | 'enableDropout';

@Component({
  selector: 'app-error-controls',
  imports: [TranslatePipe],
  templateUrl: './error-controls.html',
  styleUrl: './error-controls.scss',
})
export class ErrorControls {
  config = input.required<SimulationConfig>();
  configChange = output<SimulationConfig>();

  errorTypes: { key: ErrorTypeKey; labelKey: string; errorType: string; descKey: string }[] = [
    {
      key: 'enableSubstitution',
      labelKey: 'errorControls.substitution.label',
      errorType: 'substitution',
      descKey: 'errorControls.substitution.desc',
    },
    {
      key: 'enableInsertion',
      labelKey: 'errorControls.insertion.label',
      errorType: 'insertion',
      descKey: 'errorControls.insertion.desc',
    },
    {
      key: 'enableDeletion',
      labelKey: 'errorControls.deletion.label',
      errorType: 'deletion',
      descKey: 'errorControls.deletion.desc',
    },
    {
      key: 'enableBurst',
      labelKey: 'errorControls.burst.label',
      errorType: 'burst',
      descKey: 'errorControls.burst.desc',
    },
    {
      key: 'enableDropout',
      labelKey: 'errorControls.dropout.label',
      errorType: 'dropout',
      descKey: 'errorControls.dropout.desc',
    },
  ];

  update(field: keyof SimulationConfig, value: unknown) {
    this.configChange.emit({ ...this.config(), [field]: value });
  }
}
