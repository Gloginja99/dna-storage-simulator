import { Component, input, output } from '@angular/core';
import { SimulationConfig } from '../../models/simulation.models';

type ErrorTypeKey =
  'enableSubstitution' | 'enableInsertion' | 'enableDeletion' | 'enableBurst' | 'enableDropout';

@Component({
  selector: 'app-error-controls',
  imports: [],
  templateUrl: './error-controls.html',
  styleUrl: './error-controls.scss',
})
export class ErrorControls {
  config = input.required<SimulationConfig>();
  configChange = output<SimulationConfig>();

  errorTypes: { key: ErrorTypeKey; label: string; errorType: string; desc: string }[] = [
    {
      key: 'enableSubstitution',
      label: 'Substitution',
      errorType: 'substitution',
      desc: 'Replace one base with another',
    },
    {
      key: 'enableInsertion',
      label: 'Insertion',
      errorType: 'insertion',
      desc: 'Insert an extra base',
    },
    {
      key: 'enableDeletion',
      label: 'Deletion',
      errorType: 'deletion',
      desc: 'Remove a base from sequence',
    },
    { key: 'enableBurst', label: 'Burst', errorType: 'burst', desc: 'Multiple consecutive errors' },
    { key: 'enableDropout', label: 'Dropout', errorType: 'dropout', desc: 'Entire sequence lost' },
  ];

  update(field: keyof SimulationConfig, value: unknown) {
    this.configChange.emit({ ...this.config(), [field]: value });
  }
}
