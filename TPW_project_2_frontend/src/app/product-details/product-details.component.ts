import { Component, Input, inject } from '@angular/core';
import {Product} from "../product";
import {User} from "../user";
import {Favorite} from "../favorite";
import {UserService} from "../user.service";
import {ProductService} from "../product.service";
import {FavoriteService} from "../favorite.service";
import {CommonModule, Location} from "@angular/common";
import {ProductsComponent} from "../products/products.component";
import {UsersComponent} from "../users/users.component";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {FollowerService} from "../follower.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, ProductsComponent, UsersComponent, FormsModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
  product : Product = {} as Product;
  user : User = {} as User;
  seller : User = {} as User;
  favorite : boolean = false;
  followers : number = 0;
  userService: UserService = inject(UserService);
  productService: ProductService = inject(ProductService);
  favoriteService: FavoriteService = inject(FavoriteService);
  followerService: FollowerService = inject(FollowerService);

  constructor(private router: ActivatedRoute, private location: Location) {
    let productID  = this.router.snapshot.paramMap.get('product_id');

    if (typeof productID === "string") {
      this.productService.getProduct(parseInt(productID))
        .then((product: Product) => {
          this.product = product;
        })
    }

      this.userService.getCurrentUser().then((user: User) => {
        this.user = user;
      });

  }

  addFavorite(product_id : number) {
    this.favoriteService.addFavorite(product_id).then(r => {
      console.log(r);
    });
  }

  removeFavorite(id: number) {
    this.favoriteService.removeFavorite(id).then(r => {
      console.log(r);
    });
  }

  getSeller() {
    this.productService.getSeller().then((user: User) => {
      this.seller = user;
    });
  }

  getFavorite() {
    this.favoriteService.getFavoriteProducts().then((products: Product[]) => {
      if (products.find(p => !(this.product) || p.id == this.product.id)) {
        this.favorite = true;
      }
    });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).then(r => {
      console.log(r);
    });
  }

  getNumFollowers(user_id: number) {
    this.followerService.getNumFollowers(user_id).then((followers: number) => {
      this.followers = followers;
    });
  }
}
