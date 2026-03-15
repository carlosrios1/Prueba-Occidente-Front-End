import { Component, HostListener, inject } from '@angular/core';
import { SidebarToggleService } from './sidebarToggle.service';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';
import { SidebarHeaderComponent } from './components/sidebar-header.component';
import { SidebarNavItemComponent } from './components/sidebar-nav-item.component';
import { SIDEBAR_CONFIG } from '../../../config/sidebar.config';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    SidebarHeaderComponent,
    SidebarNavItemComponent,
  ],
  templateUrl: './sidebar.component.html',
  styles: [`
    .sidebar-mobile-hidden { transform: translateX(-100%); }
    @media (min-width: 768px) {
      .sidebar-mobile-hidden { transform: translateX(0); }
      .sidebar-desktop-collapsed { width: 80px; }
    }
  `]
})
export class SidebarComponent {
  isCollapsed = false;
  isMobileSidebarOpen = false;

  readonly sidebarToggleService = inject(SidebarToggleService);
  readonly icons = { X };

  /** Solo aplica icon-only en desktop colapsado, nunca en el drawer mobile */
  get isIconOnly(): boolean {
    return this.isCollapsed && window.innerWidth >= 768;
  }

  readonly principalItems = SIDEBAR_CONFIG.principal;
  readonly secondaryItems = SIDEBAR_CONFIG.secondary;

  ngOnInit(): void {
    this.sidebarToggleService.isCollapsed$.subscribe(v => this.isCollapsed = v);
    this.sidebarToggleService.isMobileSidebarOpen$.subscribe(v => this.isMobileSidebarOpen = v);
  }

  onMobileNavClick(): void {
    if (window.innerWidth < 768) this.sidebarToggleService.closeMobileSidebar();
  }

  onOverlayClick(): void { this.sidebarToggleService.closeMobileSidebar(); }
  closeMobileSidebar(): void { this.sidebarToggleService.closeMobileSidebar(); }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isMobileSidebarOpen) this.sidebarToggleService.closeMobileSidebar();
  }

  /** Fuerza re-evaluación de isIconOnly al redimensionar la ventana */
  @HostListener('window:resize')
  onResize(): void {}
}