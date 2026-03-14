import { Component, Input, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechCycleDto, TechVersionStatus } from '@features/technologies/models/dtos/tech-detail.dto';
import { TechVersionTableComponent } from '../tech-version-table/tech-version-table.component';
import { TechVersionFiltersComponent } from '../tech-version-filters/tech-version-filters.component';
import { TableEmptyStateComponent } from '@shared/components/empty-states/table-empty-state/table-empty-state.component';
import { TablePaginationComponent } from '@shared/components/tables/pagination/table-pagination.component';
import { CardComponent } from '@shared/components/cards/card/card.component';
import { CardBodyComponent } from '@shared/components/cards/card/components/card-body.component';
import { GitBranch, SearchX, Trash } from 'lucide-angular';
import { PaginationService } from '@shared/pagination.service';

@Component({
    selector: 'app-tech-version-table-section',
    standalone: true,
    imports: [
        CommonModule,
        TechVersionTableComponent,
        TechVersionFiltersComponent,
        TableEmptyStateComponent,
        TablePaginationComponent,
        CardComponent,
        CardBodyComponent
    ],
    providers: [PaginationService],
    templateUrl: './tech-version-table-section.component.html'
})
export class TechVersionTableSectionComponent {
    @Input() cycles: TechCycleDto[] = [];
    @Input() getVersionStatus: (cycle: TechCycleDto) => TechVersionStatus = () => ({
        type: 'active',
        label: 'Activo',
        color: 'success'
    });
    @Input() formatDate: (date: string | boolean | undefined) => string = () => '-';

    paginationService = inject(PaginationService);

    searchTerm = signal('');

    filteredCycles = computed(() => {
        const search = this.searchTerm().toLowerCase();
        if (!search) return this.cycles;
        return this.cycles.filter(cycle =>
            cycle.cycle.toLowerCase().includes(search) ||
            cycle.latest.toLowerCase().includes(search)
        );
    });

    pagedCycles = computed(() => {
        const page = this.paginationService.actualPage();
        const perPage = this.paginationService.itemsPerPage();
        const filtered = this.filteredCycles();
        const start = (page - 1) * perPage;
        return filtered.slice(start, start + perPage);
    });

    readonly icons = { GitBranch, SearchX, Trash };

    constructor() {
        effect(() => {
            this.searchTerm();
            this.paginationService.goToPage(1);
        });
    }

    onSearchChange(value: string): void {
        this.searchTerm.set(value);
    }

    clearSearch = () => {
        this.searchTerm.set('');
    };
}
