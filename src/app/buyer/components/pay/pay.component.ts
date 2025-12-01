/*import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Buyer, Seller } from '../../domain/models';
import { BuyerFacade } from '../../application/buyer.facade';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {
  // ✅ Tipados correctos
  buyer$!: Observable<Buyer | null>;
  seller$!: Observable<Seller | null>;

  form!: FormGroup;
  loading = false;
  success = false;
  errorMsg = '';

  constructor(private facade: BuyerFacade, private fb: FormBuilder) {}

  ngOnInit(): void {
    // ✅ Inicializar formulario aquí
    this.form = this.fb.group({
      accountNumber: ['', [Validators.required, Validators.minLength(6)]],
      transactionNumber: ['', [Validators.required, Validators.minLength(6)]],
    });

    // ✅ Asignar observables
    this.buyer$ = this.facade.buyer$;
    this.seller$ = this.facade.seller$;

    // ✅ Cargar datos
    this.facade.loadBuyerAndSeller();
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    this.success = false;

    try {
      const { accountNumber, transactionNumber } = this.form.getRawValue();
      await this.facade.submitPayment(accountNumber!, transactionNumber!);
      this.success = true;
      this.form.reset();
    } catch (e: any) {
      this.errorMsg = e?.message ?? 'Error submitting payment';
    } finally {
      this.loading = false;
    }
  }
}
*/
