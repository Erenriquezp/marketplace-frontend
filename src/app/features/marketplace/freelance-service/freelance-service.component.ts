import { Component, OnInit } from '@angular/core';
import { FreelanceService, FreelanceServiceService } from '../../services/freelance-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-freelance-services',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './freelance-service.component.html',
  styleUrls: ['./freelance-service.component.scss'],
})
export class FreelanceServicesComponent implements OnInit {
  services: FreelanceService[] = [];
  newService: FreelanceService = { title: '', description: '', price: 0, category: '' };
  editingService: FreelanceService | null = null;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;

  constructor(private freelanceService: FreelanceServiceService) {}

  ngOnInit(): void {
    this.loadServices();
  }

  // Cargar servicios con paginación
  loadServices(): void {
    this.freelanceService.getFreelanceServices(this.currentPage, this.pageSize).subscribe(
      (response) => {
        this.services = response.content;
        this.totalElements = response.totalElements;
      },
      (error) => {
        console.error('Error al cargar servicios freelance', error);
      }
    );
  }

  // Crear un servicio
  addService(): void {
    this.freelanceService.createFreelanceService(this.newService).subscribe({
      next: () => {
        this.loadServices();
        this.newService = { title: '', description: '', price: 0, category: '' };
      },
      error: (error) => {
        console.error('Error al crear servicio freelance', error);
      }
    });
  }

  // Editar un servicio
  editService(service: FreelanceService): void {
    this.editingService = { ...service };
  }

  // Guardar cambios en un servicio
  saveService(): void {
    if (this.editingService) {
      this.freelanceService.updateFreelanceService(this.editingService.id!, this.editingService).subscribe(
        (updatedService) => {
          if (updatedService) {
            const index = this.services.findIndex((s) => s.id === updatedService.id);
            this.services[index] = updatedService;
          }
          this.editingService = null;
        },
        (error) => {
          console.error('Error al actualizar servicio freelance', error);
        }
      );
    }
  }

  // Eliminar un servicio
  deleteService(id: number): void {
    this.freelanceService.deleteFreelanceService(id).subscribe({
      next: () => {
        this.services = this.services.filter((service) => service.id !== id);
      },
      error: (error) => {
        console.error('Error al eliminar servicio freelance', error);
      }
    });
  }

  // Cambiar de página
  changePage(page: number): void {
    this.currentPage = page;
    this.loadServices();
  }
}
