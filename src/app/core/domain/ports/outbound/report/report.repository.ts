import { Observable } from 'rxjs';
import { ReportEntity } from '../../../entities/report/report.entity';

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
  abstract findAll(): Observable<ReportEntity[]>;
  abstract findById(id: number): Observable<ReportEntity | null>;
  abstract findBySpecimen(specimenId: number): Observable<ReportEntity[]>;
  abstract create(data: CreateReportDto): Observable<ReportEntity>;
  abstract update(id: number, data: UpdateReportDto): Observable<ReportEntity>;
  abstract delete(id: number): Observable<void>;
}