import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container fixed top-20 right-4 z-[99999] w-auto max-w-xs flex flex-col gap-1">
      <!-- Los toasts se insertarán aquí dinámicamente -->
    </div>
  `,
  styles: [`
    .toast-container {
      pointer-events: none;
    }
    
    .toast-container > * {
      pointer-events: auto;
    }
  `]
})
export class ToastContainerComponent {
  // Contenedor simple, ahora con estilos para permitir que los clicks 
  // pasen a través del contenedor pero no a través de los toasts
}