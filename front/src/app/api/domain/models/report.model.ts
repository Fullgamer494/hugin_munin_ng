export interface ReportResponse {
  id: number;
  tipoReporteId: number;
  especimenId: number;
  responsableId: number;
  asunto: string;
  contenido: string;
  fechaReporte: string; 
}

export interface CreateReportRequest {
  tipoReporteId: number;
  especimenId: number;
  responsableId: number;
  asunto: string;
  contenido: string;
  fechaReporte: string;
}

export interface UpdateReportRequest {
  tipoReporteId?: number;
  asunto?: string;
  contenido?: string;
  fechaReporte?: string; 
}

export interface EspecimenDetalleResponse {
  id: number;
  numInventario: string;
  nombreEspecimen: string;
  genero: string;
  especieNombre: string;
  activo: boolean;
  origenAltaId: number;
  registroAlta: RegistroAltaInfo;
}

export interface RegistroAltaInfo {
  id: number;
  origenAltaNombre: string;
  procedencia: string | null;
  observacion: string | null;
  fechaIngreso: string; 
  responsableId: number;
  traslado: TrasladoInfo;
}

export interface TrasladoInfo {
  areaDestino: string;
  ubicacionDestino: string;
  areaOrigen: string;
  ubicacionOrigen: string;
  motivo: string | null;
}