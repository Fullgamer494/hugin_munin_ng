import { Observable } from 'rxjs';
import { Specimen } from '../../../entities/report/report.entity';

export abstract class SearchSpecimensUseCase {
  abstract execute(query: string): Observable<Specimen[]>;
}

export abstract class GetSpecimenByIdUseCase {
  abstract execute(id: number): Observable<Specimen | null>;
}