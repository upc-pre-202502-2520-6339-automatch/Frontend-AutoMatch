// src/app/profiles/components/profile-form/profile-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ProfileService,
  Profile,
  UpdateProfileRequest,
  RoleType,
  BusinessType
} from '../../services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent implements OnInit {

  form!: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  currentProfile: Profile | null = null;

  roleTypes: RoleType[] = ['BUYER', 'SELLER'];
  businessTypes: BusinessType[] = ['DEALERSHIP', 'SHOP', 'WORKSHOP'];

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();

    this.loading = true;
    this.profileService.getMyProfile().subscribe({
      next: profile => {
        this.loading = false;
        this.currentProfile = profile;
        this.patchForm(profile);
      },
      error: err => {
        this.loading = false;
        if (err.status === 404) {
          // Usuario sin perfil (caso extremo si Kafka está apagado)
          this.currentProfile = null;
        } else {
          this.errorMessage = 'Error al cargar el perfil';
        }
      }
    });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],

      roleType: ['BUYER'], // valor por defecto

      // Campos de vendedor
      ruc: [''],
      businessType: ['SHOP'],
      businessName: [''],
      address: ['']
    });
  }

  private patchForm(profile: Profile): void {
    this.form.patchValue({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      roleType: profile.roleType,
      ruc: profile.sellerProfile?.ruc ?? '',
      businessType: profile.sellerProfile?.businessType ?? 'SHOP',
      businessName: profile.sellerProfile?.businessName ?? '',
      address: profile.sellerProfile?.address ?? ''
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const formValue = this.form.value;

    // Construimos el UpdateProfileRequest
    const payload: UpdateProfileRequest = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      roleType: formValue.roleType,
      ruc: formValue.roleType === 'SELLER' ? formValue.ruc : null,
      businessType: formValue.roleType === 'SELLER' ? formValue.businessType : null,
      businessName: formValue.roleType === 'SELLER' ? formValue.businessName : null,
      address: formValue.roleType === 'SELLER' ? formValue.address : null
    };

    // Si ya tengo un perfil => PUT /api/profiles/{id}
    if (this.currentProfile?.id) {
      this.profileService.updateProfile(this.currentProfile.id, payload).subscribe({
        next: updated => {
          this.loading = false;
          // Cache global también se actualiza por el tap() del servicio
          this.router.navigate(['/profile']).then();
        },
        error: err => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Error al actualizar el perfil';
        }
      });
    } else {
      // Caso extremo: no hay perfil creado.
      // Puedes decidir si creas siempre como BUYER aquí o según roleType
      // Ejemplo simple: si SELLER -> createSellerProfile, si no -> createCustomerProfile
      if (formValue.roleType === 'SELLER') {
        this.profileService.createSellerProfile({
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          email: formValue.email,
          ruc: formValue.ruc,
          businessType: formValue.businessType,
          businessName: formValue.businessName,
          address: formValue.address,
          phoneNumber: formValue.phoneNumber
        }).subscribe({
          next: created => {
            this.loading = false;
            this.router.navigate(['/profile']).then();
          },
          error: err => {
            this.loading = false;
            this.errorMessage = err.error?.message || 'Error al crear el perfil de vendedor';
          }
        });
      } else {
        this.profileService.createCustomerProfile({
          firstName: formValue.firstName,
          lastName: formValue.lastName,
          email: formValue.email,
          phoneNumber: formValue.phoneNumber
        }).subscribe({
          next: created => {
            this.loading = false;
            this.router.navigate(['/profile']).then();
          },
          error: err => {
            this.loading = false;
            this.errorMessage = err.error?.message || 'Error al crear el perfil de cliente';
          }
        });
      }
    }
  }
}
