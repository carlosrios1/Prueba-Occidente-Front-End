import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container fixed top-5 right-5 z-[99999] flex flex-col gap-2 items-end">
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