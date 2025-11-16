export interface SpeciesRequest {
  genus: string;
  species: string;
  commonName?: string;
}

export interface SpeciesResponse {
  id: number;
  genus: string;
  species: string;
  commonName?: string;
}

export interface SpecimenRequest {
  inventoryNumber: string;
  speciesId: number;
  specimenName: string;
  sex?: string;
  birthDate?: string;
}

export interface SpecimenResponse {
  id: number;
  inventoryNumber: string;
  speciesId: number;
  genus: string;
  species: string;
  commonName?: string;
  specimenName: string;
  sex?: string;
  birthDate?: string;
  active: boolean;
  registrationDate: string;
}