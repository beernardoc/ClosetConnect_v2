import { Component } from '@angular/core';
import {CurrentUserService} from "../current-user.service";
import {User} from "../user";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css'
})
export class AccountSettingsComponent {
  user: User = {
    id: 0,
    username: "",
    name: "",
    email: "",
    password: "",
    admin: false,
    image: "",
    description: "",
    sold: 0,
    image_base64: ""
  };
  at: string = "@";

  currentUserService: CurrentUserService = new CurrentUserService();

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
