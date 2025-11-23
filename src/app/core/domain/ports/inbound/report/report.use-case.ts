import { Observable } from 'rxjs';
import { ReportEntity } from '../../../entities/report/report.entity';
import { CreateReportDto, UpdateReportDto } from '../../outbound/report/report.repository';

export abstract class GetAllReportsUseCase {
  abstract execute(): Observable<ReportEntity[]>;
}

export abstract class GetReportByIdUseCase {
  abstract execute(id: number): Observable<ReportEntity | null>;
}

export abstract class GetReportsBySpecimenUseCase {
  abstract execute(specimenId: number): Observable<ReportEntity[]>;
}

export abstract class CreateReportUseCase {
  abstract execute(data: CreateReportDto): Observable<ReportEntity>;
}

export abstract class UpdateReportUseCase {
  abstract execute(id: number, data: UpdateReportDto): Observable<ReportEntity>;
}

export abstract class DeleteReportUseCase {
  abstract execute(id: number): Observable<void>;
}