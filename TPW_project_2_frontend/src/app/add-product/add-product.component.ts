import {Component, inject, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ProductService} from "../product.service";
import {Product} from "../product";
import {getBase64} from "../utils";
import {routes} from "../app.routes";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
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

  form: FormGroup;
  productService: ProductService = inject(ProductService);
  selectedFile!: File;


  constructor(private fb: FormBuilder, private route: Router  ) {
    this.form = this.fb.group({
      Name: ['', Validators.required],
      Description: ['', Validators.required],
      Image: ['', Validators.required],
      Category: ['', Validators.required],
      Brand: ['', Validators.required],
      Color: ['', Validators.required ],
      Price: ['', Validators.required]

    });

  }

  onSubmit() {
    if(this.form.valid) {





      this.product.name = this.form.value.Name;
      this.product.description = this.form.value.Description;
      this.product.image = this.form.value.Image;
      this.product.category = this.form.value.Category;
      this.product.brand = this.form.value.Brand;
      this.product.color = this.form.value.Color;
      this.product.price = this.form.value.Price


      if (this.selectedFile == undefined) {
        this.productService.addProduct(this.product)
          .then((success: boolean) => {
            if (success) {
              this.route.navigate([`account/profile`])
            }
            else{
              console.log("Error adding product");
            }
          })
          .catch((error) => {
            console.error('Error adding product:', error);
          });
      }
      else {
        getBase64(this.selectedFile)
          .then((base64: string) => {
              base64 = base64.split(',')[1];
              this.product.image_base64 = base64;
              this.product.image = base64;

              this.productService.addProduct(this.product)
                .then((success: boolean) => {
                  if (success) {
                    this.route.navigate([`account/profile`])
                  }
                  else{
                    console.log("Error adding product");
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
    console.log("Form invalid");
  }
  }


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
}
