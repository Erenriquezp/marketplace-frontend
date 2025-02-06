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

  constructor(
    private projectService: ProjectService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserProjects();
  }

  /**
   * Cargar proyectos del usuario autenticado.
   */
  loadUserProjects(): void {
    const userId = this.authService.currentUserValue?.id;

    if (!userId) {
      this.errorMessage = 'No se encontró un usuario autenticado.';
      this.isLoading = false;
      return;
    }

    this.projectService.getUserProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar los proyectos. Intente nuevamente.';
        this.isLoading = false;
      },
    });
  }
}
