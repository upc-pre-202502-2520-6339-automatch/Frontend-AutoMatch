import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Vehicle } from '../../domain/models/vehicle.model';
import {VehicleFacade} from "../../application/vehicle-facade";



@Component({
  selector: 'app-car-listing',
  templateUrl: './car-listing.component.html',
  styleUrls: ['./car-listing.component.css']
})
export class CarListingComponent implements OnInit {
  vehicles: Vehicle[] = [];
  loading = false;
  error?: string;

  constructor(
    private vehicleFacade: VehicleFacade,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.loading = true;
    this.vehicleFacade.listAvailable().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar los vehículos.';
        this.loading = false;
      }
    });
  }

  goToDetails(vehicle: Vehicle): void {
    this.router.navigate(['/cars', vehicle.id]);
  }
}


