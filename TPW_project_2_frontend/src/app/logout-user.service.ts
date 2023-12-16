import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogoutUserService {

  constructor() { }

  async logout(): Promise<boolean> {
    // remove the user from the local storage
    if (localStorage.getItem("id") === null || localStorage.getItem("id") === "0") {
      return false;
    }
    localStorage.removeItem("id");
    localStorage.removeItem("username");

    return true;
  }
}
