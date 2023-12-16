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
    const url: string = this.baseUrl + "followed_products";
    const data: Response = await fetch(url);
    return await data.json() ?? [];
  }

  async getExploreProducts(): Promise<Product[]> {
    const url: string = this.baseUrl + "explore_products";
    const data: Response = await fetch(url);
    return await data.json() ?? [];
  }
}
