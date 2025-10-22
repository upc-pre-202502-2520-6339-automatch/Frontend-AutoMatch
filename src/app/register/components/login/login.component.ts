import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "../../services/authentication.service";
import { SignInRequest } from "../../model/sign-in.request";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { catchError, map, of, switchMap } from "rxjs";
import { SubscriptionService } from "../../../plans/service/subscription.service";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signInForm!: FormGroup;
  hide: boolean = true;
  isSignedIn: boolean = false;
  httpOptions: any;


  private baseURL = environment.apiUrl;

  constructor(
    private builder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private http: HttpClient,
    private subscriptionService: SubscriptionService,
    private snackBar: MatSnackBar
  ) {
    this.authenticationService.isSignedIn.subscribe((isSignedIn) => {
      this.isSignedIn = isSignedIn;
    });
  }

  ngOnInit(): void {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authenticationService.getToken()}`,
      })
    };

    this.signInForm = this.builder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  onSignInSubmit() {
    if (this.signInForm.invalid) return;

    const signInRequest: SignInRequest = {
      username: this.signInForm.value.username,
      password: this.signInForm.value.password
    };

    this.authenticationService.signIn(signInRequest).subscribe({
      next: () => {
        const userRole = localStorage.getItem('userRole');

        this.checkUserProfile().pipe(
          switchMap(hasProfile => {
            if (!hasProfile) {
              this.router.navigate(['/profile-form']);
              return of(null);
            } else if (userRole === 'ROLE_SELLER') {
              this.router.navigate(['/my-cars']);
              return of(null);
            } else {
              this.router.navigate(['/home']);
              return of(null);
            }
          })
      ).subscribe(subscriptionStatus => {
          if (subscriptionStatus === 'has-subscription') {
            this.router.navigate(['/my-cars']);
            this.snackBar.open('Login successful! ENJOY :) .', 'Close', { duration: 3000 });
          } else if (subscriptionStatus === 'no-subscription') {
            this.router.navigate(['/plan']);
            this.snackBar.open('You need a subscription. Redirecting to plans.', 'Close', { duration: 3000 });
          }
        });
      },
      error: (error) => {
        this.snackBar.open('Error during sign-in: Invalid credentials.', 'Close', { duration: 3000 });
      }
    });
  }

  private checkUserProfile() {
    return this.http.get<any>(`${this.baseURL}/profiles/me`, this.httpOptions).pipe(
      catchError(error => {
        this.snackBar.open('Error fetching user profile', 'Close', { duration: 3000 });
        return of(null);
      }),
      map(profile => !!profile)
    );
  }

  private checkUserSubscription() {
    return this.subscriptionService.getMySubscription().pipe(
      map(subscription => {
        if (subscription && subscription.status === 'PAID') {
          return 'has-subscription';
        }
        return 'no-subscription';
      }),
      catchError(error => {
        this.snackBar.open('Error fetching user subscription', 'Close', { duration: 3000 });
        return of('no-subscription');
      })
    );
  }

  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }

  onSignOut() {
    this.authenticationService.signOut();
  }


}
