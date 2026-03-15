export interface PaginatedData<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
}

/** Extiende la paginación base con campos extra que devuelven los endpoints de reportes */
export interface PaginatedReportData<T> extends PaginatedData<T> {
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}