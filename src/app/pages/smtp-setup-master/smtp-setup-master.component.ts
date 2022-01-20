import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { MasterEnailSetupDto, dropDownDto,UserPrincipalDTO } from '../../models/model';
import swal from 'sweetalert2';
import { Helper } from '../../shared/helper';
import { SmtpSetupMasterService } from './smtp-setup-master.service';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { Router } from '@angular/router';
import { AdminComponent } from '../../layout/admin/admin.component';

@Component({
  selector: 'app-smtp-setup-master',
  templateUrl: './smtp-setup-master.component.html',
  styleUrls: ['./smtp-setup-master.component.css','../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class SmtpSetupMasterComponent implements OnInit {
  submitted;
  isTextFieldType2 :boolean = false;
  modal:MasterEnailSetupDto = new MasterEnailSetupDto();
  model:Permissions=new Permissions(this.helper.SMTP_MASTER_SETUP,false);
  confirmPassword:any;
  spinnerFlag = false;
  smtpTested = false;
  isSuperAdmin:boolean = false;
  disableAllFeilds:boolean = false;
  public orgDropDown:dropDownDto;
  permissionData:any;
  currentUser:UserPrincipalDTO=new UserPrincipalDTO();
  constructor( private configService:ConfigService, private adminComponent: AdminComponent,public helper: Helper,public emailService:SmtpSetupMasterService,public permissionService:ConfigService, private routers: Router) {
    this.adminComponent.setUpModuleForHelpContent(this.helper.SMTP_MASTER_SETUP);
   }

  ngOnInit() {
    this.configService.loadCurrentUserDetails().subscribe(resp=>{
      this.currentUser=resp;
      if (this.currentUser.adminFlag == 'A') {
        this.model = new Permissions(this.helper.SMTP_MASTER_SETUP, true);
      } else {
        this.permissionService.loadPermissionsBasedOnModule(this.helper.SMTP_MASTER_SETUP).subscribe(resp => {
          this.model = resp;
        });
      }
      this.getEmailConfig();
      this.getOrgDropDownList();
    });
  }

  getOrgDropDownList(){
    this.spinnerFlag = true;
    this.emailService.getOrgList(this.currentUser.id).subscribe(resp=>{
      this.orgDropDown = resp.orgList;
      this.isSuperAdmin = resp.superAdmin;
      this.modal.orgId = ''+this.currentUser.orgId;
      this.spinnerFlag = false;
    });
  }

  getEmailConfig(){
    this.spinnerFlag = true;
    this.emailService.getEmailConfigBasedOnOrgId(this.currentUser.orgId).subscribe(resp=>{
      if(resp.data!=null){
        this.modal = resp.data;
        this.confirmPassword = this.modal.password;
        this.disableAllFeilds = true;
        this.modal.orgId = ""+this.modal.orgId;
      }
      this.spinnerFlag = false;
    });
  }

  togglePasswordFieldTypeFeild2(){
    this.isTextFieldType2 = !this.isTextFieldType2;
  }

  saveEmailConfig(smtpForm){
    this.spinnerFlag = true;
    if(!smtpForm || (this.confirmPassword != this.modal.password)){
      this.spinnerFlag = false;
      swal(
        'Validation Failed!',
        'Please check all the required field...',
        'error'
      )
    }else{
      this.modal.loginUserId = this.currentUser.id;
      this.modal.organizationOfLoginUser = this.modal.orgId;
      this.emailService.saveEmailConfig(this.modal).subscribe(resp=>{
        let timerInterval;
        if(resp.result ==="success"){
          this.spinnerFlag = false;
          swal({
            title:'Saved Successfully!',
            text:'Email Configuration saved successfully',
            type:'success',
            timer:this.helper.swalTimer,
            showConfirmButton:false,
            onClose: () => {
              if (this.routers.url.search("masterControl") != -1)
              this.routers.navigate(["/masterControl"]);
            else
              this.routers.navigate(["/smtpMasterSetup"]);
              clearInterval(timerInterval)
            }
          }
          );
          this.modal = resp.data;
          this.modal.orgId = ""+this.modal.orgId;
          this.confirmPassword = this.modal.password;
          this.disableAllFeilds = true;
        }else{
          this.spinnerFlag = false;
          swal(
            'Error!',
            'Oops something went Worng..',
            'error'
          )
        }

      });
    }
  }

  onClickEdit(){
    this.disableAllFeilds = false;
  }

  onChangeOrg(id:any){
    this.spinnerFlag = true;
    this.emailService.getEmailConfigBasedOnOrgId(id).subscribe(resp=>{
      this.modal = new MasterEnailSetupDto();
      this.confirmPassword = null;
      if(resp.data!=null){
        this.modal = resp.data;
        this.confirmPassword = this.modal.password;
        this.disableAllFeilds = true;
      }
      this.modal.orgId = id;
      this.spinnerFlag = false;
    });
  }

  testMailConfig(testMail){
    this.spinnerFlag = true;
    if(!testMail){
      this.spinnerFlag = false;
      swal(
        'Validation Failed!',
        'Please enter email address...',
        'error'
      )
    }else{
      this.emailService.testMail(this.modal).subscribe(resp=>{
      this.spinnerFlag = false;
      let timerInterval;
      if(resp.result ==="success"){
        this.spinnerFlag = false;
        this.smtpTested = true;
        swal({
          title:'Saved Successfully!',
          text:'Test mail sent successfully',
          type:'success',
          timer:this.helper.swalTimer,
          showConfirmButton:false,
          onClose: () => {
            if (this.routers.url.search("masterControl") != -1)
            this.routers.navigate(["/masterControl"]);
          else
            this.routers.navigate(["/smtpMasterSetup"]);
            clearInterval(timerInterval)
          }
        }
        );
        this.confirmPassword = this.modal.password;
      }else{
        this.spinnerFlag = false;
        this.smtpTested = false;
        swal(
          'Error!',
          resp.exception,
          'error'
        )
      }
    });
    }
  }

  

}
