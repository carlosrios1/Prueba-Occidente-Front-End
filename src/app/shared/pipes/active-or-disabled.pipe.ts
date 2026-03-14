import { Pipe, PipeTransform } from '@angular/core';
import { CircleCheck, icons, TriangleAlert } from 'lucide-angular';

export interface AppStatusBadge {
    variant: 'success' | 'warning';
    icon: any;
    label: string;
}

@Pipe({
    name: 'appStatus',
    standalone: true
})
export class AppStatusPipe implements PipeTransform {
    readonly icons = {
        CircleCheck,
        TriangleAlert
    };
    transform(active: boolean): AppStatusBadge {
        return {
            variant: active ? 'success' : 'warning',
            icon: active ? this.icons.CircleCheck : this.icons.TriangleAlert,
            label: active ? 'Activo' : 'Bloqueado'
        };
    }
}
