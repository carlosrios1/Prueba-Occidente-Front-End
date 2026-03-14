import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LucideIconData, CheckCircle2, XCircle, AlertTriangle } from 'lucide-angular';
import { TableCellDirective } from '@shared/directives/table-cell.directive';
import { BadgeVariant } from '@shared/components/badge/badge.config';
import { BadgeComponent } from "@shared/components/badge/badge.component";
import { TechCycleDto, TechVersionStatus } from '@features/technologies/models/dtos/tech-detail.dto';

@Component({
    selector: 'app-tech-version-table',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, TableCellDirective, BadgeComponent],
    templateUrl: './tech-version-table.component.html'
})
export class TechVersionTableComponent {
    @Input() filteredCycles: TechCycleDto[] = [];
    @Input() searchTerm: string = '';
    @Input() getVersionStatus: (cycle: TechCycleDto) => TechVersionStatus = () => ({
        type: 'active',
        label: 'Activo',
        color: 'success'
    });
    @Input() formatDate: (date: string | boolean | undefined) => string = () => '-';

    readonly icons = { CheckCircle2, XCircle, AlertTriangle };

    getEolBadgeVariant(cycle: TechCycleDto): BadgeVariant {
        const status = this.getVersionStatus(cycle);

        switch (status.type) {
            case 'eol':
                return 'danger';
            case 'deprecated':
                return 'warning';
            default:
                return 'success';
        }
    }

    getStatusIcon(cycle: TechCycleDto): LucideIconData {
        const status = this.getVersionStatus(cycle);

        switch (status.type) {
            case 'eol':
                return XCircle;
            case 'deprecated':
                return AlertTriangle;
            default:
                return CheckCircle2;
        }
    }
}
