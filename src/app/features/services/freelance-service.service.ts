import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { FreelanceService } from '../../core/models/freelance-service.model';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class FreelanceServiceService {
  private apiUrl = `${environment.apiUrl}/freelancer-services`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.currentUserValue?.accessToken;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  /**
   * Obtener servicios freelance con paginación.
   */
  getFreelanceServices(page = 0, size = 10): Observable<{ content: FreelanceService[]; totalElements: number }> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<{ content: FreelanceService[]; totalElements: number }>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('❌ Error al obtener servicios freelance:', error);
        return of({ content: [], totalElements: 0 });
      })
    );
  }

    /**
     * Obtener productos por ID de usuario con paginación.
     */
     getServicesByUserId(userId: number, page = 0, size = 10): Observable<{ content: FreelanceService[]; totalElements: number }> {
      const params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());
      return this.http.get<{ content: FreelanceService[]; totalElements: number }>(`${this.apiUrl}/by-user/${userId}`, { params }).pipe(
        catchError((error) => {
          console.error('Error al obtener servicios por ID de usuario', error);
          return of({ content: [], totalElements: 0 });
        })
      );
    }

  /**
   * Crear un nuevo servicio freelance.
   */
  createFreelanceService(freelanceService: FreelanceService): Observable<FreelanceService | null> {
    const userId = this.authService.currentUserValue?.id;
    if (!userId) {
      console.error('⚠️ No hay usuario autenticado.');
      return of(null);
    }

    freelanceService.userId = userId; // Asociamos el usuario autenticado

    return this.http.post<FreelanceService>(this.apiUrl, freelanceService, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('❌ Error al crear servicio freelance:', error);
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
        console.error(`❌ Error al actualizar el servicio con ID ${id}:`, error);
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
        console.error(`❌ Error al eliminar el servicio con ID ${id}:`, error);
        return of();
      })
    );
  }

  /**
   * Buscar servicios freelance con filtros opcionales.
   */
  searchFreelanceServices(name?: string, category?: string): Observable<FreelanceService[]> {
    let params = new HttpParams();

    if (category) params = params.set('category', category);
    if (name) params = params.set('name', name);

    return this.http.get<{ content: FreelanceService[] }>(`${this.apiUrl}/search`, { params }).pipe(
      map((response: { content: FreelanceService[] }) => response.content),
      catchError(error => {
        console.error('Error en la búsqueda de productos:', error);
        return of([]);
      })
    );
  }
}
