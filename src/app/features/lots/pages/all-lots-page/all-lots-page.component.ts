import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Upload, ArrowLeft, ChevronRight } from 'lucide-angular';
import { PageBodyLayoutComponent } from '@shared/components/page-body-layout/page-body-layout.component';
import { PageHeaderComponent } from '@shared/components/header/app-page-header-component';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { TableCellDirective } from '@shared/directives/table-cell.directive';
import { TablePaginationComponent } from '@shared/components/tables/pagination/table-pagination.component';
import { PaginationService } from '@shared/pagination.service';
import { LotsHttpService } from '../../services/lots-http.service';
import { LotsStateService } from '../../services/lots-state.service';
import { LotUploadComponent } from '../../components/lot-upload/lot-upload.component';
import { Lot } from '../../models/dtos/lot.dto';

@Component({
    selector: 'app-all-lots-page',
    standalone: true,
    imports: [
        CommonModule,
        LucideAngularModule,
        PageBodyLayoutComponent,
        PageHeaderComponent,
        ButtonComponent,
        ModalComponent,
        BadgeComponent,
        TableCellDirective,
        TablePaginationComponent,
        LotUploadComponent,
    ],
    providers: [LotsHttpService, LotsStateService, PaginationService],
    templateUrl: './all-lots-page.component.html'
})
export class AllLotsPageComponent implements OnInit {
    private router = inject(Router);
    readonly state = inject(LotsStateService);
    readonly pagination = inject(PaginationService);

    modals: Record<string, boolean> = {};
    selectedFile = signal<File | null>(null);

    openModal(key: string): void { this.modals[key] = true; }
    closeModal(key: string): void { this.modals[key] = false; }
    isModalOpen(key: string): boolean { return !!this.modals[key]; }

    readonly icons = { Upload, ArrowLeft, ChevronRight };
    readonly headers = ['ID', 'Archivo', 'Fecha carga', 'Registros', 'Estado', 'Usuario', ''];

    ngOnInit(): void {
        this.pagination.itemsPerPage.set(5);
        this.loadPage(1);
    }

    async loadPage(page: number): Promise<void> {
        await this.state.loadLots(page, this.pagination.itemsPerPage());
        this.pagination.totalItems.set(this.state.lotsTotalCount());
        this.pagination.actualPage.set(page);
    }

    onPageChange(page: number): void {
        this.loadPage(page);
    }

    onUploaded(): void {
        this.closeModal('upload');
        this.loadPage(1);
    }

    onFileChange(file: File | null): void {
        this.selectedFile.set(file);
    }

    async onUploadConfirm(): Promise<void> {
        const file = this.selectedFile();
        if (!file) return;
        const ok = await this.state.uploadLot(file);
        if (ok) {
            this.selectedFile.set(null);
            this.closeModal('upload');
            this.loadPage(1);
        }
    }

    goBack(): void {
        this.router.navigate(['/lots']);
    }
}
