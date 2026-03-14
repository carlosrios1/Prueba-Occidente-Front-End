import { ValidationErrors } from '@angular/forms';

/**
 * Interfaz para los mensajes de error personalizados
 */
export interface ErrorMessage {
    type: string;
    message: string;
}

/**
 * Configuración de mensajes de error personalizados por tipo de error
 */
export interface CustomErrorMessages {
    [errorType: string]: (fieldName: string, errorValue?: any) => string;
}

/**
 * Utilidad genérica y reutilizable para obtener mensajes de error legibles en español
 * Puede usarse en cualquier formulario de la aplicación
 * 
 * @example
 * // Uso básico
 * const errorMsg = ValidationErrorMessages.getErrorMessage('Email', control.errors);
 * 
 * @example
 * // Uso con mensajes personalizados
 * const customMessages = {
 *   emailInvalid: (field) => `${field} debe ser un correo corporativo válido`
 * };
 * const errorMsg = ValidationErrorMessages.getErrorMessage('Email', control.errors, customMessages);
 */
export class ValidationErrorMessages {
    /**
     * Mensajes de error estándar que funcionan para cualquier formulario
     */
    private static readonly defaultMessages: CustomErrorMessages = {
        required: (fieldName: string) =>
            `El campo ${fieldName} es obligatorio`,

        minlength: (fieldName: string, error: any) =>
            `${fieldName} debe tener al menos ${error.requiredLength} caracteres`,

        maxlength: (fieldName: string, error: any) =>
            `${fieldName} no puede exceder ${error.requiredLength} caracteres`,

        min: (fieldName: string, error: any) =>
            `${fieldName} debe ser mayor o igual a ${error.min}`,

        max: (fieldName: string, error: any) =>
            `${fieldName} debe ser menor o igual a ${error.max}`,

        email: (fieldName: string) =>
            `${fieldName} debe ser un correo electrónico válido`,

        pattern: (fieldName: string) =>
            `${fieldName} no tiene un formato válido`,

        // Validadores personalizados comunes
        minLength: (fieldName: string, error: any) =>
            `${fieldName} debe tener al menos ${error.min} caracteres`,

        maxLength: (fieldName: string, error: any) =>
            `${fieldName} no puede exceder ${error.max} caracteres`,

        invalidFormat: (fieldName: string) =>
            `${fieldName} contiene caracteres no válidos`,

        invalidSelection: (fieldName: string) =>
            `Debe seleccionar una opción válida para ${fieldName}`,

        invalidVersionFormat: () =>
            'La versión debe contener solo números, letras y los caracteres . - v H',

        invalidEmailFormat: (fieldName: string) =>
            `${fieldName} no tiene un formato de correo válido`,

        invalidPhoneFormat: (fieldName: string) =>
            `${fieldName} no tiene un formato de teléfono válido`,

        invalidDateFormat: (fieldName: string) =>
            `${fieldName} no tiene un formato de fecha válido`,

        invalidUrlFormat: (fieldName: string) =>
            `${fieldName} no es una URL válida`,

        passwordMismatch: () =>
            'Las contraseñas no coinciden',

        whitespace: (fieldName: string) =>
            `${fieldName} no puede contener solo espacios en blanco`,

        futureDate: (fieldName: string) =>
            `${fieldName} no puede ser una fecha futura`,

        pastDate: (fieldName: string) =>
            `${fieldName} no puede ser una fecha pasada`,

        invalidCreditCard: () =>
            'Número de tarjeta de crédito no válido',

        invalidZipCode: () =>
            'Código postal no válido',

        invalidDNI: () =>
            'DNI/Identificación no válida',

        invalidRTN: () =>
            'RTN no válido',

        duplicateValue: (fieldName: string) =>
            `${fieldName} ya existe en el sistema`,
    };

    /**
     * Obtiene el mensaje de error apropiado basado en el tipo de validación
     * 
     * @param fieldName - Nombre legible del campo (ej: "Correo electrónico", "Nombre")
     * @param errors - Objeto de errores de validación de Angular
     * @param customMessages - Mensajes personalizados opcionales para sobrescribir los por defecto
     * @returns Mensaje de error en español o null si no hay errores
     */
    static getErrorMessage(
        fieldName: string,
        errors: ValidationErrors | null,
        customMessages?: CustomErrorMessages
    ): string | null {
        if (!errors) {
            return null;
        }

        const errorKey = Object.keys(errors)[0];
        const errorValue = errors[errorKey];

        // Primero buscar en mensajes personalizados
        if (customMessages && customMessages[errorKey]) {
            return customMessages[errorKey](fieldName, errorValue);
        }

        // Luego buscar en mensajes por defecto
        if (this.defaultMessages[errorKey]) {
            return this.defaultMessages[errorKey](fieldName, errorValue);
        }

        // Mensaje genérico si no se encuentra el tipo de error
        return `${fieldName} no es válido`;
    }

    /**
     * Obtiene todos los mensajes de error para un campo
     * Útil cuando quieres mostrar múltiples errores a la vez
     * 
     * @param fieldName - Nombre legible del campo
     * @param errors - Objeto de errores de validación
     * @param customMessages - Mensajes personalizados opcionales
     * @returns Array de mensajes de error
     */
    static getAllErrorMessages(
        fieldName: string,
        errors: ValidationErrors | null,
        customMessages?: CustomErrorMessages
    ): ErrorMessage[] {
        if (!errors) {
            return [];
        }

        return Object.keys(errors).map(errorKey => ({
            type: errorKey,
            message: this.getErrorMessage(
                fieldName,
                { [errorKey]: errors[errorKey] },
                customMessages
            ) || ''
        }));
    }

    /**
     * Verifica si un campo tiene un error específico
     * 
     * @param errors - Objeto de errores de validación
     * @param errorType - Tipo de error a verificar
     * @returns true si el error existe
     */
    static hasError(
        errors: ValidationErrors | null,
        errorType: string
    ): boolean {
        return errors ? errorType in errors : false;
    }

    /**
     * Registra mensajes de error personalizados globalmente
     * Útil para agregar mensajes específicos de tu aplicación
     * 
     * @param messages - Objeto con funciones generadoras de mensajes
     * 
     * @example
     * ValidationErrorMessages.registerCustomMessages({
     *   invalidCompanyCode: (field) => `${field} debe ser un código de empresa válido`,
     *   invalidProductSKU: (field) => `${field} no es un SKU válido`
     * });
     */
    static registerCustomMessages(messages: CustomErrorMessages): void {
        Object.assign(this.defaultMessages, messages);
    }

    /**
     * Obtiene un mensaje de error para múltiples campos relacionados
     * Útil para validaciones cruzadas
     * 
     * @param fields - Array de nombres de campos
     * @param errors - Errores de validación
     * @returns Mensaje de error combinado
     */
    static getCrossFieldErrorMessage(
        fields: string[],
        errors: ValidationErrors | null
    ): string | null {
        if (!errors) {
            return null;
        }

        const fieldNames = fields.join(' y ');
        const errorKey = Object.keys(errors)[0];

        if (errorKey === 'mismatch') {
            return `Los campos ${fieldNames} no coinciden`;
        }

        if (errorKey === 'invalidRange') {
            return `El rango entre ${fieldNames} no es válido`;
        }

        return `Error en los campos: ${fieldNames}`;
    }
}