import { Component } from '@angular/core';
import { LucideAngularModule, Shield, CreditCard, Smartphone } from 'lucide-angular';

@Component({
    selector: 'app-login-hero',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './login-hero.component.html'
})
export class LoginHeroComponent {
    readonly Shield = Shield;
    readonly CreditCard = CreditCard;
    readonly Smartphone = Smartphone;

    readonly features: { icon: any; title: string; description: string }[] = [
        {
            icon: Shield,
            title: 'Seguridad Garantizada',
            description: 'Protegemos tu información con la mejor tecnología'
        },
        {
            icon: CreditCard,
            title: 'Gestiona tus Cuentas',
            description: 'Consulta saldos, movimientos y transferencias'
        },
        {
            icon: Smartphone,
            title: 'Disponible 24/7',
            description: 'Accede cuando quieras, donde quieras'
        }
    ];
}
