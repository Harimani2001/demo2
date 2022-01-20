import { Component } from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import { AdminComponent } from '../admin.component';

@Component({
  selector: 'app-title',
  template: '<span></span>'
})

export class TitleComponent {
  subscription:any;
  projectName:any;
  constructor(private router: Router, private route: ActivatedRoute, private titleService: Title,public adminComponent:AdminComponent) {

    this.subscription = this.adminComponent.globalProjectObservable.subscribe(
      res => {
        this.titleService.setTitle( ' iVAL | ' +res.value);
        
      },
      err => {},
      () => {}
      );



    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(() => {
        let currentRoute = this.route.root;
        let title = 'Welcome';
        do {
          const childrenRoutes = currentRoute.children;
          currentRoute = null;
          childrenRoutes.forEach(routes => {
            if (routes.outlet === 'primary') {
              title = routes.snapshot.data.breadcrumb;
              currentRoute = routes;
            }
          });
        } while (currentRoute);
        if(localStorage.getItem("globalProjectName") != null || localStorage.getItem("globalProjectName") != undefined)
            this.titleService.setTitle( ' iVAL | ' +atob(localStorage.getItem("globalProjectName")) );
        else
            this.titleService.setTitle( ' iVAL | ' + "WELCOME");
      });
  }
}
