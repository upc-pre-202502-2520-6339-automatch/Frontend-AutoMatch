import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MechanicRevisionComponent } from './mechanic-revision.component';

describe('MechanicRevisionComponent', () => {
  let component: MechanicRevisionComponent;
  let fixture: ComponentFixture<MechanicRevisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MechanicRevisionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MechanicRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
