import { Component, Input, inject } from '@angular/core';
import {Product} from "../product";
import {ProductService} from "../product.service";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {FavoriteService} from "../favorite.service";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input() product: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    image: '',
    user_id: 0,
    seen: 0,
    brand: '',
    category: '',
    color: '',
    image_base64: '',
    favorite: false
  }
  @Input() layout: number = 0;
  productService: ProductService = inject(ProductService);
  favoriteService: FavoriteService = inject(FavoriteService);

  constructor() {
    // if the layout is 3, see if the product is a favorite and mark it as such
  }



  deleteProduct(productID: number): void {
    this.productService.deleteProduct(productID)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
      });
  }

  soldProduct(productID: number): void {
    this.productService.sellProduct(productID)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error selling product:', error);
      });
  }

  changeFav(event : any): void {
    // get the product id from the button id
    let productId = event.target.id.split("_")[1];

    // if the class has "btn-outline-danger" change it to "btn-danger" and vice versa
    console.log(event.target.classList);
    if (event.target.classList.contains("btn-outline-danger")) {
      event.target.classList.remove("btn-outline-danger");
      event.target.classList.add("btn-danger");

      // add the product to favorites
      this.favoriteService.addFavorite(productId)
        .then(() => {
          console.log("Added product to favorites");
        })
        .catch((error) => {
          console.error('Error adding product to favorites:', error);
        });
    } else {
      event.target.classList.remove("btn-danger");
      event.target.classList.add("btn-outline-danger");

      // remove the product from favorites
      this.favoriteService.removeFavorite(productId)
        .then(() => {
          console.log("Removed product from favorites");
        })
        .catch((error) => {
          console.error('Error removing product from favorites:', error);
        });
    }
  }
}
