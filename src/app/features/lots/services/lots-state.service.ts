import { inject, Injectable, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { LotsHttpService } from './lots-http.service';
import { Lot } from '../models/dtos/lot.dto';
import { Transaction } from '../models/dtos/transaction.dto';

export interface LotsState {
    // Lotes
    lots: Lot[];
    lotsPage: number;
    lotsPageSize: number;
    lotsTotalCount: number;
    isLoadingLots: boolean;

    // Transacciones
    transactions: Transaction[];
    transPage: number;
    transPageSize: number;
    transTotalCount: number;
    isLoadingTransactions: boolean;

    // Upload
    isUploading: boolean;
    uploadError: string | null;
    error: string | null;
}

@Injectable()
export class LotsStateService {
    private http = inject(LotsHttpService);

    private _state = signal<LotsState>({
        lots: [],
        lotsPage: 1,
        lotsPageSize: 10,
        lotsTotalCount: 0,
        isLoadingLots: false,
        transactions: [],
        transPage: 1,
        transPageSize: 10,
        transTotalCount: 0,
        isLoadingTransactions: false,
        isUploading: false,
        uploadError: null,
        error: null,
    });

    readonly state = this._state.asReadonly();

    // Signals derivadas
    readonly lots = computed(() => this._state().lots);
    readonly lotsPage = computed(() => this._state().lotsPage);
    readonly lotsPageSize = computed(() => this._state().lotsPageSize);
    readonly lotsTotalCount = computed(() => this._state().lotsTotalCount);
    readonly isLoadingLots = computed(() => this._state().isLoadingLots);

    readonly transactions = computed(() => this._state().transactions);
    readonly transPage = computed(() => this._state().transPage);
    readonly transPageSize = computed(() => this._state().transPageSize);
    readonly transTotalCount = computed(() => this._state().transTotalCount);
    readonly isLoadingTransactions = computed(() => this._state().isLoadingTransactions);

    readonly isUploading = computed(() => this._state().isUploading);
    readonly uploadError = computed(() => this._state().uploadError);
    readonly error = computed(() => this._state().error);

    private patch(partial: Partial<LotsState>): void {
        this._state.update(s => ({ ...s, ...partial }));
    }

    async loadLots(page = 1, pageSize = 5): Promise<void> {
        this.patch({ isLoadingLots: true, error: null });
        try {
            const res = await firstValueFrom(this.http.getLots(page, pageSize));
            if (res.success) {
                this.patch({
                    lots: res.data.items,
                    lotsPage: res.data.page,
                    lotsPageSize: res.data.pageSize,
                    lotsTotalCount: res.data.totalCount,
                });
            } else {
                this.patch({ error: res.message });
            }
        } catch (err) {
            const msg = err instanceof HttpErrorResponse ? (err.error?.Message ?? err.error?.message ?? err.message) : 'Error al cargar lotes';
            this.patch({ error: msg });
        } finally {
            this.patch({ isLoadingLots: false });
        }
    }

    async loadTransactions(page = 1, pageSize = 5): Promise<void> {
        this.patch({ isLoadingTransactions: true, error: null });
        try {
            const res = await firstValueFrom(this.http.getTransactions(page, pageSize));
            if (res.success) {
                this.patch({
                    transactions: res.data.items,
                    transPage: res.data.page,
                    transPageSize: res.data.pageSize,
                    transTotalCount: res.data.totalCount,
                });
            } else {
                this.patch({ error: res.message });
            }
        } catch (err) {
            const msg = err instanceof HttpErrorResponse ? (err.error?.Message ?? err.error?.message ?? err.message) : 'Error al cargar transacciones';
            this.patch({ error: msg });
        } finally {
            this.patch({ isLoadingTransactions: false });
        }
    }

    async uploadLot(file: File): Promise<boolean> {
        this.patch({ isUploading: true, uploadError: null });
        try {
            const res = await firstValueFrom(this.http.uploadLot(file));
            if (res.success) {
                // Recargar ambas tablas tras la subida
                await Promise.all([this.loadLots(), this.loadTransactions()]);
                return true;
            } else {
                this.patch({ uploadError: res.message });
                return false;
            }
        } catch (err) {
            const msg = err instanceof HttpErrorResponse ? (err.error?.Message ?? err.error?.message ?? err.message) : 'Error al subir el archivo';
            this.patch({ uploadError: msg });
            return false;
        } finally {
            this.patch({ isUploading: false });
        }
    }
}
