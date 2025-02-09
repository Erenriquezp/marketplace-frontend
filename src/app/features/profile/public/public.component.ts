import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProfileService, FullUserProfile } from '../../services/profile.service';
import { FreelanceServiceService } from '../../services/freelance-service.service'; // Asegúrate de que la ruta sea correcta
import { FreelanceService } from '../../../core/models/freelance-service.model'; // Asegúrate de que el modelo sea correcto
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public',
  imports: [CommonModule, RouterModule],
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'], // Cambié styleUrl a styleUrls
})
export class PublicComponent implements OnInit {
  userProfileData: FullUserProfile | null = null;
  servicesOffered: FreelanceService[] = []; // Lista de servicios ofrecidos
  userId!: number;
  Object = Object;

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private freelanceService: FreelanceServiceService, // Inyectar servicio de servicios freelance
    private cdr: ChangeDetectorRef // Inyectar ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Obtener el ID del usuario de la URL
    this.route.params.subscribe((params) => {
      this.userId = +params['id']; // Convierte a número
      this.loadUserProfile();
      this.loadUserServices(); // Cargar los servicios del usuario
    });
  }

  // Cargar datos del usuario y perfil
  private loadUserProfile(): void {
    this.profileService.getPublicProfile(this.userId).subscribe({
      next: (data) => {
        this.userProfileData = data;
        this.cdr.detectChanges(); // 🔥 Forzar detección de cambios
      },
      error: (error) => console.error('Error al cargar perfil del usuario', error),
    });
  }

  // Cargar los servicios ofrecidos por el usuario
  private loadUserServices(): void {
    this.freelanceService.getServicesByUserId(this.userId).subscribe({
      next: (data) => {
        this.servicesOffered = data?.content ?? data ?? []; // ✅ Manejo flexible de datos
      },
      error: (error) => {
        console.error('❌ Error al cargar servicios del usuario', error);
        this.servicesOffered = []; // ✅ Evitar que quede `undefined`
      },
    });
  }

    /**
   * 📌 Retorna el ícono de FontAwesome según la red social
   */
    getSocialIcon(platform: string): string {
      const icons: Record<string, string> = {
        facebook: 'fab fa-facebook',
        twitter: 'fab fa-twitter',
        instagram: 'fab fa-instagram',
        linkedin: 'fab fa-linkedin',
        github: 'fab fa-github',
        youtube: 'fab fa-youtube'
      };
      return icons[platform.toLowerCase()] || 'fas fa-globe'; // Ícono por defecto
    }
}
