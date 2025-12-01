// src/app/application/vehicle.facade.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle, VehicleStatus } from '../domain/models/vehicle.model';
import {
  VehicleApiService,
  CreateVehicleRequest,
  UpdateVehicleRequest,
} from '../services/vehicle/vehicle-api.service';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';




@Injectable({ providedIn: 'root' })
export class VehicleFacade {
  constructor(private api: VehicleApiService) {}

  createVehicle(payload: CreateVehicleRequest): Observable<Vehicle> {
    return this.api.create(payload);
  }

  listAvailable(): Observable<Vehicle[]> {
    return this.api.list('AVAILABLE');
  }

  getById(id: number): Observable<Vehicle> {
    return this.api.getById(id);
  }

  updateVehicle(id: number, payload: UpdateVehicleRequest): Observable<Vehicle> {
    return this.api.update(id, payload);
  }

  updateMainImage(id: number, url: string | null): Observable<Vehicle> {
    return this.api.updateMainImage(id, url);
  }

  changeStatus(id: number, newStatus: VehicleStatus): Observable<Vehicle> {
    return this.api.changeStatus(id, newStatus);
  }

  deleteVehicle(id: number): Observable<void> {
    return this.api.delete(id);
  }

  updateStatus(id: number, newStatus: string): Observable<Vehicle> {
    return this.api.updateStatus(id, newStatus);
  }

  /** Mis vehículos = todos los vehículos cuyo sellerId = userId actual */
  listMyVehicles(): Observable<Vehicle[]> {
    const raw = localStorage.getItem('automatch_user_id');
    const userId = raw ? Number(raw) : null;
    if (!userId) return of([]);

    return this.api.search({ sellerId: userId });
  }


  listAll(): Observable<Vehicle[]> {
    return this.api.listAll();
  }



  /** Catálogo público (para compradores) */
  loadCatalog(): Observable<Vehicle[]> {
    return this.listAvailable();
  }

  /** Mis vehículos (para sellers) */
  loadMyVehicles(): Observable<Vehicle[]> {
    return this.listMyVehicles();
  }

  /** Vehículos en revisión (para mecánicos/técnicos) */
  loadUnderReview(): Observable<Vehicle[]> {
    return this.api.search({ status: 'UNDER_REVIEW' });
  }


}
