import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap, of, forkJoin } from 'rxjs';
import { ReviewService } from '../../services/review.service';
import { CarService, Car } from '../../../cars/services/car/car.service';

interface Review {
  id: number;
  carId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DONE';
  notes?: string;
  createdAt?: string;
}

@Component({
  selector: 'app-mechanic-revision',
  templateUrl: './mechanic-revision.component.html',
  styleUrls: ['./mechanic-revision.component.css']
})
export class MechanicRevisionComponent implements OnInit {
  loading = true;
  reviewed: { car: Car; reviews: Review[] }[] = [];
  pendingCars: Car[] = [];

  constructor(
    private reviewService: ReviewService,
    private carService: CarService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadReviewedCars();
    this.loadPendingCars();
  }

  /** Carga autos ya revisados */
  private loadReviewedCars(): void {
    this.reviewService.getReviewsByCurrentUser().pipe(
      switchMap((reviews: Review[]) => {
        if (!reviews?.length) return of([]);

        const groups = Object.values(
          reviews.reduce((acc: any, r) => {
            acc[r.carId] = acc[r.carId] || { carId: r.carId, reviews: [] };
            acc[r.carId].reviews.push(r);
            return acc;
          }, {})
        );

        const reqs = groups.map((g: any) =>
          this.carService.getCarById(g.carId).pipe(
            switchMap((car: Car) => of({ car, reviews: g.reviews }))
          )
        );

        return forkJoin(reqs);
      })
    ).subscribe({
      next: (rows: any[]) => {
        this.reviewed = rows || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('No se pudo cargar los autos revisados.', 'Cerrar', { duration: 2500 });
      }
    });
  }

  /** Carga autos pendientes de revisión */
  private loadPendingCars(): void {
    this.carService.getCars().subscribe({
      next: (response: any) => {
        const cars = response.items ?? response;
        // Solo autos con estado PENDING
        this.pendingCars = cars.filter((car: Car) => car.status === 'PENDING');
      },
      error: () => {
        this.snack.open('Error al cargar autos pendientes.', 'Cerrar', { duration: 2500 });
      }
    });
  }

  /** Crea una revisión de auto */
  createCarReview(car: Car, notes: string): void {
    const review = {
      carId: car.id!,
      notes,
      status: 'PENDING'
    };
    this.reviewService.createReview(review).subscribe({
      next: () => {
        this.snack.open('Revisión creada exitosamente.', 'Cerrar', { duration: 2500 });
      },
      error: () => {
        this.snack.open('Error al crear la revisión.', 'Cerrar', { duration: 2500 });
      }
    });
  }
}
