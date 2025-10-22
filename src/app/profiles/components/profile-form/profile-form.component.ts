import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of, forkJoin, switchMap, tap, catchError } from "rxjs";
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from "../../../../environments/environment";
import { AuthenticationService } from "../../../register/services/authentication.service";
import { SubscriptionService } from "../../../plans/service/subscription.service";

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent {
  isProfileCreated = false;
  photoPreview: string | ArrayBuffer | null = null;
  userRole = localStorage.getItem('userRole');
  isFormValid = false;
  private baseURL = environment.apiUrl;

  profile = {
    firstName: '',
    lastName: '',
    email: '',
    image: '',
    dni: '',
    address: '',
    phone: '',
    paymentMethods: [{ type: '', details: '' }]
  };

  banks = ['BBVA', 'BCP', 'Scotiabank', 'Interbank', 'Banco de la Nación'];

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private subscriptionService: SubscriptionService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  triggerFileInput(): void {
    const fileInput = document.getElementById('newImages') as HTMLInputElement;
    fileInput?.click();
  }

      onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (!input?.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.photoPreview = reader.result;
      this.checkFormValidity();
    };

    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.photoPreview = null;
    const fileInput = document.getElementById('newImages') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    this.checkFormValidity();
  }

  onSubmit(): void {
    const { paymentMethods, ...profileData } = this.profile;

    this.addProfile(profileData).subscribe({
      next: () => {
        this.snackBar.open('Profile created or updated successfully', 'Close', { duration: 3000 });
        this.isProfileCreated = true;

        if (paymentMethods.length > 0) {
          this.addPaymentMethods(paymentMethods).subscribe(() => {
            this.userRole === 'ROLE_SELLER'
              ? this.checkAndRedirectBasedOnSubscription()
              : this.router.navigate(['/home']);
          });
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: () => {
        this.snackBar.open('Error creating or updating profile', 'Close', { duration: 3000 });
        this.router.navigate(['/error']);
      }
    });
  }

  addProfile(profileRequest: any): Observable<any> {
    return this.authService.getToken().pipe(
      switchMap(token => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })
        };
        return this.http.post<any>(`${this.baseURL}/profiles`, profileRequest, httpOptions);
      }),
      catchError(() => {
        this.snackBar.open('Error creating profile', 'Close', { duration: 3000 });
        return of(null);
      })
    );
  }

  addPaymentMethods(paymentMethods: any[]): Observable<any> {
    return this.authService.getToken().pipe(
      switchMap(token => {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })
        };
        const addMethods$ = paymentMethods.map(method =>
          this.http.put<any>(`${this.baseURL}/profiles/me/payment-methods/add`, method, httpOptions)
        );
        return forkJoin(addMethods$);
      }),
      catchError(() => {
        this.snackBar.open('Error adding payment methods', 'Close', { duration: 3000 });
        return of(null);
      })
    );
  }

  checkFormValidity(): void {
    const profileValid = !!(
      this.profile.firstName &&
      this.profile.lastName &&
      this.profile.email &&
      this.profile.dni &&
      this.profile.address &&
      this.profile.phone &&
      this.photoPreview
    );

    const paymentValid = this.profile.paymentMethods.every(
      method => method.type && /^[0-9]{12,16}$/.test(method.details)
    );

    this.isFormValid = profileValid && (this.userRole !== 'ROLE_SELLER' || paymentValid);
  }

  addPaymentMethod(): void {
    if (this.profile.paymentMethods.length >= 3) {
      this.snackBar.open('You can only add up to 3 payment methods', 'Close', { duration: 3000 });
      return;
    }
    this.profile.paymentMethods.push({ type: '', details: '' });
    this.checkFormValidity();
  }

  removePaymentMethod(index: number): void {
    this.profile.paymentMethods.splice(index, 1);
    this.checkFormValidity();
  }

  private checkAndRedirectBasedOnSubscription(): void {
    this.subscriptionService.getMySubscription().subscribe({
      next: subscription => {
        if (subscription?.status === 'PAID') this.router.navigate(['/home']);
        else this.router.navigate(['/plan']);
      },
      error: () => this.router.navigate(['/plan'])
    });
  }
}