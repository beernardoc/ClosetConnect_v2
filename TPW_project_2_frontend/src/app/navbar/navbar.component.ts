import {Component, inject, OnInit, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { CurrentUserService } from '../current-user.service';
import { User } from '../user';
import {CommonModule} from "@angular/common";
import {LogoutUserService} from "../logout-user.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  user: User = {
    id: 0,
    username: "",
    name: "",
    password: "",
    admin: false,
    image: "",
    description: "",
    sold: 0,
    image_base64: ""
  };

  currentUserService: CurrentUserService = inject(CurrentUserService);
  logoutUserService: LogoutUserService = inject(LogoutUserService);
  logout = () => {
    this.logoutUserService.logout()
      .then((success: boolean) => {
        if (success) {
          // redirect to home page
          window.location.href = "/";
        } else {
          // Display error message, user does not exist
          console.log("Error logging out");
        }
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }

  constructor() {
    this.currentUserService.getCurrentUser()
      .then((user: User) => {
        this.user = user;
      })
      .catch((error) => {
        console.error('Error fetching current user:', error);

      });
  }
}
