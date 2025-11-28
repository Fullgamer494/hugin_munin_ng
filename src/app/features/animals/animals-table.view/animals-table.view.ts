import { Component, OnInit, inject, ElementRef } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject, combineLatest, map, startWith } from 'rxjs'; 

// Importa tus servicios y modelos (Asegúrate de que las rutas sean correctas)
import { EspecimenService } from '../../../api/application/especimen.service'; 
import { EspecimenDetalleResponse } from '../../../api/domain/models/especimen-alta.model';

@Component({
  selector: 'app-animals-table',
  standalone: true,
  imports: [MatIcon, RouterLink, CommonModule],
  templateUrl: './animals-table.view.html',
  styleUrl: './animals-table.view.css',
})
export class AnimalsTableView implements OnInit { // Implementamos OnInit
  
  // Inyección de dependencias
  private especimenService = inject(EspecimenService);

  // --- Streams de control (BehaviorSubject) ---
  searchSubject = new BehaviorSubject<string>('');
  sortSubject = new BehaviorSubject<{ field: string, direction: string }>({ field: 'numInventario', direction: 'asc' });
  pageIndexSubject = new BehaviorSubject<number>(0);
  pageSizeSubject = new BehaviorSubject<number>(10);
  
  // --- Propiedades de la Vista ---
  animalesFiltrados$!: Observable<EspecimenDetalleResponse[]>; 
  
  // Variables síncronas para la paginación y estado
  currentPage: number = 0;
  totalPages: number = 0;
  totalItems: number = 0;
  isLoading: boolean = false;
  menuAbiertoId: number | null = null;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.isLoading = true;
    
    // 1. Observable fuente que trae todos los datos
    const allAnimals$ = this.especimenService.getAllSpecimens().pipe(
      startWith([] as EspecimenDetalleResponse[])
    );

    // 2. CombineLatest: Combina todos los streams para recalcular la tabla
    this.animalesFiltrados$ = combineLatest([
      allAnimals$,
      this.searchSubject,
      this.sortSubject,
      this.pageIndexSubject,
      this.pageSizeSubject
    ]).pipe(
      map(([animales, searchTerm, sort, pageIndex, pageSize]) => {
        
        // El estado de carga se desactiva tan pronto se recibe el primer array de animales
        if (this.isLoading && animales.length > 0) {
            this.isLoading = false;
        }

        const animalesActivos = animales.filter(animal => animal.activo);

        const filtered = this.applyFilter(animalesActivos, searchTerm);
        const sorted = this.applySort(filtered, sort.field, sort.direction);

        // Actualiza las variables síncronas de paginación
        this.totalItems = sorted.length;
        this.totalPages = Math.ceil(this.totalItems / pageSize);
        this.currentPage = pageIndex;
        
        const start = pageIndex * pageSize;
        const end = start + pageSize;
        
        // Retorna la porción de datos de la página actual
        return sorted.slice(start, end);
      })
    );

    // Si la llamada falla o no trae datos, desactivar el loading
    this.animalesFiltrados$.subscribe({
        error: () => this.isLoading = false,
        complete: () => this.isLoading = false 
    });
  }

  toggleMenu(animalId: number): void {
    // Lógica para el toggle y solo uno abierto
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
    // Por simplicidad, siempre ordena ascendente al cambiar de campo
    this.sortSubject.next({ field, direction: 'asc' }); 
    this.pageIndexSubject.next(0); // Reiniciar paginación
  }
  
  // Método requerido por el select de elementos por página
  onItemsPerPageChange(event: Event): void {
    const pageSize = parseInt((event.target as HTMLSelectElement).value, 10);
    this.pageSizeSubject.next(pageSize);
    this.pageIndexSubject.next(0); 
  }

  // Método requerido para ir a la página anterior
  previousPage(): void {
    if (this.currentPage > 0) {
      this.pageIndexSubject.next(this.currentPage - 1);
    }
  }

  // Método requerido para ir a la página siguiente
  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.pageIndexSubject.next(this.currentPage + 1);
    }
  }
  
  // Método requerido para ir a una página específica (el error 'goToPage')
  goToPage(index: number): void {
    this.pageIndexSubject.next(index);
  }
  
  // Método auxiliar para la información de paginación
  getPaginationInfo(): string {
    const start = (this.currentPage * this.pageSizeSubject.getValue()) + 1;
    let end = (this.currentPage + 1) * this.pageSizeSubject.getValue();
    end = Math.min(end, this.totalItems);
    return `${start} - ${end} de ${this.totalItems}`;
  }


  // --- Lógica Auxiliar de RxJS (Sin cambios) ---
  
  private applyFilter(animales: EspecimenDetalleResponse[], term: string): EspecimenDetalleResponse[] {
    if (!term) return animales;
    
    return animales.filter(animal => {
        const searchBase = [
            animal.numInventario,
            animal.genero,
            animal.especieNombre,
            animal.registroAlta.origenAltaNombre
        ].join(' ').toLowerCase();

        return searchBase.includes(term);
    });
  }

  private applySort(animales: EspecimenDetalleResponse[], field: string, direction: string): EspecimenDetalleResponse[] {
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
            case 'fecha': 
                aValue = new Date(a.registroAlta.fechaIngreso).getTime();
                bValue = new Date(b.registroAlta.fechaIngreso).getTime();
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
}