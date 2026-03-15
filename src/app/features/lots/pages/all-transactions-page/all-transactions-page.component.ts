import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';
import { PageBodyLayoutComponent } from '@shared/components/page-body-layout/page-body-layout.component';
import { PageHeaderComponent } from '@shared/components/header/app-page-header-component';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { TableCellDirective } from '@shared/directives/table-cell.directive';
import { TablePaginationComponent } from '@shared/components/tables/pagination/table-pagination.component';
import { PaginationService } from '@shared/pagination.service';
import { LotsHttpService } from '../../services/lots-http.service';
import { LotsStateService } from '../../services/lots-state.service';

@Component({
    selector: 'app-all-transactions-page',
    standalone: true,
    imports: [
        CommonModule,
        LucideAngularModule,
        PageBodyLayoutComponent,
        PageHeaderComponent,
        ButtonComponent,
        TableCellDirective,
        TablePaginationComponent,
    ],
    providers: [LotsHttpService, LotsStateService, PaginationService],
    templateUrl: './all-transactions-page.component.html'
})
export class AllTransactionsPageComponent implements OnInit {
    private router = inject(Router);
    readonly state = inject(LotsStateService);
    readonly pagination = inject(PaginationService);

    readonly icons = { ArrowLeft };
    readonly headers = ['ID', 'Código', 'Cliente', 'Lote', 'Fecha', 'Monto', 'Moneda', 'Descripción', 'No. Auth'];

    ngOnInit(): void {
        this.pagination.itemsPerPage.set(5);
        this.loadPage(1);
    }

    async loadPage(page: number): Promise<void> {
        await this.state.loadTransactions(page, this.pagination.itemsPerPage());
        this.pagination.totalItems.set(this.state.transTotalCount());
        this.pagination.actualPage.set(page);
    }

    onPageChange(page: number): void {
        this.loadPage(page);
    }

    goBack(): void {
        this.router.navigate(['/lots']);
    }
}
