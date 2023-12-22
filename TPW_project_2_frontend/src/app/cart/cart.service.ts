import { Injectable } from '@angular/core';
import {Product} from "../product";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl: string = "http://localhost:8000/ws/";

  constructor() { }

  async getProducts(): Promise<any> {

    let id = localStorage.getItem("id")


    const url: string = this.baseUrl + "cart?id=" + id;


    try {
      const data: Response = await fetch(url);
      return await data.json();
    } catch (error) {
      console.error("Error fetching cart data:", error);
      return null; // Ou qualquer tratamento de erro adequado para o seu aplicativo
    }


  }


  async deleteItemFromCart(name: string): Promise<any> {


    try {
      const url: string = this.baseUrl + "update_cart";
      const data: Response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: name, id: localStorage.getItem("id") })
      });

      if (data.ok) {
        window.location.reload();
      }
      else {
        throw new Error(data.statusText);
      }

      return data;
    } catch (error) {
      console.error("Erro ao atualizar produto ao carrinho:", error);
      throw error; // Pode querer manipular o erro de alguma forma, dependendo do caso.
    }


  }

}
