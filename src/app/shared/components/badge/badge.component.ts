/**
 * Badge Component
 * 
 * Componente de insignia reutilizable con múltiples variantes, apariencias y tamaños.
 * Incluye soporte para iconos, modo solo-icono, y accesibilidad completa.
 * 
 * @author Hector Varela
 */

import { Component, Input } from '@angular/core';
import { LucideIconData, LucideAngularModule } from 'lucide-angular';
import { BadgeVariant } from './badge.config';

@Component({
    selector: 'app-badge',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './badge.component.html'
})
export class BadgeComponent {
    // ============================================
    // INPUTS - Configuración del componente
    // ============================================

    /** Variante de color del badge */
    @Input() variant: BadgeVariant = 'default';

    /** Estilo de apariencia del badge */
    @Input() appearance: 'solid' | 'soft' | 'outline' | 'ghost' = 'solid';

    /** Tamaño del badge */
    @Input() size: 'small' | 'medium' | 'large' | 'xl' = 'medium';

    /** Radio de borde redondeado */
    @Input() rounded: 'sm' | 'md' | 'lg' | 'full' = 'md';

    /** Icono del badge (Lucide) */
    @Input() icon: LucideIconData | null = null;

    /** Posición del icono */
    @Input() iconPosition: 'left' | 'right' = 'left';

    /** Modo solo icono (sin texto) */
    @Input() iconOnly: boolean = false;

    /** Punto indicador (dot) */
    @Input() dot: boolean = false;

    /** Posición del dot */
    @Input() dotPosition: 'left' | 'right' = 'left';

    // ============================================
    // GETTERS - Propiedades computadas
    // ============================================

    /**
     * Genera todas las clases CSS del badge
     * Combina clases base, tamaño, variante y redondeado
     */
    get finalClass(): string {
        const baseClasses = 'inline-flex items-center gap-1.5 font-medium transition-colors whitespace-nowrap';
        const roundedClasses = this.getRoundedClasses();
        const sizeClasses = this.getSizeClasses();
        const variantClasses = this.getVariantClasses();

        return `${baseClasses} ${roundedClasses} ${sizeClasses} ${variantClasses}`.trim();
    }

    /**
     * Calcula el tamaño del icono según el tamaño del badge
     */
    get iconSize(): string {
        if (this.iconOnly) {
            switch (this.size) {
                case 'small':
                    return 'size-3';
                case 'medium':
                    return 'size-3.5';
                case 'large':
                    return 'size-4';
                case 'xl':
                    return 'size-6';
                default:
                    return 'size-3.5';
            }
        }

        switch (this.size) {
            case 'small':
                return 'size-3';
            case 'medium':
                return 'size-3.5';
            case 'large':
                return 'size-4';
            case 'xl':
                return 'size-6';
            default:
                return 'size-3.5';
        }
    }

    /**
     * Calcula el tamaño del dot
     */
    get dotSize(): string {
        switch (this.size) {
            case 'small':
                return 'size-1.5';
            case 'medium':
                return 'size-2';
            case 'large':
                return 'size-2.5';
            default:
                return 'size-2';
        }
    }

    // ============================================
    // MÉTODOS PRIVADOS - Generación de clases
    // ============================================

    /**
     * Genera las clases de tamaño (padding y texto)
     */
    private getSizeClasses(): string {
        if (this.iconOnly) {
            switch (this.size) {
                case 'small':
                    return 'p-1 text-xs';
                case 'medium':
                    return 'p-1.5 text-sm';
                case 'large':
                    return 'p-2 text-base';
                case 'xl':
                    return 'p-2.5 text-lg';
                default:
                    return 'p-1.5 text-sm';
            }
        }

        switch (this.size) {
            case 'small':
                return 'px-2 py-0.5 text-xs';
            case 'medium':
                return 'px-2.5 py-1 text-sm';
            case 'large':
                return 'px-3 py-1.5 text-base';
            case 'xl':
                return 'px-3.5 py-2 text-lg';
            default:
                return 'px-2.5 py-1 text-sm';
        }
    }

    /**
     * Genera las clases de borde redondeado
     */
    private getRoundedClasses(): string {
        switch (this.rounded) {
            case 'sm':
                return 'rounded-sm';
            case 'md':
                return 'rounded-md';
            case 'lg':
                return 'rounded-lg';
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
                    return 'bg-violet-500 text-white dark:bg-violet-600';
                case 'secondary':
                    return 'bg-neutral-500 text-white dark:bg-neutral-600';
                case 'neutral':
                    return 'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100';
                case 'danger':
                    return 'bg-red-500 text-white dark:bg-red-600';
                case 'success':
                    return 'bg-green-500 text-white dark:bg-green-600';
                case 'warning':
                    return 'bg-amber-500 text-white dark:bg-amber-600';
                case 'info':
                    return 'bg-blue-500 text-white dark:bg-blue-600';
                case 'purple':
                    return 'bg-purple-500 text-white dark:bg-purple-600';
                case 'pink':
                    return 'bg-pink-500 text-white dark:bg-pink-600';
                case 'orange':
                    return 'bg-orange-500 text-white dark:bg-orange-600';
                case 'teal':
                    return 'bg-teal-500 text-white dark:bg-teal-600';
                case 'cyan':
                    return 'bg-cyan-500 text-white dark:bg-cyan-600';
                case 'black':
                    return 'bg-neutral-900 text-white dark:bg-neutral-800';
                case 'default':
                    return 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';
                default:
                    return 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';
            }
        }

