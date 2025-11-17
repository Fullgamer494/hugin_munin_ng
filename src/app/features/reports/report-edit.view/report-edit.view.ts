import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
import { GetReportByIdUseCase, UpdateReportUseCase } from '../../../core/domain/ports/inbound/report/report.use-case';
import { SearchSpecimensUseCase } from '../../../core/domain/ports/inbound/report/specimen.use-case';
import { ReportEntity } from '../../../core/domain/entities/report/report.entity';
import { Specimen } from '../../../core/domain/entities/report/report.entity';
import { AuthService } from '../../../core/infrastructure/adapters/auth/auth.service';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-report-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TitleCasePipe, MatIcon],
  templateUrl: './report-edit.view.html',
  styleUrl: './report-edit.view.css'
})
export class ReportEditView implements OnInit  {
  reportId = signal<number | null>(null);
  reportType = signal<number>(1);
  reportTypeName = signal<string>('clínico');
  
  searchQuery = signal<string>('');
  searchResults = signal<Specimen[]>([]);
  showResults = signal<boolean>(false);
  selectedSpecimen = signal<Specimen | null>(null);
  
  asunto = signal<string>('');
  contenido = signal<string>('');
  
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  private searchSubject = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private getReportByIdUseCase: GetReportByIdUseCase,
    private updateReportUseCase: UpdateReportUseCase,
    private searchSpecimensUseCase: SearchSpecimensUseCase,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.reportId.set(+id);
        this.loadReport();
      } else {
        this.error.set('No se especificó un ID de reporte válido');
      }
    });

    this.setupSearchDebounce();
  }

  private loadReport(): void {
    const id = this.reportId();
    if (!id) return;

    this.loading.set(true);
    this.error.set(null);

    this.getReportByIdUseCase.execute(id).subscribe({
      next: (report) => {
        if (report) {
          this.populateForm(report);
        } else {
          this.error.set('Reporte no encontrado');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Error al cargar el reporte');
        this.loading.set(false);
      }
    });
  }

  private populateForm(report: ReportEntity): void {
    this.reportType.set(report.id_tipo_reporte);
    this.setReportTypeName();
    
    this.asunto.set(report.asunto);
    this.contenido.set(report.contenido);
    
    if (report.especimen) {
      this.selectedSpecimen.set(report.especimen);
      this.searchQuery.set(this.getSpecimenDisplayText());
    }
  }

  private setReportTypeName(): void {
    const names: Record<number, string> = {
      1: 'clínico',
      2: 'conductual',
      3: 'alimenticio',
      4: 'defunción',
      5: 'traslado'
    };
    this.reportTypeName.set(names[this.reportType()]);
  }

  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(query => {
      if (query.length >= 2) {
        this.searchSpecimens(query);
      }
    });
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value.trim();
    this.searchQuery.set(query);

    if (query.length === 0) {
      this.showResults.set(false);
      this.searchResults.set([]);
      return;
    }

    if (this.selectedSpecimen() && query !== this.getSpecimenDisplayText()) {
      this.selectedSpecimen.set(null);
    }

    this.searchSubject.next(query);
  }

  private searchSpecimens(query: string): void {
    this.searchSpecimensUseCase.execute(query).subscribe({
      next: (specimens) => {
        this.searchResults.set(specimens);
        this.showResults.set(true);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Error al buscar especímenes');
      }
    });
  }

  selectSpecimen(specimen: Specimen): void {
    this.selectedSpecimen.set(specimen);
    this.searchQuery.set(this.getSpecimenDisplayText());
    this.showResults.set(false);
  }

  private getSpecimenDisplayText(): string {
    const specimen = this.selectedSpecimen();
    if (!specimen) return '';
    return `${specimen.num_inventario} - ${specimen.nombre_especimen || 'Sin nombre'}`;
  }

  onSubmit(): void {
    this.error.set(null);
    this.success.set(null);

    const id = this.reportId();
    if (!id) {
      this.error.set('ID de reporte no válido');
      return;
    }

    if (!this.selectedSpecimen()) {
      this.error.set('Debe seleccionar un espécimen');
      return;
    }

    if (!this.asunto().trim()) {
      this.error.set('El asunto es requerido');
      return;
    }

    if (!this.contenido().trim()) {
      this.error.set('El contenido es requerido');
      return;
    }

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.error.set('Usuario no autenticado');
      return;
    }

    this.loading.set(true);

    const reportData = {
      id_tipo_reporte: this.reportType(),
      id_especimen: this.selectedSpecimen()!.id_especimen,
      id_responsable: userId,
      asunto: this.asunto(),
      contenido: this.contenido(),
      fecha_reporte: new Date().toISOString().split('T')[0]
    };

    this.updateReportUseCase.execute(id, reportData).subscribe({
      next: () => {
        this.success.set('Reporte actualizado exitosamente');
        this.loading.set(false);
        setTimeout(() => {
          this.router.navigate(['/detail', id]);
        }, 2000);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Error al actualizar el reporte');
        this.loading.set(false);
      }
    });
  }

  onCancel(): void {
    const id = this.reportId();
    if (id) {
      this.router.navigate(['/detail', id]);
    } else {
      this.router.navigate(['/']);
    }
  }

  hideResults(): void {
    setTimeout(() => this.showResults.set(false), 200);
  }
}