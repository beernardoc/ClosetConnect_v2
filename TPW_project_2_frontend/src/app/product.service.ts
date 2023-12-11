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
    return await data.json() ?? [];
  }
}
