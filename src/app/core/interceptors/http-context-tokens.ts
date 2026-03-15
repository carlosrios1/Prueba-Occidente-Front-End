import { HttpContextToken } from '@angular/common/http';

/**
 * Token de contexto HTTP para suprimir el toast de error del interceptor.
 * Úsalo en peticiones donde un error 404 es esperado (ej. sin ganadores aún).
 *
 * Ejemplo de uso:
 *   this.http.get(url, {
 *     context: new HttpContext().set(SKIP_ERROR_TOAST, true)
 *   })
 */
export const SKIP_ERROR_TOAST = new HttpContextToken<boolean>(() => false);
