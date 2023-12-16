import { Component, inject } from '@angular/core';
import {User} from "../user";
import {UserService} from "../user.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  users: User[] = [];
  userService: UserService = inject(UserService);

  constructor() {
    this.userService.getUsers().then((users: User[]) => {
      this.users = users;
      console.log(this.users);
    });
  }
}



