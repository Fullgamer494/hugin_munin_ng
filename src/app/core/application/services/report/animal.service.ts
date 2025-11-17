import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

interface SpecimenResponse {
  id: number;
  inventoryNumber: string;
  speciesId: number;
  genus: string;
  species: string;
  commonName: string | null;
  specimenName: string;
  sex: string | null;
  birthDate: string | null;
  active: boolean;
  registrationDate: string;
}

interface FullAnimalRecord {
  id: number;
  numInventario: string;
  nombreEspecimen: string;
  sexo: string;
  fechaNacimiento: string;
  activo: boolean;
  idEspecie: number;  
  genero: string;
  especie: string;
  nombreComun: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AnimalService {

  private apiUrl = `${environment.apiUrl}/api/specimens`;

  constructor(private http: HttpClient) {}

  private mapToAnimalRecord(specimen: SpecimenResponse): FullAnimalRecord {
    return {
      id: specimen.id,
      numInventario: specimen.inventoryNumber,
      nombreEspecimen: specimen.specimenName,
      sexo: specimen.sex || '',
      fechaNacimiento: specimen.birthDate || '',
      activo: specimen.active,
      idEspecie: specimen.speciesId,
      genero: specimen.genus,
      especie: specimen.species,
      nombreComun: specimen.commonName
    };
  }

  getAnimalsPaginated(page: number, size: number): Observable<FullAnimalRecord[]> {
    console.log('Llamando a:', this.apiUrl);
    
    return this.http.get<SpecimenResponse[]>(this.apiUrl).pipe(
      map(specimens => {
        console.log('Respuesta del backend:', specimens);
        return specimens.map(s => this.mapToAnimalRecord(s));
      })
    );
  }

  getAnimalById(id: number): Observable<FullAnimalRecord> {
    return this.http.get<SpecimenResponse>(`${this.apiUrl}/${id}`).pipe(
      map(specimen => this.mapToAnimalRecord(specimen))
    );
  }

  createAnimal(animal: Partial<FullAnimalRecord>): Observable<any> {
   
    const specimenRequest = {
      inventoryNumber: animal.numInventario,
      speciesId: animal.idEspecie,
      specimenName: animal.nombreEspecimen,
      sex: animal.sexo,
      birthDate: animal.fechaNacimiento
    };
    return this.http.post(this.apiUrl, specimenRequest);
  }

  updateAnimal(id: number, animal: Partial<FullAnimalRecord>): Observable<any> {
    const specimenRequest = {
      inventoryNumber: animal.numInventario,
      speciesId: animal.idEspecie,
      specimenName: animal.nombreEspecimen,
      sex: animal.sexo,
      birthDate: animal.fechaNacimiento
    };
    return this.http.put(`${this.apiUrl}/${id}`, specimenRequest);
  }

  deleteAnimal(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchByName(name: string): Observable<FullAnimalRecord[]> {
    return this.http.get<SpecimenResponse[]>(`${this.apiUrl}/search?name=${name}`).pipe(
      map(specimens => specimens.map(s => this.mapToAnimalRecord(s)))
    );
  }

  filterBySpecies(species: string): Observable<FullAnimalRecord[]> {
  
    return this.searchByName(species);
  }

  filterByCommonName(commonName: string): Observable<FullAnimalRecord[]> {
   
    return this.searchByName(commonName);
  }
}