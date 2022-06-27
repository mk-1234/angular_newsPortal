import { Injectable } from '@angular/core';
import {environment} from "../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {News} from "./news/news.model";
import {Comment} from "./comments/comment.model";
import {User} from "./register/user.model";
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  newsUrl = environment.API_URL + '/api/news';
  commentsUrl = environment.API_URL + '/api/comments';
  usersUrl = environment.API_URL + '/api/users';
  authUrl = environment.API_URL + '/authenticate';

  appId: string = '9d51a9159961788b8b930dec43141710';
  cityUrl: string = 'http://api.openweathermap.org/geo/1.0/direct';
  weatherUrl: string = 'http://api.openweathermap.org/data/2.5/weather';

  constructor(private http:HttpClient) { }


  // --- NEWS ---

  getAllNews() {
    return this.http.get(this.newsUrl);
  }

  addNews(news : News) {
    return this.http.post(this.newsUrl, news);
  }

  deleteNews(id : number) {
    return this.http.delete(this.newsUrl + `/${id}`);
  }

  editNews(news : News) {
    return this.http.put(this.newsUrl, news);
  }


  // --- COMMENTS ---

  getComments(){
    return this.http.get(this.commentsUrl);
  }

  addComment(comment : Comment){
    return this.http.post(this.commentsUrl, comment);
  }

  deleteComment(id : number){
    return this.http.delete(this.commentsUrl + `/${id}`);
  }

  editComment(comment : Comment){
    return this.http.put(this.commentsUrl, comment);
  }


  // --- USERS ---

  getUsers() {
    return this.http.get(this.usersUrl);
  }

  addUser(user : User) {
    return this.http.post(this.authUrl, user);
  }

  deleteUser(id : number) {
    return this.http.delete(this.usersUrl + `/${id}`);
  }

  editUser(user : User) {
    return this.http.put(this.usersUrl, user);
  }

  // --- WEATHER ---

  getCity() {
    return this.http.get(`${this.cityUrl}?q=Zagreb&limit=5&appid=${this.appId}`);
  }

  getWeather(lat: number, lon: number) {
    return this.http.get(`${this.weatherUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${this.appId}`);
  }

  // --- EXCHANGE ---

  getTime() {
    return this.http.get('https://api.coinbase.com/v2/time');
  }

  getPrice(crypto: string, currency: string) {
    return this.http.get(`https://api.coinbase.com/v2/prices/${crypto}-${currency}/spot`);
  }

}
