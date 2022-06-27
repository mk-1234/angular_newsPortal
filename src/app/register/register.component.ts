import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {User} from "./user.model";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {UserService} from "./user.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = this.fb.group({
    'username' : new FormControl('', [Validators.required, Validators.minLength(3)]),
    'password' : new FormControl('', Validators.required),
    'repeat-password' : new FormControl('', Validators.required),
    'first-name' : new FormControl('', Validators.required),
    'last-name' : new FormControl('', Validators.required),
    'email' : new FormControl('', [Validators.required, Validators.email]),
  });

  wrongPass : boolean = false;
  errorMsg: string = '';

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private userService: UserService) { }

  ngOnInit(): void {
    this.userService.errorEmmiter.subscribe(res => this.errorMsg = res);
  }

  onSubmit() {

    if(this.registerForm.value['password'] != this.registerForm.value['repeat-password']) {
      this.wrongPass = true;
    } else {
      this.wrongPass = false;

      if (this.registerForm.valid) {
        let newUser: User = {
          _id: -1,
          username: this.registerForm.value['username'],
          password: this.registerForm.value['password'],
          firstname: this.registerForm.value['first-name'],
          lastname: this.registerForm.value['last-name'],
          email: this.registerForm.value['email'],
          level: 2,
          salt: ''
        };
        this.userService.addUser(newUser);
      }
    }
  }

  setClass() {
    if (this.registerForm.valid) {
      return {'color': 'green', 'background-color': 'rgba(250, 235, 215, 0.5)'};
    } else {
      return {'color': 'rgba(100, 100, 100, 0.7)'};
    }
  }

}
