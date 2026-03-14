import { HttpClientModule } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginHeroComponent } from './components/login-hero/login-hero.component';
import { LoginFormComponent, LoginCredentials } from './components/login-form/login-form.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, LoginHeroComponent, LoginFormComponent],
  templateUrl: './login.component.html'
})
export class LogInComponent {
  constructor(private router: Router, private route: ActivatedRoute) { }
  // private authService = inject(AuthService);
  // private toast = inject(ToastService);

  message: string | null = null;
  isLoading = signal(false);

  mensajeError = '';
  // loggedUser!: User;
  isDarkMode = signal(false);
  // ON INIT ES CUANDO CARGA LA PAGINA
  ngOnInit() {
    const queryParams = this.route.snapshot.queryParams;
    this.message = queryParams['message']; //PARAMETROS PARA RECIBIR MENSAJE EN TOAST
    // if (this.message) {
    //   this.toast.error(this.message);
    // }

    // Verificar si ya hay un tema guardado
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

  //FUNCION HACER LOGIN - recibe credenciales del componente hijo
  async handleLogin(credentials: LoginCredentials) {
    //RESETEAR EL MENSAJE DE ERROR CADA VEZ QUE SE HACE SUBMIT
    this.mensajeError = '';
    // Activar el estado de carga para mostrar el spinner
    this.isLoading.set(true);

    try {
      // LOGIN usando firstValueFrom
      // const response = await firstValueFrom(this.authService.login(credentials));

      // this.loggedUser = {
      //   displayName: response.data.displayName,
      //   email: response.data.email, token: response.data.token, username: response.data.username
      // };
      // localStorage.setItem('gestor_loggedUser', JSON.stringify(this.loggedUser));
      // this.isLoading.set(false);
      // this.router.navigate(['/']);

    } catch (err: any) {
      console.error(err);
      if (err.status === 0) {
        this.mensajeError = 'No se pudo establecer conexión con el servidor. Por favor, inténtelo más tarde.';
      } else if (err.status === 401) {
        this.mensajeError = err.error.message;
      } else if (err.error && err.error.respuesta) {
        this.mensajeError = err.error.respuesta;
      } else {
        this.mensajeError = 'Ocurrió un error inesperado. Por favor, inténtelo nuevamente.';
      }
      this.isLoading.set(false);
    }
  }
}