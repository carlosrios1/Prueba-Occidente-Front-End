import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ToastService } from '../services/toast.service';
import { AlertTriangle, CheckCircle, CircleX, Info, LucideAngularModule, X } from 'lucide-angular';

export interface ToastData {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div 
      [@slideIn]="animationState"
      class=" rounded-md shadow-1 transition-all duration-200 transform flex items-center justify-between"[ngClass]="getToastClass()"
      >
      <div class="flex items-center py-3 px-4">
        <div class="flex-shrink-0">
        </div>
        <div class="flex items-center gap-4 motion-preset-rebound-left motion-duration-200">
          <lucide-icon [img]="getIcon()" [ngClass]="iconColorClass"></lucide-icon>
          <p class="text-sm font-medium tracking-tight whitespace-pre-line text-white ">{{ data.message }}</p>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('slideIn', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateX(100%) scale(0.8)',
        maxHeight: '0px',
        marginBottom: '0px',
        paddingTop: '0px',
        paddingBottom: '0px'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateX(0) scale(1)',
        maxHeight: '200px',
        marginBottom: '8px',
        paddingTop: '0px',
        paddingBottom: '0px'
      })),
      transition('hidden => visible', [
        animate('300ms cubic-bezier(0.34, 1.56, 0.64, 1)')
      ]),
      transition('visible => hidden', [
        animate('250ms cubic-bezier(0.4, 0, 1, 1)')
      ])
    ])
  ]
})
export class ToastComponent implements OnInit {
  @Input() data!: ToastData;
  @Input() id: string = '';
  animationState: 'visible' | 'hidden' = 'hidden';
  iconColorClass = '';
  private toastService = inject(ToastService);
  private timeoutId?: number;

  readonly icons = {
    success: CheckCircle,
    error: CircleX,
    warning: AlertTriangle,
    info: Info
  };

  ngOnInit() {
    // Importante: Asegurarnos que comienza en estado hidden
    this.animationState = 'hidden';
    this.setIconColorClass();

    // Trigger para iniciar la animación después de un breve retraso
    // para que Angular pueda establecer el estado inicial correctamente
    setTimeout(() => {
      this.animationState = 'visible';
    }, 10);

    // Auto-dismiss after duration
    const duration = this.data.duration || 3000;
    this.timeoutId = window.setTimeout(() => {
      this.dismissToast();
    }, duration);
  }



  private dismissToast() {
    this.animationState = 'hidden';
    setTimeout(() => this.toastService.removeToast(this.id), 300); // Wait for animation to complete
  }

  getIcon() {
    switch (this.data.type) {
      case 'success':
        return CheckCircle;
      case 'error':
        return CircleX;
      case 'warning':
        return AlertTriangle;
      case 'info':
      default:
        return Info;
    }
  }

  private setIconColorClass() {
    switch (this.data.type) {
      case 'success':
        this.iconColorClass = 'text-white';
        break;
      case 'error':
        this.iconColorClass = 'text-white';
        break;
      case 'warning':
        this.iconColorClass = 'text-white';
        break;
      case 'info':
        this.iconColorClass = 'text-white';
        break;
    }
  }

  getToastClass() {
    switch (this.data.type) {
      case 'success':
        return 'border-l-6 border-l-green-300 bg-green-500 hover:bg-green-600 transition-colors ';
      case 'error':
        return 'border-l-6 border-l-red-300 bg-red-500 hover:bg-red-600 transition-colors';
      case 'warning':
        return 'border-l-6 border-l-yellow-200 bg-yellow-400 hover:bg-yellow-600 transition-colors';
      case 'info':
      default:
        return 'border-l-6 border-l-blue-300 bg-blue-500 hover:bg-blue-600 transition-colors';
    }
  }
}