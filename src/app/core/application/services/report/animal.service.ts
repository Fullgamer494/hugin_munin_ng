import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

interface FullAnimalRecord {
  id: number;
  numInventario: string;
  nombreEspecimen: string;
  sexo: string;
  fechaNacimiento: string;
  activo: boolean;
  idEspecie: number;  // ← CAMBIADO
  genero: string;
  especie: string;
  nombreComun: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private apiUrl = `${environment.apiUrl}/api/especimenes`;

  constructor(private http: HttpClient) {}

  getAnimalsPaginated(page: number, size: number): Observable<FullAnimalRecord[]> {
    return this.http.get<FullAnimalRecord[]>(this.apiUrl);
  }

  getAnimalById(id: number): Observable<FullAnimalRecord> {
    return this.http.get<FullAnimalRecord>(`${this.apiUrl}/${id}`);
  }

  createAnimal(animal: Partial<FullAnimalRecord>): Observable<any> {
    return this.http.post(this.apiUrl, animal);
  }

  updateAnimal(id: number, animal: Partial<FullAnimalRecord>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, animal);
  }

  deleteAnimal(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchByName(name: string): Observable<FullAnimalRecord[]> {
    return this.http.get<FullAnimalRecord[]>(`${this.apiUrl}/search?name=${name}`);
  }

  filterBySpecies(species: string): Observable<FullAnimalRecord[]> {
    return this.http.get<FullAnimalRecord[]>(`${this.apiUrl}/filter/species?name=${species}`);
  }

  filterByCommonName(commonName: string): Observable<FullAnimalRecord[]> {
    return this.http.get<FullAnimalRecord[]>(`${this.apiUrl}/filter/common-name?name=${commonName}`);
  }
}