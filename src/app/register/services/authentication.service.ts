import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

import { SignInRequest } from '../model/sign-in.request';
import { SignUpRequest } from '../model/sign-up.request';
import { SignInResponse } from '../model/sign-in.response';
import { AuthResponse } from '../model/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly basePath = `${environment.apiUrl}/authentication`;

  private readonly accessTokenKey = 'automatch_access_token';
  private readonly userIdKey = 'automatch_user_id';
  private readonly usernameKey = 'automatch_username';
  private readonly rolesKey = 'automatch_roles';

  private isSignedInSubject = new BehaviorSubject<boolean>(this.hasStoredToken());
  isSignedIn$ = this.isSignedInSubject.asObservable();

  private currentUserIdSubject = new BehaviorSubject<number | null>(this.getStoredUserId());
  currentUserId$ = this.currentUserIdSubject.asObservable();

  private currentUsernameSubject = new BehaviorSubject<string | null>(this.getStoredUsername());
  currentUsername$ = this.currentUsernameSubject.asObservable();

  private rolesSubject = new BehaviorSubject<string[]>(this.getStoredRoles());
  roles$ = this.rolesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // -----------------------------
  // SIGN IN
  // -----------------------------
  signIn(request: SignInRequest): Observable<void> {
    return this.http.post<SignInResponse>(`${this.basePath}/sign-in`, request).pipe(
      tap(res => {
        const auth: AuthResponse = {
          id: res.id,
          username: res.username,
          roles: res.roles,
          token: res.token
        };
        this.storeAuth(auth);
      }),
      map(() => void 0)
    );
  }

  // -----------------------------
  // SIGN UP
  // -----------------------------
  signUp(request: SignUpRequest): Observable<void> {
    // El backend devuelve UserResource { id, username, roles }
    return this.http.post<any>(`${this.basePath}/sign-up`, request).pipe(
      map(() => void 0)
    );
  }

  // -----------------------------
  // VERIFY TOKEN (usa Header Authorization)
  // -----------------------------
  verifyToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) return of(false);

    // El interceptor ya agregará el Authorization: Bearer <token>
    return this.http.post<SignInResponse>(`${this.basePath}/verify-token`, {}).pipe(
      tap(res => {
        const auth: AuthResponse = {
          id: res.id,
          username: res.username,
          roles: res.roles,
          token: res.token
        };
        this.storeAuth(auth);
      }),
      map(() => true),
      catchError(() => {
        this.clearAuth();
        return of(false);
      })
    );
  }

  // -----------------------------
  // REFRESH TOKEN
  // -----------------------------
  refreshToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) return of(false);

    return this.http.post<SignInResponse>(`${this.basePath}/refresh`, {}).pipe(
      tap(res => {
        const auth: AuthResponse = {
          id: res.id,
          username: res.username,
          roles: res.roles,
          token: res.token
        };
        this.storeAuth(auth);
      }),
      map(() => true),
      catchError(() => {
        this.clearAuth();
        return of(false);
      })
    );
  }

  // -----------------------------
  // LOGOUT
  // -----------------------------
  signOut(): Observable<void> {
    const token = this.getToken();
    if (!token) {
      this.clearAuth();
      return of(void 0);
    }


    return this.http.post<void>(`${this.basePath}/logout`, {}).pipe(
      tap(() => this.clearAuth()),
      catchError(() => {
        this.clearAuth();
        return of(void 0);
      })
    );
  }

  // -----------------------------
  // UTILIDADES / GETTERS
  // -----------------------------
  getToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  isAuthenticated(): boolean {
    return this.isSignedInSubject.value;
  }

  getCurrentUserId(): number | null {
    return this.currentUserIdSubject.value;
  }

  getRoles(): string[] {
    return this.rolesSubject.value;
  }

  // -----------------------------
  // STORAGE interno
  // -----------------------------
  private storeAuth(auth: AuthResponse): void {
    localStorage.setItem(this.accessTokenKey, auth.token);
    localStorage.setItem(this.userIdKey, auth.id.toString());
    localStorage.setItem(this.usernameKey, auth.username);
    localStorage.setItem(this.rolesKey, JSON.stringify(auth.roles));

    this.isSignedInSubject.next(true);
    this.currentUserIdSubject.next(auth.id);
    this.currentUsernameSubject.next(auth.username);
    this.rolesSubject.next(auth.roles);
  }

  private clearAuth(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.usernameKey);
    localStorage.removeItem(this.rolesKey);

    this.isSignedInSubject.next(false);
    this.currentUserIdSubject.next(null);
    this.currentUsernameSubject.next(null);
    this.rolesSubject.next([]);
  }

  private hasStoredToken(): boolean {
    return !!localStorage.getItem(this.accessTokenKey);
  }

  private getStoredUserId(): number | null {
    const raw = localStorage.getItem(this.userIdKey);
    return raw ? Number(raw) : null;
  }

  private getStoredUsername(): string | null {
    return localStorage.getItem(this.usernameKey);
  }

  private getStoredRoles(): string[] {
    const raw = localStorage.getItem(this.rolesKey);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  // en AuthenticationService
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }





}
