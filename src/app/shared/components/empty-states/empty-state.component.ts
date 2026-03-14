import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-empty-state',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="flex flex-col items-center justify-center py-12 px-4">
      <div class="w-16 h-16 rounded-full bg-base-300 flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
      <p class="text-base-content/60 text-center max-w-md mb-6">{{ message }}</p>
      <ng-content></ng-content>
    </div>
  `
})
export class EmptyStateComponent {
    @Input() icon?: string;
    @Input() title: string = 'No hay datos';
    @Input() message: string = 'No se encontraron elementos para mostrar';
}
