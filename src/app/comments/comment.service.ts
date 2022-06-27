import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DataService} from "../data.service";
import { Comment } from "./comment.model";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  comments: Comment[] = [];
  commentsSubject : BehaviorSubject<Comment[]> = new BehaviorSubject<Comment[]>([]);

  constructor(private http: HttpClient, private dataService: DataService) {
    this.init();
  }

  init() {
    this.dataService.getComments()
      .subscribe(res => {
        // @ts-ignore
        this.comments = res.data;
        this.commentsSubject.next(this.comments);
      });
  }

  getComments() {
    return this.commentsSubject;
  }

  addComment(comment: Comment) {
    this.dataService.addComment(comment)
      .subscribe((res: any) => {
        if (typeof res.id === "number") comment._id = res.id;
        this.comments.push(comment);
        this.commentsSubject.next(this.comments);
      });
  }

  deleteComment(id : number) {
    this.dataService.deleteComment(id)
      .subscribe(res => {
        this.comments = this.comments.filter(n => n._id != id);
        this.commentsSubject.next(this.comments);
      });
  }

  editComment(comment: Comment) {
    this.dataService.editComment(comment)
      .subscribe(res => {
        for (let c in this.comments) {
          if (this.comments[c]._id == comment._id) {
            this.comments[c] = comment;
          }
        }
        this.commentsSubject.next(this.comments);
      });
  }

}
