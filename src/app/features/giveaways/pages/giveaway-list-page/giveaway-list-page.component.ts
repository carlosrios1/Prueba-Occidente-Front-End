import { Component, inject, OnInit, signal } from '@angular/core';
import { LucideAngularModule, Plus } from 'lucide-angular';

import { PageBodyLayoutComponent } from '@shared/components/page-body-layout/page-body-layout.component';
import { PageHeaderComponent } from '@shared/components/header/app-page-header-component';
import { CardComponent } from '@shared/components/cards/card/card.component';
import { CardBodyComponent } from '@shared/components/cards/card/components/card-body.component';
import { TablePaginationComponent } from '@shared/components/tables/pagination/table-pagination.component';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';

import { GiveawaysStateService } from '../../services/giveaways-state.service';
import { GiveawayTableComponent } from '../../components/giveaway-table/giveaway-table.component';
import { GiveawayFormModalComponent } from '../../components/giveaway-form-modal/giveaway-form-modal.component';
import { GiveawayDeleteModalComponent } from '../../components/giveaway-delete-modal/giveaway-delete-modal.component';
import { GiveawaySummary } from '../../models/giveaway.model';

@Component({
    selector: 'app-giveaway-list-page',
    standalone: true,
    imports: [
        LucideAngularModule,
        PageBodyLayoutComponent,
        PageHeaderComponent,
        CardComponent,
        CardBodyComponent,
        TablePaginationComponent,
        ButtonComponent,
        GiveawayTableComponent,
        GiveawayFormModalComponent,
        GiveawayDeleteModalComponent,
    ],
    templateUrl: './giveaway-list-page.component.html',
})
export class GiveawayListPageComponent implements OnInit {
    protected state = inject(GiveawaysStateService);

    readonly icons = { Plus };

    isFormModalOpen = signal(false);
    isDeleteModalOpen = signal(false);
    selectedGiveaway = signal<GiveawaySummary | null>(null);

    ngOnInit(): void {
        this.state.loadPage(1);
    }

    openCreateModal(): void {
        this.selectedGiveaway.set(null);
        this.isFormModalOpen.set(true);
    }

    openEditModal(giveaway: GiveawaySummary): void {
        this.selectedGiveaway.set(giveaway);
        this.isFormModalOpen.set(true);
    }

    openDeleteModal(giveaway: GiveawaySummary): void {
        this.selectedGiveaway.set(giveaway);
        this.isDeleteModalOpen.set(true);
    }

    async onPageChange(page: number): Promise<void> {
        await this.state.loadPage(page);
    }
}
