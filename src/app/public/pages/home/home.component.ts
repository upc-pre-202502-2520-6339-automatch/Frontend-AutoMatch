// home.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Vehicle } from '../../../cars/domain/models/vehicle.model';
import { AuthenticationService } from '../../../register/services/authentication.service';
import { VehicleFacade } from '../../../cars/application/vehicle-facade';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  // estado sesión / roles
  isSignedIn = false;
  isSeller = false;
  isBuyer = false;
  isMechanic = false;

  // loader común
  loading = false;

  // datos para las secciones
  cars: Vehicle[] = [];          // catálogo para compradores
  myVehicles: Vehicle[] = [];    // mis autos (seller)
  pendingCars: Vehicle[] = [];   // autos en revisión (mecánico)
  certifiedCars: Vehicle[] = []; // por ahora vacío, luego lo conectas a reviews reales
  reviews: { vehicle: Vehicle; notes: string }[] = [];

  defaultImage = 'assets/images/cars/default-car.png';

  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private vehicleFacade: VehicleFacade,
    private auth: AuthenticationService
  ) {}

  ngOnInit(): void {
    // 1) estado de sesión
    this.subscriptions.add(
      this.auth.isSignedIn$.subscribe(isSigned => {
        this.isSignedIn = isSigned;
      })
    );

    // 2) roles
    this.subscriptions.add(
      this.auth.roles$.subscribe(roles => {
        this.isSeller   = roles.includes('SELLER');
        this.isBuyer    = roles.includes('BUYER');
        this.isMechanic = roles.includes('TECH_SPECIALIST') || roles.includes('SUPPORT');

        this.loadSections();
      })
    );

    // 3) catálogo público
    this.loadPublicCatalog();
  }

  private loadPublicCatalog(): void {
    this.loading = true;
    this.vehicleFacade.loadCatalog().subscribe({
      next: vehicles => {
        this.cars = vehicles;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading catalog', err);
        this.loading = false;
      }
    });
  }

  private loadSections(): void {
    // mis vehículos (seller)
    if (this.isSeller) {
      this.vehicleFacade.loadMyVehicles().subscribe({
        next: vehicles => this.myVehicles = vehicles,
        error: err => console.error('Error loading my vehicles', err)
      });
    } else {
      this.myVehicles = [];
    }

    // vehículos en revisión (mecánico)
    if (this.isMechanic) {
      this.vehicleFacade.loadUnderReview().subscribe({
        next: vehicles => this.pendingCars = vehicles,
        error: err => console.error('Error loading under review vehicles', err)
      });
    } else {
      this.pendingCars = [];
    }
  }

  // navegación / acciones usadas en el HTML
  viewCarDetails(id: number): void {
    this.router.navigate(['/cars', id]);
  }

  addToFavorites(id: number): void {
    // TODO: integrar con microservicio de favoritos
    console.log('Add to favorites -> vehicle', id);
  }

  startInspection(): void {
    // TODO: ruta real del flujo de inspecciones
    this.router.navigate(['/inspections']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
