import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core'; // 🟢 Agregado

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
  standalone: true,
  imports: [
    CommonModule,          
    RouterModule,          
    MatProgressSpinnerModule,
    MatButtonModule,
    TranslateModule        // 🟢 Importar el módulo de traducción
  ]
})
export class FavoritesComponent implements OnInit {
  loading = false;
  favorites: any[] = [];
  paginatedCars: any[] = [];
  totalPages = 1;
  currentPage = 1;

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.loading = true;
    setTimeout(() => {
      this.favorites = [];
      this.paginatedCars = this.favorites;
      this.loading = false;
    }, 1000);
  }

  viewCarDetails(id: number) {
    console.log('Ver detalles del auto con ID:', id);
  }

  removeFavorite(id: number) {
    console.log('Eliminar favorito con ID:', id);
  }

  changePage(page: number) {
    this.currentPage = page;
  }
}