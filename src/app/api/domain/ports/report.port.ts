import { Observable } from "rxjs";
import { 
  ReportResponse, 
  CreateReportRequest, 
  UpdateReportRequest,
  EspecimenDetalleResponse
} from "../models/report.model";

export abstract class ReportPort {

  abstract createReport(request: CreateReportRequest): Observable<ReportResponse>;
  abstract getReportById(id: number): Observable<ReportResponse>;
  abstract getReportsBySpecimen(especimenId: number): Observable<ReportResponse[]>;
  abstract getAllReports(): Observable<ReportResponse[]>;
  abstract updateReport(id: number, request: UpdateReportRequest): Observable<ReportResponse>;
  abstract deleteReport(id: number): Observable<void>;
  
  abstract searchSpecimens(query: string): Observable<EspecimenDetalleResponse[]>;
  abstract getSpecimenById(id: number): Observable<EspecimenDetalleResponse>;
}