import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';

import { environment } from '@env';
import { Response } from '@core/models/api/response.model';
import { PaginatedReportData } from '@core/models/api/pagination.model';
import { SKIP_ERROR_TOAST } from '@core/interceptors/http-context-tokens';
import { TransactionReport } from '../models/transaction-report.model';
import { WinnerReport } from '../models/winner-report.model';

@Injectable({ providedIn: 'root' })
export class ReportsHttpService {
    private http = inject(HttpClient);
    private readonly base = `${environment.apiUrl}/api/reports`;

    // ── Transacciones ────────────────────────────────────────────────────────

    getTransactions(
        startDate: string,
        endDate: string,
        page: number,
        pageSize: number,
    ): Observable<PaginatedReportData<TransactionReport>> {
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('endDate', endDate)
            .set('page', page)
            .set('pageSize', pageSize);
        return this.http
            .get<Response<PaginatedReportData<TransactionReport>>>(
                `${this.base}/transactions`,
                { params },
            )
            .pipe(map(res => res.data));
    }

    downloadTransactionsExcel(startDate: string, endDate: string): Observable<void> {
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('endDate', endDate);
        return this.http
            .get(`${this.base}/transactions/excel`, { params, responseType: 'blob' })
            .pipe(
                tap(blob => this.triggerDownload(blob, `transacciones_${startDate}_${endDate}.xlsx`)),
                map(() => void 0),
            );
    }

    downloadTransactionsPdf(startDate: string, endDate: string): Observable<void> {
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('endDate', endDate);
        return this.http
            .get(`${this.base}/transactions/pdf`, { params, responseType: 'blob' })
            .pipe(
                tap(blob => this.triggerDownload(blob, `transacciones_${startDate}_${endDate}.pdf`)),
                map(() => void 0),
            );
    }

    // ── Ganadores ────────────────────────────────────────────────────────────

    getWinners(giveawayId: number): Observable<WinnerReport[]> {
        const params = new HttpParams().set('giveawayId', giveawayId);
        return this.http
            .get<Response<WinnerReport[]>>(`${this.base}/giveaway-winners`, {
                params,
                context: new HttpContext().set(SKIP_ERROR_TOAST, true),
            })
            .pipe(
                map(res => res.data ?? []),
                catchError(() => of([])),
            );
    }

    downloadWinnersExcel(giveawayId: number): Observable<void> {
        const params = new HttpParams().set('giveawayId', giveawayId);
        return this.http
            .get(`${this.base}/giveaway-winners/excel`, { params, responseType: 'blob' })
            .pipe(
                tap(blob => this.triggerDownload(blob, `ganadores_sorteo_${giveawayId}.xlsx`)),
                map(() => void 0),
            );
    }

    downloadWinnersPdf(giveawayId: number): Observable<void> {
        const params = new HttpParams().set('giveawayId', giveawayId);
        return this.http
            .get(`${this.base}/giveaway-winners/pdf`, { params, responseType: 'blob' })
            .pipe(
                tap(blob => this.triggerDownload(blob, `ganadores_sorteo_${giveawayId}.pdf`)),
                map(() => void 0),
            );
    }

    // ── Utils ─────────────────────────────────────────────────────────────────

    /** Obtiene el PDF como Blob sin disparar descarga (para imprimir). */
    getPdfBlob(
        type: 'transactions' | 'winners',
        params: HttpParams,
    ): Observable<Blob> {
        const segment = type === 'winners' ? 'giveaway-winners' : 'transactions';
        return this.http.get(`${this.base}/${segment}/pdf`, { params, responseType: 'blob' });
    }

    private triggerDownload(blob: Blob, fileName: string): void {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
    }
}
