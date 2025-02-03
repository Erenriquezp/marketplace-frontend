import { Component, OnInit } from '@angular/core';
import { FreelanceService } from '../../../core/models/freelance-service.model'; // Asegúrate de tener este modelo
import { AuthService } from '../../../core/services/auth.service';
import { FreelanceServiceService } from '../../services/freelance-service.service'; // Asegúrate de que la ruta sea correcta
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-freelance-service',
  templateUrl: './freelance-service.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./freelance-service.component.scss'],
})
export class FreelanceServiceComponent implements OnInit {
  freelancers: FreelanceService[] = [];
  newFreelance: FreelanceService = {
    name: '', description: '', skills: [], estimatedDelivery: 0,
    price: 0
  }; // Ajusta según tu modelo
  editingFreelance: FreelanceService | null = null;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  isFreelancer = false;

  constructor(private freelanceService: FreelanceServiceService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadFreelancers();
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
   * Cargar la lista de freelancers con paginación.
   */
  loadFreelancers(): void {
    this.freelanceService.getFreelanceServices(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.freelancers = response.content;
        this.totalElements = response.totalElements;
      },
      error: (error) => console.error('Error al cargar freelancers', error),
    });
  }

  /**
   * Crear un nuevo freelance.
   */
  addFreelance(): void {
    if (!this.isFreelancer) {
      console.error('Solo los freelancers pueden publicar servicios');
      return;
    }

    this.freelanceService.createFreelanceService(this.newFreelance).subscribe({
      next: (createdFreelance) => {
        if (createdFreelance) {
          this.freelancers.push(createdFreelance);
          this.newFreelance = { name: '', description: '', skills: [], estimatedDelivery: 1, price: 1 }; // Reiniciar el formulario
        }
      },
      error: (error) => console.error('Error al crear freelance', error),
    });
  }

  /**
   * Editar un freelance existente.
   */
  editFreelance(freelance: FreelanceService): void {
    this.editingFreelance = { ...freelance }; // Clonar el freelance para editar
  }

    /**
     * Convertir tags de string a array antes de guardar.
     */
    convertSkills(freelance: FreelanceService): void {
      if (freelance.skillsString) {
        freelance.skills = freelance.skillsString.split(',').map(skill => skill.trim());
      } else {
        freelance.skills = [];
      }
    }

  /**
   * Guardar los cambios en un freelance editado.
   */
  saveFreelance(): void {
    if (this.editingFreelance) {
      this.freelanceService.updateFreelanceService(this.editingFreelance.id!, this.editingFreelance).subscribe({
        next: (updatedFreelance) => {
          if (updatedFreelance) {
            const index = this.freelancers.findIndex((f) => f.id === updatedFreelance.id);
            if (index !== -1) {
              this.freelancers[index] = updatedFreelance;
            }
          }
          this.editingFreelance = null; // Cerrar el formulario de edición
        },
        error: (error) => console.error('Error al actualizar freelance', error),
      });
    }
  }

  /**
   * Eliminar un freelance.
   */
  deleteFreelance(id: number): void {
    this.freelanceService.deleteFreelanceService(id).subscribe({
      next: () => {
        this.freelancers = this.freelancers.filter((freelance) => freelance.id !== id);
      },
      error: (error) => console.error('Error al eliminar freelance', error),
    });
  }

  /**
   * Cambiar de página en la paginación.
   */
  changePage(page: number): void {
    this.currentPage = page;
    this.loadFreelancers();
  }
}