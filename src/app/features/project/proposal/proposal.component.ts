import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProjectApplicationService, ProjectApplication } from '../../services/project-application.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-proposal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
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
        this.applications = response || [];
        this.isLoading = false;
      },
      error: () => {
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
        console.log('🔍 Aplicaciones:', response);

        const application = response.find(app => 
          app.id === this.projectId && app.freelancer?.id === this.authenticatedFreelancerId
        );

        if (application) {
          this.freelancerApplication = application;
          this.hasApplied = true;
        } else {
          this.hasApplied = false;
        }

        this.isLoading = false;
      },
      error: () => {
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

      this.applicationService.applyToProject(this.projectId, application).subscribe({
        next: () => {
          this.successMessage = '¡Postulación enviada con éxito!';
          this.hasApplied = true;
          this.proposalForm.reset();
          this.checkFreelancerApplication();
        },
        error: () => {
          this.errorMessage = 'Error al enviar la postulación. Intente de nuevo.';
        }
      });
    }
  }

  /**
   * 📌 Cliente acepta o rechaza una postulación.
   */
  updateStatus(applicationId: number, status: 'ACCEPTED' | 'REJECTED'): void {
    this.applicationService.updateApplicationStatus(applicationId, status).subscribe(() => {
      this.loadApplications();
    });
  }
}
