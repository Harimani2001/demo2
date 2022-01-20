import { Component, OnInit,ViewEncapsulation,ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { Helper } from '../../shared/helper';
import { EmailTemplateConfigService } from './email-template-config.service';
import { dropDownDto, EmailTemplateConfigDTO } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
import { Permissions } from '../../shared/config';
import { AdminComponent } from '../../layout/admin/admin.component';

@Component({
  selector: 'app-email-template-config',
  templateUrl: './email-template-config.component.html',
  styleUrls: ['./email-template-config.component.css','../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmailTemplateConfigComponent implements OnInit {
  submitted=false;
  spinnerFlag = false;
  isSuperAdmin:boolean = false;
  disableAllFeilds:boolean = false;
  deleteButton:boolean = false;
  public orgDropDown:dropDownDto;
  modal:EmailTemplateConfigDTO = new EmailTemplateConfigDTO();
  model:Permissions=new Permissions(this.helper.EMAIL_TEMPLATE_CONFIG,false);
  permissionData:any;

  constructor( private adminComponent: AdminComponent,public helper: Helper,public emailTemplateService:EmailTemplateConfigService,public permissionService:ConfigService) {
    this.permissionService.loadPermissionsBasedOnModule(this.helper.EMAIL_TEMPLATE_CONFIG).subscribe(resp=>{
      this.model=resp
    });
  }

  ngOnInit() {
    this.getOrgDropDownList();
    this.getEmailTemplate();
    this.adminComponent.setUpModuleForHelpContent(this.helper.EMAIL_TEMPLATE_CONFIG);
  }
  getEmailTemplate(){
    this.spinnerFlag = true;
    this.emailTemplateService.getEmailTemplateBasedOnOrgId("").subscribe(resp=>{
      if(resp.data!=null){
        this.modal = resp.data;
        this.modal.orgId = ""+this.modal.orgId;
        this.disableAllFeilds = true;
        this.deleteButton = true;
      }else{
      }
      this.spinnerFlag = false;
    });
  }


  getOrgDropDownList(){
    this.spinnerFlag = true;
    this.emailTemplateService.getOrgList().subscribe(resp=>{
      this.orgDropDown = resp.orgList;
      this.isSuperAdmin = resp.superAdmin;
      this.spinnerFlag = false;
    });
  }

  saveEmailTemplate(EmailTemplate){
    this.spinnerFlag = true;
    if(!EmailTemplate){
      this.spinnerFlag = false;
      swal(
        'Validation Failed!',
        'Please check all the required field...',
        'error'
      )
    }else{
      this.emailTemplateService.saveEmailTemplate(this.modal).subscribe(resp=>{
        if(resp.result ==="success"){
          this.spinnerFlag = false;
          swal(
            'Success',
            'Email Template Configuration saved successfully',
            'success'
          )
          this.modal = resp.data;
          this.modal.orgId = ""+this.modal.orgId;
          this.deleteButton = true;
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

  onClickDelete() {
    swal({
      title:"Write your comments here:",
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Delete',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
    })
    .then((value) => {
      if(value){
        this.deleteTemplate(value);
      }else{
        swal({
          title: '',
          text: 'Comments is requried',
          type: 'info',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
        });
      }
    });
  }

  deleteTemplate(value){
    this.modal.deleteFlag = true;
    this.modal.userRemarks="Comments : " + value;
    this.spinnerFlag = true;
    this.emailTemplateService.saveEmailTemplate(this.modal).subscribe(resp=>{
      if(resp.result ==="success"){
        this.spinnerFlag = false;
        swal(
          'Deleted',
          'Email Template Configuration has been deleted',
          'success'
        )
        this.modal = new EmailTemplateConfigDTO();
        this.modal.orgId = ""+resp.data.orgId;
        this.disableAllFeilds = false;
        this.deleteButton = false;
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

  onChangeOrg(id:any){
    this.spinnerFlag = true;
    this.emailTemplateService.getEmailTemplateBasedOnOrgId(id).subscribe(resp=>{
      this.modal = new EmailTemplateConfigDTO();
      if(resp.data!=null){
        this.modal = resp.data;
        this.modal.orgId = ""+this.modal.orgId;
        this.disableAllFeilds = true;
      }
      this.modal.orgId = id;
      this.spinnerFlag = false;
    });
  }

  

}
