import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private selectedPlan: any;

  setPlan(plan: any) {
    this.selectedPlan = plan;
  }

  getPlan() {
    return this.selectedPlan;
  }
}