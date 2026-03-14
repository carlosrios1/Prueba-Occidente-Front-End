import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberFormat',
    standalone: true
})
export class NumberFormatPipe implements PipeTransform {
    transform(value: number): string {
        if (value === null || value === undefined) return '0';

        const absValue = Math.abs(value);

        // Millones
        if (absValue >= 1000000) {
            return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }

        // Miles
        if (absValue >= 1000) {
            return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }

        // Números menores con comas
        return value.toLocaleString('es-HN');
    }
}