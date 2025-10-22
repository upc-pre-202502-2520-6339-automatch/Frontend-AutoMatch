import { Observable } from 'rxjs';
import { Buyer, Seller, PaymentRequest, TechnicalReviewInfo } from '../models';

export abstract class BuyerRepository {
  abstract getCurrentBuyer(): Observable<Buyer>;
  abstract getCurrentSeller(): Observable<Seller>;
  abstract submitPayment(payload: PaymentRequest): Observable<void>;
  abstract getTechnicalReviewInfo(): Observable<TechnicalReviewInfo>;
}