import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public router: Router, public helper: Helper, public configService: ConfigService) {
    if (document.location.pathname == "/") {
      if(this.helper.isEmpty(localStorage.getItem("redirectReference")))
        this.router.navigate(["/MainMenu"])
      else
        this.router.navigate(["documentapprovalstatus"]);
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (localStorage.getItem("token")) {
      let url = state.url;
      if (state.url.includes('?')) {
        url = state.url.split('?')[0];
      }
      return this.configService.isPermissionExist(url)
        .catch((e: any) => {
          this.handleError(e)
          return Observable.throw({
            ngNavigationCancelingError: true,
          })
        })
        .map((auth) => {
          if (auth.permission) {
            return true;
          }
          this.router.navigate(['/404']);
          return false;
        }).first()
    } else {
      localStorage.clear()
      this.router.navigate(['/login']);
      return false;
    }
  }


  handleError(error) {
    if (error.status == 401 && error.error == "Unauthorized") {
      localStorage.clear()
      this.router.navigate(['/login']);
    }
    if (!error.response) {
      // network error
      console.log('Error: Network Error');
      localStorage.clear()
      this.router.navigate(['/login']);
    }
  }

}
