import { Component, Input, Output, EventEmitter, forwardRef, OnInit, OnDestroy, ElementRef, HostListener, Inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl, ValidationErrors, Validator, NG_VALIDATORS, FormsModule } from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Clock, LucideAngularModule } from 'lucide-angular';
import { ClosableComponent, GlobalDropdownManager } from '../date-picker/services/date-picker.service';
import { CustomSelectComponent, SelectOption } from '../form-components/input/custom-select/custom-select.component';

interface TimeValue {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
}

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, CustomSelectComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true
    }
  ],
  template: `
    <div class="relative" [attr.data-timepicker-id]="componentId">
      <!-- Input Field -->
      <div class="relative">
        <input
          #inputElement
          type="text"
          [value]="displayValue"
          [placeholder]="placeholder"
          [disabled]="disabled"
          readonly
          [class]="inputClasses"
          (click)="onInputClick($event)"
          (focus)="onFocus()"
          (blur)="onInputBlur()"
        />
        <button
          type="button"
          [disabled]="disabled"
          class="absolute inset-y-0 right-0 flex items-center pr-3 hover:opacity-70 transition-opacity"
          (click)="onInputClick($event)"
        >
          <lucide-icon [img]="clockIcon" class="size-4 text-gray-500"></lucide-icon>
        </button>
      </div>

      <!-- Time Picker Dropdown -->
      <div
        *ngIf="isDropdownOpen || isDropdownClosing"
        class="absolute top-full left-0 z-50 mt-1 bg-white border rounded-md shadow-lg p-4"
        [class.right-0]="shouldAlignRight"
        [class.left-0]="!shouldAlignRight"
        [class.animate-in]="isDropdownOpen && !isDropdownClosing"
        [class.animate-out]="isDropdownClosing"
        [attr.data-dropdown-id]="componentId"
        (click)="onDropdownClick($event)"
        style="min-width: 200px;"
      >
        <div class="flex items-center space-x-2">
          <!-- Hour Input -->
          <div class="flex-1">
            <label class="block text-xs font-medium text-gray-700 mb-1">Hora</label>
            <input
              #hourInput
              type="number"
              min="1"
              max="12"
              [(ngModel)]="tempHour"
              (keydown)="onInputKeydown($event)"
              (input)="onHourChange()"
              (blur)="validateHour()"
              class="input input-bancocci"
              placeholder="12"
              autocomplete="off"
            />
          </div>

          <!-- Separator -->
          <div class="text-lg font-bold text-gray-600 mt-6">:</div>

          <!-- Minute Input -->
          <div class="flex-1">
            <label class="block text-xs font-medium text-gray-700 mb-1">Min</label>
            <input
              #minuteInput
              type="number"
              min="0"
              max="59"
              [(ngModel)]="tempMinute"
              (keydown)="onInputKeydown($event)"
              (input)="onMinuteChange()"
              (blur)="validateMinute()"
              class="input input-bancocci"
              placeholder="00"
              autocomplete="off"
            />
          </div>

          <!-- AM/PM Selector -->
          <div class="flex flex-col">
            <label class="block text-xs font-medium text-gray-700 mb-1">Periodo</label>
            <app-custom-select 
              [options]="periodos" 
              [(ngModel)]="tempPeriod" 
              (change)="onPeriodChange()" 
              class="w-[90px]" 
              [maxDropdownWidth]="150">
            </app-custom-select>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes animate-in {
      from {
        opacity: 0;
        transform: translateY(-4px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    @keyframes animate-out {
      from {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      to {
        opacity: 0;
        transform: translateY(-4px) scale(0.95);
      }
    }
    
    .animate-in {
      animation: animate-in 0.2s ease-out forwards;
    }
    
    .animate-out {
      animation: animate-out 0.15s ease-in forwards;
    }

    /* Ocultar flechas de input number */
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    input[type="number"] {
      -moz-appearance: textfield;
    }
  `]
})
export class TimePickerComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy, ClosableComponent {
  @Input() id: string = '';
  @Input() placeholder: string = 'Selecciona una hora';
  @Input() disabled: boolean = false;
  @Input() error: boolean = false;
  @Input() size: 'sm' | 'default' | 'lg' = 'default';
  @Input() required: boolean = false;
  @Input() minTime: string | null = null; // Formato: "HH:MM:SS" o "HH:MM" en 24h ej: "09:30:00"
  @Input() maxTime: string | null = null; // Formato: "HH:MM:SS" o "HH:MM" en 24h ej: "18:00:00"
  @Input() invalid: boolean = false; // Para controlar si es inválido

