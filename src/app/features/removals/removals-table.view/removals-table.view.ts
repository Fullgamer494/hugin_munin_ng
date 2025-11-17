import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface DeregistrationRecord {
  id: number;
  specimenId: number;
  specimenName: string;
  inventoryNumber: string;
  genus: string;
  species: string;
  commonName: string | null;
  causeName: string;
  registeredByName: string;
  deregistrationDate: string;
  destination: string | null;
  observations: string | null;
}

@Component({
  selector: 'app-removals-table',
  standalone: true,
  imports: [MatIcon, RouterLink, CommonModule],
  templateUrl: './removals-table.view.html',
  styleUrl: './removals-table.view.css',
})
export class RemovalsTableView implements OnInit {
  animalesDadosDeBaja: DeregistrationRecord[] = [];
  animalesFiltrados: DeregistrationRecord[] = [];
  isLoading: boolean = false;
  error: string = '';

  currentPage: number = 0;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  searchTerm: string = '';
  sortBy: string = 'identificador';

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDeregisteredAnimals();
  }

  loadDeregisteredAnimals(): void {
    this.isLoading = true;
    this.error = '';
    
    console.log('Cargando animales dados de baja...');
    
    this.http.get<DeregistrationRecord[]>(`${this.apiUrl}/api/deregistrations`)
      .subscribe({
        next: (data) => {
          console.log('Datos de bajas recibidos:', data);
          this.animalesDadosDeBaja = data;
          this.animalesFiltrados = data;
          this.totalItems = data.length;
          this.calculateTotalPages();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar animales dados de baja:', err);
          this.error = 'Error al cargar los animales dados de baja. Por favor, intenta de nuevo.';
          this.isLoading = false;
        }
      });
  }

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
      this.animalesFiltrados = [...this.animalesDadosDeBaja];
    } else {
      this.animalesFiltrados = this.animalesDadosDeBaja.filter(animal =>
        animal.inventoryNumber.toLowerCase().includes(this.searchTerm) ||
        animal.specimenName.toLowerCase().includes(this.searchTerm) ||
        animal.genus.toLowerCase().includes(this.searchTerm) ||
        animal.species.toLowerCase().includes(this.searchTerm) ||
        animal.causeName.toLowerCase().includes(this.searchTerm) ||
        (animal.commonName && animal.commonName.toLowerCase().includes(this.searchTerm))
      );
    }
    this.calculateTotalPages();
    this.currentPage = 0;
    this.sortAnimals();
  }

  sortAnimals(): void {
    this.animalesFiltrados.sort((a, b) => {
      switch (this.sortBy) {
        case 'identificador':
          return a.inventoryNumber.localeCompare(b.inventoryNumber);
        case 'genero':
          return a.genus.localeCompare(b.genus);
        case 'especie':
          return a.species.localeCompare(b.species);
        case 'fechaBaja':
          return new Date(b.deregistrationDate).getTime() - new Date(a.deregistrationDate).getTime();
        default:
          return 0;
      }
    });
  }

  onItemsPerPageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(select.value);
    this.currentPage = 0;
    this.calculateTotalPages();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
  }

  getPaginationInfo(): string {
    if (this.totalItems === 0) return '0-0 de 0 items';
    const start = this.currentPage * this.itemsPerPage + 1;
    const end = Math.min((this.currentPage + 1) * this.itemsPerPage, this.totalItems);
    return `${start}-${end} de ${this.totalItems} items`;
  }

  getPaginatedAnimals(): DeregistrationRecord[] {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.animalesFiltrados.slice(start, end);
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (this.totalPages <= maxVisible) {
      for (let i = 0; i < this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(0, this.currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(this.totalPages, start + maxVisible);
      
      if (end - start < maxVisible) {
        start = Math.max(0, end - maxVisible);
      }
      
      for (let i = start; i < end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  toggleMenu(event: Event): void {
    const button = event.currentTarget as HTMLButtonElement;
    const menu = button.nextElementSibling as HTMLElement;
    
    document.querySelectorAll('.actions-menu.show').forEach(m => {
      if (m !== menu) m.classList.remove('show');
    });
    
    menu.classList.toggle('show');
    
    const closeMenu = (e: MouseEvent) => {
      if (!button.contains(e.target as Node) && !menu.contains(e.target as Node)) {
        menu.classList.remove('show');
        document.removeEventListener('click', closeMenu);
      }
    };
    
    setTimeout(() => document.addEventListener('click', closeMenu), 0);
  }

  viewDetails(specimenId: number): void {
    console.log('Ver detalles del especimen:', specimenId);
  }

  viewReport(deregistrationId: number): void {
    console.log('Ver reporte de baja:', deregistrationId);
  }
}