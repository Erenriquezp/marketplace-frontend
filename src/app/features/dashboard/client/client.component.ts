import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../../services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Project } from '../../../core/models/project.model';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-client',
  imports: [CommonModule, RouterModule],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss'],
})
export class ClientComponent implements OnInit {
  userData: User | null = null;
  projects: Project[] = [];
  isLoading = true;
  errorMessage = '';
  currentPage = 0;
  pageSize = 10;
  totalElements = 0; // Total de proyectos

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadCurrentUserData();
    this.loadUserProjects();
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

  /**
  * Cargar proyectos del usuario autenticado con paginación.
  */
  private loadUserProjects(): void {
    if (!this.authService.isAuthenticated()) {
      this.errorMessage = '⚠️ No hay un usuario autenticado.';
      this.isLoading = false;
      return;
    }

    this.projectService.getUserProjects(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.projects = response.content;
        this.totalElements = response.totalElements;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar proyectos:', error);
        this.errorMessage = 'Error al cargar los proyectos. Intente nuevamente.';
        this.isLoading = false;
      },
    });
  }

  /**
   * Cambiar de página en la paginación.
   */
  changePage(page: number): void {
    this.currentPage = page;
    this.loadUserProjects();
  }
}