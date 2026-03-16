import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, Event, RouterOutlet } from '@angular/router';
import { IStaticMethods } from 'flyonui/flyonui';
import { ToastContainerComponent } from "@shared/components/toast/toast-container/tost-container.component";

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private router=inject(Router);

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      // Verificar si ya hay un tema guardado
      const savedTheme = localStorage.getItem('theme');
      const isDark = savedTheme === 'dark';
      this.applyTheme(isDark);
    }
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        // Incrementar el tiempo de espera
        setTimeout(() => {
          if (window.HSStaticMethods) {
            try {
              window.HSStaticMethods.autoInit();
            } catch (error) {
              console.warn('Error en la inicialización de Flyon UI:', error);
            }
          }
        }, 3000); // Aumentar de 100ms a 300ms
      }
    });
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
}