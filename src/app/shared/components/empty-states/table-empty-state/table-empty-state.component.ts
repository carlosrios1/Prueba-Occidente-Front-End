import { Component, inject, Input, signal } from '@angular/core';
import { ButtonComponent } from "../../buttons/button/button.component";
import { LucideIconData, LucideAngularModule, Clipboard } from 'lucide-angular';
import { CardComponent } from "../../cards/card/card.component";
import { CardBodyComponent } from "../../cards/card/components/card-body.component";

interface TableEmptyState {
    label: string;
    action: () => void;
    icon: LucideIconData | null;
}

@Component({
    selector: 'app-table-empty-state',
    standalone: true,
    imports: [ButtonComponent, LucideAngularModule, CardComponent, CardBodyComponent],
    templateUrl: './table-empty-state.component.html'
})
export class TableEmptyStateComponent {
    @Input() icon: LucideIconData = Clipboard;
    @Input() title: string = 'No hay datos disponibles';
    @Input() description: string = 'Actualmente no hay datos para mostrar en esta tabla.';
    @Input() action: TableEmptyState | null = {
        label: 'Agregar Primer Servidor',
        action: () => { },
        icon: null
    };
}
