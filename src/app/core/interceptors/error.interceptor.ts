import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '@shared/components/toast/services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const toast = inject(ToastService);
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            const isLoginRequest = req.url.includes('/api/auth/login');

            if (!isLoginRequest) {
                let message: string;

                if (error.status === 0) {
                    message = 'No se pudo conectar con el servidor. Verifica que la API esté activa.';
                } else {
                    message = getDefaultMessage(error.status);
                }

                toast.showToast({ type: 'error', message, duration: 5000 });

                if (error.status === 401) {
                    localStorage.removeItem('auth_token');
                    router.navigate(['/log-in'], { queryParams: { message: 'Sesión expirada. Inicia sesión nuevamente.' } });
                }
            }

            return throwError(() => error);
        })
    );
};

function getDefaultMessage(status: number): string {
    switch (status) {
        case 400: return 'Solicitud inválida. Verifica los datos enviados.';
        case 401: return 'No autorizado. Inicia sesión nuevamente.';
        case 403: return 'Acceso denegado.';
        case 404: return 'El recurso solicitado no fue encontrado.';
        case 408: return 'Tiempo de espera agotado. Intenta de nuevo.';
        case 409: return 'Conflicto: la operación no pudo completarse.';
        case 503: return 'El servicio no está disponible en este momento.';
        default: return 'Ocurrió un error inesperado. Intenta de nuevo.';
    }
}
