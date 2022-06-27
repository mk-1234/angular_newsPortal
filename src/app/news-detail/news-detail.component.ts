import { Component, OnInit } from '@angular/core';
import {News} from "../news/news.model";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {User} from "../register/user.model";
import {NewsService} from "../news/news.service";
import {AuthService} from "../auth.service";
import {UserService} from "../register/user.service";

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.css']
})
export class NewsDetailComponent implements OnInit {

  articleForm = this.fb.group({
    'title' : new FormControl('', Validators.required),
    'category' : new FormControl(''),
    'photo' : new FormControl(''),
    'summary' : new FormControl('', Validators.required),
    'article' : new FormControl('', Validators.required)
  });

  news: News = new News();

  currentNews: News = new News();
  currentNewsWithUsername: any;
  writingArticle: boolean = false;
  editingArticle: boolean = false;
  writerLoggedIn: boolean = false;
  mayWrite: boolean = false;

  user: User = new User();

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private newsService: NewsService,
              private authService: AuthService,
              private router: Router,
              private userService: UserService) { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    let id = this.route.snapshot.params['newsDetail'];
    if (id != -1) {
      this.currentNews = this.newsService.getOneNews(id);
      this.writingArticle = false;

      this.currentNewsWithUsername = {...this.currentNews};
      this.currentNewsWithUsername.username = this.userService.getUserById(
        this.currentNewsWithUsername.author
      ).username;

    } else {
      this.writingArticle = true;
      this.articleForm.controls['category'].setValue('Domestic');
    }
    this.user = this.authService.getUser();
    if (this.user._id != -1 && this.user.username != '') {
      if (this.user._id == this.currentNews.author) {
        this.writerLoggedIn = true;
      } else {
        this.writerLoggedIn = false;
      }
      if (this.user.level < 2) {
        this.mayWrite = true;
      } else {
        this.mayWrite = false;
      }
    }
  }

  onSubmit() {
    let newNews: News = new News();
    newNews.author = this.user._id;
    newNews.title = this.articleForm.value['title'];
    newNews.category = this.articleForm.value['category'];
    newNews.timestamp = new Date();
    newNews.summary = this.articleForm.value['summary'];
    newNews.article = this.articleForm.value['article'];

    if (this.articleForm.value['photo'] == '') {
      if (this.currentNews.photo == '') {
        newNews.photo = 'pic.jpg';
      } else {
        newNews.photo = this.currentNews.photo;
      }
    } else {
      newNews.photo = this.articleForm.value['photo'];
    }

    if (this.editingArticle) {
      newNews._id = this.currentNews._id;
      this.newsService.editNews(newNews);
      this.currentNews = newNews;
      this.editingArticle = false;
      this.writingArticle = false;
    } else {
      this.newsService.addNews(newNews);

      this.currentNews = newNews;
      this.writingArticle = false;
      this.currentNewsWithUsername = {...this.currentNews};
      this.currentNewsWithUsername.username = this.user.username;

      if (this.user._id == this.currentNews.author) {
        this.writerLoggedIn = true;
      } else {
        this.writerLoggedIn = false;
      }

      this.router.navigate(['/']);

    }
  }

  startEdit() {
    this.articleForm.controls['title'].setValue(this.currentNews.title);
    this.articleForm.controls['category'].setValue(this.currentNews.category);
    this.articleForm.controls['photo'].setValue('');
    this.articleForm.controls['summary'].setValue(this.currentNews.summary);
    this.articleForm.controls['article'].setValue(this.currentNews.article);
    this.editingArticle = true;
    this.writingArticle = true;
  }

  cancelEdit() {
    if (this.editingArticle) {
      this.editingArticle = false;
      this.writingArticle = false;
    } else {
      this.router.navigate(['../']);
    }
  }

  delete() {
    this.newsService.deleteNews(this.currentNews._id);
    this.router.navigate(['../']);
  }

  setClass() {
    if (this.articleForm.valid) {
      return {'color': 'green', 'background-color': 'rgba(250, 235, 215, 0.5)'};
    } else {
      return {'color': 'rgba(100, 100, 100, 0.7)'};
    }
  }

}
