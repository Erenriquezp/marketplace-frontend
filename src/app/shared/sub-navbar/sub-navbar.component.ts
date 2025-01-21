import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sub-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sub-navbar.component.html',
  styleUrl: './sub-navbar.component.scss'
})
export class SubNavbarComponent {

  isAuthenticated = false;
  userId: number | null = null;
  userRoles: string[] = [];

  constructor(private authService: AuthService, private router: Router) {
    this.isAuthenticated = this.authService.isAuthenticated();
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.userId = currentUser.id;
      this.userRoles = currentUser.roles;
    }
  }
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
