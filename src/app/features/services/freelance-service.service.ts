import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { FreelanceService } from '../../core/models/freelance-service.model'; // Asegúrate de tener este modelo
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class FreelanceServiceService {
  private apiUrl = `${environment.apiUrl}/freelancer-services`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.currentUserValue?.accessToken;
    if (!token) {
      console.error('No hay token de autenticación');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Obtener servicios freelance con paginación.
   */
  getFreelanceServices(page = 0, size = 10): Observable<{ content: FreelanceService[]; totalElements: number }> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<{ content: FreelanceService[]; totalElements: number }>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error al obtener servicios freelance', error);
        return of({ content: [], totalElements: 0 });
      })
    );
  }

  /**
   * Crear un nuevo servicio freelance asociado al usuario autenticado.
   */
  createFreelanceService(freelanceService: FreelanceService): Observable<FreelanceService | null> {
    const userId = this.authService.currentUserValue?.id;
    if (!userId) {
      console.error('No hay usuario autenticado');
      return of(null);
    }

    freelanceService.userId = userId; // Asignamos el usuario autenticado al servicio

    return this.http.post<FreelanceService>(this.apiUrl, freelanceService, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('Error al crear servicio freelance', error);
        return of(null);
      })
    );
  }

  /**
   * Actualizar un servicio freelance existente.
   */
  updateFreelanceService(id: number, freelanceService: FreelanceService): Observable<FreelanceService | null> {
    return this.http.put<FreelanceService>(`${this.apiUrl}/${id}`, freelanceService, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('Error al actualizar servicio freelance', error);
        return of(null);
      })
    );
  }

  /**
   * Eliminar un servicio freelance.
   */
  deleteFreelanceService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('Error al eliminar servicio freelance', error);
        return of();
      })
    );
  }

  /**
   * Buscar servicios freelance.
   */
  searchFreelanceServices(query: string): Observable<FreelanceService[]> {
    return this.http.get<FreelanceService[]>(`${this.apiUrl}?search=${query}`).pipe(
      catchError(() => of([]))
    );
  }
}