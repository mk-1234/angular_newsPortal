import { Component } from '@angular/core';
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Great News Global - News Portal';

  constructor(private auth:AuthService, private router:Router) {
  }

  ngOnInit() {

    this.auth.whoAmI()
      .subscribe((res : any) => {
        if (res.status == 200) {
          console.log(res);
        } else {
          console.log(res);
          this.router.navigate(['/']);
        }
      }, (err) => {
        console.log(err);
      });
  }
}
