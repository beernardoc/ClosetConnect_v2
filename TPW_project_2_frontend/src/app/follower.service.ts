import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FollowerService {
  private baseUrl: string = "http://zemendes.pythonanywhere.com/ws/";

  constructor() { }

  async getNumFollowers(user_id: number): Promise<number> {
    const url: string = this.baseUrl + "user/followers/" + user_id;
    const data: Response = await fetch(url);
    return await data.json() ?? 0;
  }

  async getNumFollowing(user_id: number): Promise<number> {
    const url: string = this.baseUrl + "user/following/" + user_id;
    const data: Response = await fetch(url);
    return await data.json() ?? 0;
  }

  async getFollowers(user_id: number): Promise<any[]> {
    const url: string = this.baseUrl + "followers/" + user_id;
    const data: Response = await fetch(url);
    return await data.json() ?? [];
  }

  async followUser(user_id: number, follower_id: number): Promise<any> {
    const url: string = this.baseUrl + "follow_user/" + user_id;
    const data: Response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(
        {
          follower_id: follower_id
        }
      ),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await data.json() ?? [];
  }

  async unfollowUser(user_id: number, follower_id: number): Promise<any> {
    const url: string = this.baseUrl + "unfollow_user/" + user_id;
    const data: Response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(
        {
          follower_id: follower_id
        }
      ),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await data.json() ?? [];
  }
}
