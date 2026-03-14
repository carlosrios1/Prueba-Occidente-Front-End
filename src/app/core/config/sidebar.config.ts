// src/app/core/config/sidebar.config.ts
import {
    LayoutDashboard,
    AppWindow,
    Server,
    Monitor,
    Layers,
    Code,
    User,
    Users,
    Image,
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
        label: 'Principal',
        items: [
            {
                name: 'home',
                label: 'Dashboard',
                link: '/home',
                icon: LayoutDashboard,
                aria: 'Ir a Dashboard',
            },
            {
                name: 'aplicativos',
                label: 'Aplicativos',
                link: '/apps',
                icon: AppWindow,
                aria: 'Ir a Aplicativos',
            },
            {
                name: 'servidores',
                label: 'Servidores',
                link: '/servers',
                icon: Server,
                aria: 'Ir a Servidores',
            },
            {
                name: 'foro',
                label: 'Foro',
                link: '/foro',
                icon: Image,
                aria: 'Ir a Foro',
            },
        ],
    },
    secondary:
    {
        label: 'Configuración',
        items: [
            {
                name: 'os',
                label: 'SO', // versión corta de Sistemas Operativos
                link: '/operating-systems',
                icon: Monitor,
                aria: 'Ir a Sistemas Operativos',
            },
            {
                name: 'ambientes',
                label: 'Ambientes',
                link: '/environments',
                icon: Layers,
                aria: 'Ir a Ambientes',
            },
            {
                name: 'tecnologias',
                label: 'Tecnologías',
                link: '/technologies',
                icon: Code,
                aria: 'Ir a Tecnologías',
            },
            {
                name: 'usuarios',
                label: 'Usuarios',
                link: '/users',
                icon: Users,
                aria: 'Ir a Usuarios',
            },
        ],
    },
};
