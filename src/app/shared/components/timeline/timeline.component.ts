import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineNodeComponent } from './timeline-node/timeline-node.component';
import { TimelineItem } from './timeline-item.model';


@Component({
    selector: 'app-timeline',
    standalone: true,
    imports: [CommonModule, TimelineNodeComponent],
    templateUrl: './timeline.component.html'
})
export class TimelineComponent {
    @Input({ required: true }) items: TimelineItem[] = [];
}