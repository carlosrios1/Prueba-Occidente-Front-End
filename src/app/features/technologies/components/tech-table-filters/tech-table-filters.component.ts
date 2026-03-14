import { Component, inject } from '@angular/core';
import { InputComponent } from '../../../../shared/components/form-components/input/input/input.component';
import { LoaderIcon, LucideAngularModule, Search } from 'lucide-angular';
import { TechStateService } from '@features/technologies/services/tech-state.service';

@Component({
    selector: 'app-tech-table-filters',
    standalone: true,
    imports: [
        InputComponent, LucideAngularModule
    ],
    templateUrl: './tech-table-filters.component.html'
})
export class TechTableFiltersComponent {
    protected techState = inject(TechStateService); // protected para usar en template

    private searchTimeout?: number;

    readonly icons = {
        LoaderIcon,
        Search
    }

    onSearchChange(event: Event): void {
        const value = (event.target as HTMLInputElement).value;

        // Debounce de 300ms para evitar llamadas excesivas
        clearTimeout(this.searchTimeout);
        this.searchTimeout = window.setTimeout(() => {
            this.techState.setFilters({
                nombre: value || undefined
            });
        }, 300);
    }
}