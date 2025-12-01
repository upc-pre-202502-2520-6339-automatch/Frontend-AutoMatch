import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Sale } from '../domain/sale.model';
import { PageResponse, SalesApiService } from '../services/sales-api.service';

export interface SalePageState {
  items: Sale[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class SalesFacade {
  private buyerSalesState = new BehaviorSubject<SalePageState | null>(null);
  private sellerSalesState = new BehaviorSubject<SalePageState | null>(null);

  constructor(private api: SalesApiService) {}

  // ---------- Commands ----------

  /** Crear venta / reserva para un vehículo */
  createSaleForVehicle(vehicleId: number) {
    return this.api.createSale(vehicleId);
  }

  /** Confirmar pago */
  confirmPayment(saleId: number) {
    return this.api.confirmPayment(saleId);
  }

  /** Cancelar venta */
  cancelSale(saleId: number, reason?: string) {
    return this.api.cancelSale(saleId, reason);
  }

  // ---------- Queries Buyer ----------

  loadMySalesAsBuyer(page = 0, size = 10): void {
    this.api.findMySalesAsBuyer(page, size)
      .pipe(
        tap((res: PageResponse<Sale>) => {
          this.buyerSalesState.next({
            items: res.content,
            totalElements: res.totalElements,
            totalPages: res.totalPages,
            page: res.number,
            size: res.size
          });
        })
      )
      .subscribe();
  }

  getMySalesAsBuyer$(): Observable<SalePageState | null> {
    return this.buyerSalesState.asObservable();
  }

  // ---------- Queries Seller ----------

  loadMySalesAsSeller(page = 0, size = 10): void {
    this.api.findMySalesAsSeller(page, size)
      .pipe(
        tap((res: PageResponse<Sale>) => {
          this.sellerSalesState.next({
            items: res.content,
            totalElements: res.totalElements,
            totalPages: res.totalPages,
            page: res.number,
            size: res.size
          });
        })
      )
      .subscribe();
  }

  getMySalesAsSeller$(): Observable<SalePageState | null> {
    return this.sellerSalesState.asObservable();
  }
}
