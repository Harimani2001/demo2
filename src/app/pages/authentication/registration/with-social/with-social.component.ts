import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import {Router} from '@angular/router';
import { Helper } from '../../../../shared/helper';
import { JsonResponse, User, } from '../../../../models/model';
import { AuthenticationService } from '../../authentication.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-with-social',
  templateUrl: './with-social.component.html',
  styleUrls: ['./with-social.component.css','../../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class WithSocialComponent implements OnInit {
  model: User;
  loading: boolean = false;
  response: JsonResponse;
  submitted: boolean = false;
  valadationMessage: string;
  errorMessage:string;
  constructor(public router:Router, public helper: Helper, public authenticationService:AuthenticationService) { }

  ngOnInit() {
    this.helper.setBaseURL().subscribe(resp=>{});
    this.model = new User();
  }

  onSubmit(formIsValid){
    this.loading = true;
    this.submitted = true;
    if (formIsValid) {
      this.model.baseURL=document.location.origin;
      this.model.createdBy=1;
      this.model.updatedBy=1;
      this.model.id=0;
      this.model.departmentId=1;
      this.authenticationService.signUpCall(this.model).subscribe(
        jsonResp => {
          let responseMsg: string = jsonResp.result;
          if (responseMsg === "success") {

            swal(
              'Registered Successfully!',
             'Please Login to continue',
             'success'
           ).then(responseMsg => {
            this.router.navigate(["/login"]);
             });
   
          } else if (responseMsg === "This entity is already registered. Try with new one!!") {
            this.loading = false;
            this.submitted = false;
            this.errorMessage = responseMsg;
            
          }
        },
        err => {
          this.loading = false;
        }
      );
    } else {
      this.loading = false;
      this.submitted = true;
      return;
    }
  }

  showNext = (() => {
    var timer: any = 0;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.authenticationService.onChangeGetUserDetails(this.model).subscribe(
          jsonResp => {
            let responseMsg: boolean = jsonResp;
            if (responseMsg == true) {
              this.valadationMessage = "User name or Email is Already Existed";
            } else {
              this.valadationMessage = "";
            }
          }
        );
      }, 600);
    }
  })();

  onlyNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  keyDownFunction(event,formIsValid) {
    if(event.keyCode == 13) {
        this.onSubmit(formIsValid);
    }
  }
}
