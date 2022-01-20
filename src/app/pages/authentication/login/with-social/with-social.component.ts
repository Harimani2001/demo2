import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { AuthGuardService } from '../../../../layout/auth/AuthGuardService';
import { CommonModel, JsonResponse, dropDownDto } from "../../../../models/model";
import { ConfigService } from '../../../../shared/config.service';
import { Helper } from '../../../../shared/helper';
import { projectsetupService } from "../../../projectsetup/projectsetup.service";
import { AuthenticationService } from '../../authentication.service';
import { AppComponent } from './../../../../app.component';
import { AdminComponent } from '../../../../layout/admin/admin.component';
@Component({
  selector: 'app-with-social',
  templateUrl: './with-social.component.html',
  styleUrls: ['./with-social.component.css', './../../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class WithSocialComponent implements OnInit {
  submitted: boolean = false;
  userName: string;
  password: string;
  response: JsonResponse;
  loading: boolean = false;
  inValidCredentials: boolean = false;
  inActiveSession: boolean = false;
  modal: CommonModel;
  message: string = "";
  hitsCount: number = 0;
  inToManyAtt: boolean = false;
  timeLeft: number = 60;
  interval;
  forgotPasswordFlag = false;
  userOrganizations: dropDownDto[] = new Array();
  isValidUser: boolean = false;
  invalidUserMessage: boolean = false;
  organization: string = "";
  constructor(public adminComponent: AdminComponent, public helper: Helper, public router: Router, public authenticationService: AuthenticationService,
    public projectsetupService: projectsetupService, public permission: AuthGuardService, public configService: ConfigService) {
    if (localStorage.length != 0 && null != localStorage.getItem("token")) {
      if (!this.helper.isEmpty(localStorage.getItem("redirectReference"))) {
        this.configService.HTTPGetAPI("common/getTaskMailDetails/" + localStorage.getItem("redirectReference")).subscribe(response => {
          if (response) {
            this.adminComponent.onRedirectFromReference(response);
          }
        })
      } else {
        this.router.navigate(["/MainMenu"]);
      }
    }
  }

  ngOnInit() {
    this.response = new JsonResponse();
    setTimeout(() => {
      $('#userName').focus();
    }, 600);
  }

  checkLDAPSetting() {
    if (this.userName) {
      this.configService.HTTPPostAPI(this.userName, "ldap/isLDAPSetting").subscribe(resp => {
        this.forgotPasswordFlag = resp.exists;
      })
    }
  }

  onChangeUserName() {
    this.invalidUserMessage = false;
    this.isValidUser = false;
  }

  checkUserName() {
    this.isValidUser = false;
    this.invalidUserMessage = false;
    this.authenticationService.getOrgCode({ "usernameOrEmailOrEmp_code": this.userName }).subscribe(jsonResp => {
      if (jsonResp.result === "SUCCESS") {
        this.isValidUser = true;
        this.userOrganizations = jsonResp.organizations;
        if (this.userOrganizations.length == 1) {
          this.organization = this.userOrganizations[0].value;
        }
        setTimeout(() => {
          $('#pwd').focus();
        }, 600);
      } else {
        this.invalidUserMessage = true;
      }
    });
  }

  onSubmit(formIsValid) {
    this.submitted = true;
    this.loading = true;
    if (formIsValid) {
      localStorage.setItem("tenant", this.organization);
      this.authenticationService.checkForActiveSessions(this.userName).subscribe(jsonResp => {
        if (jsonResp.result) {
          this.authenticationService.loginCall(this.userName, this.password).subscribe(jsonResp => {
            this.loading = false;
            let responseMsg = jsonResp.result;
            if (responseMsg === "success") {
              this.modal = new CommonModel();
              localStorage.setItem("token", jsonResp.token);
              new AppComponent(this.configService.http, this.router);
              if (jsonResp.userData.adminFlag == "A") {
                this.router.navigate(["/MainMenu"]);
              } else {
                if (jsonResp.userData.newUser === true) {
                  this.router.navigate(["/changePassword"]);
                } else {
                  if (!this.helper.isEmpty(localStorage.getItem("redirectReference"))) {
                    this.configService.HTTPGetAPI("common/getTaskMailDetails/" + localStorage.getItem("redirectReference")).subscribe(response => {
                      if (response) {
                        this.adminComponent.onRedirectFromReference(response);
                      }
                    })
                  } else if (!this.helper.isEmpty(sessionStorage.getItem("redirectGXPReference"))) {
                    this.router.navigate(["/Project-setup/add-projectsetup/" + sessionStorage.getItem("redirectGXPReference")], { queryParams: { tab: this.helper.encode("gxp") } });
                  } else {
                    this.router.navigate(["/MainMenu"]);
                  }
                }
              }
            } else if (responseMsg === "ActiveSessionExists") {
              this.loading = false;
              this.submitted = false;
              this.inValidCredentials = false;
              this.inToManyAtt = false;
              this.inActiveSession = true;
              var classObject = this;
              swal({
                title: 'You have already active session. You want to clear and Login?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes,Clear!',
                cancelButtonText: 'No, cancel!',
                confirmButtonClass: 'btn btn-success m-r-10',
                cancelButtonClass: 'btn btn-danger',
                buttonsStyling: false
              }).then(function () {
                classObject.inActiveSession = false;
                classObject.authenticationService.clearSession(classObject.userName).subscribe(jsonResp => {
                  if (!classObject.helper.isEmpty(classObject.userName) && !classObject.helper.isEmpty(classObject.password))
                    classObject.onSubmit(true);
                });
              });
            } else {
              this.loading = false;
              this.submitted = false;
              this.inValidCredentials = true;
              this.inActiveSession = false;
              this.message = jsonResp.message;
              this.hitsCount = jsonResp.loginAttemptsCount;
              if (this.hitsCount >= 5) {
                this.inToManyAtt = true;
                this.inValidCredentials = false;
                this.startTimer();
              }
            }
          },
          );
        } else {
          this.loading = false;
          swal({
            title: 'No of concurrent sessions is exceeded!!',
            text: "Please login after sometime",
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ok',
            confirmButtonClass: 'btn btn-success m-r-10',
            buttonsStyling: false
          })
        }
      });
    } else {
      this.loading = false;
    }
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        if (this.timeLeft == 0)
          window.location.reload();
      } else {
        this.timeLeft = 60;
      }
    }, 1000)
  }

  onChange() {
    this.inValidCredentials = false;
    this.inToManyAtt = false;
  }

  keyDownFunction(event, formIsValid) {
    if (event.keyCode == 13) {
      if (this.isValidUser)
        this.onSubmit(formIsValid);
      else
        this.checkUserName();
    }
  }

  onclick() {
    this.router.navigate(["/forgot-password"]);
  }

}
