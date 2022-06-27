import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { News } from "./news.model";
import { HttpClient } from "@angular/common/http";
import { DataService } from "../data.service";

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  news : News[] = [];
  newsSubject : BehaviorSubject<News[]> = new BehaviorSubject<News[]>([]);

  constructor(private http:HttpClient, private dataService:DataService) {
    this.init();
  }

  init() {
    this.dataService.getAllNews()
      .subscribe(res  => {
        // @ts-ignore
        this.news = res.data;
        this.newsSubject.next(this.news);
      });
  }

  getAllNews() {
    return this.newsSubject;
  }

  getOneNews(id: number) {
    let tempNews: News = new News();
    for (let n in this.news) {
      if (this.news[n]._id == id) {
        tempNews = this.news[n];
      }
    }
    return tempNews;
  }

  addNews(news: News) {
    this.dataService.addNews(news)
      .subscribe(res => {
        // @ts-ignore
        let id = res.id;
        if (typeof id === "number") {
          news._id = id;
        } else {
          news._id = -1;
        }
        this.news.push(news);
        this.newsSubject.next(this.news);
      });
  }

  deleteNews(id : number) {
    this.dataService.deleteNews(id)
      .subscribe(res => {
        this.news = this.news.filter(n => n._id != id);
        this.newsSubject.next(this.news);
      });
  }

  editNews(news : News) {
    this.dataService.editNews(news)
      .subscribe(res => {
        for (let n in this.news) {
          if (this.news[n]._id == news._id) {
            this.news[n] = news;
          }
        }
      });
  }
}
