import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/users';

  constructor(private http: HttpClient) {}

  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}`);
  }

  getUserInfo(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }
  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }
  register(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user).pipe(
      tap(response => {
        if (response) {
          localStorage.setItem('userRole', response.role);
          localStorage.setItem('id', response.id);
        }
      }),
      catchError(error => {
        console.error('Error al registrar el usuario:', error);
        return throwError(error);
      })
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?username=${credentials.username}&password=${credentials.password}`).pipe(
      tap(users => {
        if (users.length > 0) {
          const user = users[0];
          localStorage.setItem('userRole', user.role);
          localStorage.setItem('id', user.id);
        } else {
          console.error('Usuario o contraseña incorrectos');
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('userRole');
    localStorage.removeItem('id');
    console.log('Sesión cerrada');
  }
}
