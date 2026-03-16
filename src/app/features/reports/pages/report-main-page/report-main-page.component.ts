import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    LucideAngularModule,
    Filter, FileText, FileDown, FileSpreadsheet, Printer, Trophy, ChevronRight,
} from 'lucide-angular';
import { HttpParams } from '@angular/common/http';

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
import { CustomSelectComponent, SelectOption } from '@shared/components/form-components/input/custom-select/custom-select.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';

import { firstValueFrom } from 'rxjs';
import { GiveawaysHttpService } from '@features/giveaways/services/giveaways-http.service';
import { GiveawaySummary } from '@features/giveaways/models/giveaway.model';
import { ReportsHttpService } from '../../services/reports-http.service';
import { TransactionReport } from '../../models/transaction-report.model';
import { WinnerReport } from '../../models/winner-report.model';

type ReportType = 'winners' | 'transactions';
const PAGE_SIZE = 5;

@Component({
    selector: 'app-report-main-page',
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
        CustomSelectComponent,
        BadgeComponent,
    ],
    providers: [PaginationService],
    templateUrl: './report-main-page.component.html',
})
export class ReportMainPageComponent implements OnInit {
    private reportsHttp = inject(ReportsHttpService);
    private giveawaysHttp = inject(GiveawaysHttpService);
    readonly pagination = inject(PaginationService);

    readonly icons = { Filter, FileText, FileDown, FileSpreadsheet, Printer, Trophy, ChevronRight };
    readonly today = new Date();

    // ── Tipo de reporte ─────────────────────────────────────────────────────
    reportType: ReportType = 'winners';
    readonly reportTypeOptions: SelectOption[] = [
        { value: 'winners', label: 'Ganadores por Sorteo' },
        { value: 'transactions', label: 'Transacciones por Fecha' },
    ];

    // ── Ganadores ────────────────────────────────────────────────────────────
    giveaways = signal<GiveawaySummary[]>([]);
    selectedGiveawayId: number | null = null;

    get giveawayOptions(): SelectOption[] {
        return this.giveaways().map(g => ({
            value: g.id,
            label: `${g.description} — ${this.formatDate(g.giveawayDate)}`,
        }));
    }

    get selectedGiveaway(): GiveawaySummary | null {
        if (!this.selectedGiveawayId) return null;
        return this.giveaways().find(g => g.id === this.selectedGiveawayId) ?? null;
    }

    get selectedGiveawaySubtitle(): string {
        const g = this.selectedGiveaway;
        if (!g) return '';
        return `${g.description} — ${this.formatDate(g.giveawayDate)}`;
    }

    winners = signal<WinnerReport[]>([]);
    readonly winnersHeaders = ['Código', 'Nombre del Cliente', 'Premio', 'Fecha del Sorteo', ''];

    // ── Transacciones ────────────────────────────────────────────────────────
    startDate: Date | null = null;
    endDate: Date | null = null;
    items = signal<TransactionReport[]>([]);
    readonly transactionsHeaders = ['Fecha', 'Código', 'Cliente', 'Monto', 'Moneda', 'Descripción', 'No. Auth', ''];

    get transactionsSubtitle(): string {
        if (!this.startDate || !this.endDate) return '';
        return `Del ${this.toDateStr(this.startDate)} al ${this.toDateStr(this.endDate)}`;
    }

    // ── Estado común ─────────────────────────────────────────────────────────
    isLoading = signal(false);
    isDownloading = signal(false);
    hasGenerated = signal(false);

    get canGenerate(): boolean {
        if (this.reportType === 'winners') return !!this.selectedGiveawayId;
        return !!this.startDate && !!this.endDate;
    }

    async ngOnInit(): Promise<void> {
        const data = await firstValueFrom(this.giveawaysHttp.getAll(1, 100));
        this.giveaways.set(data.items);
    }

