import { Injectable } from '@angular/core';
import {Product} from "./product";
import {base64toBlob} from "./utils";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl: string = "http://localhost:8000/ws/";
  constructor() { }

  async getProducts(): Promise<Product[]> {
    const url: string = this.baseUrl + "products";
    const data: Response = await fetch(url);
    // the image is a base64 string
    // we need to convert it to a blob
    // and then to a url
    const products: Product[] = await data.json() ?? [];
    for (let product of products) {
      const blob: Blob = base64toBlob(product.image, "image/jpg");
      product.image = URL.createObjectURL(blob);
    }
    return products;
  }

  async getFollowedProducts(): Promise<Product[]> {
    const url: string = this.baseUrl + "followed_products?id=1"; // TODO: get the user
    const data: Response = await fetch(url);

    const products: Product[] = await data.json() ?? [];
    for (let product of products) {
      const blob: Blob = base64toBlob(product.image, "image/jpg");
      product.image = URL.createObjectURL(blob);
    }
    return products;
  }

  async getExploreProducts(): Promise<Product[]> {
    const url: string = this.baseUrl + "explore_products";
    const data: Response = await fetch(url);
    return await data.json() ?? [];
  }

  async addProductToCart(productID: number): Promise<Response> {
    try {
      const url: string = this.baseUrl + "add_product_to_cart";
      const data: Response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productID: productID, username: "jose" }) // TODO: get the user
      });

      if (!data.ok) {
        throw new Error(data.statusText);
      }

      return data;
    } catch (error) {
      console.error("Erro ao adicionar produto ao carrinho:", error);
      throw error; // Pode querer manipular o erro de alguma forma, dependendo do caso.
    }
  }

  async deleteProduct(id: number): Promise<Response> {
    try {
      const url: string = this.baseUrl + "delete_product/" + id;
      const data: Response = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id })
      });

      if (!data.ok) {
        throw new Error(data.statusText);
      }

      return data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

}