  @Output() timeChange = new EventEmitter<string | null>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();
  @Output() validationChange = new EventEmitter<{ [key: string]: any } | null>();

  readonly clockIcon = Clock;

  // Propiedades para ClosableComponent interface
  componentId: string;
  componentType: 'timepicker' = 'timepicker';

  periodos: SelectOption[] = [
    { label: 'AM', value: 'AM' },
    { label: 'PM', value: 'PM' }
  ];

  selectedTime: TimeValue | null = null;
  isDropdownOpen: boolean = false;
  isDropdownClosing: boolean = false;
  isFocused: boolean = false;
  validationErrors: { [key: string]: any } | null = null;
  shouldAlignRight: boolean = false;

  // Valores temporales para los inputs
  tempHour: number | null = null;
  tempMinute: number | null = null;
  tempPeriod: 'AM' | 'PM' = 'AM';

  private onChange = (value: string | null) => { };
  private onTouched = () => { };

  constructor(
    private elementRef: ElementRef,
    private dropdownManager: GlobalDropdownManager,
    @Inject(DOCUMENT) private document: Document
  ) {
    // Generar ID único para esta instancia
    this.componentId = this.generateUniqueId();
  }

  ngOnInit() {
    // Inicializar con valores por defecto si es necesario
  }

  ngOnDestroy() {
    // Limpiar la instancia del manager al destruir el componente
    this.dropdownManager.unregister(this.componentId);
  }

  private generateUniqueId(): string {
    return 'timepicker-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
  }

  get displayValue(): string {
    if (!this.selectedTime) return '';
    const hour = this.selectedTime.hour.toString();
    const minute = this.selectedTime.minute.toString().padStart(2, '0');
    return `${hour}:${minute} ${this.selectedTime.period}`;
  }

  get inputClasses(): string {
    const baseClasses = [
      'input input-bancocci text-sm cursor-pointer',
    ];

    if (this.size === 'sm') {
      baseClasses.push('h-9 px-2 text-xs');
    } else if (this.size === 'lg') {
      baseClasses.push('h-11 px-4 text-base');
    }

    if (this.error) {
      baseClasses.push('border-red-300 focus-visible:ring-red-500');
    } else if (this.isDropdownOpen || this.isFocused) {
      baseClasses.push('focus-visible:ring-greenBO/70');
    } else {
      baseClasses.push('border-gray-300 focus-visible:ring-greenBO/70');
    }

    if (this.invalid) {
      baseClasses.push('!border-red-300 hover:border-red-300 hover:ring-red-300 focus:ring-red-300 focus-visible:ring-red-300');
    }

    baseClasses.push('bg-white');
    return baseClasses.join(' ');
  }

  onInputClick(event: Event): void {
    event.stopPropagation();
    if (!this.disabled) {
      this.toggleDropdown();
    }
  }

  onDropdownClick(event: Event): void {
    event.stopPropagation();
  }

  toggleDropdown(): void {
    if (this.disabled) return;

    if (this.isDropdownOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown(): void {
    // Registrar esta instancia como abierta (esto cerrará las demás)
    this.dropdownManager.registerOpen(this);

    this.isDropdownOpen = true;
    this.isDropdownClosing = false;

    // Inicializar valores temporales
    if (this.selectedTime) {
      this.tempHour = this.selectedTime.hour;
      this.tempMinute = this.selectedTime.minute;
      this.tempPeriod = this.selectedTime.period;
    } else {
      this.tempHour = 12;
      this.tempMinute = 0;
      this.tempPeriod = 'AM';
    }

    this.calculateAlignment();

    // Focus en el primer input después de que se abra
    setTimeout(() => {
      const hourInput = this.elementRef.nativeElement.querySelector('#hourInput, input[type="number"]');
      if (hourInput) {
        hourInput.focus();
      }
    }, 100);
  }

  // Método público para cerrar (requerido por ClosableComponent interface)
  closeDropdown(): void {
    this.isDropdownClosing = true;
    this.dropdownManager.unregister(this.componentId);

    // Aplicar cambios si los valores son válidos
    if (this.isValidTime()) {
      this.applyTimeChange();
    }

    setTimeout(() => {
      this.isDropdownOpen = false;
      this.isDropdownClosing = false;
    }, 150);
  }

  onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.isValidTime()) {
        this.applyTimeChange();
        this.closeDropdown();
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.closeDropdown();
    }
  }

