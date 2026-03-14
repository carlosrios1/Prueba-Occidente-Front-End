import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DonutDataset {
    name: string;
    value: number;
    color: string;
}

@Component({
    selector: 'app-donut-chart',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="w-full space-y-4">
      <!-- Header -->
      <div class="space-y-1">
        @if (title) {
        <h3 class="text-base sm:text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-slate-100">
          {{ title }}
        </h3>
        }
        @if (description) {
        <p class="text-xs sm:text-sm text-gray-500 dark:text-neutral-400">
          {{ description }}
        </p>
        }
      </div>

      <!-- Chart Container -->
      <div class="w-full flex flex-col items-center">
        <div class="relative" [style.width]="chartSize" [style.height]="chartSize"
             (mouseleave)="clearHoveredSegment()">
          <!-- SVG Donut -->
          <svg 
            class="w-full h-full transform -rotate-90"
            [attr.viewBox]="'0 0 ' + viewBoxSize + ' ' + viewBoxSize">
            
            <!-- Segments -->
            <g *ngFor="let segment of segments; let i = index">
              <!-- Background circle for hover effect -->
              <circle
                [attr.cx]="center"
                [attr.cy]="center"
                [attr.r]="radius"
                fill="none"
                [attr.stroke]="segment.color"
                [attr.stroke-width]="hoveredIndex === i ? strokeWidth + 3 : strokeWidth"
                [attr.stroke-dasharray]="segment.dasharray"
                [attr.stroke-dashoffset]="segment.dashoffset"
                class="transition-all duration-300 cursor-pointer"
                [style.opacity]="hoveredIndex === null || hoveredIndex === i ? 1 : 0.4"
                (mouseenter)="setHoveredSegment(i)">
              </circle>
            </g>
          </svg>

          <!-- Tooltip on hover -->
          <div *ngIf="hoveredIndex !== null"
               class="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-neutral-800 dark:border dark:border-neutral-700 text-white text-xs rounded-lg px-3 py-2 pointer-events-none z-10 whitespace-nowrap shadow-lg">
            <div class="font-medium">{{ segments[hoveredIndex].name }}</div>
            <div class="text-gray-300 mt-0.5">{{ segments[hoveredIndex].value }} ({{ segments[hoveredIndex].percentage }}%)</div>
            <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>

          <!-- Center Content -->
          <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div class="text-center">
              <div class="transition-all duration-300">
                <div class="text-lg sm:text-xl font-bold text-gray-900 dark:text-slate-100">
                  {{ totalValue }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div *ngIf="showLegend" class="w-full mt-6">
          <div class="flex flex-wrap gap-3 justify-center items-center">
            <div *ngFor="let segment of segments; let i = index"
                 class="flex items-center gap-1.5 transition-opacity duration-300 cursor-pointer"
                 [style.opacity]="hoveredIndex === null || hoveredIndex === i ? 1 : 0.4"
                 (mouseenter)="setHoveredSegment(i)"
                 (mouseleave)="clearHoveredSegment()">
              <div 
                class="w-1.5 h-1.5 rounded-full flex-shrink-0"
                [style.background-color]="segment.color">
              </div>
              <span class="text-[11px] sm:text-xs text-gray-600 dark:text-neutral-400">
                {{ segment.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class DonutChartComponent {
    @Input() datasets: DonutDataset[] = [
        { name: 'Desktop', value: 186, color: '#3b82f6' },
        { name: 'Mobile', value: 305, color: '#f59e0b' },
        { name: 'Tablet', value: 237, color: '#10b981' }
    ];
    @Input() title: string | null = null;
    @Input() description: string | null = null;
    @Input() chartSize: string = '280px';
    @Input() showLegend: boolean = true;
    @Input() centerLabel: string = 'Total';
    @Input() strokeWidth: number = 25;

    hoveredIndex: number | null = null;
    viewBoxSize = 200;

    get center(): number {
        return this.viewBoxSize / 2;
    }

    get radius(): number {
        return (this.viewBoxSize - this.strokeWidth) / 2;
    }

    get circumference(): number {
        return 2 * Math.PI * this.radius;
    }

    get totalValue(): number {
        return this.datasets.reduce((sum, item) => sum + item.value, 0);
    }

    get segments(): any[] {
        const total = this.totalValue;
        let currentOffset = 0;

        return this.datasets.map((dataset) => {
            const percentage = ((dataset.value / total) * 100).toFixed(1);
            const segmentLength = (dataset.value / total) * this.circumference;
            const dasharray = `${segmentLength} ${this.circumference - segmentLength}`;
            const dashoffset = -currentOffset;

            currentOffset += segmentLength;

            return {
                name: dataset.name,
                value: dataset.value,
                color: dataset.color,
                percentage: parseFloat(percentage),
                dasharray,
                dashoffset
            };
        });
    }

    setHoveredSegment(index: number): void {
        this.hoveredIndex = index;
    }

    clearHoveredSegment(): void {
        this.hoveredIndex = null;
    }
}

// Ejemplos de uso:
/*
import { Component } from '@angular/core';
import { DonutChartComponent } from './donut-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DonutChartComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div class="max-w-5xl mx-auto space-y-8">
        
        <!-- Ejemplo 1: Distribución de dispositivos -->
        <app-donut-chart 
          [datasets]="devicesData"
          [title]="'Devices Distribution'"
          [description]="'Total visitors by device type'"
          [chartSize]="'300px'"
          [centerLabel]="'Visitors'"
          [showLegend]="true">
        </app-donut-chart>

        <!-- Ejemplo 2: Fuentes de tráfico -->
        <app-donut-chart 
          [datasets]="trafficData"
          [title]="'Traffic Sources'"
          [description]="'Where your traffic comes from'"
          [chartSize]="'280px'"
          [strokeWidth]="50"
          [centerLabel]="'Total Traffic'"
          [showLegend]="true">
        </app-donut-chart>

      </div>
    </div>
  `
})
export class AppComponent {
  devicesData = [
    { name: 'Desktop', value: 186, color: '#3b82f6' },
    { name: 'Mobile', value: 305, color: '#f59e0b' },
    { name: 'Tablet', value: 237, color: '#10b981' }
  ];

  trafficData = [
    { name: 'Organic Search', value: 2450, color: '#3b82f6' },
    { name: 'Direct', value: 1890, color: '#10b981' },
    { name: 'Social Media', value: 1200, color: '#8b5cf6' },
    { name: 'Referral', value: 890, color: '#f59e0b' },
    { name: 'Email', value: 570, color: '#ec4899' }
  ];
}
*/