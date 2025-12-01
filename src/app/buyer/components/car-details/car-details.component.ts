import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SalesFacade } from '../../application/sales.facade';
import { VehicleFacade } from '../../../cars/application/vehicle-facade';
import { Vehicle } from '../../../cars/domain/models/vehicle.model';
import {CurrencyPipe, DecimalPipe, NgClass, NgIf, TitleCasePipe} from '@angular/common';
import { MatButton } from '@angular/material/button';
import { AuthenticationService } from '../../../register/services/authentication.service';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css'],
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, MatButton, NgIf, TitleCasePipe, NgClass]
})
export class CarDetailsComponent implements OnInit {

  vehicle: Vehicle | null = null;
  loading = false;
  error: string | null = null;

  // info de IAM
  currentUserId: number | null = null;
  currentRoles: string[] = [];

  // permisos de UI
  canReserveOrBuy = false;
  canPublish = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleFacade: VehicleFacade,
    private salesFacade: SalesFacade,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.router.navigate(['/']);
      return;
    }
    const vehicleId = Number(idParam);

    // 1) Leer el userId desde localStorage (lo guarda AuthenticationService al hacer sign-in)
    const storedId = localStorage.getItem('automatch_user_id');
    this.currentUserId = storedId ? Number(storedId) : null;

    // 2) Suscribirse solo a los roles desde IAM
    this.authService.roles$.subscribe(roles => {
      this.currentRoles = roles ?? [];
      this.updatePermissions();
    });

    // 3) Cargar vehículo
    this.loading = true;
    this.vehicleFacade.getById(vehicleId).subscribe({
      next: vehicle => {
        this.vehicle = vehicle;
        this.loading = false;
        this.updatePermissions();
      },
      error: () => {
        this.snackBar.open('Error loading vehicle details', 'Close', { duration: 3000 });
        this.router.navigate(['/']);
      }
    });
  }


  /** Calcula qué botones mostrar según rol, dueño y estado del vehículo */
  private updatePermissions(): void {
    if (!this.vehicle || this.currentUserId == null) {
      this.canReserveOrBuy = false;
      this.canPublish = false;
      return;
    }

    const sellerId =
      (this.vehicle as any).sellerId ??
      (this.vehicle as any).ownerId;

    const isOwner  = sellerId === this.currentUserId;
    const isBuyer  = this.currentRoles.includes('BUYER');
    const isSeller = this.currentRoles.includes('SELLER');

    const status = (this.vehicle as any).status;

    // 👇 ajusta 'PUBLISHED' si tu enum se llama distinto
    this.canReserveOrBuy = isBuyer && !isOwner && status === 'AVAILABLE';

    // seller dueño del auto + UNDER_REVIEW => puede publicarlo
    this.canPublish = isSeller && isOwner && status === 'UNDER_REVIEW';
  }

  onReserveOrBuy(): void {
    if (!this.vehicle || !this.canReserveOrBuy) return;

    this.salesFacade.createSaleForVehicle(this.vehicle.id).subscribe({
      next: () => {
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
    if (!this.vehicle || !this.canReserveOrBuy) return;

    const sellerId =
      (this.vehicle as any).sellerId ??
      (this.vehicle as any).ownerId;

    if (!sellerId) {
      console.error('[CarDetails] No sellerId/ownerId in vehicle');
      return;
    }

    const conversationId =
      (this.vehicle as any).conversationId ?? this.vehicle.id;

    this.router.navigate(['/messages', conversationId], {
      queryParams: { receiverId: sellerId }
    });
  }

  /** Seller publica el anuncio / lo pone disponible */
  onPublishListing(): void {
    if (!this.vehicle || !this.canPublish) return;

    this.loading = true;

    // 👇 ajusta 'PUBLISHED' por 'AVAILABLE' si tu backend usa otro valor
    this.vehicleFacade.updateStatus(this.vehicle.id, 'AVAILABLE').subscribe({
      next: updated => {
        this.vehicle = updated;
        this.loading = false;
        this.snackBar.open('Listing published successfully.', 'Close', { duration: 3000 });
        this.updatePermissions();
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message || 'Could not update vehicle status.';
        this.snackBar.open(msg, 'Close', { duration: 4000 });
      }
    });
  }
}
