import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-page404',
  templateUrl: './error-page404.component.html',
  styleUrls: ['./error-page404.component.css']
})
export class ErrorPage404Component implements OnInit {

  constructor(public router: Router) {
    if (localStorage.length==0 || localStorage.getItem("token")==null) {
      this.router.navigate(["/login"])
  }
}

  ngOnInit() {
    window.scrollTo(0,0);
  }

}
