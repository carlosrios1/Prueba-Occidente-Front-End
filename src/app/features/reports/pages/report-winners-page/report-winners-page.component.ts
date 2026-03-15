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
import { DatePickerComponent } from '@shared/components/date-picker/date-picker.component';
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
        DatePickerComponent,
        InputWrapperComponent,
        LabelComponent,
    ],
    templateUrl: './report-winners-page.component.html',
})
export class ReportWinnersPageComponent {
    private http = inject(ReportsHttpService);

    readonly icons = { Search, FileDown, FileSpreadsheet, Trophy };
    readonly headers = ['Código', 'Cliente', 'Premio', 'Fecha Sorteo', ''];

    giveawayDate: Date | null = null;

    winners = signal<WinnerReport[]>([]);
    isLoading = signal(false);
    isDownloading = signal(false);
    hasSearched = signal(false);

    async search(): Promise<void> {
        if (!this.giveawayDate) return;
        this.isLoading.set(true);
        try {
            const date = this.toDateStr(this.giveawayDate);
            const data = await firstValueFrom(this.http.getWinners(date));
            this.winners.set(data ?? []);
            this.hasSearched.set(true);
        } finally {
            this.isLoading.set(false);
        }
    }

    async downloadExcel(): Promise<void> {
        if (!this.giveawayDate) return;
        this.isDownloading.set(true);
        try {
            await firstValueFrom(
                this.http.downloadWinnersExcel(this.toDateStr(this.giveawayDate)),
            );
        } finally {
            this.isDownloading.set(false);
        }
    }

    async downloadPdf(): Promise<void> {
        if (!this.giveawayDate) return;
        this.isDownloading.set(true);
        try {
            await firstValueFrom(
                this.http.downloadWinnersPdf(this.toDateStr(this.giveawayDate)),
            );
        } finally {
            this.isDownloading.set(false);
        }
    }

    private toDateStr(date: Date): string {
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
}
