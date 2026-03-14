import { Component, signal } from '@angular/core';

//IMPORT LUCIDE
import {
  LucideAngularModule,
  Sun,
  Moon,
} from 'lucide-angular';
import { ButtonComponent } from '../../../../../../shared/components/buttons/button/button.component';

@Component({
  selector: 'app-theme-toggler',
  standalone: true,
  imports: [LucideAngularModule, ButtonComponent],
  templateUrl: './theme-toggler.component.html',
  styles: [`
    #theme-icon {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      transform-origin: 50% 50%;
    }

    @keyframes swap-spin {
      0% {
        transform: rotateY(0deg);
        opacity: 1;
      }

      50% {
        transform: rotateY(180deg);
        opacity: 0.3;
      }

      100% {
        transform: rotateY(360deg);
        opacity: 1;
      }
    }

    #theme-icon.animate {
      animation: swap-spin 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
  `]
})
export class ThemeTogglerComponent {
  readonly icons = {
    Sun,
    Moon
  }

  isDarkMode = signal(false);

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const isDark = savedTheme === 'dark';
      this.isDarkMode.set(isDark);
      this.applyTheme(isDark);
    }
  }

  toggleTheme() {
    const newDarkMode = !this.isDarkMode();
    this.isDarkMode.set(newDarkMode);

    const html = document.documentElement;

    // Desactivar transiciones para toda la UI
    html.classList.add('no-transition');

    // Cambiar tema
    this.applyTheme(newDarkMode);

    // Guardar preferencia en localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    }

    // Remover la clase después de un frame
    requestAnimationFrame(() => {
      html.classList.remove('no-transition');
    });

    // Animación del icono
    this.triggerIconAnimation();
  }

  private applyTheme(isDark: boolean) {
    const htmlElement = document.documentElement;

    if (isDark) {
      htmlElement.classList.add('dark');
      htmlElement.setAttribute('data-theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      htmlElement.setAttribute('data-theme', 'light');
    }
  }

  private triggerIconAnimation() {
    const icon = document.getElementById('theme-icon');
    if (!icon) return;

    icon.classList.add('animate');

    icon.addEventListener('animationend', () => {
      icon.classList.remove('animate');
    }, { once: true });
  }
}