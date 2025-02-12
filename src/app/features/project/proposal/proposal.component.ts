import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProjectApplicationService, ProjectApplication } from '../../services/project-application.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-proposal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './proposal.component.html',
  styleUrl: './proposal.component.scss'
})
export class ProposalComponent implements OnInit {
  @Input() projectId!: number;
  applications: ProjectApplication[] = [];
  freelancerApplication: ProjectApplication | null = null;
  isLoading = true;
  isFreelancer = false;
  isClient = false;
  hasApplied = false;
  authenticatedFreelancerId?: number; // ✅ ID del freelancer autenticado

  proposalForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private applicationService: ProjectApplicationService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.proposalForm = this.fb.group({
      proposal: ['', [Validators.required, Validators.minLength(10)]],
      proposedBudget: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    });
  }

  ngOnInit(): void {
    if (!this.projectId) {
      this.projectId = +this.route.snapshot.paramMap.get('projectId')!;
    }

    this.checkUserRole();

    if (this.isClient) {
      this.loadApplications();
    }

    if (this.isFreelancer) {
      this.authenticatedFreelancerId = this.authService.currentUserValue?.id;
      this.checkFreelancerApplication();
    }
  }

  /**
   * 📌 Verifica si el usuario autenticado es un freelancer o un cliente.
   */
  checkUserRole(): void {
    const roles = this.authService.currentUserValue?.roles || [];
    this.isFreelancer = roles.includes('ROLE_FREELANCER');
    this.isClient = roles.includes('ROLE_USER');
  }

  /**
  * 📌 Cargar postulaciones del proyecto (solo para clientes).
  */
  loadApplications(): void {
    this.applicationService.getApplicationsByProject(this.projectId).subscribe({
      next: (response) => {
        console.log('📥 Postulaciones cargadas:', response); // ✅ Log de depuración
        this.applications = response || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar postulaciones:', error);
        this.isLoading = false;
        this.errorMessage = 'Error al cargar postulaciones.';
      }
    });
  }

  /**
 * 📌 Verifica si el freelancer ya se ha postulado a este proyecto.
 */
  checkFreelancerApplication(): void {
    this.applicationService.getApplicationsByFreelancer().subscribe({
      next: (response) => {
        console.log('🔍 Aplicaciones obtenidas:', response); // ✅ Log de depuración

        const application = response.find(app =>
          app.projectId === this.projectId && app.freelancer?.id === this.authenticatedFreelancerId
        );

        if (application) {
          console.log('✅ Freelancer ya aplicado:', application);
          this.freelancerApplication = application;
          this.hasApplied = true;
        } else {
          console.log('⚠️ Freelancer aún no ha aplicado.');
          this.hasApplied = false;
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al verificar postulación:', error);
        this.isLoading = false;
        this.errorMessage = 'Error al verificar postulación.';
      }
    });
  }

  /**
 * 📌 Freelancer envía una postulación.
 */
  submitProposal(): void {
    if (this.proposalForm.valid) {
      const application: ProjectApplication = {
        projectId: this.projectId,
        proposal: this.proposalForm.value.proposal,
        proposedBudget: this.proposalForm.value.proposedBudget
      };

      console.log('📤 Enviando postulación:', application); // ✅ Log antes de enviar

      this.applicationService.applyToProject(this.projectId, application).subscribe({
        next: (response) => {
          console.log('✅ Postulación exitosa:', response);
          this.successMessage = '¡Postulación enviada con éxito!';
          this.hasApplied = true;
          this.proposalForm.reset();
          this.checkFreelancerApplication();
        },
        error: (error) => {
          console.error('❌ Error al enviar postulación:', error);
          this.errorMessage = 'Error al enviar la postulación. Intente de nuevo.';
        }
      });
    }
  }

  /**
  * 📌 Cliente acepta o rechaza una postulación.
  */
  updateStatus(applicationId: number, status: 'ACCEPTED' | 'REJECTED'): void {
    console.log(`🔄 Cambiando estado de postulación ${applicationId} a ${status}`); // ✅ Log de depuración

    this.applicationService.updateApplicationStatus(applicationId, status).subscribe({
      next: () => {
        console.log(`✅ Estado de postulación ${applicationId} actualizado a ${status}`);
        this.loadApplications();
      },
      error: (error) => {
        console.error(`❌ Error al actualizar estado de postulación ${applicationId}:`, error);
      }
    });
  }
}