  onHourChange(): void {
    if (this.tempHour !== null) {
      // Mantener entre 1 y 12
      if (this.tempHour > 12) {
        this.tempHour = 12;
      } else if (this.tempHour < 1) {
        this.tempHour = 1;
      }
    }
  }

  onMinuteChange(): void {
    if (this.tempMinute !== null) {
      // Mantener entre 0 y 59
      if (this.tempMinute > 59) {
        this.tempMinute = 59;
      } else if (this.tempMinute < 0) {
        this.tempMinute = 0;
      }
    }
  }

  onPeriodChange(): void {
    // No necesita validación adicional
  }

  validateHour(): void {
    if (this.tempHour === null || this.tempHour < 1 || this.tempHour > 12) {
      this.tempHour = this.selectedTime?.hour || 12;
    }
  }

  validateMinute(): void {
    if (this.tempMinute === null || this.tempMinute < 0 || this.tempMinute > 59) {
      this.tempMinute = this.selectedTime?.minute || 0;
    }
  }

  isValidTime(): boolean {
    return this.tempHour !== null &&
      this.tempHour >= 1 &&
      this.tempHour <= 12 &&
      this.tempMinute !== null &&
      this.tempMinute >= 0 &&
      this.tempMinute <= 59;
  }

  applyTimeChange(): void {
    if (!this.isValidTime()) return;

    const newTime: TimeValue = {
      hour: this.tempHour!,
      minute: this.tempMinute!,
      period: this.tempPeriod
    };

    // Validar contra min/max time si están definidos
    if (this.isTimeInRange(newTime)) {
      this.selectedTime = newTime;
      // Convertir a formato 24h para el ngModel
      const timeString24h = this.convertTo24HourFormat(newTime);

      this.validateTime();
      this.onChange(timeString24h);
      this.timeChange.emit(timeString24h);
    }
  }

  calculateAlignment(): void {
    setTimeout(() => {
      const element = this.elementRef.nativeElement;
      const rect = element.getBoundingClientRect();
      const dropdownWidth = 220;
      const viewportWidth = window.innerWidth;
      this.shouldAlignRight = (rect.left + dropdownWidth) > (viewportWidth - 20);
    });
  }

  validateTime(): void {
    this.validationErrors = null;

    if (this.required && !this.selectedTime) {
      this.validationErrors = { required: true };
    } else if (this.selectedTime) {
      const time24h = this.convertTo24HourFormat(this.selectedTime);

      if (this.minTime && !this.isTime24AfterOrEqual(time24h, this.minTime)) {
        this.validationErrors = {
          minTime: {
            actual: time24h,
            min: this.minTime
          }
        };
      } else if (this.maxTime && !this.isTime24BeforeOrEqual(time24h, this.maxTime)) {
        this.validationErrors = {
          maxTime: {
            actual: time24h,
            max: this.maxTime
          }
        };
      }
    }

    this.validationChange.emit(this.validationErrors);
  }

  onFocus(): void {
    this.isFocused = true;
    this.focus.emit();
  }

  onInputBlur(): void {
    setTimeout(() => {
      this.isFocused = false;
      this.onTouched();
      this.blur.emit();
    }, 150);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;

    // Verificar si el clic fue dentro de ESTE componente específico
    const isInsideThisComponent = this.elementRef.nativeElement.contains(target);

    // También verificar si el clic fue en el dropdown de este componente específico
    const isInsideThisDropdown = target.closest(`[data-dropdown-id="${this.componentId}"]`) !== null;

    // Solo cerrar si el clic fue FUERA de este componente específico Y el dropdown está abierto
    if (this.isDropdownOpen && !isInsideThisComponent && !isInsideThisDropdown) {
      this.closeDropdown();
    }
  }

