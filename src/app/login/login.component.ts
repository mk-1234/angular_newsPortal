import { Component, OnInit } from '@angular/core';
import {User} from "../register/user.model";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";
import {map} from "rxjs";
import {UserService} from "../register/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = this.fb.group({
    'username' : new FormControl('', Validators.required),
    'password' : new FormControl('', Validators.required)
  });

  users : User[] = [];
  user: User = new User();
  errorMsg: string = '';

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService,
              private userService: UserService) { }

  ngOnInit(): void {

    this.authService.errorEmitter.subscribe(res => {
      this.errorMsg = res;
    });
  }

  onLogin() {
    this.authService.login(this.loginForm.value);
  }

  setClass() {
    if (this.loginForm.valid) {
      return {'color': 'green', 'background-color': 'rgba(250, 235, 215, 0.5)'};
    } else {
      return {'color': 'rgba(100, 100, 100, 0.7)'};
    }
  }

}
