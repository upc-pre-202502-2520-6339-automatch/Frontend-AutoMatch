import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

export interface Car {
  id?: number;
  userId?: number;
  title: string;
  brand: string;
  model: string;
  color: string;
  year: number;
  price: number;
  transmission: string;
  engine: string;
  mileage: number;
  doors: number;
  // Campos opcionales usados en tu HTML
  description?: string;
  speed?: number;
  fuel?: string;
  mainImage?: string; // imagen principal (seguro viene del backend)
  imageUrl?: string;  // alternativa de nombre
  images?: string[];
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: 'LISTED' | 'SOLD' | 'DRAFT' | 'PENDING';
  reviewNotes?: string;
  profileId?: number;
}

@Injectable({ providedIn: 'root' })
export class CarService {
  private apiUrl = `${environment.apiUrl}/cars`;

  constructor(private http: HttpClient) {}

  // Lista paginada
  getCars(page = 1, pageSize = 12, q?: string): Observable<{items: Car[]; total: number}> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (q) params = params.set('q', q);
    return this.http.get<{items: Car[]; total: number}>(`${this.apiUrl}`, { params });
  }

  // Lista por usuario (para "mis anuncios")
  getCarsByUser(userId: number): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Detalle
  getCarById(id: number): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/${id}`);
  }

  // Crear
  createCar(newCar: Car, userId: number): Observable<Car> {
    return this.http.post<Car>(`${this.apiUrl}`, { ...newCar, userId });
  }

  // Actualizar
  updateCar(id: number, updated: Partial<Car>): Observable<Car> {
    return this.http.put<Car>(`${this.apiUrl}/${id}`, updated);
  }

  // Eliminar
  deleteCar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}