import { Injectable, inject, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { GiveawaySummary } from '../models/giveaway.model';
import { CreateGiveawayRequest, UpdateGiveawayRequest } from '../models/giveaway-requests.model';
import { GiveawaysHttpService } from './giveaways-http.service';

const PAGE_SIZE = 5;

@Injectable({ providedIn: 'root' })
export class GiveawaysStateService {
    private http = inject(GiveawaysHttpService);

    private _giveaways = signal<GiveawaySummary[]>([]);
    private _isLoading = signal(false);
    private _isSaving = signal(false);
    private _isDeleting = signal(false);
    private _currentPage = signal(1);
    private _totalCount = signal(0);
    private _lastErrorMessage = signal<string | null>(null);

    readonly giveaways = this._giveaways.asReadonly();
    readonly isLoading = this._isLoading.asReadonly();
    readonly isSaving = this._isSaving.asReadonly();
    readonly isDeleting = this._isDeleting.asReadonly();
    readonly currentPage = this._currentPage.asReadonly();
    readonly totalCount = this._totalCount.asReadonly();
    readonly lastErrorMessage = this._lastErrorMessage.asReadonly();
    readonly pageSize = PAGE_SIZE;

    readonly totalPages = computed(() =>
        Math.max(1, Math.ceil(this._totalCount() / PAGE_SIZE))
    );

    async loadPage(page: number = 1): Promise<void> {
        this._isLoading.set(true);
        this._currentPage.set(page);
        try {
            const data = await firstValueFrom(this.http.getAll(page, PAGE_SIZE));
            this._giveaways.set(data.items);
            this._totalCount.set(data.totalCount);
        } finally {
            this._isLoading.set(false);
        }
    }

    async create(request: CreateGiveawayRequest): Promise<boolean> {
        this._lastErrorMessage.set(null);
        this._isSaving.set(true);
        try {
            await firstValueFrom(this.http.create(request));
            await this.loadPage(this._currentPage());
            return true;
        } catch (e: any) {
            this._lastErrorMessage.set(e?.error?.Message ?? e?.error?.message ?? null);
            return false;
        } finally {
            this._isSaving.set(false);
        }
    }

    async update(id: number, request: UpdateGiveawayRequest): Promise<boolean> {
        this._lastErrorMessage.set(null);
        this._isSaving.set(true);
        try {
            await firstValueFrom(this.http.update(id, request));
            await this.loadPage(this._currentPage());
            return true;
        } catch (e: any) {
            this._lastErrorMessage.set(e?.error?.Message ?? e?.error?.message ?? null);
            return false;
        } finally {
            this._isSaving.set(false);
        }
    }

    async delete(id: number): Promise<boolean> {
        this._lastErrorMessage.set(null);
        this._isDeleting.set(true);
        try {
            await firstValueFrom(this.http.delete(id));
            const newTotal = this._totalCount() - 1;
            const maxPage = Math.max(1, Math.ceil(newTotal / PAGE_SIZE));
            const safePage = Math.min(this._currentPage(), maxPage);
            await this.loadPage(safePage);
            return true;
        } catch (e: any) {
            this._lastErrorMessage.set(e?.error?.Message ?? e?.error?.message ?? null);
            return false;
        } finally {
            this._isDeleting.set(false);
        }
    }
}
