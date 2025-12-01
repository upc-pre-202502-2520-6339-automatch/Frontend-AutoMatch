// my-sales.component.ts
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  NgIf,
  NgForOf,
  AsyncPipe,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
  NgClass,
  LowerCasePipe
} from '@angular/common';
import {
  MatCard,
  MatCardTitle,
  MatCardContent,
  MatCardActions
} from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

import { SalesFacade, SalePageState } from '../../application/sales.facade';

@Component({
  selector: 'app-my-sales',
  templateUrl: './my-sales.component.html',
  styleUrls: ['./my-sales.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    AsyncPipe,
    DatePipe,
    DecimalPipe,
    TitleCasePipe,
    NgClass,
    MatButton,
    MatProgressSpinner,
    LowerCasePipe
  ]
})
export class MySalesComponent implements OnInit {

  salesState$!: Observable<SalePageState | null>;
  loading = false;

  constructor(
    private salesFacade: SalesFacade,
    private snackBar: MatSnackBar,
    private router: Router              // 👈 inyectamos Router
  ) {}

  ngOnInit(): void {
    this.salesState$ = this.salesFacade.getMySalesAsSeller$();
    this.reload();
  }

  reload(): void {
    this.loading = true;
    this.salesFacade.loadMySalesAsSeller(0, 10);
    setTimeout(() => this.loading = false, 500);
  }

  /** Abrir chat con el comprador de esta venta */
  openChatWithBuyer(sale: any): void {
    if (!sale?.buyerId) {
      console.error('[MySales] sale.buyerId no está definido');
      return;
    }

    // Si en el futuro tu backend devuelve conversationId, úsalo aquí:
    const conversationId = sale.conversationId ?? sale.id;

    this.router.navigate(['/messages', conversationId], {
      queryParams: { receiverId: sale.buyerId }
    });
  }
}
