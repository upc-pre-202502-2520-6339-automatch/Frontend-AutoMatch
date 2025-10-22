import { Component, OnInit } from '@angular/core';
import { CarService } from "../../services/car/car.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from "@angular/router";

@Component({
  selector: 'app-my-cars',
  templateUrl: './my-cars.component.html',
  styleUrls: ['./my-cars.component.css']
})
export class MyCarsComponent implements OnInit {
  cars: any[] = [];
  defaultImage: string = 'assets/default_image.jpg';
  loading: boolean = true;

  constructor(
    private carService: CarService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    const userId = +localStorage.getItem('userId')!;
    this.loading = true;

    this.carService.getCarsByUser(userId).subscribe(
      (data: any[]) => {
        this.cars = data.map(car => {
          if (Array.isArray(car.image) && car.image.length > 0) {
            car.images = car.image;
            car.mainImage = car.images[0];
          } else {
            car.mainImage = this.defaultImage;
            car.images = [this.defaultImage];
          }
          return car;
        });
        this.loading = false;
      },
      (error) => {
        this.snackBar.open('Error fetching cars. Please try again.', 'Close', { duration: 3000 });
        this.loading = false;
      }
    );
  }

  deleteCar(carId: number) {
    const carToDelete = this.cars.find(car => car.id === carId);

    if (carToDelete && carToDelete.status === 'REVIEWED') {
      this.snackBar.open('Reviewed cars cannot be deleted.', 'Close', { duration: 3000 });
      return;
    }
    this.carService.deleteCar(carId).subscribe(
      () => {
        this.cars = this.cars.filter(car => car.id !== carId);
        this.snackBar.open('Car deleted successfully.', 'Close', { duration: 3000 });
      },
      (error) => {
        if (error.status === 404) {
          this.snackBar.open('Car not found.', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('Error deleting car. Please try again.', 'Close', { duration: 3000 });
        }
      }
    );
  }

  navigateToCarDetails(carId: number) {
    this.router.navigate(['/car-details', carId]);
  }
}