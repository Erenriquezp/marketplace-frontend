import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  projectForm: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private projectService: ProjectService, private router: Router) {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      estimatedBudget: ['', [Validators.required, Validators.min(1)]],
      deadline: ['', Validators.required],
    });
  }

  /**
   * Enviar el formulario y crear un nuevo proyecto.
   */
  onSubmit(): void {
    if (this.projectForm.valid) {
      const projectData = {
        ...this.projectForm.value,
        estimatedBudget: Number(this.projectForm.value.estimatedBudget), // Convertimos a número
      };

      this.projectService.createProject(projectData).subscribe({
        next: () => {
          alert('Proyecto publicado exitosamente');
          this.router.navigate(['/dashboard/client']);
        },
        error: () => {
          this.errorMessage = 'Error al publicar el proyecto. Intente nuevamente.';
        },
      });
    }
  }
}
