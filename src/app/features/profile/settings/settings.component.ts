import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileService, FullUserProfile, UserProfile } from '../../services/profile.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  userProfileData: FullUserProfile | null = null;
  isLoading = true;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService
  ) {
    this.settingsForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      country: [''],
      language: [''],
      description: [''],
      experience: [''],
      education: [''],
      skills: this.fb.array([]), // Habilidades dinámicas
      certifications: this.fb.array([]), // Certificaciones dinámicas
      socialLinks: this.fb.group({}), // Redes sociales
      notifications: [true]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  /**
   * 📌 Cargar los datos del usuario autenticado.
   */
  loadUserProfile(): void {
    const userId = this.authService.currentUserValue?.id;
    if (!userId) {
      this.errorMessage = 'Usuario no autenticado.';
      this.isLoading = false;
      return;
    }

    this.profileService.getPublicProfile(userId).subscribe({
      next: (data) => {
        this.userProfileData = data;
        this.populateForm(data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar perfil:', error);
        this.errorMessage = 'Error al cargar el perfil.';
        this.isLoading = false;
      }
    });
  }

  /**
   * 📌 Llenar el formulario con los datos del usuario.
   */
  private populateForm(data: FullUserProfile): void {
    const profile = data.profile || {} as UserProfile; // Si no hay perfil, usa un objeto vacío

    this.settingsForm.patchValue({
      username: data.user.username,
      email: data.user.email,
      phoneNumber: data.user.phoneNumber,
      country: profile.country || '',
      language: profile.language || '',
      description: profile.description || '',
      experience: profile.experience || '',
      education: profile.education || '',
      notifications: true
    });

    // Agregar habilidades y certificaciones dinámicamente
    this.setFormArray('skills', profile.skills || []);
    this.setFormArray('certifications', profile.certifications || []);

    // Manejar redes sociales dinámicamente
    const socialGroup = this.fb.group({});
    Object.keys(profile.socialLinks || {}).forEach(platform => {
      socialGroup.addControl(platform, this.fb.control(profile.socialLinks[platform]));
    });
    this.settingsForm.setControl('socialLinks', socialGroup);
  }

  /**
   * 📌 Establecer valores en `FormArray`
   */
  private setFormArray(field: string, values: string[]): void {
    const formArray = this.settingsForm.get(field) as FormArray;
    formArray.clear();
    values.forEach(value => formArray.push(this.fb.control(value)));
  }

  /**
   * 📌 Agregar una habilidad o certificación.
   */
  addItem(field: string): void {
    (this.settingsForm.get(field) as FormArray).push(this.fb.control(''));
  }

  /**
   * 📌 Eliminar una habilidad o certificación.
   */
  removeItem(field: string, index: number): void {
    (this.settingsForm.get(field) as FormArray).removeAt(index);
  }

  /**
   * 📌 Guardar cambios en el perfil.
   */
  saveSettings(): void {
    if (this.settingsForm.invalid) {
      return;
    }

    const userId = this.authService.currentUserValue?.id;
    if (!userId) {
      this.errorMessage = 'Usuario no autenticado.';
      return;
    }

    const updatedProfile = this.settingsForm.value;
    this.profileService.updateProfile(userId, updatedProfile).subscribe({
      next: () => {
        this.successMessage = 'Perfil actualizado correctamente.';
      },
      error: (error) => {
        console.error('❌ Error al actualizar perfil:', error);
        this.errorMessage = 'Error al actualizar el perfil.';
      }
    });
  }

  get skills(): FormArray {
    return this.settingsForm.get('skills') as FormArray;
  }
  
  getSkillControl(index: number) {
    return (this.settingsForm.get('skills') as FormArray).at(index);
  }
  
}
