import { Component, OnInit } from '@angular/core';
import { CarService } from '../../../cars/services/car/car.service';
import { ProfileService } from '../../../profiles/services/profile.service';
import { TransactionService } from '../../services/transaction.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-payment-stepper',
  templateUrl: './vehicle-payment-stepper.component.html',
  styleUrls: ['./vehicle-payment-stepper.component.css'],
})
export class VehiclePaymentStepperComponent implements OnInit {
  currentStep = 1;
  isLoading = false;

  userData: any = {};
  sellerData: any = {};
  vehicleData: any = {};
  sellerPaymentMethods: any[] = [];
  selectedPaymentMethod: any = null;

  constructor(
    private carService: CarService,
    private profileService: ProfileService,
    private transactionService: TransactionService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router

  ) {}

  ngOnInit() {
    this.loadUserProfile();
    this.loadVehicleData();
  }

  loadUserProfile() {
  this.profileService.getProfile().subscribe(
    (profile) => {
      console.log('Perfil del usuario cargado:', profile);
      this.userData = {
        name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        telephone: profile.phone_number,
        dni: profile.dni,
      };
    },
    (error) => {
      this.snackBar.open('Error loading user profile.', 'Close', { duration: 3000 });
      console.error(error);
    }
  );
}

  loadVehicleData() {
    const vehicleId = Number(this.route.snapshot.paramMap.get('vehicleId'));
    if (!vehicleId) {
      this.snackBar.open('Vehicle ID not found.', 'Close', { duration: 3000 });
      return;
    }

    this.carService.getCarById(vehicleId).subscribe(
      (vehicle) => {
        this.vehicleData = vehicle;

        const sellerProfileId = vehicle.profileId;
        if (sellerProfileId) {
          this.loadSellerProfile(sellerProfileId);
        } else {
          this.snackBar.open('Seller not found for this vehicle.', 'Close', { duration: 3000 });
        }
      },
      (error) => {
        this.snackBar.open('Error loading vehicle data.', 'Close', { duration: 3000 });
        console.error(error);
      }
    );
  }

  loadSellerProfile(profileId: number) {
  this.profileService.getProfileById(profileId).subscribe(
    (profile) => {
      console.log('Perfil del vendedor cargado:', profile);
      this.sellerData = {
        name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        telephone: profile.phone_number,
        dni: profile.dni,
      };

      if (profile.paymentMethods && profile.paymentMethods.length > 0) {
        this.sellerPaymentMethods = profile.paymentMethods;
      } else {
        this.snackBar.open('Seller has no contact methods configured.', 'Close', { duration: 3000 });
      }
    },
    (error) => {
      this.snackBar.open('Error loading seller profile.', 'Close', { duration: 3000 });
      console.error(error);
    }
  );
}

  nextStep() {
    if (this.currentStep === 2 && !this.selectedPaymentMethod) {
      this.snackBar.open('Please select a contact method.', 'Close', { duration: 3000 });
      return;
    }

    if (this.currentStep === 2) {
      this.simulateProcessing();
    } else if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1 && !this.isLoading) {
      this.currentStep--;
    }
  }

  simulateProcessing() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.currentStep++;
    }, 3000);
  }

  confirmOffer() {
    const offerData = {
      vehicleId: this.vehicleData.id,
      buyer: {
        name: this.userData.name,
        email: this.userData.email,
        phone: this.userData.telephone,
      },
      seller: {
        name: this.sellerData.name,
        email: this.sellerData.email,
        phone: this.sellerData.telephone,
      },
      contactMethod: this.selectedPaymentMethod?.type,
      contactDetails: this.selectedPaymentMethod?.details,
      offerStatus: 'PENDING',
    };

    this.isLoading = true;
    this.transactionService.createTransaction(offerData).subscribe(
      (response) => {
        this.isLoading = false;
        this.snackBar.open('Offer sent successfully.', 'Close', { duration: 3000 });
        this.router.navigate(['/offers']);

      },
      (error) => {
        this.isLoading = false;
        this.snackBar.open('Error sending the offer.', 'Close', { duration: 3000 });
        console.error(error);
      }
    );
  }

  getProgressWidth() {
    return `${((this.currentStep - 1) / 2) * 100}%`;
  }
}
