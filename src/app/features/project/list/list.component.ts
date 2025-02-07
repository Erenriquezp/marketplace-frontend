import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../../core/services/auth.service';
import { Project } from '../../../core/models/project.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  isLoading = true;
  errorMessage = '';
  currentPage = 0;
  pageSize = 10;
  totalElements = 0; // Total de proyectos

  constructor(
    private projectService: ProjectService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserProjects();
  }

  /**
   * Cargar proyectos del usuario autenticado con paginación.
   */
  loadUserProjects(): void {
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
   * Eliminar un proyecto.
   */
  deleteProject(id: number): void {
    if (!confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      return; // Cancelar si el usuario no confirma
    }

    this.projectService.deleteProject(id).subscribe({
      next: () => {
        this.projects = this.projects.filter(project => project.id !== id); // Actualiza la lista
      },
      error: (error) => {
        console.error('❌ Error al eliminar proyecto:', error);
        alert('Error al eliminar el proyecto. Intente nuevamente.');
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
