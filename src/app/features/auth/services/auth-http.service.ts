import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '@env';
import { Response } from '@core/models/api/response.model';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../models/login-response.model';

@Injectable({ providedIn: 'root' })
export class AuthHttpService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http
            .post<Response<LoginResponse>>(`${this.baseUrl}/api/auth/login`, credentials)
            .pipe(map(res => res.data));
    }

    register(data: RegisterRequest): Observable<RegisterResponse> {
        return this.http
            .post<Response<RegisterResponse>>(`${this.baseUrl}/api/auth/register`, data)
            .pipe(map(res => res.data));
    }
}