        // ==========================================
        // SOFT APPEARANCE
        // ==========================================
        if (this.appearance === 'soft') {
            switch (this.variant) {
                case 'primary':
                    return 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400';
                case 'secondary':
                    return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-500/20 dark:text-neutral-400';
                case 'neutral':
                    return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300';
                case 'danger':
                    return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
                case 'success':
                    return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
                case 'warning':
                    return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
                case 'info':
                    return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
                case 'purple':
                    return 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400';
                case 'pink':
                    return 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400';
                case 'orange':
                    return 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400';
                case 'teal':
                    return 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400';
                case 'cyan':
                    return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400';
                case 'black':
                    return 'bg-neutral-900/10 text-neutral-900 dark:bg-neutral-100/10 dark:text-neutral-100';
                case 'default':
                    return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';
                default:
                    return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';
            }
        }

        // ==========================================
        // OUTLINE APPEARANCE
        // ==========================================
        if (this.appearance === 'outline') {
            switch (this.variant) {
                case 'primary':
                    return 'bg-transparent text-violet-600 border border-violet-500 dark:text-violet-400 dark:border-violet-500';
                case 'secondary':
                    return 'bg-transparent text-neutral-600 border border-neutral-500 dark:text-neutral-400 dark:border-neutral-500';
                case 'neutral':
                    return 'bg-transparent text-neutral-600 border border-neutral-400 dark:text-neutral-400 dark:border-neutral-600';
                case 'danger':
                    return 'bg-transparent text-red-600 border border-red-500 dark:text-red-400 dark:border-red-500';
                case 'success':
                    return 'bg-transparent text-green-600 border border-green-500 dark:text-green-400 dark:border-green-500';
                case 'warning':
                    return 'bg-transparent text-amber-600 border border-amber-500 dark:text-amber-400 dark:border-amber-500';
                case 'info':
                    return 'bg-transparent text-blue-600 border border-blue-500 dark:text-blue-400 dark:border-blue-500';
                case 'purple':
                    return 'bg-transparent text-purple-600 border border-purple-500 dark:text-purple-400 dark:border-purple-500';
                case 'pink':
                    return 'bg-transparent text-pink-600 border border-pink-500 dark:text-pink-400 dark:border-pink-500';
                case 'orange':
                    return 'bg-transparent text-orange-600 border border-orange-500 dark:text-orange-400 dark:border-orange-500';
                case 'teal':
                    return 'bg-transparent text-teal-600 border border-teal-500 dark:text-teal-400 dark:border-teal-500';
                case 'cyan':
                    return 'bg-transparent text-cyan-600 border border-cyan-500 dark:text-cyan-400 dark:border-cyan-500';
                case 'black':
                    return 'bg-transparent text-neutral-900 border border-neutral-300 dark:text-neutral-100 dark:border-neutral-700';
                case 'default':
                    return 'bg-transparent text-neutral-700 border border-neutral-300 dark:text-neutral-300 dark:border-neutral-600';
                default:
                    return 'bg-transparent text-neutral-700 border border-neutral-300 dark:text-neutral-300 dark:border-neutral-700';
            }
        }

        // ==========================================
        // GHOST APPEARANCE
        // ==========================================
        if (this.appearance === 'ghost') {
            switch (this.variant) {
                case 'primary':
                    return 'bg-transparent text-violet-600 dark:text-violet-400';
                case 'secondary':
                    return 'bg-transparent text-neutral-600 dark:text-neutral-400';
                case 'neutral':
                    return 'bg-transparent text-neutral-600 dark:text-neutral-400';
                case 'danger':
                    return 'bg-transparent text-red-600 dark:text-red-400';
                case 'success':
                    return 'bg-transparent text-green-600 dark:text-green-400';
                case 'warning':
                    return 'bg-transparent text-amber-600 dark:text-amber-400';
                case 'info':
                    return 'bg-transparent text-blue-600 dark:text-blue-400';
                case 'purple':
                    return 'bg-transparent text-purple-600 dark:text-purple-400';
                case 'pink':
                    return 'bg-transparent text-pink-600 dark:text-pink-400';
                case 'orange':
                    return 'bg-transparent text-orange-600 dark:text-orange-400';
                case 'teal':
                    return 'bg-transparent text-teal-600 dark:text-teal-400';
                case 'cyan':
                    return 'bg-transparent text-cyan-600 dark:text-cyan-400';
                case 'black':
                    return 'bg-transparent text-neutral-900 dark:text-neutral-100';
                case 'default':
                    return 'bg-transparent text-neutral-700 dark:text-neutral-300';
                default:
                    return 'bg-transparent text-neutral-700 dark:text-neutral-300';
            }
        }

        return '';
    }

    /**
     * Obtiene el color del dot según la variante
     */
    getDotColor(): string {
        const colorMap: Record<string, string> = {
            'primary': 'bg-violet-500',
            'secondary': 'bg-neutral-500',
            'neutral': 'bg-neutral-400',
            'danger': 'bg-red-500',
            'success': 'bg-green-500',
            'warning': 'bg-amber-500',
            'info': 'bg-blue-500',
            'purple': 'bg-purple-500',
            'pink': 'bg-pink-500',
            'orange': 'bg-orange-500',
            'teal': 'bg-teal-500',
            'cyan': 'bg-cyan-500',
            'black': 'bg-neutral-900 dark:bg-neutral-100',
            'default': 'bg-neutral-400'
        };

        return colorMap[this.variant] || colorMap['default'];
    }
}