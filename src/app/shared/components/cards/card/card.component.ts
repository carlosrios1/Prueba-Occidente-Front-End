import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [],
    templateUrl: './card.component.html'
})
export class CardComponent {
    @Input() showFooter: boolean = true;
    @Input() padding: 0 | 2 | 4 | 6 = 6;
    @Input() gap: 0 | 2 | 4 | 6 = 6;
    @Input() rounded: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full' = 'md';
    @Input() overflow: 'hidden' | 'visible' | 'auto' = 'hidden';

}
