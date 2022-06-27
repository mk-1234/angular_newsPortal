import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {User} from "./user.model";
import {BehaviorSubject, Subject} from "rxjs";
import {DataService} from "../data.service";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  usersUrl = environment.API_URL + '/api/users';
  authUrl = environment.API_URL + '/authenticate';

  users: User[] = [];
  usersSubject : BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  errorEmmiter: Subject<string> = new Subject<string>();


  constructor(private http:HttpClient, private dataService: DataService, private router: Router) {
    this.init();
  }

  init() {
    this.dataService.getUsers()
      .subscribe(res => {
        // @ts-ignore
        this.users = res.data;
        this.usersSubject.next(this.users);
      });
  }

  getUsers() {
    return this.usersSubject;
  }

  getUserById(id: number) {
    let tempUser: User = new User();
    for (let u in this.users) {
      if (this.users[u]._id == id) {
        tempUser = this.users[u];
      }
    }
    return tempUser;
  }

  addUser(user: User) {
    this.dataService.addUser(user)
      .subscribe(res => {
        // @ts-ignore
        if (res.status == 'NOT OK') {
          // @ts-ignore
          this.errorEmmiter.next(res.description);
          this.router.navigate(['register']);
        } else {
          if (typeof res === "number") user._id = res;
          this.users.push(user);
          this.usersSubject.next(this.users);
          this.router.navigate(['login']);
        }
      });
  }

  deleteUser(id : number) {
    this.dataService.deleteUser(id)
      .subscribe(res => {
        this.users = this.users.filter(u => u._id != id);
        this.usersSubject.next(this.users);
      });
  }

  editUser(user: User) {
    this.dataService.editUser(user)
      .subscribe(res => {
        for (let u in this.users) {
          if (this.users[u]._id == user._id) {
            this.users[u] = user;
          }
        }
      });
  }

}
