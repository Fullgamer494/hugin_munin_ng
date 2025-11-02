import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GetReportsBySpecimenUseCase, DeleteReportUseCase } from '../../../../core/domain/ports/inbound/report/report.use-case';
import { ReportEntity } from '../../../../core/domain/entities/report/report.entity';
import { AuthService } from '../../../../infrastructure/adapters/auth/auth.service';

@Component({
  selector: 'app-report-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './report-history.component.html',
  styleUrl: './report-history.component.css'
})
export class ReportHistoryComponent implements OnInit {
  reports = signal<ReportEntity[]>([]);
  filteredReports = signal<ReportEntity[]>([]);
  paginatedReports = signal<ReportEntity[]>([]);
  
  specimenId = signal<number | null>(null);
  specimenNumber = signal<string>('');
  
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private getReportsBySpecimenUseCase: GetReportsBySpecimenUseCase,
    private deleteReportUseCase: DeleteReportUseCase,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.specimenId.set(+id);
        this.loadReports();
      } else {
        this.error.set('No se especificó un ID de espécimen válido');
      }
    });
  }

  private loadReports(): void {
    const id = this.specimenId();
    if (!id) return;

    this.loading.set(true);
    this.error.set(null);

    this.getReportsBySpecimenUseCase.execute(id).subscribe({
      next: (reports) => {
        this.reports.set(reports);
        this.filteredReports.set(reports);
        
        if (reports.length > 0) {
          this.specimenNumber.set(reports[0].getSpecimenIdentifier());
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
        report.getTipoReporteName().toLowerCase().includes(query) ||
        report.getResponsableName().toLowerCase().includes(query) ||
        report.getFormattedDate().includes(query)
      );
    }

    filtered = this.sortReports(filtered, this.sortBy());

    this.filteredReports.set(filtered);
    this.updatePagination();
  }

  private sortReports(reports: ReportEntity[], sortBy: string): ReportEntity[] {
    return reports.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch(sortBy) {
        case 'asunto':
          valueA = a.asunto;
          valueB = b.asunto;
          break;
        case 'tipoReporte':
          valueA = a.getTipoReporteName();
          valueB = b.getTipoReporteName();
          break;
        case 'responsable':
          valueA = a.getResponsableName();
          valueB = b.getResponsableName();
          break;
        case 'fechaCreacion':
          valueA = new Date(a.fecha_reporte);
          valueB = new Date(b.fecha_reporte);
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
        selected.add(report.id_reporte);
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
    const currentIds = this.paginatedReports().map(r => r.id_reporte);
    return currentIds.length > 0 && currentIds.every(id => this.selectedReports().has(id));
  }

  toggleMenu(reportId: number): void {
    this.openMenuId.set(this.openMenuId() === reportId ? null : reportId);
  }

  isMenuOpen(reportId: number): boolean {
    return this.openMenuId() === reportId;
  }

  deleteReport(reportId: number): void {
    const report = this.reports().find(r => r.id_reporte === reportId);
    if (!report) return;

    if (!confirm(`¿Estás seguro de que quieres eliminar el reporte "${report.asunto}"?`)) {
      return;
    }

    this.deleteReportUseCase.execute(reportId).subscribe({
      next: () => {
        const updated = this.reports().filter(r => r.id_reporte !== reportId);
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

  deleteSelectedReports(): void {
    const selected = Array.from(this.selectedReports());
    
    if (selected.length === 0) {
      alert('Por favor selecciona al menos un reporte');
      return;
    }

    if (!confirm(`¿Estás seguro de que quieres eliminar ${selected.length} reporte(s)?`)) {
      return;
    }

    selected.forEach(reportId => {
      this.deleteReportUseCase.execute(reportId).subscribe({
        next: () => {
          const updated = this.reports().filter(r => r.id_reporte !== reportId);
          this.reports.set(updated);
          this.applyFilters();
        },
        error: (err) => {
          console.error(err);
        }
      });
    });

    this.selectedReports.set(new Set());
  }

  hasPermission(permission: string): boolean {
    return true;
  }

  goBack(): void {
    this.router.navigate(['/']);
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