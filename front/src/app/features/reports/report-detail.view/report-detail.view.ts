import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIcon } from "@angular/material/icon";
import { ReportService } from '../../../api/infrastructure/services/report.service';
import { EspecimenDetalleResponse, ReportResponse } from '../../../api/domain/models/report.model';
import { EspecimenService } from '../../../api/application/especimen.service';

@Component({
  selector: 'app-report-detail-view',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIcon],
  templateUrl: './report-detail.view.html',
  styleUrl: './report-detail.view.css'
})
export class ReportDetailView implements OnInit {
  report = signal<ReportResponse | null>(null);
  specimenInventory = signal<string | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  reportId: number | null = null;

  // --- Navigation Logic ---
  origin = signal<string>('animals');

  rootLink = computed(() => {
    return this.origin() === 'removals' ? '/app/animals/removals' : '/app/animals';
  });

  rootText = computed(() => {
    return this.origin() === 'removals' ? 'Bajas' : 'Animales';
  });

  specimenLink = computed(() => {
    const base = this.origin() === 'removals' ? '/app/removals/details' : '/app/animals/more_info';
    return this.report() ? [base, this.report()!.especimenId] : [];
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private especimenService: EspecimenService,
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const origin = params.get('origin');
      if (origin) {
        this.origin.set(origin);
      }
    });

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
          this.loadSpecimenInventory(report.especimenId);
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

  private loadSpecimenInventory(especimenId: number): void {
    this.especimenService.getSpecimenById(especimenId).subscribe({
      next: (details: EspecimenDetalleResponse) => {
        this.specimenInventory.set(details.numInventario);
      },
      error: (err) => {
        console.error('Error al cargar el inventario del espécimen', err);
        this.specimenInventory.set(`#ID:${especimenId} (Error Carga)`);
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
}