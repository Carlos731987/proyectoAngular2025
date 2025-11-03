import { inject, Injector } from '@angular/core'; 
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, take, filter } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop'; // Importamos toObservable

/**
 * Auth Guard: Permite la navegación SOLAMENTE si el usuario está autenticado.
 * Propósito: Proteger rutas privadas como /catalogo, /promociones, etc.
 * Si el usuario no está logueado, lo redirige al login.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const injector = inject(Injector); // Inyectamos el Injector

  // FIX: Convertimos la señal authService.isAuthenticated() a un Observable
  return toObservable(authService.loading, { injector: injector }).pipe(
    filter(loading => loading === false), // Ignora todos los valores hasta que la carga termine
    take(1),
    map(() => authService.isAuthenticated()),

    map(isAuthenticated => {
      // Si el usuario NO está autenticado, redirige a la página de inicio de sesión.
      if (!isAuthenticated) { return router.createUrlTree(['/iniciar-sesion']);}
     return true;//permite el acceso
    })
  );
};
