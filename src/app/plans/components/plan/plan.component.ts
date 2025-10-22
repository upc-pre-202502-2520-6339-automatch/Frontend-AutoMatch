import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from "../../service/plan.service";

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent {
  plans = [
    {
      name: 'BASIC_PLAN',
      price: 179,
      features: [
        'ACCESS_LISTINGS',
        'CUSTOMER_SUPPORT',
        'VISIBILITY_ADS',
        'NO_24_7_SUPPORT',
        'NO_DISCOUNTS_FEATURED',
        'NO_ADV_TECH_REVIEW',
        'NO_COMMISSION_DISCOUNT'
      ]
    },
    {
      name: 'STANDARD_PLAN',
      price: 229,
      features: [
        'ACCESS_LISTINGS',
        'CUSTOMER_SUPPORT',
        'VISIBILITY_ADS',
        'DISCOUNTS_FEATURED',
        'ADV_TECH_REVIEW',
        'NO_24_7_SUPPORT',
        'NO_COMMISSION_DISCOUNT'
      ]
    },
    {
      name: 'PREMIUM_PLAN',
      price: 259,
      features: [
        'ACCESS_LISTINGS',
        'CUSTOMER_SUPPORT',
        'SUPPORT_24_7',
        'VISIBILITY_ADS',
        'DISCOUNTS_FEATURED',
        'ADV_TECH_REVIEW',
        'COMMISSION_DISCOUNT'
      ]
    }
  ];

  constructor(private router: Router, private planService: PlanService) {}

  selectPlan(plan: any) {
    this.planService.setPlan(plan);
    this.router.navigate(['/payment-form']);
  }
}