import {Component, inject} from '@angular/core';
import {Product} from "../product";
import {User} from "../user";
import {Favorite} from "../favorite";
import {UserService} from "../user.service";
import {FavoriteService} from "../favorite.service";
import {ProductService} from "../product.service";
import {CommonModule} from "@angular/common";
import {UsersComponent} from "../users/users.component";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {CurrentUserService} from "../current-user.service";
import {ProductComponent} from "../product/product.component";

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, UsersComponent, FormsModule, RouterLink, ProductComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  favorite_products: Product[] = [];
  favorites: Favorite[] = [];
  user : User = {} as User;
  favoriteService: FavoriteService = inject(FavoriteService);
  currentUserService: CurrentUserService = inject(CurrentUserService);
  productService: ProductService = inject(ProductService);

  constructor() {
    this.favoriteService.getFavorites().then((favourites: Favorite[]) => {
      this.favorites = favourites;
    });

    this.currentUserService.getCurrentUser().then((user: User) => {
      this.user = user;
      this.favoriteService.getFavoriteProducts(this.user.id).then((favorite_products: Product[]) => {
        this.favorite_products = favorite_products;
      });
    });


  }
}
