import { Component, Input, inject } from '@angular/core';
import {Product} from "../product";
import {User} from "../user";
import {Favorite} from "../favorite";
import {UserService} from "../user.service";
import {ProductService} from "../product.service";
import {FavoriteService} from "../favorite.service";
import {CommonModule, Location, NgOptimizedImage} from "@angular/common";
import {UsersComponent} from "../users/users.component";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {FollowerService} from "../follower.service";
import {ActivatedRoute} from "@angular/router";
import {CurrentUserService} from "../current-user.service";
import {Router} from "@angular/router";
import {window} from "rxjs";
import {Comment} from "../comment";


@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, UsersComponent, FormsModule, RouterLink, NgOptimizedImage],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
  product: Product = {} as Product;
  rating: number = 0;
  count: number = 0;
  user: User = {} as User;
  seller: User = {} as User;
  favorite: boolean = false;
  seller_followers: number = 0;
  isFollowingSeller: boolean = false;
  other_products: Product[] = [];
  productService: ProductService = inject(ProductService);
  favoriteService: FavoriteService = inject(FavoriteService);
  followerService: FollowerService = inject(FollowerService);
  currentUserService: CurrentUserService = inject(CurrentUserService);
  comments: Comment[] = [];
  userService: UserService = inject(UserService);

  constructor(private router: ActivatedRoute, private location: Location) {
    let productID = this.router.snapshot.paramMap.get('product_id');

    if (typeof productID === "string") {
      this.productService.getProduct(parseInt(productID))
        .then((product: Product) => {
          console.log("Got the product: ", product);
          this.product = product;
          this.productService.getSeller(this.product.id).then((seller: User) => {
            this.seller = seller;
            console.log("Got the seller: ", this.seller, " for product: ", this.product);
            this.followerService.getNumFollowers(this.seller.id).then((followers: number) => {
              console.log("Number of followers: ", followers, " for user: ", this.seller);
              this.seller_followers = followers;
              console.log(" Favorite: ", this.favorite, " Followers: ", this.seller_followers);
            });
            this.followerService.getFollowers(this.seller.id).then((followers: User[]) => {
              console.log("Followers: ", followers, " for user: ", this.seller);
              if (followers.find(f => f.id == this.user.id)) {
                console.log("User is following seller: ", this.seller);
                this.isFollowingSeller = true;
              } else {
                console.log("User is not following seller: ", this.seller);
                this.isFollowingSeller = false;
              }
            });
            this.productService.getUserProducts(this.seller.id).then((products: Product[]) => {
              console.log("Other Products: ", products, " for seller: ", this.seller);
              for (let product of products) {
                if (product.id != this.product.id) {
                  this.other_products.push(product);
                  console.log("Other Products: ", this.other_products);
                }
              }
            });
            this.userService.getUserComments(this.seller.id)
              .then((comments: Comment[]) => {
                this.comments = comments;
                for (let comment of this.comments) {
                  this.userService.getUser(comment.user_id)
                    .then((user: User) => {
                      comment.image = user.image_base64
                      comment.name = user.name
                      const me = localStorage.getItem('id')
                      if (user.admin || (me && parseInt(me) === user.id)) {
                        comment.alter = true
                      }
                      this.count = this.count + 1;
                      console.log("Count: ", this.count)
                      console.log("Comment Rating: ", comment.rating)
                      this.rating = this.rating + comment.rating;
                      console.log("Our Rating: ", this.rating)
                      console.log(comment)
                      this.updateRating(); // Move the rating update here
                    })
                    .catch((error) => {
                      console.error('Error fetching user:', error);
                    });
                }
              })
              .catch((error) => {
                console.error('Error fetching comments:', error);
              });
          });
        });
    }

    this.currentUserService.getCurrentUser().then((user: User) => {
      console.log("Got the user: ", user);
      this.user = user;
      this.favoriteService.getFavoriteProducts(this.user.id).then((products: Product[]) => {
        if (products.find(p => !(this.product) || p.id == this.product.id)) {
          console.log("Product is a favorite of the user: ", this.user);
          this.favorite = true;
        } else {
          console.log("Product is not a favorite of the user: ", this.user);
          this.favorite = false;
        }
      });
    });
  }

  // Move the rating update logic to a separate function
  updateRating() {
    if (this.count > 0) {
      this.rating = this.rating / this.count;
      // Round to 1 decimal place
      this.rating = Math.round(this.rating * 10) / 10;
      console.log("Rating: ", this.rating);
    } else {
      console.log("No comments available, rating set to 0");
    }
  }

  addFavorite(product_id: number) {
    this.favoriteService.addFavorite(product_id).then(r => {
      console.log(r);
    });
    location.reload();
  }

  removeFavorite(id: number) {
    this.favoriteService.removeFavorite(id).then(r => {
      console.log(r);
    });
    location.reload();
  }


  deleteProduct(id: number) {
    this.productService.deleteProduct(id).then(r => {
      console.log(r);
    });
    //location.reload();
  }

  followUser(seller_id: number, user_id: number) {
    this.followerService.followUser(seller_id, user_id).then(r => {
      console.log(r);
    });
    location.reload();
  }

  unfollowUser(seller_id: number, user_id: number) {
    this.followerService.unfollowUser(seller_id, user_id).then(r => {
      console.log(r);
    });
    location.reload();
  }

  reload(){
    location.reload();
  }

  goBack(): void {
    this.location.back();
  }
}

