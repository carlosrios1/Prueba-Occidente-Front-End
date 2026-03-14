import { Component, Input, Output, EventEmitter, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Edit, Trash2 } from 'lucide-angular';
import { ButtonComponent } from "../../buttons/button/button.component";

// Interfaces para tipado
export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'url' | 'custom' | 'text-secondary';
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableAction {
  icon: any;
  label: string;
  class?: string;
  delete?: boolean;
  action: (item: any) => void;
}

export interface TableData {
  [key: string]: any;
}

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ButtonComponent],
  templateUrl: './dynamic-table.component.html'
})
export class DynamicTableComponent {
  // Inputs usando el nuevo signal-based approach
  columns = input.required<TableColumn[]>();
  data = input.required<TableData[]>();
  actions = input<TableAction[]>([]);
  emptyMessage = input<string>('No hay datos para mostrar');

  // Outputs
  rowClick = output<TableData>();

  // Iconos de Lucide
  icons = {
    Edit,
    Trash2
  };

  // Función para trackear elementos en ngFor
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  get tableHeaderBaseClass(): string {
    return "px-2 py-3 text-sm font-medium bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 tracking-tight";
  }

  actionVariant(isDelete: boolean | undefined): 'default' | 'danger' {
    return isDelete ? 'danger' : 'default';
  }

  // Obtener valor anidado de un objeto usando dot notation
  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Obtener la key de la primera columna para aplicar estilos específicos
  getFirstColumnKey(): string {
    return this.columns()[0]?.key || '';
  }

  // Manejar click en fila
  onRowClick(item: TableData): void {
    this.rowClick.emit(item);
  }

  // Ejecutar acción y prevenir propagación del evento
  executeAction(action: TableAction, item: TableData, event: Event): void {
    event.stopPropagation();
    action.action(item);
  }
}