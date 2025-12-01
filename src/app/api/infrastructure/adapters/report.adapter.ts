import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ReportPort } from '../../domain/ports/report.port';
import { 
  ReportResponse, 
  CreateReportRequest, 
  UpdateReportRequest,
  EspecimenDetalleResponse
} from '../../domain/models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportAdapter implements ReportPort {
  private readonly REPORTS_URL = `${environment.apiUrl}/hm/reportes`;
  private readonly SPECIMEN_URL = `${environment.apiUrl}/hm/especimen`;

  constructor(private http: HttpClient) {}

  createReport(request: CreateReportRequest): Observable<ReportResponse> {
    return this.http.post<ReportResponse>(this.REPORTS_URL, request);
  }

  getReportById(id: number): Observable<ReportResponse> {
    return this.http.get<ReportResponse>(`${this.REPORTS_URL}/${id}`);
  }

  getReportsBySpecimen(especimenId: number): Observable<ReportResponse[]> {
    return this.http.get<ReportResponse[]>(`${this.REPORTS_URL}/especimen/${especimenId}`);
  }

  getAllReports(): Observable<ReportResponse[]> {
    return this.http.get<ReportResponse[]>(this.REPORTS_URL);
  }

  updateReport(id: number, request: UpdateReportRequest): Observable<ReportResponse> {
    return this.http.put<ReportResponse>(`${this.REPORTS_URL}/${id}`, request);
  }

  deleteReport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.REPORTS_URL}/${id}`);
  }

  searchSpecimens(query: string): Observable<EspecimenDetalleResponse[]> {
   
    return this.http.get<EspecimenDetalleResponse[]>(this.SPECIMEN_URL);
  }

  getSpecimenById(id: number): Observable<EspecimenDetalleResponse> {
    return this.http.get<EspecimenDetalleResponse>(`${this.SPECIMEN_URL}/${id}`);
  }
}