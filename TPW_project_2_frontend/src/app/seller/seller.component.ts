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
import {FavoriteService} from "../favorite.service";
import {CommentService} from "../comment.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ProductComponent} from "../product/product.component";
import {ProfileHeaderComponent} from "../profile-header/profile-header.component";
import {LoadingComponent} from "../loading/loading.component";

@Component({
  selector: 'app-seller',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule, ProductComponent, ProfileHeaderComponent, LoadingComponent],
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
  currentUser : User = {} as User;
  followers: number = 0;
  following: number = 0;
  products: Product[] = [];
  comments: Comment[] = [];
  isFollowing: boolean = false;
  favoriteProducts: Product[] = [];
  commentForm!: FormGroup;
  selectedRating: string = "0";
  commentError: boolean = false;
  ratingError: boolean = false;
  load: boolean = true;

  followerService: FollowerService = inject(FollowerService);
  productService: ProductService = inject(ProductService);
  userService: UserService = inject(UserService);
  currentUserService: CurrentUserService = inject(CurrentUserService);
  favoriteService: FavoriteService = inject(FavoriteService);
  commentService: CommentService = inject(CommentService);

  constructor(private router: ActivatedRoute, private location: Location, private formBuilder: FormBuilder) {
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
          this.currentUserService.getCurrentUser().then((user: User) => {
            this.currentUser = user;
            this.followerService.getFollowers(this.user.id).then((followers: User[]) => {
              console.log("Followers: ", followers, " for user: ", this.user);
              if (followers.find(f => f.id == this.currentUser.id)) {
                console.log("User is following seller: ", this.user);
                this.isFollowing = true;
              } else {
                console.log("User is not following seller: ", this.user);
                this.isFollowing = false;
              }
            });

            this.productService.getUserProducts(this.user.id)
              .then((products: Product[]) => {
                this.products = products;
                this.favoriteService.getFavoriteProducts(this.currentUser.id)
                  .then((products: Product[]) => {
                    this.favoriteProducts = products;
                    for (let product of this.products) {
                      product.favorite = this.favoriteProducts.find(p => p.id == product.id) != undefined;
                    }
                  })
                  .catch((error) => {
                    console.error('Error fetching favorite products:', error);
                  });
                this.load = false;
              })
              .catch((error) => {
                console.error('Error fetching products:', error);
              });
          });
        })
        .catch((error) => {
          console.error('Error fetching current user:', error);
        });

      this.commentForm = this.formBuilder.group({
        comment: ['', [Validators.required]],
        rating_input: ['0', [Validators.required]]
      });
    }
  }

  removeComment(event : any): void {
    // get the comment id from the button id
    let commentId = event.target.id.split("_")[1];
    // remove the comment from the DOM
    let comment = document.getElementById("comment_" + commentId);
    comment?.remove();

    // remove the comment from the database
    this.commentService.removeComment(commentId)
      .then(() => {
        console.log("Removed comment from database");
      })
      .catch((error) => {
        console.error('Error removing comment from database:', error);
      });
  }

  onRatingChange(event : any): void {
    this.selectedRating = event.target.value;
  }

  onSubmit() {
    if (this.commentForm.valid && this.selectedRating != "0") {
      this.commentError = false;
      this.ratingError = false;
      let text = this.commentForm.value.comment;
      let rating = this.selectedRating;
      this.commentForm.reset();
      this.selectedRating = "0";

      // add the comment to the database
      this.commentService.addComment(text, parseInt(rating), this.currentUser.id, this.user.id)
        .then((comment: Comment) => {
          console.log("Added comment to database");
          this.comments.unshift({
            id: comment.id,
            text: text,
            rating: parseInt(rating),
            user_id: this.currentUser.id,
            seller_id: this.user.id,
            image: this.currentUser.image_base64,
            name: this.currentUser.name,
            alter: true
          });
        })
        .catch((error) => {
          console.error('Error adding comment to database:', error);
        });
    }
    else {
      // Display error message
      this.commentError = this.commentForm.value.comment == "" || this.commentForm.value.comment == null;
      this.ratingError = this.selectedRating == "0" || this.selectedRating == "";
    }
  }
}
