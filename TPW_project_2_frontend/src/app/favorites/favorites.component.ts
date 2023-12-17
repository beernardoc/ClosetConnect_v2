import {Component, inject} from '@angular/core';
import {Product} from "../product";
import {User} from "../user";
import {Favorite} from "../favorite";
import {UserService} from "../user.service";
import {ProductService} from "../product.service";
import {FavoriteService} from "../favorite.service";
import {CommonModule} from "@angular/common";
import {ProductsComponent} from "../products/products.component";
import {UsersComponent} from "../users/users.component";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, ProductsComponent, UsersComponent, FormsModule, RouterLink],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  favorite_products: Product[] = [];
  favorites: Favorite[] = [];
  user : User = {} as User;
  userService: UserService = inject(UserService);
  favoriteService: FavoriteService = inject(FavoriteService);

  constructor() {
    this.favoriteService.getFavorites().then((favourites: Favorite[]) => {
      this.favorites = favourites;
    });

    this.userService.getCurrentUser().then((user: User) => {
      this.user = user;
    });

    this.favoriteService.getFavoriteProducts().then((favorite_products: Product[]) => {
      this.favorite_products = favorite_products;
    });
  }
}
