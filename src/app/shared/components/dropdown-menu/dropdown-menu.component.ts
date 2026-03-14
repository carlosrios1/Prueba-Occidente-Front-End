import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('dropdownAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-10px) scale(0.95)'
      })),
      state('*', style({
        opacity: 1,
        transform: 'translateY(0) scale(1)'
      })),
      transition('void => *', [
        animate('150ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ]),
      transition('* => void', [
        animate('100ms cubic-bezier(0.4, 0.0, 1, 1)')
      ])
    ])
  ],
  template: `
    <div class="relative inline-block text-left" [class.custom-dropdown-open]="isOpen">
      <!-- Botón del dropdown personalizable -->
      <div
        (click)="toggleDropdown()"
        class="cursor-pointer"
        [attr.aria-haspopup]="true"
        [attr.aria-expanded]="isOpen"
        role="button"
        tabindex="0"
        (keydown.enter)="toggleDropdown()"
        (keydown.space)="toggleDropdown()"
      >
        <!-- Contenido personalizable del botón -->
        <ng-content select="[slot=button]"></ng-content>
                
        <!-- Botón por defecto si no se proporciona contenido personalizado -->
        <ng-container *ngIf="!hasCustomButton">
          <button
            class="btn btn-text btn-square"
            type="button"
          >
            <!-- Ícono de tres puntos verticales por defecto -->
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
            </svg>
          </button>
        </ng-container>
      </div>

      <!-- Contenedor del dropdown -->
      <div
        *ngIf="isOpen"
        [@dropdownAnimation]
        class="absolute right-0 z-50 mt-1 min-w-max bg-white dark:bg-blackBG border dark:border-neutral-800 border-gray-200 rounded-md shadow-md dark:shadow-none dark:rounded-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
      >
        <div class="" role="none">
          <!-- Contenido personalizable del dropdown -->
          <ng-content select="[slot=content]"></ng-content>
                    
          <!-- Contenido por defecto si no se especifica slot -->
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
})
export class DropdownComponent {
  isOpen = false;
  hasCustomButton = false;

  // Getter para exponer el estado del dropdown
  get isDropdownOpen(): boolean {
    return this.isOpen;
  }

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngAfterContentInit(): void {
    // Verificar si hay contenido personalizado para el botón
    const buttonContent = this.elementRef.nativeElement.querySelector('[slot=button]');
    this.hasCustomButton = !!buttonContent;
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  // Cerrar dropdown al hacer clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}