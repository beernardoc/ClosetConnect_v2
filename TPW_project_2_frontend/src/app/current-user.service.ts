import {Injectable} from '@angular/core';
import {User} from "./user";
import {base64toBlob} from "./utils";

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private baseUrl: string = "http://zemendes.pythonanywhere.com/ws/";

  constructor() { }

  async getCurrentUser(): Promise<User> {
    // the user token is stored in the local storage
    // we need to get it and send it to the server
    const token: string = localStorage.getItem("token") ?? "";

    const url: string = this.baseUrl + "user";
    const data: Response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      }
    });
    const user: User = await data.json() ?? [];
    // image is a base64 string
    // we need to convert it to a blob
    // and then to a url
    const blob: Blob =  base64toBlob(user.image_base64, "image/jpg");
    user.image_base64 = URL.createObjectURL(blob);
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
          description: user.description,
          password: user.password
        }
      ),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await data.json() ?? false;
  }

  async deleteProfile(user: User): Promise<boolean> {
    const url: string = this.baseUrl + "delete_user/" + user.id;
    const data: Response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await data.json() ?? false;
  }
}
