import { Injectable } from '@angular/core';
import { environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl: string = `${environment.apiUrl}/transaction`;

  constructor(private http: HttpClient) {}

  createTransaction(transaction: any) {
    return this.http.post(`${this.apiUrl}`, transaction);
  }

  updateTransaction(transactionId: number, updateData: any) {
    return this.http.put(`${this.apiUrl}/${transactionId}`, {
      transactionId,
      ...updateData,
    });
  }

  getTransactionsByUser() {
    return this.http.get(`${this.apiUrl}/me`);
  }
}
