import { Observable } from 'rxjs';
import { Report } from '../../../entities/report/report.entity';

export interface CreateReportDto {
  id_tipo_reporte: number;
  id_especimen: number;
  id_responsable: number;
  asunto: string;
  contenido: string;
  fecha_reporte: string;
}

export interface UpdateReportDto {
  id_tipo_reporte?: number;
  id_especimen?: number;
  id_responsable?: number;
  asunto?: string;
  contenido?: string;
  fecha_reporte?: string;
}

export abstract class ReportRepository {
  abstract findAll(): Observable<Report[]>;
  abstract findById(id: number): Observable<Report | null>;
  abstract findBySpecimen(specimenId: number): Observable<Report[]>;
  abstract create(data: CreateReportDto): Observable<Report>;
  abstract update(id: number, data: UpdateReportDto): Observable<Report>;
  abstract delete(id: number): Observable<void>;
}