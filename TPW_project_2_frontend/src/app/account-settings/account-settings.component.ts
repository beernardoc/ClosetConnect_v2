import { Component } from '@angular/core';
import {CurrentUserService} from "../current-user.service";
import {User} from "../user";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {getBase64} from "../utils";

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css'
})
export class AccountSettingsComponent {
  user: User = {
    id: 0,
    username: "",
    name: "",
    email: "",
    password: "",
    admin: false,
    image: "",
    description: "",
    sold: 0,
    image_base64: ""
  };
  at: string = "@";

  currentUserService: CurrentUserService = new CurrentUserService();

  updatePicForm!: FormGroup;
  selectedFile!: File;

  constructor(private formBuilder: FormBuilder) {
    this.currentUserService.getCurrentUser()
      .then((user: User) => {
        this.user = user;
        })
      .catch((error) => {
        console.error('Error fetching current user:', error);
      });

    this.updatePicForm = this.formBuilder.group({
      image: ['', [Validators.required]]
    });
  }

  onSubmitPic(): void {
    if (this.updatePicForm.valid) {
      // this.user.image = this.selectedFile;
      getBase64(this.selectedFile)
        .then((base64: string) => {
          // only get the base64 string out of the blob
          base64 = base64.split(',')[1];
          this.user.image_base64 = base64;
          this.user.image = base64;
          console.log(this.user);
          this.currentUserService.updateUser(this.user)
            .then((success: boolean) => {
              if (success) {
                // reload page
                window.location.reload();
              } else {
                // Display error message, user does not exist
                console.log("Error updating user");
              }
            })
            .catch((error) => {
              console.error('Error updating user:', error);
            });
        })
        .catch((error) => {
          console.error('Error getting base64:', error);
        });

    } else {
      // Check if any of the fields are dirty (touched or modified)
      this.updatePicForm.markAllAsTouched();
      console.log('Invalid form submitted');
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

}
