// src/app/register/components/authentication-section/authentication-section.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-authentication-section',
  templateUrl: './authentication-section.component.html',
  styleUrls: ['./authentication-section.component.css']   // 👈 plural
})
export class AuthenticationSectionComponent {
  currentUsername: string | null = null;
  isSignedIn = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    // 👇 usamos los observables con $
    this.authenticationService.currentUsername$.subscribe(username => {
      this.currentUsername = username;
    });

    this.authenticationService.isSignedIn$.subscribe(isSignedIn => {
      this.isSignedIn = isSignedIn;
    });
  }

  onSignIn(): void {
    this.router.navigate(['/login']).then();     // 👈 ruta real
  }

  onSignUp(): void {
    this.router.navigate(['/register']).then();  // 👈 ruta real
  }

  onSignOut(): void {
    this.authenticationService.signOut().subscribe(() => {
      this.router.navigate(['/login']).then();
    });
  }
}
