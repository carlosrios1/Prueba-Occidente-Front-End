// ⚠️ API usa "awardname" (todo minúscula) en POST crear
export interface CreateAwardRequest {
    awardname: string;
    description: string;
}

// ⚠️ API usa "awardName" (N mayúscula) en PUT actualizar
export interface UpdateAwardRequest {
    awardName: string;
    description: string;
}
