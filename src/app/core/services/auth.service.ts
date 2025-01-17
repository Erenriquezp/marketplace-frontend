import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface AuthResponse {
  id: number; // ID del usuario autenticado
  accessToken: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`; // URL base para la autenticación
  private currentUserSubject: BehaviorSubject<AuthResponse | null>;
  public currentUser: Observable<AuthResponse | null>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<AuthResponse | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  /**
   * Iniciar sesión con credenciales de usuario.
   */
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, { username, password }).pipe(
      map((response) => {
        // Almacena el token y los roles en localStorage
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.currentUserSubject.next(response);
        
        return response;
      })
    );
  }

  /**
   * Registrar un nuevo usuario.
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
   * Determinar la ruta de redirección del dashboard según los roles del usuario.
   */
  getDashboardRouteByRole(): string {
    const roles = this.currentUserValue?.roles || [];
    if (roles.includes('ROLE_USER')) {
      return '/dashboard/client';
    } else if (roles.includes('ROLE_FREELANCER')) {
      return '/dashboard/freelancer';
    } else if (roles.includes('ROLE_ADMIN')) {
      return '/dashboard/admin';
    }
    return '/auth/login'; // Redirige al login si no tiene roles válidos
  }

  /**
   * Cerrar sesión.
   */
  logout(): void {
    // Elimina el token del localStorage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  /**
   * Verificar si el usuario está autenticado.
   */
  isAuthenticated(): boolean {
    return !!this.currentUserValue?.accessToken;
  }
}
