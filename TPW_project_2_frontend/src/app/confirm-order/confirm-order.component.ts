import {Component, inject} from '@angular/core';
import {CartService} from "../cart/cart.service";
import {NgForOf} from "@angular/common";
import {FormsModule, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {base64toBlob} from "../utils";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {ConfirmOrderService} from "./confirm-order.service";
@Component({
  selector: 'app-confirm-order',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './confirm-order.component.html',
  styleUrl: './confirm-order.component.css'
})
export class ConfirmOrderComponent {

  form: FormGroup;

  imagens: any[] = [];
  products: any[] = [];
  cartinfo: any[] = [];
  price: number = 0;
  cartService: CartService = inject(CartService);
  confirmOrderService: ConfirmOrderService = inject(ConfirmOrderService);
  confirmOrder: boolean | undefined;

  constructor(private fb: FormBuilder, private router: Router, private sanitizer: DomSanitizer) {
    this.form = this.fb.group({
      Name: ['', Validators.required],
      Email: ['', [Validators.required, this.emailValidator]],
      Address: ['', Validators.required],
      Phone: ['', Validators.required],
      Observation: ['']
    });


    this.cartService.getProducts().then((result: any) => {
      this.cartinfo = this.convertObjectToArray(result['cart']);
      this.products = this.convertObjectToArray(result['cart_items']);
      this.price = result['price'];

      // Iteração sobre o array
      this.products.forEach(produto => {
        // Iteração sobre o array de valores em cada objeto
        produto.value.forEach((item: { product_image: string; }) => {
          // Converta a imagem para Blob
          const blob: Blob = base64toBlob(item.product_image, "image/jpg");

          // Substitua a string base64 pelo Blob no objeto
          this.imagens.push(blob);
        });
      });



    });


  }

  private convertObjectToArray(obj: any): { key: string, value: any }[] {
    return Object.keys(obj).map(key => ({ key, value: obj[key] }));
  }

  sendForm(): void {
    if (this.form.valid) {
      this.confirmOrderService.confirmOrder().then((result: any) => {
        this.confirmOrder = true;
      });
    } else {
      console.log('Formulário inválido. Verifique os campos.');
    }
  }

  emailValidator: ValidatorFn = (control: AbstractControl) => {
    const value = control.value as string;

    if (!value) {
      return null;
    }

    if (!value.includes('@')) {
      return { invalidEmail: true };
    }

    return null;
  };

  getImageUrl(index: number): SafeUrl {
    // Certifique-se de importar SafeUrl e DomSanitizer do Angular
    const imageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.imagens[index]));
    return imageUrl;
  }



}
