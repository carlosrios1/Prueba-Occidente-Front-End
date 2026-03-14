import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

/**
 * Validadores simplificados para el formulario de Sistema Operativo
 */
export class TechValidator {

    /**
     * Validaciones para el nombre del SO
     */
    static techName(): ValidatorFn[] {
        return [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
            Validators.pattern(/^[a-zA-Z0-9\s\.\-\_\(\)]+$/),
            this.noExcessiveSpaces()
        ];
    }

    /**
     * Validaciones para la descripción
     */
    static techDescription(): ValidatorFn[] {
        return [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(255),
            Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,\-()/]+$/),
            this.noExcessiveSpaces()
        ];
    }



    /**
     * Valida que no haya espacios múltiples consecutivos ni al inicio/final
     */
    static noExcessiveSpaces(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;

            if (!value) {
                return null;
            }

            // Detecta múltiples espacios consecutivos
            if (/\s{2,}/.test(value)) {
                return { excessiveSpaces: true };
            }

            // Detecta espacios al inicio o final
            if (value !== value.trim()) {
                return { whitespace: true };
            }

            return null;
        };
    }
}