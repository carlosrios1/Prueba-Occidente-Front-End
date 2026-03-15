import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ExternalLink } from 'lucide-angular';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { TableCellDirective } from '@shared/directives/table-cell.directive';
import { Transaction } from '../../models/dtos/transaction.dto';

@Component({
  selector: 'app-transactions-summary-table',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, ButtonComponent, TableCellDirective],
  template: `
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold text-gray-800 dark:text-white">Últimas transacciones</h2>
        <a routerLink="/lots/transactions">
          <app-button [variant]="'neutral'" [appearance]="'text'" [size]="'small'" [type]="'button'" [icon]="icons.ExternalLink" [iconPosition]="'right'">
            Ver todas
          </app-button>
        </a>
      </div>

      <div class="border-y border-gray-200 dark:border-neutral-800">
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
              <tr class="transition-all duration-300 hover:bg-gradient-to-r hover:from-green-50/30 hover:to-green-50/20 dark:hover:from-green-900/20 dark:hover:to-green-800/10">
                <td appTableCell variant="first">{{ tr.clientCode }}</td>
                <td appTableCell variant="name">{{ tr.clientName }}</td>
                <td appTableCell>{{ tr.transactionDate | date:'dd/MM/yyyy' }}</td>
                <td appTableCell><span class="font-semibold">{{ tr.amount | number:'1.2-2' }}</span></td>
                <td appTableCell>{{ tr.currency }}</td>
                <td appTableCell>{{ tr.description }}</td>
                <td appTableCell>{{ tr.authNumber }}</td>
              </tr>
            }
          </tbody>
        </table>
        @if (transactions.length === 0) {
          <div class="py-10 text-center text-sm text-gray-500">No hay transacciones disponibles</div>
        }
      </div>
    </div>
  `
})
export class TransactionsSummaryTableComponent {
  @Input() transactions: Transaction[] = [];
  @Output() rowClick = new EventEmitter<Transaction>();
  readonly icons = { ExternalLink };
  readonly headers = ['Código', 'Cliente', 'Fecha', 'Monto', 'Moneda', 'Descripción', 'No. Auth'];
}
