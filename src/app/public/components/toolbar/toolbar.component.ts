import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, of, forkJoin } from "rxjs";
import { Router } from '@angular/router';
import { environment } from "../../../../environments/environment";
import { AuthenticationService } from "../../../register/services/authentication.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  userRole: string = '';
  userPhoto: string | null = null;
  profileData: any;
  isScrolled = false;
  isMenuOpen = false;
  showDropdown = false;
  private hideDropdownTimeout: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
      window.addEventListener('resize', () => {
        this.isMenuOpen = false;
      });
    this.authService.currentUserRole.subscribe(role => {
      this.userRole = role;
    });

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      console.error('Token or user ID not found');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    forkJoin({
      userProfile: this.http.get<any>(`${environment.apiUrl}/users/${userId}`, { headers }).pipe(
        catchError(error => {
          console.error('Error fetching user profile:', error);
          return of(null);
        })
      ),
      profileData: this.http.get<any>(`${environment.apiUrl}/profiles/me`, { headers }).pipe(
        catchError(error => {
          console.error('Error fetching profile data:', error);
          return of(null);
        })
      )
    }).subscribe(({ userProfile, profileData }) => {
      if (userProfile) {
        this.userRole = userProfile.roles[0] || 'User';
      } else {
        console.warn('No user profile data returned');
      }

      if (profileData) {
        this.userPhoto = profileData.image;
        this.profileData = profileData;
      } else {
        console.warn('No profile data returned');
      }
    });
  }

  logout() {
    this.router.navigate(['/login']);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isSignedIn');
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = window.pageYOffset;
    this.isScrolled = offset > 50;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  showDropdownMenu() {
    clearTimeout(this.hideDropdownTimeout);
    this.showDropdown = true;
  }

  hideDropdownMenu() {
    this.hideDropdownTimeout = setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const isClickInside = target.closest('.navbar') || target.closest('.hamburger');
    if (!isClickInside && this.isMenuOpen) {
      this.closeMenu();
    }
  }
}