import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProfileService, FullUserProfile } from '../../services/profile.service';

@Component({
  selector: 'app-public',
  imports: [CommonModule],
  templateUrl: './public.component.html',
  styleUrl: './public.component.scss',
})
export class PublicComponent implements OnInit {
  userProfileData: FullUserProfile | null = null;
  userId!: number;
  Object = Object;

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener el ID del usuario de la URL
    this.route.params.subscribe((params) => {
      this.userId = +params['id']; // Convierte a número
      this.loadUserProfile();
    });
  }

  // Cargar datos del usuario y perfil
  private loadUserProfile(): void {
    this.profileService.getPublicProfile(this.userId).subscribe({
      next: (data) => {
        this.userProfileData = data;
      },
      error: (error) => console.error('Error al cargar perfil del usuario', error),
    });
  }
}
