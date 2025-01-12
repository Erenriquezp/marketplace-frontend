// auth/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`; // URL base para la autenticación
  private currentUserSubject: BehaviorSubject<{ accessToken: string; role: string }>;
  public currentUser: Observable<{ accessToken: string; role: string }>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<{ accessToken: string; role: string }>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): { accessToken: string; role: string } | null {
    return this.currentUserSubject.value;
  }
  login(username: string, password: string): Observable<unknown> {
    return this.http.post<{ accessToken: string; role: string }>(`${this.baseUrl}/login`, { username, password }).pipe(
      map((response) => {
        // Almacena el token y el rol en localStorage
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.currentUserSubject.next(response);
        return response;
      })
    );
  }
   /**
   * Método de registro de un nuevo usuario
   */
   register(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Observable<unknown> {
    return this.http.post<unknown>(`${this.baseUrl}/register`, userData).pipe(
      map((response) => {
        console.log('Registro exitoso:', response);
        return response;
      })
    );
  }
  /**
   * Obtener la ruta del dashboard según el rol del usuario.
   */
  getDashboardRouteByRole(): string {
    const role = this.currentUserValue?.role;
    switch (role) {
      case 'ROLE_USER':
        return '/dashboard/client';
      case 'ROLE_FREELANCER':
        return '/dashboard/freelancer';
      default:
        return '/dashboard/'; // Redirigir al login si no tiene rol válido
    }
  }

  logout(): void {
    // Elimina el token del localStorage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next({ accessToken: '', role: '' });
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue?.accessToken;
  }
}
