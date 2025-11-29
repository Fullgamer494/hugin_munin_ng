// GetResponse
export interface TrasladoInfo {
    areaDestino: string; 
    ubicacionDestino: string;
    areaOrigen: string;
    ubicacionOrigen: string;
    motivo: string | null; 
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

export interface EspecimenDetalleResponse {
    id: number;
    numInventario: string;
    nombreEspecimen: string;
    genero: string;
    especieNombre: string;
    activo: boolean;
    
    origenAltaId: number,
    registroAlta: RegistroAltaInfo;
}

// SaveRequest
export interface AltaEspecimenRequest {
    genero: string,
    especieNombre: string,

    numInventario: string,
    nombreEspecimen: string,

    responsableId: number,
    fechaIngreso: Date,

    origenAltaId: number,
    procedencia: string,
    observacionAlta: string,

    areaDestino: string,
    ubicacionOrigen: string,
    ubicacionDestino: string
}

// UpdateResponse
export interface UpdateAltaEspecimenRequest {
    nombreEspecimen: string,
    genero: string,
    especieNombre: string,
    
    fechaIngreso: Date,
    origenAltaId: number,
    procedencia: string,
    observacion: string,

    ubicacionDestino: string,
    motivo: string
}