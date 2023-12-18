import { Component, Input, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Product } from "../product";
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../product.service";

@Component({
  selector: 'app-account-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-product.component.html',
  styleUrl: './account-product.component.css'
})
export class AccountProductComponent {
  @Input() product: Product | undefined = undefined;
  favorites: number = 0;
  productService: ProductService = inject(ProductService);

  constructor(private router: ActivatedRoute, private location: Location) {
    let productID  = this.router.snapshot.paramMap.get('id');


    if (typeof productID === "string") {
      this.productService.getProduct(parseInt(productID))
        .then((product: Product) => {
          this.product = product;

          this.productService.getNumProductFavorites(this.product.id)
            .then((favorites: number) => {
              this.favorites = favorites;
            })
            .catch((error) => {
              console.error('Error fetching favorites:', error);
            });
        })
        .catch((error) => {
          console.error('Error fetching product:', error);
        });
    }
  }
}
