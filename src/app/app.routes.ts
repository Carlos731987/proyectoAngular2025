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
  {
    path: '',
    title: 'Inicio | Brisa & Denis',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'home',
    title: 'Dashboard | Brisa & Denis',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'catalogo',
    canActivate: [authGuard],
    title: 'Catalogo | Brisa & Denis',
    loadComponent: () =>
      import('./components/catalogo/catalogo.component').then(
        (m) => m.CatalogoComponent
      ),
  },
  {
    path: 'promociones',
    canActivate: [authGuard],
    title: 'Promociones | Brisa & Denis',
    loadComponent: () =>
      import('./components/promociones/promociones.component').then(
        (m) => m.PromocionesComponent
      ),
  },
  {
    path: 'somos',
    title: 'Somos | Brisa & Denis',
    loadComponent: () =>
      import('./components/somos/somos.component').then(
        (m) => m.SomosComponent
      ),
  },
  {
    path: 'iniciar-sesion',
    canActivate: [publicGuard],
    title: 'Iniciar Sesión | Brisa & Denis',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'registrate',
    canActivate: [publicGuard],
    title: 'Registro de Usuario | Brisa & Denis',
    loadComponent: () =>
      import('./components/check-in/check-in.component').then(
        (m) => m.CheckInComponent
      ),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
