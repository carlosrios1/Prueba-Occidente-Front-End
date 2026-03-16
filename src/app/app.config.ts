import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
  { provide: LOCALE_ID, useValue: 'es' },
  provideRouter(routes),
  provideAnimations(),
  provideHttpClient(
    withInterceptors([authInterceptor, errorInterceptor])
  )
  ]
};
