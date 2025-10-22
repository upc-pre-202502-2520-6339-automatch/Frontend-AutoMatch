import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BuyerRepository } from '../../domain/repositories/buyer.repository';
import { Buyer, Seller, PaymentRequest, TechnicalReviewInfo } from '../../domain/models';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { mapBuyer, mapSeller, mapTechnicalInfo } from '../mappers/buyer.mapper';

@Injectable()
export class BuyerHttpRepository implements BuyerRepository {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCurrentBuyer(): Observable<Buyer> {
    return this.http.get<any>(`${this.base}/buyers/current`).pipe(map(mapBuyer));
  }

  getCurrentSeller(): Observable<Seller> {
    return this.http.get<any>(`${this.base}/sellers/current`).pipe(map(mapSeller));
  }

  submitPayment(payload: PaymentRequest): Observable<void> {
    return this.http.post<void>(`${this.base}/payments`, payload);
  }

  getTechnicalReviewInfo(): Observable<TechnicalReviewInfo> {
    return this.http.get<any>(`${this.base}/technical-review/info`).pipe(map(mapTechnicalInfo));
  }
}