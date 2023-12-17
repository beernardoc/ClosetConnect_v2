import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {CommonModule} from "@angular/common";
import {RegisterUserService} from "../register-user.service";
import {RouterLink} from "@angular/router";
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm!: FormGroup;
  registerUserService: RegisterUserService = inject(RegisterUserService);
  invalidCredentials: boolean = false;
  passwordMismatch: boolean = false;
  usernameExists: boolean = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required,, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });

    // if the user is already logged in, redirect to home page
    if (localStorage.getItem("id") !== null && localStorage.getItem("id") !== "0") {
      window.location.href = "/";
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      // If the form is valid, perform login logic here
      const username = this.registerForm.value.username;
      const name = this.registerForm.value.name;
      const email = this.registerForm.value.email;
      const password = this.registerForm.value.password;
      const confirmPassword = this.registerForm.value.confirmPassword;

      // reset error messages
      this.invalidCredentials = false;
      this.passwordMismatch = false;
      this.usernameExists = false;

      if (password !== confirmPassword) {
        console.log('Passwords do not match');
        this.passwordMismatch = true;
        return;
      }

      // Check if the username already exists
      this.registerUserService.usernameExists(username)
        .then((exists: boolean) => {
          if (exists) {
            this.usernameExists = true;
            return;
          }
          // If the username does not exist, register the user
          this.registerUserService.register(username, name, email, password)
            .then((success: boolean) => {
              if (success) {
                // redirect to home page
                window.location.href = "/";
              } else {
                // Display error message, user does not exist
                this.invalidCredentials = true;
              }
            })
            .catch((error) => {
              console.error('Error registering user:', error);
              this.invalidCredentials = true;
            });
        })
        .catch((error) => {
          console.error('Error checking if username exists:', error);
          this.invalidCredentials = true;
        });

    } else {
      // Check if any of the fields are dirty (touched or modified)
      this.registerForm.markAllAsTouched();
      console.log('Invalid form submitted');
    }
  }
}
