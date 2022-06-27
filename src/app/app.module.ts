import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewsComponent } from './news/news.component';
import { NavComponent } from './nav/nav.component';
import { NewsDetailComponent } from './news-detail/news-detail.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { FromCategoryPipe } from './news/from-category.pipe';
import { SortingPipe } from './news/sorting.pipe';
import { CommentsComponent } from './comments/comments.component';
import { CategoryComponent } from './category/category.component';
import { ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {AuthGuard} from "./auth.guard";
import {AuthInterceptor} from "./auth.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    NewsComponent,
    NavComponent,
    NewsDetailComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    FromCategoryPipe,
    SortingPipe,
    CommentsComponent,
    CategoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
