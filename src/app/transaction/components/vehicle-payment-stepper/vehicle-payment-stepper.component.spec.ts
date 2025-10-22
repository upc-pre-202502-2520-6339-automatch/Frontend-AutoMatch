import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclePaymentStepperComponent } from './vehicle-payment-stepper.component';

describe('VehiclePaymentStepperComponent', () => {
  let component: VehiclePaymentStepperComponent;
  let fixture: ComponentFixture<VehiclePaymentStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehiclePaymentStepperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclePaymentStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
