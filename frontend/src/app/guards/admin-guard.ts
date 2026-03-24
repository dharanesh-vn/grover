import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const managerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // First, check if the user is logged in at all.
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // Next, get the current user and check their role.
  const user = authService.getCurrentUser();
  if (user && user.role === 'Admin') {
    return true; // The user is a Admin, allow access.
  } else {
    // The user is logged in but is NOT a Admin. Block access.
    alert('Access Denied: This page is for Admins only.'); // Show a clear message
    
    // Redirect them to their own dashboard or a safe default.
    const userRole = user ? user.role.toLowerCase() : '';
    if (userRole === 'agronomist' || userRole === 'operator') {
      router.navigate([`/app/dashboard-${userRole}`]);
    } else {
      router.navigate(['/app/weather']); // Fallback for any unexpected case
    }
    return false;
  }
};