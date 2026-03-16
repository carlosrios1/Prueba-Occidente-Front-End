import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, FileDown, FileSpreadsheet, Trophy } from 'lucide-angular';
import { firstValueFrom } from 'rxjs';

import { PageBodyLayoutComponent } from '@shared/components/page-body-layout/page-body-layout.component';
import { PageHeaderComponent } from '@shared/components/header/app-page-header-component';
import { CardComponent } from '@shared/components/cards/card/card.component';
import { CardBodyComponent } from '@shared/components/cards/card/components/card-body.component';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { TableCellDirective } from '@shared/directives/table-cell.directive';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { InputComponent } from '@shared/components/form-components/input/input/input.component';
import { InputWrapperComponent } from '@shared/components/form-components/input/input-wrapper/input-wrapper.component';
import { LabelComponent } from '@shared/components/form-components/input/label/label.component';

import { ReportsHttpService } from '../../services/reports-http.service';
import { WinnerReport } from '../../models/winner-report.model';

@Component({
    selector: 'app-report-winners-page',
    standalone: true,
    imports: [
        DatePipe,
        FormsModule,
        LucideAngularModule,
        PageBodyLayoutComponent,
        PageHeaderComponent,
        CardComponent,
        CardBodyComponent,
        ButtonComponent,
        TableCellDirective,
        BadgeComponent,
        InputComponent,
        InputWrapperComponent,
        LabelComponent,
    ],
    templateUrl: './report-winners-page.component.html',
})
export class ReportWinnersPageComponent {
    private http = inject(ReportsHttpService);

    readonly icons = { Search, FileDown, FileSpreadsheet, Trophy };
    readonly headers = ['Código', 'Cliente', 'Premio', 'Fecha Sorteo', ''];

    giveawayId: number | null = null;

    winners = signal<WinnerReport[]>([]);
    isLoading = signal(false);
    isDownloading = signal(false);
    hasSearched = signal(false);

    async search(): Promise<void> {
        if (!this.giveawayId) return;
        this.isLoading.set(true);
        try {
            const data = await firstValueFrom(this.http.getWinners(this.giveawayId));
            this.winners.set(data ?? []);
            this.hasSearched.set(true);
        } finally {
            this.isLoading.set(false);
        }
    }

    async downloadExcel(): Promise<void> {
        if (!this.giveawayId) return;
        this.isDownloading.set(true);
        try {
            await firstValueFrom(this.http.downloadWinnersExcel(this.giveawayId));
        } finally {
            this.isDownloading.set(false);
        }
    }

    async downloadPdf(): Promise<void> {
        if (!this.giveawayId) return;
        this.isDownloading.set(true);
        try {
            await firstValueFrom(this.http.downloadWinnersPdf(this.giveawayId));
        } finally {
            this.isDownloading.set(false);
        }
    }
}
