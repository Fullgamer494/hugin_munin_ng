import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

const API_URL = 'http://localhost:8080';

export interface FullAnimalRecord {
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

export interface PaginatedResponse {
  content: FullAnimalRecord[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root' 
})
export class AnimalService {

  constructor(private http: HttpClient) { }

  
  getAnimalsPaginated(page: number, size: number): Observable<FullAnimalRecord[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    const url = `${API_URL}/animals`;
  
    return this.http.get<FullAnimalRecord[]>(url, { params })
      .pipe(
        retry(2), 
        catchError(this.handleError)
      );
  }

  
  getAnimalById(id: number): Observable<FullAnimalRecord> {
    const url = `${API_URL}/animals/${id}`;
    return this.http.get<FullAnimalRecord>(url)
      .pipe(catchError(this.handleError));
  }

  
  createAnimal(animal: Partial<FullAnimalRecord>): Observable<FullAnimalRecord> {
    const url = `${API_URL}/animals`;
    return this.http.post<FullAnimalRecord>(url, animal)
      .pipe(catchError(this.handleError));
  }

  
  updateAnimal(id: number, animal: Partial<FullAnimalRecord>): Observable<FullAnimalRecord> {
    const url = `${API_URL}/animals/${id}`;
    return this.http.put<FullAnimalRecord>(url, animal)
      .pipe(catchError(this.handleError));
  }

  
  deleteAnimal(id: number): Observable<void> {
    const url = `${API_URL}/animals/${id}`;
    return this.http.delete<void>(url)
      .pipe(catchError(this.handleError));
  }


  searchAnimals(searchTerm: string): Observable<FullAnimalRecord[]> {
    const params = new HttpParams().set('search', searchTerm);
    const url = `${API_URL}/animals/search`;
    return this.http.get<FullAnimalRecord[]>(url, { params })
      .pipe(catchError(this.handleError));
  }

 
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      
      errorMessage = `Error: ${error.error.message}`;
    } else {
     
      switch (error.status) {
        case 0:
          errorMessage = 'No se puede conectar con el servidor. Verifica que el backend esté corriendo.';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor.';
          break;
        default:
          errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
      }
    }
    
    console.error('Error en AnimalService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}