import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl: string = "http://localhost:8000/ws/";

  constructor() { }

  async removeComment(id: number): Promise<Response> {
    const url: string = this.baseUrl + "remove_comment/" + id;
    return await fetch(url, {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({id: id})
    });
  } catch (error: any) {
    console.log("Error deleting comment:", error);
    return error;
  }
}
