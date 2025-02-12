import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileService, FullUserProfile, UserProfile } from '../../services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
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
      //education: this.fb.array([]), // Educación editable
      skills: this.fb.array([]), // Habilidades dinámicas
      certifications: this.fb.array([]), // Certificaciones dinámicas
      socialLinks: this.fb.array([]), // ✅ Redes sociales como FormArray
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
    const profile = data.profile || {} as UserProfile;

    this.settingsForm.patchValue({
      username: data.user.username,
      email: data.user.email,
      phoneNumber: data.user.phoneNumber,
      country: profile.country || '',
      language: profile.language || '',
      description: profile.description || '',
      notifications: true
    });

    // Cargar listas dinámicas
    this.setFormArray('skills', profile.skills || []);
    this.setFormArray('certifications', profile.certifications || []);
    //this.setFormArray('education', profile.education?.split(';') || []);
    this.setFormArray('socialLinks', Object.values(profile.socialLinks || {})); // ✅ Manejar redes sociales como FormArray
  }

  /**
   * 📌 Establecer valores en `FormArray`
   */
  private setFormArray(field: string, values: string[]): void {
    const formArray = this.settingsForm.get(field) as FormArray;
    formArray.clear();
    values.forEach(value => formArray.push(new FormControl(value)));
  }

  /**
   * 📌 Agregar un nuevo elemento a un `FormArray` (habilidades, experiencia, educación, certificaciones, redes sociales).
   */
  addItem(field: string): void {
    (this.settingsForm.get(field) as FormArray).push(new FormControl(''));
  }

  /**
   * 📌 Eliminar un elemento de un `FormArray`.
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
    //updatedProfile.education = updatedProfile.education.join(';');

    // Convertir redes sociales a objeto clave-valor antes de enviarlo al backend
    updatedProfile.socialLinks = this.getSocialLinksAsObject();

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

  /** ✅ Getters para acceder a los `FormArray` */
  get skills(): FormArray {
    return this.settingsForm.get('skills') as FormArray;
  }

  get certifications(): FormArray {
    return this.settingsForm.get('certifications') as FormArray;
  }

  get experience(): FormArray {
    return this.settingsForm.get('experience') as FormArray;
  }

  get education(): FormArray {
    return this.settingsForm.get('education') as FormArray;
  }

  get socialLinks(): FormArray {
    return this.settingsForm.get('socialLinks') as FormArray;
  }

  /**
   * 📌 Convertir el FormArray de `socialLinks` en un objeto clave-valor antes de enviarlo al backend.
   */
  private getSocialLinksAsObject(): Record<string, string> {
    const socialLinksArray = this.socialLinks.value;
    const keys = Object.keys(this.userProfileData?.profile?.socialLinks || {});
    const result: Record<string, string> = {};
    keys.forEach((key, index) => {
      result[key] = socialLinksArray[index] || '';
    });
    return result;
  }
}