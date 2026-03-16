/**
 * Button Component
 * 
 * Componente de botón reutilizable con múltiples variantes, apariencias y tamaños.
 * Incluye soporte para iconos, estados de carga, y accesibilidad completa.
 * 
 * 
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideIconData, LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './button.component.html'
})
export class ButtonComponent {
    // ============================================
    // INPUTS - Configuración del componente
    // ============================================

    /** Estado deshabilitado del botón */
    @Input() disabled: boolean = false;

    /** Variante de color del botón */
    @Input() variant: 'primary' | 'secondary' | 'neutral' | 'default' | 'danger' | 'success' | 'black' | 'black-inverted' | 'orange' = 'default';

    /** Estilo de apariencia del botón */
    @Input() appearance: 'solid' | 'soft' | 'outline' | 'text' = 'solid';

    /** Tamaño del botón */
    @Input() size: 'small' | 'medium' | 'large' | null = null;

    /** Radio de borde redondeado */
    @Input() rounded: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';

    /** Si el botón ocupa el ancho completo del contenedor */
    @Input() fullWidth: boolean = false;

    /** Centrar elementos (actualmente sin uso) */
    @Input() itemsCenter: boolean = false;

    /** Estado de carga del botón */
    @Input() loading: boolean = false;

    /** Tipo HTML del botón */
    @Input() type: 'button' | 'submit' | 'reset' = 'button';

    /** Icono del botón (Lucide) */
    @Input() icon: LucideIconData | null = null;

    /** Posición del icono */
    @Input() iconPosition: 'left' | 'right' = 'left';

    /** Texto del tooltip */
    @Input() tooltip: string = 'button';

    @Input() loadingText: string = 'Cargando';

    /** Si el botón es cuadrado (mismo ancho y alto) */
    @Input() square: boolean = false;

    // ============================================
    // OUTPUTS - Eventos del componente
    // ============================================

    /** Evento al hacer click */
    @Output() onClick = new EventEmitter<void>();

    /** Evento al presionar una tecla */
    @Output() onKeyDown = new EventEmitter<void>();

    /** Evento al presionar una tecla (deprecated) */
    @Output() onKeyPress = new EventEmitter<void>();

    /** Evento al soltar una tecla */
    @Output() onKeyUp = new EventEmitter<void>();

    /** Evento al perder el foco */
    @Output() onBlur = new EventEmitter<void>();

    /** Evento al recibir el foco */
    @Output() onFocus = new EventEmitter<void>();

    // ============================================
    // GETTERS - Propiedades computadas
    // ============================================

    /**
     * Calcula el estado deshabilitado final
     * El botón está deshabilitado si está en loading o disabled
     */
    get disabledState(): boolean {
        return this.loading || this.disabled;
    }

    /**
     * Genera todas las clases CSS del botón
     * Combina clases base, tamaño, variante, redondeado y ancho
     */
    get finalClass(): string {
        const baseClasses = 'inline-flex items-center drop-shadow-sm gap-3 font-medium transition-[background-color,color,opacity,transform] [transition:background-color_500ms,color_500ms,transform_150ms] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 focus:outline-none focus-visible:ring-1';
        const roundedClasses = this.getRoundedClasses();
        const sizeClasses = this.getSizeClasses();
        const variantClasses = this.getVariantClasses();
        const widthClass = this.fullWidth ? 'w-full' : '';
        const centerClass = this.itemsCenter || this.square ? 'justify-center' : '';

        return `${baseClasses} ${roundedClasses} ${sizeClasses} ${variantClasses} ${widthClass} ${centerClass}`.trim();
    }

    /**
     * Calcula el tamaño del icono según el tamaño del botón
     */
    get iconSize(): string {
        switch (this.size) {
            case 'small':
                return 'size-4';
            case 'medium':
                return 'size-5';
            case 'large':
                return 'size-6';
            default:
                return 'size-4';
        }
    }

    // ============================================
    // MÉTODOS PRIVADOS - Generación de clases
    // ============================================

    /**
     * Genera las clases de tamaño (padding y texto)
     */
    private getSizeClasses(): string {
        if (this.square) {
            switch (this.size) {
                case 'small':
                    return 'w-8 h-8 p-0 text-xs';
                case 'medium':
                    return 'w-10 h-10 p-0 text-base';
                case 'large':
                    return 'w-12 h-12 p-0 text-lg';
                default:
                    return 'w-9 h-9 p-0 text-sm';
            }
        }

        switch (this.size) {
            case 'small':
                return 'px-3 py-1.5 text-xs';
            case 'medium':
                return 'px-4 py-2.5 text-base';
            case 'large':
                return 'px-6 py-3 text-lg';
            default:
                return 'px-4 py-2 text-sm';
        }
    }

    /**
     * Genera las clases de borde redondeado
     */
    private getRoundedClasses(): string {
        switch (this.rounded) {
            case 'none':
                return 'rounded-none';
            case 'sm':
                return 'rounded-sm';
            case 'md':
                return 'rounded-md';
            case 'lg':
                return 'rounded-lg';
            case 'xl':
                return 'rounded-xl';
            case 'full':
                return 'rounded-full';
            default:
                return 'rounded-md';
        }
    }

    /**
     * Genera las clases de variante según la apariencia
     * Combina variant (color) con appearance (estilo)
     */
    private getVariantClasses(): string {
        // ==========================================
        // SOLID APPEARANCE
        // ==========================================
        if (this.appearance === 'solid') {
            switch (this.variant) {
                case 'primary':
                    return 'bg-violet-500 text-white hover:bg-violet-600 dark:text-neutral-200 dark:bg-violet-700 dark:hover:bg-violet-800';
                case 'secondary':
                    return 'bg-neutral-500 text-white hover:bg-neutral-600 dark:text-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-800';
                case 'neutral':
                    return 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600';
                case 'danger':
                    return 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700';
                case 'success':
                    return 'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700';
                case 'default':
                    return 'bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 dark:bg-neutral-700/15 dark:text-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800';
                case 'black':
                    return 'bg-neutral-950 text-neutral-100 hover:bg-neutral-800 dark:bg-neutral-700/15 dark:text-neutral-100 dark:border dark:border-neutral-800 dark:hover:bg-neutral-800';
                case 'black-inverted':
                    return 'bg-neutral-900 text-neutral-100 border border-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:border dark:border-neutral-200 dark:hover:bg-neutral-200';
                case 'orange':
                    return 'bg-orangeBO text-white hover:bg-orangeBO/85 active:bg-orangeBO/75 dark:bg-orangeBO dark:hover:bg-orangeBO/85 focus-visible:ring-orangeBO/50';
                default:
                    return 'bg-white text-neutral-900 border border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-700 dark:active:bg-neutral-600';
            }
        }

        // ==========================================
        // SOFT APPEARANCE
        // ==========================================
        if (this.appearance === 'soft') {
            switch (this.variant) {
                case 'primary':
                    return 'bg-violet-100 text-violet-500 hover:bg-violet-200 dark:bg-violet-500/10 dark:text-violet-500 dark:hover:bg-violet-500/25 focus-visible:ring-violet-500/50';
                case 'secondary':
                    return 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-500/10 dark:text-neutral-400 dark:hover:bg-neutral-500/25 focus-visible:ring-neutral-500/50';
                case 'neutral':
                    return 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-500/10 dark:text-neutral-300 dark:hover:bg-neutral-700 focus-visible:ring-neutral-500/50';
                case 'danger':
                    return 'bg-red-100 text-red-500 hover:bg-red-200 dark:bg-red-500/10 dark:text-red-500 dark:hover:bg-red-500/25 focus-visible:ring-red-500/50';
                case 'success':
                    return 'bg-green-100 text-green-500 hover:bg-green-200 dark:bg-green-500/10 dark:text-green-500 dark:hover:bg-green-500/25 focus-visible:ring-green-500/50';
                case 'default':
                    return 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:active:bg-neutral-600';
                case 'black':
                    return 'bg-neutral-950/10 text-neutral-500 hover:bg-neutral-950/20 dark:bg-neutral-700/15 dark:text-neutral-100 dark:border dark:border-neutral-800 dark:hover:bg-neutral-800';
                case 'orange':
                    return 'bg-orange-100 text-orangeBO hover:bg-orange-200 active:bg-orange-300 dark:bg-orangeBO/10 dark:text-orangeBO dark:hover:bg-orangeBO/25 focus-visible:ring-orangeBO/50';
                default:
                    return 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:active:bg-neutral-600';
            }
        }

        // ==========================================
        // OUTLINE APPEARANCE
        // ==========================================
        if (this.appearance === 'outline') {
            switch (this.variant) {
                case 'primary':
                    return 'bg-transparent text-violet-500 border border-violet-500 hover:bg-violet-50 active:bg-violet-100 dark:text-violet-500 dark:border-violet-500 dark:hover:bg-violet-500/10 dark:active:bg-violet-500/20';
                case 'secondary':
                    return 'bg-transparent text-neutral-600 border border-neutral-500 hover:bg-neutral-50 active:bg-neutral-100 dark:text-neutral-400 dark:border-neutral-500 dark:hover:bg-neutral-800 dark:active:bg-neutral-700';
                case 'neutral':
                    return 'bg-transparent text-neutral-600 border border-neutral-400 hover:bg-neutral-50 active:bg-neutral-100 dark:text-neutral-400 dark:border-neutral-600 dark:hover:bg-neutral-800 dark:active:bg-neutral-700';
                case 'danger':
                    return 'bg-transparent text-red-500 border border-red-500 hover:bg-red-50 active:bg-red-100 dark:text-red-500 dark:border-red-500 dark:hover:bg-red-500/10 dark:active:bg-red-500/20';
                case 'success':
                    return 'bg-transparent text-green-500 border border-green-500 hover:bg-green-50 active:bg-green-100 dark:text-green-500 dark:border-green-500 dark:hover:bg-green-500/10 dark:active:bg-green-500/20';
                case 'default':
                    return 'bg-transparent text-neutral-700 border border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100 dark:text-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-800 dark:active:bg-neutral-700';
                case 'black':
                    return 'bg-transparent text-neutral-800 border border-neutral-200 hover:bg-neutral-50 active:bg-neutral-100 dark:text-neutral-300 dark:border-neutral-800 dark:hover:bg-neutral-800 dark:active:bg-neutral-700';
                case 'orange':
                    return 'bg-transparent text-orangeBO border border-orangeBO hover:bg-orange-50 active:bg-orange-100 dark:text-orangeBO dark:border-orangeBO dark:hover:bg-orangeBO/10 dark:active:bg-orangeBO/20 focus-visible:ring-orangeBO/50';
                default:
                    return 'bg-transparent text-neutral-700 border border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100 dark:text-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-800 dark:active:bg-neutral-700';
            }
        }

        // ==========================================
        // TEXT APPEARANCE
        // ==========================================
        if (this.appearance === 'text') {
            switch (this.variant) {
                case 'primary':
                    return 'bg-transparent text-violet-600 hover:bg-violet-50 active:bg-violet-100 dark:text-violet-400 dark:hover:bg-violet-950 dark:active:bg-violet-900';
                case 'secondary':
                    return 'bg-transparent text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:active:bg-neutral-700';
                case 'neutral':
                    return 'bg-transparent text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:active:bg-neutral-700';
                case 'danger':
                    return 'bg-transparent text-red-600 hover:bg-red-50 active:bg-red-100 dark:text-red-400 dark:hover:bg-red-950 dark:active:bg-red-900';
                case 'success':
                    return 'bg-transparent text-green-600 hover:bg-green-50 active:bg-green-100 dark:text-green-400 dark:hover:bg-green-950 dark:active:bg-green-900';
                case 'default':
                    return 'bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:active:bg-neutral-700';
                case 'black':
                    return 'bg-transparent text-neutral-800 hover:bg-neutral-50 active:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:active:bg-neutral-700';
                case 'orange':
                    return 'bg-transparent text-orangeBO hover:bg-orange-50 active:bg-orange-100 dark:text-orangeBO/90 dark:hover:bg-orangeBO/10 dark:active:bg-orangeBO/20 focus-visible:ring-orangeBO/50';
                default:
                    return 'bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:active:bg-neutral-700';
            }
        }

        return '';
    }
}