import { Observable } from 'rxjs';
import { Specimen } from '../../../entities/report/report.entity';

export abstract class SpecimenRepository {
  abstract searchByNumber(query: string): Observable<Specimen[]>;
  abstract findById(id: number): Observable<Specimen | null>;
}