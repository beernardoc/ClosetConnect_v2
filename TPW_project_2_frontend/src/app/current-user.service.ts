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

  async updateUserImage(image: string, user_id:number): Promise<User> {
    const url: string = this.baseUrl + "update_user_image/" + user_id;
    const data: Response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(
        {
          image: image
        }
      ),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const user: User = await data.json() ?? [];
    return user;
  }

  async updateUser(user: User): Promise<boolean> {
    const url: string = this.baseUrl + "update_user/" + user.id;
    const data: Response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(
        {
          username: user.username,
          name: user.name,
          email: user.email,
          password: user.password,
          admin: user.admin,
          image: user.image,
          description: user.description,
          sold: user.sold
        }
      ),
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return await data.json() ?? false;
  }

  async updateProfile(user: User): Promise<boolean> {
    const url: string = this.baseUrl + "update_profile/" + user.id;
    const data: Response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(
        {
          username: user.username,
          name: user.name,
          email: user.email,
          description: user.description
        }
      ),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await data.json() ?? false;
  }
}