  // NUEVOS MÉTODOS PARA MANEJAR FORMATO 24H

  /**
   * Convierte un objeto TimeValue (12h) a string en formato 24h (HH:MM:SS)
   */
  private convertTo24HourFormat(time: TimeValue): string {
    let hour24 = time.hour;

    if (time.period === 'AM' && time.hour === 12) {
      hour24 = 0; // 12 AM = 00:xx
    } else if (time.period === 'PM' && time.hour !== 12) {
      hour24 = time.hour + 12; // 1 PM = 13:xx, 2 PM = 14:xx, etc.
    }
    // Si es 12 PM, se mantiene como 12

    const hourStr = hour24.toString().padStart(2, '0');
    const minuteStr = time.minute.toString().padStart(2, '0');
    return `${hourStr}:${minuteStr}:00`;
  }

  /**
   * Convierte un string en formato 24h (HH:MM:SS o HH:MM) a objeto TimeValue (12h)
   */
  private convertFrom24HourFormat(time24h: string): TimeValue | null {
    // Soportar tanto HH:MM:SS como HH:MM
    const match = time24h.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (!match) return null;

    const hour24 = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    // Los segundos los ignoramos para la visualización

    if (hour24 < 0 || hour24 > 23 || minute < 0 || minute > 59) return null;

    let hour12: number;
    let period: 'AM' | 'PM';

    if (hour24 === 0) {
      hour12 = 12;
      period = 'AM';
    } else if (hour24 === 12) {
      hour12 = 12;
      period = 'PM';
    } else if (hour24 < 12) {
      hour12 = hour24;
      period = 'AM';
    } else {
      hour12 = hour24 - 12;
      period = 'PM';
    }

    return { hour: hour12, minute, period };
  }

  /**
   * Convierte string HH:MM:SS o HH:MM a minutos para comparación
   */
  private time24ToMinutes(time24h: string): number {
    const [hours, minutes] = time24h.split(':').map(num => parseInt(num, 10));
    return hours * 60 + minutes;
  }

  /**
   * Compara si time1 es mayor o igual que time2 (ambos en formato 24h)
   */
  private isTime24AfterOrEqual(time1: string, time2: string): boolean {
    return this.time24ToMinutes(time1) >= this.time24ToMinutes(time2);
  }

  /**
   * Compara si time1 es menor o igual que time2 (ambos en formato 24h)
   */
  private isTime24BeforeOrEqual(time1: string, time2: string): boolean {
    return this.time24ToMinutes(time1) <= this.time24ToMinutes(time2);
  }

  /**
   * Verifica si la hora está dentro del rango permitido
   */
  private isTimeInRange(time: TimeValue): boolean {
    if (!this.minTime && !this.maxTime) return true;

    const time24h = this.convertTo24HourFormat(time);

    if (this.minTime && !this.isTime24AfterOrEqual(time24h, this.minTime)) {
      return false;
    }

    if (this.maxTime && !this.isTime24BeforeOrEqual(time24h, this.maxTime)) {
      return false;
    }

    return true;
  }

  // ControlValueAccessor implementation
  writeValue(value: string | null): void {
    if (value) {
      // Ahora recibe formato 24h y lo convierte para mostrar
      this.selectedTime = this.convertFrom24HourFormat(value);
    } else {
      this.selectedTime = null;
    }
    this.validateTime();
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Validator implementation
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string | null;

    if (this.required && !value) {
      return { required: true };
    }

    if (value) {
      // Validar formato 24h (acepta HH:MM:SS o HH:MM)
      if (!value.match(/^([01]?\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/)) {
        return { invalidTime: { value } };
      }

      if (this.minTime && !this.isTime24AfterOrEqual(value, this.minTime)) {
        return {
          minTime: {
            actual: value,
            min: this.minTime,
            message: `La hora debe ser posterior a ${this.minTime}`
          }
        };
      }

      if (this.maxTime && !this.isTime24BeforeOrEqual(value, this.maxTime)) {
        return {
          maxTime: {
            actual: value,
            max: this.maxTime,
            message: `La hora debe ser anterior a ${this.maxTime}`
          }
        };
      }
    }

    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    // Implementado para Validator interface
  }
}