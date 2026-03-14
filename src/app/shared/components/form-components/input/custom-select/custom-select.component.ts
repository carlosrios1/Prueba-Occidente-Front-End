// custom-select.component.ts
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { DropdownService } from './services/dropdown.service';
import { Check, ChevronDown, LucideAngularModule } from 'lucide-angular';
import { InputTheme } from '../shared/theme.config';

export interface SelectOption {
  value: number | string | null | undefined;
  label: string;
  subtitle?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [FormsModule, CommonModule, LucideAngularModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    },
  ],
  templateUrl: './custom-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSelectComponent
  implements OnInit, OnDestroy, ControlValueAccessor, AfterViewChecked {
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = 'Selecciona una opción';
  @Input() disabled: boolean = false;
  @Input() maxDropdownWidth: number = 400; // Ancho máximo del dropdown
  @Input() minDropdownWidth: number = 200; // Ancho mínimo del dropdown
  @Input() autoWidth: boolean = true; // Calcular ancho automáticamente
  @Input() invalid: boolean = false; // Para controlar si es inválido
  @Input() state: 'default' | 'success' | 'error' = 'default';
  @Input() rounded: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Output() selectionChange = new EventEmitter<SelectOption>();

  @ViewChild('dropdownContainer', { static: false }) dropdownContainer!: ElementRef;

  isOpen = false;
  selectedOption: SelectOption | null = null;
  private shouldScrollToSelected = false;

  // Para navegación por teclado
  private highlightedIndex = -1;

  // Typeahead search
  private typeaheadBuffer = '';
  private typeaheadTimer: any = null;

  // Propiedades para el posicionamiento inteligente
  dropdownPosition: 'bottom' | 'top' = 'bottom';
  dropdownAlignment: 'left' | 'right' = 'left';
  calculatedDropdownWidth: number = 0;

  readonly arrow = ChevronDown;
  readonly check = Check;

  private dropdownSubscription = Subscription.EMPTY;

  // ControlValueAccessor methods
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(
    private elementRef: ElementRef,
    private dropdownService: DropdownService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnDestroy() {
    this.dropdownSubscription.unsubscribe();
    clearTimeout(this.typeaheadTimer);
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToSelected && this.isOpen && this.selectedOption) {
      this.scrollToSelectedOption();
      this.shouldScrollToSelected = false;
    }
  }

  // Navegación por teclado mejorada
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.isOpen) {
          this.openDropdown();
        } else if (this.highlightedIndex >= 0) {
          const option = this.getEnabledOptions()[this.highlightedIndex];
          if (option) {
            this.selectOption(option);
          }
        }
        break;

      case 'Escape':
        if (this.isOpen) {
          event.preventDefault();
          this.closeDropdown();
          this.focusButton();
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.openDropdown();
        } else {
          this.navigateOptions(1);
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen) {
          this.openDropdown();
        } else {
          this.navigateOptions(-1);
        }
        break;

      case 'Home':
        if (this.isOpen) {
          event.preventDefault();
          this.highlightedIndex = 0;
          this.scrollToHighlighted();
        }
        break;

      case 'End':
        if (this.isOpen) {
          event.preventDefault();
          this.highlightedIndex = this.getEnabledOptions().length - 1;
          this.scrollToHighlighted();
        }
        break;

      default:
        // Typeahead: filtrar por teclas alfanuméricas
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          event.preventDefault();
          if (!this.isOpen) {
            this.openDropdown();
          }
          this.typeaheadBuffer += event.key.toLowerCase();
          clearTimeout(this.typeaheadTimer);
          this.typeaheadTimer = setTimeout(() => { this.typeaheadBuffer = ''; }, 800);

          const enabledOptions = this.getEnabledOptions();
          const matchIndex = enabledOptions.findIndex(o =>
            o.label.toLowerCase().startsWith(this.typeaheadBuffer)
          );
          if (matchIndex !== -1) {
            this.highlightedIndex = matchIndex;
            this.scrollToHighlighted();
            this.cdr.markForCheck();
          }
        }
        break;
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.isOpen) {
      this.calculateDropdownPosition();
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.isOpen) {
      this.calculateDropdownPosition();
    }
  }

  ngOnInit() {
    this.dropdownSubscription = this.dropdownService.closeDropdown$.subscribe(
      () => {
        this.closeDropdown();
      }
    );
  }

  // TrackBy function para mejor performance
  trackByOption(index: number, option: SelectOption): any {
    return option.value;
  }

  writeValue(value: any): void {
    this.selectedOption =
      this.options.find((option) => option.value === value) || null;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();

    if (this.disabled) return;

    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  private openDropdown(): void {
    this.dropdownService.closeAllDropdowns();
    this.isOpen = true;
    this.shouldScrollToSelected = true;
    this.highlightedIndex = this.getEnabledOptions().findIndex(
      option => option.value === this.selectedOption?.value
    );

    // Calcular posición después de que el DOM se actualice
    setTimeout(() => {
      this.calculateDropdownPosition();
      this.cdr.markForCheck();
    }, 0);
  }

  private closeDropdown(): void {
    this.isOpen = false;
    this.highlightedIndex = -1;
    this.cdr.markForCheck();
  }

  selectOption(option: SelectOption): void {
    if (option.disabled) return;

    this.selectedOption = option;
    this.closeDropdown();
    this.onChange(option.value);
    this.onTouched();
    this.selectionChange.emit(option);
    this.focusButton();
  }

  // Navegación por opciones habilitadas solamente
  private navigateOptions(direction: 1 | -1): void {
    const enabledOptions = this.getEnabledOptions();
    if (enabledOptions.length === 0) return;

    if (this.highlightedIndex === -1) {
      this.highlightedIndex = direction === 1 ? 0 : enabledOptions.length - 1;
    } else {
      this.highlightedIndex += direction;

      if (this.highlightedIndex >= enabledOptions.length) {
        this.highlightedIndex = 0;
      } else if (this.highlightedIndex < 0) {
        this.highlightedIndex = enabledOptions.length - 1;
      }
    }

    this.scrollToHighlighted();
  }

  private getEnabledOptions(): SelectOption[] {
    return this.options.filter(option => !option.disabled);
  }

  private scrollToHighlighted(): void {
    if (!this.dropdownContainer || this.highlightedIndex < 0) return;

    const container = this.dropdownContainer.nativeElement;
    const enabledOptions = this.getEnabledOptions();
    const highlightedOption = enabledOptions[this.highlightedIndex];

    if (!highlightedOption) return;

    const highlightedElement = container.querySelector(`[data-option-value="${highlightedOption.value}"]`);

    if (highlightedElement) {
      highlightedElement.scrollIntoView({ block: 'nearest' });
    }
  }

  private focusButton(): void {
    const button = this.elementRef.nativeElement.querySelector('button');
    if (button) {
      button.focus();
    }
  }

  // Método para calcular la posición inteligente del dropdown
  private calculateDropdownPosition(): void {
    if (!this.isOpen) return;

    const buttonElement = this.elementRef.nativeElement.querySelector('button');
    if (!buttonElement) return;

    const buttonRect = buttonElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Calcular altura estimada del dropdown (máximo 240px como está en el CSS)
    const maxDropdownHeight = 240;
    const itemHeight = 40; // Altura aproximada de cada item
    const estimatedDropdownHeight = Math.min(this.options.length * itemHeight + 16, maxDropdownHeight);

    // Determinar posición vertical
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    if (spaceBelow >= estimatedDropdownHeight || spaceBelow >= spaceAbove) {
      this.dropdownPosition = 'bottom';
    } else {
      this.dropdownPosition = 'top';
    }

    // Determinar alineación horizontal con ancho dinámico
    this.calculatedDropdownWidth = this.calculateOptimalWidth(buttonRect.width);
    const dropdownWidth = this.calculatedDropdownWidth;
    const spaceRight = viewportWidth - buttonRect.left;
    const spaceLeft = buttonRect.right;

    if (spaceRight >= dropdownWidth) {
      this.dropdownAlignment = 'left';
    } else if (spaceLeft >= dropdownWidth) {
      this.dropdownAlignment = 'right';
    } else {
      // Si no cabe en ningún lado, usar el que tenga más espacio
      this.dropdownAlignment = spaceRight >= spaceLeft ? 'left' : 'right';
    }
  }

  // Calcular el ancho óptimo basado en el contenido
  private calculateOptimalWidth(buttonWidth: number): number {
    if (!this.autoWidth) {
      return Math.min(this.maxDropdownWidth, Math.max(buttonWidth, this.minDropdownWidth));
    }

    // Crear un elemento temporal para medir el contenido
    const tempDiv = document.createElement('div');
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.position = 'absolute';
    tempDiv.style.whiteSpace = 'nowrap';
    tempDiv.style.fontSize = '14px'; // text-sm
    tempDiv.style.fontFamily = getComputedStyle(document.body).fontFamily;
    document.body.appendChild(tempDiv);

    let maxContentWidth = 0;

    // Medir cada opción
    this.options.forEach(option => {
      // Texto principal
      tempDiv.textContent = option.label;
      const labelWidth = tempDiv.offsetWidth;

      // Si hay subtítulo, también lo medimos
      let subtitleWidth = 0;
      if (option.subtitle) {
        tempDiv.style.fontSize = '12px'; // text-xs
        tempDiv.textContent = option.subtitle;
        subtitleWidth = tempDiv.offsetWidth;
        tempDiv.style.fontSize = '14px'; // Restaurar
      }

      // El ancho de contenido es el mayor entre label y subtitle
      const contentWidth = Math.max(labelWidth, subtitleWidth);
      maxContentWidth = Math.max(maxContentWidth, contentWidth);
    });

    // Limpiar
    document.body.removeChild(tempDiv);

    // Agregar padding y espacio para el check icon
    // px-4 (16px cada lado) + gap-2 (8px) + icon (16px) + margen extra (16px)
    const extraSpace = 16 + 16 + 8 + 16 + 16;
    const calculatedWidth = maxContentWidth + extraSpace;

    // Aplicar límites
    const minWidth = Math.max(buttonWidth, this.minDropdownWidth);
    const maxWidth = this.maxDropdownWidth;

    return Math.min(maxWidth, Math.max(minWidth, calculatedWidth));
  }

  // Método para obtener las clases CSS del dropdown
  getDropdownClasses(): string {
    let classes = 'absolute z-[99999] bg-white dark:border-neutral-700 dark:bg-neutral-800 border border-gray-300 rounded-md dark:rounded-lg shadow-md dark:shadow-none max-h-60 overflow-auto motion-preset-slide-down-sm motion-duration-150';

    // Posición vertical
    if (this.dropdownPosition === 'bottom') {
      classes += ' mt-1';
    } else {
      classes += ' mb-1 bottom-full';
    }

    // Alineación horizontal
    if (this.dropdownAlignment === 'right') {
      classes += ' right-0';
    } else {
      classes += ' left-0';
    }

    return classes;
  }

  // Obtener estilos inline para el dropdown
  getDropdownStyles(): { [key: string]: string } {
    if (!this.autoWidth) {
      return {
        'min-width': '100%',
        'max-width': `${this.maxDropdownWidth}px`
      };
    }

    return {
      'width': `${this.calculatedDropdownWidth}px`
    };
  }

  private scrollToSelectedOption(): void {
    if (!this.dropdownContainer || !this.selectedOption) return;

    const container = this.dropdownContainer.nativeElement;
    const selectedElement = container.querySelector(`[data-option-value="${this.selectedOption.value}"]`);

    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest' });
    }
  }

  getSelectedLabel(): string {
    return this.selectedOption?.label || this.placeholder;
  }

  getSelectedSubtitle(): string | undefined {
    return this.selectedOption?.subtitle;
  }

  isOptionSelected(option: SelectOption): boolean {
    return this.selectedOption?.value === option.value;
  }

  isOptionDisabled(option: SelectOption): boolean {
    return option.disabled === true;
  }

  isOptionHighlighted(option: SelectOption): boolean {
    const enabledOptions = this.getEnabledOptions();
    return enabledOptions[this.highlightedIndex]?.value === option.value;
  }

  // Métodos para ARIA
  getAriaExpanded(): string {
    return this.isOpen.toString();
  }

  getAriaActivedescendant(): string | null {
    if (!this.isOpen || this.highlightedIndex < 0) return null;
    const enabledOptions = this.getEnabledOptions();
    const highlightedOption = enabledOptions[this.highlightedIndex];
    return highlightedOption ? `option-${highlightedOption.value}` : null;
  }

  getOptionId(option: SelectOption): string {
    return `option-${option.value}`;
  }

  class = "input input-bancocci drop-shadow-sm disabled:opacity-50 disabled:cursor-not-allowed  relative flex items-center w-full"

  get containerClass(): string {
    const baseClasses = 'disabled:opacity-50 disabled:cursor-not-allowed  relative flex items-center w-full border transition-all duration-500 focus-within:ring-2 drop-shadow-sm focus-within:drop-shadow';
    const roundedClasses = this.getRoundedClasses();
    const stateClasses = this.getStateClasses();
    const sizeClasses = this.getSizeClasses();

    return `${baseClasses} ${roundedClasses} ${stateClasses} ${sizeClasses}`.trim();
  }

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
}