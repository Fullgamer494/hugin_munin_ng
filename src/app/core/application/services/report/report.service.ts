import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportEntity } from '../../../domain/entities/report/report.entity';
import { ReportRepository, CreateReportDto, UpdateReportDto } from '../../../domain/ports/outbound/report/report.repository';

import {
  GetAllReportsUseCase,
  GetReportByIdUseCase,
  GetReportsBySpecimenUseCase,
  CreateReportUseCase,
  UpdateReportUseCase,
  DeleteReportUseCase
} from '../../../domain/ports/inbound/report/report.use-case';

@Injectable({
  providedIn: 'root'
})
export class GetAllReportsService implements GetAllReportsUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  execute(): Observable<ReportEntity[]> {
    return this.reportRepository.findAll();
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetReportByIdService implements GetReportByIdUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  execute(id: number): Observable<ReportEntity | null> {
    return this.reportRepository.findById(id);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GetReportsBySpecimenService implements GetReportsBySpecimenUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  execute(specimenId: number): Observable<ReportEntity[]> {
    return this.reportRepository.findBySpecimen(specimenId);
  }
}

@Injectable({
  providedIn: 'root'
})
export class CreateReportService implements CreateReportUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  execute(data: CreateReportDto): Observable<ReportEntity> {
    return this.reportRepository.create(data);
  }
}

@Injectable({
  providedIn: 'root'
})
export class UpdateReportService implements UpdateReportUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  execute(id: number, data: UpdateReportDto): Observable<ReportEntity> {
    return this.reportRepository.update(id, data);
  }
}

@Injectable({
  providedIn: 'root'
})
export class DeleteReportService implements DeleteReportUseCase {
  constructor(private readonly reportRepository: ReportRepository) {}

  execute(id: number): Observable<void> {
    return this.reportRepository.delete(id);
  }
}