import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Verifica si el usuario tiene al menos uno de los roles requeridos para acceder a la ruta.
   */
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;

    // Verificar si el usuario está autenticado y tiene roles
    if (currentUser?.roles && route.data['roles']) {
      // Verificar si al menos uno de los roles requeridos está en los roles del usuario
      const hasRole = route.data['roles'].some((role: string) =>
        currentUser.roles.includes(role)
      );

      if (hasRole) {
        return true; // Usuario tiene permiso
      }
    }

    // Si no tiene permisos, redirigir al login o a una página de acceso denegado
    this.router.navigate(['/auth/login']);
    return false;
  }
}
