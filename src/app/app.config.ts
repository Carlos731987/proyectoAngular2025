import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

// --- Importaciones de Firebase y Formularios ---
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment'; // Importación correcta
import { ReactiveFormsModule } from '@angular/forms'; // Usamos la clase del módulo

export const appConfig: ApplicationConfig = {
  providers: [
    // --- Angular Core ---
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),

    // --- Firebase & Autenticación ---
    // 💡 SOLUCIÓN: Usar environment.firebase, ya que ese es el nombre de la propiedad en environment.ts
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebase))
    ),
    importProvidersFrom(provideAuth(() => getAuth())),

    // 💡 SOLUCIÓN ERROR DE FORMS: Usamos importProvidersFrom con el módulo clásico
    importProvidersFrom(ReactiveFormsModule),
  ],
};
