import {Injectable} from '@angular/core';
import {Favorite} from "./favorite";
import {Product} from "./product";

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private baseUrl: string = "http://localhost:8000/ws/";

  constructor() {}

  async getFavorites(): Promise<Favorite[]> {
    const url: string = this.baseUrl + "favorites";
    const data: Response = await fetch(url);
    return await data.json() ?? [];
  }

  async getFavoriteProducts(): Promise<Product[]> {
    const url: string = this.baseUrl + "favorite_products";
    const data: Response = await fetch(url);
    return await data.json() ?? [];
  }

  async addFavorite(product_id : number): Promise<Response> {
    try {
      const url: string = this.baseUrl + "add_favorite";
      const data: Response = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({product_id: product_id, username: localStorage.getItem("username")})
      });

      if (!data.ok) {
        throw new Error(data.statusText);
      }

      return data;
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  }

  async removeFavorite(id: number): Promise<Response> {
    try {
      const url: string = this.baseUrl + "remove_favorite/" + id;
      const data: Response = await fetch(url, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: id})
      });

      if (!data.ok) {
        throw new Error(data.statusText);
      }

      return data;
    } catch (error) {
      console.error("Error deleting favorite:", error);
      throw error;
    }
  }

}
