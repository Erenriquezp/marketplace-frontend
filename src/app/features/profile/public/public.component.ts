import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProfileService, UserProfile } from '../../services/profile.service';

@Component({
  selector: 'app-public',
  imports: [ CommonModule ],
  templateUrl: './public.component.html',
  styleUrl: './public.component.scss'
})
export class PublicComponent implements OnInit {
  userProfile: UserProfile | null = null;
  userId!: number;

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener el ID del usuario de la URL
    this.route.params.subscribe((params) => {
      this.userId = +params['id']; // Convierte el parámetro a número
      this.loadUserProfile();
    });
  }

  // Cargar datos del perfil público
  private loadUserProfile(): void {
    this.profileService.getPublicProfile(this.userId).subscribe({
      next: (data) => (this.userProfile = data),
      error: (error) => console.error('Error al cargar el perfil público', error),
    });
  }
}