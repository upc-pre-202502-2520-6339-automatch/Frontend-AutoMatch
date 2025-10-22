import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000'; // Asegúrate que coincida con tu fake API

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profiles/me`);
  }

  getProfileById(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/profiles/${id}`);
}
}
