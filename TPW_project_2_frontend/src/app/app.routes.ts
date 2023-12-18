import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {IndexComponent} from "./index/index.component";
import {RegisterComponent} from "./register/register.component";
import {CartComponent} from "./cart/cart.component";
import {AdminComponent} from "./admin/admin.component";
import {AccountSettingsComponent} from "./account-settings/account-settings.component";
import {AuthGuard} from "./app.guard";
import {FavoritesComponent} from "./favorites/favorites.component";
import {AccountProfileComponent} from "./account-profile/account-profile.component";
import {AccountProductComponent} from "./account-product/account-product.component";
import {ConfirmOrderComponent} from "./confirm-order/confirm-order.component";

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent},
  { path: 'cart', component: CartComponent },
  { path: 'admin', component: AdminComponent},
  { path: 'account/settings', component: AccountSettingsComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'account/profile', component: AccountProfileComponent },
  { path: 'account/product/:id', component: AccountProductComponent },
  {path: 'cart/confirmOrder', component: ConfirmOrderComponent},
];
