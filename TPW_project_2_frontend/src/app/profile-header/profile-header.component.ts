import {Component, inject, Input} from '@angular/core';
import {User} from "../user";
import {CurrentUserService} from "../current-user.service";
import {FollowerService} from "../follower.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [
    NgIf
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
  isFollowing: boolean = false;
  currentUserService: CurrentUserService = inject(CurrentUserService);
  followerService: FollowerService = inject(FollowerService);

  constructor() {
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
    });
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
