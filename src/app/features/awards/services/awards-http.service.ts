import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '@env';
import { Response } from '@core/models/api/response.model';
import { PaginatedData } from '@core/models/api/pagination.model';
import { Award } from '../models/award.model';
import { CreateAwardRequest, UpdateAwardRequest } from '../models/award-requests.model';

@Injectable({ providedIn: 'root' })
export class AwardsHttpService {
    private http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/api/awards`;

    getAll(page: number, pageSize: number): Observable<PaginatedData<Award>> {
        const params = new HttpParams()
            .set('page', page)
            .set('pageSize', pageSize);
        return this.http
            .get<Response<PaginatedData<Award>>>(this.baseUrl, { params })
            .pipe(map(res => res.data));
    }

    create(request: CreateAwardRequest): Observable<Award> {
        return this.http
            .post<Response<Award>>(this.baseUrl, request)
            .pipe(map(res => res.data));
    }

    update(id: number, request: UpdateAwardRequest): Observable<Award> {
        return this.http
            .put<Response<Award>>(`${this.baseUrl}/${id}`, request)
            .pipe(map(res => res.data));
    }

    delete(id: number): Observable<void> {
        return this.http
            .delete<Response<void>>(`${this.baseUrl}/${id}`)
            .pipe(map(() => void 0));
    }
}
