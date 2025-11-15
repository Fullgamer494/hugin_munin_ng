import { Component, OnInit } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { AnimalService } from '../../../core/application/services/report/animal.service';

interface FullAnimalRecord {
  id: number;
  numInventario: string;
  nombreEspecimen: string;
  sexo: string;
  fechaNacimiento: string;
  activo: boolean;
  id_especie: number;
  genero: string;
  especie: string;
  nombreComun: string | null;
}

@Component({
  selector: 'app-animals-table',
  standalone: true,
  imports: [MatIcon, RouterLink, CommonModule],
  templateUrl: './animals-table.view.html',
  styleUrl: './animals-table.view.css',
})
export class AnimalsTableView implements OnInit {
  animales: FullAnimalRecord[] = [];
  animalesFiltrados: FullAnimalRecord[] = [];
  isLoading: boolean = false;
  error: string = '';

  currentPage: number = 0;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  searchTerm: string = '';
  sortBy: string = 'identificador';

  constructor(private animalService: AnimalService) {}

  ngOnInit(): void {
    this.loadAnimals();
  }

  loadAnimals(): void {
    this.isLoading = true;
    this.error = '';
    
    console.log('Cargando animales...');
    console.log('Página:', this.currentPage, 'Tamaño:', this.itemsPerPage);
    
    this.animalService.getAnimalsPaginated(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (data) => {
          console.log('Datos recibidos:', data);
          this.animales = data;
          this.animalesFiltrados = data;
          this.totalItems = data.length;
          this.calculateTotalPages();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar animales:', err);
          console.error('Detalles del error:', err.message);
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
      this.animalesFiltrados = [...this.animales];
    } else {
      this.animalesFiltrados = this.animales.filter(animal =>
        animal.numInventario.toLowerCase().includes(this.searchTerm) ||
        animal.nombreEspecimen.toLowerCase().includes(this.searchTerm) ||
        animal.genero.toLowerCase().includes(this.searchTerm) ||
        animal.especie.toLowerCase().includes(this.searchTerm) ||
        (animal.nombreComun && animal.nombreComun.toLowerCase().includes(this.searchTerm))
      );
    }
    this.sortAnimals();
  }

  sortAnimals(): void {
    this.animalesFiltrados.sort((a, b) => {
      switch (this.sortBy) {
        case 'identificador':
          return a.numInventario.localeCompare(b.numInventario);
        case 'genero':
          return a.genero.localeCompare(b.genero);
        case 'especie':
          return a.especie.localeCompare(b.especie);
        case 'fecha':
          return new Date(a.fechaNacimiento).getTime() - new Date(b.fechaNacimiento).getTime();
        default:
          return 0;
      }
    });
  }

  onItemsPerPageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.itemsPerPage = Number(select.value);
    this.currentPage = 0;
    this.loadAnimals();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadAnimals();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadAnimals();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadAnimals();
    }
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  getPaginationInfo(): string {
    const start = this.currentPage * this.itemsPerPage + 1;
    const end = Math.min((this.currentPage + 1) * this.itemsPerPage, this.totalItems);
    return `${start}-${end} de ${this.totalItems} items`;
  }

  deleteAnimal(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este animal?')) {
   
      console.log('Eliminando animal con id:', id);

    }
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
}