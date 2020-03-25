import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { isNull } from 'util';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const isLoggedIn = this.authService.isLogged();

    if (!isLoggedIn) {
      // Si pas d'utilisateur conecté : redirection vers la page de login
      console.log('Vous n\'êtes pas connectés');
      this.router.navigate(['/login'], { queryParams: { redirectUrl: state.url } });
    }
    return isLoggedIn;
  }
}