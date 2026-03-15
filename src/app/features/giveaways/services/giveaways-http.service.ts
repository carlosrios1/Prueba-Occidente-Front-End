import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

import { environment } from '@env';
import { Response } from '@core/models/api/response.model';
import { PaginatedData } from '@core/models/api/pagination.model';
import { GiveawaySummary, GiveawayDetail, WinnerRecord } from '../models/giveaway.model';
import { CreateGiveawayRequest, UpdateGiveawayRequest } from '../models/giveaway-requests.model';
import { CreateGiveawayResponse, RunGiveawayResponse } from '../models/giveaway-responses.model';
import { SKIP_ERROR_TOAST } from '@core/interceptors/http-context-tokens';

@Injectable({ providedIn: 'root' })
export class GiveawaysHttpService {
    private http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/api/giveaways`;
    private readonly reportsUrl = `${environment.apiUrl}/api/reports`;

    getAll(page: number, pageSize: number): Observable<PaginatedData<GiveawaySummary>> {
        const params = new HttpParams()
            .set('page', page)
            .set('pageSize', pageSize);
        return this.http
            .get<Response<PaginatedData<GiveawaySummary>>>(this.baseUrl, { params })
            .pipe(map(res => res.data));
    }

    getById(id: number): Observable<GiveawayDetail> {
        return this.http
            .get<Response<GiveawayDetail>>(`${this.baseUrl}/${id}`)
            .pipe(map(res => res.data));
    }

    create(request: CreateGiveawayRequest): Observable<CreateGiveawayResponse> {
        return this.http
            .post<Response<CreateGiveawayResponse>>(this.baseUrl, request)
            .pipe(map(res => res.data));
    }

    update(id: number, request: UpdateGiveawayRequest): Observable<void> {
        return this.http
            .put<Response<void>>(`${this.baseUrl}/${id}`, request)
            .pipe(map(() => void 0));
    }

    delete(id: number): Observable<void> {
        return this.http
            .delete<Response<void>>(`${this.baseUrl}/${id}`)
            .pipe(map(() => void 0));
    }

    run(id: number): Observable<RunGiveawayResponse> {
        return this.http
            .post<Response<RunGiveawayResponse>>(`${this.baseUrl}/${id}/run`, {})
            .pipe(map(res => res.data));
    }

    /** Obtener los ganadores de un sorteo por su fecha (yyyy-MM-dd) */
    getWinners(date: string): Observable<WinnerRecord[]> {
        const params = new HttpParams().set('date', date);
        return this.http
            .get<Response<WinnerRecord[]>>(`${this.reportsUrl}/giveaway-winners`, {
                params,
                context: new HttpContext().set(SKIP_ERROR_TOAST, true),
            })
            .pipe(
                map(res => res.data ?? []),
                catchError(() => of([])),
            );
    }
}
