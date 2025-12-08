import { Observable } from 'rxjs';
import { StatisticsResponse } from '../models/statistics.model';

export abstract class StatisticsPort {
    abstract getStatistics(): Observable<StatisticsResponse>;
}
