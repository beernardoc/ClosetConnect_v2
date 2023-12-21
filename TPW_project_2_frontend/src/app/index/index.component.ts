import { Component, inject } from '@angular/core';
import {Product} from "../product";
import {ProductService} from "../product.service";
import {CommonModule} from "@angular/common";
import {ProductComponent} from "../product/product.component";


@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, ProductComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  followings: Product[] = [];
  explore: Product[] = [];
  productService: ProductService = inject(ProductService);


  constructor() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.productService.getProducts().then((products: Product[]) => {
        this.explore = products;
      });
    }
    else {
      this.productService.getExploreProducts().then((products: Product[]) => {
        this.explore = products;
      });

      this.productService.getFollowedProducts().then((products: Product[]) => {
        this.followings = products;
      });
    }
  }

}
