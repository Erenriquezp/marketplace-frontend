import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^[+]?[0-9]*$/)]],
        role: ['', Validators.required], // Role debe ser ROLE_USER, ROLE_FREELANCER, etc.
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: FormGroup): null | { passwordMismatch: boolean } {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { username, email, password, phoneNumber, role } = this.registerForm.value;

      const userData = {
        username,
        password,
        email,
        phoneNumber,
        roles: [role], // El backend espera un array de roles
      };

      this.authService.register(userData).subscribe({
        next: () => this.router.navigate(['/auth/login']), // Redirige al login después del registro exitoso
        error: (err) => {
          this.errorMessage = 'Hubo un error al registrar el usuario. Por favor, inténtalo de nuevo.';
          console.error('Error en el registro:', err);
        },
      });
    }
  }
}
