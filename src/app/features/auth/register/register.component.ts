import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { LoginHeroComponent } from '../login/components/login-hero/login-hero.component';
import { RegisterFormComponent, RegisterCredentials } from './components/register-form/register-form.component';
import { AuthHttpService } from '../services/auth-http.service';
import { ToastService } from '@shared/components/toast/services/toast.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [LoginHeroComponent, RegisterFormComponent],
    template: `
        <div class="flex h-screen overflow-hidden">
            <app-login-hero class="hidden lg:flex lg:w-1/2 h-full"></app-login-hero>
            <app-register-form
                class="flex w-full lg:w-1/2 h-full overflow-y-auto"
                [isLoading]="isLoading()"
                [mensajeError]="mensajeError"
                (submitRegister)="handleRegister($event)">
            </app-register-form>
        </div>
    `
})
export class RegisterComponent {
    private router = inject(Router);
    private authHttp = inject(AuthHttpService);
    private toast = inject(ToastService);

    isLoading = signal(false);
    mensajeError = '';

    async handleRegister(credentials: RegisterCredentials) {
        this.mensajeError = '';
        this.isLoading.set(true);

        try {
            await firstValueFrom(this.authHttp.register(credentials));
            this.toast.showToast({
                type: 'success',
                message: '¡Cuenta creada! Ahora puedes iniciar sesión.',
                duration: 3000
            });
            this.router.navigate(['/auth/log-in']);
        } catch (err: any) {
            this.isLoading.set(false);
            if (err?.status === 409) {
                this.mensajeError = `El usuario "${credentials.username}" ya existe.`;
            } else if (err?.status === 400) {
                this.mensajeError = 'Datos inválidos. Verifica los campos.';
            } else if (err?.status === 0) {
                this.mensajeError = 'No se pudo conectar con el servidor.';
            } else {
                this.mensajeError = 'Ocurrió un error inesperado. Intenta de nuevo.';
            }
        } finally {
            this.isLoading.set(false);
        }
    }
}
