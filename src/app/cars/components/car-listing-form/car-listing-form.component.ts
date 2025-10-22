import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CarFacade } from '../../application/car.facade';
import { Car } from '../../domain/models/car.model';

@Component({
  selector: 'app-car-listing-form',
  templateUrl: './car-listing-form.component.html',
  styleUrls: ['./car-listing-form.component.css']
})
export class CarListingFormComponent implements OnInit {
  @Output() formClosed = new EventEmitter<void>();
  @Output() carAdded = new EventEmitter<Car>();

  carForm!: FormGroup;
  photos: File[] = [];
  photoPreviews: string[] = [];
  showPreviewModal = false;
  showPublicationModal = false;
  currentImageIndex = 0;
  previewImageIndex = 0;
  defaultImage = 'assets/default_image.jpg';

  constructor(
    private fb: FormBuilder,
    private facade: CarFacade,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadProfileData();
  }

  /** Construcción del formulario */
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

  /** Carga de datos del perfil */
  private loadProfileData(): void {
    this.facade.loadProfile().subscribe({
      next: (data) => {
        this.carForm.patchValue({
          name: data.firstName ?? '',
          phone: data.phone ?? '',
          email: data.email ?? ''
        });
      },
      error: () => this.snackBar.open('Error fetching profile data', 'Close', { duration: 3000 })
    });
  }

  /** Envío del formulario */
  onSubmit(): void {
    if (this.carForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly.', 'Close', { duration: 3000 });
      return;
    }

    this.carForm.enable();

    const car: Car = {
      ...this.carForm.getRawValue(), // ✅ obtiene valores deshabilitados también
      image: this.photoPreviews[0] || this.defaultImage,
      images: this.photoPreviews.length ? this.photoPreviews : [this.defaultImage],
    };

    this.facade.addCar(car).subscribe({
      next: (response) => {
        this.snackBar.open('Car added successfully!', 'Close', { duration: 3000 });
        this.carAdded.emit(response);
        this.formClosed.emit();
        this.router.navigate(['/my-cars']);
      },
      error: () => this.snackBar.open('Error adding car', 'Close', { duration: 3000 })
    });

    this.carForm.disable();
  }

  /** Manejo de imágenes */
  onFileSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    this.photos.push(...files);
    this.updatePreviews();
  }

  updatePreviews(): void {
    this.photoPreviews = [];
    this.photos.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => this.photoPreviews.push(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number): void {
    this.photos.splice(index, 1);
    this.photoPreviews.splice(index, 1);
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.photoPreviews, event.previousIndex, event.currentIndex);
  }

  /** Manejo del modal de previsualización */
  openPreviewModal(index: number): void {
    this.previewImageIndex = index;
    this.showPreviewModal = true;
  }

  closePreviewModal(): void {
    this.showPreviewModal = false;
  }

  prevPreviewImage(): void {
    if (this.photoPreviews.length) {
      this.previewImageIndex =
        (this.previewImageIndex - 1 + this.photoPreviews.length) % this.photoPreviews.length;
    }
  }

  nextPreviewImage(): void {
    if (this.photoPreviews.length) {
      this.previewImageIndex = (this.previewImageIndex + 1) % this.photoPreviews.length;
    }
  }

  toggleZoom(event: MouseEvent): void {
    const img = event.target as HTMLImageElement;
    img.classList.toggle('zoomed');
  }

  moveZoom(event: MouseEvent): void {
    // función opcional para zoom interactivo
  }

  carFields = [
  { name: 'brand', label: 'BRAND', placeholder: 'BRAND_PLACEHOLDER', type: 'text' },
  { name: 'model', label: 'MODEL', placeholder: 'MODEL_PLACEHOLDER', type: 'text' },
  { name: 'color', label: 'COLOR', placeholder: 'COLOR_PLACEHOLDER', type: 'text' },
  { name: 'year', label: 'YEAR_MANUFACTURE', placeholder: 'YEAR_MANUFACTURE_PLACEHOLDER', type: 'number' },
  {
    name: 'transmission',
    label: 'TRANSMISSION_TYPE',
    select: true,
    options: [
      { value: '', label: 'SELECT_TRANSMISSION' },
      { value: 'Manual', label: 'MANUAL' },
      { value: 'Automatic', label: 'AUTOMATIC' },
      { value: 'Semi-automatic', label: 'SEMI_AUTOMATIC' }
    ]
  },
  { name: 'engine', label: 'ENGINE', placeholder: 'ENGINE_PLACEHOLDER', type: 'text' },
  { name: 'mileage', label: 'MILEAGE', placeholder: 'MILEAGE_PLACEHOLDER', type: 'number' },
  {
    name: 'fuel',
    label: 'FUEL_TYPE',
    select: true,
    options: [
      { value: '', label: 'SELECT_FUEL_TYPE' },
      { value: 'Gasoline', label: 'GASOLINE' },
      { value: 'Diesel', label: 'DIESEL' },
      { value: 'Electric', label: 'ELECTRIC' },
      { value: 'Hybrid', label: 'HYBRID' }
    ]
  },
  { name: 'speed', label: 'SPEED', placeholder: 'SPEED_PLACEHOLDER', type: 'number' },
  {
    name: 'doors',
    label: 'DOORS',
    select: true,
    options: [
      { value: '', label: 'SELECT_DOORS' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
      { value: '5', label: '5' }
    ]
  },
  { name: 'plate', label: 'PLATE', placeholder: 'PLATE_PLACEHOLDER', type: 'text' },
  { name: 'location', label: 'LOCATION', placeholder: 'LOCATION_PLACEHOLDER', type: 'text' },
  { name: 'description', label: 'DESCRIPTION', placeholder: 'DESCRIPTION_PLACEHOLDER', textarea: true }
];


    openPublicationPreview(): void {
    this.showPublicationModal = true;
  }

  closePublicationModal(): void {
    this.showPublicationModal = false;
  }
}