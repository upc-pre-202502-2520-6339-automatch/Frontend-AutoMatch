import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Sale} from "../domain/sale.model";
import {environment} from "../../../environments/environment";

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // página actual
  size: number;   // tamaño de página
}

@Injectable({ providedIn: 'root' })
export class SalesApiService {
  // apiUrl ya incluye /api/v1 → queda /api/v1/sales
  private readonly baseUrl = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient) {}

  /** POST /sales { vehicleId } */
  createSale(vehicleId: number): Observable<Sale> {
    return this.http.post<Sale>(this.baseUrl, { vehicleId });
  }

  /** GET /sales/{id} */
  getSaleById(id: number): Observable<Sale> {
    return this.http.get<Sale>(`${this.baseUrl}/${id}`);
  }

  /** POST /sales/{id}/pay */
  confirmPayment(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/pay`, {});
  }

  /** POST /sales/{id}/cancel { reason? } */
  cancelSale(id: number, reason?: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/cancel`, { reason });
  }

  /** GET /sales?role=buyer */
  findMySalesAsBuyer(page = 0, size = 10): Observable<PageResponse<Sale>> {
    const params = new HttpParams()
      .set('role', 'buyer')
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<Sale>>(this.baseUrl, { params });
  }

  /** GET /sales?role=seller */
  findMySalesAsSeller(page = 0, size = 10): Observable<PageResponse<Sale>> {
    const params = new HttpParams()
      .set('role', 'seller')
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<Sale>>(this.baseUrl, { params });
  }
}
