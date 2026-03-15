import { Component, Output, EventEmitter, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Upload, X, FileSpreadsheet } from 'lucide-angular';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';

@Component({
  selector: 'app-lot-upload',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ButtonComponent],
  template: `
    <div class="flex flex-col gap-4">
      <!-- Zona de drop -->
      <div
        class="border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200"
        [class.border-green-400]="isDragging()"
        [class.bg-green-50]="isDragging()"
        [class.dark:bg-green-950]="isDragging()"
        [class.border-gray-300]="!isDragging()"
        [class.dark:border-neutral-600]="!isDragging()"
        (dragover)="onDragOver($event)"
        (dragleave)="isDragging.set(false)"
        (drop)="onDrop($event)">

        <lucide-icon [img]="icons.FileSpreadsheet" class="mx-auto mb-3 text-gray-400 dark:text-neutral-500" size="40" />
        <p class="text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
          Arrastra tu archivo Excel aquí
        </p>
        <p class="text-xs text-gray-400 dark:text-neutral-500 mb-4">o haz clic para seleccionarlo</p>

        <app-button [variant]="'primary'" [appearance]="'soft'" [size]="'small'" [type]="'button'" [icon]="icons.Upload" (onClick)="fileInput.click()">
          Seleccionar archivo .xlsx
        </app-button>
        <input
          #fileInput
          type="file"
          accept=".xlsx,.xls"
          class="hidden"
          (change)="onFileSelected($event)" />
      </div>

      <!-- Archivo seleccionado -->
      @if (selectedFile()) {
        <div class="flex items-center justify-between gap-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg px-4 py-3">
          <div class="flex items-center gap-2 min-w-0">
            <lucide-icon [img]="icons.FileSpreadsheet" size="18" class="text-green-600 shrink-0" />
            <span class="text-sm font-medium text-green-700 dark:text-green-400 truncate">{{ selectedFile()!.name }}</span>
            <span class="text-xs text-green-500 shrink-0">({{ (selectedFile()!.size / 1024).toFixed(1) }} KB)</span>
          </div>
          <button (click)="clearFile()" class="text-green-500 hover:text-red-500 transition-colors">
            <lucide-icon [img]="icons.X" size="16" />
          </button>
        </div>
      }

      <!-- Error -->
      @if (uploadError) {
        <p class="text-sm text-red-500 dark:text-red-400">{{ uploadError }}</p>
      }
    </div>
  `
})
export class LotUploadComponent {
  @Input() uploadError: string | null = null;
  @Output() fileChange = new EventEmitter<File | null>();

  selectedFile = signal<File | null>(null);
  isDragging = signal(false);

  readonly icons = { Upload, X, FileSpreadsheet };

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragging.set(true);
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragging.set(false);
    const file = e.dataTransfer?.files[0] ?? null;
    this.setFile(file);
  }

  onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.setFile(file);
  }

  clearFile(): void {
    this.setFile(null);
  }

  reset(): void {
    this.setFile(null);
  }

  private setFile(file: File | null): void {
    this.selectedFile.set(file);
    this.fileChange.emit(file);
  }
}
