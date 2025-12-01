import { Component, inject, OnInit, signal } from '@angular/core';
import { StatisticsPort } from '../../../api/domain/ports/statistics.port';
import { StatisticsResponse } from '../../../api/domain/models/statistics.model';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard.view',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './dashboard.view.html',
  styleUrl: './dashboard.view.css',
})
export class DashboardView implements OnInit {
  private statisticsPort = inject(StatisticsPort);

  statistics = signal<StatisticsResponse | null>(null);

  ngOnInit(): void {
    this.statisticsPort.getStatistics().subscribe({
      next: (data) => this.statistics.set(data),
      error: (error) => console.error('Error fetching statistics:', error)
    });
  }
}
