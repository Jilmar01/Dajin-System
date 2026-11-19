import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Rol } from '../../models/rol';
import { AuthService } from '../auth/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const roles = (route.data['roles'] ?? []) as Rol[];

  return inject(AuthService).isRol(roles)
    ? true
    : inject(Router).createUrlTree(['/']);
};

