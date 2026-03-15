import { Component, inject, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, Shuffle, ChevronRight, Pencil, Trash2, Play } from 'lucide-angular';
import { DatePipe } from '@angular/common';

import { TableCellDirective } from '@shared/directives/table-cell.directive';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { GiveawaysStateService } from '../../services/giveaways-state.service';
import { GiveawaySummary } from '../../models/giveaway.model';

@Component({
    selector: 'app-giveaway-table',
    standalone: true,
    imports: [LucideAngularModule, TableCellDirective, ButtonComponent, DatePipe],
    templateUrl: './giveaway-table.component.html',
})
export class GiveawayTableComponent {
    protected state = inject(GiveawaysStateService);
    private router = inject(Router);

    @Output() editGiveaway = new EventEmitter<GiveawaySummary>();
    @Output() deleteGiveaway = new EventEmitter<GiveawaySummary>();

    readonly headers = ['ID', 'Descripción', 'Fecha Sorteo', 'Período Transacciones', 'Acciones', ''];
    readonly icons = { Shuffle, ChevronRight, Pencil, Trash2, Play };

    navigateToDetail(id: number): void {
        this.router.navigate(['/giveaways', id]);
    }
}
