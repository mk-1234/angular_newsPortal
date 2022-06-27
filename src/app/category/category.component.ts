import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {News} from "../news/news.model";
import {NewsService} from "../news/news.service";
import {User} from "../register/user.model";
import {AuthService} from "../auth.service";
import {BehaviorSubject, Subscription} from "rxjs";
import {UserService} from "../register/user.service";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  news: News[] = [];
  newsSubject : BehaviorSubject<News[]> = new BehaviorSubject<News[]>([]);
  subscription : Subscription = new Subscription();

  newsWithUsername: any[] = [];

  category : string = '';
  user: User = new User();
  loggedIn: boolean = false;
  mayWrite: boolean = false;
  authenticated: boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private newsService: NewsService,
              private authService: AuthService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.category = params['detail'];
      }
    )
    this.newsSubject = this.newsService.getAllNews();
    this.subscription = this.newsSubject
      .subscribe(res => this.news = res);

    this.user = this.authService.getUser();

    this.authService.authChange
      .subscribe(res => {
        if (res) {
          this.user = this.authService.getUser();
        } else {
          this.router.navigate(['/']);
        }
      });

    if (this.user._id < 0 || this.user.username == '') {
      this.authenticated = false;
      this.loggedIn = false;
    } else {
      this.authenticated = true;
      this.loggedIn = true;
      if (this.user.level < 2) {
        this.mayWrite = true;
      } else {
        this.mayWrite = false;
      }
    }

    for (let n in this.news) {
      let newsUsername: any = this.news[n];
      newsUsername.username = this.userService.getUserById(newsUsername.author).username;
      this.newsWithUsername.push(newsUsername);
    }
  }

  goToNews(i: number) {
    this.router.navigate([i]);
  }

  goToProfile(author: number) {
    this.router.navigate(['profile', author]);
  }

  logout() {
    this.user = new User();
    this.loggedIn = false;
    this.authenticated = false;
    this.authService.logout();
  }

}
