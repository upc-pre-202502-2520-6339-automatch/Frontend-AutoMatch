import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService {

  constructor() { }
}
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { map, take } from 'rxjs';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as string[] | undefined;

  return authService.roles$.pipe(
    take(1),
    map(userRoles => {
      if (!expectedRoles || expectedRoles.length === 0) {
        return true; // si no se configuraron roles, no bloquea
      }

      const hasRole = expectedRoles.some(r => userRoles.includes(r));
      if (hasRole) return true;

      // si no tiene el rol requerido, lo mandamos al home o login
      router.navigate(['/home']).then();
      return false;
    })
  );
};
