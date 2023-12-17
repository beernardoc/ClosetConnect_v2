import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {CommonModule} from "@angular/common";
import { LoginUserService } from '../login-user.service';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginUserService: LoginUserService = inject(LoginUserService);
  invalidCredentials: boolean = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', Validators.required]
    });

    // if the user is already logged in, redirect to home page
    if (localStorage.getItem("id") !== null && localStorage.getItem("id") !== "0") {
      window.location.href = "/";
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      // If the form is valid, perform login logic here
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;

      this.loginUserService.login(username, password)
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
          console.error('Error logging in:', error);
          this.invalidCredentials = true;
        });

    } else {
      // Check if any of the fields are dirty (touched or modified)
      this.loginForm.markAllAsTouched();
      console.log('Invalid form submitted');
    }
  }
}
