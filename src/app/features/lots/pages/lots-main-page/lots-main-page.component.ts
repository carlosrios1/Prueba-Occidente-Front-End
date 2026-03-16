import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, Upload } from 'lucide-angular';
import { CardComponent } from '@shared/components/cards/card/card.component';
import { CardBodyComponent } from '@shared/components/cards/card/components/card-body.component';
import { PageBodyLayoutComponent } from '@shared/components/page-body-layout/page-body-layout.component';
import { PageHeaderComponent } from '@shared/components/header/app-page-header-component';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { LotsHttpService } from '../../services/lots-http.service';
import { LotsStateService } from '../../services/lots-state.service';
import { LotUploadComponent } from '../../components/lot-upload/lot-upload.component';
import { LotsSummaryTableComponent } from '../../components/lots-summary-table/lots-summary-table.component';
import { TransactionsSummaryTableComponent } from '../../components/transactions-summary-table/transactions-summary-table.component';

@Component({
    selector: 'app-lots-main-page',
    standalone: true,
    imports: [
        LucideAngularModule,
        PageBodyLayoutComponent,
        PageHeaderComponent,
        ButtonComponent,
        ModalComponent,
        LotUploadComponent,
        LotsSummaryTableComponent,
        TransactionsSummaryTableComponent,
        CardComponent,
        CardBodyComponent,
    ],
    providers: [LotsHttpService, LotsStateService],
    templateUrl: './lots-main-page.component.html'
})
export class LotsMainPageComponent implements OnInit {
    private router = inject(Router);
    readonly state = inject(LotsStateService);

    modals: Record<string, boolean> = {};
    selectedFile = signal<File | null>(null);

    openModal(key: string): void { this.modals[key] = true; }
    closeModal(key: string): void { this.modals[key] = false; }
    isModalOpen(key: string): boolean { return !!this.modals[key]; }

    readonly icons = { Upload };

    ngOnInit(): void {
        this.state.loadLots(1, 5);
        this.state.loadTransactions(1, 5);
    }

    openUpload(): void {
        this.selectedFile.set(null);
        this.openModal('upload');
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
            this.state.loadLots(1, 5);
            this.state.loadTransactions(1, 5);
        }
    }

    goToAllLots(): void {
        this.router.navigate(['/lots/all']);
    }

    goToAllTransactions(): void {
        this.router.navigate(['/lots/transactions']);
    }

    goToUpload(): void {
        this.router.navigate(['/lots/upload']);
    }
}
