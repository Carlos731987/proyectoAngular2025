import { inject, Injector } from '@angular/core'; // Agregamos Injector para toObservable
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, take } from 'rxjs';
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
  return toObservable(authService.isAuthenticated, { injector: injector }).pipe(
    take(1),
    map(isAuthenticated => {
      // Si el usuario NO está autenticado, redirige a la página de inicio de sesión.
      if (!isAuthenticated) {
        return router.createUrlTree(['/iniciar-sesion']);
      }

      // Si el usuario SÍ está autenticado, permite el acceso a la ruta.
      return true;
    })
  );
};
