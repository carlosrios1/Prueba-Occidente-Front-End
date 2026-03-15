import { Component } from '@angular/core';
import { LucideAngularModule, Trophy, FileSpreadsheet, BarChart2 } from 'lucide-angular';

@Component({
    selector: 'app-login-hero',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './login-hero.component.html'
})
export class LoginHeroComponent {
    readonly features: { icon: any; title: string; description: string }[] = [
        {
            icon: Trophy,
            title: 'Gestión de Sorteos',
            description: 'Crea, configura y ejecuta sorteos con premios personalizados'
        },
        {
            icon: FileSpreadsheet,
            title: 'Carga de Transacciones',
            description: 'Importa lotes desde Excel de forma rápida y segura'
        },
        {
            icon: BarChart2,
            title: 'Reportes de Ganadores',
            description: 'Exporta resultados en PDF, Excel o consúltalos en pantalla'
        }
    ];
}
