import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private apiUrl: string = `${environment.apiUrl}/subscription`;

  constructor(private http: HttpClient) {}

  getMySubscription(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  createSubscription(subscriptionData: any): Observable<any> {
    return this.http.post(this.apiUrl, subscriptionData);
  }

  cancelMySubscription(): Observable<any> {
    return this.http.put(`${this.apiUrl}/me/cancel`, {});
  }
}