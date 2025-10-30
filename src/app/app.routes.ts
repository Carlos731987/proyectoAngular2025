import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CheckInComponent } from './components/check-in/check-in.component';

import { SomosComponent } from './components/somos/somos.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Inicio | Brisa & Denis' },
  { path: 'somos', component: SomosComponent, title: 'Somos' },
  { path: 'iniciar-sesion', component: LoginComponent, title: 'Iniciar Sesión' },
  { path: 'registrate', component: CheckInComponent, title: 'Registro de Usuario' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];