import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Vehicle } from '../../domain/models/vehicle.model';
import {VehicleFacade} from "../../application/vehicle-facade";

@Component({
  selector: 'app-my-cars',
  templateUrl: './my-cars.component.html',
  styleUrls: ['./my-cars.component.css']
})
export class MyCarsComponent implements OnInit {
  cars: Vehicle[] = [];
  defaultImage = 'assets/images/cars/default-car.png';
  loading = true;

  constructor(
    private vehicleFacade: VehicleFacade,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.vehicleFacade.listMyVehicles().subscribe({
      next: vehicles => {
        this.cars = vehicles;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error fetching your vehicles.', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }


  deleteCar(carId: number): void {
    this.vehicleFacade.deleteVehicle(carId).subscribe({
      next: () => {
        this.cars = this.cars.filter(c => c.id !== carId);
        this.snackBar.open('Car deleted successfully.', 'Close', { duration: 3000 });
      },
      error: (error) => {
        if (error.status === 404) {
          this.snackBar.open('Car not found.', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('Error deleting car. Please try again.', 'Close', { duration: 3000 });
        }
      }
    });
  }

  navigateToCarDetails(carId: number): void {
    this.router.navigate(['/cars', carId]);
  }
}
