import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`; // URL del backend
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    this.tokenSubject.next(localStorage.getItem('token'));
  }

  get token$(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  login(email: string, password: string): Observable<void> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
      map((response) => {
        localStorage.setItem('token', response.token);
        this.tokenSubject.next(response.token);
      })
    );
  }

  register(data: { email: string; password: string; name: string }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, data);
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/forgot-password`, { email });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }
}
