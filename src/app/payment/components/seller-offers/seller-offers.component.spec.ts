import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerOffersComponent } from './seller-offers.component';

describe('SellerOffersComponent', () => {
  let component: SellerOffersComponent;
  let fixture: ComponentFixture<SellerOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SellerOffersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
