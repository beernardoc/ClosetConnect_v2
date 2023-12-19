import {Component, inject} from '@angular/core';
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

  currentUserService: CurrentUserService = inject(CurrentUserService)

  updatePicForm!: FormGroup;
  updateProfileForm!: FormGroup;
  updatePasswordForm!: FormGroup;
  passwordMismatch: boolean = false;
  oldPasswordIncorrect: boolean = false;

  selectedFile!: File;

  constructor(private formBuilder: FormBuilder) {
    this.currentUserService.getCurrentUser()
      .then((user: User) => {
        this.user = user;
        this.updateProfileForm.patchValue({
          username: this.user.username,
          name: this.user.name,
          email: this.user.email,
          description: this.user.description
        });
      })
      .catch((error) => {
        console.error('Error fetching current user:', error);
      });

    this.updatePicForm = this.formBuilder.group({
      image: ['', [Validators.required]]
    });

    this.updateProfileForm = this.formBuilder.group({
      username: [this.user.username, [Validators.required]],
      name: [this.user.name, [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.email]],
      description: [this.user.description]
    });

    this.updatePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
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

  onSubmitProfile(): void {
    if (this.updateProfileForm.valid) {
      this.user.username = this.updateProfileForm.value.username;
      this.user.name = this.updateProfileForm.value.name;
      this.user.email = this.updateProfileForm.value.email;
      this.user.description = this.updateProfileForm.value.description;
      this.currentUserService.updateProfile(this.user)
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
    }
    else {
      // Check if any of the fields are dirty (touched or modified)
      this.updateProfileForm.markAllAsTouched();
      console.log('Invalid form submitted');
      console.log(this.updateProfileForm);
    }
  }

  onSubmitPassword(): void {
    // clear error messages
    this.passwordMismatch = false;
    this.oldPasswordIncorrect = false;


    if (this.updatePasswordForm.valid) {
      if (this.updatePasswordForm.value.oldPassword !== this.user.password) {
        this.oldPasswordIncorrect = true;
        return;
      }
      else if (this.updatePasswordForm.value.newPassword !== this.updatePasswordForm.value.confirmPassword) {
        this.passwordMismatch = true;
        return;
      }
      else {
        this.user.password = this.updatePasswordForm.value.newPassword;
        this.currentUserService.updateProfile(this.user)
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
      }
    }
    else {
      // Check if any of the fields are dirty (touched or modified)
      this.updatePasswordForm.markAllAsTouched();
      console.log('Invalid form submitted');
      console.log(this.updatePasswordForm);
    }
  }

  deleteAccount(): void {
    this.currentUserService.deleteProfile(this.user)
      .then((success: boolean) => {
        if (success) {
          // redirect to home page
          window.location.href = "/";
          // remove user from local storage to log user out
          localStorage.removeItem('username');
          localStorage.removeItem('id');
        } else {
          // Display error message, user does not exist
          console.log("Error deleting user");
        }
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  }


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

}
