// ============================================
// INTERFACES PARA REGISTRO DE ALTA
// ============================================

export interface RegistroAltaRequest {
  specimenId: number;
  originId: number;
  registeredBy: number;
  registrationDate: string;
  origin?: string;
  observations?: string;
  originArea?: string;
  destinationArea?: string;
  originLocation?: string;
  destinationLocation?: string;
}

export interface RegistroAltaResponse {
  id: number;
  specimenId: number;
  inventoryNumber: string;
  specimenName: string;
  genus: string;
  species: string;
  commonName: string | null;
  sex: string | null;
  birthDate: string | null;
  originName: string;
  registeredByName: string;
  registrationDate: string;
  origin: string | null;
  observations: string | null;
  createdAt: string;
}

// ============================================
// INTERFACES PARA ESPECIES
// ============================================

export interface EspecieRequest {
  genus: string;
  species: string;
  commonName?: string | null;
}

export interface EspecieResponse {
  id: number;
  genus: string;
  species: string;
  commonName: string | null;
}

// ============================================
// INTERFACES PARA ORIGEN DE ALTA
// ============================================

export interface OrigenAlta {
  id: number;
  nombreOrigenAlta: string;
}