import { Injectable } from '@angular/core';
import {User} from "./user";

@Injectable({
  providedIn: 'root'
})
export class LoginUserService {
  private baseUrl: string = "http://localhost:8000/ws/";

  constructor() { }

  async login(username: string, password: string): Promise<boolean> {
    const url: string = this.baseUrl + "loginUser";
    const data: Response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
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
}
