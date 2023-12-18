import { Component } from '@angular/core';
import {CurrentUserService} from "../current-user.service";
import {User} from "../user";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-account-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-profile.component.html',
  styleUrl: './account-profile.component.css'
})
export class AccountProfileComponent {
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

}
