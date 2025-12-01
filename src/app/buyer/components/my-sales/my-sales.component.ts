import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {NgIf, NgForOf, AsyncPipe, DatePipe} from '@angular/common';
import {
  MatCard,
  MatCardTitle,
  MatCardContent,
  MatCardActions
} from '@angular/material/card';
import { MatButton } from '@angular/material/button';

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
    DatePipe
  ]
})
export class MySalesComponent implements OnInit {

  salesState$!: Observable<SalePageState | null>;
  loading = false;

  constructor(
    private salesFacade: SalesFacade,
    private snackBar: MatSnackBar
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

  // Aquí podrías agregar acciones específicas del seller,
  // por ahora solo mostramos la lista.
}
