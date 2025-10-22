import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService} from "../../services/authentication.service";
import { SignUpRequest } from "../../model/sign-up.request";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signUpForm!: FormGroup;
  submitted = false;
  selectedRole: string = '';

  constructor(
    private builder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.builder.group({
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onRoleChange(role: string) {
    this.selectedRole = role;
  }

  onSignUpSubmit() {
    if (this.signUpForm.invalid || !this.selectedRole) {
      return;
    }

    const signUpRequest: SignUpRequest = {
      username: this.signUpForm.value.name,
      password: this.signUpForm.value.password,
      roles: [this.selectedRole]
    };

    this.authenticationService.signUp(signUpRequest).subscribe({
      next: () => {
        this.submitted = true;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error(`Error while signing up: ${error}`);
      }
    });
  }
}
