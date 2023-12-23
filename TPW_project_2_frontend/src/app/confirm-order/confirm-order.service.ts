import { Injectable } from '@angular/core';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ConfirmOrderService {
  private baseUrl: string = "http://localhost:8000/ws/";

  constructor(private router: Router) { }

  async confirmOrder(): Promise<any> {
    const url: string = this.baseUrl + "process_payment";
    const data: Response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({userid: localStorage.getItem("id") })
    });

    if (!data.ok) {
      throw new Error(data.statusText);
    }

    await this.router.navigate(['/']);

  }
}
