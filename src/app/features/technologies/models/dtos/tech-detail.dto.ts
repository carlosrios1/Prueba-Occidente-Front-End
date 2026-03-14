/**
 * DTO para la respuesta de detalles de una tecnología desde endoflife.date API
 * @see https://endoflife.date/docs/api/
 */
export interface TechCycleDto {
    /** Ciclo/versión principal (ej: "21", "20") */
    cycle: string;

    /** Última versión del ciclo (ej: "21.1.3") */
    latest: string;

    /** Fecha de lanzamiento (YYYY-MM-DD o booleano) */
    releaseDate: string | boolean;

    /** Fecha de fin de vida/End of Life (YYYY-MM-DD o booleano) */
    eol: string | boolean;

    /** Fecha de fin de soporte (YYYY-MM-DD o booleano) */
    support?: string | boolean;

    /** Indicador de versión LTS */
    lts?: string | boolean;

    /** Link a información adicional */
    link?: string;

    /** Última versión de Java soportada */
    latestReleaseDate?: string;

    /** Soporte extendido */
    extendedSupport?: string | boolean;
}

export interface TechDetailDto {
    /** Nombre de la tecnología */
    name: string;

    /** Label/título de la tecnología */
    label: string;

    /** Categoría (framework, lang, etc) */
    category: 'framework' | 'lang';

    /** Descripción */
    description: string;

    /** Total de versiones */
    totalVersions: number;

    /** Cantidad de versiones activas/LTS */
    activeVersions: number;

    /** Última versión disponible */
    latestVersion: string;

    /** Ciclos/versiones de la tecnología */
    cycles: TechCycleDto[];

    /** Link a endoflife.date */
    endOfLifeLink: string;
}

export interface TechVersionStatus {
    type: 'active' | 'deprecated' | 'eol';
    label: string;
    color: 'success' | 'warning' | 'error';
}
