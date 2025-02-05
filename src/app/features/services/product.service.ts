import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Product } from '../../core/models/product.model';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient, private authService: AuthService) { }

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
  * Obtener productos con paginación.
  */
  getProducts(page = 0, size = 10): Observable<{ content: Product[]; totalElements: number }> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<{ content: Product[]; totalElements: number }>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error al obtener productos', error);
        return of({ content: [], totalElements: 0 });
      })
    );
  }

  /**
 * Crear un producto asociado al usuario autenticado.
 */
  createProduct(product: Product): Observable<Product | null> {
    const userId = this.authService.currentUserValue?.id;
    if (!userId) {
      console.error('No hay usuario autenticado');
      return of(null);
    }

    product.userId = userId; // Asignamos el usuario autenticado al producto

    return this.http.post<Product>(this.apiUrl, product, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('Error al crear producto', error);
        return of(null);
      })
    );
  }

  /**
 * Actualizar un producto existente.
 */
  updateProduct(id: number, product: Product): Observable<Product | null> {
    // Convertir `tagsString` en array antes de enviarlo
    if (product.tagsString) {
      product.tags = product.tagsString.split(',').map(tag => tag.trim());
    }

    return this.http.put<Product>(`${this.apiUrl}/${id}`, product, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('Error al actualizar producto', error);
        return of(null);
      })
    );
  }

  /**
 * Eliminar un producto.
 */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('Error al eliminar producto', error);
        return of();
      })
    );
  }

   /**
   * Buscar productos por categoría.
   * @param category La categoría de los productos.
   * @param page Número de página (por defecto 0).
   * @param size Cantidad de productos por página (por defecto 10).
   */
   searchProductsByCategory(category: string): Observable<{ content: Product[]}> {
    const params = new HttpParams()
      .set('category', category);

      console.log('Parámetros de búsqueda:', params.toString());
    return this.http.get<{ content: Product[] }>(`${this.apiUrl}/by-category`, { params }).pipe(
      catchError((error) => {
        console.error('Error en la búsqueda de productos por categoría:', error);
        return of({ content: [] }); // Retorna un objeto con una propiedad content vacía si hay error
      })
    );
  }
}
