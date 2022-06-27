import { Component, OnInit } from '@angular/core';
import {News} from "../news/news.model";
import {Comment} from "../comments/comment.model";
import {User} from "../register/user.model";
import {ActivatedRoute, Router} from "@angular/router";
import {NewsService} from "../news/news.service";
import {AuthService} from "../auth.service";
import {BehaviorSubject, Subscription} from "rxjs";
import {CommentService} from "../comments/comment.service";
import {UserService} from "../register/user.service";
import { CommentsComponent } from '../comments/comments.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  news: News[] = [];
  newsSubject : BehaviorSubject<News[]> = new BehaviorSubject<News[]>([]);
  newsSubscription : Subscription = new Subscription();

  comments: Comment[] = [];
  commentsSubject: BehaviorSubject<Comment[]> = new BehaviorSubject<Comment[]>([]);
  commentsSubsciption: Subscription = new Subscription();

  users: User[] = [];
  usersSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  usersSubscription: Subscription = new Subscription();

  user: User = new User();
  userCurrentlyLoggedIn: User = new User();
  articles: News[] = [];

  maySeeComments: boolean = false;
  adminLoggedIn: boolean = false;
  onOwnProfile: boolean = false;

  commentsNmb: number = 0;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private newsService: NewsService,
              private authService: AuthService,
              private commentsService: CommentService,
              private userService: UserService) { }

  ngOnInit(): void {

    this.user = this.userService.getUserById(this.route.snapshot.params['id']);

    this.newsSubject = this.newsService.getAllNews();
    this.newsSubscription = this.newsSubject
      .subscribe((res: News[]) => {
        res.filter(n => {
          if (n.author == this.user._id) this.news.push(n);
        });
      });

    this.commentsSubject = this.commentsService.getComments();
    this.commentsSubsciption = this.commentsSubject
      .subscribe((res: Comment[]) => {
        res.filter(c => {
          if (c._idUser == this.user._id) this.comments.push(c);
        });
      });

    this.usersSubject = this.userService.getUsers();
    this.usersSubscription = this.usersSubject
      .subscribe((res: User[]) => {
        this.users = res;
      });

    if (this.user._id < 0) {
    } else {
      for (let n in this.news) {
        if (this.news[n].author == this.user._id) {
          this.articles.push(this.news[n]);
        }
      }

      this.userCurrentlyLoggedIn = this.authService.getUser();
      if (this.userCurrentlyLoggedIn._id < 0 || this.userCurrentlyLoggedIn.username == '') {
        this.maySeeComments = false;
      } else {
        if (this.userCurrentlyLoggedIn._id == this.user._id ||
            this.userCurrentlyLoggedIn.level == 0) {
          this.maySeeComments = true;
          if (this.userCurrentlyLoggedIn._id == this.user._id) {
            this.onOwnProfile = true;
          } else {
            this.onOwnProfile = false;
          }
          if (this.userCurrentlyLoggedIn.level == 0) {
            this.adminLoggedIn = true;
          } else {
            this.adminLoggedIn = false;
          }
        } else {
          this.maySeeComments = false;
        }
      }
    }
  }

  goToNews(id: number) {
    this.router.navigate([id]);
  }

  goToCategory(category: string) {
    this.router.navigate(['../../category', category]);
  }

  setCommentsNmb(nmb: number) {
    this.commentsNmb = nmb;
  }

  decreaseLevel(id: number) {
    let tempUser: User = new User;
    for (let u in this.users) {
      if (this.users[u]._id == id) {
        tempUser = {...this.users[u]};
        if (tempUser.level >= 2) {
          console.log('cannot decrease level further, level is ' + tempUser.level);
          return;
        } else {
          tempUser.level += 1;
          this.userService.editUser(tempUser);
          this.users[u].level = tempUser.level;
          if (this.user._id == id) this.user = {...this.users[u]};
        }
      }
    }
  }

  increaseLevel(id: number) {
    let tempUser: User = new User;
    for (let u in this.users) {
      if (this.users[u]._id == id) {
        tempUser = {...this.users[u]};
        if (tempUser.level <= 0) {
          console.log('cannot increase level further, level is ' + tempUser.level);
          return;
        } else {
          tempUser.level -= 1;
          this.userService.editUser(tempUser);
          this.users[u].level = tempUser.level;
          if (this.user._id == id) this.user = {...this.users[u]};
        }
      }
    }
  }

  banUser(id: number) {
    for (let u in this.users) {
      if (this.users[u]._id == id) {
        console.log('banning user ' + this.users[u].username);
        let temp: User = {...this.users[u]};
        temp.level = 3;
        this.userService.editUser(temp);
        this.users[u].level = temp.level;
        if (this.user._id == id) this.user = {...this.users[u]};
      }
    }
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id);
    let tempUsers: User[] = [];
    for (let u in this.users) {
      if (this.users[u]._id != id){
        tempUsers.push(this.users[u]);
      }
    }
    this.users = tempUsers;
  }

  selfDeleteUser(id: number) {
    this.userService.deleteUser(id);
    let tempUsers: User[] = [];
    for (let u in this.users) {
      if (this.users[u]._id != id){
        tempUsers.push(this.users[u]);
      }
    }
    this.users = tempUsers;
    this.authService.logout();
    this.router.navigate(['../../']);
  }

}
