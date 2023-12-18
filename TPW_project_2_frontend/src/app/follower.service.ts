import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FollowerService {
  private baseUrl: string = "http://localhost:8000/ws/";

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
}
