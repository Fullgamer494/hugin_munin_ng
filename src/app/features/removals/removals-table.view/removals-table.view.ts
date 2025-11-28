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

// Interfaz combinada para la tabla
interface AnimalBajaTabla extends EspecimenDetalleResponse {
  fechaBaja: string | null;
  causaBajaId: number | null;
}

// Interfaz de respuesta del Backend
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
  private http = inject(HttpClient);
  private especimenService = inject(EspecimenService);
  private apiUrl = environment.apiUrl;

  animalesDeBaja: AnimalBajaTabla[] = [];
  animalesFiltrados: AnimalBajaTabla[] = [];
  isLoading: boolean = true;
  error: string = '';
  
  // Paginación
  currentPage: number = 0;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  searchTerm: string = '';
  menuAbiertoId: number | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    // PETICIÓN PARALELA (JOIN): Traemos Especímenes y Registros de Baja
    forkJoin({
      todosLosAnimales: this.especimenService.getAllSpecimens(),
      registrosBaja: this.http.get<RegistroBajaResponse[]>(`${this.apiUrl}/hm/registro-baja`) // URL CORRECTA
    }).pipe(
      map(results => {
        // 1. Nos quedamos solo con los inactivos
        const inactivos = results.todosLosAnimales.filter(a => !a.activo);

        // 2. Combinamos con la fecha de baja
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
      next: (data) => {
        console.log('✅ Bajas cargadas:', data);
        this.animalesDeBaja = data;
        this.filterAnimals();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error cargando bajas:', err);
        this.error = 'Error al conectar con el servidor.';
        this.isLoading = false;
      }
    });
  }

  // --- Filtros y Lógica Visual ---

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.filterAnimals();
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
    this.calculateTotalPages();
    this.currentPage = 0;
  }

  toggleMenu(id: number): void {
    this.menuAbiertoId = this.menuAbiertoId === id ? null : id;
  }

  // --- Paginación ---

  onItemsPerPageChange(event: Event): void {
    this.itemsPerPage = Number((event.target as HTMLSelectElement).value);
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

  previousPage(): void { if (this.currentPage > 0) this.currentPage--; }
  nextPage(): void { if (this.currentPage < this.totalPages - 1) this.currentPage++; }
  goToPage(page: number): void { this.currentPage = page; }

  getPaginationInfo(): string {
    if (this.totalItems === 0) return '0 - 0 de 0';
    const start = (this.currentPage * this.itemsPerPage) + 1;
    const end = Math.min((this.currentPage + 1) * this.itemsPerPage, this.totalItems);
    return `${start} - ${end} de ${this.totalItems}`;
  }

  getVisiblePages(): number[] {
    // Retorna array simple para iterar páginas (ej: [0, 1, 2])
    return Array.from({length: this.totalPages}, (_, i) => i);
  }
}