    async generate(page = 1): Promise<void> {
        if (!this.canGenerate) return;
        this.isLoading.set(true);
        try {
            if (this.reportType === 'winners') {
                const data = await firstValueFrom(this.reportsHttp.getWinners(this.selectedGiveaway!.id));
                this.winners.set(data ?? []);
            } else {
                const data = await firstValueFrom(
                    this.reportsHttp.getTransactions(
                        this.toDateStr(this.startDate!),
                        this.toDateStr(this.endDate!),
                        page,
                        PAGE_SIZE,
                    ),
                );
                this.items.set(data.items);
                this.pagination.totalItems.set(data.totalCount);
                this.pagination.actualPage.set(page);
                this.pagination.itemsPerPage.set(PAGE_SIZE);
            }
            this.hasGenerated.set(true);
        } finally {
            this.isLoading.set(false);
        }
    }

    onPageChange(page: number): void {
        this.generate(page);
    }

    onReportTypeChange(): void {
        this.hasGenerated.set(false);
        this.winners.set([]);
        this.items.set([]);
        this.selectedGiveawayId = null;
        this.startDate = null;
        this.endDate = null;
    }

    async downloadExcel(): Promise<void> {
        this.isDownloading.set(true);
        try {
            if (this.reportType === 'winners' && this.selectedGiveaway) {
                await firstValueFrom(
                    this.reportsHttp.downloadWinnersExcel(this.selectedGiveaway.id),
                );
            } else if (this.reportType === 'transactions' && this.startDate && this.endDate) {
                await firstValueFrom(
                    this.reportsHttp.downloadTransactionsExcel(
                        this.toDateStr(this.startDate),
                        this.toDateStr(this.endDate),
                    ),
                );
            }
        } finally {
            this.isDownloading.set(false);
        }
    }

    async downloadPdf(): Promise<void> {
        this.isDownloading.set(true);
        try {
            if (this.reportType === 'winners' && this.selectedGiveaway) {
                await firstValueFrom(
                    this.reportsHttp.downloadWinnersPdf(this.selectedGiveaway.id),
                );
            } else if (this.reportType === 'transactions' && this.startDate && this.endDate) {
                await firstValueFrom(
                    this.reportsHttp.downloadTransactionsPdf(
                        this.toDateStr(this.startDate),
                        this.toDateStr(this.endDate),
                    ),
                );
            }
        } finally {
            this.isDownloading.set(false);
        }
    }

    async print(): Promise<void> {
        this.isDownloading.set(true);
        try {
            let params = new HttpParams();
            let type: 'transactions' | 'winners';
            if (this.reportType === 'winners' && this.selectedGiveaway) {
                type = 'winners';
                params = params.set('date', this.toDateStr(new Date(this.selectedGiveaway.giveawayDate)));
            } else if (this.reportType === 'transactions' && this.startDate && this.endDate) {
                type = 'transactions';
                params = params.set('startDate', this.toDateStr(this.startDate))
                    .set('endDate', this.toDateStr(this.endDate));
            } else {
                return;
            }
            const blob = await firstValueFrom(this.reportsHttp.getPdfBlob(type, params));
            const blobUrl = URL.createObjectURL(blob);
            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'position:fixed;width:0;height:0;border:0;visibility:hidden;';
            document.body.appendChild(iframe);
            iframe.onload = () => {
                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();
                setTimeout(() => {
                    document.body.removeChild(iframe);
                    URL.revokeObjectURL(blobUrl);
                }, 60_000);
            };
            iframe.src = blobUrl;
        } finally {
            this.isDownloading.set(false);
        }
    }

    private toDateStr(date: Date): string {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    private formatDate(isoDate: string): string {
        const d = new Date(isoDate);
        const months = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
        ];
        const month = months[d.getUTCMonth()];
        const capitalized = month.charAt(0).toUpperCase() + month.slice(1);
        return `${d.getUTCDate()} de ${capitalized} de ${d.getUTCFullYear()}`;
    }
}
