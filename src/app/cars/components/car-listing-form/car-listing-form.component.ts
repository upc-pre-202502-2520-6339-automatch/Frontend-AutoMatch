import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { VehicleFacade } from '../../application/vehicle-facade';
import { CreateVehicleRequest } from '../../services/vehicle/vehicle-api.service';
import { Vehicle } from '../../domain/models/vehicle.model';
import { ProfileFacade } from '../../../profiles/application/profile-facade.service';
import { Profile } from '../../../profiles/services/profile.service';

type CarFieldConfig = {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  select?: boolean;
  textarea?: boolean;
  options?: { value: string; label: string }[];
};

@Component({
  selector: 'app-car-listing-form',
  templateUrl: './car-listing-form.component.html',
  styleUrls: ['./car-listing-form.component.css']
})
export class CarListingFormComponent implements OnInit {
  @Output() formClosed = new EventEmitter<void>();
  @Output() carAdded = new EventEmitter<Vehicle>();

  carForm!: FormGroup;

  // 👇 fotos
  photos: File[] = [];
  photoPreviews: string[] = [];
  showPreviewModal = false;
  previewImageIndex = 0;
  defaultImage = 'assets/default_image.jpg';

  // 👇 config para el *ngFor="let field of carFields"
  carFields: CarFieldConfig[] = [
    { name: 'brand',  label: 'BRAND',  placeholder: 'BRAND_PLACEHOLDER' },
    { name: 'model',  label: 'MODEL',  placeholder: 'MODEL_PLACEHOLDER' },
    { name: 'color',  label: 'COLOR',  placeholder: 'COLOR_PLACEHOLDER' },
    { name: 'year',   label: 'YEAR',   placeholder: 'YEAR_PLACEHOLDER', type: 'number' },
    {
      name: 'priceCurrency',
      label: 'CURRENCY',
      select: true,
      options: [
        { value: 'PEN', label: 'CURRENCY_PEN' },
        { value: 'USD', label: 'CURRENCY_USD' }
      ]
    },
    { name: 'vin',          label: 'VIN',          placeholder: 'VIN_PLACEHOLDER' },
    { name: 'transmission', label: 'TRANSMISSION', placeholder: 'TRANSMISSION_PLACEHOLDER' },
    { name: 'engine',       label: 'ENGINE',       placeholder: 'ENGINE_PLACEHOLDER' },
    { name: 'mileage',      label: 'MILEAGE',      placeholder: 'MILEAGE_PLACEHOLDER', type: 'number' },
    { name: 'doors',        label: 'DOORS',        placeholder: 'DOORS_PLACEHOLDER', type: 'number' },
    { name: 'plate',        label: 'PLATE',        placeholder: 'PLATE_PLACEHOLDER' },
    { name: 'location',     label: 'LOCATION',     placeholder: 'LOCATION_PLACEHOLDER' },
    { name: 'fuel',         label: 'FUEL',         placeholder: 'FUEL_PLACEHOLDER' },
    { name: 'speed',        label: 'SPEED',        placeholder: 'SPEED_PLACEHOLDER', type: 'number' },
    {
      name: 'description',
      label: 'DESCRIPTION',
      placeholder: 'DESCRIPTION_PLACEHOLDER',
      textarea: true
    }
  ];

  constructor(
    private vehicleFacade: VehicleFacade,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private profileFacade: ProfileFacade
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadProfileData();
  }

  // ------------------- FORM -------------------

  private buildForm(): void {
    this.carForm = this.fb.group({
      name: [{ value: '', disabled: true }, Validators.required],
      phone: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      color: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      price: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      priceCurrency: ['PEN', Validators.required],
      vin: ['', Validators.required],
      transmission: ['', Validators.required],
      engine: ['', Validators.required],
      mileage: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      doors: ['', Validators.required],
      plate: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      image: [this.defaultImage],
      fuel: ['', Validators.required],
      speed: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });
  }

  private loadProfileData(): void {
    this.profileFacade.loadMyProfile().subscribe({
      next: (data: Profile | null) => {
        this.carForm.patchValue({
          name: data?.firstName ?? '',
          phone: data?.phoneNumber ?? '',
          email: data?.email ?? ''
        });
      },
      error: () => this.snackBar.open('Error fetching profile data', 'Close', { duration: 3000 })
    });
  }

  // ------------------- FOTOS -------------------

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    Array.from(input.files).forEach(file => {
      this.photos.push(file);

      const reader = new FileReader();
      reader.onload = e => {
        this.photoPreviews.push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.photoPreviews, event.previousIndex, event.currentIndex);
    moveItemInArray(this.photos, event.previousIndex, event.currentIndex);
  }

  removeImage(index: number): void {
    this.photoPreviews.splice(index, 1);
    this.photos.splice(index, 1);
  }

  openPreviewModal(index: number): void {
    this.previewImageIndex = index;
    this.showPreviewModal = true;
  }

  closePreviewModal(): void {
    this.showPreviewModal = false;
  }

  openPublicationPreview(): void {
    // para ahora, simplemente abre el modal empezando en la primera imagen
    this.previewImageIndex = 0;
    this.showPreviewModal = true;
  }

  prevPreviewImage(): void {
    if (!this.photoPreviews.length) return;
    this.previewImageIndex =
      (this.previewImageIndex - 1 + this.photoPreviews.length) % this.photoPreviews.length;
  }

  nextPreviewImage(): void {
    if (!this.photoPreviews.length) return;
    this.previewImageIndex =
      (this.previewImageIndex + 1) % this.photoPreviews.length;
  }

  // si no quieres zoom de verdad, puedes dejar estos como no-op
  toggleZoom(_event: MouseEvent): void {
    // aquí podrías añadir/eliminar una clase CSS 'zoomed' si quisieras
  }

  moveZoom(_event: MouseEvent): void {
    // sin lógica por ahora
  }

  // ------------------- SUBMIT -------------------

  onSubmit(): void {
    if (this.carForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly.', 'Close', { duration: 3000 });
      return;
    }

    const formValue = this.carForm.getRawValue();

    const rawPreview = this.photoPreviews[0];
    let mainImageUrl: string | null = null;
    if (rawPreview && rawPreview.startsWith('http')) {
      mainImageUrl = rawPreview;
    } else {
      mainImageUrl = null;
    }

    const payload: CreateVehicleRequest = {
      plate: formValue.plate,
      vin: formValue.vin,
      brand: formValue.brand,
      model: formValue.model,
      year: Number(formValue.year),
      mileageKm: Number(formValue.mileage),
      priceAmount: Number(formValue.price),
      priceCurrency: formValue.priceCurrency,
      mainImageUrl
    };

    this.vehicleFacade.createVehicle(payload).subscribe({
      next: vehicle => {
        this.snackBar.open('Car added successfully!', 'Close', { duration: 3000 });
        this.carAdded.emit(vehicle);
        this.formClosed.emit();
        this.router.navigate(['/my-cars']);
      },
      error: () => {
        this.snackBar.open('Error adding car', 'Close', { duration: 3000 });
      }
    });
  }
}
