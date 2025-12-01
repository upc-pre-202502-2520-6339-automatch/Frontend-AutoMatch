// src/app/public/components/toolbar/toolbar.component.ts
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ProfileService,
  Profile
} from '../../../profiles/services/profile.service';
import { AuthenticationService } from '../../../register/services/authentication.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  // IAM
  isSignedIn = false;
  username: string | null = null;
  roles: string[] = [];
  userRole: string | null = null; // ROLE_SELLER / ROLE_BUYER / ROLE_MECHANIC

  // Profile
  profileData: Profile | null = null;
  userPhoto: string = 'assets/default-profile.png'; // fija

  // UI
  isMenuOpen = false;
  showDropdown = false;
  isScrolled = false;

  constructor(
    private authService: AuthenticationService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Suscribirse al estado de IAM
    this.authService.isSignedIn$.subscribe(isIn => {
      this.isSignedIn = isIn;
      if (!isIn) {
        this.profileData = null;
        this.userPhoto = 'assets/default-profile.png';
        this.userRole = null;
      }
    });

    this.authService.currentUsername$.subscribe(name => {
      this.username = name;
    });

    this.authService.roles$.subscribe(roles => {
      this.roles = roles || [];
      this.userRole = this.roles.length ? this.roles[0] : null;
    });

    // Verificar token al cargar y, si es válido, cargar perfil
    this.authService.verifyToken().subscribe(isValid => {
      if (isValid) {
        this.loadProfile();
      }
    });

    // Si otro componente actualiza el perfil, nos enteramos aquí
    this.profileService.currentProfile$.subscribe(profile => {
      if (profile) {
        this.profileData = profile;
      }
    });
  }

  private loadProfile(): void {
    this.profileService.getMyProfile().subscribe({
      next: profile => {
        this.profileData = profile;
        this.userPhoto = 'assets/default-profile.png'; // siempre
      },
      error: err => {
        // Si es 404 => el consumidor de Kafka aún no creó el perfil
        // o estás en un usuario sin perfil: puedes elegir:
        // - dejarlo nulo
        // - redirigir a /profile-form
        if (err.status === 404) {
          this.profileData = null;
          this.userPhoto = 'assets/default-profile.png';
        }
      }
    });
  }

  // Menu / dropdown UI
  toggleMenu(): void { this.isMenuOpen = !this.isMenuOpen; }
  closeMenu(): void { this.isMenuOpen = false; }
  showDropdownMenu(): void { this.showDropdown = true; }
  hideDropdownMenu(): void { this.showDropdown = false; }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 10;
  }

  // Auth acciones
  onLogin(): void {
    this.router.navigate(['/login']).then();
  }

  onRegister(): void {
    this.router.navigate(['/register']).then();
  }

  logout(): void {
    this.authService.signOut().subscribe(() => {
      this.router.navigate(['/login']).then();
    });
  }
}


























