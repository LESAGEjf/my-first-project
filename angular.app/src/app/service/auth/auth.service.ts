import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/api/user';
import { HttpClient } from '@angular/common/http';
import { isNull } from 'util';

@Injectable()
export class AuthService {
  private _url =
    "http://127.0.0.1:5000/get?";

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute) { }

  login(mail: string, password: string) {
    const _newURL = this._url + "mail=" + mail + "&password=" + password;
    console.log(_newURL);
    const redirectUrl = this.route
      .snapshot.queryParams['redirectUrl'] || '/';

    this.http.get(_newURL).subscribe((user: User) => {
      if (Object.keys(user).length > 0) {
        console.log('ok');
        this.setUser(user);
        this.router.navigate([redirectUrl]);
      }
      else {
        console.log('ko');
        return false;
      }
    });
    return true;
  }

  logout() {
    this.clearUser();
    this.router.navigate(['/login']);
  }

  isLogged() {
    return !isNull(localStorage.getItem('user'));
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearUser() {
    localStorage.removeItem('user');
  }

}