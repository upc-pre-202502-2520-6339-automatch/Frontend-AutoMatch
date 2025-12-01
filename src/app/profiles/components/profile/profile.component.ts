import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { catchError, forkJoin, of, switchMap, tap } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { VehicleFacade } from '../../../cars/application/vehicle-facade';

// IAM + Profiles
import { AuthenticationService } from '../../../register/services/authentication.service';
import {
  ProfileService,
  Profile,
  UpdateProfileRequest,
  RoleType
} from '../../services/profile.service';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// ngx-translate (para el pipe translate del HTML)
import { TranslateModule } from '@ngx-translate/core';

interface PaymentMethod {
  id: number;
  type: string;
  details: string;
  markedForDeletion?: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    // Material
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    // i18n
    TranslateModule
  ]
})
export class ProfileComponent implements OnInit {

  currentRole: string = 'USER';     // ROLE_SELLER / ROLE_BUYER / ROLE_MECHANIC / User
  profile: Profile | null = null; // objeto real del BC Profiles

  userData: any = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phone: '',
    dni: '',
    image: '',
    paymentMethods: [] as PaymentMethod[]
  };

  recentFavorites: any[] = [];
  recentReviews: any[] = [];
  subscriptionData: any = null;

  tempUserData: any = {};
  editMode: boolean = false;
  imagePreview: string | ArrayBuffer | null = null;
  loading: boolean = true;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private http: HttpClient,
    private vehicleFacade: VehicleFacade,
    private authService: AuthenticationService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    // 1) Roles desde IAM (JWT)
    this.authService.roles$.subscribe(roles => {
      this.currentRole = this.resolveCurrentRole(roles);
    });

    // 2) Cargar perfil + data dependiente de rol
    this.loadProfileData();
  }

  // ==================== HELPERS DE ROL ====================

  private resolveCurrentRole(roles: string[] | null | undefined): string {
    if (!roles || roles.length === 0) return 'USER';
    if (roles.includes('SELLER')) return 'SELLER';
    if (roles.includes('MECHANIC')) return 'MECHANIC';
    if (roles.includes('BUYER')) return 'BUYER';
    return 'USER';
  }

  getRoleDisplayName(role: string): string {
    switch (role) {
      case 'SELLER':   return 'Seller';
      case 'MECHANIC': return 'Mechanic';
      case 'BUYER':    return 'Buyer';
      default:         return 'User';
    }
  }


  private mapCurrentRoleToRoleType(role: string | null | undefined): RoleType | undefined {
    if (!role) return undefined;
    if (role === 'SELLER') return 'SELLER';
    if (role === 'BUYER')  return 'BUYER';
    return undefined; // MECHANIC no tiene profile en BC Profiles
  }

  // ==================== MAPEO PROFILE → userData ====================

  private mapProfileToUserData(profile: Profile): void {
    this.userData.firstName = profile.firstName;
    this.userData.lastName  = profile.lastName;
    this.userData.email     = profile.email;
    this.userData.phone     = profile.phoneNumber;
    this.userData.address   = profile.sellerProfile?.address || '';
    this.userData.dni       = this.userData.dni || '';   // por ahora BC Profiles no maneja DNI
    this.userData.image     = '';                        // tampoco imagen aún
    this.userData.paymentMethods = [];                   // payment irá a otro BC
  }

  // ==================== CARGA INICIAL ====================

  loadProfileData(): void {
    this.loading = true;

    // 1) Perfil desde Profiles
    const profile$ = this.profileService.getMyProfile().pipe(
      tap(profile => {
        this.profile = profile;
        this.mapProfileToUserData(profile);
        this.imagePreview = 'assets/default-profile.png';
      }),
      catchError(err => {
        this.snackBar.open('Error fetching profile data', 'Close', { duration: 3000 });
        return of(null);
      })
    );

    // 2) Suscripción (subscription-service via gateway)
    const subscription$ = this.http.get<any>(`${environment.apiUrl}/subscription/me`).pipe(
      tap(sub => this.subscriptionData = sub),
      catchError(() => of(null))
    );

    profile$
      .pipe(
        switchMap(() => subscription$),
        switchMap(() => {
          // 3) Según rol, cargar favoritos o reviews
          if (this.currentRole === 'MECHANIC') {
            return this.http.get<any[]>(`${environment.apiUrl}/reviews/me`).pipe(
              switchMap(reviews => {
                if (!reviews || reviews.length === 0) {
                  this.recentReviews = [];
                  return of([]);
                }

                this.recentReviews = reviews.slice(-3).reverse().map(review => ({
                  ...review,
                  vehicleImage: ''
                }));

                const vehicleImageRequests = this.recentReviews.map((review, index) =>
                  this.vehicleFacade.getById(review.vehicle.id).pipe(
                    tap(vehicle => {
                      // en tu BC de vehículos la imagen principal está en mainImageUrl
                      this.recentReviews[index].vehicleImage = vehicle.mainImageUrl || '';
                    }),
                    catchError(() => of(null))
                  )
                );

                return forkJoin(vehicleImageRequests);
              }),
              catchError(() => of([]))
            );
          }

          if (this.currentRole === 'BUYER') {
            return this.http.get<any[]>(`${environment.apiUrl}/favorites/my-favorites`).pipe(
              tap(favorites => {
                if (favorites && favorites.length > 0) {
                  this.recentFavorites = favorites.slice(-3).reverse();
                }
              }),
              catchError(() => {
                this.snackBar.open('Error fetching favorites', 'Close', { duration: 3000 });
                return of([]);
              })
            );
          }

          return of([]);
        })
      )
      .subscribe({
        next: () => {
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Error loading profile data', 'Close', { duration: 3000 });
        }
      });
  }

  // ==================== NAVEGACIÓN ====================

  navigateToCarDetails(vehicleId: number): void {
    this.router.navigate(['/car-details', vehicleId]);
  }

  // ==================== EDICIÓN BÁSICA ====================

  toggleEditMode(): void {
    if (this.editMode) {
      // cancelar cambios
      this.userData = { ...this.tempUserData };
    } else {
      // entrar en modo edición
      this.tempUserData = { ...this.userData };
    }
    this.editMode = !this.editMode;
  }

  // 🔹 Métodos usados en el HTML para payment methods (aunque aún no pegues backend de Payments)
  handleAddPaymentClick(): void {
    const active = this.userData.paymentMethods
      .filter((m: PaymentMethod) => !m.markedForDeletion).length;

    if (active >= 3) {
      this.snackBar.open('Only 3 active payment methods are allowed', 'Close', { duration: 3000 });
    } else {
      this.addNewPaymentMethod();
    }
  }

  private addNewPaymentMethod(): void {
    this.userData.paymentMethods.push({
      id: 0,
      type: '',
      details: '',
      markedForDeletion: false
    });
  }

  markForDeletion(index: number): void {
    if (this.userData.paymentMethods[index]) {
      this.userData.paymentMethods[index].markedForDeletion = true;
    }
  }

  onSave(): void {
    if (!this.profile) {
      this.snackBar.open('Profile not loaded', 'Close', { duration: 3000 });
      return;
    }

    this.loading = true;

    const payload: UpdateProfileRequest = {
      firstName:    this.userData.firstName,
      lastName:     this.userData.lastName,
      email:        this.userData.email,
      phoneNumber:  this.userData.phone,
      roleType:     this.mapCurrentRoleToRoleType(this.currentRole),
      address:      this.currentRole === 'SELLER' ? this.userData.address : undefined
      // ruc, businessType, businessName: los dejamos undefined para no tocarlos aquí
    };

    this.profileService.updateProfile(this.profile.id, payload).subscribe({
      next: updated => {
        this.profile = updated;
        this.mapProfileToUserData(updated);
        this.snackBar.open('Profile saved successfully', 'Close', { duration: 3000 });
        this.editMode = false;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.snackBar.open(
          err.error?.message || 'Error saving profile',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }
}
