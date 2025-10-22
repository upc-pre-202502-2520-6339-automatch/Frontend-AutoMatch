import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Buyer, Seller, PaymentRequest, TechnicalReviewInfo } from '../domain/models';
import { BuyerRepository } from '../domain/repositories/buyer.repository';

@Injectable({ providedIn: 'root' })
export class BuyerFacade {
  private buyerSub = new BehaviorSubject<Buyer | null>(null);
  private sellerSub = new BehaviorSubject<Seller | null>(null);
  private techInfoSub = new BehaviorSubject<TechnicalReviewInfo | null>(null);

  buyer$ = this.buyerSub.asObservable();
  seller$ = this.sellerSub.asObservable();
  technicalInfo$ = this.techInfoSub.asObservable();

  constructor(private repo: BuyerRepository) {}

  loadBuyerAndSeller(): void {
    this.repo.getCurrentBuyer().subscribe(b => this.buyerSub.next(b));
    this.repo.getCurrentSeller().subscribe(s => this.sellerSub.next(s));
  }

  patchBuyer(partial: Partial<Buyer>): void {
    const current = this.buyerSub.value;
    if (current) this.buyerSub.next({ ...current, ...partial });
  }

  async submitPayment(accountNumber: string, transactionNumber: string): Promise<void> {
    const buyer = this.buyerSub.value;
    const seller = this.sellerSub.value;
    if (!buyer || !seller) throw new Error('Buyer/Seller not loaded');

    const payload: PaymentRequest = {
      buyerId: buyer.id,
      sellerId: seller.id,
      accountNumber,
      transactionNumber
    };
    await firstValueFrom(this.repo.submitPayment(payload));
  }

  loadTechnicalInfo(): void {
    this.repo.getTechnicalReviewInfo().subscribe(info => this.techInfoSub.next(info));
  }
}