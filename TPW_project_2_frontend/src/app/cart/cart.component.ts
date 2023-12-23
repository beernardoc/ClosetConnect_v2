import {Component, inject} from '@angular/core';
import {Product} from "../product";
import {CommonModule, JsonPipe, NgForOf} from "@angular/common";
import {CartService} from "./cart.service";

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  imports: [CommonModule],
  styleUrl: './cart.component.css'
})
export class CartComponent {
  products: any[] = [];
  cartinfo: any[] = [];
  price: number = 0;
  cartService: CartService = inject(CartService);

  constructor() {
    this.cartService.getProducts().then((result: any) => {
      this.cartinfo = this.convertObjectToArray(result['cart']);
      this.products = this.convertObjectToArray(result['cart_items']);
      this.price = result['price'];
    });




  }

  private convertObjectToArray(obj: any): { key: string, value: any }[] {
    return Object.keys(obj).map(key => ({ key, value: obj[key] }));
  }
}
