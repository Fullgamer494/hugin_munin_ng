import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ReportPort } from '../../domain/ports/report.port';
import { 
  ReportResponse, 
  CreateReportRequest, 
  UpdateReportRequest,
  EspecimenDetalleResponse
} from '../../domain/models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
  
  constructor(private reportPort: ReportPort) {}

  createReport(request: CreateReportRequest): Observable<ReportResponse> {
    return this.reportPort.createReport(request);
  }

  getReportById(id: number): Observable<ReportResponse> {
    return this.reportPort.getReportById(id);
  }

  getReportsBySpecimen(especimenId: number): Observable<ReportResponse[]> {
    return this.reportPort.getReportsBySpecimen(especimenId);
  }

  getAllReports(): Observable<ReportResponse[]> {
    return this.reportPort.getAllReports();
  }

  updateReport(id: number, request: UpdateReportRequest): Observable<ReportResponse> {
    return this.reportPort.updateReport(id, request);
  }

  deleteReport(id: number): Observable<void> {
    return this.reportPort.deleteReport(id);
  }

  searchSpecimens(query: string): Observable<EspecimenDetalleResponse[]> {
    return this.reportPort.searchSpecimens(query).pipe(
      map(specimens => specimens.filter(s => 
        s.numInventario.toLowerCase().includes(query.toLowerCase()) ||
        s.nombreEspecimen.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  getSpecimenById(id: number): Observable<EspecimenDetalleResponse> {
    return this.reportPort.getSpecimenById(id);
  }
}