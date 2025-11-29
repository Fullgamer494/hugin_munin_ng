import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIcon } from "@angular/material/icon";
import { ReportService } from '../../../api/infrastructure/services/report.service';
import { ReportResponse } from '../../../api/domain/models/report.model';

@Component({
  selector: 'app-report-detail-view',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIcon],
  templateUrl: './report-detail.view.html',
  styleUrl: './report-detail.view.css'
})
export class ReportDetailView implements OnInit {
  report = signal<ReportResponse | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  
  reportId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.reportId = params['id'] ? +params['id'] : null;
      if (this.reportId) {
        this.loadReport();
      } else {
        this.error.set('No es valido el id');
      }
    });
  }

  private loadReport(): void {
    if (!this.reportId) return;
    
    this.loading.set(true);
    this.error.set(null);

    this.reportService.getReportById(this.reportId).subscribe({
      next: (report) => {
        if (report) {
          this.report.set(report);
        } else {
          this.error.set('Reporte no encontrado');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  getTipoReporteName(tipoId: number): string {
    const names: Record<number, string> = {
      1: 'Clínico',
      2: 'Conductual',
      3: 'Alimenticio',
      4: 'Defunción',
      5: 'Traslado'
    };
    return names[tipoId] || 'Desconocido';
  }

  downloadPDF(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/app/reports/history'], { 
      queryParams: { id: this.report()?.especimenId } 
    });
  }
}