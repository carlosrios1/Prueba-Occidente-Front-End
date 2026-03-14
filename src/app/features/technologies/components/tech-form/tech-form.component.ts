import { Component, inject, signal, Input, OnInit, Output, EventEmitter, effect, Signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { InputWrapperComponent } from '../../../../shared/components/form-components/input/input-wrapper/input-wrapper.component';
import { LabelComponent } from '../../../../shared/components/form-components/input/label/label.component';
import { InputComponent } from '../../../../shared/components/form-components/input/input/input.component';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { ValidationErrorMessages } from '../../../../core/utils/validation/validation-error-message';
import { Edit, Plus } from 'lucide-angular';
import { TechValidator } from './validators/tech.validator';
import { AvailableProduct } from '@features/technologies/services/tech-http.service';
import { SelectOption, CustomSelectComponent } from '@shared/components/form-components/input/custom-select/custom-select.component';

export interface TechData {
    name: string;
    label: string;
    category: string;
}

/**
 * Interfaz tipada para el formulario de Entorno de Desarrollo
 */
export interface TechFormControls {
    name: FormControl<string | null>;
}

/**
 * Tipo para el FormGroup tipado
 */
export type TechFormGroup = FormGroup<TechFormControls>;

/**
 * Enum para los nombres de los campos del formulario
 */
export enum TechFormField {
    Name = 'name',
}

@Component({
    selector: 'app-tech-form',
    standalone: true,
    imports: [
        CommonModule,
        ModalComponent,
        InputWrapperComponent,
        LabelComponent,
        ReactiveFormsModule,
        ButtonComponent,
        CustomSelectComponent
    ],
    templateUrl: './tech-form.component.html'
})
export class TechFormComponent implements OnInit {
    @Input() products!: Signal<AvailableProduct[]>;
    @Input() soData?: TechData;
    @Input() isSubmitting = signal<boolean>(false);

    @Output() onSubmit = new EventEmitter<TechData>();
    @Output() onCancel = new EventEmitter<void>();

    @Input() isModalOpen = signal<boolean>(false);

    readonly icons = {
        Edit,
        Plus
    };

    mapToSelectOptions(products: AvailableProduct[]): SelectOption[] {
        return products.map(product => ({
            label: product.label,
            value: product.name
        }));
    }

    // Exponer el enum para usar en el template
    readonly FormField = TechFormField;

    private readonly FIELD_DISPLAY_NAMES: Record<TechFormField, string> = {
        [TechFormField.Name]: 'Nombre',
    };

    private readonly customErrorMessages = {
        excessiveSpaces: (fieldName: string) =>
            `${fieldName} no puede contener espacios múltiples consecutivos`,
    };

    private fb = inject(FormBuilder);
    envForm!: TechFormGroup;

    // Exponer los controles individuales para el template
    get nameControl(): FormControl<string | null> {
        return this.envForm.controls.name;
    }

    private wasSubmitting = false;

    constructor() {
        this.envForm = this.initializeForm();

        // Efecto para cerrar el modal automáticamente después de un submit exitoso
        effect(() => {
            const submitting = this.isSubmitting();

            // Si estaba submitting y ahora es false, significa que terminó
            if (this.wasSubmitting && !submitting && this.isModalOpen()) {
                // Esperar un tick para que el estado se propague
                setTimeout(() => {
                    this.closeModal();
                }, 100);
            }

            this.wasSubmitting = submitting;
        });
    }

    ngOnInit(): void {
        // Inicialización básica si es necesario
    }
    private initializeForm(): TechFormGroup {
        return this.fb.group<TechFormControls>({
            name: this.fb.control<string | null>('', TechValidator.techName()),
        });
    }

    openModal(): void {
        this.envForm.reset();

        this.isModalOpen.set(true);
    }

    closeModal(): void {
        this.isModalOpen.set(false);

        this.envForm.reset();

        this.isSubmitting.set(false);
        this.onCancel.emit();
    }

    handleFormSubmit(): void {
        this.envForm.markAllAsTouched();

        if (this.envForm.invalid) {
            console.warn('Formulario inválido', this.envForm.errors);
            return;
        }

        const formValues = this.envForm.getRawValue();
        const selectedName = formValues.name;

        // Buscar el producto seleccionado para obtener su category
        const selectedProduct = this.products().find(
            product => product.name === selectedName
        );

        if (!selectedProduct) {
            console.error('Producto no encontrado:', selectedName);
            return;
        }

        const formData: TechData = {
            name: selectedName!,
            label: selectedProduct.label,
            category: selectedProduct.category  // ✅ Obtenemos el category del producto
        };

        // Emitir evento para que el componente padre maneje la lógica de negocio
        this.onSubmit.emit(formData);
    }

    getErrorMessage(field: TechFormField): string | null {
        const control = this.envForm.get(field);

        if (control?.errors && control.touched) {
            return ValidationErrorMessages.getErrorMessage(
                this.getFieldDisplayName(field),
                control.errors,
                this.customErrorMessages
            );
        }

        return null;
    }

    hasError(field: TechFormField): boolean {
        const control = this.envForm.get(field);
        return !!(control?.errors && control.touched);
    }

    isFieldValid(field: TechFormField): boolean {
        const control = this.envForm.get(field);
        return !!(control?.valid && control.touched);
    }

    private getFieldDisplayName(field: TechFormField): string {
        return this.FIELD_DISPLAY_NAMES[field];
    }
}