import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('tooltip', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('100ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div class="relative inline-flex min-w-0" (mouseenter)="show()" (mouseleave)="hide()">
      <ng-content></ng-content>

      @if (isVisible) {
        <div
          @tooltip
          [class]="tooltipClasses"
          [ngClass]="positionClasses">
          {{ text }}
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: inline-flex;
      min-width: unset;
      width: auto;
    }
  `]
})
export class TooltipComponent {
  @Input() text: string = '';
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() maxWidth: string = 'max-w-xs';
  @Input() type: 'tooltip' | 'info' | 'success' | 'warning' | 'error' = 'tooltip';

  isVisible = false;

  get tooltipClasses(): string {
    const baseClasses = `absolute w-max ${this.maxWidth} text-xs rounded-md px-3 py-1.5 shadow-lg z-50 pointer-events-none`;

    const typeClasses = {
      'tooltip': 'bg-gray-900 text-white',
      'info': 'bg-blue-600 text-white',
      'success': 'bg-green-600 text-white',
      'warning': 'bg-amber-500 text-white',
      'error': 'bg-red-600 text-white'
    };

    return `${baseClasses} ${typeClasses[this.type]}`;
  }

  get positionClasses(): string {
    const positions = {
      'top': 'left-1/2 -translate-x-1/2 bottom-full mb-2',
      'bottom': 'left-1/2 -translate-x-1/2 top-full mt-2',
      'left': 'right-full mr-2 top-1/2 -translate-y-1/2',
      'right': 'left-full ml-2 top-1/2 -translate-y-1/2'
    };
    return positions[this.position];
  }

  show(): void {
    this.isVisible = true;
  }

  hide(): void {
    this.isVisible = false;
  }
}
