import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center overflow-hidden border-b border-white/10 px-4 gap-2 h-24">
      <!-- Logo siempre centrado, 20% más grande (h-8 → h-10) -->
      <div class="flex-shrink-0 p-1.5 rounded-xl ">
        <img src="assets/images/logos/bancocci_logo.png"
             alt="Banco de Occidente"
             class="h-10 w-auto object-contain" />
      </div>
      <!-- Texto en una sola línea debajo del logo -->
      @if (!collapsed && !compact) {
        <span class="text-white text-l font-bold tracking-wide whitespace-nowrap">
          Sistema de <span class="text-orangeBO">Sorteos</span>
        </span>
      }
    </div>
  `
})
export class SidebarHeaderComponent {
  @Input() collapsed = false;
  @Input() compact = false;
}