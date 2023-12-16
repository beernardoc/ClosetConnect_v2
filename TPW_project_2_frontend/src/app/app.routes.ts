import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import {CartComponent} from "./cart/cart.component";

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'cart', component: CartComponent },

];
