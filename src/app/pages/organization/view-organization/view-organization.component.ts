import { Component, OnInit, ViewChild, Input, ViewEncapsulation, ElementRef, } from '@angular/core';
import { OrganizationDetails,UserPrincipalDTO } from '../../../models/model';
import { OraganizationService } from "../organization.service";
import { Helper } from '../../../shared/helper';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import swal from 'sweetalert2';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { ConfigService } from '../../../shared/config.service';


@Component( {
    selector: 'app-view-organization',
    templateUrl: './view-organization.component.html',
    styleUrls: ['./view-organization.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
    encapsulation: ViewEncapsulation.None
} )
export class ViewOrganizationComponent implements OnInit {
    @ViewChild( 'myTable' ) table: any;
    @ViewChild( 'GXPUploadModal' ) GXPUploadModal: any;
    @ViewChild('myInput') myInputVariable: ElementRef;
    public rowsOnPage = 10;
    public isFlag:boolean=true;
    public sortBy = '';
    public sortOrder = 'desc';
    public filterQuery = '';
    public data: any;
    loading: boolean = false;
    editableCompanyDetails = new OrganizationDetails();
    editableIndex: number;
    submitted: boolean = false;
    loginUsercompanyId:string;
    currentUser:UserPrincipalDTO=new UserPrincipalDTO();
    organizationModel: OrganizationDetails = new OrganizationDetails();
    installationFlag:boolean=false;
    selectedOrg:any;
    uploadedFiles:any;
    modalSpinnerFlag:boolean=false;
    constructor( private configService:ConfigService, private adminComponent: AdminComponent,public http: Http, private router: Router,  private companyService: OraganizationService,public helper: Helper
    ) { }

    ngOnInit() {
      this.configService.loadCurrentUserDetails().subscribe(jsonResp => {
        this.currentUser=jsonResp;
        this.adminComponent.setUpModuleForHelpContent("99");
        this.adminComponent.taskDocType = "99";
        this.adminComponent.taskDocTypeUniqueId = "";
        this.adminComponent.taskEquipmentId = 0;
        if (+ this.currentUser.roleId == 1) {
          this.loginUsercompanyId = "0"
        } else {
          this.loginUsercompanyId = this.currentUser.orgId
        }
        this.companyService.getorganizationList(this.currentUser.id).subscribe(
          jsonResp => {
            this.data = jsonResp.result;
            this.isFlag = false
          },
          err => {
            this.isFlag = false
          });
      });
    }

    openSuccessCancelSwal( dataObj, i) {

         var classObject = this;
         swal( {
             title: 'Are you sure?',
             text: 'You wont be able to revert',
             type: 'warning',
             showCancelButton: true,
             confirmButtonColor: '#3085d6',
             cancelButtonColor: '#d33',
             confirmButtonText: 'Yes, delete it!',
             cancelButtonText: 'No, cancel!',
             confirmButtonClass: 'btn btn-success m-r-10',
             cancelButtonClass: 'btn btn-danger',
             allowOutsideClick: false,
            buttonsStyling: false
         } ).then( function() {
             classObject.deleteOrg( dataObj, i);
         } );
     }

     deleteOrg( dataObj, i): string {
        let status = '';
        let timerInterval;
        this.isFlag=true;
         this.companyService.deleteorganization(dataObj)
           .subscribe((resp) => {
            //this.response = resp;
            this.isFlag=false;
            if (resp.success) {
              status = "success";

              swal({
                title:'Deleted!',
                text: dataObj.organizationName + ' organization has been deleted.',
                type:'success',
                timer:this.helper.swalTimer,
                showConfirmButton:false,
                onClose: () => {
                  this.data.splice(i, 1);
                  if(dataObj.id==this.currentUser.orgId){

                    this.helper.clearLocalStorage();
                    this.router.navigate(["/login"]);
                  }
                  clearInterval(timerInterval)
                }
              });

             } else {
               status = "failure";

               swal({
                title:'Not Deleted!',
                text: dataObj.organizationName + 'has  not been deleted.',
                type:'error',
                timer:this.helper.swalTimer,
                showConfirmButton:false
              });

             }

           }, (err) => {
             status = "failure";

             swal(
               'Not Deleted!',
               dataObj.organizationName + 'has  not been deleted.',
               'error'
             );

           });
         return status;
     }
     toggleExpandRow( row ) {
         this.table.rowDetail.toggleExpandRow( row );
     }
     onDetailToggle( event ) {

     }
   onPage(event){

   }

   openSwalForUpdateKb(id) {
    var classObject = this;
    swal( {
        title: 'Are you sure?',
        text: 'You want to take latest Knowledge Base',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success m-r-10',
        cancelButtonClass: 'btn btn-danger',
        allowOutsideClick: false,
       buttonsStyling: false
    } ).then( function() {
        classObject.updateDefaultKb( id);
    } );
  }

  updateDefaultKb(id): string {
    this.isFlag = true;
    let timerInterval;
     this.companyService.updateDefaultKb(id)
       .subscribe((resp) => {
        let responseMsg: string = resp.result;
        if (responseMsg === "success") {
          this.isFlag = false;
          status = "success";
          swal({
            title:'Updated!',
            text: 'Now you have latest knowledge base.',
            type:'success',
            timer:this.helper.swalTimer,
            showConfirmButton:false,
            onClose: () => {
              clearInterval(timerInterval)
            }
          });
          this.ngOnInit() ;
         } else {
           status = "failure";
           this.isFlag = false;
           swal({
            title:'Not updated!',
            text: 'Something went wrong. Try Again!',
            type:'error',
            timer:this.helper.swalTimer,
            showConfirmButton:false
          });
         }
       }, (err) => {
         status = "failure";
         this.isFlag = false;
         swal(
           'Not Updated!',
           'Something went wrong. Try Again!.',
           'error'
         );
       });
     return status;
  }

  openSwalForUpdateEmailTemplate(id) {
    var classObject = this;
    swal( {
        title: 'Are you sure?',
        text: 'You want to take latest Email Template',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success m-r-10',
        cancelButtonClass: 'btn btn-danger',
        allowOutsideClick: false,
       buttonsStyling: false
    } ).then( function() {
        classObject.updateDefaultEmailTemplate( id);
    } );
  }

  updateDefaultEmailTemplate(id): string {
    this.isFlag = true;
    let timerInterval;
     this.companyService.updateDefaultEmailTemplate(id)
       .subscribe((resp) => {
        let responseMsg: string = resp.result;
        if (responseMsg === "success") {
          this.isFlag = false;
          status = "success";
          swal({
            title:'Updated!',
            text: 'Now you have latest Email Template.',
            type:'success',
            timer:this.helper.swalTimer,
            showConfirmButton:false,
            onClose: () => {
              clearInterval(timerInterval)
            }
          });
          this.ngOnInit() ;
         } else {
           status = "failure";
           this.isFlag = false;
           swal({
            title:'Not updated!',
            text: 'Something went wrong. Try Again!',
            type:'error',
            timer:this.helper.swalTimer,
            showConfirmButton:false
          });
         }
       }, (err) => {
         status = "failure";
         this.isFlag = false;
         swal(
           'Not Updated!',
           'Something went wrong. Try Again!.',
           'error'
         );
       });
     return status;
  }

  openSwalForUpdateEmailRule(id) {
    var classObject = this;
    swal( {
        title: 'Are you sure?',
        text: 'You want to take latest Email Rule',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success m-r-10',
        cancelButtonClass: 'btn btn-danger',
        allowOutsideClick: false,
       buttonsStyling: false
    } ).then( function() {
        classObject.updateDefaultEmailRule( id);
    } );
  }

  updateDefaultEmailRule(id): string {
    this.isFlag = true;
    let timerInterval;
     this.companyService.updateDefaultEmailRule(id)
       .subscribe((resp) => {
        let responseMsg: string = resp.result;
        if (responseMsg === "success") {
          this.isFlag = false;
          status = "success";
          swal({
            title:'Updated!',
            text: 'Now you have latest Email Rule.',
            type:'success',
            timer:this.helper.swalTimer,
            showConfirmButton:false,
            onClose: () => {
              clearInterval(timerInterval)
            }
          });
          this.ngOnInit() ;
         } else {
           status = "failure";
           this.isFlag = false;
           swal({
            title:'Not updated!',
            text: 'Something went wrong. Try Again!',
            type:'error',
            timer:this.helper.swalTimer,
            showConfirmButton:false
          });
         }
       }, (err) => {
         status = "failure";
         this.isFlag = false;
         swal(
           'Not Updated!',
           'Something went wrong. Try Again!.',
           'error'
         );
       });
     return status;
  }

  completeInstallation(dataObj) {
    this.organizationModel.selectedModules = dataObj.orgModule;
    this.organizationModel.timeZone = dataObj.timeZone;
    this.organizationModel.dateFormat = dataObj.dateFormat;
    this.organizationModel.organizationName = dataObj.organizationName;
    this.organizationModel.organizationLicense = dataObj.organizationLicense;
    this.organizationModel.activeUserSessions = dataObj.activeUserSessions;
    this.organizationModel.comapnyLicenseValidTill = dataObj.comapnyLicenseValidTill;
    this.organizationModel.organizationEmail = dataObj.organizationEmail;
    this.organizationModel.equipmentCount = dataObj.equipmentCount;
    this.organizationModel.isDefault = dataObj.isDefault;
    this.organizationModel.id = 0;
    this.organizationModel.locationCode =dataObj.locationCode;
    this.organizationModel.locationName =dataObj.locationName;
    this.organizationModel.storageSpace = dataObj.storageSpace;

    this.organizationModel.equipmentCount = dataObj.equipmentCount;
    this.organizationModel.isDefault = dataObj.isDefault;
    this.organizationModel.storageSpace = dataObj.storageSpace;
    this.organizationModel.country = dataObj.country;
    this.organizationModel.state = dataObj.state;
    this.organizationModel.pincode = dataObj.pincode;
    this.organizationModel.street = dataObj.street;
    this.organizationModel.termsAndConditions = dataObj.termsAndConditions;
    this.organizationModel.district = dataObj.district;
    this.organizationModel.formCount = dataObj.formCount;
    this.organizationModel.projectCount = dataObj.projectCount;
    this.organizationModel.periodicDuration=dataObj.periodicDuration;
    this.organizationModel.installationPlan=dataObj.installationPlan;
    this.isFlag = true;
    this.companyService.saveAndGoto(this.organizationModel).subscribe(result => {
      let responseMsg: string = result.result;
      if (responseMsg === "success") {
        this.companyService.updateBuildStatus(dataObj.id).subscribe(re =>{
          dataObj.buildStatus=true;
        });
        this.isFlag = false;
        swal({
          title: 'Creation' + ' Successfully!',
          text: ' Details has been ',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
        });
      } else {
        this.isFlag = false;
        swal({
          title: 'Error in Saving!',
          text: ' Company Details has not  been saved.',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        });
      }
    },
      err => {
        this.isFlag = false;
        swal({
          title: 'Error in Saving!',
          text: '"Oops, something went wrong" Please delete the organization and try again!.. ',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        });
      }
    );
  }

  deactivateOrg( dataObj, i): string {
    let status = '';
    let timerInterval;
    this.isFlag=true;
    this.companyService.deactivateOrganization(dataObj.id).subscribe(
                jsonResp => {
        this.isFlag=false;
        if (jsonResp.result) {
          status = "success";

          swal({
            title:'Deactivated!',
            text: dataObj.organizationName + ' organization has been deactivated.',
            type:'success',
            timer:this.helper.swalTimer,
            showConfirmButton:false,
            onClose: () => {
              this.data.splice(i, 1);
              if(dataObj.id==this.currentUser.orgId){

                this.helper.clearLocalStorage();
                this.router.navigate(["/login"]);
              }
              clearInterval(timerInterval)
            }
          });
         } else {
           status = "failure";
           swal({
            title:'Not Deactivated!',
            text: dataObj.organizationName + 'has  not been deactivated.',
            type:'error',
            timer:this.helper.swalTimer,
            showConfirmButton:false
          });
         }
       }, (err) => {
         status = "failure";
         swal(
           'Not Deactivated!',
           dataObj.organizationName + 'has  not been deactivated.',
           'error'
         );

       });
     return status;
 }
 onClickUploadGxp(org){
  this.selectedOrg=org
 }
  extractFile(event: any) {
    this.uploadedFiles=event.target.files;
  }
  uploadFile() {
    if ( this.uploadedFiles.length > 0) {
      let file: File =  this.uploadedFiles[0];
      let formData: FormData = new FormData();
      formData.append('file', file, file.name);
      this.modalSpinnerFlag=true;
      this.companyService.uploadFxpFile(formData,this.selectedOrg.organizationName).subscribe(resp => {
        
        swal({
          title:'Uploaded!',
          text: 'Uploaded Successfully!',
          type:'success',
          timer:this.helper.swalTimer,
          showConfirmButton:false,
          onClose: () => {
            this.GXPUploadModal.hide();
            this.myInputVariable.nativeElement.value = "";
            this.modalSpinnerFlag=false;
          }
        });
      });
    }
  }
  onCancel(){
    if( this.myInputVariable.nativeElement)
      this.myInputVariable.nativeElement.value = "";
  }
  downloadGxpQuestions(){
    this.modalSpinnerFlag=true;
    this.companyService.downloadGxpQuestions(this.selectedOrg.organizationName).subscribe(resp => {
      this.modalSpinnerFlag=false;
      if (resp.result) {
        var nameOfFileToDownload = resp.sheetName + ".xls";
        this.adminComponent.previewOrDownloadByBase64(nameOfFileToDownload, resp.sheet, false);
      }
    },(err) => {
      this.modalSpinnerFlag=false;
    });
  }
}