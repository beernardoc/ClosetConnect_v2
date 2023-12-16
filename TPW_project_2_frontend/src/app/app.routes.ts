import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {IndexComponent} from "./index/index.component";
import {RegisterComponent} from "./register/register.component";
import {CartComponent} from "./cart/cart.component";
import {AdminComponent} from "./admin/admin.component";

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cart', component: CartComponent },
  { path: 'admin', component: AdminComponent}
];
