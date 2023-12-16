import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {CommonModule} from "@angular/common";
import { LoginUserService } from '../login-user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginUserService: LoginUserService = inject(LoginUserService);

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', Validators.required]
    });
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
            alert("Invalid username or password");
          }
        })
        .catch((error) => {
          console.error('Error logging in:', error);
        });

    } else {
      // Check if any of the fields are dirty (touched or modified)
      if (this.loginForm.dirty) {
        // If the form is invalid and has been interacted with, show error messages
        this.loginForm.markAllAsTouched();
      }
      console.log('Invalid form submitted');
    }
  }
}
