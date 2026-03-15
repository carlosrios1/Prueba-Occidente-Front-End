import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ToastService } from '../services/toast.service';
import { AlertTriangle, CheckCircle, CircleX, Info, X, LucideAngularModule } from 'lucide-angular';

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
      class="flex flex-col overflow-hidden rounded-xl shadow-2xl min-w-72 max-w-sm cursor-default select-none"
      [ngClass]="getBgClass()"
    >
      <div class="flex items-center gap-3 px-4 py-3.5">
        <!-- Ícono -->
        <div class="flex-shrink-0 flex items-center justify-center size-8 rounded-full bg-white/20">
          <lucide-icon [img]="getIcon()" class="size-4 text-white"></lucide-icon>
        </div>
        <!-- Mensaje -->
        <p class="flex-1 text-sm font-medium text-white leading-snug whitespace-pre-line">{{ data.message }}</p>
        <!-- Cerrar -->
        <button
          (click)="close()"
          class="flex-shrink-0 flex items-center justify-center size-6 rounded-full text-white/60 hover:text-white hover:bg-white/20 transition-all duration-150"
          aria-label="Cerrar"
        >
          <lucide-icon [img]="XIcon" class="size-3.5"></lucide-icon>
        </button>
      </div>
      <!-- Barra de progreso -->
      <div class="h-0.5 bg-black/10 w-full overflow-hidden">
        <div
          class="h-full bg-white/50 origin-left"
          [style.width.%]="progress"
          [style.transition]="'width ' + (data.duration ?? 3000) + 'ms linear'"
        ></div>
      </div>
    </div>
  `,
  animations: [
    trigger('slideIn', [
      state('hidden', style({ opacity: 0, transform: 'translateX(110%)' })),
      state('visible', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('hidden => visible', [animate('320ms cubic-bezier(0.21, 1.02, 0.73, 1)')]),
      transition('visible => hidden', [animate('220ms cubic-bezier(0.06, 0.71, 0.55, 1)')])
    ])
  ]
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() data!: ToastData;
  @Input() id: string = '';

  animationState: 'visible' | 'hidden' = 'hidden';
  progress = 100;

  private toastService = inject(ToastService);
  private timeoutId?: number;
  private progressTimeoutId?: number;

  readonly XIcon = X;
  readonly icons = {
    success: CheckCircle,
    error: CircleX,
    warning: AlertTriangle,
    info: Info,
  };

  ngOnInit() {
    this.animationState = 'hidden';

    setTimeout(() => {
      this.animationState = 'visible';
    }, 10);

    // Arrancar la barra de progreso hacia 0
    this.progressTimeoutId = window.setTimeout(() => {
      this.progress = 0;
    }, 50);

    const duration = this.data.duration ?? 3000;
    this.timeoutId = window.setTimeout(() => this.dismiss(), duration);
  }

  ngOnDestroy() {
    clearTimeout(this.timeoutId);
    clearTimeout(this.progressTimeoutId);
  }

  close() {
    clearTimeout(this.timeoutId);
    clearTimeout(this.progressTimeoutId);
    this.dismiss();
  }

  dismiss() {
    this.animationState = 'hidden';
    setTimeout(() => this.toastService.removeToast(this.id), 250);
  }

  getIcon() {
    return this.icons[this.data.type] ?? this.icons.info;
  }

  getBgClass(): string {
    switch (this.data.type) {
      case 'success': return 'bg-greenBO';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-amber-500';
      case 'info':
      default: return 'bg-sky-500';
    }
  }
}