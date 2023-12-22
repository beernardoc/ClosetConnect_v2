
import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";

@Injectable(
  { providedIn: 'root' }
)
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {

    if (localStorage.getItem('token') != null) {
      return true;
    }

    else {
      // Redirecione para a página de login se não estiver autenticado
      this.router.navigate(['/login']);
      return false;
    }

  }
}
