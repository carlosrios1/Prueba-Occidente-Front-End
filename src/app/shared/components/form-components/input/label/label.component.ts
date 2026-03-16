/**
 * Label Component
 * 
 * Componente de etiqueta para inputs con soporte para estado requerido.
 * 
 * 
 */

import { Component, Input } from '@angular/core';
import { LabelTheme } from '../shared/theme.config';

@Component({
    selector: 'app-label',
    standalone: true,
    imports: [],
    templateUrl: './label.component.html'
})
export class LabelComponent {
    // ============================================
    // INPUTS - Configuración del componente
    // ============================================

    /** Texto de la etiqueta */
    @Input() label: string = '';

    /** ID del input asociado */
    @Input() for: string = '';

    /** Si el campo es requerido (muestra asterisco) */
    @Input() required: boolean = false;

    /** Tamaño del label */
    @Input() size: 'small' | 'medium' | 'large' = 'medium';

    // ============================================
    // GETTERS - Propiedades computadas
    // ============================================

    /**
     * Genera las clases del label
     */
    get labelClass(): string {
        const baseClasses = 'block font-medium';
        const sizeClasses = this.getSizeClasses();

        return `${baseClasses} ${sizeClasses} ${LabelTheme.colors.text.default}`.trim();
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