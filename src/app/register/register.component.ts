import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../service/auth/auth.service';
import { User } from '../api/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  name = new FormControl('', [Validators.required]);
  pass = new FormControl('', [Validators.required]);
  hide = true;

  model: any = {};
  private _url =
    "http://127.0.0.1:5000/put?"

  constructor(private router: Router,
    private http: HttpClient, private authService: AuthService) { }

  addUser(name: string, mail: string, password: string) {
    console.log(name);
    console.log(mail);
    console.log(password);
    const newUrl = this._url + "name=" + name + "&mail=" + mail + "&password=" + password;
    this.http.get(newUrl).subscribe((row: Object) => {
      if (row['row']) {
        console.log('user created');
        this.authService.setUser(new User(name, mail));
        this.router.navigate(['/']);
      }
      else {
        console.log('user creation failed');
      }
    })
  }

  getErrorMessage() {
    if (this.email) {
      return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' : '';
    }
    else {
      if (this.name) {
        return this.name.hasError('required') ? 'You must enter a value' : '';
      }
      else {
        if (this.pass) {
          return this.pass.hasError('required') ? 'You must enter a value' : '';
        }
      }
    }
  }
}
