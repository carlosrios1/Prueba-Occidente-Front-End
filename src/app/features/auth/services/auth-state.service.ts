import { Injectable, signal } from '@angular/core';

import { LoginResponse } from '../models/login-response.model';

const TOKEN_KEY = 'auth_token';
const USERNAME_KEY = 'auth_username';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
    private _username = signal<string | null>(localStorage.getItem(USERNAME_KEY));
    private _isLoggedIn = signal<boolean>(!!localStorage.getItem(TOKEN_KEY));

    readonly username = this._username.asReadonly();
    readonly isLoggedIn = this._isLoggedIn.asReadonly();

    setSession(data: LoginResponse): void {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USERNAME_KEY, data.user.username);
        this._username.set(data.user.username);
        this._isLoggedIn.set(true);
    }

    clearSession(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USERNAME_KEY);
        this._username.set(null);
        this._isLoggedIn.set(false);
    }

    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }
}
