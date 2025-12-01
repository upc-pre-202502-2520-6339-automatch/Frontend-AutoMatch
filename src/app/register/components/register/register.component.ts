import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import {SignUpRequest} from "../../model/sign-up.request";
import { SignInRequest } from '../../model/sign-in.request';
import { switchMap } from 'rxjs';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']   // respetamos tu CSS
})
export class RegisterComponent implements OnInit {

  // 👇 Coincide con [formGroup]="signUpForm" del HTML
  signUpForm!: FormGroup;

  loading = false;
  errorMessage: string | null = null;

  // roles seleccionados desde los checkboxes
  selectedRoles: string[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      // 👇 El HTML usa formControlName="name"
      name: ['', [Validators.required]],
      // 👇 mensaje del HTML dice "al menos 3 caracteres"
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  // Coincide con (ngSubmit)="onSignUpSubmit()"
  onSignUpSubmit(): void {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const username = this.signUpForm.value.name;
    const password = this.signUpForm.value.password;

    const signUpRequest: SignUpRequest = {
      username,
      password,
      roles: this.selectedRoles
    };

    this.authService.signUp(signUpRequest).pipe(
      // 👉 Después de registrar, hacemos login automático
      switchMap(() => {
        const signInRequest: SignInRequest = {
          username,
          password
        };
        return this.authService.signIn(signInRequest);
      })
    ).subscribe({
      next: () => {
        this.loading = false;
        // 👉 Nuevo usuario va directo a completar su perfil
        this.router.navigate(['/profile-form']);
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Error al registrarse';
      }
    });
  }


  // Coincide con (change)="onRoleChange('ROLE_SELLER')" del HTML
  onRoleChange(roleWithPrefix: string): void {
    // El HTML usa "ROLE_SELLER", "ROLE_BUYER"... pero tu backend espera "SELLER", "BUYER"...
    const role = roleWithPrefix.replace(/^ROLE_/, '');

    if (this.selectedRoles.includes(role)) {
      // si ya está, la quitamos (toggle para cuando desmarcan)
      this.selectedRoles = this.selectedRoles.filter(r => r !== role);
    } else {
      this.selectedRoles.push(role);
    }
  }
}
