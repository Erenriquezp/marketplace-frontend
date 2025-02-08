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
  totalElements = 0;
  isFreelancer = false;
  isClient = false;

  constructor(
    private projectService: ProjectService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.loadProjects();
  }

  /**
   * 📌 Verificar el rol del usuario autenticado.
   */
  checkUserRole(): void {
    const roles = this.authService.currentUserValue?.roles || [];
    this.isFreelancer = roles.includes('ROLE_FREELANCER');
    this.isClient = roles.includes('ROLE_USER');
  }

  /**
   * 📌 Cargar proyectos según el rol del usuario.
   */
  loadProjects(): void {
    if (this.isFreelancer) {
      this.projectService.getAllProjects(this.currentPage, this.pageSize).subscribe({
        next: (response) => {
          this.projects = response.content;
          this.totalElements = response.totalElements;
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Error al cargar proyectos.';
          this.isLoading = false;
        },
      });
    } else {
      this.projectService.getUserProjects(this.currentPage, this.pageSize).subscribe({
        next: (response) => {
          this.projects = response.content;
          this.totalElements = response.totalElements;
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Error al cargar proyectos.';
          this.isLoading = false;
        },
      });
    }
  }

  /**
   * 📌 Freelancer postula a un proyecto.
   */
  applyToProject(projectId: number): void {
    const proposal = prompt('Describe tu propuesta:');
    const proposedBudget = parseFloat(prompt('Ingresa tu presupuesto:') || '0');

    if (!proposal || isNaN(proposedBudget) || proposedBudget <= 0) {
      alert('Datos inválidos. Intenta nuevamente.');
      return;
    }

    this.projectService.applyToProject(projectId, proposal, proposedBudget).subscribe({
      next: () => alert('✅ Postulación enviada con éxito.'),
      error: () => alert('❌ Error al postularse. Intente de nuevo.'),
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
}
