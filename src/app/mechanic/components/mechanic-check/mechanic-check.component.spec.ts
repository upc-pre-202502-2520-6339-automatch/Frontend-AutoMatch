import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicCheckComponent } from './mechanic-check.component';

describe('MechanicCheckComponent', () => {
  let component: MechanicCheckComponent;
  let fixture: ComponentFixture<MechanicCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MechanicCheckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MechanicCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
