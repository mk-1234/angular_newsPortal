import { Component, OnInit } from '@angular/core';
import { News} from "./news.model";
import {Router} from "@angular/router";
import {User} from "../register/user.model";
import {NewsService} from "./news.service";
import {AuthService} from "../auth.service";
import {BehaviorSubject, Subscription} from "rxjs";
import {UserService} from "../register/user.service";
import { DataService } from '../data.service';
import {map} from "rxjs";

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  news: News[] = [];
  newsSubject : BehaviorSubject<News[]> = new BehaviorSubject<News[]>([]);
  subscription : Subscription = new Subscription();

  newsWithUsername: any[] = [];

  categories : string[] = ['Domestic', 'International', 'Entertainment', 'Sport'];

  user: User = new User();
  loggedIn: boolean = false;
  mayWrite: boolean = false;
  authenticated: boolean = false;

  users: User[] = [];
  usersSubject : BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  subscriptionUser: Subscription = new Subscription();

  isLoading: boolean = true;

  cryptos = ['BTC', 'ETH', 'DOGE'];
  currency: string = 'USD';
  timeData: Date = new Date();
  priceData: {amount: number, base: string, currency: string} = {amount: 0, base: '', currency: ''};
  allPrices: any = [];
  allRetrieved: boolean = false;
  errorMsg: string = '';

  city: {name: string, country: string, lat: number, lon: number, temperature: number} = {name: '', country: '', lat: 0, lon: 0, temperature: 0};
  weatherIcon: string = '';
  weatherMain: string = '';
  weatherDesc: string = '';
  catFact: string = '';
  dogImage: string = '';

  constructor(private router: Router,
              private newsService: NewsService,
              private authService: AuthService,
              private userService: UserService,
              private dataService: DataService) { }

  ngOnInit(): void {

    this.newsSubject = this.newsService.getAllNews();
    this.subscription = this.newsSubject.subscribe(res => {
      this.news = res;
      this.usersSubject = this.userService.getUsers();
      this.subscriptionUser = this.usersSubject.subscribe(_res => {
        this.users = _res;
        this.newsWithUsername = [];
        for (let n in this.news) {
          let newsUsername: any = {...this.news[n]};
          newsUsername.username = 'abc';

          for (let u in this.users) {
            if (this.users[u]._id == newsUsername.author) {
              newsUsername.username = this.users[u].username;
            }
          }
          this.newsWithUsername.push(newsUsername);
        }
        this.isLoading = false;
      });
    });

    this.authService.authChange
      .subscribe(res => {
        if (res) {
          this.user = this.authService.getUser();
          this.ngOnInit();
        } else {
          this.router.navigate(['/']);
        }
      });

    this.getCity();
    this.getCryptoValues();

    this.user = this.authService.getUser();

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

    if (this.currency == '') {
      this.errorMsg = '';
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

  getCity() {
    this.dataService.getCity().subscribe(res => {
      // @ts-ignore
      this.city = {name: res[0].name, country: res[0].country, lat: res[0].lat, lon: res[0].lon};

      this.dataService.getWeather(this.city.lat, this.city.lon).subscribe(_res => {
        // @ts-ignore
        this.city.temperature =Math.round(_res.main.temp);
        // @ts-ignore
        this.weatherIcon = `http://openweathermap.org/img/wn/${_res.weather[0].icon}@2x.png`;
        // @ts-ignore
        this.weatherMain = _res.weather[0].main;
        // @ts-ignore
        this.weatherDesc = _res.weather[0].description;
      });
    });
  }

  getCryptoValues() {
    if (!this.currency) {
      this.errorMsg = 'Currency not selected!';
      return;
    }
    this.errorMsg = '';
    this.dataService.getTime().subscribe(res => {
      // @ts-ignore
      this.timeData = res.data.iso;
    });
    let tempPrices: { amount: number; base: string; currency: string; }[] = [];
    for (let i = 0; i < 3; i++) {
      this.dataService.getPrice(this.cryptos[i], this.currency.toUpperCase()).subscribe(res => {
        if (this.allPrices.length > 0) this.allPrices = [];
        // @ts-ignore
        this.priceData = res.data;
        this.priceData.amount = Math.round(this.priceData.amount * 100) / 100;
        tempPrices.push(this.priceData);
        if (tempPrices.length == 3) {
          this.allRetrieved = true;
          this.allPrices = tempPrices;
        }
      }, err => {
        this.errorMsg = err.error.errors[0].message + '. Please enter correct name.';
      });
    }
    this.currency = '';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
