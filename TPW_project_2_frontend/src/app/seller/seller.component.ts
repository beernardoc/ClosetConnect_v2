import {Component, inject, Input} from '@angular/core';
import {CurrentUserService} from "../current-user.service";
import {FollowerService} from "../follower.service";
import {ProductService} from "../product.service";
import {User} from "../user";
import {Product} from "../product";
import {CommonModule, Location} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {UserService} from "../user.service";
import {Comment} from "../comment";

@Component({
  selector: 'app-seller',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './seller.component.html',
  styleUrl: './seller.component.css'
})
export class SellerComponent {
  @Input() user: User = {
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
  comments: Comment[] = [];

  followerService: FollowerService = inject(FollowerService);
  productService: ProductService = inject(ProductService);
  userService: UserService = inject(UserService);

  constructor(private router: ActivatedRoute, private location: Location) {
    let username = this.router.snapshot.paramMap.get('username');
    if (typeof username === "string") {
      this.userService.getUserByUsername(username)
        .then((user: User) => {
          this.user = user;
          console.log(this.user);

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

          this.userService.getUserComments(this.user.id)
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
                    console.log(comment)
                  })
                  .catch((error) => {
                    console.error('Error fetching user:', error);
                  });
              }
            })
            .catch((error) => {
              console.error('Error fetching comments:', error);
            });
        })
        .catch((error) => {
          console.error('Error fetching current user:', error);
        });
    }
  }
}
