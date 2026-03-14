import { Injectable, inject, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { GetAllTechsRequest } from '../models/requests/get-all-techs.request';
import { AvailableProduct, TechHttpService } from './tech-http.service';
import { TechSummaryDto } from '../models/dtos/tech-environment.dto';
import { TechCycleDto, TechDetailDto } from '../models/dtos/tech-detail.dto';


export interface TechDetailState {
    techDetail: TechDetailDto | null;
    cycles: TechCycleDto[];
    isLoadingDetail: boolean;
    detailError: string | null;
    selectedTechName: string | null;
}

export interface TechsState {
    techs: TechSummaryDto[];
    products: AvailableProduct[];
    isLoading: boolean;        // Carga inicial completa
    isPaginating: boolean;     // Cambio de página
    isFiltering: boolean;      // Aplicando filtros
    error: string | null;

    // Paginación
    currentPage: number;
    pageSize: number;
    totalElements: number;

    // Filtros
    filters: {
        nombre?: string;
        fabricante?: string;
        tipoId?: number;
    };

    lastFetchTimestamp: number | null;
    cacheValidityMs: number; // ej: 5 * 60 * 1000 (5 minutos)
}

@Injectable({
    providedIn: 'root'
})
export class TechStateService {
    private techHttpService = inject(TechHttpService);

    // Estado privado
    private state = signal<TechsState & { detail: TechDetailState }>({
        techs: [],
        products: [],
        isLoading: false,
        isPaginating: false,
        isFiltering: false,
        error: null,
        currentPage: 1,
        pageSize: 10,
        totalElements: 0,
        filters: {},
        cacheValidityMs: 5 * 60 * 1000, // 5 minutos
        lastFetchTimestamp: null,
        // Estado de detalle
        detail: {
            techDetail: null,
            cycles: [],
            isLoadingDetail: false,
            detailError: null,
            selectedTechName: null
        }
    });

    // En el servicio, agregar método helper
    isCacheValid = computed(() => {
        const state = this.state();
        if (!state.lastFetchTimestamp) return false;

        const now = Date.now();
        const timeSinceLastFetch = now - state.lastFetchTimestamp;

        return timeSinceLastFetch < state.cacheValidityMs;
    });

    // Selectores públicos (computed signals)
    techs = computed(() => this.state().techs);
    products = computed(() => this.state().products);
    isLoading = computed(() => this.state().isLoading);
    isPaginating = computed(() => this.state().isPaginating);
    isFiltering = computed(() => this.state().isFiltering);
    error = computed(() => this.state().error);
    currentPage = computed(() => this.state().currentPage);
    pageSize = computed(() => this.state().pageSize);
    totalElements = computed(() => this.state().totalElements);
    filters = computed(() => this.state().filters);

    // Computed adicionales útiles
    isAnyLoading = computed(() =>
        this.state().isLoading || this.state().isPaginating || this.state().isFiltering
    );

    // Computed adicionales útiles
    totalPages = computed(() =>
        Math.ceil(this.state().totalElements / this.state().pageSize)
    );

    hasNextPage = computed(() =>
        this.state().currentPage < this.totalPages()
    );

    hasPreviousPage = computed(() =>
        this.state().currentPage > 1
    );

    isEmpty = computed(() =>
        !this.state().isLoading && this.state().techs.length === 0
    );

    // ============================================
    // DETAIL SELECTORS
    // ============================================
    techDetail = computed(() => this.state().detail.techDetail);
    cycles = computed(() => this.state().detail.cycles);
    isLoadingDetail = computed(() => this.state().detail.isLoadingDetail);
    detailError = computed(() => this.state().detail.detailError);
    selectedTechName = computed(() => this.state().detail.selectedTechName);

    // Computed para estadísticas del detalle
    totalVersions = computed(() => this.state().detail.cycles.length);
    activeVersionsCount = computed(() => {
        const now = new Date();
        return this.state().detail.cycles.filter(cycle => {
            if (typeof cycle.eol === 'boolean') return !cycle.eol;
            if (!cycle.eol) return true;
            return new Date(cycle.eol) > now;
        }).length;
    });
    latestVersion = computed(() => {
        const cycles = this.state().detail.cycles;
        return cycles.length > 0 ? cycles[0].latest : '-';
    });

    // ============================================
    // LIST ACTIONS
    // ============================================

    /**
     * Carga todos los sistemas operativos con los filtros actuales
     */
    async loadTechs(loadType: 'initial' | 'paginate' | 'filter' = 'paginate'): Promise<void> {
        try {
            // Setear el loading apropiado según el tipo
            if (loadType === 'initial') {
                this.updateState({ isLoading: true, error: null });
            } else if (loadType === 'paginate') {
                this.updateState({ isPaginating: true, error: null });
            } else if (loadType === 'filter') {
                this.updateState({ isFiltering: true, error: null });
            }

            const request: GetAllTechsRequest = {
                pagina: this.state().currentPage,
                cantidadPagina: this.state().pageSize,
                ...this.state().filters
            };

            const response = await firstValueFrom(
                this.techHttpService.getAllTechs(request)
            );

            if (response.success) {
                this.updateState({
                    techs: response.data.elementos,
                    totalElements: response.data.totalElementos,
                    lastFetchTimestamp: Date.now(),
                    isLoading: false,
                    isPaginating: false,
                    isFiltering: false
                });
            } else {
                this.updateState({
                    error: response.message || 'Error al cargar sistemas operativos',
                    isLoading: false,
                    isPaginating: false,
                    isFiltering: false
                });
            }
        } catch (error) {
            this.updateState({
                error: 'Error al cargar sistemas operativos',
                isLoading: false,
                isPaginating: false,
                isFiltering: false
            });
            console.error('Error loading operating systems:', error);
        }
    }

    async loadProductos(): Promise<void> {
        try {
            const response = await firstValueFrom(
                this.techHttpService.getTechsFromEndOfLife()
            );

            this.updateState({
                products: response,
            });
        } catch (error) {
            this.updateState({
                error: 'Error al cargar sistemas operativos',
                isLoading: false,
                isPaginating: false,
                isFiltering: false
            });
            console.error('Error loading operating systems:', error);
        }
    }

    /**
     * Establece filtros y recarga desde la página 1
     */
    async setFilters(filters: Partial<TechsState['filters']>): Promise<void> {
        this.updateState({
            filters: { ...this.state().filters, ...filters },
            currentPage: 1 // Reset a página 1 cuando cambian filtros
        });
        await this.loadTechs('filter'); // Usar isFiltering
    }

    /**
     * Limpia todos los filtros
     */
    async clearFilters(): Promise<void> {
        this.updateState({
            filters: {},
            currentPage: 1
        });
        await this.loadTechs('filter'); // Usar isFiltering
    }

    /**
     * Cambia de página
     */
    async goToPage(page: number): Promise<void> {
        if (page < 1 || page > this.totalPages()) {
            return;
        }
        this.updateState({ currentPage: page });
        await this.loadTechs('paginate'); // Usar isPaginating
    }

    /**
     * Página siguiente
     */
    async nextPage(): Promise<void> {
        if (this.hasNextPage()) {
            await this.goToPage(this.state().currentPage + 1);
        }
    }

    /**
     * Página anterior
     */
    async previousPage(): Promise<void> {
        if (this.hasPreviousPage()) {
            await this.goToPage(this.state().currentPage - 1);
        }
    }

    /**
     * Cambia el tamaño de página
     */
    async setPageSize(pageSize: number): Promise<void> {
        this.updateState({
            pageSize,
            currentPage: 1 // Reset a página 1
        });
        await this.loadTechs('paginate'); // Usar isPaginating
    }

    /**
     * Crea un nuevo entorno de desarrollo
     */
    async createTech(data: any): Promise<boolean> {
        try {
            this.updateState({ isPaginating: true, error: null });

            const response = await firstValueFrom(
                this.techHttpService.createTech(data)
            );

            if (response.success) {
                // Recargar lista después de crear
                await this.loadTechs('paginate');
                return true;
            } else {
                this.updateState({
                    error: response.message || 'Error al crear sistema operativo',
                    isPaginating: false
                });
                return false;
            }
        } catch (error) {
            this.updateState({
                error: 'Error al crear sistema operativo',
                isPaginating: false
            });
            console.error('Error creating operating system:', error);
            return false;
        }
    }

    /**
     * Actualiza un entorno de desarrollo existente
     */
    async updateTech(id: number, data: any): Promise<boolean> {
        try {
            this.updateState({ isLoading: true, error: null });

            const response = await firstValueFrom(
                this.techHttpService.updateTech(id, data)
            );

            if (response.success) {
                // Recargar lista después de actualizar
                await this.loadTechs('paginate');
                return true;
            } else {
                this.updateState({
                    error: response.message || 'Error al actualizar sistema operativo',
                    isLoading: false
                });
                return false;
            }
        } catch (error) {
            this.updateState({
                error: 'Error al actualizar sistema operativo',
                isLoading: false
            });
            console.error('Error updating operating system:', error);
            return false;
        }
    }

    /**
     * Elimina un entorno de desarrollo
     */
    async deleteTech(id: number): Promise<boolean> {
        try {
            this.updateState({ isLoading: true, error: null });

            const response = await firstValueFrom(
                this.techHttpService.deleteTech(id)
            );

            if (response.success) {
                // Recargar lista después de eliminar
                await this.loadTechs('paginate');
                return true;
            } else {
                this.updateState({
                    error: response.message || 'Error al eliminar sistema operativo',
                    isLoading: false
                });
                return false;
            }
        } catch (error) {
            this.updateState({
                error: 'Error al eliminar sistema operativo',
                isLoading: false
            });
            console.error('Error deleting operating system:', error);
            return false;
        }
    }

    /**
     * Resetea el estado completo
     */
    reset(): void {
        this.state.set({
            techs: [],
            products: [],
            isLoading: false,
            isPaginating: false,
            isFiltering: false,
            error: null,
            currentPage: 1,
            pageSize: 10,
            totalElements: 0,
            filters: {},
            lastFetchTimestamp: null,
            cacheValidityMs: 5 * 60 * 1000,
            detail: {
                techDetail: null,
                cycles: [],
                isLoadingDetail: false,
                detailError: null,
                selectedTechName: null
            }
        });
    }

    // ============================================
    // DETAIL ACTIONS
    // ============================================

    /**
     * Carga los detalles de una tecnología desde endoflife.date
     * @param techName - Nombre de la tecnología (slug de endoflife.date)
     * @param label - Etiqueta/título de la tecnología
     * @param category - Categoría de la tecnología
     */
    async loadTechDetail(techName: string, label: string, category: 'framework' | 'lang' = 'framework'): Promise<void> {
        try {
            this.updateState({
                detail: {
                    ...this.state().detail,
                    isLoadingDetail: true,
                    detailError: null,
                    selectedTechName: techName
                }
            });

            const cycles = await firstValueFrom(
                this.techHttpService.getTechDetailFromEndOfLife(techName)
            );

            // Construir el objeto TechDetailDto
            const techDetail: TechDetailDto = {
                name: techName,
                label: label,
                category: category,
                description: this.getDescription(techName, category),
                totalVersions: cycles.length,
                activeVersions: this.calculateActiveVersions(cycles),
                latestVersion: cycles.length > 0 ? cycles[0].latest : '-',
                cycles: cycles,
                endOfLifeLink: `https://endoflife.date/${techName}`
            };

            this.updateState({
                detail: {
                    techDetail: techDetail,
                    cycles: cycles,
                    isLoadingDetail: false,
                    detailError: null,
                    selectedTechName: techName
                }
            });
        } catch (error) {
            this.updateState({
                detail: {
                    ...this.state().detail,
                    isLoadingDetail: false,
                    detailError: 'Error al cargar detalles de la tecnología'
                }
            });
            console.error('Error loading tech detail:', error);
        }
    }

    /**
     * Limpia el estado de detalle
     */
    clearDetail(): void {
        this.updateState({
            detail: {
                techDetail: null,
                cycles: [],
                isLoadingDetail: false,
                detailError: null,
                selectedTechName: null
            }
        });
    }

    /**
     * Resetea los datos de detalle (sin cambiar selectedTechName)
     * Útil cuando cambias de tecnología y quieres mostrar skeleton
     */
    resetDetailData(): void {
        this.updateState({
            detail: {
                ...this.state().detail,
                techDetail: null,
                cycles: []
            }
        });
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    private calculateActiveVersions(cycles: TechCycleDto[]): number {
        const now = new Date();
        return cycles.filter(cycle => {
            if (typeof cycle.eol === 'boolean') return !cycle.eol;
            if (!cycle.eol) return true;
            return new Date(cycle.eol) > now;
        }).length;
    }

    private getDescription(techName: string, category: string): string {
        const descriptions: Record<string, string> = {
            'angular': 'Framework de desarrollo web basado en TypeScript mantenido por Google',
            'dotnet': 'Plataforma de desarrollo multiplataforma de Microsoft',
            'python': 'Lenguaje de programación interpretado de alto nivel',
            'nodejs': 'Entorno de ejecución para JavaScript del lado del servidor',
            'react': 'Biblioteca de JavaScript para construir interfaces de usuario',
            'vue': 'Framework progresivo de JavaScript para construir interfaces de usuario'
        };

        return descriptions[techName.toLowerCase()] ||
            `${category === 'framework' ? 'Framework' : 'Lenguaje'} de desarrollo de software`;
    }

    // =========================
    // HELPER PRIVADO
    // =========================
    private updateState(partial: Partial<TechsState & { detail: TechDetailState }>): void {
        this.state.update(state => ({ ...state, ...partial }));
    }
}