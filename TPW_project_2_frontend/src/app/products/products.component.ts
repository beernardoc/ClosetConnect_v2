import { Component, inject } from '@angular/core';
import {Product} from "../product";
import {ProductService} from "../product.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  products: Product[] = [];
  productService: ProductService = inject(ProductService);

  constructor() {
    this.productService.getProducts().then((products: Product[]) => {
      this.products = products;
      console.log(this.products);
    });
  }
}
