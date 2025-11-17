export interface RegistroAltaRequest {
  idEspecimen: number; 
  idOrigenAlta: number;
  idResponsable: number;
  fechaIngreso: string; 
  procedencia?: string;
  observacion?: string;
}

export interface RegistroAltaResponse {
  idRegistroAlta: number;
  idEspecimen: number;
  numInventario: string;
  nombreEspecimen: string;
  genero: string;
  especie: string;
  nombreComun: string | null;
  sexo: string | null;
  fechaNacimiento: string | null;
  nombreOrigenAlta: string;
  nombreResponsable: string;
  fechaIngreso: string;
  procedencia: string | null;
  observacion: string | null;
  fechaRegistro: string;
}

export interface EspecieRequest {
  genero: string;
  especie: string;
  nombreComun?: string | null;
}

export interface EspecieResponse {
  id: number;
  genero: string;
  especie: string;
  nombreComun: string | null;
}

export interface OrigenAlta {
  id: number;
  nombreOrigenAlta: string;
}