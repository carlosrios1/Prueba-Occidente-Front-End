// src/app/core/config/sidebar.config.ts
import {
    Trophy,
    Layers,
    Shuffle,
    FileText,
    Code,
} from 'lucide-angular';
import { NavItem } from '../layout/default-layout/sidebar/components/sidebar-nav-item.component';


interface SidebarItemsConfig {
    label: string;
    items: NavItem[];
}

export const SIDEBAR_CONFIG: {
    principal: SidebarItemsConfig;
    secondary: SidebarItemsConfig;
} = {
    principal:
    {
        label: 'Sorteos',
        items: [
            {
                name: 'lots',
                label: 'Transacciones',
                link: '/lots',
                icon: Layers,
                aria: 'Ir a Transacciones',
            },
            {
                name: 'giveaways',
                label: 'Sorteos',
                link: '/giveaways',
                icon: Shuffle,
                aria: 'Ir a Sorteos',
            },
            {
                name: 'awards',
                label: 'Premios',
                link: '/awards',
                icon: Trophy,
                aria: 'Ir a Premios',
            },
            {
                name: 'reports',
                label: 'Reportes',
                link: '/reports/transactions',
                icon: FileText,
                aria: 'Ir a Reportes',
            },
        ],
    },
    secondary:
    {
        label: 'Otros',
        items: [
            {
                name: 'tecnologias',
                label: 'Tecnologías',
                link: '/technologies',
                icon: Code,
                aria: 'Ir a Tecnologías',
            },
        ],
    },
};
