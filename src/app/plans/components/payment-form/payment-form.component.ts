import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from '../../service/plan.service';
import { SubscriptionService } from '../../service/subscription.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css'],
})
export class PaymentFormComponent implements OnInit {
  selectedPlan: any;
  isSummaryVisible: boolean = false;

  constructor(
    private planService: PlanService,
    private subscriptionService: SubscriptionService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.selectedPlan = this.planService.getPlan();
  }

  onSubmit(): void {
    this.subscriptionService.getMySubscription().subscribe(
      (subscription) => {
        if (subscription && subscription.status === 'PAID') {
          this.snackBar.open('You already have an active subscription.', 'Close', { duration: 3000 });
          this.router.navigate(['/profile']);
        } else {
          this.createNewSubscription();
        }
      },
      (error) => {
        if (error.status === 404) {
          this.createNewSubscription();
        } else {
          this.snackBar.open('Choose a plan first', 'Close', { duration: 3000 });
        }
      }
    );
  }

  private createNewSubscription(): void {
    const subscriptionData = {
      price: this.selectedPlan.price,
      description: this.selectedPlan.name,
    };

    this.subscriptionService.createSubscription(subscriptionData).subscribe(
      () => {
        this.snackBar.open('Subscription created successfully.', 'Close', { duration: 3000 });
        this.router.navigate(['/profile']);
      },
      (error) => {
        this.snackBar.open('Error processing subscription.', 'Close', { duration: 3000 });
      }
    );
  }

  toggleSummary(): void {
    this.isSummaryVisible = !this.isSummaryVisible;
    const summary = document.querySelector('.summary-column');
    if (summary) {
      summary.classList.toggle('active');
    }
  }
}