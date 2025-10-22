import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { CarService } from '../../../cars/services/car/car.service';
import { AuthService } from '../../../register/service/auth.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { forkJoin, map, switchMap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-mechanic-check',
  templateUrl: './mechanic-check.component.html',
  styleUrls: ['./mechanic-check.component.css']
})
export class MechanicCheckComponent implements OnInit {
  reviewedCars: any[] = [];
  user: any;
  loading: boolean = true;

  constructor(
    private reviewService: ReviewService,
    private carService: CarService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadReviewedCars();
  }

  loadUserData(): void {
    const userId = +localStorage.getItem('userId')!;
    this.authService.getUserInfo(userId).subscribe(
      (data: any) => {
        this.user = data;
      },
      (error) => {
        this.snackBar.open('Error fetching user information', 'Close', { duration: 3000 });
      }
    );
  }

  loadReviewedCars(): void {
    this.reviewService.getReviewsByCurrentUser().pipe(
      switchMap(reviews => {
        if (!reviews || reviews.length === 0) {
          this.reviewedCars = [];
          this.loading = false;
          return of([]);
        }

        const groupedCars = this.groupReviewsByCar(reviews);

        const carDetailsRequests = groupedCars.map(carGroup => {
          return this.carService.getCarById(carGroup.carId).pipe(
            map(carDetails => ({
  ...carDetails,
  image: Array.isArray(carDetails.images) ? carDetails.images[0] : carDetails.images,
  reviews: carGroup.reviews
})),

            catchError(error => {
              this.snackBar.open('Error fetching car details', 'Close', { duration: 3000 });
              return of(null);
            })
          );
        });

        return forkJoin(carDetailsRequests);
      })
    ).subscribe({
      next: (carsWithDetails) => {
        this.reviewedCars = carsWithDetails.filter(car => car !== null);
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error fetching reviewed cars', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  groupReviewsByCar(reviews: any[]): any[] {
    const grouped = reviews.reduce((acc, review) => {
      const carId = review.vehicle.id;
      if (!acc[carId]) {
        acc[carId] = {
          carId: carId,
          reviews: []
        };
      }
      acc[carId].reviews.push(review);
      return acc;
    }, {});

    return Object.values(grouped);
  }
}