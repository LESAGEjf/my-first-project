import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms'
import { AuthService } from '../service/auth/auth.service';
import { User } from '../api/user';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})
export class LoginComponent {

  userLocal: User;
  model: any = {};

  email = new FormControl('', [Validators.required, Validators.email]);
  pass = new FormControl('', [Validators.required]);
  hide = true;
  connectionError: boolean = false;

  constructor(private authService: AuthService) { }

  login(mail: string, password: string) {
    if (this.authService.login(mail, password)) {
      this.connectionError = true;
    }
  }

  getErrorMessage() {
    if (this.email) {
      return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' : '';
    }
    else {
      if (this.pass) {
        return this.pass.hasError('required') ? 'You must enter a value' : '';
      }
    }
  }
}