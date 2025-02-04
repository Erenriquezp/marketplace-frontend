import { Component, OnInit } from '@angular/core';
import { FreelanceService } from '../../../core/models/freelance-service.model';
import { AuthService } from '../../../core/services/auth.service';
import { FreelanceServiceService } from '../../services/freelance-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-freelance-service',
  templateUrl: './freelance-service.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./freelance-service.component.scss'],
})
export class FreelanceServicesComponent implements OnInit {
  servicesOffered: FreelanceService[] = [];
  newService: FreelanceService = {
    name: '',
    description: '',
    skillsRequired: [], // 🔹 Inicializamos como un array vacío
    estimatedDelivery: 1,
    price: 1
  };
  editingService: FreelanceService | null = null;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  isFreelancer = false;

  constructor(private freelanceService: FreelanceServiceService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadServices();
    this.checkUserRole();
  }

  /**
   * Verifica si el usuario autenticado tiene el rol "ROLE_FREELANCER"
   */
  checkUserRole(): void {
    const roles = this.authService.currentUserValue?.roles || [];
    this.isFreelancer = roles.includes('ROLE_FREELANCER');
  }

  /**
   * Cargar la lista de servicios ofrecidos con paginación.
   */
  loadServices(): void {
    this.freelanceService.getFreelanceServices(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.servicesOffered = response.content.map(service => ({
          ...service,
          skillsRequired: service.skillsRequired || [] // 🔹 Asegura que siempre sea un array
        }));
        this.totalElements = response.totalElements;
      },
      error: (error) => console.error('Error al cargar servicios freelance', error),
    });
  }

  /**
   * Convertir `skillsString` en un array antes de enviar datos al backend.
   */
  convertSkills(service: FreelanceService): void {
    if (service.skillsString?.trim()) {
      service.skillsRequired = service.skillsString.split(',').map(skill => skill.trim());
    } else {
      service.skillsRequired = [];
    }
  }

  /**
   * Crear un nuevo servicio freelance.
   */
  addService(): void {
    if (!this.isFreelancer) {
      console.error('Solo los freelancers pueden publicar servicios');
      return;
    }

    this.convertSkills(this.newService); // 🔹 Convertir skills antes de enviar

    this.freelanceService.createFreelanceService(this.newService).subscribe({
      next: (createdService) => {
        if (createdService) {
          this.servicesOffered.push(createdService);
          this.newService = { name: '', description: '', skillsRequired: [], estimatedDelivery: 1, price: 1 };
        }
      },
      error: (error) => console.error('Error al crear servicio freelance', error),
    });
  }

  /**
   * Editar un servicio existente.
   */
  editService(service: FreelanceService): void {
    this.editingService = {
      ...service,
      skillsString: service.skillsRequired?.join(', ') || '' // 🔹 Convertimos array a string para el input
    };
  }

  /**
   * Guardar los cambios en un servicio editado.
   */
  saveService(): void {
    if (this.editingService) {
      this.convertSkills(this.editingService); // 🔹 Convertir skills antes de enviar

      this.freelanceService.updateFreelanceService(this.editingService.id!, this.editingService).subscribe({
        next: (updatedService) => {
          if (updatedService) {
            const index = this.servicesOffered.findIndex((s) => s.id === updatedService.id);
            if (index !== -1) {
              this.servicesOffered[index] = updatedService;
            }
          }
          this.editingService = null;
        },
        error: (error) => console.error('Error al actualizar servicio freelance', error),
      });
    }
  }

  /**
   * Eliminar un servicio freelance.
   */
  deleteService(id: number): void {
    this.freelanceService.deleteFreelanceService(id).subscribe({
      next: () => {
        this.servicesOffered = this.servicesOffered.filter((service) => service.id !== id);
      },
      error: (error) => console.error('Error al eliminar servicio freelance', error),
    });
  }

  /**
   * Cambiar de página en la paginación.
   */
  changePage(page: number): void {
    this.currentPage = page;
    this.loadServices();
  }
}
