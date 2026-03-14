import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from "@shared/components/cards/variants/stat-card/stat-card.component";
import { ActivitySquare, ChartNetwork, CircleCheck, GitBranch, RefreshCcw } from 'lucide-angular';

@Component({
    selector: 'app-tech-detail-summary',
    standalone: true,
    imports: [CommonModule, StatCardComponent],
    templateUrl: './tech-detail-summary.component.html'
})
export class TechDetailSummaryComponent {
    @Input() total: number | null = 0;
    @Input() active: number | null = 0;
    @Input() latest: string | null = '-';

    readonly icons = {
        GitBranch,
        RefreshCcw,
        CircleCheck
    }
}
