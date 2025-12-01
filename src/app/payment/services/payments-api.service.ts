import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  PaymentProcessRequest,
  PaymentProcessResponse,
  CardTokenizeRequest,
  CardTokenizeResponse,
  PaymentMethodView,
  CreatePaymentIntentRequest,
  CreatePaymentIntentResponse
} from '../models/payment.models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentsApiService {
  private baseUrl = `${environment.apiUrl}payments`;
  private methodsUrl = `${environment.apiUrl}payment-methods`;

  constructor(private http: HttpClient) {}

  tokenizeCard(body: CardTokenizeRequest): Observable<CardTokenizeResponse> {
    return this.http.post<CardTokenizeResponse>(
      `${this.baseUrl}/card-tokenize`,
      body
    );
  }

  getMyPaymentMethods(): Observable<PaymentMethodView[]> {
    return this.http.get<PaymentMethodView[]>(`${this.methodsUrl}/me`);
  }

  processPayment(body: PaymentProcessRequest): Observable<PaymentProcessResponse> {
    return this.http.post<PaymentProcessResponse>(this.baseUrl, body);
  }

  // Opcional, si quieres usar intents
  createIntent(body: CreatePaymentIntentRequest): Observable<CreatePaymentIntentResponse> {
    return this.http.post<CreatePaymentIntentResponse>(
      `${this.baseUrl}/intents`,
      body
    );
  }

  getByRequestId(requestId: string): Observable<PaymentProcessResponse> {
    return this.http.get<PaymentProcessResponse>(
      `${this.baseUrl}/request/${requestId}`
    );
  }
}
