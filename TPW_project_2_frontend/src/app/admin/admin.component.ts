import {Component, inject} from '@angular/core';
import {Product} from "../product";
import {User} from "../user";
import {UserService} from "../user.service";
import {ProductService} from "../product.service";
import {CommonModule} from "@angular/common";
import {UsersComponent} from "../users/users.component";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {LoadingComponent} from "../loading/loading.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, UsersComponent, FormsModule, RouterLink, LoadingComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  users: User[] = [];
  products: Product[] = [];
  userService: UserService = inject(UserService);
  productService: ProductService = inject(ProductService);
  errorUser: boolean = false;
  errorProduct: boolean = false;
  userSearchText: string = "";
  productSearchText: string = "";
  load: boolean = true;

  constructor() {
    this.userService.getUsers().then((users: User[]) => {
      this.users = users;
      this.load = false;
    });

    this.productService.getProducts().then((products: Product[]) => {
      this.products = products;
    });
  }

  searchUser() {
    this.users = [];
    this.userService.getUsers().then((users: User[]) => {
      for (let user of users) {
        if (user.username.includes(this.userSearchText)) {
          this.users.push(user);
        }
      }
      if (this.users.length == 0) {
        this.errorUser = true;
      }
    });

  }

  searchProduct() {
    this.products = [];
    this.productService.getProducts().then((products: Product[]) => {
      for (let product of products) {
        if (product.name.includes(this.productSearchText)) {
          this.products.push(product);
        }
      }
      if (this.products.length == 0) {
        this.errorProduct = true;
      }
    });
  }

  deleteUser(user: User) {
    this.userService.deleteUser(user.id);
    location.reload();
  }

  deleteProduct(product: Product) {
    this.productService.deleteProduct(product.id);
    location.reload();
  }
}
