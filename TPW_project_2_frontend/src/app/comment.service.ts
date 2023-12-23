import {Injectable} from '@angular/core';
import {Comment} from "./comment";
@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl: string = "http://zemendes.pythonanywhere.com/ws/";

  constructor() { }

  async removeComment(id: number): Promise<Response> {
    const url: string = this.baseUrl + "remove_comment/" + id;
    return await fetch(url, {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({id: id})
    });
  }

  async addComment(text: string, rating: number, user_id: number, seller_id: number): Promise<Comment> {
    const url: string = this.baseUrl + "add_comment";
    const data: Response = await fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        text: text,
        rating: rating,
        user_id: user_id,
        seller_id: seller_id
      })
    });
    return await data.json();
  }


}
