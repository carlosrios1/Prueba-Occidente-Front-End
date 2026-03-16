/**
 * Input Component
 * 
 * Componente de input reutilizable con estados de validación, iconos y prefijos/sufijos de texto.
 * Incluye soporte para todos los atributos nativos de input HTML.
 * 
 * 
 */

import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideIconData, LucideAngularModule } from 'lucide-angular';
import { InputTheme } from '../shared/theme.config';

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './input.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true
        }
    ]
})
export class InputComponent implements ControlValueAccessor {
    InputTheme = InputTheme;
    // ============================================
    // INPUTS - Configuración del componente
    // ============================================

    /** Estado del input: 'default', 'success' o 'error' */
    @Input() state: 'default' | 'success' | 'error' = 'default';

    /** Texto o icono a mostrar en el lado izquierdo */
    @Input() prefixText: string | null = null;
    @Input() prefixIcon: LucideIconData | null = null;

    /** Texto o icono a mostrar en el lado derecho */
    @Input() suffixText: string | null = null;
    @Input() suffixIcon: LucideIconData | null = null;

    /** Tamaño del input */
    @Input() size: 'small' | 'medium' | 'large' = 'medium';

    /** Radio de borde redondeado */
    @Input() rounded: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';

    /** Si el input ocupa el ancho completo del contenedor */
    @Input() fullWidth: boolean = false;

    /** Placeholder del input */
    @Input() placeholder: string = '';

    /** Estado deshabilitado */
    @Input() disabled: boolean = false;

    /** Tipo de input HTML */
    @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'color' | 'file' = 'text';

    /** Nombre del input */
    @Input() name: string = '';

    /** ID del input */
    @Input() id: string = '';

    /** Valor mínimo (para type="number") */
    @Input() min: number | null = null;

    /** Valor máximo (para type="number") */
    @Input() max: number | null = null;

    /** Paso (para type="number") */
    @Input() step: number | null = null;

    /** Pattern de validación */
    @Input() pattern: string | null = null;

    /** Campo requerido */
    @Input() required: boolean = false;

    /** Solo lectura */
    @Input() readonly: boolean = false;

    /** Autocompletar */
    @Input() autocomplete: string = 'off';

    /** Máxima longitud */
    @Input() maxlength: number | null = null;

    /** Mínima longitud */
    @Input() minlength: number | null = null;

    // ============================================
    // OUTPUTS - Eventos del componente
    // ============================================

    @Output() onInput = new EventEmitter<Event>();
    @Output() onChange = new EventEmitter<Event>();
    @Output() onFocus = new EventEmitter<FocusEvent>();
    @Output() onBlur = new EventEmitter<FocusEvent>();
    @Output() onKeyDown = new EventEmitter<KeyboardEvent>();
    @Output() onKeyUp = new EventEmitter<KeyboardEvent>();
    @Output() onKeyPress = new EventEmitter<KeyboardEvent>();

    // ============================================
    // ControlValueAccessor
    // ============================================

    value: any = '';
    onChange_: any = () => { };
    onTouched: any = () => { };

    writeValue(value: any): void {
        this.value = value;
    }

    registerOnChange(fn: any): void {
        this.onChange_ = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    handleInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.value = target.value;
        this.onChange_(this.value);
        this.onInput.emit(event);
    }

    handleChange(event: Event): void {
        this.onChange.emit(event);
    }

    handleBlur(event: FocusEvent): void {
        this.onTouched();
        this.onBlur.emit(event);
    }

    handleFocus(event: FocusEvent): void {
        this.onFocus.emit(event);
    }

    handleKeyDown(event: KeyboardEvent): void {
        this.onKeyDown.emit(event);
    }

    handleKeyUp(event: KeyboardEvent): void {
        this.onKeyUp.emit(event);
    }

    handleKeyPress(event: KeyboardEvent): void {
        this.onKeyPress.emit(event);
    }

    // ============================================
    // GETTERS - Propiedades computadas
    // ============================================

    /**
     * Genera las clases del contenedor principal
     */
    get containerClass(): string {
        const baseClasses = 'flex items-center border transition-all duration-500 focus-within:ring-2 drop-shadow-sm focus-within:drop-shadow';
        const roundedClasses = this.getRoundedClasses();
        const stateClasses = this.getStateClasses();
        const widthClass = this.fullWidth ? 'w-full' : 'min-w-0';
        const diabledClass = this.disabled ? 'opacity-50 [&_*]:cursor-not-allowed' : ''

        return `${baseClasses} ${roundedClasses} ${stateClasses} ${widthClass} ${diabledClass}`.trim();
    }

    /**
     * Genera las clases del input
     */
    get inputClass(): string {
        const baseClasses = ' flex-1 bg-transparent outline-none';
        const sizeClasses = this.getSizeClasses();

        return `${baseClasses} ${sizeClasses} ${InputTheme.colors.text} ${InputTheme.colors.placeholder}`.trim();
    }

    /**
     * Tamaño de los iconos según el tamaño del input
     */
    get iconSize(): string {
        switch (this.size) {
            case 'small':
                return 'size-3';
            case 'medium':
                return 'size-4';
            case 'large':
                return 'size-5';
            default:
                return 'size-3';
        }
    }

    /**
     * Clases para el texto de prefijo/sufijo
     */
    get affixTextClass(): string {
        const baseClasses = 'text-neutral-500 dark:text-neutral-400 select-none';
        let sizeClass = '';

        switch (this.size) {
            case 'small':
                sizeClass = 'text-xs';
                break;
            case 'medium':
                sizeClass = 'text-sm';
                break;
            case 'large':
                sizeClass = 'text-base';
                break;
        }

        return `${baseClasses} ${sizeClass}`.trim();
    }

    // ============================================
    // MÉTODOS PRIVADOS - Generación de clases
    // ============================================

    /**
     * Genera las clases de tamaño
     */
    private getSizeClasses(): string {
        switch (this.size) {
            case 'small':
                return 'px-3 py-1.5 text-xs';
            case 'medium':
                return 'px-4 py-2 text-sm';
            case 'large':
                return 'px-5 py-3 text-base';
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
     * Genera las clases según el estado
     */
    private getStateClasses(): string {
        const baseClasses = 'bg-input';

        switch (this.state) {
            case 'success':
                return `${baseClasses} border-green-500 focus-within:ring-green-500/20 dark:border-green-600`;
            case 'error':
                return `${baseClasses} border-red-500 focus-within:ring-red-500/20 dark:border-red-600`;
            case 'default':
            default:
                return `${baseClasses} border-neutral-200 hover:border-neutral-300 focus-within:ring-neutral-500/20 dark:focus-within:ring-neutral-100/20 dark:border-neutral-800`;
        }
    }
}