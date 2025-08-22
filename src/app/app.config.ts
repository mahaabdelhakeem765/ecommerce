import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations'
import { provideToastr } from 'ngx-toastr';
import { headersInterceptor } from './core/iterceptors/headers/headers.interceptor';
import { errorsInterceptor } from './core/iterceptors/errors/errors.interceptor';
import { loadingInterceptor } from './core/iterceptors/loading/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch() , withInterceptors([headersInterceptor , errorsInterceptor , loadingInterceptor])),
    provideAnimations(),
    provideToastr(),
  ],
};
