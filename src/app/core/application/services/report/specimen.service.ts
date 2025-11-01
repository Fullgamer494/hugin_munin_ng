import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Specimen } from '../../../domain/entities/report/report.entity';
import { SpecimenRepository } from '../../../domain/ports/outbound/report/specimen.repository';

import {
  SearchSpecimensUseCase,
  GetSpecimenByIdUseCase
} from '../../../domain/ports/inbound/report/specimen.use-case';

@Injectable({
  providedIn: 'root'
})
export class SearchSpecimensService implements SearchSpecimensUseCase {
  constructor(private readonly specimenRepository: SpecimenRepository) {}

  execute(query: string): Observable<Specimen[]> {
    return this.specimenRepository.searchByNumber(query);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetSpecimenByIdService implements GetSpecimenByIdUseCase {
  constructor(private readonly specimenRepository: SpecimenRepository) {}

  execute(id: number): Observable<Specimen | null> {
    return this.specimenRepository.findById(id);
  }
}