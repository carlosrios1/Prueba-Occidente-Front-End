import { Component, HostListener, inject } from '@angular/core';
import { SidebarToggleService } from './sidebarToggle.service';
import { CommonModule } from '@angular/common';
import { SidebarHeaderComponent } from './components/sidebar-header.component';
import { SidebarNavItemComponent } from './components/sidebar-nav-item.component';
import { MobileSidebarComponent } from './components/mobile-sidebar.component';
import { SIDEBAR_CONFIG } from '../../../config/sidebar.config';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    SidebarHeaderComponent,
    SidebarNavItemComponent,
    MobileSidebarComponent
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  isCollapsed = false;
  isMobileSidebarOpen = false;
  sidebarToggleService = inject(SidebarToggleService);

  ngOnInit() {
    this.sidebarToggleService.isCollapsed$.subscribe(collapsed => {
      this.isCollapsed = collapsed;
    });

    this.sidebarToggleService.isMobileSidebarOpen$.subscribe(isOpen => {
      this.isMobileSidebarOpen = isOpen;
    });
  }

  onMobileNavClick() {
    if (window.innerWidth < 768) {
      this.sidebarToggleService.closeMobileSidebar();
    }
  }

  onOverlayClick() {
    this.sidebarToggleService.closeMobileSidebar();
  }

  closeMobileSidebar() {
    this.sidebarToggleService.closeMobileSidebar();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event) {
    if (this.isMobileSidebarOpen) {
      this.sidebarToggleService.closeMobileSidebar();
    }
  }

  principalItems = SIDEBAR_CONFIG.principal;
  secondaryItems = SIDEBAR_CONFIG.secondary;
}