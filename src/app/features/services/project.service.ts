import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.currentUserValue?.accessToken;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Crear un nuevo proyecto.
   */
  createProject(project: Project): Observable<Project | null> {
    return this.http.post<Project>(`${this.apiUrl}/create`, project, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('Error al crear proyecto', error);
        return of(null);
      })
    );
  }

  /**
   * Obtener todos los proyectos disponibles.
   */
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/my-projects`, { headers: this.getAuthHeaders() }).pipe(
      catchError(() => of([]))
    );
  }

  /**
   * Obtener los proyectos del usuario autenticado.
   */
  getUserProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/my-projects`, { headers: this.getAuthHeaders() }).pipe(
        catchError(() => of([]))
      );
  }
}
