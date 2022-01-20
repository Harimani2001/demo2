import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Helper } from '../../../shared/helper';
import { User } from "../../../models/model";
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthenticationService } from "../authentication.service";
import { AdminComponent } from '../../../layout/admin/admin.component';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css',
    './../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class ChangepasswordComponent implements OnInit {
  errorMessagePassword: string = "";
  newPassword: string = "";
  passwordError: string;
  confirmPassword: string = "";
  mailMsg: string;
  mailErr: string;
  isLoading: boolean = false;
  user: User = new User();
  oldPassword: string = "";
  submitted: boolean = false;
  oldPasswordValidationMsg: string = " ";
  isPasswordMatch: boolean = false;
  isValidPassword: boolean = true;
  isTextFieldType: boolean = false;
  spinnerFlag: boolean = false;
  oldPasswordConfirmedFlag: boolean = false;
  constructor(private adminComponent: AdminComponent, private helper: Helper, private router: Router, private api: AuthenticationService) { }

  ngOnInit() {
    this.adminComponent.setUpModuleForHelpContent("");
  }

  passwordCheck(): Boolean {
    if (this.newPassword == undefined || this.newPassword == "") {
      this.isPasswordMatch = true;
      this.isValidPassword = true;
      return false;
    } else if (this.newPassword != this.confirmPassword) {
      this.isPasswordMatch = true;
      this.isValidPassword = true;
      return false;
    } else {
      this.isPasswordMatch = false;
      this.isValidPassword = false;
      return true;
    }
  }

  saveAndGoTo($event: Event, formValid): void {
    let timerInterval;
    this.submitted = true;
    $event.preventDefault();
    if (formValid) {
      this.submitted = true;
      this.user.password = this.confirmPassword;
      this.isLoading = true;
      this.api.changePassword(this.user).subscribe(data => {
        this.isLoading = false;
        if (data["result"]) {
          this.mailErr = "";
          // swal(
          //   'Success!',
          //   'Password has been changed Successfully',
          //   'success'
          // ).then(responseMsg => {
          //   this.router.navigate(["authentication/login/with-social"]);
          // });

          swal({
            title: 'Success',
            text: 'Password has been changed Successfully',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,

            onClose: () => {
              // this.router.navigate(["authentication/login/with-social"]);
              this.router.navigate(["/MainMenu"]);
              clearInterval(timerInterval)
            }
          });
        } else {
          this.mailMsg = "Password not changed";
        }
      });
    }
  }

  checkOldPswd = (() => {
    var timer: any = 2;
    return () => {
      this.oldPasswordValidationMsg = '';
      this.oldPasswordConfirmedFlag = false;
      this.spinnerFlag = true;
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.user.password = this.oldPassword;
        this.api.isPasswordIsExist(this.user).subscribe(data => {
          this.isLoading = false;
          if (data["result"]) {
            this.oldPasswordValidationMsg = ""
            this.oldPasswordConfirmedFlag = true;
          } else {
            this.oldPasswordValidationMsg = "Invalid Password";
          }
          this.spinnerFlag = false;
        }
        );
      }, 2000);
    }
  })();

  togglePasswordFieldTypeFeild() {
    this.isTextFieldType = !this.isTextFieldType;
  }
}
