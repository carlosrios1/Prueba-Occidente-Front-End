// loader.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from './services/loader.service';
import { combineLatest, map } from 'rxjs';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          style({ transform: 'scale(1)', opacity: 1 })
        )
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          style({ transform: 'scale(0.8)', opacity: 0 })
        )
      ])
    ])
  ],
  template: `
  @if (loaderState$ | async; as state) {
   <div [class]="state.fullScreen ? 'fixed inset-0 z-[99999]' : 'absolute inset-0 z-50'" @fadeInOut>
      <!-- Backdrop adaptativo -->
      <div [class]="getBackdropClasses(state.fullScreen)"></div>

      <!-- Spinner container con mejor posicionamiento -->
      <div class="relative z-10 flex items-center justify-center w-full h-full p-4">
        <!-- Contenedor del spinner -->
        <div class="relative flex items-center justify-center" @scaleIn>
          <!-- Spinner principal -->
          <div class="w-16 h-16 motion-duration-1000">
            <div class="w-16 h-16 loading-spinner loading bg-gradient-to-r from-green-500 to-orange-400 dark:from-green-300 dark:to-orange-300 shadow-2xl dark:shadow-orange-500/20 rounded-full border-2 border-white/20"></div>
          </div>
          
          <!-- Anillo exterior decorativo -->
          <div class="absolute w-24 h-24 border-2 border-orange-200/40 dark:border-orange-300/40 rounded-full animate-ping"></div>
        </div>
      </div>
    </div>
  }
  `,
})
export class LoaderComponent {
  private loaderService = inject(LoaderService);

  // Combinar isVisible y fullScreen en un solo observable
  loaderState$ = combineLatest([
    this.loaderService.isVisible$,
    this.loaderService.fullScreen$,
    this.loaderService.data$
  ]).pipe(
    map(([isVisible, fullScreen, data]) => ({
      isVisible,
      fullScreen,
      data
    }))
  ).pipe(
    map(state => state.isVisible ? state : null)
  );

  getBackdropClasses(fullScreen: boolean): string {
    const baseClasses = "absolute inset-0 transition-all duration-300 ease-out z-0";

    if (fullScreen) {
      return `${baseClasses} bg-gradient-to-br from-black/40 to-black/60 dark:from-black/60 dark:to-black/80 backdrop-blur-md`;
    } else {
      return `${baseClasses} bg-transparent dark:from-gray-900/80 dark:to-gray-900/90 backdrop-blur-sm`;
    }
  }
}