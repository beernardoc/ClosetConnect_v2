import {Component, inject} from '@angular/core';
import {Product} from "../product";
import {CommonModule, JsonPipe, NgForOf} from "@angular/common";
import {ProductsComponent} from "../products/products.component";
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
  user: string = "";
  cartService: CartService = inject(CartService);

  constructor() {
    this.cartService.getProducts().then((result: any) => {
      this.cartinfo = this.convertObjectToArray(result['cart']);
      this.products = this.convertObjectToArray(result['cart_items']);
      this.price = result['price'];
      this.user = result['user'];
    });
  }

  private convertObjectToArray(obj: any): { key: string, value: any }[] {
    return Object.keys(obj).map(key => ({ key, value: obj[key] }));
  }
}
