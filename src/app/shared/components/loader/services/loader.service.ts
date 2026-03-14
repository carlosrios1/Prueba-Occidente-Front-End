// loader.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LoaderOptions {
  data?: any;
  fullScreen?: boolean; // true = cubre toda la pantalla, false = solo el área de contenido
}

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isVisibleSource = new BehaviorSubject<boolean>(false);
  isVisible$ = this.isVisibleSource.asObservable();

  private dataSource = new BehaviorSubject<any>(null);
  data$ = this.dataSource.asObservable();

  private fullScreenSource = new BehaviorSubject<boolean>(true); // Por defecto pantalla completa
  fullScreen$ = this.fullScreenSource.asObservable();

  open(options?: LoaderOptions | any) {
    // Si se pasa un objeto simple (retrocompatibilidad)
    if (options && typeof options === 'object' && !options.hasOwnProperty('fullScreen') && !options.hasOwnProperty('data')) {
      this.dataSource.next(options);
      this.fullScreenSource.next(true); // Por defecto pantalla completa para retrocompatibilidad
    } else if (options && typeof options === 'object') {
      // Si se pasa con el nuevo formato
      this.dataSource.next(options.data || null);
      this.fullScreenSource.next(options.fullScreen !== false); // Por defecto true si no se especifica
    } else {
      // Para casos simples
      this.dataSource.next(options);
      this.fullScreenSource.next(true);
    }

    this.isVisibleSource.next(true);
  }

  close() {
    this.isVisibleSource.next(false);
  }

  // Métodos de conveniencia
  openFullScreen(data?: any) {
    this.open({ data, fullScreen: true });
  }

  openContentOnly(data?: any) {
    this.open({ data, fullScreen: false });
  }
}