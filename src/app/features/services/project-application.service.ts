import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

export interface ProjectApplication {
  id?: number;
  projectId: number;
  freelancer?: { // ✅ Aseguramos que el freelancer tenga la estructura esperada
    id: number;
    username: string;
    profilePictureUrl?: string;
    email: string;
    phoneNumber?: string;
  };
  proposal: string;
  proposedBudget: number;
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  appliedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectApplicationService {
  private apiUrl = `${environment.apiUrl}/applications`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.currentUserValue?.accessToken;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * 📌 Freelancer se postula a un proyecto.
   */
  applyToProject(projectId: number, applicationData: ProjectApplication): Observable<ProjectApplication | null> {
    return this.http.post<ProjectApplication>(
      `${this.apiUrl}/${projectId}/apply`,
      applicationData,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError((error) => {
        console.error('❌ Error al postularse:', error);
        return of(null);
      })
    );
  }

  /**
   * 📌 Cliente acepta o rechaza una postulación.
   */
  updateApplicationStatus(applicationId: number, status: 'ACCEPTED' | 'REJECTED'): Observable<ProjectApplication | null> {
    const params = new HttpParams().set('status', status);
    return this.http.put<ProjectApplication>(
      `${this.apiUrl}/${applicationId}/update-status`,
      {},
      { headers: this.getAuthHeaders(), params }
    ).pipe(
      catchError((error) => {
        console.error(`❌ Error al actualizar postulación ${applicationId}:`, error);
        return of(null);
      })
    );
  }

  /**
   * 📌 Cliente obtiene todas las postulaciones a su proyecto.
   */
  getApplicationsByProject(projectId: number): Observable<ProjectApplication[]> {
    console.log('🔍 Obteniendo postulaciones del proyecto', projectId); // ✅ Log de depuración
    return this.http.get<{ content: ProjectApplication[] }>(
      `${this.apiUrl}/by-project/${projectId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => response.content.map(app => ({
        ...app,
        freelancer: app.freelancer ? { ...app.freelancer, email: app.freelancer.email || '', phoneNumber: app.freelancer.phoneNumber || '' } : { id: 0, username: 'Desconocido', email: '', phoneNumber: '' } // ✅ Manejo de datos incompletos
      }))),
      catchError(error => {
        console.error('❌ Error en la API al obtener postulaciones:', error);
        return of([]); // ✅ Retorna array vacío en caso de error
      })
    );
  }
  

  /**
   * 📌 Freelancer obtiene todas sus postulaciones.
   */
  getApplicationsByFreelancer(): Observable<ProjectApplication[]> {
    return this.http.get<{ content: ProjectApplication[] }>(`${this.apiUrl}/by-freelancer`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      map(response => response.content || []), // ✅ Asegura que siempre se devuelva un array
      catchError(() => of([]))
    );
  }
  

  /**
   * 📌 Cliente elimina una postulación.
   */
  deleteApplication(applicationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${applicationId}/delete`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        console.error(`❌ Error al eliminar postulación ${applicationId}:`, error);
        return of();
      })
    );
  }
}