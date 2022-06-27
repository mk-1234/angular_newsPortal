import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { Comment } from "./comment.model";
import {CommentService} from "./comment.service";
import {User} from "../register/user.model";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {BehaviorSubject, Subscription} from "rxjs";
import {UserService} from "../register/user.service";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  @Input() _idNews: number = -1;
  @Input() user: User = new User();
  @Input() inProfile: boolean = false;

  @Output() commentsNmbEvent = new EventEmitter<number>();

  comments: Comment[] = [];
  commentsSubject : BehaviorSubject<Comment[]> = new BehaviorSubject<Comment[]>([]);
  subscription : Subscription = new Subscription();

  articleComments: any[] = [];
  writingComment: boolean = false;
  editingComment: boolean = false;
  userLoggedIn: boolean = false;
  newComment: Comment = new Comment();

  editIndex: number = -1;
  comment: string = '';
  idNewsHelp: number = -1;
  mayEdit: boolean = false;

  constructor(private commentService: CommentService,
              private authService: AuthService,
              private router: Router,
              private userService: UserService) { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.commentsSubject = this.commentService.getComments();
    this.subscription = this.commentsSubject.subscribe(res => {
        this.comments = res;
        this.articleComments = [];
        for (let c in this.comments) {
          if (!this.inProfile) {
            if (this.comments[c]._idNews == this._idNews) {
              let articleComment: any = {...this.comments[c]};
              articleComment.username = this.userService.getUserById(articleComment._idUser).username;
              this.articleComments.push(articleComment);
            }
          } else {
            if (this.user._id != -1 && this.user.username != '') {
              this.userLoggedIn = true;

              if (this.comments[c]._idUser == this.user._id) {
                let articleComment: any = {...this.comments[c]};
                articleComment.username = this.userService.getUserById(articleComment._idUser).username;
                this.articleComments.push(articleComment);
              }
            } else {
              this.userLoggedIn = false;
            }
          }
        }
        this.commentsNmbEvent.emit(this.articleComments.length);
      });

    if (this.user._id != -1 && this.user.username != '') {
      this.userLoggedIn = true;
    } else {
      this.userLoggedIn = false;
    }
    let actualUserLoggedIn = this.authService.getUser();
    if (actualUserLoggedIn._id < 0 || actualUserLoggedIn.username == '') {
    } else {
      if (actualUserLoggedIn.level == 0) {
        this.mayEdit = true;
      } else {
        if (actualUserLoggedIn._id == this.user._id && this.user.level < 3) {
          this.mayEdit = true;
        } else {
          this.mayEdit = false;
        }
      }
    }
  }

  addComment() {
    this.newComment._idNews = this._idNews;
    this.newComment._idUser = this.user._id;
    this.newComment.timestamp = new Date();
    this.commentService.addComment(this.newComment);

    let articleComment: any = {...this.newComment};
    articleComment.username = this.userService.getUserById(articleComment._idUser).username;
    this.articleComments.push(articleComment);

    this.endWriting();
  }

  endWriting() {
    this.writingComment = false;
    this.newComment = new Comment();
  }

  startEdit(id: number) {
    this.editIndex = id;
    this.editingComment = true;
    for (let c in this.comments) {
      if (this.comments[c]._id == id) {
        this.comment = this.comments[c].comment;
        this.idNewsHelp = this.comments[c]._idNews;
      }
    }
  }

  doneEdit(id: number) {
    let tempComment: Comment = new Comment();
    tempComment._id = id;
    tempComment._idNews = this.idNewsHelp;
    tempComment.timestamp = new Date();
    tempComment._idUser = this.user._id;
    if (!this.inProfile) {
      tempComment.comment = this.comment;
    } else {
      let actualUserLoggedIn = this.authService.getUser();
      if (actualUserLoggedIn._id < 0 || actualUserLoggedIn.username == '') {
      } else {
        if (actualUserLoggedIn._id != this.user._id && actualUserLoggedIn.level == 0) {
          tempComment.comment = this.comment + ' --- edited by admin';
        } else {
          tempComment.comment = this.comment + ' --- edited';
        }

      }
    }
    this.comment = '';
    this.commentService.editComment(tempComment);
    this.editIndex = -1;
    this.editingComment = false;
    if (!this.inProfile) {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([this._idNews]);
      });
    } else {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['profile', this.user._id]);
      });
    }
  }

  delete(id: number) {
    this.commentService.deleteComment(id);
    if (!this.inProfile) {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([this._idNews]);
      });
    } else {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['profile', this.user._id]);
      });
    }
  }

  cancelEdit() {
    this.comment = '';
    this.editIndex = -1;
    this.editingComment = false;
  }

  setClass() {
    if (this.newComment.comment != '') {
      return {'color': 'green', 'background-color': 'rgba(250, 235, 215, 0.5)'};
    } else {
      return {'color': 'rgba(100, 100, 100, 0.7)'};
    }
  }

}
