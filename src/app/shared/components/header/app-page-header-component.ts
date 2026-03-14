import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-between">
      <div class="flex flex-col gap-1 tracking-tight lg:gap-2">
        <div class="flex gap-2 items-center">
          <h1
          class="text-xl md:text-2xl xl:text-3xl
         tracking-tight drop-shadow-sm font-extrabold antialiased
         text-black dark:text-white">
          {{ title }}
        </h1>
        <ng-content select="[tags]"></ng-content>
        </div>
        <div class="flex items-center gap-2" *ngIf="description">
          <p class="text-sm xl:text-base text-gray-700 dark:text-neutral-400">
            {{ description }}
          </p>
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <ng-content select="[actions]"></ng-content>
      </div>
    </div>
  `
})
export class PageHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() description?: string;
}