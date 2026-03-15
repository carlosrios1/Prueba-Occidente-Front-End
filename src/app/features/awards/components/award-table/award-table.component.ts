import { Component, inject, Output, EventEmitter, signal } from '@angular/core';
import { LucideAngularModule, Trophy, ChevronRight, Pencil, Trash2 } from 'lucide-angular';

import { TableCellDirective } from '@shared/directives/table-cell.directive';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { AwardsStateService } from '../../services/awards-state.service';
import { Award } from '../../models/award.model';

@Component({
    selector: 'app-award-table',
    standalone: true,
    imports: [LucideAngularModule, TableCellDirective, ButtonComponent],
    templateUrl: './award-table.component.html',
})
export class AwardTableComponent {
    protected state = inject(AwardsStateService);

    @Output() editAward = new EventEmitter<Award>();
    @Output() deleteAward = new EventEmitter<Award>();

    readonly headers = ['ID', 'Premio', 'Descripción', 'Acciones'];

    readonly icons = { Trophy, ChevronRight, Pencil, Trash2 };
}
