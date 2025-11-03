import { inject, Injector } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, take, filter } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';

export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const injector = inject(Injector); 
  
  return toObservable(authService.loading, { injector: injector }).pipe(
    filter(loading => loading === false),
    take(1),   
    
    map(() => authService.isAuthenticated()),
        
    map(isAuthenticated => {
      if (isAuthenticated) { return router.parseUrl('/');} 
      return true;
    })
  );
};