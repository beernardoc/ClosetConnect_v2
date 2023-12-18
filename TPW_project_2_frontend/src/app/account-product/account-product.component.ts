import { Component, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Product } from "../product";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-account-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-product.component.html',
  styleUrl: './account-product.component.css'
})
export class AccountProductComponent {
  @Input() product: Product | undefined = undefined;

  constructor(private router: ActivatedRoute, private location: Location) {
    let productID = this.router.snapshot.paramMap.get('id');
    console.log(productID);
  }
}
