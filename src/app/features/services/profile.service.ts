import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from './user.service';

export interface UserProfile extends User {
  country: string;
  countryFlagUrl?: string;
  presentation?: string;
  language?: string;
  description?: string;
  experience?: string;
  reference?: string;
  education?: string;
  skills: string[];
  certifications: string[];
  qualifications?: string;
  publications: string[];
  socialLinks: Record<string, string>; // Mapa de plataformas sociales y sus enlaces
}

/**
 * Modelo combinado que une `User` y `UserProfile`.
 */
export interface FullUserProfile {
  user: User;
  profile: UserProfile | null; // Puede no existir si el usuario no tiene perfil aún
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private usersApiUrl = `${environment.apiUrl}/users`;      // API de usuarios
  private profileApiUrl = `${environment.apiUrl}/profile`; // API de perfiles

  constructor(private http: HttpClient) {}

  /**
   * Obtener datos completos del usuario y su perfil.
   */
  getPublicProfile(userId: number): Observable<FullUserProfile> {
    const userRequest = this.http.get<User>(`${this.usersApiUrl}/${userId}`);
    const profileRequest = this.http.get<UserProfile>(`${this.profileApiUrl}/${userId}`).pipe(
      // Si no hay perfil, devolver un objeto vacío en su lugar
      catchError(() => {
        console.warn(`No se encontró perfil para el usuario ID ${userId}`);
        return of(null);
      })
    );

    return forkJoin({ user: userRequest, profile: profileRequest });
  }

  updateProfile(userId: number, profileData: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.profileApiUrl}/${userId}`, profileData).pipe(
      catchError(error => {
        console.error('❌ Error al actualizar perfil:', error);
        return of(profileData as UserProfile); // Retorna los datos locales en caso de error
      })
    );
  }
  
}
