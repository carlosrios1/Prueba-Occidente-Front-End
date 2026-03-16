/**
 * Input Error Component
 * 
 * Componente para mostrar mensajes de error debajo de inputs.
 * 
 * 
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-input-error',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './input-error.component.html'
})
export class InputErrorComponent {
    // ============================================
    // INPUTS - Configuración del componente
    // ============================================

    /** Mensaje de error a mostrar */
    @Input() error: string = '';

    /** Si se debe mostrar el error */
    @Input() show: boolean = false;

    /** Tamaño del texto de error */
    @Input() size: 'small' | 'medium' | 'large' = 'medium';

    // ============================================
    // GETTERS - Propiedades computadas
    // ============================================

    /**
     * Genera las clases del texto de error
     */
    get errorClass(): string {
        const baseClasses = 'text-red-500 dark:text-red-400 mt-1.5 block';
        const sizeClasses = this.getSizeClasses();

        return `${baseClasses} ${sizeClasses}`.trim();
    }

    // ============================================
    // MÉTODOS PRIVADOS
    // ============================================

    /**
     * Genera las clases de tamaño
     */
    private getSizeClasses(): string {
        switch (this.size) {
            case 'small':
                return 'text-xs';
            case 'medium':
                return 'text-sm';
            case 'large':
                return 'text-base';
            default:
                return 'text-sm';
        }
    }
}