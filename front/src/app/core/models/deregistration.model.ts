export interface DeregistrationRequest {
  specimenId: number;
  causeId: number;
  registeredBy: number;
  deregistrationDate: string;
  destination?: string;
  observations?: string;
  documentFile?: string;
}

export interface DeregistrationResponse {
  id: number;
  specimenId: number;
  specimenName: string;
  inventoryNumber: string;
  genus: string;
  species: string;
  commonName?: string;
  causeName: string;
  registeredByName: string;
  deregistrationDate: string;
  destination?: string;
  observations?: string;
  documentFile?: string;
}