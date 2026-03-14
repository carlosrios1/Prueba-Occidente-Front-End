import { Pipe, PipeTransform } from '@angular/core';
import { BadgeVariant } from '../../components/badge/badge.config';

@Pipe({
    name: 'badgeVariant',
    standalone: true
})
export class BadgeVariantPipe implements PipeTransform {
    transform(typeId: number): BadgeVariant {
        const variants: Record<number, BadgeVariant> = {
            1: 'info',      // Windows
            2: 'warning',   // Linux
            3: 'success',   // Unix
            4: 'purple',    // macOS
            5: 'orange',    // BSD
            6: 'cyan',      // Other
        };
        return variants[typeId] || 'neutral';
    }
}