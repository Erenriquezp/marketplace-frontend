import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProfileService, FullUserProfile } from '../../services/profile.service';
import { FreelanceServiceService } from '../../services/freelance-service.service'; // Asegúrate de que la ruta sea correcta
import { FreelanceService } from '../../../core/models/freelance-service.model'; // Asegúrate de que el modelo sea correcto

@Component({
  selector: 'app-public',
  imports: [CommonModule],
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
    private freelanceService: FreelanceServiceService // Inyectar servicio de servicios freelance
  ) {}

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
      },
      error: (error) => console.error('Error al cargar perfil del usuario', error),
    });
  }

  // Cargar los servicios ofrecidos por el usuario
  private loadUserServices(): void {
    this.freelanceService.getServicesByUserId(this.userId).subscribe({
      next: (data) => {
        this.servicesOffered = data.content; // Asumiendo que la respuesta tiene la propiedad 'content'
      },
      error: (error) => console.error('Error al cargar servicios del usuario', error),
    });
  }
}
