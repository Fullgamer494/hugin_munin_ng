import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
import { MatIcon } from "@angular/material/icon";

import { ReportService } from '../../../api/infrastructure/services/report.service';
import { LoginService } from '../../../api/application/login.service';
import { EspecimenDetalleResponse } from '../../../api/domain/models/report.model';

@Component({
  selector: 'app-report-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TitleCasePipe, MatIcon],
  templateUrl: './report-form.view.html',
  styleUrl: './report-form.view.css'
})
export class ReportFormView implements OnInit {
  reportType = signal<number>(1);
  reportTypeName = signal<string>('clínico');
  
  searchQuery = signal<string>('');
  searchResults = signal<EspecimenDetalleResponse[]>([]);
  showResults = signal<boolean>(false);
  selectedSpecimen = signal<EspecimenDetalleResponse | null>(null);
  
  asunto = signal<string>('');
  contenido = signal<string>('');
  
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  private searchSubject = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.reportType.set(data['reportType'] || 1);
      this.setReportTypeName();
    });

    this.setupSearchDebounce();
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
      this.selectedSpecimen.set(null);
      return;
    }

    if (this.selectedSpecimen() && query !== this.getSpecimenDisplayText()) {
      this.selectedSpecimen.set(null);
    }

    this.searchSubject.next(query);
  }

  private searchSpecimens(query: string): void {
    this.reportService.searchSpecimens(query).subscribe({
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

  selectSpecimen(specimen: EspecimenDetalleResponse): void {
    this.selectedSpecimen.set(specimen);
    this.searchQuery.set(this.getSpecimenDisplayText());
    this.showResults.set(false);
  }

  private getSpecimenDisplayText(): string {
    const specimen = this.selectedSpecimen();
    if (!specimen) return '';
    return `${specimen.numInventario} - ${specimen.nombreEspecimen || 'Sin nombre'}`;
  }

  onSubmit(): void {
    this.error.set(null);
    this.success.set(null);

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

    const userId = this.loginService.getCurrentUserId();
    if (!userId) {
      this.error.set('Usuario no autenticado');
      return;
    }

    this.loading.set(true);

    const reportData = {
      tipoReporteId: this.reportType(),
      especimenId: this.selectedSpecimen()!.id,
      responsableId: userId,
      asunto: this.asunto(),
      contenido: this.contenido(),
      fechaReporte: new Date().toISOString().split('T')[0]
    };

    this.reportService.createReport(reportData).subscribe({
      next: () => {
        this.success.set('Reporte creado exitosamente');
        this.loading.set(false);
        setTimeout(() => this.clearForm(), 2000);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Error al crear el reporte');
        this.loading.set(false);
      }
    });
  }

  clearForm(): void {
    this.asunto.set('');
    this.contenido.set('');
    this.searchQuery.set('');
    this.selectedSpecimen.set(null);
    this.searchResults.set([]);
    this.error.set(null);
    this.success.set(null);
  }

  onCancel(): void {
    this.router.navigate(['/app/dashboard']);
  }

  hideResults(): void {
    setTimeout(() => this.showResults.set(false), 200);
  }
}