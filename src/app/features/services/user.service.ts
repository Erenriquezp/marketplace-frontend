import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

// Interfaces para User y sus datos asociados
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  fileUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  roles: Role[];
  wallet: number;
  profilePictureUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  products: Product[];
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`; // URL del backend

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error al obtener usuarios', error);
          return of([]); // Return an empty array on error
      })
    );
    }

  // Obtener un usuario por ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error al obtener el usuario con ID ${id}`, error);
        throw error;
      })
    );
  }

  // Crear un nuevo usuario
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // Actualizar un usuario
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // Eliminar un usuario
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
