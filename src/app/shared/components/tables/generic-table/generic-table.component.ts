import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  TemplateRef,
  AfterContentInit,
  OnChanges,
  ChangeDetectorRef,
  Output,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Directive } from '@angular/core';

@Directive({
  selector: 'ng-template[cellCustom]',
  standalone: true
})
export class CellCustomDirective {
  @Input() cellCustom!: string;
  constructor(public template: TemplateRef<any>) { }
}

// Tipo helper para extraer las keys de un tipo como string literal
export type ColumnKey<T> = Extract<keyof T, string>;

// Interfaz para la configuración de columnas
export interface ColumnConfig<T> {
  key: ColumnKey<T>;
  label?: string;
  sortable?: boolean;
}

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full overflow-x-auto bg-white dark:bg-base-100 rounded-md overflow-y-hidden">
      <!-- Estado vacío -->
      @if (data.length === 0) {
      <div class="py-16 text-center">
        <div class="mx-auto w-16 h-16 bg-gray-100 dark:bg-base-100 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">No hay datos disponibles</h3>
        <p class="text-sm text-gray-500">No se encontraron registros para mostrar</p>
      </div>
      } @else {
      <table class="w-full">
        <!-- Encabezado -->
        <thead>
          <tr class="border-b border-gray-200/60 dark:border-slate-700">
            @for (column of columns; track column) {
            <th class="px-2 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-200 tracking-tight">
              {{ getColumnLabel(column) }}
            </th>
            }
          </tr>
        </thead>

        <!-- Cuerpo -->
        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
          @for (row of data; track $index) {
          <tr class="group cursor-pointer bg-white dark:bg-base-100 transition-all duration-300 hover:bg-gradient-to-r hover:from-green-50/30 hover:to-green-50/20 dark:hover:from-green-900/20 dark:hover:to-green-800/10 hover:shadow-sm"
              [class.cursor-pointer]="clickable"
              (click)="onRowClick(row)">
            @for (column of columns; track column) {
            <td class="px-2 py-3">
              @if (hasCustomTemplate(column)) {
                <ng-container *ngTemplateOutlet="getCustomTemplate(column)!; context: { $implicit: row[column], row: row }"></ng-container>
              } @else {
                <span class="text-sm text-gray-900 dark:text-gray-100">{{ row[column] }}</span>
              }
            </td>
            }
          </tr>
          }
        </tbody>
      </table>
      }
    </div>
  `
})
export class GenericTableComponent<T extends Record<string, any>> implements AfterContentInit, OnChanges {
  @Input() data: T[] = [];
  @Input() columnLabels: Partial<Record<ColumnKey<T>, string>> = {};
  @Input() clickable: boolean = true;
  @Output() rowClick = new EventEmitter<T>();

  @ContentChildren(CellCustomDirective) customCells!: QueryList<CellCustomDirective>;

  columns: ColumnKey<T>[] = [];
  private customTemplates: Map<string, TemplateRef<any>> = new Map();

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnChanges() {
    this.extractColumns();
  }

  ngAfterContentInit() {
    this.customTemplates.clear();
    this.customCells.forEach(cell => {
      this.customTemplates.set(cell.cellCustom, cell.template);
    });

    if (this.columns.length === 0) {
      this.extractColumns();
    }

    this.cdr.detectChanges();
  }

  private extractColumns() {
    if (this.data.length > 0) {
      this.columns = Object.keys(this.data[0]) as ColumnKey<T>[];
    }
  }

  getColumnLabel(column: ColumnKey<T>): string {
    return this.columnLabels[column] || this.formatColumnName(column);
  }

  private formatColumnName(column: string): string {
    return column
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  hasCustomTemplate(column: ColumnKey<T>): boolean {
    return this.customTemplates.has(column);
  }

  getCustomTemplate(column: ColumnKey<T>): TemplateRef<any> | null {
    return this.customTemplates.get(column) || null;
  }

  onRowClick(row: T) {
    if (this.clickable) {
      this.rowClick.emit(row);
    }
  }
}