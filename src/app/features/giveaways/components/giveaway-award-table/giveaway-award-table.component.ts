import { Component, inject, Output, EventEmitter } from '@angular/core';
import { LucideAngularModule, Trophy, Pencil, Trash2, Users } from 'lucide-angular';

import { TableCellDirective } from '@shared/directives/table-cell.directive';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { GiveawayDetailStateService } from '../../services/giveaway-detail-state.service';
import { GiveawayAward } from '../../models/giveaway.model';

@Component({
    selector: 'app-giveaway-award-table',
    standalone: true,
    imports: [LucideAngularModule, TableCellDirective, ButtonComponent],
    templateUrl: './giveaway-award-table.component.html',
})
export class GiveawayAwardTableComponent {
    protected state = inject(GiveawayDetailStateService);

    @Output() editAward = new EventEmitter<GiveawayAward>();
    @Output() deleteAward = new EventEmitter<GiveawayAward>();

    readonly headers = ['Premio', 'Ganadores', 'Acciones'];
    readonly icons = { Trophy, Pencil, Trash2, Users };
}
