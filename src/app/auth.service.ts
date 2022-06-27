import { Injectable } from '@angular/core';
import {Comment} from "./comments/comment.model";
import {HttpClient} from "@angular/common/http";
import {DataService} from "./data.service";
import {User} from "./register/user.model";
import {Observable, Subject, map} from "rxjs";
import {environment} from "../environments/environment";
import {Router} from "@angular/router";
import {NewsService} from "./news/news.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user : User = new User();
  private token : string = '';
  errorEmitter : Subject<string> = new Subject<string>();
  authChange : Subject<boolean> = new Subject<boolean>();

  usersUrl: string = environment.API_URL + '/api/users';
  authUrl: string = environment.API_URL + '/authenticate';

  constructor(private http: HttpClient,
              private router: Router) { }

  login(credentials : {username : string, password : string}) {
    this.http.post<{status : number, description : string, user? : User, token? : string}>(this.authUrl, credentials)
      .subscribe((res : {status : number, description : string, user? : User, token? : string}) => {
        if (res.status == 200){
          if (res.user) this.user = res.user;
          if (res.token) this.token = res.token;
          sessionStorage.setItem('token', this.token);
          this.authChange.next(true);
          this.router.navigate(['/']);
        } else {
          this.errorEmitter.next(res.description)
        }
      })
  }

  logout() {
    this.user = new User();
    this.token = '';
    sessionStorage.removeItem('token');
    this.authChange.next(false);
  }

  getUser() {
    if (this.user) {
      return {...this.user};
    } else {
      return new User();
    }
  }

  getToken(){
    if (this.token) {
      return this.token;
    } else {
      if (sessionStorage.getItem('token')) {
        // @ts-ignore
        this.token = sessionStorage.getItem('token');
        return this.token;
      } else {
        return null;
      }
    }
  }


  isAuthenticated() {
    return this.user != null && this.user.username != '';
  }

  whoAmI() {
    if (this.getToken()) {
      return this.http.get<{status: number, user?: User}>(environment.API_URL + '/api/me')
        .pipe(map((res: { status: number, user?: User }) => {
          if (res.status == 200) {
            if (res.user) this.user = res.user;
            this.authChange.next(true);
          }
          return res;
        }))

    } else {
      return new Observable(observer => {
        observer.next({status:100})
      });
    }
  }

}
