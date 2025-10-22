import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BuyerFacade } from '../../application/buyer.facade';
import { Buyer } from '../../domain/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-send-data',
  templateUrl: './send-data.component.html',
  styleUrls: ['./send-data.component.css']
})
export class SendDataComponent implements OnInit {
  buyer$!: Observable<Buyer | null>;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private facade: BuyerFacade
  ) {}

  ngOnInit(): void {
    this.buyer$ = this.facade.buyer$;

    this.form = this.fb.group({
      phone: ['', [Validators.required, Validators.minLength(6)]],
      dni: ['', [Validators.required, Validators.minLength(8)]],
      location: ['']
    });

    this.facade.loadBuyerAndSeller();

    this.buyer$.subscribe((b: Buyer | null) => {
      if (b) {
        this.form.patchValue({
          phone: b.phone,
          dni: b.dni,
          location: b.location ?? ''
        });
      }
    });
  }

  redirectToPay(): void {
    if (this.form.valid) {
      this.facade.patchBuyer(this.form.getRawValue());
      this.router.navigate(['/pay']);
    }
  }
}