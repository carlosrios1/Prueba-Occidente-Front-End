import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from "../../../../shared/components/cards/card/card.component";
import { CardBodyComponent } from "../../../../shared/components/cards/card/components/card-body.component";
import { TablePaginationComponent } from "../../../../shared/components/tables/pagination/table-pagination.component";
import { TechTableFiltersComponent } from "../tech-table-filters/tech-table-filters.component";
import { TechTableComponent } from '../tech-table/tech-table.component';
import { TechStateService } from '@features/technologies/services/tech-state.service';

@Component({
    selector: 'app-tech-list',
    standalone: true,
    imports: [
        CardComponent,
        CardBodyComponent,
        TablePaginationComponent,
        TechTableFiltersComponent,
        TechTableComponent
    ],
    templateUrl: './tech-list.component.html'
})
export class TechListComponent implements OnInit {
    // Inyectar el state service
    protected techState = inject(TechStateService);

    ngOnInit() {
        const hasData = this.techState.techs().length > 0;
        const cacheIsValid = this.techState.isCacheValid(); // Exponer como computed
        console.log('Cache is valid:', cacheIsValid);

        if (!hasData) {
            // Primera carga
            this.techState.loadTechs('initial');
        } else if (!cacheIsValid) {
            // Hay datos pero están viejos, actualizar en background
            this.techState.loadTechs('paginate');
        }
        // Si hay datos Y el cache es válido → no hacer nada
    }

    // =========================
    // PAGINACIÓN
    // =========================

    async onPageChange(page: number): Promise<void> {
        // Al paginar usa isPaginating
        await this.techState.goToPage(page);
    }
}