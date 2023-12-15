import { Injectable } from '@angular/core';
import {Product} from "./product";

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
