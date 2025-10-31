import { inject, Injector } from '@angular/core'; // CORREGIDO: Usamos Injector en lugar de ChangeDetectorRef
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';

/**
 * Public Guard: Permite la navegación SOLAMENTE si el usuario NO está autenticado.
 *
 * Propósito: Proteger rutas como /iniciar-sesion y /registrate.
 * Si el usuario ya está logueado, lo redirige a la página de inicio ('/').
 */
export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  // FIX: Se inyecta Injector, que cumple con la interfaz requerida por toObservable.
  const injector = inject(Injector); 

  // Utilizamos toObservable para convertir la señal isAuthenticated()
  // en un Observable compatible con pipe/map.
  return toObservable(authService.isAuthenticated, { injector: injector }).pipe(
    take(1),
    map(isAuthenticated => {
      // Si el usuario SÍ está autenticado (isAuthenticated es true),
      // crea un UrlTree para redirigir al inicio, bloqueando el acceso a la ruta actual.
      if (isAuthenticated) {
        // Redirige al inicio si ya está logueado.
        return router.createUrlTree(['/']);
      }
      
      // Si el usuario NO está autenticado, permite el acceso a la ruta.
      return true;
    })
  );
};