import { Component, inject } from '@angular/core';

//IMPORT LUCIDE
import {
  LucideAngularModule,
  Menu,
  PanelLeft,
  PanelLeftClose
} from 'lucide-angular';
import { SidebarToggleService } from '../../../sidebar/sidebarToggle.service';
import { ButtonComponent } from '../../../../../../shared/components/buttons/button/button.component';

@Component({
  selector: 'app-sidebar-toggler',
  standalone: true,
  imports: [LucideAngularModule, ButtonComponent],
  templateUrl: './sidebar-toggler.component.html',
  styles: [`
    #sidebar-icon {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      transform-origin: 50% 50%;
      /* girar desde el centro */
    }

    /* Animación de giro tipo swap */
    @keyframes swap-spin {
      0% {
        transform: rotateY(0deg);
        opacity: 1;
      }

      50% {
        transform: rotateY(180deg);
        opacity: 0.3;
        /* efecto de "desaparecer" un poco en el medio */
      }

      100% {
        transform: rotateY(360deg);
        opacity: 1;
      }
    }

    #sidebar-icon.animate {
      animation: swap-spin 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
  `]
})
export class SidebarTogglerComponent {
  sidebarToggleService = inject(SidebarToggleService);

  isCollapsed = false;
  isMobileSidebarOpen = false;

  readonly icons = {
    Menu,
    PanelLeftClose,
    PanelLeft
  }

  ngOnInit() {
    this.sidebarToggleService.isCollapsed$.subscribe(collapsed => {
      this.isCollapsed = collapsed;
    });

    this.sidebarToggleService.isMobileSidebarOpen$.subscribe(isOpen => {
      this.isMobileSidebarOpen = isOpen;
    });
  }

  getIcon() {
    // En mobile (< 768px)
    if (window.innerWidth < 768) {
      return this.isMobileSidebarOpen ? this.icons.PanelLeftClose : this.icons.Menu;
    }
    // En desktop (>= 768px)
    return this.isCollapsed ? this.icons.PanelLeft : this.icons.PanelLeftClose;
  }

  toggleSidebar() {
    // En mobile (< 768px), usa sidebar overlay
    if (window.innerWidth < 768) {
      this.sidebarToggleService.toggleMobileSidebar();
    } else {
      // En tablet y desktop (>= 768px), usa sidebar fijo
      this.sidebarToggleService.toggleSidebar();
    }

    // Animar el icono
    this.triggerIconAnimation();
  }

  private triggerIconAnimation() {
    const icon = document.getElementById('sidebar-icon');
    if (!icon) return;

    icon.classList.add('animate');

    // Remueve la clase al terminar la animación
    icon.addEventListener('animationend', () => {
      icon.classList.remove('animate');
    }, { once: true });
  }
}