import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Profile, ProfileService} from '../../../profiles/services/profile.service';
import { VehicleApiService } from '../../../cars/services/vehicle/vehicle-api.service';
import { PaymentsApiService } from '../../services/payments-api.service';
import { PaymentMethodView, PaymentProcessRequest } from '../../models/payment.models';

@Component({
  selector: 'app-vehicle-payment-stepper',
  templateUrl: './vehicle-payment-stepper.component.html',
  styleUrls: ['./vehicle-payment-stepper.component.css'],
})
export class VehiclePaymentStepperComponent implements OnInit {
  currentStep = 1;
  isLoading = false;

  userData: {
    name?: string;
    email?: string;
    telephone?: string;
    dni?: string;
  } = {};
  vehicleData: any = {};
  sellerData: any = {}; // si quieres mostrarlo en el resumen
  paymentMethods: PaymentMethodView[] = [];
  selectedPaymentMethod: PaymentMethodView | null = null;

  constructor(
    private vehicleApiService: VehicleApiService,
    private profileService: ProfileService,
    private paymentsApi: PaymentsApiService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadVehicleData();
    this.loadMyPaymentMethods();
  }

  loadUserProfile(): void {
    this.profileService.getMyProfile().subscribe({
      next: (profile: Profile) => {
        this.userData = {
          name: `${profile.firstName} ${profile.lastName}`,
          email: profile.email,
          telephone: profile.phoneNumber,
          // de momento no tienes dni en el Profile, lo dejamos vacío o 'N/A'
          dni: ''
        };
      },
      error: (err) => {
        console.error('Error cargando el perfil', err);
        // si quieres, podrías mostrar un toast o dejar valores por defecto
      }
    });
  }


  loadVehicleData() {
    const vehicleId = Number(this.route.snapshot.paramMap.get('vehicleId'));
    if (!vehicleId) {
      this.snackBar.open('Vehicle ID not found.', 'Close', { duration: 3000 });
      return;
    }

    this.vehicleApiService.getById(vehicleId).subscribe({
      next: (vehicle) => {
        this.vehicleData = vehicle;
        // si quieres, puedes seguir cargando sellerData usando profileId
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error loading vehicle data.', 'Close', { duration: 3000 });
      }
    });
  }

  loadMyPaymentMethods() {
    this.paymentsApi.getMyPaymentMethods().subscribe({
      next: (methods) => {
        this.paymentMethods = methods;
        this.selectedPaymentMethod = methods.find(m => m.isDefault) || null;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error loading payment methods.', 'Close', { duration: 3000 });
      }
    });
  }

  nextStep() {
    if (this.currentStep === 2 && !this.selectedPaymentMethod) {
      this.snackBar.open('Please select a payment method.', 'Close', { duration: 3000 });
      return;
    }

    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1 && !this.isLoading) {
      this.currentStep--;
    }
  }

  confirmPayment() {
    if (!this.selectedPaymentMethod) {
      this.snackBar.open('Please select a payment method.', 'Close', { duration: 3000 });
      return;
    }

    const vehicleId = this.vehicleData.id;
    const amount = this.vehicleData.priceAmount;   // ✅ viene de VehicleResource
    const currency = this.vehicleData.priceCurrency ?? 'PEN';

    const body: PaymentProcessRequest = {
      requestId: `PAY-${crypto.randomUUID()}`,
      orderId: String(vehicleId),
      paymentMethodToken: this.selectedPaymentMethod.paymentMethodToken,
      currency: currency,
      amount: amount,
      // si quieres luego agregamos ipAddress y cardFingerprint
    };

    this.isLoading = true;
    this.paymentsApi.processPayment(body).subscribe({
      next: (resp) => {
        this.isLoading = false;
        if (resp.status === 'CAPTURED') {
          this.snackBar.open('Payment successful!', 'Close', { duration: 3000 });
          this.router.navigate(['/my-purchases']);
        } else {
          this.snackBar.open(`Payment status: ${resp.status}`, 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        this.snackBar.open('Error processing payment.', 'Close', { duration: 3000 });
      }
    });
  }

  getProgressWidth() {
    return `${((this.currentStep - 1) / 2) * 100}%`;
  }
}
