import { inject, Injector } from '@angular/core'; 
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, take, filter } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';

/**
 * Admin Guard: Permite la navegación SOLAMENTE si el usuario autenticado
 * tiene el email del administrador.
 * Se utiliza la lógica de espera de carga (loading) para evitar falsos negativos.
 */

// Email fijo del administrador para la verificación estricta.
const ADMIN_EMAIL = 'admin@importsbrisaydenis.com.ar';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const injector = inject(Injector); 

  // 1. Espera a que el estado de carga (loading) de Firebase termine.
  return toObservable(authService.loading, { injector: injector }).pipe(
    filter(loading => loading === false), // Ignora todos los valores hasta que la carga termine
    take(1),
    
    // 2. Obtenemos el usuario actual.
    map(() => authService.currentUser()),
    
    // 3. Verificamos el rol
    map(user => {
      const isAdmin = user?.email === ADMIN_EMAIL;
      
      if (!isAdmin) {
        // Si no es administrador, lo enviamos a la página pública (Somos).
        console.warn(`Acceso Denegado: Usuario ${user?.email || 'no autenticado'} intentó acceder a /admin.`);
        return router.createUrlTree(['/home']); 
      }
      return true; // Permite el acceso
    })
  );
}