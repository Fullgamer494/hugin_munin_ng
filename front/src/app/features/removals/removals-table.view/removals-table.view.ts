import { Component, OnInit, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, combineLatest, map, startWith } from 'rxjs';
import { EspecimenService } from '../../../api/application/especimen.service';
import { RegistroBajaDetalleResponse } from '../../../api/domain/models/especimen-baja.model';

@Component({
  selector: 'app-removals-table',
  standalone: true,
  imports: [MatIcon, RouterLink, CommonModule],
  templateUrl: './removals-table.view.html',
  styleUrl: './removals-table.view.css',
})
export class RemovalsTableView implements OnInit {

  // Inyección de dependencias
  private especimenService = inject(EspecimenService);
  private router = inject(Router);

  // --- Streams de control (BehaviorSubject) ---
  searchSubject = new BehaviorSubject<string>('');
  sortSubject = new BehaviorSubject<{ field: string, direction: string }>({ field: 'identificador', direction: 'asc' });
  pageIndexSubject = new BehaviorSubject<number>(0);
  pageSizeSubject = new BehaviorSubject<number>(10);

  // --- Propiedades de la Vista ---
  animalesFiltrados$!: Observable<RegistroBajaDetalleResponse[]>;

  // Variables síncronas para la paginación y estado
  currentPage: number = 0;
  totalPages: number = 0;
  totalItems: number = 0;
  isLoading: boolean = false;
  error: string = '';
  menuAbiertoId: number | null = null;

  ngOnInit(): void {
    this.isLoading = true;
    this.error = '';

    const allRemovals$ = this.especimenService.getAllRegistrosBaja().pipe(
      startWith([] as RegistroBajaDetalleResponse[])
    );

    this.animalesFiltrados$ = combineLatest([
      allRemovals$,
      this.searchSubject,
      this.sortSubject,
      this.pageIndexSubject,
      this.pageSizeSubject
    ]).pipe(
      map(([animales, searchTerm, sort, pageIndex, pageSize]) => {

        if (this.isLoading && animales.length > 0) {
          this.isLoading = false;
        }

        const filtered = this.applyFilter(animales, searchTerm);
        const sorted = this.applySort(filtered, sort.field, sort.direction);

        this.totalItems = sorted.length;
        this.totalPages = Math.ceil(this.totalItems / pageSize);
        this.currentPage = pageIndex;

        const start = pageIndex * pageSize;
        const end = start + pageSize;

        // Retorna la porción de datos de la página actual
        return sorted.slice(start, end);
      })
    );

    // Manejo de errores y finalización de carga
    this.animalesFiltrados$.subscribe({
      next: (data) => console.log('View Data (Filtered/Sorted):', data),
      error: (err) => {
        console.error('Error al cargar animales dados de baja:', err);
        this.error = 'Error al cargar los animales dados de baja.';
        this.isLoading = false;
      },
      complete: () => this.isLoading = false
    });
  }

  toggleMenu(animalId: number): void {
    console.log('Toggle Menu Clicked. ID:', animalId);
    this.menuAbiertoId = (this.menuAbiertoId === animalId) ? null : animalId;
  }

  // Método requerido por el input de búsqueda
  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchTerm.toLowerCase());
    this.pageIndexSubject.next(0); // Reiniciar paginación
  }

  // Método requerido por el select de ordenación
  onSortChange(event: Event): void {
    const field = (event.target as HTMLSelectElement).value;
    this.sortSubject.next({ field, direction: 'asc' });
    this.pageIndexSubject.next(0); // Reiniciar paginación
  }

  // Método requerido por el select de elementos por página
  onItemsPerPageChange(event: Event): void {
    const pageSize = parseInt((event.target as HTMLSelectElement).value, 10);
    this.pageSizeSubject.next(pageSize);
    this.pageIndexSubject.next(0);
  }

  // Navegación de paginación
  previousPage(): void {
    if (this.currentPage > 0) {
      this.pageIndexSubject.next(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.pageIndexSubject.next(this.currentPage + 1);
    }
  }

  goToPage(index: number): void {
    this.pageIndexSubject.next(index);
  }

  getPaginationInfo(): string {
    if (this.totalItems === 0) return '0 - 0 de 0 items';
    const start = (this.currentPage * this.pageSizeSubject.getValue()) + 1;
    let end = (this.currentPage + 1) * this.pageSizeSubject.getValue();
    end = Math.min(end, this.totalItems);
    return `${start} - ${end} de ${this.totalItems} items`;
  }

  private applyFilter(animales: RegistroBajaDetalleResponse[], term: string): RegistroBajaDetalleResponse[] {
    if (!term) return animales;

    return animales.filter(animal => {
      const searchBase = [
        animal.numInventario,
        animal.genero,
        animal.especieNombre,
        animal.causaBajaNombre,
        animal.nombreComun,
        animal.nombreEspecimen
      ].join(' ').toLowerCase();

      return searchBase.includes(term);
    });
  }

  private applySort(animales: RegistroBajaDetalleResponse[], field: string, direction: string): RegistroBajaDetalleResponse[] {
    const sortedAnimals = [...animales];

    if (!field) return sortedAnimals;

    sortedAnimals.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (field) {
        case 'identificador':
          aValue = a.numInventario;
          bValue = b.numInventario;
          break;
        case 'genero':
          aValue = a.genero;
          bValue = b.genero;
          break;
        case 'especie':
          aValue = a.especieNombre;
          bValue = b.especieNombre;
          break;
        case 'fechaBaja':
          aValue = new Date(a.fechaBaja).getTime();
          bValue = new Date(b.fechaBaja).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sortedAnimals;
  }

  // Acciones
  viewDetails(specimenId: number): void {
    this.router.navigate(['/app/removals/details', specimenId]);
  }

  viewReport(specimenId: number): void {
    this.router.navigate(['/app/reports/history', specimenId], { queryParams: { origin: 'removals' } });
  }

  editDeregistration(specimenId: number): void {
    this.router.navigate(['/app/animals/deregister/edit', specimenId]);
  }
}
