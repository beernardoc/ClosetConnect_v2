import {Component, inject, Input} from '@angular/core';
import {User} from "../user";
import {CurrentUserService} from "../current-user.service";
import {FollowerService} from "../follower.service";
import {Location, NgIf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../user.service";
import {LoadingComponent} from "../loading/loading.component";

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [
    NgIf,
    LoadingComponent
  ],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css'
})
export class ProfileHeaderComponent {
  @Input() user!: User;
  @Input() followers!: number;
  @Input() following!: number;
  @Input() seller!: boolean;

  at: string = '@';
  currentUser: User = {} as User;
  isFollowing!: boolean ;
  currentUserService: CurrentUserService = inject(CurrentUserService);
  followerService: FollowerService = inject(FollowerService);
  userService: UserService = inject(UserService);
  load: boolean = true;

  constructor(private router: ActivatedRoute, private location: Location) {
    let username = this.router.snapshot.paramMap.get('username');
    if (!username) {
      this.load = false;
    }
    if (typeof username === "string") {
      this.userService.getUserByUsername(username)
        .then((user: User) => {
          this.user = user;
          this.currentUserService.getCurrentUser().then((user: User) => {
            this.currentUser = user;
            this.followerService.getFollowers(this.user.id).then((followers: User[]) => {
              if (followers.find(f => f.id == this.currentUser.id)) {
                console.log("User is following seller: ", this.user);
                this.isFollowing = true;
              } else {
                console.log("User is not following seller: ", this.user);
                this.isFollowing = false;
              }
              this.load = false;
            });
          });
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
        });
    }
  }

  followUser(): void {
    this.followerService.followUser(this.user.id, this.currentUser.id)
      .then(() => {
        console.log("User followed");
      })
      .catch((error) => {
        console.error('Error following user:', error);
      });
  }

  unfollowUser(): void {
    this.followerService.unfollowUser(this.user.id, this.currentUser.id)
      .then(() => {
        console.log("User unfollowed");
      })
      .catch((error) => {
        console.error('Error unfollowing user:', error);
      });
  }

  changeFollow(): void {
    if (this.isFollowing) {
      this.unfollowUser();
      this.isFollowing = false;
      this.followers--;
    } else {
      this.followUser();
      this.isFollowing = true;
      this.followers++;
    }
  }
}
