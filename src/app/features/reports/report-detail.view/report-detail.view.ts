import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GetReportByIdUseCase } from '../../../core/domain/ports/inbound/report/report.use-case';
import { ReportEntity } from '../../../core/domain/entities/report/report.entity';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-report-detail-view',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIcon],
  templateUrl: './report-detail.view.html',
  styleUrl: './report-detail.view.css'
})
export class ReportDetailView implements OnInit {
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
        this.error.set('No valid report ID specified');
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
          this.report.set(report);
        } else {
          this.error.set('Report not found');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error loading report');
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