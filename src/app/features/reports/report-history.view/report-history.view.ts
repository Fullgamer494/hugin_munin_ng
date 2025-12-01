import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIcon } from "@angular/material/icon";
import { ReportService } from '../../../api/infrastructure/services/report.service';
import { ReportResponse } from '../../../api/domain/models/report.model';
import { EspecimenService } from '../../../api/application/especimen.service';
import { EspecimenDetalleResponse } from '../../../api/domain/models/report.model';

@Component({
  selector: 'app-report-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIcon],
  templateUrl: './report-history.view.html',
  styleUrl: './report-history.view.css'
})
export class ReportHistoryView implements OnInit {
  reports = signal<ReportResponse[]>([]);
  filteredReports = signal<ReportResponse[]>([]);
  paginatedReports = signal<ReportResponse[]>([]);

  specimenId = signal<number | null>(null);
  specimenNumber = signal<string>('');
  specimenName = signal<string>('Ejemplar');

  searchQuery = signal<string>('');
  sortBy = signal<string>('asunto');
  itemsPerPage = signal<number>(10);
  currentPage = signal<number>(1);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  selectedReports = signal<Set<number>>(new Set());
  openMenuId = signal<number | null>(null);

  totalPages = computed(() =>
    Math.ceil(this.filteredReports().length / this.itemsPerPage())
  );

  paginationInfo = computed(() => {
    const total = this.filteredReports().length;
    const start = ((this.currentPage() - 1) * this.itemsPerPage()) + 1;
    const end = Math.min(this.currentPage() * this.itemsPerPage(), total);
    return `${start}-${end} de ${total} items`;
  });

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
    return [base, this.specimenId()];
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService,
    private location: Location,
    private especimenService: EspecimenService
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const origin = params.get('origin');
      if (origin) {
        this.origin.set(origin);
      }
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const id = +idParam;
        this.specimenId.set(id);
        this.loadSpecimenDetails(id);
        this.loadReports(id);
      } else {
        this.error.set('No se especificó un ID de espécimen válido en la ruta.');
      }
    });
  }

  private loadSpecimenDetails(id: number): void {
    this.especimenService.getSpecimenById(id).subscribe({
      next: (details: EspecimenDetalleResponse) => {
        this.specimenNumber.set(details.numInventario);
        this.specimenName.set(details.nombreEspecimen);
      },
      error: (err) => {
        console.error('Error al cargar detalles del espécimen', err);
        this.specimenNumber.set(`#${id}`);
      }
    });
  }

  private loadReports(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.reportService.getReportsBySpecimen(id).subscribe({
      next: (reports) => {
        this.reports.set(reports);
        this.filteredReports.set(reports);

        if (this.specimenNumber() === '') {
          this.specimenNumber.set(`#${id}`);
        }

        this.applyFilters();
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Error al cargar los reportes');
        this.loading.set(false);
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

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.currentPage.set(1);
    this.applyFilters();
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortBy.set(select.value);
    this.applyFilters();
  }

  onItemsPerPageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.itemsPerPage.set(+select.value);
    this.currentPage.set(1);
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.reports()];

    const query = this.searchQuery().toLowerCase();
    if (query) {
      filtered = filtered.filter(report =>
        report.asunto.toLowerCase().includes(query) ||
        this.getTipoReporteName(report.tipoReporteId).toLowerCase().includes(query) ||
        report.fechaReporte.includes(query)
      );
    }

    filtered = this.sortReports(filtered, this.sortBy());

    this.filteredReports.set(filtered);
    this.updatePagination();
  }

  private sortReports(reports: ReportResponse[], sortBy: string): ReportResponse[] {
    return reports.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (sortBy) {
        case 'asunto':
          valueA = a.asunto;
          valueB = b.asunto;
          break;
        case 'tipoReporte':
          valueA = this.getTipoReporteName(a.tipoReporteId);
          valueB = this.getTipoReporteName(b.tipoReporteId);
          break;
        case 'responsable':
          valueA = a.responsableId;
          valueB = b.responsableId;
          break;
        case 'fechaCreacion':
          valueA = new Date(a.fechaReporte);
          valueB = new Date(b.fechaReporte);
          break;
        default:
          valueA = a.asunto;
          valueB = b.asunto;
      }

      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    });
  }

  private updatePagination(): void {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    this.paginatedReports.set(this.filteredReports().slice(start, end));
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.updatePagination();
  }

  toggleSelectAll(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const selected = new Set<number>();

    if (checkbox.checked) {
      this.paginatedReports().forEach(report => {
        selected.add(report.id);
      });
    }

    this.selectedReports.set(selected);
  }

  toggleSelectReport(reportId: number): void {
    const selected = new Set(this.selectedReports());

    if (selected.has(reportId)) {
      selected.delete(reportId);
    } else {
      selected.add(reportId);
    }

    this.selectedReports.set(selected);
  }

  isSelected(reportId: number): boolean {
    return this.selectedReports().has(reportId);
  }

  isAllSelected(): boolean {
    const currentIds = this.paginatedReports().map(r => r.id);
    return currentIds.length > 0 && currentIds.every(id => this.selectedReports().has(id));
  }

  toggleMenu(reportId: number): void {
    this.openMenuId.set(this.openMenuId() === reportId ? null : reportId);
  }

  isMenuOpen(reportId: number): boolean {
    return this.openMenuId() === reportId;
  }

  deleteReport(reportId: number): void {
    const report = this.reports().find(r => r.id === reportId);
    if (!report) return;

    if (!confirm(`¿Estás seguro de que quieres eliminar el reporte "${report.asunto}"?`)) {
      return;
    }

    this.reportService.deleteReport(reportId).subscribe({
      next: () => {
        const updated = this.reports().filter(r => r.id !== reportId);
        this.reports.set(updated);
        this.applyFilters();
        this.openMenuId.set(null);
      },
      error: (err) => {
        console.error(err);
        alert('Error al eliminar el reporte');
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, 5);
      } else if (current >= total - 2) {
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(current - 2, current - 1, current, current + 1, current + 2);
      }
    }

    return pages;
  }
}