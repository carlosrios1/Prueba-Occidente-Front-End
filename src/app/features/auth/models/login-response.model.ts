export interface LoginRequest {
    username: string;
    password: string;
}

export interface AuthUserInfo {
    id: number;
    username: string;
    isActive: boolean;
    lastLogin: string | null;
}

export interface LoginResponse {
    token: string;
    expiresAt: string;
    user: AuthUserInfo;
}
