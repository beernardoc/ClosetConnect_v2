import { Injectable } from '@angular/core';
import {User} from "./user";

@Injectable({
  providedIn: 'root'
})
export class LoginUserService {
  private baseUrl: string = "http://localhost:8000/ws/";

  constructor() { }

  async login(username: string, password: string): Promise<boolean> {
    const url: string = this.baseUrl + "login";
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
    // the response is {'token': token.key, 'user': serializer.data}
    // we want to store the token in local storage
    const response: any = await data.json();
    if (response.token) {
      localStorage.setItem('token', response.token);
      return true;
    } else {
      return false;
    }
  }
}
