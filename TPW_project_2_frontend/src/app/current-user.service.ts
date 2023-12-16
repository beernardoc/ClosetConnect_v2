import {Injectable} from '@angular/core';
import {User} from "./user";
import {base64toBlob} from "./utils";

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private baseUrl: string = "http://localhost:8000/ws/";

  constructor() { }

  async getCurrentUser(): Promise<User> {
    // is being stored in the local storage
    // we need to get it from there
    const username: string = localStorage.getItem("username") ?? "";
    const id: number = parseInt(localStorage.getItem("id") ?? "0");
    const password: string = localStorage.getItem("password") ?? "";

    const url: string = this.baseUrl + "user/" + id;
    const data: Response = await fetch(url);
    const user: User = await data.json() ?? [];
    // image is a base64 string
    // we need to convert it to a blob
    // and then to a url
    const blob: Blob =  base64toBlob(user.image_base64, "image/jpg");
    user.image_base64 = URL.createObjectURL(blob);
    console.log(user);
    return user;
  }

  async getNoUserImage(): Promise<string> {
    const url: string = this.baseUrl + "no_user_image";
    const data: Response = await fetch(url);
    const image: string = await data.json() ?? [];
    // the image is a base64 string
    // we need to convert it to a blob
    // and then to a url
    const blob: Blob = base64toBlob(image, "image/jpg");
    return URL.createObjectURL(blob);
  }
}
