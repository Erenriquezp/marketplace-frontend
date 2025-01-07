import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

// Interfaz para un servicio freelance
export interface FreelanceService {
  id?: number;
  title: string;
  description: string;
  price: number;
  category: string; // Nueva propiedad para categoría
}

// Interfaz para la respuesta de servicios paginados
export interface FreelanceServiceResponse {
  content: FreelanceService[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root',
})
export class FreelanceServiceService {
  private apiUrl = `${environment.apiUrl}/freelancer-services`; // URL base del backend

  constructor(private http: HttpClient) {}

  /**
   * Obtener servicios freelance con paginación.
   * @param page Número de la página a obtener.
   * @param size Tamaño de la página.
   * @returns Observable con la respuesta de servicios.
   */
  getFreelanceServices(page = 0, size = 10): Observable<FreelanceServiceResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<FreelanceServiceResponse>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error al obtener servicios freelance', error);
        return of({ content: [], totalElements: 0, totalPages: 0, size: 0, number: 0 }); // Retorna un objeto vacío en caso de error
      })
    );
  }

  /**
   * Crear un nuevo servicio freelance.
   * @param service Servicio a crear.
   * @returns Observable con el servicio creado.
   */
  createFreelanceService(service: FreelanceService): Observable<FreelanceService | null> {
    return this.http.post<FreelanceService>(this.apiUrl, service).pipe(
      catchError((error) => {
        console.error('Error al crear servicio freelance', error);
        return of(null); // Retorna null en caso de error
      })
    );
  }

  /**
   * Actualizar un servicio freelance existente.
   * @param id ID del servicio a actualizar.
   * @param service Datos del servicio a actualizar.
   * @returns Observable con el servicio actualizado.
   */
  updateFreelanceService(id: number, service: FreelanceService): Observable<FreelanceService | null> {
    return this.http.put<FreelanceService>(`${this.apiUrl}/${id}`, service).pipe(
      catchError((error) => {
        console.error('Error al actualizar servicio freelance', error);
        return of(null); // Retorna null en caso de error
      })
    );
  }

  /**
   * Eliminar un servicio freelance.
   * @param id ID del servicio a eliminar.
   * @returns Observable vacío.
   */
  deleteFreelanceService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar servicio freelance', error);
        return of(); // Retorna un observable vacío en caso de error
      })
    );
  }
}
