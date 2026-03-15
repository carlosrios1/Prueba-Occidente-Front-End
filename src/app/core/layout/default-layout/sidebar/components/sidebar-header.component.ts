import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center h-20 overflow-hidden px-2"
         [ngClass]="collapsed ? 'justify-center' : 'justify-start'">
      <div class="flex items-center gap-3 overflow-hidden min-w-0">
        <div class="p-2 shadow-inner bg-gradient-to-r rounded-lg from-orange-500/30 to-green-600/30 flex-shrink-0">
          <img src="assets/images/logos/bancocci_sm.png" 
               alt="BancoICI Logo"
               class="w-auto h-8 mx-auto object-fit-contain" />
        </div>
        @if (!collapsed) {
          <div class="flex-col justify-center text-white flex overflow-hidden">
            <span class="font-extrabold text-3xl whitespace-nowrap tracking-tighter">SGA</span>
          </div>
        }
      </div>
    </div>
  `
})
export class SidebarHeaderComponent {
  @Input() collapsed = false;
}