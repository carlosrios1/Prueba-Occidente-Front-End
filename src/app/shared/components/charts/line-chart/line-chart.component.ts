import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ChartData {
    name: string;
    value: number;
}

export interface ChartConfig {
    [key: string]: {
        label: string;
        color: string;
    };
}

@Component({
    selector: 'app-line-chart',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="w-full">
      <!-- Header -->
      <div class="flex flex-col space-y-1.5 pb-6">
        <h3 class="text-2xl font-semibold leading-none tracking-tight">
          {{ title }}
        </h3>
        <p class="text-sm text-slate-500">
          {{ description }}
        </p>
      </div>

      <!-- Chart Container -->
      <div class="relative w-full" [style.height.px]="height">
        <!-- Y-axis labels -->
        <div class="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-500 pr-2">
          <span *ngFor="let label of yAxisLabels">{{ label }}</span>
        </div>

        <!-- Chart Area -->
        <div class="ml-12 h-full relative border-l border-b border-slate-200">
          <!-- Grid lines -->
          <svg class="absolute inset-0 w-full h-full pointer-events-none">
            <line
              *ngFor="let y of gridLines"
              [attr.x1]="0"
              [attr.y1]="y"
              [attr.x2]="'100%'"
              [attr.y2]="y"
              class="stroke-slate-200"
              stroke-width="1"
            />
          </svg>

          <!-- Line Chart SVG -->
          <svg class="absolute inset-0 w-full h-full">
            <!-- Gradient Definition -->
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" [attr.stop-color]="lineColor" stop-opacity="0.3"/>
                <stop offset="95%" [attr.stop-color]="lineColor" stop-opacity="0"/>
              </linearGradient>
            </defs>

            <!-- Area under the line -->
            <path
              [attr.d]="areaPath"
              fill="url(#chartGradient)"
            />

            <!-- Line -->
            <path
              [attr.d]="linePath"
              fill="none"
              [attr.stroke]="lineColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <!-- Data points -->
            <circle
              *ngFor="let point of points"
              [attr.cx]="point.x"
              [attr.cy]="point.y"
              r="4"
              [attr.fill]="lineColor"
              class="cursor-pointer hover:r-6 transition-all"
              (mouseenter)="showTooltip($event, point)"
              (mouseleave)="hideTooltip()"
            />
          </svg>

          <!-- Tooltip -->
          <div
            *ngIf="tooltip.visible"
            class="absolute bg-slate-900 text-white text-xs rounded px-2 py-1 pointer-events-none z-10"
            [style.left.px]="tooltip.x"
            [style.top.px]="tooltip.y"
          >
            <div class="font-semibold">{{ tooltip.label }}</div>
            <div>{{ tooltip.value }}</div>
          </div>
        </div>

        <!-- X-axis labels -->
        <div class="ml-12 mt-2 flex justify-between text-xs text-slate-500">
          <span *ngFor="let label of xAxisLabels">{{ label }}</span>
        </div>
      </div>

      <!-- Footer -->
      <div *ngIf="footer" class="flex items-center pt-6 text-sm text-slate-500">
        {{ footer }}
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
      font-family: system-ui, -apple-system, sans-serif;
    }
  `]
})
export class LineChartComponent implements OnInit, OnChanges {
    @Input() title: string = 'Line Chart';
    @Input() description: string = 'Showing data over time';
    @Input() footer?: string;
    @Input() data: ChartData[] = [];
    @Input() height: number = 300;
    @Input() lineColor: string = '#2563eb';
    @Input() showGrid: boolean = true;
    @Input() dataKey: string = 'value';
    @Input() nameKey: string = 'name';

    linePath: string = '';
    areaPath: string = '';
    points: Array<{ x: number; y: number; data: ChartData }> = [];
    xAxisLabels: string[] = [];
    yAxisLabels: string[] = [];
    gridLines: number[] = [];

    tooltip = {
        visible: false,
        x: 0,
        y: 0,
        label: '',
        value: ''
    };

    ngOnInit() {
        this.calculateChart();
    }

    ngOnChanges() {
        this.calculateChart();
    }

    calculateChart() {
        if (!this.data || this.data.length === 0) return;

        const values = this.data.map(d => d.value);
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);
        const range = maxValue - minValue || 1;

        // Calculate Y-axis labels
        const steps = 5;
        this.yAxisLabels = [];
        this.gridLines = [];
        for (let i = 0; i <= steps; i++) {
            const value = maxValue - (range * i / steps);
            this.yAxisLabels.push(Math.round(value).toString());
            this.gridLines.push((this.height * i / steps));
        }

        // Calculate X-axis labels (show every nth label to avoid crowding)
        const labelStep = Math.ceil(this.data.length / 6);
        this.xAxisLabels = this.data.map((d, i) =>
            i % labelStep === 0 ? d.name : ''
        );

        // Calculate points
        const padding = 20;
        const chartWidth = 800; // Approximate width
        const stepX = (chartWidth - padding * 2) / (this.data.length - 1 || 1);

        this.points = this.data.map((d, i) => {
            const x = padding + (i * stepX);
            const normalizedValue = (d.value - minValue) / range;
            const y = this.height - (normalizedValue * (this.height - padding * 2)) - padding;
            return { x, y, data: d };
        });

        // Create line path
        this.linePath = this.points.reduce((path, point, i) => {
            const command = i === 0 ? 'M' : 'L';
            return `${path} ${command} ${point.x} ${point.y}`;
        }, '');

        // Create area path
        this.areaPath = this.linePath +
            ` L ${this.points[this.points.length - 1].x} ${this.height}` +
            ` L ${this.points[0].x} ${this.height} Z`;
    }

    showTooltip(event: MouseEvent, point: { x: number; y: number; data: ChartData }) {
        this.tooltip = {
            visible: true,
            x: point.x + 10,
            y: point.y - 30,
            label: point.data.name,
            value: point.data.value.toString()
        };
    }

    hideTooltip() {
        this.tooltip.visible = false;
    }
}
