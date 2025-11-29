export interface ResponsableInfo {
    id: number;
    nombreCompleto: string;
}

export interface RegistroBajaDetalleResponse {
    id: number;

    causaBajaId: number;
    causaBajaNombre: string;

    fechaBaja: string; // Mapeado desde 'LocalDate' de Kotlin
    observacion: string | null; // Mapeado desde 'String?'

    especimenId: number;
    numInventario: string;
    nombreEspecimen: string;
    nombreComun: string;
    genero: string;
    especieNombre: string;
    origen: string;
    procedencia: string;
    fechaIngreso: string; // Mapeado desde 'LocalDate' de Kotlin

    responsable: ResponsableInfo;
}

export interface RegistroBajaRequest {
    especimenId: number;
    causaBajaId: number;
    responsableId: number;
    fechaBaja: string;
    observacion?: string;
}

export interface RegistroBajaUpdateRequest {
    causaBajaId: number;
    fechaBaja: string;
    observacion?: string;
}

export interface CausaBajaResponse {
    id: number;
    nombreCausaBaja: string;
}