import { Component, inject, Input } from '@angular/core';
import {Product} from "../product";
import {CommonModule, Location} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ProductService} from "../product.service";
import {ActivatedRoute, Router} from "@angular/router";
import {getBase64} from "../utils";

@Component({
  selector: 'app-account-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-edit-product.component.html',
  styleUrl: './account-edit-product.component.css'
})
export class AccountEditProductComponent {
  @Input() product: Product = {
    id: 0,
    name: "",
    description: "",
    price: 0,
    image: "",
    user_id: 0,
    seen: 0,
    brand: "",
    category: "",
    color: "",
    image_base64: "",
    favorite: false
  }
  updateProductForm!: FormGroup;
  productService: ProductService = inject(ProductService);
  selectedFile!: File;

  constructor(private router: ActivatedRoute, private location: Location, private formBuilder: FormBuilder, private route: Router) {
    let productID  = this.router.snapshot.paramMap.get('id');

    if (typeof productID === "string") {
      this.productService.getProduct(parseInt(productID))
        .then((product: Product) => {
          this.product = product;
          this.updateProductForm.patchValue({
            name: this.product.name,
            description: this.product.description,
            image: "",
            category: this.product.category,
            brand: this.product.brand,
            color: this.product.color,
            price: this.product.price
          });
        })
        .catch((error) => {
          console.error('Error fetching product:', error);
        });

      this.updateProductForm = this.formBuilder.group({
        name: [this.product.name, [Validators.required]],
        description: [this.product.description, [Validators.required]],
        image: [''],
        category: [this.product.category, [Validators.required]],
        brand: [this.product.brand, [Validators.required]],
        color: [this.product.color, [Validators.required]],
        price: [this.product.price, [Validators.required]]
      });
    }
  }

  onSubmit() {
    if (this.updateProductForm.valid) {this.product.name = this.updateProductForm.value.name;
      this.product.description = this.updateProductForm.value.description;
      this.product.image = this.updateProductForm.value.image;
      this.product.category = this.updateProductForm.value.category;
      this.product.brand = this.updateProductForm.value.brand;
      this.product.color = this.updateProductForm.value.color;
      this.product.price = this.updateProductForm.value.price

      if (this.selectedFile == undefined) {
        this.productService.updateProduct(this.product)
          .then((success: boolean) => {
            if (success) {
              this.route.navigate([`account/product/${this.product.id}`])
                .then(() => {
                  window.location.reload();
                });
            }
          })
          .catch((error) => {
            console.error('Error updating product:', error);
          });
      }
      else {
        getBase64(this.selectedFile)
          .then((base64: string) => {
              base64 = base64.split(',')[1];
              this.product.image_base64 = base64;
              this.product.image = base64;

              this.productService.updateProduct(this.product)
                .then((success: boolean) => {
                  if (success) {
                    this.location.back();
                  }
                })
                .catch((error) => {
                  console.error('Error updating product:', error);
                });
            }
          )
          .catch((error) => {
            console.error('Error updating product:', error);
          });
      }
    }
    else {
      console.log(this.updateProductForm.value);
      console.log("Invalid form");
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
}
