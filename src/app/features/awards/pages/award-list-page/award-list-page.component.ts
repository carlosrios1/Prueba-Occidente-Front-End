import { Component, inject, OnInit, signal } from '@angular/core';
import { LucideAngularModule, Plus } from 'lucide-angular';

import { PageBodyLayoutComponent } from '@shared/components/page-body-layout/page-body-layout.component';
import { PageHeaderComponent } from '@shared/components/header/app-page-header-component';
import { CardComponent } from '@shared/components/cards/card/card.component';
import { CardBodyComponent } from '@shared/components/cards/card/components/card-body.component';
import { TablePaginationComponent } from '@shared/components/tables/pagination/table-pagination.component';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';

import { AwardsStateService } from '../../services/awards-state.service';
import { AwardTableComponent } from '../../components/award-table/award-table.component';
import { AwardFormModalComponent } from '../../components/award-form-modal/award-form-modal.component';
import { AwardDeleteModalComponent } from '../../components/award-delete-modal/award-delete-modal.component';
import { Award } from '../../models/award.model';

@Component({
    selector: 'app-award-list-page',
    standalone: true,
    imports: [
        LucideAngularModule,
        PageBodyLayoutComponent,
        PageHeaderComponent,
        CardComponent,
        CardBodyComponent,
        TablePaginationComponent,
        ButtonComponent,
        AwardTableComponent,
        AwardFormModalComponent,
        AwardDeleteModalComponent,
    ],
    templateUrl: './award-list-page.component.html',
})
export class AwardListPageComponent implements OnInit {
    protected state = inject(AwardsStateService);

    readonly icons = { Plus };

    // Estado de modales
    isFormModalOpen = signal(false);
    isDeleteModalOpen = signal(false);
    selectedAward = signal<Award | null>(null);

    ngOnInit(): void {
        this.state.loadPage(1);
    }

    openCreateModal(): void {
        this.selectedAward.set(null);
        this.isFormModalOpen.set(true);
    }

    openEditModal(award: Award): void {
        this.selectedAward.set(award);
        this.isFormModalOpen.set(true);
    }

    openDeleteModal(award: Award): void {
        this.selectedAward.set(award);
        this.isDeleteModalOpen.set(true);
    }

    async onPageChange(page: number): Promise<void> {
        await this.state.loadPage(page);
    }
}
