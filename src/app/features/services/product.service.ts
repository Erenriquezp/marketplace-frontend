import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

// Interfaz para un producto
export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
}

// Interfaz para la respuesta de productos paginados
export interface ProductResponse {
  content: Product[]; // Array de productos
  totalElements: number; // Total de elementos
  totalPages: number; // Total de páginas
  size: number; // Tamaño de la página
  number: number; // Número de la página actual
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`; // URL base del backend

  constructor(private http: HttpClient) {}

  /**
   * Obtener productos con paginación.
   * @param page Número de la página a obtener.
   * @param size Tamaño de la página.
   * @returns Observable con la respuesta de productos.
   */
  getProducts(page = 0, size = 10): Observable<ProductResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ProductResponse>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error al obtener productos', error);
        return of({ content: [], totalElements: 0, totalPages: 0, size: 0, number: 0 }); // Retorna un objeto vacío en caso de error
      })
    );
  }

  /**
   * Crear un nuevo producto.
   * @param product Producto a crear.
   * @returns Observable con el producto creado.
   */
  createProduct(product: Product): Observable<Product | null> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      catchError((error) => {
        console.error('Error al crear producto', error);
        return of(null); // Retorna null en caso de error
      })
    );
  }

  /**
   * Actualizar un producto existente.
   * @param id ID del producto a actualizar.
   * @param product Datos del producto a actualizar.
   * @returns Observable con el producto actualizado.
   */
  updateProduct(id: number, product: Product): Observable<Product | null> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product).pipe(
      catchError((error) => {
        console.error('Error al actualizar producto', error);
        return of(null); // Retorna null en caso de error
      })
    );
  }

  /**
   * Eliminar un producto.
   * @param id ID del producto a eliminar.
   * @returns Observable vacío.
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar producto', error);
        return of(); // Retorna un observable vacío en caso de error
      })
    );
  }
}