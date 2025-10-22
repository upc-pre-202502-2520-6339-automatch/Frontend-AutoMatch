import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Buyer, Seller } from '../domain/models';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BuyerService {
  private apiUrl = `${environment.apiUrl}/buyers`;

  constructor(private http: HttpClient) {}

  getBuyerData(): Observable<Buyer> {
    return this.http.get<Buyer>(`${this.apiUrl}/current`);
  }

  getSellerData(): Observable<Seller> {
    return this.http.get<Seller>(`${this.apiUrl}/seller`);
  }
}