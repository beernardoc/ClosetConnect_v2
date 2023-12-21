import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogoutUserService {

  constructor() { }

  async logout(): Promise<boolean> {
    // remove the token from the local storage
    localStorage.removeItem("token");

    return true;
  }
}
