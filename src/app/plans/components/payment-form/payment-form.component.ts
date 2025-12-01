import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PlanService } from '../../service/plan.service';
import { PaymentsApiService } from '../../../payment/services/payments-api.service';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css'],
})
export class PaymentFormComponent implements OnInit {

  selectedPlan: any;
  isSummaryVisible = false;

  paymentForm!: FormGroup;
  loading = false;

  constructor(
    private planService: PlanService,
    private paymentsApi: PaymentsApiService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.selectedPlan = this.planService.getPlan();

    // Si alguien entra directo sin elegir plan, lo regreso
    if (!this.selectedPlan) {
      this.snackBar.open('Choose a plan first.', 'Close', { duration: 3000 });
      this.router.navigate(['/plan']);
      return;
    }

    this.buildForm();
  }

  private buildForm(): void {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required]],
      cardholderFirstName: ['', [Validators.required]],
      cardholderLastName: ['', [Validators.required]],
      expiryDate: ['', [Validators.required]],      // MM/YY
      cvv: ['', [Validators.required]],
      installments: [1, [Validators.required]],

      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      documentNumber: ['', [Validators.required]],
      province: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (!this.selectedPlan) {
      this.snackBar.open('Choose a plan first.', 'Close', { duration: 3000 });
      this.router.navigate(['/plan']);
      return;
    }

    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      this.snackBar.open('Please complete all required fields.', 'Close', { duration: 3000 });
      return;
    }

    const { email, confirmEmail, expiryDate } = this.paymentForm.value;

    if (email !== confirmEmail) {
      this.snackBar.open('Emails do not match.', 'Close', { duration: 3000 });
      return;
    }

    // Parsear MM/YY
    const [mmRaw, yyRaw] = (expiryDate as string).split('/');
    const mm = mmRaw?.trim();
    const yy = yyRaw?.trim();

    if (!mm || !yy) {
      this.snackBar.open('Invalid expiry date. Use MM/YY.', 'Close', { duration: 3000 });
      return;
    }

    const fullYear = yy.length === 2 ? `20${yy}` : yy;

    const form = this.paymentForm.value;

    const payload = {
      cardNumber: form.cardNumber,
      expiryMonth: mm,
      expiryYear: fullYear,
      cvv: form.cvv,
      cardholderFirstName: form.cardholderFirstName,
      cardholderLastName: form.cardholderLastName,
      billingFirstName: form.firstName,
      billingLastName: form.lastName,
      email: form.email,
      phone: form.phone,
      documentNumber: form.documentNumber,
      province: form.province,
      installments: Number(form.installments)
    };

    this.loading = true;

    this.paymentsApi.tokenizeCard(payload).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Card saved successfully.', 'Close', { duration: 3000 });
        // 👉 Directo al formulario de perfil
        this.router.navigate(['/profile-form']);
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Error processing payment.', 'Close', { duration: 3000 });
      }
    });
  }

  toggleSummary(): void {
    this.isSummaryVisible = !this.isSummaryVisible;
  }
}
