import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';  
import { CarService } from "../../../cars/services/car/car.service";
import { FavoriteService } from "../../../cars/services/favorite-service/favorite.service";
import { AuthService } from "../../../register/service/auth.service";
import { ReviewService } from "../../../mechanic/services/review.service";
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userRole: string = '';
  cars: any[] = [];
  pendingCars: any[] = [];
  certifiedCars: any[] = [];
  defaultImage: string = 'assets/default_image.jpg';
  loading: boolean = true;
  user: any;
  reviews: any[] = [];

  constructor(
    private router: Router,
    private carService: CarService,
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private reviewService: ReviewService,
    private snackBar: MatSnackBar  
  ) {}

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole') || '';
    this.loadAllCars();

    if (this.userRole === 'ROLE_MECHANIC') {
      this.loadPendingAndCertifiedCars();
      this.loadAllReviews();
    }

    this.loadUserData();
  }

  loadUserData(): void {
    const userId = +localStorage.getItem('userId')!;
    this.authService.getUserInfo(userId).subscribe(
      (data: any) => {
        this.user = data;
      },
      (error) => {

      }
    );
  }

  loadAllCars() {
  this.loading = true;
  this.carService.getCars().subscribe(
    (response: any) => {
      const cars = response.items ?? response; // compatibilidad con backend
      this.cars = this.processCars(cars);
      this.loading = false;
    },
    (error) => {
      this.showSnackBar('Error fetching cars');
      this.loading = false;
    }
  );
}


  loadAllReviews(): void {
    this.reviewService.getAllReviews().subscribe(
      (reviewsData) => {
        this.reviews = reviewsData;
      },
      (error) => {
        this.showSnackBar('Error fetching reviews');
      }
    );
  }

  loadPendingAndCertifiedCars() {
  this.loading = true;
  this.carService.getCars().subscribe(
    (response: any) => {
      const cars = response.items ?? response;
      this.pendingCars = this.processCars(cars.filter((car: any) => car.status === 'PENDING'));
      this.certifiedCars = this.processCars(cars.filter((car: any) => car.status === 'REVIEWED'));
      this.loadReviewsForCertifiedCars(this.certifiedCars);
      this.loading = false;
    },
    (error) => {
      this.showSnackBar('Error loading cars');
      this.loading = false;
    }
  );
}


  processCars(cars: any[]): any[] {
    return cars.map(car => {
      car.mainImage = car.image && car.image.length > 0 ? car.image[0] : this.defaultImage;
      car.image = car.mainImage;
      return car;
    });
  }

  loadReviewsForCertifiedCars(certifiedCars: any[]): void {
    certifiedCars.forEach(car => {
      this.reviewService.getReviewsByCarId(car.id).subscribe(
        (reviews) => {
          if (reviews && reviews.length > 0) {
            const reviewUserRequests = reviews.map((review: any) => {
              return this.authService.getUserInfo(review.reviewedBy).pipe(
                map(userInfo => ({
                  ...review,
                  reviewerInfo: userInfo
                }))
              );
            });

            forkJoin(reviewUserRequests).subscribe(
              (reviewsWithUserInfo) => {
                car.reviews = reviewsWithUserInfo;
              },
              (error) => {
                this.showSnackBar('Error fetching reviewer info');
              }
            );
          }
        },
        (error) => {
          this.showSnackBar('Error fetching reviews');
        }
      );
    });
  }

  viewCarDetails(carId: number) {
    this.router.navigate(['/car-details', carId]);
  }

  navigateToCarListingForm() {
    this.router.navigate(['/car-listing-form']);
  }

  startInspection() {
    this.router.navigate(['/mechanic-revision']);
  }

  addToFavorites(carId: number): void {
    this.favoriteService.addFavorite(carId).subscribe(
      response => {
        this.showSnackBar('Car added to favorites');
      },
      error => {
        this.showSnackBar('Error adding car to favorites');
      }
    );
  }

  trackByCarId(index: number, car: any): number {
    return car.id;
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    });
  }
}