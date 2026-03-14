import { Injectable, ComponentRef, ApplicationRef, createComponent, EnvironmentInjector, inject } from '@angular/core';
import { ToastComponent, ToastData } from '../toast/toast.component';
import { ToastContainerComponent } from '../toast-container/tost-container.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private activeToasts: ComponentRef<ToastComponent>[] = [];
  private containerRef: ComponentRef<ToastContainerComponent> | null = null;
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);

  private ensureContainer() {
    if (!this.containerRef) {
      // Crear el contenedor si no existe
      this.containerRef = createComponent(ToastContainerComponent, {
        environmentInjector: this.injector
      });

      // Adjuntar al DOM
      document.body.appendChild(this.containerRef.location.nativeElement);

      // Adjuntar a la detección de cambios
      this.appRef.attachView(this.containerRef.hostView);
    }

    return this.containerRef.location.nativeElement.querySelector('.toast-container');
  }

  showToast(data: ToastData) {
    // Asegurar que existe el contenedor
    const containerElement = this.ensureContainer();

    // Crear componente toast
    const toastComponentRef = createComponent(ToastComponent, {
      environmentInjector: this.injector
    });

    // Configurar datos
    toastComponentRef.instance.data = data;
    toastComponentRef.instance.id = Date.now().toString();

    // Adjuntar al contenedor en vez de al body
    containerElement.appendChild(toastComponentRef.location.nativeElement);

    // Adjuntar a la detección de cambios
    this.appRef.attachView(toastComponentRef.hostView);

    // Almacenar referencia
    this.activeToasts.push(toastComponentRef);

    return toastComponentRef.instance.id;
  }

  removeToast(id?: string) {
    if (!id) {
      // Si no se proporciona ID, eliminar todos
      this.activeToasts.forEach(toast => this.removeToastRef(toast));
      this.activeToasts = [];
      return;
    }

    // Encontrar toast por ID
    const index = this.activeToasts.findIndex(toast => toast.instance.id === id);
    if (index !== -1) {
      const toastToRemove = this.activeToasts[index];
      this.removeToastRef(toastToRemove);
      this.activeToasts.splice(index, 1);
    }
  }

  private removeToastRef(toastRef: ComponentRef<ToastComponent>) {
    // Eliminar del DOM
    const hostElement = toastRef.location.nativeElement;
    if (hostElement.parentNode) {
      hostElement.parentNode.removeChild(hostElement);
    }

    // Desconectar de la detección de cambios
    this.appRef.detachView(toastRef.hostView);

    // Destruir componente
    toastRef.destroy();
  }

  // Métodos de conveniencia para diferentes tipos de toast
  success(message: string, duration?: number) {
    return this.showToast({ message, type: 'success', duration });
  }

  error(message: string, duration?: number) {
    return this.showToast({ message, type: 'error', duration });
  }

  warning(message: string, duration?: number) {
    return this.showToast({ message, type: 'warning', duration });
  }

  info(message: string, duration?: number) {
    return this.showToast({ message, type: 'info', duration });
  }
}