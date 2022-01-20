import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { JsonResponse,User, dropDownDto } from '../../../models/model';
import { Router } from '@angular/router';
import { AuthenticationService } from './../authentication.service';
import swal from 'sweetalert2';
import { Helper } from '../../../shared/helper';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./forgot.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css']
})
export class ForgotComponent implements OnInit {
model:User;
loading: boolean = false;
  response: JsonResponse;
  submitted: boolean = false;
  valadationMessage: string;
  errorMessage:string;
  userOrganizations:dropDownDto[]=new Array();
  organization:string="";
  constructor(public helper:Helper,public router:Router,public authenticationService:AuthenticationService) { }

  ngOnInit() {
    this.model = new User();
  }

  resetPassword(formIsValid){
    this.valadationMessage="";
    if (formIsValid) {
      this.model.baseURL=document.location.origin;
      this.authenticationService.getOrgCode({ "usernameOrEmailOrEmp_code": this.model.email, "password": "" }).subscribe(jsonResp => {
        if (jsonResp.result === "SUCCESS") {
          if(jsonResp.organizations.length == 1){
            this.organization=jsonResp.organizations[0].value;
            this.apiCall(true);
          }else{
            this.userOrganizations=jsonResp.organizations;
          }
      }else{
        this.valadationMessage="Email Not Registered"
      }
    });
    } else {
      this.loading = false;
      this.submitted = true;
      return;
    }


  }

  apiCall(flag){
    if(flag || (this.model.email != '' && this.organization != '')){
      localStorage.setItem("tenant", this.organization);
      this.loading = true;
      this.submitted = true;
      this.authenticationService.forgetPassword(this.model).subscribe(
        jsonResp => {
          this.loading = false;
          this.submitted = false;
          let responseMsg: string = jsonResp.result;
          if (responseMsg === "success") {
            this.loading = false;
            swal(
              'Password Reset Successfully!',
             'Please check your mail and login with new password',           
             'success'
           ).then(responseMsg => {
            this.router.navigate(["/login"]);
             });
   
          } else if (responseMsg === "Email Not Registered") {
            this.loading = false;
            this.submitted = false;
            this.valadationMessage = responseMsg;
            
          }
        },
        err => {
          this.loading = false;
        }
      );
    }else{
      return;
    }
  }
  keyDownFunction(event,formIsValid) {
    if(event.keyCode == 13) {
        this.resetPassword(formIsValid);     
    }
  }
}
