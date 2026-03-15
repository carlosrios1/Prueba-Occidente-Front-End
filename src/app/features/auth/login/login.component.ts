import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { LoginHeroComponent } from './components/login-hero/login-hero.component';
import { LoginFormComponent, LoginCredentials } from './components/login-form/login-form.component';
import { AuthHttpService } from '../services/auth-http.service';
import { AuthStateService } from '../services/auth-state.service';
import { ToastService } from '@shared/components/toast/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginHeroComponent, LoginFormComponent],
  templateUrl: './login.component.html'
})
export class LogInComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authHttp = inject(AuthHttpService);
  private authState = inject(AuthStateService);
  private toast = inject(ToastService);

  isLoading = signal(false);
  mensajeError = '';
  isDarkMode = signal(false);

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    this.isDarkMode.set(isDark);
    this.applyTheme(isDark);
  }

  private applyTheme(isDark: boolean) {
    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.add('dark');
      htmlElement.setAttribute('data-theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      htmlElement.setAttribute('data-theme', 'light');
    }
  }

  async handleLogin(credentials: LoginCredentials) {
    this.mensajeError = '';
    this.isLoading.set(true);

    try {
      const response = await firstValueFrom(this.authHttp.login(credentials));
      this.authState.setSession(response);
      this.toast.showToast({ type: 'success', message: '¡Bienvenido! Sesión iniciada correctamente.', duration: 3000 });
      this.router.navigate(['/lots']);
    } catch (err: any) {
      this.isLoading.set(false);
      if (err?.status === 401 || err?.status === 400) {
        this.mensajeError = 'Usuario o contraseña incorrectos.';
      } else if (err?.status === 0) {
        this.mensajeError = 'No se pudo conectar con el servidor.';
      } else {
        this.mensajeError = 'Ocurrió un error inesperado. Intenta de nuevo.';
      }
    }
  }
}