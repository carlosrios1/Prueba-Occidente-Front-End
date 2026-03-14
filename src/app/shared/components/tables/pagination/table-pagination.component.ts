import { Component, Input, Output, EventEmitter, computed, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';
import { ButtonComponent } from "../../buttons/button/button.component";

@Component({
    selector: 'app-table-pagination',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, ButtonComponent],
    templateUrl: './table-pagination.component.html'
})
export class TablePaginationComponent {
    // Inputs
    actualPage = input.required<number>();
    cantidadPorPagina = input.required<number>();
    totalItems = input.required<number>();
    loading = input<boolean>(false);
    itemLabel = input<string>('elementos');

    // Output
    @Output() pageChange = new EventEmitter<number>();

    // Icons
    readonly icons = {
        ChevronLeft,
        ChevronRight
    };

    // Computed signals
    totalPages = computed(() =>
        Math.ceil(this.totalItems() / this.cantidadPorPagina())
    );

    startRange = computed(() =>
        (this.actualPage() - 1) * this.cantidadPorPagina() + 1
    );

    endRange = computed(() =>
        Math.min(this.actualPage() * this.cantidadPorPagina(), this.totalItems())
    );

    visiblePages = computed(() => {
        const totalPaginas = this.totalPages();
        const paginaActual = this.actualPage();
        const pages: number[] = [];

        if (totalPaginas <= 5) {
            // Si hay 5 páginas o menos, mostrar todas
            for (let i = 1; i <= totalPaginas; i++) {
                pages.push(i);
            }
        } else {
            // Lógica para mostrar páginas alrededor de la actual
            if (paginaActual <= 3) {
                pages.push(1, 2, 3, 4, 5);
            } else if (paginaActual >= totalPaginas - 2) {
                for (let i = totalPaginas - 4; i <= totalPaginas; i++) {
                    pages.push(i);
                }
            } else {
                for (let i = paginaActual - 2; i <= paginaActual + 2; i++) {
                    pages.push(i);
                }
            }
        }

        return pages;
    });

    // Event handlers
    onPageChange(pagina: number): void {
        if (pagina >= 1 && pagina <= this.totalPages() && pagina !== this.actualPage()) {
            this.pageChange.emit(pagina);
        }
    }

    onPreviousPage(): void {
        if (this.actualPage() > 1) {
            this.pageChange.emit(this.actualPage() - 1);
        }
    }

    onNextPage(): void {
        if (this.actualPage() < this.totalPages()) {
            this.pageChange.emit(this.actualPage() + 1);
        }
    }
}