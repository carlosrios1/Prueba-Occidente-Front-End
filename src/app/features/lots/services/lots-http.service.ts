import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { Response } from '@core/models/api/response.model';
import { PaginatedData } from '@core/models/api/pagination.model';
import { Lot } from '../models/dtos/lot.dto';
import { Transaction } from '../models/dtos/transaction.dto';
import { UploadLotResponse } from '../models/responses/upload-lot.response';

@Injectable()
export class LotsHttpService {
    private http = inject(HttpClient);
    private readonly base = `${environment.apiUrl}/api/lots`;

    getLots(page: number, pageSize: number): Observable<Response<PaginatedData<Lot>>> {
        return this.http.get<Response<PaginatedData<Lot>>>(this.base, {
            params: { page, pageSize }
        });
    }

    getLotById(id: number): Observable<Response<Lot>> {
        return this.http.get<Response<Lot>>(`${this.base}/${id}`);
    }

    getTransactions(page: number, pageSize: number): Observable<Response<PaginatedData<Transaction>>> {
        return this.http.get<Response<PaginatedData<Transaction>>>(`${this.base}/transactions`, {
            params: { page, pageSize }
        });
    }

    uploadLot(file: File): Observable<Response<UploadLotResponse>> {
        const form = new FormData();
        form.append('file', file);
        return this.http.post<Response<UploadLotResponse>>(`${this.base}/upload`, form);
    }
}
