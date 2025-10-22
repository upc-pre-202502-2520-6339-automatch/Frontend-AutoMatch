import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalReviewComponent } from './technical-review.component';

describe('TechnicalReviewComponent', () => {
  let component: TechnicalReviewComponent;
  let fixture: ComponentFixture<TechnicalReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechnicalReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
