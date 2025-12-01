import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SalesFacade, SalePageState } from '../../application/sales.facade';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatCard, MatCardActions, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-my-purchases',
  templateUrl: './my-purchases.component.html',
  styleUrls: ['./my-purchases.component.css'],
  standalone: true,


  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatButton,
    NgIf,
    NgForOf,
    AsyncPipe,
    DatePipe
  ]
})
export class MyPurchasesComponent implements OnInit {

  salesState$!: Observable<SalePageState | null>;
  loading = false;

  constructor(
    private salesFacade: SalesFacade,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.salesState$ = this.salesFacade.getMySalesAsBuyer$();
    this.reload();
  }

  reload(): void {
    this.loading = true;
    this.salesFacade.loadMySalesAsBuyer(0, 10);
    // como el facade hace subscribe interno, solo bajamos loading un poco después
    setTimeout(() => this.loading = false, 500);
  }

  onPay(saleId: number): void {
    this.salesFacade.confirmPayment(saleId).subscribe({
      next: () => {
        this.snackBar.open('Sale marked as PAID.', 'Close', { duration: 3000 });
        this.reload();
      },
      error: () => {
        this.snackBar.open('Could not confirm payment.', 'Close', { duration: 3000 });
      }
    });
  }

  onCancel(saleId: number): void {
    this.salesFacade.cancelSale(saleId, 'Buyer cancelled').subscribe({
      next: () => {
        this.snackBar.open('Sale cancelled.', 'Close', { duration: 3000 });
        this.reload();
      },
      error: () => {
        this.snackBar.open('Could not cancel sale.', 'Close', { duration: 3000 });
      }
    });
  }
}
