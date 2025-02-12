import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Project } from '../../core/models/project.model';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/projects`;
  private apiApUrl = `${environment.apiUrl}/applications`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.currentUserValue?.accessToken;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  /**
   * Verifica si el usuario autenticado tiene el rol "ROLE_CLIENT"
   */
  private isClient(): boolean {
    const roles = this.authService.currentUserValue?.roles || [];
    return roles.includes('ROLE_USER');
  }

  /**
   * Crear un nuevo proyecto (Solo clientes pueden publicar).
   */
  createProject(project: Project): Observable<Project | null> {
    if (!this.isClient()) {
      console.error('⚠️ Solo los clientes pueden publicar proyectos.');
      return of(null);
    }

    return this.http.post<Project>(`${this.apiUrl}`, project, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('❌ Error al crear proyecto:', error);
        return of(null);
      })
    );
  }

   /**
   * 📌 Obtener todos los proyectos disponibles (Para freelancers).
   */
   getAllProjects(page = 0, size = 10): Observable<{ content: Project[]; totalElements: number }> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<{ content: Project[]; totalElements: number }>(
      `${this.apiUrl}`, { headers: this.getAuthHeaders(), params }
    ).pipe(
      catchError((error) => {
        console.error('❌ Error al obtener proyectos:', error);
        return of({ content: [], totalElements: 0 });
      })
    );
  }

  /**
   * Obtener proyectos creados por el usuario autenticado con paginación.
   */
  getUserProjects(page = 0, size = 10): Observable<{ content: Project[]; totalElements: number }> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<{ content: Project[]; totalElements: number }>(`${this.apiUrl}/my-projects`, { headers: this.getAuthHeaders(), params }).pipe(
      catchError((error) => {
        console.error('❌ Error al obtener proyectos del usuario:', error);
        return of({ content: [], totalElements: 0 });
      })
    );
  }

  /**
 * Eliminar un proyecto por ID.
 */
  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error(`❌ Error al eliminar el proyecto con ID ${id}:`, error);
        return of();
      })
    );
  }

  /**
   * 📌 Postularse a un proyecto (Solo freelancers).
   */
  applyToProject(projectId: number, proposal: string, proposedBudget: number): Observable<void> {
    const applicationData = { proposal, proposedBudget };
    return this.http.post<void>(`${this.apiApUrl}/${projectId}/apply`, applicationData, 
      { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('❌ Error al postularse al proyecto:', error);
        return of();
      })
    );
  }

   /**
   * Obtener las postulaciones de un proyecto (para clientes).
   */
   getProjectApplications(projectId: number): Observable<unknown[]> {
    return this.http.get<unknown[]>(`${this.apiApUrl}/${projectId}/applications`, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('❌ Error al obtener postulaciones:', error);
        return of([]);
      })
    );
  }

   /**
   * Aceptar una postulación (solo clientes).
   */
   acceptApplication(projectId: number, freelancerId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${projectId}/applications/${freelancerId}/accept`, {}, 
      { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('❌ Error al aceptar postulación:', error);
        return of();
      })
    );
  }

   /**
   * Rechazar una postulación (solo clientes).
   */
   rejectApplication(projectId: number, freelancerId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${projectId}/applications/${freelancerId}/reject`, {}, 
      { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('❌ Error al rechazar postulación:', error);
        return of();
      })
    );
  }
}
