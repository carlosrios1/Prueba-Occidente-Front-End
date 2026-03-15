import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center overflow-hidden px-2"
         [class.h-20]="!compact"
         [class.h-16]="compact"
         [ngClass]="collapsed ? 'justify-center' : 'justify-start'">
      <div class="flex items-center gap-3 overflow-hidden min-w-0">
        <div class="p-2 shadow-inner bg-gradient-to-r rounded-lg from-orange-500/30 to-green-600/30 flex-shrink-0">
          <img src="assets/images/logos/bancocci_logo.png"
               alt="BancoICI Logo"
               class="w-auto h-8 mx-auto object-fit-contain" />
        </div>
        @if (!collapsed && !compact) {
          <div class="flex-col justify-center text-white flex min-w-0 overflow-hidden">
            <span class="font-bold text-base leading-tight tracking-tight truncate">Sistema de</span>
            <span class="font-extrabold text-lg leading-tight tracking-tight truncate">Sorteos</span>
          </div>
        }
      </div>
    </div>
  `
})
export class SidebarHeaderComponent {
  @Input() collapsed = false;
  /** Modo compacto para uso en el header (h-16, sin texto) */
  @Input() compact = false;
}