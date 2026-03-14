import { Component, OnInit, Input, inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { filter, pairwise, startWith } from 'rxjs/operators';
import { Subject, takeUntil } from 'rxjs';
import { ChevronRight, LucideAngularModule } from "lucide-angular";

export interface BreadcrumbItem {
  label: string;
  url: string;
  isActive: boolean;
  isExiting?: boolean;
  isEntering?: boolean;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center">
        <!-- Home/Principal -->
        <li class="inline-flex items-center">
          <span class="text-sm tracking-tight font-medium text-neutral-600 dark:text-neutral-400">
            Principal
          </span>
        </li>
        
        <!-- Breadcrumb items -->
        @for (item of displayBreadcrumbs; track item.url; let isLast = $last) {
          <!-- Separator -->
          <li class="flex items-center">
            <lucide-icon 
              [img]="icons.ChevronRight" 
              class="w-4 h-4 text-neutral-500 dark:text-neutral-400 mx-1 flex-shrink-0"
              [class.separator-exit]="item.isExiting"
            ></lucide-icon>
            
            <!-- Breadcrumb link or text -->
            @if (item.isActive || isLast) {
              <span 
                class="text-sm tracking-tight font-medium text-neutral-600 dark:text-neutral-100 whitespace-nowrap ml-1"
                [class.item-exit]="item.isExiting"
                [class.item-enter-forward]="item.isEntering && animationType === 'forward'"
                [class.item-enter-backward]="item.isEntering && animationType === 'backward'"
                [class.item-enter-direct]="item.isEntering && animationType === 'direct'"
              >
                {{ item.label }}
              </span>
            } @else {
              <a 
                [routerLink]="item.url" 
                class="text-sm font-medium text-neutral-900 hover:text-green-600 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors duration-200 ease-in-out whitespace-nowrap ml-1"
                [class.item-exit]="item.isExiting"
                [class.item-enter-forward]="item.isEntering && animationType === 'forward'"
                [class.item-enter-backward]="item.isEntering && animationType === 'backward'"
                [class.item-enter-direct]="item.isEntering && animationType === 'direct'"
              >
                {{ item.label }}
              </a>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: [`
    /* Animaciones de entrada */
    .item-enter-forward {
      animation: slideInFromRight 0.4s ease-out forwards;
    }
    
    .item-enter-backward {
      animation: fadeIn 0.25s ease-out forwards;
    }
    
    .item-enter-direct {
      animation: fadeIn 0.2s ease-out forwards;
    }
    
    /* Animaciones de salida */
    .item-exit {
      animation: slideOutToRight 0.3s ease-in forwards;
    }
    
    .separator-exit {
      animation: fadeOut 0.25s ease-in forwards;
    }
    
    /* Keyframes para entrada */
    @keyframes slideInFromRight {
      0% {
        opacity: 0;
        transform: translateX(20px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes fadeIn {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
    
    /* Keyframes para salida */
    @keyframes slideOutToRight {
      0% {
        opacity: 1;
        transform: translateX(0) scaleX(1);
        max-width: 200px;
      }
      50% {
        opacity: 0.3;
        transform: translateX(10px) scaleX(0.95);
      }
      100% {
        opacity: 0;
        transform: translateX(20px) scaleX(0.8);
        max-width: 0;
        margin-left: 0;
        margin-right: 0;
        padding-left: 0;
        padding-right: 0;
      }
    }
    
    @keyframes fadeOut {
      0% {
        opacity: 1;
        transform: scaleX(1);
      }
      100% {
        opacity: 0;
        transform: scaleX(0);
        margin-left: 0;
        margin-right: 0;
      }
    }
    
    /* Estados iniciales para animaciones */
    .item-enter-forward,
    .item-enter-backward,
    .item-enter-direct {
      opacity: 0;
    }
    
    /* Transición suave para elementos normales */
    span:not([class*="item-"]),
    a:not([class*="item-"]) {
      transition: all 0.2s ease-out;
    }
  `]
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  @Input() currentPageName: string = '';

  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  breadcrumbs: BreadcrumbItem[] = [];
  displayBreadcrumbs: BreadcrumbItem[] = [];

  icons = {
    ChevronRight
  };

  animationType: 'forward' | 'backward' | 'direct' = 'forward';
  private animationTimeout: any;
  private isAnimating = false;
  private isFirstLoad = true; // Nueva bandera para controlar la primera carga

  // Mapeo opcional de rutas a nombres específicos
  private routeLabels: { [key: string]: string } = {
    // Agregar casos específicos si es necesario
  };

  ngOnInit() {
    // Detectar dirección de navegación y construir breadcrumbs
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        startWith(null as NavigationEnd | null),
        pairwise(),
        takeUntil(this.destroy$)
      )
      .subscribe(([previous, current]) => {
        if (previous && current &&
          previous instanceof NavigationEnd &&
          current instanceof NavigationEnd) {
          // Navegación subsecuente - aplicar animaciones
          this.isFirstLoad = false;
          this.detectNavigationDirection(previous.url, current.url);
          this.animateTransition(previous.url, current.url);
        } else {
          // Primera carga - sin animaciones
          this.buildBreadcrumbs();
          this.displayBreadcrumbs = [...this.breadcrumbs];
          this.isFirstLoad = true;
        }
      });

    // Generar breadcrumbs inicial
    this.buildBreadcrumbs();
    this.displayBreadcrumbs = [...this.breadcrumbs];
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
  }

  private detectNavigationDirection(previousUrl: string, currentUrl: string): void {
    const prevSegments = previousUrl.split('/').filter(s => s);
    const currentSegments = currentUrl.split('/').filter(s => s);

    // Determinar tipo de navegación
    if (currentSegments.length < prevSegments.length) {
      this.animationType = 'backward';
    } else if (currentSegments.length > prevSegments.length) {
      this.animationType = 'forward';
    } else {
      // Mismo nivel - probablemente click directo en breadcrumb o navegación lateral
      this.animationType = 'direct';
    }
  }

  private animateTransition(previousUrl: string, currentUrl: string): void {
    // No animar si es la primera carga
    if (this.isFirstLoad || this.isAnimating) return;

    this.isAnimating = true;
    const oldBreadcrumbs = [...this.displayBreadcrumbs];

    // Construir nuevos breadcrumbs
    this.buildBreadcrumbs();
    const newBreadcrumbs = [...this.breadcrumbs];

    // Determinar qué elementos salen y cuáles entran
    const exitingItems = this.getExitingItems(oldBreadcrumbs, newBreadcrumbs);
    const enteringItems = this.getEnteringItems(oldBreadcrumbs, newBreadcrumbs);

    // Si no hay cambios, no animar
    if (exitingItems.length === 0 && enteringItems.length === 0) {
      this.displayBreadcrumbs = [...newBreadcrumbs];
      this.isAnimating = false;
      return;
    }

    // Fase 1: Marcar elementos que salen
    if (exitingItems.length > 0) {
      this.displayBreadcrumbs = oldBreadcrumbs.map(item => ({
        ...item,
        isExiting: exitingItems.some(exitItem => exitItem.url === item.url)
      }));
      this.cdr.detectChanges();

      // Fase 2: Después de la animación de salida, mostrar nuevos elementos
      setTimeout(() => {
        this.displayBreadcrumbs = newBreadcrumbs.map(item => ({
          ...item,
          isEntering: enteringItems.some(enterItem => enterItem.url === item.url)
        }));
        this.cdr.detectChanges();

        // Fase 3: Limpiar estados de animación
        setTimeout(() => {
          this.displayBreadcrumbs = newBreadcrumbs.map(item => ({
            ...item,
            isExiting: false,
            isEntering: false
          }));
          this.isAnimating = false;
          this.cdr.detectChanges();
        }, this.getEnterAnimationDuration());

      }, 300); // Duración de animación de salida
    } else {
      // Solo elementos entrando (navegación hacia adelante)
      this.displayBreadcrumbs = newBreadcrumbs.map(item => ({
        ...item,
        isEntering: enteringItems.some(enterItem => enterItem.url === item.url)
      }));
      this.cdr.detectChanges();

      setTimeout(() => {
        this.displayBreadcrumbs = newBreadcrumbs.map(item => ({
          ...item,
          isExiting: false,
          isEntering: false
        }));
        this.isAnimating = false;
        this.cdr.detectChanges();
      }, this.getEnterAnimationDuration());
    }
  }

  private getExitingItems(oldItems: BreadcrumbItem[], newItems: BreadcrumbItem[]): BreadcrumbItem[] {
    return oldItems.filter(oldItem =>
      !newItems.some(newItem => newItem.url === oldItem.url)
    );
  }

  private getEnteringItems(oldItems: BreadcrumbItem[], newItems: BreadcrumbItem[]): BreadcrumbItem[] {
    return newItems.filter(newItem =>
      !oldItems.some(oldItem => oldItem.url === newItem.url)
    );
  }

  private getEnterAnimationDuration(): number {
    switch (this.animationType) {
      case 'forward': return 400;
      case 'backward': return 250;
      case 'direct': return 200;
      default: return 300;
    }
  }

  private buildBreadcrumbs(): void {
    this.breadcrumbs = [];
    const currentUrl = this.router.url.split('?')[0];

    // Decodificar la URL antes de dividirla en segmentos
    const decodedUrl = decodeURIComponent(currentUrl);
    const urlSegments = decodedUrl.split('/').filter((segment: string) => segment);

    // Construir breadcrumbs para cada segmento excepto el último
    for (let i = 0; i < urlSegments.length - 1; i++) {
      const partialUrl = '/' + urlSegments.slice(0, i + 1).join('/');
      const segment = urlSegments[i];

      const label = this.routeLabels[segment] || this.formatRouteName(segment);

      this.breadcrumbs.push({
        label,
        url: partialUrl,
        isActive: false
      });
    }

    // Agregar la página actual
    if (urlSegments.length > 0) {
      const lastSegment = urlSegments[urlSegments.length - 1];
      const finalLabel = this.currentPageName ||
        this.routeLabels[lastSegment] ||
        this.formatRouteName(lastSegment);

      this.breadcrumbs.push({
        label: finalLabel,
        url: decodedUrl,
        isActive: true
      });
    }
  }

  private formatRouteName(path: string): string {
    // Si es un parámetro (número o GUID), devolver un nombre genérico
    if (/^\d+$/.test(path) || /^[0-9a-f-]{36}$/i.test(path)) {
      return 'Detalle';
    }

    // Capitalizar automáticamente la primera letra y reemplazar guiones con espacios
    return path
      .split('-')
      .map((word: string) => {
        if (word.length === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }

  // Método público para agregar labels específicos si es necesario
  updateRouteLabels(labels: { [key: string]: string }): void {
    this.routeLabels = { ...this.routeLabels, ...labels };
    this.buildBreadcrumbs();
  }

  // Método auxiliar para decodificar segmentos individualmente si es necesario
  private decodeSegment(segment: string): string {
    try {
      return decodeURIComponent(segment);
    } catch (error) {
      console.warn('Error decoding URL segment:', segment, error);
      return segment;
    }
  }
}