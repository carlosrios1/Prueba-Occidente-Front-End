import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Users } from 'lucide-angular';


@Component({
    selector: 'app-table-skeleton',
    standalone: true,
    imports: [
        CommonModule,
        LucideAngularModule
    ],
    templateUrl: './table-skeleton.component.html',

})
export class TableSkeletonComponent {
    readonly tableHeaders: string[] = [
        '#Cliente',
        'Nombre Cliente',
        'F.Nacimiento',
        'F.Creación',
        'Contacto',
        'Ubicación',
        'Región',
        'Ingreso',
        'Pep',
        'Genero',
        'Agencia'
    ];
}