import { Component, Input, Output, EventEmitter, forwardRef, OnInit, OnDestroy, ElementRef, HostListener, Inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl, ValidationErrors, Validator, NG_VALIDATORS, FormsModule } from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Calendar, MoveLeft, MoveRight, LucideAngularModule, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-angular';
import { ClosableComponent, GlobalDropdownManager } from './services/date-picker.service';
import { CustomSelectComponent, SelectOption } from '../form-components/input/custom-select/custom-select.component';

interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isDisabled: boolean;
}

@Component({
    selector: 'app-date-picker',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, CustomSelectComponent, FormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true
        }
    ],
    template: `
    <div class="relative" [attr.data-datepicker-id]="componentId">
      <!-- Input Field -->
      <div class="relative drop-shadow-sm">
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
          (click)="onCalendarButtonClick($event)"
        >
          <lucide-icon [img]="icons.Calendar" class="size-4 text-gray-500"></lucide-icon>
        </button>
      </div>

      <!-- Calendar Dropdown -->
      <div
        *ngIf="isCalendarOpen || isCalendarClosing"
        class="absolute top-full left-0 z-50 mt-1 w-[280px] rounded-md border bg-white p-0 text-popover-foreground shadow-lg"
        [class.right-0]="shouldAlignRight"
        [class.left-0]="!shouldAlignRight"
        [class.animate-in]="isCalendarOpen && !isCalendarClosing"
        [class.animate-out]="isCalendarClosing"
        [attr.data-calendar-id]="componentId"
        (click)="onCalendarClick($event)"
      >
        <!-- Calendar Header -->
        <div class="flex items-center justify-between p-3 border-b w-full">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-lg size-7 bg-transparent p-0 hover:bg-gray-100 hover:text-accent-foreground transition-colors"
            (click)="previousMonth()"
          >
            <lucide-icon [img]="icons.ChevronLeft" class="size-4"></lucide-icon>
          </button>
          
          <div class="flex items-center space-x-2"> 
            <!-- Selector de Mes usando CustomSelect -->
            <app-custom-select 
              [options]="monthOptions" 
              [(ngModel)]="selectedMonth"
              (ngModelChange)="onMonthSelectChange($event)"
              class="min-w-[80px]">
            </app-custom-select>
            
            <!-- Selector de Año usando CustomSelect -->
            <app-custom-select 
              [options]="yearOptions" 
              [(ngModel)]="selectedYear"
              (ngModelChange)="onYearSelectChange($event)"
              class="min-w-[80px]">
            </app-custom-select>
          </div> 

          <button
            type="button"
            class="inline-flex items-center justify-center rounded-lg size-7 bg-transparent p-0 hover:bg-gray-100 hover:text-accent-foreground transition-colors"
            (click)="nextMonth()"
          >
            <lucide-icon [img]="icons.ChevronRight" class="size-4"></lucide-icon>
          </button>
        </div>

        <!-- Calendar Grid -->
        <div class="p-3">
          <!-- Day Headers -->
          <div class="grid grid-cols-7 mb-1">
            <div
              *ngFor="let day of dayHeaders"
              class="flex h-7 w-full items-center justify-center p-0 text-xs font-normal text-muted-foreground"
            >
              {{day}}
            </div>
          </div>

          <!-- Calendar Days -->
          <div class="grid grid-cols-7">
            <button
              *ngFor="let day of calendarDays; trackBy: trackByDate"
              type="button"
              [class]="getDayClasses(day)"
              [disabled]="day.isDisabled"
              (click)="selectDate(day.date)"
            >
              {{day.date.getDate()}}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    @keyframes animate-in {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    @keyframes animate-out {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0.95);
      }
    }
    
    .animate-in {
      animation: animate-in 0.2s ease-out forwards;
    }
    
    .animate-out {
      animation: animate-out 0.15s ease-in forwards;
    }
  `]
})
export class DatePickerComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy, ClosableComponent {
    @Input() id: string = '';
    @Input() placeholder: string = 'Selecciona una fecha';
    @Input() disabled: boolean = false;
    @Input() error: boolean = false;
    @Input() size: 'sm' | 'default' | 'lg' = 'default';
    @Input() dateFormat: string = 'dd/MM/yyyy';
    @Input() minDate: Date | null = null;
    @Input() maxDate: Date | null = null;
    @Input() required: boolean = false;
    @Input() invalid: boolean = false; // Para controlar si es inválido

