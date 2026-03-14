import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ChartDataset {
    name: string;
    color: string;
    data: number[];
}

@Component({
    selector: 'app-area-chart',
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
        <p class="text-xs sm:text-sm text-gray-500 dark:text-neutral">
          {{ description }}
        </p>
        }
      </div>

      <!-- Chart Container -->
      <div class="w-full">
        <div class="flex aspect-auto w-full" [style.height]="chartHeight">
          <!-- Y-axis labels -->
          <div class="flex flex-col justify-between text-[10px] sm:text-xs text-gray-500 pr-2 sm:pr-3 py-1">
            <span *ngFor="let label of yAxisLabels" class="text-right dark:text-neutral-400">{{ label }}</span>
          </div>

          <!-- Chart Area -->
          <div class="flex-1 flex flex-col relative">
            <div class="flex-1 relative px-2">
              <!-- SVG Chart -->
              <svg 
                class="w-full h-full overflow-visible" 
                preserveAspectRatio="none"
                [attr.viewBox]="'0 0 ' + svgWidth + ' ' + svgHeight">
                
                <!-- Gradient definitions for each dataset -->
                <defs>
                  <linearGradient *ngFor="let dataset of datasets; let i = index"
                                  [id]="'gradient-' + i" 
                                  x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" [attr.stop-color]="dataset.color" stop-opacity="0.8"/>
                    <stop offset="100%" [attr.stop-color]="dataset.color" stop-opacity="0"/>
                  </linearGradient>
                </defs>

                <!-- Render areas from back to front (reversed order for stacking) -->
                <g *ngFor="let dataset of datasets; let i = index">
                  <!-- Area fill -->
                  <path
                    [attr.d]="getAreaPath(dataset, i)"
                    [attr.fill]="'url(#gradient-' + i + ')'"
                    class="transition-all duration-300">
                  </path>

                  <!-- Line stroke -->
                  <path
                    [attr.d]="getLinePath(dataset, i)"
                    fill="none"
                    [attr.stroke]="dataset.color"
                    stroke-width="5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="transition-all duration-300">
                  </path>
                </g>
              </svg>

              <!-- Tooltip -->
              <div *ngIf="activePointIndex !== null"
                   class="absolute bg-gray-900 dark:bg-neutral-800 text-white dark:text-neutral-100 text-xs rounded-lg border dark:border-neutral-700 px-3 py-2 pointer-events-none z-10 whitespace-nowrap shadow-lg"
                   [style.left.%]="tooltipPosition.x"
                   [style.top.px]="tooltipPosition.y"
                   style="transform: translateX(-50%);">
                <div class="font-medium mb-1">{{ labels[activePointIndex] }}</div>
                <div *ngFor="let dataset of datasets" class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full" [style.background-color]="dataset.color"></div>
                  <span class="text-gray-300">{{ dataset.name }}: {{ dataset.data[activePointIndex] }}</span>
                </div>
                <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>

              <!-- Interactive overlay -->
              <div class="absolute inset-0 flex px-2">
                <div *ngFor="let label of labels; let i = index"
                     class="flex-1 cursor-pointer"
                     (mouseenter)="setActivePoint(i)"
                     (mouseleave)="clearActivePoint()">
                </div>
              </div>
            </div>
            
            <!-- X-axis labels -->
            <div class="flex items-center justify-between mt-2 sm:mt-3 px-2">
              <div *ngFor="let label of labels; let i = index" 
                   class="text-center flex-1">
                <span *ngIf="shouldShowLabel(i)" 
                      class="text-[10px] sm:text-xs text-gray-600 dark:text-neutral-400 tracking-tight">
                  {{ label }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div *ngIf="showLegend" class="flex flex-wrap gap-3 sm:gap-4 mt-4 sm:mt-6 px-2">
          <div *ngFor="let dataset of datasets" 
               class="flex items-center gap-1.5 sm:gap-2">
            <div 
              class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm flex-shrink-0"
              [style.background-color]="dataset.color">
            </div>
            <span class="text-xs sm:text-sm text-gray-700 dark:text-neutral-300">{{ dataset.name }}</span>
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
export class AreaChartComponent {
    @Input() datasets: ChartDataset[] = [
        {
            name: 'Desktop',
            color: '#d4a574',
            data: [10, 25, 35, 42, 48, 52]
        },
        {
            name: 'Mobile',
            color: '#8b9d83',
            data: [5, 15, 22, 28, 32, 35]
        }
    ];
    @Input() labels: string[] = ['Ene', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    @Input() title: string | null = null;
    @Input() description: string | null = null;
    @Input() height: string = '250px';
    @Input() showLegend: boolean = true;
    @Input() curveType: 'linear' | 'smooth' = 'smooth';
    @Input() stacked: boolean = false; // Si es true, apila las áreas; si es false, las superpone

    activePointIndex: number | null = null;
    svgWidth = 1000;
    svgHeight = 400;

    get chartHeight(): string {
        return this.height;
    }

    get maxValue(): number {
        let max = 0;
        if (this.stacked) {
            this.datasets[0].data.forEach((_, index) => {
                const stackedValue = this.getStackedValue(index);
                if (stackedValue > max) max = stackedValue;
            });
        } else {
            this.datasets.forEach(dataset => {
                dataset.data.forEach(value => {
                    if (value > max) max = value;
                });
            });
        }
        return Math.ceil((max || 100) * 1.15); // 15% margen para evitar cortes
    }

    get yAxisLabels(): number[] {
        const max = this.maxValue;
        return [
            max,
            Math.floor(max * 0.8),
            Math.floor(max * 0.6),
            Math.floor(max * 0.4),
            Math.floor(max * 0.2),
            0
        ];
    }

    getStackedValue(index: number): number {
        return this.datasets.reduce((sum, dataset) => sum + dataset.data[index], 0);
    }

    getStackedValueUpTo(datasetIndex: number, pointIndex: number): number {
        let sum = 0;
        for (let i = 0; i <= datasetIndex; i++) {
            sum += this.datasets[i].data[pointIndex];
        }
        return sum;
    }

    getPoints(dataset: ChartDataset, datasetIndex: number): { x: number; y: number }[] {
        const max = this.maxValue;
        const spacing = this.svgWidth / (dataset.data.length - 1 || 1);

        return dataset.data.map((value, index) => {
            let yValue = value;
            if (this.stacked) {
                yValue = this.getStackedValueUpTo(datasetIndex, index);
            }
            return {
                x: index * spacing,
                y: this.svgHeight - (yValue / max) * this.svgHeight
            };
        });
    }

    getBaselinePoints(datasetIndex: number): { x: number; y: number }[] {
        const dataLength = this.datasets[0]?.data?.length || 0;
        const spacing = this.svgWidth / (dataLength - 1 || 1);

        if (!this.stacked || datasetIndex === 0) {
            // First dataset or non-stacked, baseline is bottom
            return Array.from({ length: dataLength }, (_, index) => ({
                x: index * spacing,
                y: this.svgHeight
            }));
        }

        // Stacked: baseline is top of previous dataset
        return this.getPoints(this.datasets[datasetIndex - 1], datasetIndex - 1);
    }

    getLinePath(dataset: ChartDataset, datasetIndex: number): string {
        const points = this.getPoints(dataset, datasetIndex);
        if (points.length === 0) return '';

        if (this.curveType === 'linear') {
            const [first, ...rest] = points;
            let path = `M ${first.x} ${first.y}`;
            rest.forEach(point => {
                path += ` L ${point.x} ${point.y}`;
            });
            return path;
        }

        // Smooth curve using cardinal spline
        return this.createSmoothPath(points);
    }

    getAreaPath(dataset: ChartDataset, datasetIndex: number): string {
        const topPoints = this.getPoints(dataset, datasetIndex);
        const bottomPoints = this.getBaselinePoints(datasetIndex);

        if (topPoints.length === 0 || bottomPoints.length === 0) return '';

        let path = '';

        if (this.curveType === 'linear') {
            // Draw top line
            path = `M ${topPoints[0].x} ${topPoints[0].y}`;
            for (let i = 1; i < topPoints.length; i++) {
                path += ` L ${topPoints[i].x} ${topPoints[i].y}`;
            }

            // Connect to last bottom point
            const lastBottom = bottomPoints[bottomPoints.length - 1];
            path += ` L ${lastBottom.x} ${lastBottom.y}`;

            // Draw bottom line (reversed, skipping last point as we already connected to it)
            for (let i = bottomPoints.length - 2; i >= 0; i--) {
                path += ` L ${bottomPoints[i].x} ${bottomPoints[i].y}`;
            }

            // Close path back to first top point
            path += ` L ${topPoints[0].x} ${topPoints[0].y}`;
        } else {
            // Draw smooth top line
            path = this.createSmoothPath(topPoints);

            // Connect to last bottom point with a straight line
            const lastTop = topPoints[topPoints.length - 1];
            const lastBottom = bottomPoints[bottomPoints.length - 1];
            path += ` L ${lastBottom.x} ${lastBottom.y}`;

            // Draw smooth bottom line (reversed)
            const reversedBottom = [...bottomPoints].reverse().slice(1); // Skip last point (already connected)
            if (reversedBottom.length > 0) {
                const bottomPath = this.createSmoothPath(reversedBottom, true);
                path += ' ' + bottomPath.substring(1); // Remove 'M' from bottom path
            }

            // Close path back to first point
            const firstBottom = bottomPoints[0];
            path += ` L ${firstBottom.x} ${firstBottom.y}`;
        }

        path += ' Z';
        return path;
    }

    createSmoothPath(points: { x: number; y: number }[], isReverse: boolean = false): string {
        if (points.length === 0) return '';
        if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
        if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

        let path = `M ${points[0].x} ${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const current = points[i];
            const next = points[i + 1];

            if (i === 0) {
                // First segment
                const afterNext = points[i + 2] || next;
                const cp1x = current.x + (next.x - current.x) / 3;
                const cp1y = current.y + (next.y - current.y) / 3;
                const cp2x = next.x - (afterNext.x - current.x) / 6;
                const cp2y = next.y - (afterNext.y - current.y) / 6;
                path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
            } else if (i === points.length - 2) {
                // Last segment
                const prev = points[i - 1];
                const cp1x = current.x + (next.x - prev.x) / 6;
                const cp1y = current.y + (next.y - prev.y) / 6;
                const cp2x = next.x - (next.x - current.x) / 3;
                const cp2y = next.y - (next.y - current.y) / 3;
                path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
            } else {
                // Middle segments
                const prev = points[i - 1];
                const afterNext = points[i + 2];
                const cp1x = current.x + (next.x - prev.x) / 6;
                const cp1y = current.y + (next.y - prev.y) / 6;
                const cp2x = next.x - (afterNext.x - current.x) / 6;
                const cp2y = next.y - (afterNext.y - current.y) / 6;
                path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
            }
        }

        return path;
    }

    get tooltipPosition(): { x: number; y: number } {
        if (this.activePointIndex === null) return { x: 0, y: 0 };

        const spacing = this.svgWidth / (this.labels.length - 1 || 1);
        const x = this.activePointIndex * spacing;

        return {
            x: (x / this.svgWidth) * 100,
            y: 10
        };
    }

    shouldShowLabel(index: number): boolean {
        const totalLabels = this.labels.length;
        if (totalLabels <= 6) return true;
        if (totalLabels <= 12) return index % 2 === 0;
        return index % 3 === 0 || index === totalLabels - 1;
    }

    setActivePoint(index: number): void {
        this.activePointIndex = index;
    }

    clearActivePoint(): void {
        this.activePointIndex = null;
    }
}

