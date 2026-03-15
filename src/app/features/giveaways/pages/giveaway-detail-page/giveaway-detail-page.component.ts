import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LucideAngularModule, Pencil, Trash2, Play, Plus, RotateCcw, ChevronRight, Users, Trophy, Calendar } from 'lucide-angular';

import { PageBodyLayoutComponent } from '@shared/components/page-body-layout/page-body-layout.component';
import { PageHeaderComponent } from '@shared/components/header/app-page-header-component';
import { CardComponent } from '@shared/components/cards/card/card.component';
import { CardBodyComponent } from '@shared/components/cards/card/components/card-body.component';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';

import { GiveawayDetailStateService } from '../../services/giveaway-detail-state.service';
import { GiveawayAwardTableComponent } from '../../components/giveaway-award-table/giveaway-award-table.component';
import { GiveawayAwardFormModalComponent } from '../../components/giveaway-award-form-modal/giveaway-award-form-modal.component';
import { GiveawayAwardDeleteModalComponent } from '../../components/giveaway-award-delete-modal/giveaway-award-delete-modal.component';
import { RunGiveawayModalComponent } from '../../components/run-giveaway-modal/run-giveaway-modal.component';
import { ReconfigureAwardsModalComponent } from '../../components/reconfigure-awards-modal/reconfigure-awards-modal.component';

// Modales del listado para editar/eliminar el sorteo desde el detalle
import { GiveawayFormModalComponent } from '../../components/giveaway-form-modal/giveaway-form-modal.component';
import { GiveawayDeleteModalComponent } from '../../components/giveaway-delete-modal/giveaway-delete-modal.component';
import { GiveawaysStateService } from '../../services/giveaways-state.service';

import { GiveawayAward } from '../../models/giveaway.model';
import { GiveawaySummary } from '../../models/giveaway.model';
import { RunGiveawayResponse } from '../../models/giveaway-responses.model';

@Component({
    selector: 'app-giveaway-detail-page',
    standalone: true,
    imports: [
        DatePipe,
        LucideAngularModule,
        PageBodyLayoutComponent,
        PageHeaderComponent,
        CardComponent,
        CardBodyComponent,
        ButtonComponent,
        BadgeComponent,
        GiveawayAwardTableComponent,
        GiveawayAwardFormModalComponent,
        GiveawayAwardDeleteModalComponent,
        RunGiveawayModalComponent,
        ReconfigureAwardsModalComponent,
        GiveawayFormModalComponent,
        GiveawayDeleteModalComponent,
    ],
    providers: [GiveawayDetailStateService],
    templateUrl: './giveaway-detail-page.component.html',
})
export class GiveawayDetailPageComponent implements OnInit {
    protected detailState = inject(GiveawayDetailStateService);
    protected listState = inject(GiveawaysStateService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    readonly icons = { Pencil, Trash2, Play, Plus, RotateCcw, ChevronRight, Users, Trophy, Calendar };

    // Modales
    isRunModalOpen = signal(false);
    isAwardFormModalOpen = signal(false);
    isAwardDeleteModalOpen = signal(false);
    isReconfigureModalOpen = signal(false);
    isEditGiveawayModalOpen = signal(false);
    isDeleteGiveawayModalOpen = signal(false);

    selectedAward = signal<GiveawayAward | null>(null);
    runResult = signal<RunGiveawayResponse | null>(null);

    // Para pasar el giveaway al modal de lista (computed evita crear objeto nuevo en cada ciclo)
    readonly giveawayAsSummary = computed<GiveawaySummary | null>(() => {
        const g = this.detailState.giveaway();
        if (!g) return null;
        return {
            id: g.id,
            description: g.description,
            giveawayDate: g.giveawayDate,
            trStartDate: g.trStartDate,
            trEndDate: g.trEndDate,
        };
    });

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
            this.detailState.load(id);
        }
    }

    openRunModal(): void {
        this.runResult.set(null);
        this.isRunModalOpen.set(true);
    }

    openAddAwardModal(): void {
        this.selectedAward.set(null);
        this.isAwardFormModalOpen.set(true);
    }

    openEditAwardModal(award: GiveawayAward): void {
        this.selectedAward.set(award);
        this.isAwardFormModalOpen.set(true);
    }

    openDeleteAwardModal(award: GiveawayAward): void {
        this.selectedAward.set(award);
        this.isAwardDeleteModalOpen.set(true);
    }

    saveAwards(): void {
        this.isReconfigureModalOpen.set(true);
    }

    resetAwards(): void {
        this.detailState.resetLocalAwards();
    }

    openEditGiveaway(): void {
        this.isEditGiveawayModalOpen.set(true);
    }

    openDeleteGiveaway(): void {
        this.isDeleteGiveawayModalOpen.set(true);
    }

    onDeleteSuccess(): void {
        this.router.navigate(['/giveaways']);
    }

    /** Agrupa los ganadores del reporte por nombre de premio */
    get winnersByAward(): Map<string, { clientCode: string; clientName: string }[]> {
        const map = new Map<string, { clientCode: string; clientName: string }[]>();
        for (const w of this.detailState.winners()) {
            const group = map.get(w.awardName) ?? [];
            group.push({ clientCode: w.clientCode, clientName: w.clientName });
            map.set(w.awardName, group);
        }
        return map;
    }

    get winnersByAwardEntries(): [string, { clientCode: string; clientName: string }[]][] {
        return Array.from(this.winnersByAward.entries());
    }
}
