// modal.component.ts - SOLUCIÓN COMPLETA
//Creado por hmvarela
import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  Renderer2,
  ViewContainerRef,
  TemplateRef,
  ViewRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';
import { ButtonComponent } from "../buttons/button/button.component";

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ButtonComponent],
  template: `
    <!-- Template que se renderizará en el portal -->
    <ng-template #modalTemplate>
      @if (isVisible) {
      <div
          [id]="modalId"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ease-out"
          [ngClass]="{
            'bg-slate-700 dark:bg-neutral-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm dark:backdrop-blur-sm': showBackdrop,
            'bg-opacity-0': !showBackdrop
          }"
          (click)="onBackdropClick($event)"
          [attr.aria-labelledby]="headerId"
          [attr.aria-describedby]="bodyId"
          aria-modal="true"
          role="dialog"
          style="z-index: 9999;"
        >

        <div
          #modalContent
          class="relative modalb w-full max-h-[90vh] bg-white dark:bg-neutral-900 dark:border dark:border-neutral-800 rounded-lg shadow-xl dark:rounded-2xl dark:shadow-neutral-800 transform transition-[background-color,color,opacity,transform] duration-300 ease-out focus-visible:outline-none"
          [class.max-w-sm]="size === 'sm'"
          [class.max-w-md]="size === 'md'"
          [class.max-w-lg]="size === 'lg'"
          [class.max-w-xl]="size === 'xl'"
          [class.max-w-2xl]="size === '2xl'"
          [class.max-w-full]="size === 'full'"
          [class.scale-100]="showContent"
          [class.opacity-100]="showContent"
          [class.scale-90]="!showContent"
          [class.opacity-0]="!showContent"
          tabindex="-1"
          style="z-index: 10000;"
        >
          <!-- Header -->
          @if (title) {
          <div class="flex items-start justify-between p-6">
            <div class="flex-1">
              <h3 [id]="headerId" [innerHTML]="title"
                  class="text-lg font-bold text-gray-900 dark:text-neutral-100 tracking-tight">
              </h3>
              @if (subtitle) {
              <p [id]="subtitleId" [innerHTML]="subtitle"
                class="text-sm text-gray-600 dark:text-neutral-400 mt-1 tracking-tight">
              </p>
              }
            </div>
            <button
              type="button"
              class="text-gray-400 dark:text-neutral-100 hover:text-gray-600 dark:hover:text-neutral-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-0 dark:focus:ring-offset-0 focus:ring-offset-2 rounded-md p-1 ml-4"
              (click)="close()"
              [disabled]="disableClose"
              [attr.aria-label]="'Cerrar ' + title"
            >
              <lucide-icon [img]="icons.X" class="size-5"></lucide-icon>
            </button>
          </div>
          }

          <!-- Body - Contenido dinámico con contexto de stacking -->
          <div 
            [id]="bodyId" 
            class="py-0 px-6 modal-content-body" 
            style="position: relative; z-index: 10001;"
          >
            <ng-content></ng-content>
          </div>

          <!-- Footer -->
          @if (showFooter) {
          <div class="flex justify-end gap-3 p-6 border-gray-200" style="z-index: 10001;">
            <app-button [variant]="getCancelButtonVariant()" type="button" (onClick)="close()" [disabled]="disableClose">{{ cancelText }}</app-button>
            @if (showConfirmButton) {
            <!-- <button
              type="button"
              [class]="getConfirmButtonClasses()"
              (click)="confirm()"
              [disabled]="disableClose"
            >
              @if (loading) {
                <span  class="loading-spinner loading loading-xs"></span>
              } 
              <span>{{ confirmText }}</span>
            </button> -->
            <app-button [variant]="getVariant()" type="button" (onClick)="confirm()" [loading]="loading" [loadingText]="loadingText" [disabled]="disableClose">{{ confirmText }}</app-button>
            }
          </div>
          }
        </div>
      </div>
      }
    </ng-template>

    <!-- Estilos CSS específicos para el modal -->
    <style>
      /* Estilos para asegurar que los selects funcionen correctamente */
      .modal-content-body {
        /* Crear un nuevo contexto de apilamiento */
        position: relative;
        z-index: 10001;
      }

      /* Estilos globales para selects dentro del modal */
      :host ::ng-deep .modal-content-body select,
      :host ::ng-deep .modal-content-body .select-container,
      :host ::ng-deep .modal-content-body .dropdown-container {
        position: relative !important;
        z-index: 10002 !important;
      }

      /* Para Angular Material selects */
      :host ::ng-deep .modal-content-body .mat-select-panel {
        z-index: 10003 !important;
      }

      /* Para PrimeNG dropdowns */
      :host ::ng-deep .modal-content-body .p-dropdown-panel {
        z-index: 10003 !important;
      }

      /* Para ng-select */
      :host ::ng-deep .modal-content-body .ng-dropdown-panel {
        z-index: 10003 !important;
      }

      /* Para selects nativos con custom styling */
      :host ::ng-deep .modal-content-body .custom-select-dropdown {
        z-index: 10003 !important;
      }

      /* Asegurar que el modal mantenga su contexto */
      .modal-portal {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        z-index: 9999 !important;
        pointer-events: none !important;
      }

      .modal-portal > * {
        pointer-events: auto !important;
      }
    </style>
  `,
})
export class ModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() showFooter: boolean = false;
  @Input() showConfirmButton: boolean = false;
  @Input() cancelText: string = 'Cancelar';
  @Input() confirmText: string = 'Confirmar';
  @Input() closeOnBackdrop: boolean = true;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' = 'md';
  @Input() isDeleteModal: boolean = false;
  @Input() success: boolean = false;
  @Input() error: boolean = false;
  @Input() disableClose: boolean = false;
  @Input() loading: boolean = false;
  @Input() loadingText: string = 'Cargando';

  @Output() onClose = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<void>();

  @ViewChild('modalContent') modalContent!: ElementRef;
  @ViewChild('modalTemplate', { read: TemplateRef }) modalTemplate!: TemplateRef<any>;

  // IDs únicos para accesibilidad
  modalId: string;
  headerId: string;
  bodyId: string;
  subtitleId: string;

  // Control de animaciones
  isVisible: boolean = false;
  showBackdrop: boolean = false;
  showContent: boolean = false;

  //Iconos
  readonly icons = {
    X,
  };

  private originalFocus: HTMLElement | null = null;
  private keydownListener: (event: KeyboardEvent) => void;
  private portalHost: HTMLElement | null = null;
  private viewRef: ViewRef | null = null;

  constructor(
    private renderer: Renderer2,
    private viewContainer: ViewContainerRef
  ) {
    // Generar IDs únicos usando timestamp y random
    const uniqueId = `modal_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    this.modalId = uniqueId;
    this.headerId = `${uniqueId}_header`;
    this.bodyId = `${uniqueId}_body`;
    this.subtitleId = `${uniqueId}_subtitle`;

    // Bind del listener para poder removerlo correctamente
    this.keydownListener = this.handleEscapeKey.bind(this);
  }

  ngOnInit() {
    if (this.isOpen) {
      this.openModal();
    }
  }

  ngOnDestroy() {
    this.cleanupModal();
    this.destroyPortal();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen']) {
      if (this.isOpen && !this.isVisible) {
        this.openModal();
      } else if (!this.isOpen && this.isVisible) {
        this.closeModal();
      }
    }
  }

  /**
   * Retorna las clases CSS para el botón de confirmación
   * basado en si es un modal de eliminación o no
   */
  // getConfirmButtonClasses(): string {
  //   const baseClasses = 'btn px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200';

  //   if (this.isDeleteModal) {
  //     return `${baseClasses} text-white bg-red-600 dark:bg-red-600/50 border border-transparent hover:border-transparent hover:bg-red-700 dark:hover:bg-red-600/70`;
  //   } else {
  //     return `${baseClasses} text-white dark:text-neutral-900 bg-black dark:bg-neutral-100 border border-transparent dark:border-0 hover:bg-black/90 dark:hover:bg-neutral-100/90`;
  //   }
  // }

  getVariant(): 'danger' | 'black-inverted' {
    if (this.isDeleteModal) {
      return 'danger'
    } else {
      return 'black-inverted'
    }
  }

  getCancelButtonVariant(): 'default' | 'black-inverted' {
    if (this.showConfirmButton === false) {
      return 'black-inverted'
    } else {
      return 'default'
    }
  }

  private createPortal() {
    if (!this.portalHost) {
      this.portalHost = this.renderer.createElement('div');
      this.renderer.addClass(this.portalHost, 'modal-portal');
      // Asegurar z-index alto para el portal
      this.renderer.setStyle(this.portalHost, 'z-index', '9999');
      this.renderer.appendChild(document.body, this.portalHost);
    }

    if (!this.viewRef && this.modalTemplate) {
      this.viewRef = this.modalTemplate.createEmbeddedView({});
      this.viewContainer.insert(this.viewRef);

      // Mover el contenido del template al portal
      const embeddedView = this.viewRef as import('@angular/core').EmbeddedViewRef<any>;
      const templateNodes = embeddedView.rootNodes;
      templateNodes.forEach(node => {
        this.renderer.appendChild(this.portalHost, node);
      });

      // Configurar z-index dinámicamente para elementos select
      this.setupSelectZIndex();
    }
  }

  private setupSelectZIndex() {
    if (!this.portalHost) return;

    // Observer para elementos select que se añadan dinámicamente
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;

            // Buscar dropdowns/selects y configurar z-index
            const selects = element.querySelectorAll('select, .mat-select, .p-dropdown, .ng-select');
            selects.forEach((select) => {
              this.renderer.setStyle(select, 'z-index', '10002');
            });

            // Buscar paneles de dropdown específicos
            const panels = element.querySelectorAll(
              '.mat-select-panel, .p-dropdown-panel, .ng-dropdown-panel, .custom-select-dropdown'
            );
            panels.forEach((panel) => {
              this.renderer.setStyle(panel, 'z-index', '10003');
            });
          }
        });
      });
    });

    observer.observe(this.portalHost, {
      childList: true,
      subtree: true
    });

    // Limpiar observer cuando se destruya el modal
    setTimeout(() => {
      if (!this.isVisible) {
        observer.disconnect();
      }
    }, 1000);
  }

  private destroyPortal() {
    if (this.viewRef) {
      const index = this.viewContainer.indexOf(this.viewRef);
      if (index !== -1) {
        this.viewContainer.remove(index);
      }
      this.viewRef = null;
    }

    if (this.portalHost) {
      this.renderer.removeChild(document.body, this.portalHost);
      this.portalHost = null;
    }
  }

  private openModal() {
    // Crear el portal antes de mostrar el modal
    this.createPortal();

    // Guardar el elemento que tenía focus antes del modal
    this.originalFocus = document.activeElement as HTMLElement;

    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';

    // Mostrar modal inmediatamente
    this.isVisible = true;

    // Listener para tecla Escape
    document.addEventListener('keydown', this.keydownListener);

    // Iniciar animación de apertura
    setTimeout(() => {
      this.showBackdrop = true;

      // Pequeño delay adicional para el contenido
      setTimeout(() => {
        this.showContent = true;

        // Establecer focus después de que la animación termine
        setTimeout(() => {
          this.setFocus();
        }, 100);
      }, 50);
    }, 10);
  }

  private closeModal() {
    this.showContent = false;

    setTimeout(() => {
      this.showBackdrop = false;

      // Ocultar modal completamente después de la animación
      setTimeout(() => {
        this.isVisible = false;
        this.cleanupModal();
        this.destroyPortal();
      }, 300);
    }, 100);
  }

  private cleanupModal() {
    // Restaurar scroll del body
    document.body.style.overflow = '';

    // Remover listener
    document.removeEventListener('keydown', this.keydownListener);

    // Restaurar focus
    this.restoreFocus();
  }

  private handleEscapeKey(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.close();
    }
  }

  private setFocus() {
    if (this.portalHost) {
      const modalContent = this.portalHost.querySelector('[tabindex="-1"]') as HTMLElement;
      if (modalContent) {
        modalContent.focus();
      }
    }
  }

  private restoreFocus() {
    if (this.originalFocus) {
      this.originalFocus.focus();
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (this.disableClose) {
      return;
    }
    if (this.closeOnBackdrop && event.target === event.currentTarget) {
      this.close();
    }
  }

  close() {
    this.onClose.emit();
  }

  confirm() {
    this.onConfirm.emit();
  }
}