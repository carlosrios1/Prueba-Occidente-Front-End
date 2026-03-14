// global-dropdown-manager.service.ts
import { Injectable } from '@angular/core';

// Interface para componentes que pueden cerrarse
export interface ClosableComponent {
    componentId: string;
    componentType: 'datepicker' | 'timepicker' | 'select' | 'dropdown';
    closeDropdown(): void;
}

@Injectable({
    providedIn: 'root'
})
export class GlobalDropdownManager {
    private openComponents = new Map<string, ClosableComponent>();

    /**
     * Registra un componente como abierto y cierra todos los demás
     * @param component El componente que se está abriendo
     */
    registerOpen(component: ClosableComponent): void {
        // Cerrar todos los componentes que no sean el actual
        this.openComponents.forEach((openComponent, id) => {
            if (openComponent.componentId !== component.componentId) {
                openComponent.closeDropdown();
            }
        });

        // Limpiar y agregar el nuevo componente abierto
        this.openComponents.clear();
        this.openComponents.set(component.componentId, component);
    }

    /**
     * Desregistra un componente cuando se cierra
     * @param componentId ID del componente a desregistrar
     */
    unregister(componentId: string): void {
        this.openComponents.delete(componentId);
    }

    /**
     * Cierra todos los componentes abiertos
     */
    closeAll(): void {
        this.openComponents.forEach(component => {
            component.closeDropdown();
        });
        this.openComponents.clear();
    }

    /**
     * Verifica si un componente específico está abierto
     * @param componentId ID del componente
     * @returns true si el componente está abierto
     */
    isComponentOpen(componentId: string): boolean {
        return this.openComponents.has(componentId);
    }

    /**
     * Obtiene la cantidad de componentes abiertos
     * @returns Número de componentes abiertos
     */
    getOpenComponentsCount(): number {
        return this.openComponents.size;
    }

    /**
     * Obtiene todos los IDs de componentes abiertos
     * @returns Array de IDs de componentes abiertos
     */
    getOpenComponentIds(): string[] {
        return Array.from(this.openComponents.keys());
    }

    /**
     * Cierra componentes de un tipo específico
     * @param componentType Tipo de componente a cerrar
     */
    closeByType(componentType: ClosableComponent['componentType']): void {
        const toClose: string[] = [];

        this.openComponents.forEach((component, id) => {
            if (component.componentType === componentType) {
                component.closeDropdown();
                toClose.push(id);
            }
        });

        // Remover de la lista
        toClose.forEach(id => this.openComponents.delete(id));
    }
}