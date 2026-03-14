export interface Pagination<T> {
    pagina: number;
    totalElementos: number;
    elementos: T;
    itemsPagina: number;
}