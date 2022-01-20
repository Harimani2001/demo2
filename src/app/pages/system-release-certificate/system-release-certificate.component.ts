import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { DatePipe } from '../../../../node_modules/@angular/common';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { AdminComponent } from '../../layout/admin/admin.component';
import { Helper } from '../../shared/helper';
import { ConfigService } from '../../shared/config.service';
import { IMyDpOptions } from 'mydatepicker/dist';
import { Permissions } from '../../shared/config';
import { SystemCertificateService } from './system-release-certificate.service';
import { SystemCheckListDTO, SystemReleaseDTO } from '../../models/model';
import { DocumentWorkflowHistoryComponent } from '../document-workflow-history/document-workflow-history.component';
import { AddDocumentWorkflowComponent } from '../add-document-workflow/add-document-workflow.component';
import { AuditTrailViewComponent } from '../audit-trail-view/audit-trail-view.component';


@Component({
  selector: 'app-urs',
  templateUrl: './system-release-certificate.html',
  styleUrls: ['./system-release-certificate.css']
})
export class SystemCertificateComponent implements OnInit {
    @ViewChild('documentWorkFlowHistory') documentWorkFlowHistory : DocumentWorkflowHistoryComponent;
    @ViewChild('addDocumentWorkFlow') addDocumentWorkFlow : AddDocumentWorkflowComponent;
    @ViewChild('relaseDateElement') relaseDateElement: any;
    @ViewChild('auditView') auditView: AuditTrailViewComponent;
    public spinnerFlag: boolean = false;
    public myDatePickerOptions: IMyDpOptions = {
      disableUntil: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() },
      dateFormat: 'dd.mm.yyyy',
      componentDisabled: false
    };
    permissionModal: Permissions = new Permissions(this.helper.PROJECTPLAN, false);
    editCheckList = [];
    projectExists: boolean = true;
    systemReleaseInfo: SystemReleaseDTO = new SystemReleaseDTO();
    systemCheckList: SystemCheckListDTO[] = new Array<SystemCheckListDTO>();
    validCheckListTable: boolean = false;
    yes = '1';
    no = '0';
    todayDate: string;
    infoFlag:boolean = true;
    releaseDate: any;
    projects: any[] = new Array();
  
    constructor(private adminComponent: AdminComponent, private configService: ConfigService,
      public helper: Helper, public route: ActivatedRoute,
      public systemCertificateService: SystemCertificateService,
      public router: Router, public datePipe: DatePipe) {
    }
  
    ngOnInit() {
      this.loadCurrentProject();
      this.adminComponent.setUpModuleForHelpContent("235");
      this.adminComponent.taskDocType = "235";
      this.adminComponent.taskDocTypeUniqueId = "";
      this.adminComponent.taskEquipmentId = 0;
      this.configService.loadPermissionsBasedOnModule(this.helper.SYSTEM_CERTIFICATE_VALUE).subscribe(resp => {
        this.permissionModal = resp;
      });
    }
    
    loadCurrentProject() {
      this.spinnerFlag = true;
      this.systemCertificateService.loadSytemDetails().subscribe(resp =>{
        if(resp.result == "success") {
          if(resp.project) {
            this.projectExists = true;
            this.systemReleaseInfo = resp.systemInfo;
            this.myDatePickerOptions.componentDisabled = this.systemReleaseInfo.publishFlag;
            this.checkWorkflow();
            this.projects.push({'id': this.systemReleaseInfo.globalProjectId});
            if(this.systemReleaseInfo.listDto.length == 0 && !this.systemReleaseInfo.publishFlag) {
              this.systemCertificateService.getlookUpItemsBasedOnCategory("SystemReleaseCheckList").subscribe(resp => {
                let i =1;
                this.systemCheckList = resp.response.map(option => ({activity: option.value, status: 'N', orderBy: i++, remarks: '', id:0}));
              });
            } else {
              this.systemCheckList = this.systemReleaseInfo.listDto;
            }
            if(this.systemReleaseInfo.id !=0 && !this.helper.isEmpty(this.systemReleaseInfo.conclusion))
              this.infoFlag = false;
            if (this.systemReleaseInfo.releaseDate) {
                this.releaseDate = { date: JSON.parse(this.systemReleaseInfo.releaseDate) };
              }
            for(let i = 0 ; i < this.systemCheckList.length; i++) {
              this.editCheckList[i] = false;
            }
          } else {
            this.projectExists = false;
          }
        }
      })
      this.spinnerFlag = false;
    }

    editRow(rowIndex, element) {
      this.validCheckListTable = true;
      for (let index = 0; index < this.systemCheckList.length; index++) {
        if (rowIndex == index) {
          this.editCheckList[index] = true;
        } else
          this.editCheckList[index] = false;
      }
      setTimeout(() => {
        $('#' + element + '_' + rowIndex).focus();
      }, 200);
    }

    updateValue(event, cell, row) {
      this.systemCheckList[row.$$index][cell] = event.target.value;
      if(cell == 'activity') {
        let length = this.systemCheckList.filter(f => this.helper.isEmpty(f.activity)).length;
        if (length == 0) {
          this.validCheckListTable = true;
        } else {
          this.validCheckListTable = false;
        }
      }
    }

    onChangeStatus(event, rowIndex) {
      if(event.target.value == this.yes)
        this.systemCheckList[rowIndex]['status'] = 'Y';
      else
        this.systemCheckList[rowIndex]['status'] = 'N';
    }

    addItemClick(rowIndex) {
      let index = this.systemCheckList.length;
      let dto = new SystemCheckListDTO();
      dto.id = 0;
      dto.orderBy = this.systemCheckList[rowIndex]['orderBy']+1;
      this.systemCheckList.push(dto);
      if (index == 0)
        for(let i = 0 ; i < this.systemCheckList.length; i++) {
          this.editCheckList[i] = false;
        }
      
      this.editCheckList[index] = true;
  
      if (index != 0)
        this.editCheckList[index - 1] = false;
      setTimeout(() => {
        $('#activity_' + index).focus();
      }, 200);
    }
  
    parseDate(dateString: string): Date {
      if (dateString) {
          return new Date(dateString);
      }
      return null;
    }

    onClickWorkflowHistory(){
      this.documentWorkFlowHistory.showModalView();
    }

    onCloseWorkflowModal(){
      this.checkWorkflow();
    }

    onClickWorkflow(){
      this.addDocumentWorkFlow.showModalView();
    }

    conclusionChange(event) {
      this.systemReleaseInfo.conclusion = event.target.value;
      if(this.helper.isEmpty(this.systemReleaseInfo.conclusion)) {
        
      }
    }

    openReleaseBtnClicked() {
      if (this.relaseDateElement && !this.relaseDateElement.showSelector)
        this.relaseDateElement.openBtnClicked();
    }

    onclickDelete(index) {
      let length = this.systemCheckList.length;
      if(length > 1) {
        this.systemCheckList.splice(index, 1);
      }
    }
  
    onSaveList() {
      this.spinnerFlag = true;
      let length = this.systemCheckList.filter(f => this.helper.isEmpty(f.activity)).length;
      if(length == 0) {
        this.validCheckListTable = true;
        this.systemReleaseInfo.listDto = this.systemCheckList;
        this.systemCertificateService.saveUpdateCheckList(this.systemReleaseInfo).subscribe(jsonResp => {
          this.spinnerFlag = false;
          if (jsonResp.result == "success") {
            this.spinnerFlag = false;
            if(this.systemReleaseInfo.listDto.length == 0) {
              swal({
                title: 'Success',
                text: 'Check list created successfully',
                type: 'success',
                timer: 2000, showConfirmButton: false
              });
            } else {
              swal({
                title: 'Success',
                text: 'Check list updated successfully',
                type: 'success',
                timer: 2000, showConfirmButton: false
              });
            }
            this.systemReleaseInfo.id = jsonResp.response.id;
            this.systemCheckList = jsonResp.response.listDto;
            for(let i = 0 ; i < this.systemCheckList.length; i++) {
              this.editCheckList[i] = false;
            }
          }
        }, err => { this.spinnerFlag = false; });
      } else {
        this.message('Please fill activity in check list');
        this.spinnerFlag = false;
      }
    }

    onSaveSystemInfo() {
      this.spinnerFlag = true;
      if (this.releaseDate) {
        this.systemReleaseInfo.releaseDate = JSON.stringify(this.releaseDate.date);
      } else {
        this.systemReleaseInfo.releaseDate = '';
      }

      if (this.helper.isEmpty(this.systemReleaseInfo.releaseDate)) {
        this.message('Please Select Release Date');
        this.spinnerFlag = false;
        return;
      } else if (this.helper.isEmpty(this.systemReleaseInfo.conclusion)) {
        this.message('Please Enter Conclusion');
        this.spinnerFlag = false;
        return;
      } else {
        this.systemCertificateService.saveUpdateSystemInfo(this.systemReleaseInfo).subscribe(jsonResp => {
          if (jsonResp.result == "success") {
            this.spinnerFlag = false;
            if(this.systemReleaseInfo.id == 0 || this.helper.isEmpty(this.systemReleaseInfo.conclusion)) {
              swal({
                title: 'Success',
                text: 'System data saved successfully',
                type: 'success',
                timer: 2000, showConfirmButton: false
              });
            } else {
                swal({
                  title: 'Success',
                  text: 'System data updated successfully',
                  type: 'success',
                  timer: 2000, showConfirmButton: false
                });
              }
              if(this.systemReleaseInfo.id !=0 && !this.helper.isEmpty(this.systemReleaseInfo.conclusion))
                this.infoFlag = false;
              this.systemReleaseInfo.id = jsonResp.response.id;
            }
        }, err => { this.spinnerFlag = false; });
      }
    }
    
    publishSystemRelease() {
      this.spinnerFlag = true;
      this.systemCertificateService.publishSystemReleaseInfo(this.systemReleaseInfo.id).subscribe(jsonResp => {
        if (jsonResp.result == "success") {
          this.spinnerFlag = false;
          if(jsonResp.systemInfo.publishFlag) {
            this.systemReleaseInfo.publishFlag = jsonResp.systemInfo.publishFlag;
            this.myDatePickerOptions.componentDisabled = jsonResp.systemInfo.publishFlag;
            swal({
              title: 'Success',
              text: 'Publish successful',
              type: 'success',
              timer: 2000, showConfirmButton: false
            });
          } else {
            swal({
              text: 'Publish unsuccessful',
              type: 'error',
              timer: 2000
            });
          }
          } else
            this.spinnerFlag = false;
        }, err => { this.spinnerFlag = false; });
    }

    checkWorkflow() {
      this.spinnerFlag = true;
      return new Promise<any>((resolve) => {
        this.configService.HTTPGetAPI("systemRelease/checkSystemReleaseWorkflow").subscribe(resp =>{
          if(resp.success = "success") {
            this.systemReleaseInfo.workflowFlag = resp.workflowFlag;
          }
          resolve(true);
          this.spinnerFlag = false;
        });
      });
      
    }

    download() {
      this.adminComponent.spinnerFlag = true;
      this.configService.HTTPPostAPIFile('systemRelease/downloadSystemCertificate', "").subscribe(resp => {
        this.adminComponent.previewByBlob("System_Release_Certificate.pdf", resp, false);
        this.adminComponent.spinnerFlag = false;
      });
    }

    loadAuditTrail() {
      this.auditView.loadData(this.helper.SYSTEM_CERTIFICATE_VALUE, "" , this.projects);
    }

    message(string) {
      swal({
        title: '',
        text: string,
        type: 'info',
        timer: 3000,
        showConfirmButton: false,
      });
    }

    checkSystemRelease(){
      if (this.systemReleaseInfo.id == 0) {
        this.message('Please Fill Conclusion');
        return;
      } if (this.helper.isEmpty(this.systemReleaseInfo.conclusion)) {
        this.message('Please Enter Conclusion');
        return;
      } if (this.helper.isEmpty(this.systemReleaseInfo.releaseDate)) {
        this.message('Please Select Release Date');
        return;
      }  if (this.systemCheckList[0].id == 0) {
        this.message('System check list should not be empty');
        return;
      } else {
        this.onClickWorkflow();
      }
    }
   
}