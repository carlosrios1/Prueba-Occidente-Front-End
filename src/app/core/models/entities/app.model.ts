export interface AppCreateDto {
    nombre: string;
    descripcion: string;
    tipoAplicacionId: number;
    tecnologiaId: number;
}

export interface AppResponseDto {
    nombre: string;
    descripcion: string;
    tipoAplicacion: string;
    tecnologia: string;
    responsables: number;
    ambientes: number;
}

export interface App extends AppResponseDto {
    appId: number;
    repositorio: string;
    fechaCreacion: string;
    activa: number;
}