import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CheckInComponent } from './components/check-in/check-in.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { PromocionesComponent } from './components/promociones/promociones.component';
import { SomosComponent } from './components/somos/somos.component';
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';

export const routes: Routes = [
  // Rutas Protegidas (Requieren Login)
  {
    path: '',
    canActivate: [authGuard], // Protegida
    title: 'Inicio | Brisa & Denis',
    // Carga perezosa para el HomeComponent
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'catalogo',
    canActivate: [authGuard], // Protegida
    title: 'Catalogo | Brisa & Denis',
    // Carga perezosa para el CatalogoComponent
    loadComponent: () =>
      import('./components/catalogo/catalogo.component').then(
        (m) => m.CatalogoComponent
      ),
  },
  {
    path: 'promociones',
    canActivate: [authGuard], // Protegida
    title: 'IPromociones | Brisa & Denis',
    // Carga perezosa para el PromocionesComponent
    loadComponent: () =>
      import('./components/promociones/promociones.component').then(
        (m) => m.PromocionesComponent
      ),
  },
  {
    path: 'somos',
    canActivate: [authGuard], // Protegida
    title: 'Somos | Brisa & Denis',
    // Carga perezosa para el SomosComponent
    loadComponent: () =>
      import('./components/somos/somos.component').then(
        (m) => m.SomosComponent
      ),
  },

  // Rutas Públicas (Solo accesibles si NO están logueados)
  {
    path: 'iniciar-sesion',
    canActivate: [publicGuard], // Protegida contra usuarios logueados
    title: 'Iniciar Sesión | Brisa & Denis',
    // Carga perezosa para el LoginComponent
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'registrate',
    canActivate: [publicGuard], // Protegida contra usuarios logueados
    title: 'Registro de Usuario | Brisa & Denis',
    // Carga perezosa para el CheckInComponent
    loadComponent: () =>
      import('./components/check-in/check-in.component').then(
        (m) => m.CheckInComponent
      ),
  },

  // Wildcard para rutas no encontradas o errores, redirige al inicio
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
