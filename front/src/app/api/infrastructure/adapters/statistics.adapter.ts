import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StatisticsPort } from '../../domain/ports/statistics.port';
import { StatisticsResponse } from '../../domain/models/statistics.model';

@Injectable({
    providedIn: 'root'
})
export class StatisticsAdapter implements StatisticsPort {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/hm/estadisticas`;

    getStatistics(): Observable<StatisticsResponse> {
        return this.http.get<StatisticsResponse>(this.apiUrl);
    }
}
