import { Injectable } from '@angular/core';
import {User} from "./user";

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private baseUrl: string = "http://localhost:8000/ws/";

  constructor() { }

  async getUsers(): Promise<User[]> {
    const url: string = this.baseUrl + "users";
    const data: Response = await fetch(url);
    // the image is a base64 string
    // we need to convert it to a blob
    // and then to a url
    const users: User[] = await data.json() ?? [];
    for (let user of users) {
      const blob: Blob = base64toBlob(user.image, "image/jpg");
      user.image = URL.createObjectURL(blob);
    }
    return users;
  }

  async getUser(id: number): Promise<User> {
    const url: string = this.baseUrl + "users/" + id;
    const data: Response = await fetch(url);
    const user: User = await data.json() ?? null;
    if (user) {
      const blob: Blob = base64toBlob(user.image, "image/jpg");
      user.image = URL.createObjectURL(blob);
    }
    return user;
  }
}



// Function to convert a base64 string to a Blob
function base64toBlob(base64Data: string, contentType: string): Blob {
  const sliceSize = 512;
  const byteCharacters = atob(base64Data);
  const byteArrays: Uint8Array[] = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}
