import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ReportRepository, CreateReportDto, UpdateReportDto } from '../../../../core/domain/ports/outbound/report/report.repository';
import { Report, ReportEntity } from '../../../../core/domain/entities/report/report.entity';
import { environment } from '../../../../../environments/environment';

interface ApiResponse<T> {
  data: T;
  valid: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ReportRepositoryImpl implements ReportRepository {
  private readonly apiUrl = `${environment.apiUrl}/hm/reportes`;

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<Report[]> {
    return this.http.get<ApiResponse<Report[]>>(this.apiUrl).pipe(
      map(response => response.data.map(report => this.toDomain(report)))
    );
  }

  findById(id: number): Observable<Report | null> {
    return this.http.get<ApiResponse<Report>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data ? this.toDomain(response.data) : null)
    );
  }

  findBySpecimen(specimenId: number): Observable<Report[]> {
    return this.http.get<ApiResponse<Report[]>>(`${this.apiUrl}/especimen/${specimenId}`).pipe(
      map(response => response.data.map(report => this.toDomain(report)))
    );
  }

  create(data: CreateReportDto): Observable<Report> {
    return this.http.post<ApiResponse<Report>>(this.apiUrl, data).pipe(
      map(response => this.toDomain(response.data))
    );
  }

  update(id: number, data: UpdateReportDto): Observable<Report> {
    return this.http.put<ApiResponse<Report>>(`${this.apiUrl}/${id}`, data).pipe(
      map(response => this.toDomain(response.data))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private toDomain(apiReport: any): Report {
    return new ReportEntity(
      apiReport.id_reporte,
      apiReport.id_tipo_reporte,
      apiReport.id_especimen,
      apiReport.id_responsable,
      apiReport.asunto,
      apiReport.contenido,
      apiReport.fecha_reporte,
      apiReport.tipo_reporte,
      apiReport.especimen,
      apiReport.responsable
    );
  }
}