import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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

export interface Freelancer {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  roles: { id: number; name: string }[];
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
export class FreelancerService {
  private baseUrl = `${environment.apiUrl}/users`; // Asegúrate que este endpoint coincida

  constructor(private http: HttpClient) {}

  // Obtener datos del freelancer actual
  getFreelancerData(): Observable<Freelancer> {
    return this.http.get<Freelancer>(`${this.baseUrl}/me`);
  }
}
