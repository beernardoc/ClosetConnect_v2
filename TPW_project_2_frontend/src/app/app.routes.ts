import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import {CartComponent} from "./cart/cart.component";
import {AdminComponent} from "./admin/admin.component";

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'cart', component: CartComponent },
  { path: 'admin', component: AdminComponent}
];
