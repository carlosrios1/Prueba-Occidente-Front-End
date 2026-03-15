import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ExternalLink, ChevronRight } from 'lucide-angular';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { TableCellDirective } from '@shared/directives/table-cell.directive';
import { Transaction } from '../../models/dtos/transaction.dto';

@Component({
  selector: 'app-transactions-summary-table',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, ButtonComponent, TableCellDirective],
  template: `
      <div class="flex flex-col">
      <div class="flex items-center justify-between p-5">
        <h2 class="text-base font-semibold text-gray-800 dark:text-white">Últimas transacciones</h2>
        <a routerLink="/lots/transactions">
          <app-button [variant]="'neutral'" [appearance]="'text'" [size]="'small'" [type]="'button'" [icon]="icons.ExternalLink" [iconPosition]="'right'">
            Ver todas
          </app-button>
        </a>
      </div>

      <div class="border-y border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200/60 dark:border-neutral-800">
              @for (h of headers; track $index) {
                <th class="py-3 px-2 text-left text-sm font-medium text-black dark:text-neutral-100 tracking-tight" [class.pl-4]="$index === 0">{{ h }}</th>
              }
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-neutral-800">
            @for (tr of transactions; track tr.id) {
              <tr class="group cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-green-50/30 hover:to-green-50/20 dark:hover:from-green-900/20 dark:hover:to-green-800/10 motion-preset-slide-down motion-duration-300"
                  (click)="rowClick.emit(tr)">
                <td appTableCell variant="first">{{ tr.clientCode }}</td>
                <td appTableCell variant="name">{{ tr.clientName }}</td>
                <td appTableCell>{{ tr.transactionDate | date:'dd/MM/yyyy' }}</td>
                <td appTableCell><span class="font-semibold">{{ tr.amount | number:'1.2-2' }}</span></td>
                <td appTableCell>{{ tr.currency }}</td>
                <td appTableCell>{{ tr.description }}</td>
                <td appTableCell>{{ tr.authNumber }}</td>
                <td appTableCell>
                  <lucide-icon [img]="icons.ChevronRight" class="size-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></lucide-icon>
                </td>
              </tr>
            }
          </tbody>
        </table>
        @if (transactions.length === 0) {
          <div class="py-16 text-center">
            <div class="mx-auto w-16 h-16 bg-gray-100 dark:bg-base-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-gray-400 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">No hay transacciones disponibles</h3>
            <p class="text-sm text-gray-500">Aún no se han cargado transacciones</p>
          </div>
        }
      </div>
    </div>
  `
})
export class TransactionsSummaryTableComponent {
  @Input() transactions: Transaction[] = [];
  @Output() rowClick = new EventEmitter<Transaction>();
  readonly icons = { ExternalLink, ChevronRight };
  readonly headers = ['Código', 'Cliente', 'Fecha', 'Monto', 'Moneda', 'Descripción', 'No. Auth'];
}
