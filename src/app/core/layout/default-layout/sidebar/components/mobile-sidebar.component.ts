import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';
import { NavItem, SidebarNavItemComponent } from './sidebar-nav-item.component';

@Component({
  selector: 'app-mobile-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    SidebarNavItemComponent
  ],
  template: `
    <!-- Overlay para mobile -->
    <div class="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
         [class.opacity-100]="isOpen" 
         [class.opacity-0]="!isOpen"
         [class.pointer-events-none]="!isOpen" 
         [class.pointer-events-auto]="isOpen"
         (click)="overlayClick.emit()">
    </div>

    <!-- Sidebar Mobile -->
    <aside class="fixed inset-y-0 left-0 z-[99999] w-64 bg-neutral-950 transform transition-transform duration-300 ease-in-out md:hidden"
           [class.translate-x-0]="isOpen" 
           [class.-translate-x-full]="!isOpen">

      <div class="flex flex-col h-full">
        <!-- Header del sidebar mobile -->
        <div class="flex items-center justify-between h-16 px-4">
          <div class="flex items-center gap-3">
            <div class="p-2 shadow-inner bg-gradient-to-r rounded-lg from-orange-500/30 to-green-600/30">
              <img src="assets/images/logos/bancocci_logo.png" 
                   alt="BancoICI Logo"
                   class="w-auto h-8 mx-auto object-fit-contain" />
            </div>
            <div class="flex flex-col justify-center text-white">
              <span class="font-extrabold text-3xl whitespace-nowrap tracking-tighter">Sistema</span>
            </div>
          </div>
          <button class="p-2 rounded-lg text-white hover:bg-white/10 transition-colors" 
                  (click)="close.emit()"
                  aria-label="Cerrar menú">
            <lucide-icon [img]="CloseIcon" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <!-- Contenido del sidebar mobile -->
        <div class="flex-1 px-2 py-4 overflow-y-auto">
          <div class="flex flex-col gap-4">
            <!-- Principal Section -->
            <div class="flex flex-col gap-1">
              <div class="px-3 py-2">
                <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Sorteos</span>
              </div>
              <ul class="flex flex-col gap-1">
                @for (item of items; track $index) {
                  <app-sidebar-nav-item 
                    [item]="item" 
                    [iconOnly]="false"
                    (itemClick)="navItemClick.emit()">
                  </app-sidebar-nav-item>
                }
              </ul>
            </div>

            <!-- Secondary Section -->
            @if (secondaryItems && secondaryItems.length > 0) {
            <div class="flex flex-col gap-1">
              <div class="px-3 py-2">
                <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Otros</span>
              </div>
              <ul class="flex flex-col gap-1">
                @for (item of secondaryItems; track $index) {
                  <app-sidebar-nav-item 
                    [item]="item" 
                    [iconOnly]="false"
                    (itemClick)="navItemClick.emit()">
                  </app-sidebar-nav-item>
                }
              </ul>
            </div>
            }
          </div>
        </div>
      </div>
    </aside>
  `
})
export class MobileSidebarComponent {
  @Input() isOpen = false;
  @Input() items: NavItem[] = [];
  @Input() secondaryItems: NavItem[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() overlayClick = new EventEmitter<void>();
  @Output() navItemClick = new EventEmitter<void>();

  readonly CloseIcon = X;
}