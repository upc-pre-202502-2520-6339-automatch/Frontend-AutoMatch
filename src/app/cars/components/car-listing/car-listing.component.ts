import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Car, CarService } from '../../services/car/car.service';
import { FavoriteService } from '../../services/favorite-service/favorite.service';
import { ReviewService } from '../../../mechanic/services/review.service';

@Component({
  selector: 'app-car-listing',
  templateUrl: './car-listing.component.html',
  styleUrls: ['./car-listing.component.css']
})
export class CarListingComponent implements OnInit {
  userRole: string = ''; // Tipo forzado
  cars: Car[] = [];
  paginatedCars: Car[] = [];
  favorites: number[] = [];
  page = 1;
  pageSize = 12;
  total = 0;
  loading = false;
  q = '';
  defaultImage = 'assets/default_image.jpg';
  Math = Math; // Para usar Math en el HTML

  constructor(
    private carService: CarService,
    private favService: FavoriteService,
    private reviewService: ReviewService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role') ?? '';
    this.loadFavorites();
    this.loadCars();
  }

  // 🔹 Getters profesionales (eliminan los errores en HTML)
  get isBuyer(): boolean {
    return this.userRole === 'ROLE_BUYER';
  }

  get isSeller(): boolean {
    return this.userRole === 'ROLE_SELLER';
  }

  loadCars(): void {
    this.loading = true;
    this.carService.getCars(this.page, this.pageSize, this.q).subscribe({
      next: (res) => {
        this.cars = res.items;
        this.total = res.total;
        this.paginatedCars = this.cars;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.show('No se pudieron cargar los autos');
      }
    });
  }

  filteredCars(): Car[] {
    // Mostrar solo autos visibles al comprador
    return this.paginatedCars.filter((car: any) =>
      ['REVIEWED', 'APPROVED', 'LISTED'].includes(car.status)
    );
  }

  loadFavorites(): void {
    this.favService.getFavoritesByCurrentUser().subscribe({
      next: (list) => (this.favorites = (list || []).map(c => c.id!)),
      error: () => (this.favorites = [])
    });
  }

  isFavorite(id?: number): boolean {
    return !!id && this.favorites.includes(id);
  }

  toggleFavorite(car: Car): void {
    if (!car.id) return;
    const op = this.isFavorite(car.id)
      ? this.favService.removeFavorite(car.id)
      : this.favService.addFavorite(car.id);

    op.subscribe({
      next: () => {
        this.loadFavorites();
        this.show(this.isFavorite(car.id) ? 'Quitado de favoritos' : 'Añadido a favoritos');
      },
      error: () => this.show('No se pudo actualizar favoritos')
    });
  }

  deleteCar(car: Car): void {
    if (!car.id) return;
    if (!confirm('¿Eliminar este anuncio?')) return;
    this.carService.deleteCar(car.id).subscribe({
      next: () => {
        this.show('Anuncio eliminado');
        this.loadCars();
      },
      error: () => this.show('No se pudo eliminar')
    });
  }

  requestInspection(carId?: number): void {
    if (!carId) return;
    const review = { carId, notes: 'Inspección solicitada', status: 'PENDING' };
    this.reviewService.createReview(review).subscribe({
      next: () => this.show('Inspección solicitada correctamente'),
      error: () => this.show('Error al solicitar inspección')
    });
  }

  viewCarDetails(id?: number): void {
    if (!id) return;
    this.router.navigate(['/car-details', id]);
  }

  search(): void {
    this.page = 1;
    this.loadCars();
  }

  pageChange(p: number): void {
    this.page = p;
    this.loadCars();
  }

  private show(msg: string) {
    this.snackBar.open(msg, 'Cerrar', { duration: 2500 });
  }
}
