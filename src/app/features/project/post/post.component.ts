import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-post',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  projectForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20)]],
      budget: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      deadline: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      console.log('Proyecto publicado:', this.projectForm.value);
      // Aquí enviarías los datos al backend
    }
  }
}
