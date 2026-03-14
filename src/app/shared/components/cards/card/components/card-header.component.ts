import { Component, Input } from '@angular/core';
import { LucideIconData, LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-card-header',
    standalone: true,
    template: `
    <div class="flex flex-col {{gap}}">
        <div class="flex items-center {{gap}}">
        @if (icon){
        <lucide-icon [img]="icon" [class]="iconSize"></lucide-icon>
        }
        @if (title) {
        <h2 class="text-gray-700 tracking-tight dark:text-neutral-100 font-semibold">{{title}}</h2>
        }
        </div>
        @if (description) {
        <p class="text-sm font-normal tracking-tight text-neutral-500 dark:text-neutral-400">{{ description }}</p>
        }
    </div>
  `,
    imports: [LucideAngularModule],
})
export class CardHeaderComponent {
    @Input() title: string | null = null;
    @Input() icon: LucideIconData | null = null;
    @Input() iconSize: string = 'size-5';
    @Input() description: string | null = null;
    @Input() gap: string = 'gap-1';
}
