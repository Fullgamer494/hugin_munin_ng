import { Component, OnInit, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { EspecimenService } from '../../../api/application/especimen.service';
import { EspecimenDetalleResponse } from '../../../api/domain/models/especimen-alta.model';

// Interfaz local para los datos combinados de la tabla
interface AnimalBajaTabla extends EspecimenDetalleResponse {
  fechaBaja: string | null;
  causaBajaId: number | null;
}

// Interfaz para la respuesta del endpoint de bajas
interface RegistroBajaResponse {
  id: number;
  especimenId: number;
  causaBajaId: number;
  responsableId: number;
  fechaBaja: string;
  observacion: string | null;
}

@Component({
  selector: 'app-removals-table',
  standalone: true,
  imports: [MatIcon, RouterLink, CommonModule],
  templateUrl: './removals-table.view.html',
  styleUrl: './removals-table.view.css',
})
export class RemovalsTableView implements OnInit {
  // Inyecciones
  private http = inject(HttpClient);
  private especimenService = inject(EspecimenService);
  private apiUrl = environment.apiUrl;

  // Estado
  animalesDeBaja: AnimalBajaTabla[] = [];
  animalesFiltrados: AnimalBajaTabla[] = [];
  isLoading: boolean = true;
  error: string = '';
  menuAbiertoId: number | null = null;

  // Paginación
  currentPage: number = 0;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  // Filtros
  searchTerm: string = '';
  sortBy: string = 'fechaBaja';

  ngOnInit(): void {
    this.loadData();
  }

loadData(): void {
    this.isLoading = true;

    forkJoin({
      todosLosAnimales: this.especimenService.getAllSpecimens(),
      registrosBaja: this.http.get<RegistroBajaResponse[]>(`${this.apiUrl}/hm/registro-baja`)
    }).pipe(
      map(results => {
        // Filtramos solo los animales inactivos (bajas)
        const inactivos = results.todosLosAnimales.filter(a => !a.activo);

        // Cruzamos la información
        return inactivos.map(animal => {
          const bajaInfo = results.registrosBaja.find(b => b.especimenId === animal.id);
          
          return {
            ...animal,
            fechaBaja: bajaInfo ? bajaInfo.fechaBaja : null,
            causaBajaId: bajaInfo ? bajaInfo.causaBajaId : null
          } as AnimalBajaTabla;
        });
      })
    ).subscribe({
      next: (dataCombinada) => {
        console.log('Datos de bajas cargados:', dataCombinada); // Log para verificar
        this.animalesDeBaja = dataCombinada;
        this.filterAnimals(); 
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando datos de bajas:', err);
        this.error = 'No se pudo cargar la lista de bajas.';
        this.isLoading = false;
      }
    });
  }

  toggleMenu(id: number): void {
    this.menuAbiertoId = this.menuAbiertoId === id ? null : id;
  }

  // --- Lógica de Filtrado y Ordenamiento ---

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.filterAnimals();
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortBy = select.value;
    this.sortAnimals();
  }

  filterAnimals(): void {
    if (!this.searchTerm) {
      this.animalesFiltrados = [...this.animalesDeBaja];
    } else {
      this.animalesFiltrados = this.animalesDeBaja.filter(animal =>
        animal.numInventario.toLowerCase().includes(this.searchTerm) ||
        animal.especieNombre.toLowerCase().includes(this.searchTerm) ||
        animal.genero.toLowerCase().includes(this.searchTerm)
      );
    }
    this.sortAnimals();
    this.calculateTotalPages();
    this.currentPage = 0;
  }

  sortAnimals(): void {
    this.animalesFiltrados.sort((a, b) => {
      switch (this.sortBy) {
        case 'identificador':
          return a.numInventario.localeCompare(b.numInventario);
        case 'genero':
          return a.genero.localeCompare(b.genero);
        case 'especie':
          return a.especieNombre.localeCompare(b.especieNombre);
        case 'fechaBaja':
          // Orden descendente por defecto para fechas (más reciente primero)
          const dateA = a.fechaBaja ? new Date(a.fechaBaja).getTime() : 0;
          const dateB = b.fechaBaja ? new Date(b.fechaBaja).getTime() : 0;
          return dateB - dateA;
        default:
          return 0;
      }
    });
  }

  // --- Lógica de Paginación ---

  onItemsPerPageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(select.value);
    this.currentPage = 0;
    this.calculateTotalPages();
  }

  calculateTotalPages(): void {
    this.totalItems = this.animalesFiltrados.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage) || 1;
  }

  getPaginatedAnimals(): AnimalBajaTabla[] {
    const start = this.currentPage * this.itemsPerPage;
    return this.animalesFiltrados.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  previousPage(): void {
    if (this.currentPage > 0) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) this.currentPage++;
  }

  getPaginationInfo(): string {
    if (this.totalItems === 0) return '0 - 0 de 0';
    const start = (this.currentPage * this.itemsPerPage) + 1;
    const end = Math.min((this.currentPage + 1) * this.itemsPerPage, this.totalItems);
    return `${start} - ${end} de ${this.totalItems}`;
  }

  getVisiblePages(): number[] {
    // Lógica simplificada para mostrar páginas
    const pages = [];
    const maxPages = 5;
    let startPage = Math.max(0, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, startPage + maxPages);
    
    if (endPage - startPage < maxPages) {
      startPage = Math.max(0, endPage - maxPages);
    }

    for (let i = startPage; i < endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
}