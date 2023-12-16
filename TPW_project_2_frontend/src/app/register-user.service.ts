import { Injectable } from '@angular/core';
import {User} from "./user";

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {
  private baseUrl: string = "http://localhost:8000/ws/";

  constructor() { }

  async register(username: string, name: string, email: string, password: string): Promise<boolean> {
    const url: string = this.baseUrl + "registerUser";
    const data: Response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        name: name,
        email: email,
        password: password
      })
    });
    const user: User = await data.json() ?? [];
    if (user.id === 0) {
      return false;
    }
    localStorage.setItem("id", user.id.toString());
    localStorage.setItem("username", user.username);

    return true;
  }

  // function to see if the username already exists
  async usernameExists(username: string): Promise<boolean> {
    // get all users
    const url: string = this.baseUrl + "users";
    const data: Response = await fetch(url);
    const users: User[] = await data.json() ?? [];
    // check if the username already exists
    for (let user of users) {
      if (user.username === username) {
        return true;
      }
    }
    return false;
  }
}
