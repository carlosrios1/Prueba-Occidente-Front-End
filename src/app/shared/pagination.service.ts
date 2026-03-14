import { Injectable, signal, computed } from '@angular/core';

@Injectable()
export class PaginationService {
    actualPage = signal(1);
    itemsPerPage = signal(10);
    totalItems = signal(0);

    totalPages = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.itemsPerPage())));

    async goToPage(page: number): Promise<void> {
        if (page !== this.actualPage()) {
            this.actualPage.set(page);
        }
    }

    /**
     * Ajusta la página actual si queda fuera de rango tras un cambio en el total.
     * Retorna la página segura (por si el llamador necesita usarla).
     */
    clampPage(newTotal: number, itemsPerPage?: number): number {
        const perPage = itemsPerPage ?? this.itemsPerPage();
        const maxPage = Math.max(1, Math.ceil(newTotal / perPage));
        const safe = Math.min(this.actualPage(), maxPage);
        if (safe !== this.actualPage()) {
            this.actualPage.set(safe);
        }
        return safe;
    }
}
