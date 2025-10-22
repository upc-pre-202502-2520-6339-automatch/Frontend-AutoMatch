import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Car } from '../../domain/models/car.model';

@Injectable({ providedIn: 'root' })
export class CarRepository {
  private apiUrl = `${environment.apiUrl}/cars`;

  constructor(private http: HttpClient) {}

  addCar(car: Car): Observable<Car> {
    return this.http.post<Car>(this.apiUrl, car);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/profiles/me`);
  }
}