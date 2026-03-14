import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineItem } from '../timeline-item.model';
import { CardComponent } from "../../cards/card/card.component";
import { CardBodyComponent } from "../../cards/card/components/card-body.component";
import { LucideAngularModule, User } from "lucide-angular";
import { TimelineEventPipe } from './timeline-event.pipe';

@Component({
    selector: 'app-timeline-node',
    standalone: true,
    imports: [
        CommonModule,
        CardComponent,
        CardBodyComponent,
        LucideAngularModule,
        TimelineEventPipe
    ],
    templateUrl: './timeline-node.component.html'
})
export class TimelineNodeComponent {
    @Input({ required: true }) item!: TimelineItem;
    @Input() isLast: boolean = false;

    readonly icons = {
        User
    }
}