import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const agronomistGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const user = authService.getCurrentUser();
  if (user && user.role === 'Agronomist') {
    return true; // The user is an Agronomist, allow access.
  } else {
    // Role mismatch
    const userRole = user ? user.role.toLowerCase() : '';
    if (userRole === 'admin') {
      router.navigate(['/app/dashboard-admin']);
    } else if (userRole === 'operator') {
      router.navigate(['/app/dashboard-operator']);
    } else {
      router.navigate(['/app/weather']);
    }
    return false;
  }
};
