/**
 * Input Wrapper Component
 * 
 * Componente wrapper que agrupa label, input y mensaje de error.
 * Facilita la creación de campos de formulario completos.
 * 
 * @author Hector Varela
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-input-wrapper',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './input-wrapper.component.html'
})
export class InputWrapperComponent {
    // ============================================
    // INPUTS - Configuración del componente
    // ============================================

    /** Espaciado entre elementos */
    @Input() spacing: 'none' | 'small' | 'medium' | 'large' = 'small';

    /** Si el wrapper ocupa el ancho completo */
    @Input() fullWidth: boolean = true;

    /** Clase CSS adicional */
    @Input() customClass: string = '';

    // ============================================
    // GETTERS - Propiedades computadas
    // ============================================

    /**
     * Genera las clases del wrapper
     */
    get wrapperClass(): string {
        const baseClasses = 'flex flex-col';
        const widthClass = this.fullWidth ? 'w-full' : '';
        const spacingClasses = this.getSpacingClasses();

        return `${baseClasses} ${widthClass} ${spacingClasses} ${this.customClass}`.trim();
    }

    // ============================================
    // MÉTODOS PRIVADOS
    // ============================================

    /**
     * Genera las clases de espaciado
     */
    private getSpacingClasses(): string {
        switch (this.spacing) {
            case 'none':
                return '';
            case 'small':
                return 'gap-1';
            case 'medium':
                return 'gap-2';
            case 'large':
                return 'gap-4';
            default:
                return 'gap-2';
        }
    }
}