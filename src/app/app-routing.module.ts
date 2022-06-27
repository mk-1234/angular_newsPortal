import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NewsComponent} from "./news/news.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {ProfileComponent} from "./profile/profile.component";
import {NewsDetailComponent} from "./news-detail/news-detail.component";
import {CategoryComponent} from "./category/category.component";
import {AuthGuard} from "./auth.guard";

const routes: Routes = [
  {path:'', component:NewsComponent},
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:'profile/:id', component:ProfileComponent, canActivate: [AuthGuard]},
  {path:'category/:detail', component:CategoryComponent},
  {path:':newsDetail', component:NewsDetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
