import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Car } from '../car/car.service';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private apiUrl = `${environment.apiUrl}/favorites`;

  constructor(private http: HttpClient) {}

  getFavoritesByCurrentUser(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiUrl}/me`);
  }

  addFavorite(vehicleId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}`, { vehicleId });
  }

  removeFavorite(vehicleId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${vehicleId}`);
  }
}