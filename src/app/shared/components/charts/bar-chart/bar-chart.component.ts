import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ChartData {
    name: string;
    value: number;
    fill?: string;
}

@Component({
    selector: 'app-bar-chart',
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
            <div class="flex-1 flex items-end justify-between gap-1 sm:gap-2 relative px-2">
              <!-- Bars -->
              <div *ngFor="let item of data; let i = index" 
                   class="flex-1 flex justify-center group relative min-w-0"
                   style="height: 100%;">
                <!-- Bar Container -->
                <div class="w-full max-w-[32px] sm:max-w-[48px] md:max-w-[60px] flex items-end relative" 
                     style="height: 100%;">
                  <!-- Bar -->
                  <div 
                    class="w-full rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer relative shadow-sm"
                    [ngClass]="getBarClass(item, i)"
                    [ngStyle]="getBarStyle(item, i)">
                    
                    <!-- Value label on hover (desktop) -->
                    <div class="hidden sm:block absolute -top-8 left-1/2 px-2 py-1 border border-stroke dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10"
                         style="transform: translateX(-50%);">
                      <span class="font-medium">{{item.name}}: {{ item.value }}</span>
                      <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>

                    <!-- Value label always visible (mobile) -->
                    <div class="sm:hidden absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-gray-700">
                       {{ item.value }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Labels debajo de las barras -->
            <div class="flex items-center justify-between gap-1 sm:gap-2 mt-2 sm:mt-3 px-2">
              <div *ngFor="let item of data" class="flex-1 text-center min-w-0">
                <span class="text-[10px] sm:text-xs text-gray-600 dark:text-neutral-400 tracking-tight block truncate px-1">
                  {{ item.name }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div *ngIf="showLegend" class="flex flex-wrap gap-3 sm:gap-4 mt-4 sm:mt-6 px-2">
          <div *ngFor="let item of data; let i = index" 
               class="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div 
              class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm flex-shrink-0"
              [ngClass]="getBarClass(item, i, true)"
              [ngStyle]="getLegendStyle(item, i)">
            </div>
            <span class="text-xs sm:text-sm text-gray-700 truncate">{{ item.name }}</span>
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
export class BarChartComponent {
    @Input() data: ChartData[] = [
        { name: 'Jan', value: 186 },
        { name: 'Feb', value: 305 },
        { name: 'Mar', value: 237 },
        { name: 'Apr', value: 273 },
        { name: 'May', value: 209 },
        { name: 'Jun', value: 314 }
    ];
    @Input() title: string | null = null;
    @Input() description: string | null = null;
    @Input() showLegend: boolean = false;
    @Input() height: string = '250px';
    @Input() theme: string = '';

    defaultColors = [
        '#3b82f6',
        '#8b5cf6',
        '#ec4899',
        '#10b981',
        '#f59e0b',
        '#6366f1',
    ];

    get chartHeight(): string {
        return this.height;
    }

    get maxValue(): number {
        const max = Math.max(...this.data.map(item => item.value), 0);
        // Agregar 10% de margen superior
        return Math.ceil((max || 100) * 1.1);
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

    getBarHeightPx(value: number): string {
        const max = this.maxValue;
        if (max === 0 || value === 0) return '8px';
        const percentage = (value / max) * 100;
        return Math.max(percentage, 3) + '%';
    }

    getBarClass(item: ChartData, index: number, isLegend: boolean = false): string {
        // Si hay tema y es una clase de Tailwind
        if (this.theme && !this.theme.startsWith('#')) {
            return this.theme;
        }
        // Si el item tiene fill y es una clase de Tailwind
        if (item.fill && !item.fill.startsWith('#')) {
            return item.fill;
        }
        return '';
    }

    getBarStyle(item: ChartData, index: number): any {
        const style: any = {
            height: this.getBarHeightPx(item.value)
        };

        // Prioridad: 1. item.fill, 2. theme, 3. defaultColors
        if (item.fill && item.fill.startsWith('#')) {
            style['background-color'] = item.fill;
        } else if (this.theme && this.theme.startsWith('#')) {
            style['background-color'] = this.theme;
        } else if (!item.fill && !this.theme) {
            style['background-color'] = this.defaultColors[index % this.defaultColors.length];
        }

        return style;
    }

    getLegendStyle(item: ChartData, index: number): any {
        const style: any = {};

        // Prioridad: 1. item.fill, 2. theme, 3. defaultColors
        if (item.fill && item.fill.startsWith('#')) {
            style['background-color'] = item.fill;
        } else if (this.theme && this.theme.startsWith('#')) {
            style['background-color'] = this.theme;
        } else if (!item.fill && !this.theme) {
            style['background-color'] = this.defaultColors[index % this.defaultColors.length];
        }

        return style;
    }
}

// Ejemplos de uso:
/*
import { Component } from '@angular/core';
import { BarChartComponent } from './bar-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BarChartComponent],
  template: `
    <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div class="max-w-5xl mx-auto space-y-8">
        
        <!-- Ejemplo 1: Altura personalizada y tema con hex -->
        <app-bar-chart 
          [data]="chartData"
          [title]="'Monthly Sales'"
          [description]="'Sales with custom height and hex color'"
          [height]="'300px'"
          [theme]="'#10b981'"
          [showLegend]="true">
        </app-bar-chart>

        <!-- Ejemplo 2: Tema con clase de Tailwind -->
        <app-bar-chart 
          [data]="chartData2"
          [title]="'Weekly Revenue'"
          [description]="'All bars with Tailwind class'"
          [height]="'200px'"
          [theme]="'bg-indigo-500'"
          [showLegend]="false">
        </app-bar-chart>

        <!-- Ejemplo 3: Colores individuales por barra (hex y Tailwind) -->
        <app-bar-chart 
          [data]="chartData3"
          [title]="'Mixed Colors'"
          [description]="'Each bar with custom color'"
          [height]="'350px'"
          [showLegend]="true">
        </app-bar-chart>

        <!-- Ejemplo 4: Altura pequeña -->
        <app-bar-chart 
          [data]="chartData"
          [title]="'Compact Chart'"
          [description]="'Small height example'"
          [height]="'150px'"
          [theme]="'bg-rose-500'">
        </app-bar-chart>

      </div>
    </div>
  `
})
export class AppComponent {
  chartData = [
    { name: 'Jan', value: 186 },
    { name: 'Feb', value: 305 },
    { name: 'Mar', value: 237 },
    { name: 'Apr', value: 273 },
    { name: 'May', value: 209 },
    { name: 'Jun', value: 314 }
  ];

  chartData2 = [
    { name: 'Mon', value: 1200 },
    { name: 'Tue', value: 1800 },
    { name: 'Wed', value: 1500 },
    { name: 'Thu', value: 2100 },
    { name: 'Fri', value: 2400 },
    { name: 'Sat', value: 1900 },
    { name: 'Sun', value: 1300 }
  ];

  chartData3 = [
    { name: 'Product A', value: 450, fill: '#3b82f6' },
    { name: 'Product B', value: 380, fill: 'bg-emerald-500' },
    { name: 'Product C', value: 520, fill: '#ec4899' },
    { name: 'Product D', value: 290, fill: 'bg-amber-500' },
    { name: 'Product E', value: 410, fill: '#8b5cf6' }
  ];
}
*/