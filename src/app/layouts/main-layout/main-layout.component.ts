import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule, CommonModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  isAuthenticated = false;

  constructor(private authService: AuthService, private router: Router) {
    // Verifica si el usuario está autenticado
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']); // Redirige al login después del logout
  }
}
