import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SalesFacade } from '../../application/sales.facade';
import { VehicleFacade } from '../../../cars/application/vehicle-facade';
import { Vehicle } from '../../../cars/domain/models/vehicle.model';
import { CurrencyPipe, DecimalPipe, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css'],
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, MatButton, NgIf]
})
export class CarDetailsComponent implements OnInit {

  vehicle: Vehicle | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleFacade: VehicleFacade,
    private salesFacade: SalesFacade,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.router.navigate(['/']);
      return;
    }

    const vehicleId = Number(idParam);

    this.loading = true;
    this.vehicleFacade.getById(vehicleId).subscribe({
      next: vehicle => {
        this.vehicle = vehicle;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error loading vehicle details', 'Close', { duration: 3000 });
        this.router.navigate(['/']);
      }
    });
  }

  onReserveOrBuy(): void {
    if (!this.vehicle) return;

    this.salesFacade.createSaleForVehicle(this.vehicle.id).subscribe({
      next: sale => {
        this.snackBar.open(
          'Vehicle reserved. You have 30 minutes to complete the payment.',
          'Close',
          { duration: 4000 }
        );
        this.router.navigate(['/my-purchases']);
      },
      error: (err) => {
        const msg =
          err?.error?.message ||
          'Could not create sale. Maybe the vehicle is no longer available.';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
  }

  openChatWithSeller(): void {
    if (!this.vehicle) {
      console.error('[CarDetails] vehicle is null');
      return;
    }

    // 👇 Ajusta estos campos según tu modelo Vehicle
    const sellerId =
      (this.vehicle as any).sellerId ??
      (this.vehicle as any).ownerId;

    if (!sellerId) {
      console.error('[CarDetails] No sellerId/ownerId in vehicle');
      return;
    }

    const conversationId =
      (this.vehicle as any).conversationId ??
      this.vehicle.id; // por ahora usamos id del vehículo

    this.router.navigate(['/messages', conversationId], {
      queryParams: { receiverId: sellerId }
    });
  }
}
