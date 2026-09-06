import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { HistoryService } from '../../services/history.service';
import { SavedSimulationSummary } from '../../models/history.models';

@Component({
  selector: 'app-history',
  imports: [RouterLink, TranslatePipe, DatePipe],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class History implements OnInit {
  private readonly historyService = inject(HistoryService);
  private readonly router = inject(Router);

  simulations = signal<SavedSimulationSummary[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.historyService.list().subscribe({
      next: (res) => {
        this.simulations.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  open(id: string): void {
    this.router.navigate(['/simulator'], { queryParams: { load: id } });
  }

  remove(id: string): void {
    this.historyService.remove(id).subscribe(() => {
      this.simulations.set(this.simulations().filter((s) => s.id !== id));
    });
  }
}
