import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes'; 

// --- Importaciones de Firebase y Formularios ---
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth'; 
import { environment } from '../environments/environment'; // <-- Importación corregida
import { ReactiveFormsModule } from '@angular/forms'; // <-- Importación corregida: Usamos la clase del módulo

export const appConfig: ApplicationConfig = {
  providers: [
    // --- Angular Core ---
    provideRouter(routes), 
    provideClientHydration(),
    provideHttpClient(), 

    // --- Firebase & Autenticación ---
    // 💡 SOLUCIÓN ERROR DE AMBIENTE: Usamos la función initializeApp DENTRO de provideFirebaseApp
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),

    // 💡 SOLUCIÓN ERROR DE FORMS: Usamos importProvidersFrom con el módulo clásico
    importProvidersFrom(ReactiveFormsModule)
  ]
};