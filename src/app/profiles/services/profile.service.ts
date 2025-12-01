// src/app/profiles/services/profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

// ====== Tipos que matchean con tu backend ======

export type RoleType = 'BUYER' | 'SELLER';

export type BusinessType = 'DEALERSHIP' | 'SHOP' | 'WORKSHOP';

export interface SellerProfile {
  ruc: string;
  businessType: BusinessType;
  businessName: string;
  address: string;
  phoneNumber: string;
}

export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleType: RoleType;
  sellerProfile?: SellerProfile | null;
}

// ---------- Requests para los comandos ----------

// POST /api/profiles/buyers
export interface CreateCustomerProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

// POST /api/profiles/sellers
export interface CreateSellerProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  ruc: string;
  businessType: BusinessType;
  businessName: string;
  address: string;
  phoneNumber: string;
}

// PUT /api/profiles/{id}
export interface UpdateProfileRequest {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  roleType?: RoleType | null;
  ruc?: string | null;
  businessType?: BusinessType | null;
  businessName?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
}

// Respuesta de RENIEC
export interface ReniecPersonResource {
  data: Record<string, any>;
}

@Injectable({

  providedIn: 'root'
})
export class ProfileService {

  // 👈 importante: coincide con @RequestMapping("/api/profiles")
  private readonly basePath = `${environment.backendApiBaseUrl}/api/profiles`;


  // Cache del perfil actual (el /me)
  private currentProfileSubject = new BehaviorSubject<Profile | null>(null);
  currentProfile$ = this.currentProfileSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ============= QUERIES =============

  /** GET /api/profiles/me */
  getMyProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.basePath}/me`).pipe(
      tap(profile => this.currentProfileSubject.next(profile))
    );
  }

  /** GET /api/profiles/{id} */
  getProfileById(id: number): Observable<Profile> {
    return this.http.get<Profile>(`${this.basePath}/${id}`);
  }

  /** GET /api/profiles */
  getAllProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(this.basePath);
  }

  /** GET /api/profiles/reniec/{dni} */
  getPersonFromReniec(dni: string): Observable<ReniecPersonResource> {
    return this.http.get<ReniecPersonResource>(`${this.basePath}/reniec/${dni}`);
  }

  // ============= COMMANDS =============

  /** POST /api/profiles/buyers */
  createCustomerProfile(payload: CreateCustomerProfileRequest): Observable<Profile> {
    return this.http.post<Profile>(`${this.basePath}/buyers`, payload).pipe(
      tap(profile => this.currentProfileSubject.next(profile))
    );
  }

  /** POST /api/profiles/sellers */
  createSellerProfile(payload: CreateSellerProfileRequest): Observable<Profile> {
    return this.http.post<Profile>(`${this.basePath}/sellers`, payload).pipe(
      tap(profile => this.currentProfileSubject.next(profile))
    );
  }

  /** PUT /api/profiles/{id} */
  updateProfile(id: number, payload: UpdateProfileRequest): Observable<Profile> {
    return this.http.put<Profile>(`${this.basePath}/${id}`, payload).pipe(
      tap(profile => this.currentProfileSubject.next(profile))
    );
  }

  /** DELETE /api/profiles/{id} */
  deleteProfile(id: number): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${id}`).pipe(
      tap(() => this.currentProfileSubject.next(null))
    );
  }

  // Snapshot sincrónico (por si un componente quiere leer rápido)
  getCurrentProfileSnapshot(): Profile | null {
    return this.currentProfileSubject.value;
  }
}
