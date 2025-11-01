import { Observable } from 'rxjs';
import { Report } from '../../../entities/report/report.entity';
import { CreateReportDto, UpdateReportDto } from '../../outbound/report/report.repository';

export abstract class GetAllReportsUseCase {
  abstract execute(): Observable<Report[]>;
}

export abstract class GetReportByIdUseCase {
  abstract execute(id: number): Observable<Report | null>;
}

export abstract class GetReportsBySpecimenUseCase {
  abstract execute(specimenId: number): Observable<Report[]>;
}

export abstract class CreateReportUseCase {
  abstract execute(data: CreateReportDto): Observable<Report>;
}

export abstract class UpdateReportUseCase {
  abstract execute(id: number, data: UpdateReportDto): Observable<Report>;
}

export abstract class DeleteReportUseCase {
  abstract execute(id: number): Observable<void>;
}
