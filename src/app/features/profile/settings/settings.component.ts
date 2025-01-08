import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  settingsForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.settingsForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      notifications: [true],
    });
  }

  saveSettings(): void {
    if (this.settingsForm.valid) {
      console.log('Configuraciones guardadas:', this.settingsForm.value);
    }
  }
}
