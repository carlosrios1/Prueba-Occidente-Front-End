import { Component, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, FileDown, FileSpreadsheet, ChevronRight } from 'lucide-angular';
import { firstValueFrom } from 'rxjs';

import { PageBodyLayoutComponent } from '@shared/components/page-body-layout/page-body-layout.component';
import { PageHeaderComponent } from '@shared/components/header/app-page-header-component';
import { CardComponent } from '@shared/components/cards/card/card.component';
import { CardBodyComponent } from '@shared/components/cards/card/components/card-body.component';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { TableCellDirective } from '@shared/directives/table-cell.directive';
import { TablePaginationComponent } from '@shared/components/tables/pagination/table-pagination.component';
import { PaginationService } from '@shared/pagination.service';
import { DatePickerComponent } from '@shared/components/date-picker/date-picker.component';
import { InputWrapperComponent } from '@shared/components/form-components/input/input-wrapper/input-wrapper.component';
import { LabelComponent } from '@shared/components/form-components/input/label/label.component';

import { ReportsHttpService } from '../../services/reports-http.service';
import { TransactionReport } from '../../models/transaction-report.model';

const PAGE_SIZE = 5;

@Component({
    selector: 'app-report-transactions-page',
    standalone: true,
    imports: [
        DatePipe,
        DecimalPipe,
        FormsModule,
        LucideAngularModule,
        PageBodyLayoutComponent,
        PageHeaderComponent,
        CardComponent,
        CardBodyComponent,
        ButtonComponent,
        TableCellDirective,
        TablePaginationComponent,
        DatePickerComponent,
        InputWrapperComponent,
        LabelComponent,
    ],
    providers: [PaginationService],
    templateUrl: './report-transactions-page.component.html',
})
export class ReportTransactionsPageComponent {
    private http = inject(ReportsHttpService);
    readonly pagination = inject(PaginationService);

    readonly icons = { Search, FileDown, FileSpreadsheet, ChevronRight };
    readonly headers = ['Fecha', 'Código', 'Cliente', 'Monto', 'Moneda', 'Descripción', 'No. Auth', ''];

    startDate: Date | null = null;
    endDate: Date | null = null;

    items = signal<TransactionReport[]>([]);
    isLoading = signal(false);
    isDownloading = signal(false);
    hasSearched = signal(false);

    get canSearch(): boolean {
        return this.startDate !== null && this.endDate !== null;
    }

    async search(page = 1): Promise<void> {
        if (!this.startDate || !this.endDate) return;
        this.isLoading.set(true);
        try {
            const start = this.toDateStr(this.startDate);
            const end = this.toDateStr(this.endDate);
            const data = await firstValueFrom(
                this.http.getTransactions(start, end, page, PAGE_SIZE),
            );
            this.items.set(data.items);
            this.pagination.totalItems.set(data.totalCount);
            this.pagination.actualPage.set(page);
            this.pagination.itemsPerPage.set(PAGE_SIZE);
            this.hasSearched.set(true);
        } finally {
            this.isLoading.set(false);
        }
    }

    onPageChange(page: number): void {
        this.search(page);
    }

    async downloadExcel(): Promise<void> {
        if (!this.startDate || !this.endDate) return;
        this.isDownloading.set(true);
        try {
            await firstValueFrom(
                this.http.downloadTransactionsExcel(
                    this.toDateStr(this.startDate),
                    this.toDateStr(this.endDate),
                ),
            );
        } finally {
            this.isDownloading.set(false);
        }
    }

    async downloadPdf(): Promise<void> {
        if (!this.startDate || !this.endDate) return;
        this.isDownloading.set(true);
        try {
            await firstValueFrom(
                this.http.downloadTransactionsPdf(
                    this.toDateStr(this.startDate),
                    this.toDateStr(this.endDate),
                ),
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
