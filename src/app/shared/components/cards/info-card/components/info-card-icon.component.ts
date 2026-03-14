import { Component, Input } from '@angular/core';
import { Info, LucideAngularModule, LucideIconData } from "lucide-angular";

@Component({
    selector: 'app-info-card-icon',
    standalone: true,
    template: `
    <div class="{{containerClasses}} shrink-0">
      @if(imageUrl) {
        <img 
          [src]="imageUrl" 
          class="{{iconClasses}} min-w-[20px] min-h-[20px] object-contain" 
          alt="icon" 
        />
      } @else {
        <lucide-icon 
          [img]="icon" 
          class="{{iconClasses}} shrink-0"
        ></lucide-icon>
      }
    </div>
  `,
    imports: [LucideAngularModule],
})
export class InfoCardIconComponent {
    @Input() iconClasses: string = 'size-5 text-gray-500 dark:text-neutral-400';
    @Input() containerClasses: string = 'rounded-lg bg-gray-100 p-3 dark:bg-neutral-800';
    @Input() icon: LucideIconData = Info;
    @Input() imageUrl?: string;
}
