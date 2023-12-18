import {Component, inject} from '@angular/core';
import {CurrentUserService} from "../current-user.service";
import {FollowerService} from "../follower.service";
import {ProductService} from "../product.service";
import {User} from "../user";
import {Product} from "../product";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-account-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-profile.component.html',
  styleUrl: './account-profile.component.css'
})
export class AccountProfileComponent {
  user: User = {
    id: 0,
    username: "",
    name: "",
    email: "",
    password: "",
    admin: false,
    image: "",
    description: "",
    sold: 0,
    image_base64: ""
  };
  at: string = "@";

  followers: number = 0;
  following: number = 0;
  products: Product[] = [];

  currentUserService: CurrentUserService = inject(CurrentUserService)
  followerService: FollowerService = inject(FollowerService);
  productService: ProductService = inject(ProductService)

  constructor() {
    this.currentUserService.getCurrentUser()
      .then((user: User) => {
        this.user = user;

        this.followerService.getNumFollowers(this.user.id)
          .then((followers: number) => {
            this.followers = followers;
          })
          .catch((error) => {
            console.error('Error fetching followers:', error);
          });

        this.followerService.getNumFollowing(this.user.id)
          .then((following: number) => {
            this.following = following;
          })
          .catch((error) => {
            console.error('Error fetching following:', error);
          });

        this.productService.getUserProducts(this.user.id)
          .then((products: Product[]) => {
            this.products = products;
          })
          .catch((error) => {
            console.error('Error fetching products:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching current user:', error);
      });
  }

  deleteModal(productId: number) {
    let modal = document.getElementById("deleteModal_" + productId);
    // @ts-ignore
    modal.style.display = "block";
  }

}
