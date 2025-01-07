import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;

    if (currentUser && route.data['roles']?.includes(currentUser.role)) {
      return true;
    }

    // Redirige al login si no tiene permisos
    this.router.navigate(['/auth/login']);
    return false;
  }
}
