import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ExternalLink, ChevronRight } from 'lucide-angular';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { TableCellDirective } from '@shared/directives/table-cell.directive';
import { Lot } from '../../models/dtos/lot.dto';

@Component({
  selector: 'app-lots-summary-table',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, BadgeComponent, ButtonComponent, TableCellDirective],
  template: `
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold text-gray-800 dark:text-white">Últimos lotes cargados</h2>
        <a routerLink="/lots/all">
          <app-button [variant]="'neutral'" [appearance]="'text'" [size]="'small'" [type]="'button'" [icon]="icons.ExternalLink" [iconPosition]="'right'">
            Ver todos
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
            @for (lot of lots; track lot.id) {
              <tr class="group cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-green-50/30 hover:to-green-50/20 dark:hover:from-green-900/20 dark:hover:to-green-800/10"
                  (click)="rowClick.emit(lot)">
                <td appTableCell variant="first">{{ lot.id }}</td>
                <td appTableCell variant="name">{{ lot.fileName }}</td>
                <td appTableCell>{{ lot.uploadDate | date:'dd/MM/yyyy HH:mm' }}</td>
                <td appTableCell>{{ lot.totalRecords }}</td>
                <td appTableCell>
                  <app-badge [variant]="lot.status === 'COMPLETED' ? 'success' : 'secondary'" appearance="soft" size="small">
                    {{ lot.status === 'COMPLETED' ? 'Completado' : 'Pendiente' }}
                  </app-badge>
                </td>
                <td appTableCell>{{ lot.uploadedBy }}</td>
                <td appTableCell>
                  <lucide-icon [img]="icons.ChevronRight" class="size-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></lucide-icon>
                </td>
              </tr>
            }
          </tbody>
        </table>
        @if (lots.length === 0) {
          <div class="py-10 text-center text-sm text-gray-500">No hay lotes disponibles</div>
        }
      </div>
    </div>
  `
})
export class LotsSummaryTableComponent {
  @Input() lots: Lot[] = [];
  @Output() rowClick = new EventEmitter<Lot>();
  readonly icons = { ExternalLink, ChevronRight };
  readonly headers = ['ID', 'Archivo', 'Fecha carga', 'Registros', 'Estado', 'Usuario', ''];
}
