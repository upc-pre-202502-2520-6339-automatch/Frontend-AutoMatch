import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Vehicle, VehicleStatus } from '../../domain/models/vehicle.model';
import { map } from 'rxjs/operators';


export interface CreateVehicleRequest {
  plate: string;
  vin: string;
  brand: string;
  model: string;
  year: number;
  mileageKm: number;
  priceAmount: number;
  priceCurrency: string;
  mainImageUrl?: string | null;
}

export interface UpdateVehicleRequest {
  brand?: string;
  model?: string;
  year?: number;
  mileageKm?: number;
  priceAmount?: number;
  priceCurrency?: string;
  mainImageUrl?: string | null;
}

export interface VehicleSearchParams {
  status?: VehicleStatus;
  sellerId?: number;
  brand?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
}





@Injectable({ providedIn: 'root' })
export class VehicleApiService {
  private readonly baseUrl = `${environment.apiUrl}/vehicles`;

  constructor(private http: HttpClient) {}

  /** Listado sin paginación: /api/v1/vehicles/list */
  list(status?: VehicleStatus): Observable<Vehicle[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<Vehicle[]>(`${this.baseUrl}/list`, { params });
  }

  /** Detalle por id */
  getById(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.baseUrl}/${id}`);
  }

  /** Crear vehículo (SELLER) */
  create(payload: CreateVehicleRequest): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.baseUrl, payload);
  }

  /** Actualizar datos */
  update(id: number, payload: UpdateVehicleRequest): Observable<Vehicle> {
    return this.http.patch<Vehicle>(`${this.baseUrl}/${id}`, payload);
  }

  /** Cambiar imagen principal */
  updateMainImage(id: number, mainImageUrl: string | null): Observable<Vehicle> {
    return this.http.patch<Vehicle>(`${this.baseUrl}/${id}/main-image`, { mainImageUrl });
  }

  /** Cambiar status */
  changeStatus(id: number, newStatus: VehicleStatus): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.baseUrl}/${id}/status`, { newStatus });
  }

  /** Borrado lógico (WITHDRAWN) */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }


  search(params: VehicleSearchParams = {}): Observable<Vehicle[]> {
    let httpParams = new HttpParams();
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }

    return this.http.get<Vehicle[]>(`${this.baseUrl}/list`, { params: httpParams }).pipe(
      map(vehicles =>
        vehicles.filter(v => {
          if (params.sellerId != null && v.sellerId !== params.sellerId) return false;
          if (params.brand && !v.brand.toLowerCase().includes(params.brand.toLowerCase())) return false;
          if (params.model && !v.model.toLowerCase().includes(params.model.toLowerCase())) return false;
          if (params.minYear != null && v.year < params.minYear) return false;
          if (params.maxYear != null && v.year > params.maxYear) return false;
          return true;
        })
      )
    );
  }

  /** Listado completo sin filtrar por estado */
  listAll(): Observable<Vehicle[]> {
    // El backend admite /list sin status y devuelve todos
    return this.http.get<Vehicle[]>(`${this.baseUrl}/list`);
  }

  updateStatus(id: number, newStatus: string) {
    return this.http.put<Vehicle>(
      `${this.baseUrl}/${id}/status`,
      { newStatus }
    );
  }

}







