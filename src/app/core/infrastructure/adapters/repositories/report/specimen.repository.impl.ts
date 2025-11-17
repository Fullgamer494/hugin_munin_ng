import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { SpecimenRepository } from '../../../../../core/domain/ports/outbound/report/specimen.repository';
import { Specimen } from '../../../../../core/domain/entities/report/report.entity';
import { environment } from '../../../../../../environments/environment';

interface ApiResponse<T> {
  data: T;
  valid: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SpecimenRepositoryImpl implements SpecimenRepository {
  private readonly apiUrl = `${environment.apiUrl}/hm/especimenes`;

  constructor(private readonly http: HttpClient) {}

  searchByNumber(query: string): Observable<Specimen[]> {
    return this.http.get<ApiResponse<Specimen[]>>(`${this.apiUrl}/search_num?q=${encodeURIComponent(query)}`).pipe(
      map(response => response.data || [])
    );
  }

  findById(id: number): Observable<Specimen | null> {
    return this.http.get<ApiResponse<Specimen>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data || null)
    );
  }
}



