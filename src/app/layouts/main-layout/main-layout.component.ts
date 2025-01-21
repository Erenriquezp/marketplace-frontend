import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { SubNavbarComponent } from "../../shared/sub-navbar/sub-navbar.component";
import { FooterComponent } from "../../shared/footer/footer.component";


@Component({
  selector: 'app-main-layout',
  imports: [RouterModule, CommonModule, NavbarComponent, SubNavbarComponent, FooterComponent], // Add SubNavbarComponent to the imports array
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  isAuthenticated = false;
  userId: number | null = null;

  constructor(private authService: AuthService, private router: Router) {
    // Verifica si el usuario está autenticado
    this.isAuthenticated = this.authService.isAuthenticated();
    this.userId = this.authService.currentUserValue?.id || null;
  }

   // Obtén el ID del usuario autenticado si está disponible
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']); // Redirige al login después del logout
  }
}
