import { Injectable } from '@angular/core';
import {Product} from "../product";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl: string = "http://localhost:8000/ws/";

  constructor() { }

  async getProducts(): Promise<any> {

    let username = localStorage.getItem("username")


    const url: string = this.baseUrl + "cart?username=" + username;


    try {
      const data: Response = await fetch(url);
      return await data.json();
    } catch (error) {
      console.error("Error fetching cart data:", error);
      return null; // Ou qualquer tratamento de erro adequado para o seu aplicativo
    }







  }
}
