import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Info, LucideAngularModule, LucideIconData } from 'lucide-angular';

@Component({
    selector: 'app-item-card',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div [ngClass]="containerClasses">
      <div class="flex items-center gap-3">
        <ng-content select="app-info-card-icon"></ng-content>
        <ng-content [select]="'icon'"></ng-content>
        <div class="flex flex-col justify-center gap-0.5">
          <span [ngClass]="titleClasses">
            <ng-content select="app-info-card-title"></ng-content>
          </span>
          <span [ngClass]="subtitleClasses">
            <ng-content select="app-info-card-subtitle"></ng-content>
          </span>
        </div>
      </div>
    </div>
  `,
})
export class ItemCardComponent {
    // Clases opcionales para personalizar estilos
    @Input() containerClasses: string = 'flex flex-col';
    @Input() titleClasses: string = 'text-xs font-medium uppercase tracking-wide text-gray-500';
    @Input() subtitleClasses: string = 'text-base font - semibold text - gray - 900';
}
