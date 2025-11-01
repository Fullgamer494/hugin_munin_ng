import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GetReportByIdUseCase } from '../../../../core/domain/ports/inbound/report/report.use-case';
import { Report, ReportEntity } from '../../../../core/domain/entities/report/report.entity';

@Component({
  selector: 'app-report-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './report-detail.component.html',
  styleUrl: './report-detail.component.css'
})
export class ReportDetailComponent implements OnInit {
  report = signal<ReportEntity | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  
  reportId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private getReportByIdUseCase: GetReportByIdUseCase
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.reportId = params['id'] ? +params['id'] : null;
      if (this.reportId) {
        this.loadReport();
      } else {
        this.error.set('No se especificó un ID de reporte válido');
      }
    });
  }

  private loadReport(): void {
    if (!this.reportId) return;
    
    this.loading.set(true);
    this.error.set(null);

    this.getReportByIdUseCase.execute(this.reportId).subscribe({
      next: (report) => {
        if (report) {
          const reportEntity = new ReportEntity(
            report.id_reporte,
            report.id_tipo_reporte,
            report.id_especimen,
            report.id_responsable,
            report.asunto,
            report.contenido,
            report.fecha_reporte,
            report.tipo_reporte,
            report.especimen,
            report.responsable
          );
          this.report.set(reportEntity);
        } else {
          this.error.set('Reporte no encontrado');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar el reporte');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  downloadPDF(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/reports/history'], { 
      queryParams: { id: this.report()?.id_especimen } 
    });
  }
}