    @Output() dateChange = new EventEmitter<Date | null>();
    @Output() focus = new EventEmitter<void>();
    @Output() blur = new EventEmitter<void>();
    @Output() validationChange = new EventEmitter<{ [key: string]: any } | null>();

    readonly icons = {
        ChevronLeft,
        ChevronRight,
        Calendar
    }

    // Propiedades para ClosableComponent interface
    componentId: string;
    componentType: 'datepicker' = 'datepicker';

    selectedDate: Date | null = null;
    currentDate: Date;
    isCalendarOpen: boolean = false;
    isCalendarClosing: boolean = false;
    isFocused: boolean = false;
    calendarDays: CalendarDay[] = [];
    validationErrors: { [key: string]: any } | null = null;
    shouldAlignRight: boolean = false;

    // Propiedades para los CustomSelect
    selectedMonth: number;
    selectedYear: number;
    monthOptions: SelectOption[] = [];
    yearOptions: SelectOption[] = [];

    months: string[] = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];

    dayHeaders: string[] = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

    private onChange = (value: Date | null) => { };
    private onTouched = () => { };

    constructor(
        private elementRef: ElementRef,
        private dropdownManager: GlobalDropdownManager,
        @Inject(DOCUMENT) private document: Document
    ) {
        // Generar ID único para esta instancia
        this.componentId = this.generateUniqueId();

        // Inicializar con fecha actual
        const today = new Date();
        this.currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        this.selectedMonth = this.currentDate.getMonth();
        this.selectedYear = this.currentDate.getFullYear();
    }

    ngOnInit() {
        // Asegurar inicialización con fecha actual
        const today = new Date();
        this.currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        this.selectedMonth = this.currentDate.getMonth();
        this.selectedYear = this.currentDate.getFullYear();

        this.generateMonthOptions();
        this.generateYearOptions();
        this.generateCalendarDays();
    }

    ngOnDestroy() {
        // Limpiar la instancia del manager al destruir el componente
        this.dropdownManager.unregister(this.componentId);
    }

    private generateUniqueId(): string {
        return 'datepicker-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
    }

    get displayValue(): string {
        if (!this.selectedDate) return '';
        return this.formatDate(this.selectedDate);
    }

    get currentMonth(): number {
        return this.currentDate.getMonth();
    }

    get currentYear(): number {
        return this.currentDate.getFullYear();
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
            baseClasses.push('border-destructive focus-visible:ring-destructive');
        } else if (this.isCalendarOpen || this.isFocused) {
            baseClasses.push('border-ring focus-visible:ring-ring');
        } else {
            baseClasses.push('border-input focus-visible:ring-ring');
        }

        if (this.invalid) {
            baseClasses.push('!border-red-300 hover:border-red-300 hover:ring-red-300 focus:ring-red-300');
        }

        baseClasses.push('bg-background');
        return baseClasses.join(' ');
    }

    // Nuevos métodos para manejar eventos de clic correctamente
    onInputClick(event: Event): void {
        event.stopPropagation();
        if (!this.disabled) {
            this.toggleCalendar();
        }
    }

    onCalendarButtonClick(event: Event): void {
        event.stopPropagation();
        if (!this.disabled) {
            this.toggleCalendar();
        }
    }

    onCalendarClick(event: Event): void {
        // Prevenir que los clics dentro del calendario lo cierren
        event.stopPropagation();
    }

    generateMonthOptions(): void {
        this.monthOptions = this.months.map((month, index) => ({
            value: index,
            label: month,
            disabled: this.isMonthDisabled(index, this.selectedYear)
        }));
    }

    generateYearOptions(): void {
        const currentYear = new Date().getFullYear();
        this.yearOptions = [];
        for (let year = currentYear - 50; year <= currentYear + 10; year++) {
            this.yearOptions.push({
                value: year,
                label: year.toString(),
                disabled: this.isYearDisabled(year)
            });
        }
    }

    // Método para verificar si un mes debe estar deshabilitado
    private isMonthDisabled(month: number, year: number): boolean {
        if (!this.minDate && !this.maxDate) return false;

        // Primer y último día del mes
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        // Si hay minDate y el último día del mes es anterior a minDate
        if (this.minDate && lastDayOfMonth < this.minDate) {
            return true;
        }

        // Si hay maxDate y el primer día del mes es posterior a maxDate
        if (this.maxDate && firstDayOfMonth > this.maxDate) {
            return true;
        }

        return false;
    }

    // Método para verificar si un año debe estar deshabilitado
    private isYearDisabled(year: number): boolean {
        if (!this.minDate && !this.maxDate) return false;

        // Primer y último día del año
        const firstDayOfYear = new Date(year, 0, 1);
        const lastDayOfYear = new Date(year, 11, 31);

        // Si hay minDate y el último día del año es anterior a minDate
        if (this.minDate && lastDayOfYear < this.minDate) {
            return true;
        }

        // Si hay maxDate y el primer día del año es posterior a maxDate
        if (this.maxDate && firstDayOfYear > this.maxDate) {
            return true;
        }

        return false;
    }

    generateCalendarDays(): void {
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const today = new Date();

        // Obtener el día de la semana del primer día del mes (0=Domingo, 1=Lunes, etc.)
        // Convertir para que Lunes=0, Martes=1, ..., Domingo=6
        let startDayOfWeek = firstDay.getDay();
        startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // Ajustar para que Lunes sea 0

        // Calcular la fecha de inicio (puede ser del mes anterior)
        const startDate = new Date(firstDay);
        startDate.setDate(firstDay.getDate() - startDayOfWeek);

        this.calendarDays = [];
        const totalCells = 42; // 6 semanas × 7 días

        for (let i = 0; i < totalCells; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const isCurrentMonth = date.getMonth() === this.currentDate.getMonth();
            const isToday = this.isSameDate(date, today);
            const isSelected = this.selectedDate ? this.isSameDate(date, this.selectedDate) : false;
            const isDisabled = this.isDateDisabled(date);

            this.calendarDays.push({
                date: new Date(date),
                isCurrentMonth,
                isToday,
                isSelected,
                isDisabled
            });
        }
    }

    getDayClasses(day: CalendarDay): string {
        const classes = [
            'inline-flex h-8 w-full motion-preset-slide-right motion-duration-100 items-center justify-center rounded-lg p-0 my-1 text-sm font-medium transition-colors',
            'hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        ];

        if (!day.isCurrentMonth) {
            classes.push('text-muted-foreground opacity-50');
        }

        if (day.isSelected) {
            classes.push('bg-black text-white hover:bg-gray-800');
        }

        if (day.isToday && !day.isSelected) {
            classes.push('bg-gray-100 font-semibold');
        }

        if (day.isDisabled) {
            classes.push('text-muted-foreground opacity-30 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground');
        }

        return classes.join(' ');
    }

    toggleCalendar(): void {
        if (this.disabled) return;

        if (this.isCalendarOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    openDropdown(): void {
        // Registrar esta instancia como abierta (esto cerrará las demás)
        this.dropdownManager.registerOpen(this);

        this.isCalendarOpen = true;
        this.isCalendarClosing = false;

        // Si hay una fecha seleccionada, usar esa como referencia, sino usar la fecha actual
        if (this.selectedDate) {
            this.currentDate = new Date(this.selectedDate);
        } else {
            const today = new Date();
            this.currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        }

        // Actualizar los valores de los selects
        this.selectedMonth = this.currentDate.getMonth();
        this.selectedYear = this.currentDate.getFullYear();

        // Regenerar opciones para aplicar las restricciones
        this.generateMonthOptions();
        this.generateYearOptions();
        this.generateCalendarDays();
        this.calculateAlignment();
    }

    // Método público para cerrar (requerido por ClosableComponent interface)
    closeDropdown(): void {
        this.isCalendarClosing = true;
        this.dropdownManager.unregister(this.componentId);

        setTimeout(() => {
            this.isCalendarOpen = false;
            this.isCalendarClosing = false;
        }, 150);
    }

    selectDate(date: Date): void {
        if (this.isDateDisabled(date)) return;

        this.selectedDate = new Date(date);
        this.validateDate();
        this.onChange(this.selectedDate);
        this.dateChange.emit(this.selectedDate);
        this.closeDropdown();
    }

    // Métodos para manejar cambios en los CustomSelect
    onMonthSelectChange(month: number): void {
        this.selectedMonth = month;
        this.currentDate = new Date(this.selectedYear, month, 1);

        // Regenerar opciones de mes por si cambian las restricciones
        this.generateMonthOptions();
        this.generateCalendarDays();
    }

    onYearSelectChange(year: number): void {
        this.selectedYear = year;
        this.currentDate = new Date(year, this.selectedMonth, 1);

        // Regenerar opciones de mes y año por si cambian las restricciones
        this.generateMonthOptions();
        this.generateYearOptions();
        this.generateCalendarDays();
    }

    previousMonth(): void {
        const newMonth = this.selectedMonth - 1;
        let newYear = this.selectedYear;

        if (newMonth < 0) {
            this.selectedMonth = 11;
            this.selectedYear = newYear - 1;
        } else {
            this.selectedMonth = newMonth;
        }

        this.currentDate = new Date(this.selectedYear, this.selectedMonth, 1);

        // Regenerar opciones para aplicar restricciones
        this.generateMonthOptions();
        this.generateYearOptions();
        this.generateCalendarDays();
    }

    nextMonth(): void {
        const newMonth = this.selectedMonth + 1;
        let newYear = this.selectedYear;

        if (newMonth > 11) {
            this.selectedMonth = 0;
            this.selectedYear = newYear + 1;
        } else {
            this.selectedMonth = newMonth;
        }

        this.currentDate = new Date(this.selectedYear, this.selectedMonth, 1);

        // Regenerar opciones para aplicar restricciones
        this.generateMonthOptions();
        this.generateYearOptions();
        this.generateCalendarDays();
    }

    calculateAlignment(): void {
        setTimeout(() => {
            const element = this.elementRef.nativeElement;
            const rect = element.getBoundingClientRect();
            const calendarWidth = 320;
            const viewportWidth = window.innerWidth;
            this.shouldAlignRight = (rect.left + calendarWidth) > (viewportWidth - 20);
        });
    }

    validateDate(): void {
        this.validationErrors = null;

        if (this.required && !this.selectedDate) {
            this.validationErrors = { required: true };
        } else if (this.selectedDate) {
            if (this.minDate && this.selectedDate < this.minDate) {
                this.validationErrors = {
                    min: {
                        actual: this.selectedDate,
                        min: this.minDate
                    }
                };
            } else if (this.maxDate && this.selectedDate > this.maxDate) {
                this.validationErrors = {
                    max: {
                        actual: this.selectedDate,
                        max: this.maxDate
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
        const isInsideThisCalendar = target.closest(`[data-calendar-id="${this.componentId}"]`) !== null;

        // Solo cerrar si el clic fue FUERA de este componente específico Y el calendario está abierto
        if (this.isCalendarOpen && !isInsideThisComponent && !isInsideThisCalendar) {
            this.closeDropdown();
        }
    }

    private formatDate(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    private isSameDate(date1: Date, date2: Date): boolean {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    }

    private isDateDisabled(date: Date): boolean {
        if (this.minDate && date < this.minDate) return true;
        if (this.maxDate && date > this.maxDate) return true;
        return false;
    }

    trackByDate(index: number, day: CalendarDay): string {
        return day.date.toISOString();
    }

    // ControlValueAccessor implementation
    writeValue(value: Date | null): void {
        this.selectedDate = value;
        if (value) {
            this.currentDate = new Date(value);
            this.selectedMonth = this.currentDate.getMonth();
            this.selectedYear = this.currentDate.getFullYear();
        } else {
            const today = new Date();
            this.currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            this.selectedMonth = this.currentDate.getMonth();
            this.selectedYear = this.currentDate.getFullYear();
        }
        this.generateMonthOptions();
        this.generateYearOptions();
        this.generateCalendarDays();
        this.validateDate();
    }

    registerOnChange(fn: (value: Date | null) => void): void {
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
        const value = control.value as Date | null;

        if (this.required && !value) {
            return { required: true };
        }

        if (value) {
            if (this.minDate && value < this.minDate) {
                return {
                    dateMin: {
                        actual: value,
                        min: this.minDate,
                        message: `La fecha debe ser posterior al ${this.formatDate(this.minDate)}`
                    }
                };
            }

            if (this.maxDate && value > this.maxDate) {
                return {
                    dateMax: {
                        actual: value,
                        max: this.maxDate,
                        message: `La fecha debe ser anterior al ${this.formatDate(this.maxDate)}`
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