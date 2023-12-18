import { Injectable } from '@angular/core';
import {Product} from "./product";
import {base64toBlob} from "./utils";
import { Router } from '@angular/router';
import {User} from "./user";


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl: string = "http://localhost:8000/ws/";
  constructor(private router: Router) { }

  async getProduct(): Promise<Product> {
    const url: string = this.baseUrl + "product/";
    const data: Response = await fetch(url);
    const product: Product = await data.json() ?? {};
    const blob: Blob = base64toBlob(product.image, "image/jpg");
    product.image = URL.createObjectURL(blob);
    return product;
  }


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

    let id = localStorage.getItem("id");
    const url: string = this.baseUrl + "followed_products?id=" + id;
    const data: Response = await fetch(url);

    const products: Product[] = await data.json() ?? [];
    for (let product of products) {
      const blob: Blob = base64toBlob(product.image, "image/jpg");
      product.image = URL.createObjectURL(blob);
    }
    return products;
  }

  async addProductToCart(productID: number): Promise<Response> {

    if(localStorage.getItem("username") == null){
      await this.router.navigate(['/login']);
    }


    try {
      const url: string = this.baseUrl + "add_product_to_cart";
      const data: Response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productID: productID, username: localStorage.getItem("username") })
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

  async getUserProducts(user_id: number): Promise<Product[]> {
    const url: string = this.baseUrl + "user/products/" + user_id;
    const data: Response = await fetch(url);
    const products: Product[] = await data.json() ?? [];
    for (let product of products) {
      const blob: Blob = base64toBlob(product.image, "image/jpg");
      product.image = URL.createObjectURL(blob);
    }
    return products;
  }

  async sellProduct(id: number): Promise<Response> {
    try {
      const url: string = this.baseUrl + "user/sell/" + id;
      const data: Response = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
      });

      if (!data.ok) {
        throw new Error(data.statusText);
      }

      return data;
    } catch (error) {
      console.error("Error selling product:", error);
      throw error;
    }
  }

  async getSeller()   {
    const url: string = this.baseUrl + "seller";
    const data: Response = await fetch(url);
    const seller: User = await data.json() ?? null;
    if (seller) {
      const blob: Blob = base64toBlob(seller.image, "image/jpg");
      seller.image = URL.createObjectURL(blob);
    }
    return seller;
  }

}
