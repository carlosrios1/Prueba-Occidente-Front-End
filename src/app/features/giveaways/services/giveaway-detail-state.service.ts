import { Injectable, inject, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { GiveawayDetail, GiveawayAward, WinnerRecord } from '../models/giveaway.model';
import { CreateGiveawayRequest, UpdateGiveawayRequest } from '../models/giveaway-requests.model';
import { RunGiveawayResponse } from '../models/giveaway-responses.model';
import { GiveawaysHttpService } from './giveaways-http.service';

/**
 * Estado aislado para la página de detalle de un sorteo.
 * Se provee a nivel de componente (providers[] en el page component).
 */
@Injectable()
export class GiveawayDetailStateService {
    private http = inject(GiveawaysHttpService);

    private _giveaway = signal<GiveawayDetail | null>(null);
    private _localAwards = signal<GiveawayAward[]>([]);
    private _winners = signal<WinnerRecord[]>([]);
    private _runResult = signal<RunGiveawayResponse | null>(null);
    private _isLoading = signal(false);
    private _isSaving = signal(false);
    private _isRunning = signal(false);
    private _isLoadingWinners = signal(false);
    private _isReconfiguring = signal(false);

    readonly giveaway = this._giveaway.asReadonly();
    readonly localAwards = this._localAwards.asReadonly();
    readonly winners = this._winners.asReadonly();
    readonly runResult = this._runResult.asReadonly();
    readonly isLoading = this._isLoading.asReadonly();
    readonly isSaving = this._isSaving.asReadonly();
    readonly isRunning = this._isRunning.asReadonly();
    readonly isLoadingWinners = this._isLoadingWinners.asReadonly();
    readonly isReconfiguring = this._isReconfiguring.asReadonly();

    readonly hasWinners = computed(() => this._winners().length > 0);
    readonly hasAwardsChanged = computed(() => {
        const original = this._giveaway()?.awards ?? [];
        const local = this._localAwards();
        if (original.length !== local.length) return true;
        return local.some((a, i) => a.awardId !== original[i]?.awardId || a.winnersQuant !== original[i]?.winnersQuant);
    });

    /** Grupos de ganadores por premio (a partir del run result) */
    readonly runWinnersByAward = computed(() => this._runResult()?.winnersByAward ?? []);

    async load(id: number): Promise<void> {
        this._isLoading.set(true);
        try {
            const giveaway = await firstValueFrom(this.http.getById(id));
            this._giveaway.set(giveaway);
            this._localAwards.set([...giveaway.awards]);
            await this.loadWinners(giveaway.giveawayDate);
        } finally {
            this._isLoading.set(false);
        }
    }

    async loadWinners(giveawayDate: string): Promise<void> {
        this._isLoadingWinners.set(true);
        try {
            const date = giveawayDate.split('T')[0]; // yyyy-MM-dd
            const winners = await firstValueFrom(this.http.getWinners(date));
            this._winners.set(winners ?? []);
        } catch {
            this._winners.set([]);
        } finally {
            this._isLoadingWinners.set(false);
        }
    }

    async updateInfo(request: UpdateGiveawayRequest): Promise<boolean> {
        const id = this._giveaway()?.id;
        if (!id) return false;
        this._isSaving.set(true);
        try {
            await firstValueFrom(this.http.update(id, request));
            await this.load(id);
            return true;
        } catch {
            return false;
        } finally {
            this._isSaving.set(false);
        }
    }

    async run(): Promise<RunGiveawayResponse | null> {
        const id = this._giveaway()?.id;
        if (!id) return null;
        this._isRunning.set(true);
        try {
            const result = await firstValueFrom(this.http.run(id));
            this._runResult.set(result);
            // Recargar ganadores desde el reporte
            await this.loadWinners(this._giveaway()!.giveawayDate);
            return result;
        } catch {
            return null;
        } finally {
            this._isRunning.set(false);
        }
    }

    /** Reconfigurar premios: DELETE sorteo actual + POST con nuevos premios */
    async reconfigureAwards(baseInfo: { description: string; giveawayDate: string; trStartDate: string; trEndDate: string }): Promise<number | null> {
        const id = this._giveaway()?.id;
        if (!id) return null;
        this._isReconfiguring.set(true);
        try {
            await firstValueFrom(this.http.delete(id));
            const request: CreateGiveawayRequest = {
                giveAwayDate: baseInfo.giveawayDate,
                trStartDate: baseInfo.trStartDate,
                trEndDate: baseInfo.trEndDate,
                description: baseInfo.description,
                awards: this._localAwards().map(a => ({
                    awardId: a.awardId,
                    winnersQuant: a.winnersQuant,
                })),
            };
            const created = await firstValueFrom(this.http.create(request));
            return created.giveawayId;
        } catch {
            return null;
        } finally {
            this._isReconfiguring.set(false);
        }
    }

    // ── Local awards management ──────────────────────────────────────────────

    addLocalAward(award: Omit<GiveawayAward, 'id'>): void {
        const existing = this._localAwards().find(a => a.awardId === award.awardId);
        if (existing) return; // evitar duplicados
        this._localAwards.update(list => [...list, { ...award, id: 0 }]);
    }

    updateLocalAward(awardId: number, winnersQuant: number): void {
        this._localAwards.update(list =>
            list.map(a => a.awardId === awardId ? { ...a, winnersQuant } : a)
        );
    }

    removeLocalAward(awardId: number): void {
        this._localAwards.update(list => list.filter(a => a.awardId !== awardId));
    }

    resetLocalAwards(): void {
        this._localAwards.set([...(this._giveaway()?.awards ?? [])]);
    }
}
