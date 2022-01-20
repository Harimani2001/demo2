import { Component , OnInit } from '@angular/core';


@Component ({ 

  selector: 'app-organization',
  template: '<router-outlet><app-spinner></app-spinner></router-outlet>'
})
export class OrganizationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
