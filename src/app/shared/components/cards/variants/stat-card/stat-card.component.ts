import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ChartNoAxesColumnDecreasing, LucideAngularModule, LucideIconData } from 'lucide-angular';
import { CardComponent } from "../../card/card.component";
import { CardBodyComponent } from "../../card/components/card-body.component";
import { BadgeComponent } from "../../../badge/badge.component";
import { BadgeVariant } from '../../../badge/badge.config';
import { NumberFormatPipe } from '../../../../pipes/number-format.pipe';

@Component({
    selector: 'app-stat-card',
    standalone: true,
    imports: [LucideAngularModule, CardComponent, CardBodyComponent, BadgeComponent, NumberFormatPipe],
    templateUrl: './stat-card.component.html'
})
export class StatCardComponent implements OnInit, OnDestroy, OnChanges {
    @Input() title: string = 'titulo';
    @Input() value: number | string = 0;
    @Input() badgeVariant: BadgeVariant = 'default';
    @Input() icon: LucideIconData = ChartNoAxesColumnDecreasing;

    displayValue: number = 0;
    displayText: string | null = null;
    private animationFrame: number | null = null;

    ngOnInit() {
        if (typeof this.value === 'string') {
            this.displayText = this.value;
            this.displayValue = 0;
            return;
        }

        this.animateValue();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['value']) {
            if (typeof this.value === 'string') {
                this.displayText = this.value;
                if (this.animationFrame) {
                    cancelAnimationFrame(this.animationFrame);
                    this.animationFrame = null;
                }
            } else {
                this.displayText = null;
                if (this.animationFrame) {
                    cancelAnimationFrame(this.animationFrame);
                    this.animationFrame = null;
                }
                this.animateValue();
            }
        }
    }

    ngOnDestroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    private animateValue() {
        const duration = 1500; // 1.5 segundos
        const start = performance.now();
        const startValue = 0;
        const endValue = typeof this.value === 'number' ? this.value : 0;

        const animate = (currentTime: number) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic para suavidad
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            this.displayValue = Math.floor(startValue + (endValue - startValue) * easeProgress);

            if (progress < 1) {
                this.animationFrame = requestAnimationFrame(animate);
            } else {
                this.displayValue = endValue;
            }
        };

        this.animationFrame = requestAnimationFrame(animate);
    }
}