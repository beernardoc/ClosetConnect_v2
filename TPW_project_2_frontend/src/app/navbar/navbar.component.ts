import {Component, inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from '../current-user.service';
import { User } from '../user';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
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
