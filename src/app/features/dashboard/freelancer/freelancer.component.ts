import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../../services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-freelancer',
  imports: [CommonModule, RouterModule],
  templateUrl: './freelancer.component.html',
  styleUrls: ['./freelancer.component.scss'],
})
export class FreelancerComponent implements OnInit {
  userData: User | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUserData();
  }

  // Cargar datos del usuario autenticado desde el backend
  private loadCurrentUserData(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.userService.getUserById(currentUser.id).subscribe({
        next: (data) => (this.userData = data),
        error: (error) =>
          console.error('Error al cargar los datos del usuario', error),
      });
      console.log('Datos del usuario cargados:', currentUser.id);
    } else {
      console.error('No hay un usuario autenticado.');
    }
  }
}
