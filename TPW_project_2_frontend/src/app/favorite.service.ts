import {Injectable} from '@angular/core';
import {Favorite} from "./favorite";
import {Product} from "./product";
import {base64toBlob} from "./utils";

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

  async getFavoriteProducts(user_id : number): Promise<Product[]> {
    const url: string = this.baseUrl + "favorite_products/" + user_id;
    const data: Response = await fetch(url);
    const products: Product[] = await data.json() ?? [];
    for (let product of products) {
      const blob: Blob = base64toBlob(product.image, "image/jpg");
      product.image = URL.createObjectURL(blob);
    }
    return products;
  }

  async addFavorite(product_id : number): Promise<Response> {
    try {
      const url: string = this.baseUrl + "add_favorite";
      const data: Response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + localStorage.getItem("token")
        },
        body: JSON.stringify({product_id: product_id})
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
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token " + localStorage.getItem("token")
        },
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
