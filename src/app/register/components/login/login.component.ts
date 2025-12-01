import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import {SignInRequest} from "../../model/sign-in.request";
import { switchMap, catchError, of, map } from 'rxjs';
import { ProfileService } from '../../../profiles/services/profile.service';





@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // 👈 Coincide con [formGroup]="signInForm" del HTML
  signInForm!: FormGroup;

  // Para mostrar/ocultar password (usado en el HTML)
  hide = true;

  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // 👈 Coincide con (click)="onSignInSubmit()" del HTML
  onSignInSubmit(): void {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const request: SignInRequest = {
      username: this.signInForm.value.username,
      password: this.signInForm.value.password
    };

    this.authService.signIn(request).pipe(
      // 👇 una vez logueado, preguntamos al BC Profiles si ya tiene perfil
      switchMap(() =>
        this.profileService.getMyProfile().pipe(
          map(() => 'HAS_PROFILE' as const),
          catchError(err => {
            if (err.status === 404) {
              // no tiene perfil creado todavía
              return of('NO_PROFILE' as const);
            }
            // otro error inesperado
            this.errorMessage = err.error?.message || 'Error verificando el perfil';
            return of('ERROR' as const);
          })
        )
      )
    ).subscribe(status => {
      this.loading = false;

      if (status === 'HAS_PROFILE') {
        // Usuario antiguo con perfil → HOME
        this.router.navigate(['/home']).then();
      } else if (status === 'NO_PROFILE') {
        // Usuario sin perfil (ej: primera vez) → FORMULARIO PERFIL
        this.router.navigate(['/profile-form']).then();
      } else {
        // ERROR: no redirigimos, solo dejamos el mensaje
      }
    });
  }



  // 👈 Coincide con (click)="togglePasswordVisibility()" del HTML
  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }
}
