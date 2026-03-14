import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '@shared/components/form-components/input/input/input.component';
import { Search } from 'lucide-angular';

@Component({
    selector: 'app-tech-version-filters',
    standalone: true,
    imports: [FormsModule, InputComponent],
    templateUrl: './tech-version-filters.component.html'
})
export class TechVersionFiltersComponent {
    @Input() searchTerm: string = '';
    @Output() searchChange = new EventEmitter<string>();

    readonly icons = { Search };

    onSearchChange(value: string): void {
        this.searchChange.emit(value);
    }
}
