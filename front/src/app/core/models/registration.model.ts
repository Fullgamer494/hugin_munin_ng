export interface RegistrationRequest {
  specimenId: number;
  originId: number;
  registeredBy: number;
  registrationDate: string;
  guideNumber?: string;
  origin?: string;
  arrivalCondition?: string;
  observations?: string;
  documentFile?: string;
}

export interface RegistrationResponse {
  id: number;
  specimenId: number;
  specimenName: string;
  inventoryNumber: string;
  genus: string;
  species: string;
  commonName?: string;
  originName: string;
  registeredByName: string;
  registrationDate: string;
  guideNumber?: string;
  origin?: string;
  arrivalCondition?: string;
  observations?: string;
  documentFile?: string;
}