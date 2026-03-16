/**
 * Textarea Component
 * 
 * Componente de textarea reutilizable con estados de validación y ajuste automático de altura.
 * Incluye soporte para todos los atributos nativos de textarea HTML.
 * 
 * 
 */

import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputTheme } from '../shared/theme.config';

@Component({
    selector: 'app-textarea',
    standalone: true,
    imports: [],
    templateUrl: './textarea.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextareaComponent),
            multi: true
        }
    ]
})
export class TextareaComponent implements ControlValueAccessor {
    // ============================================
    // INPUTS - Configuración del componente
    // ============================================

    /** Estado del textarea: 'default', 'success' o 'error' */
    @Input() state: 'default' | 'success' | 'error' = 'default';

    /** Tamaño del textarea */
    @Input() size: 'small' | 'medium' | 'large' = 'medium';

    /** Radio de borde redondeado */
    @Input() rounded: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'md';

    /** Si el textarea ocupa el ancho completo del contenedor */
    @Input() fullWidth: boolean = true;

    /** Placeholder del textarea */
    @Input() placeholder: string = '';

    /** Estado deshabilitado */
    @Input() disabled: boolean = false;

    /** Nombre del textarea */
    @Input() name: string = '';

    /** ID del textarea */
    @Input() id: string = '';

    /** Campo requerido */
    @Input() required: boolean = false;

    /** Solo lectura */
    @Input() readonly: boolean = false;

    /** Máxima longitud */
    @Input() maxlength: number | null = null;

    /** Mínima longitud */
    @Input() minlength: number | null = null;

    /** Número de filas visibles */
    @Input() rows: number = 3;

    /** Número de columnas */
    @Input() cols: number | null = null;

    /** Ajustar altura automáticamente según el contenido */
    @Input() autoResize: boolean = false;

    /** Permitir cambio de tamaño por el usuario */
    @Input() resize: 'none' | 'vertical' | 'horizontal' | 'both' = 'vertical';

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
        const target = event.target as HTMLTextAreaElement;
        this.value = target.value;
        this.onChange_(this.value);
        this.onInput.emit(event);

        // Auto resize si está habilitado
        if (this.autoResize) {
            this.adjustHeight(target);
        }
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
    // MÉTODOS PRIVADOS
    // ============================================

    /**
     * Ajusta la altura del textarea según su contenido
     */
    private adjustHeight(element: HTMLTextAreaElement): void {
        element.style.height = 'auto';
        element.style.height = element.scrollHeight + 'px';
    }

    // ============================================
    // GETTERS - Propiedades computadas
    // ============================================

    /**
     * Genera las clases del contenedor principal
     */
    get containerClass(): string {
        const baseClasses = 'inline-flex border transition-all duration-500 focus-within:ring-2 drop-shadow-sm focus-within:drop-shadow';
        const roundedClasses = this.getRoundedClasses();
        const stateClasses = this.getStateClasses();
        const widthClass = this.fullWidth ? 'w-full' : '';

        return `${baseClasses} ${roundedClasses} ${stateClasses} ${widthClass}`.trim();
    }

    /**
     * Genera las clases del textarea
     */
    get textareaClass(): string {
        const baseClasses = 'w-full bg-transparent outline-none';
        const sizeClasses = this.getSizeClasses();
        const resizeClass = this.getResizeClass();

        return `${baseClasses} ${sizeClasses} ${resizeClass} ${InputTheme.colors.text} ${InputTheme.colors.placeholder}`.trim();
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
                return `${baseClasses} ${InputTheme.colors.state.success}`;
            case 'error':
                return `${baseClasses} ${InputTheme.colors.state.error}`;
            case 'default':
            default:
                return `${baseClasses} ${InputTheme.colors.state.default}`;
        }
    }

    /**
     * Genera la clase de resize
     */
    private getResizeClass(): string {
        switch (this.resize) {
            case 'none':
                return 'resize-none';
            case 'vertical':
                return 'resize-y';
            case 'horizontal':
                return 'resize-x';
            case 'both':
                return 'resize';
            default:
                return 'resize-y';
        }
    }
}