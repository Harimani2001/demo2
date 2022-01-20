import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { AdminComponent } from './../../layout/admin/admin.component';
import { ConfigService } from './../../shared/config.service';

@Component({
  selector: 'version-creation-button',
  templateUrl: './manual-version-creation.component.html',
  styleUrls: ['./manual-version-creation.component.css']
})
export class ManualVersionCreationComponent implements OnInit {
  currentVersionId:number;
  @Output('compelete') compelete:EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('versionCreationModal') versionCreationModal:any;
  @ViewChild('alertMessageNewVersionCreation') alertMessage:any;
  list:any[]=new Array();
  pendingDocumentList:String[]=new Array();
  searchBoxText;
  newVersionFlag=false;
  constructor(private configService:ConfigService,private adminComponent: AdminComponent) { }

  ngOnInit(): void {
  }

  loadProjectDetailsForNewVersion(currentVersionId) {
    this.currentVersionId=currentVersionId;
    this.searchBoxText='';
    this.adminComponent.spinnerFlag=true;
    this.configService.HTTPPostAPI(this.currentVersionId, "projectsetup/loadProjectDetailsForNewVersion").subscribe(rep => {
      this.adminComponent.spinnerFlag=false;
      if (rep.message) {
        swal({
          title: 'Info',
          text: rep.message,
          type: 'info',
          timer: this.configService.helper.swalTimer,
          showConfirmButton: false,
          onClose: () => {
          }
        });
        return;
      }
      this.newVersionFlag=rep.allDocumentLock;
      this.pendingDocumentList=rep.pendingList;
      if (this.pendingDocumentList.length > 0) {
        this.alertMessage.show();
        return;
      }
      if (rep.list) {
        this.list = rep.list;
        this.versionCreationModal.show();
      } else {
        this.versionCreationModal.show();
      }
    }, err => {
      this.adminComponent.spinnerFlag=false;
    });
  }

  close(){
    this.list=new Array();
    this.versionCreationModal.hide();
    this.newVersionFlag=false;
    this.pendingDocumentList=new Array();
  }

  checkForUrsAndSpec(json, list: any[]) {
    switch (json.id) {
      case this.configService.helper.SP_VALUE:
        if (json.checked) {
          list.forEach(d => {
            if (d.id === this.configService.helper.URS_VALUE)
              d.checked = true;
          })
        } else {
          list.forEach(d => {
            if ((d.id === this.configService.helper.IQTC_VALUE) || (d.id === this.configService.helper.OQTC_VALUE) || (d.id === this.configService.helper.PQTC_VALUE) || (d.id === this.configService.helper.IOQTC_VALUE) || (d.id === this.configService.helper.OPQTC_VALUE) || (d.id === this.configService.helper.RISK_ASSESSMENT_VALUE))
              d.checked = false;
          })
        }
        break;
      case this.configService.helper.IQTC_VALUE:
        if (json.checked) {
          list.forEach(d => {
            if ((d.id === this.configService.helper.URS_VALUE) || (d.id === this.configService.helper.SP_VALUE) || (d.id === this.configService.helper.RISK_ASSESSMENT_VALUE))
              d.checked = true;
          })
        }
        break;
      case this.configService.helper.PQTC_VALUE:
        if (json.checked) {
          list.forEach(d => {
            if ((d.id === this.configService.helper.URS_VALUE) || (d.id === this.configService.helper.SP_VALUE) || (d.id === this.configService.helper.RISK_ASSESSMENT_VALUE))
              d.checked = true;
          })
        }
        break;
      case this.configService.helper.OQTC_VALUE:
        if (json.checked) {
          list.forEach(d => {
            if ((d.id === this.configService.helper.URS_VALUE) || (d.id === this.configService.helper.SP_VALUE) || (d.id === this.configService.helper.RISK_ASSESSMENT_VALUE))
              d.checked = true;
          })
        }
        break;
      case this.configService.helper.IOQTC_VALUE:
        if (json.checked) {
          list.forEach(d => {
            if ((d.id === this.configService.helper.URS_VALUE) || (d.id === this.configService.helper.SP_VALUE) || (d.id === this.configService.helper.RISK_ASSESSMENT_VALUE))
              d.checked = true;
          })
        }
        break;
      case this.configService.helper.OPQTC_VALUE:
        if (json.checked) {
          list.forEach(d => {
            if ((d.id === this.configService.helper.URS_VALUE) || (d.id === this.configService.helper.SP_VALUE) || (d.id === this.configService.helper.RISK_ASSESSMENT_VALUE))
              d.checked = true;
          })
        }
        break;
      case this.configService.helper.RISK_ASSESSMENT_VALUE:
        if (json.checked) {
          list.forEach(d => {
            if ((d.id === this.configService.helper.URS_VALUE) || (d.id === this.configService.helper.SP_VALUE))
              d.checked = true;
          })
        } else {
          list.forEach(d => {
            if ((d.id === this.configService.helper.IQTC_VALUE) || (d.id === this.configService.helper.OQTC_VALUE) || (d.id === this.configService.helper.PQTC_VALUE) || (d.id === this.configService.helper.IOQTC_VALUE) || (d.id === this.configService.helper.OPQTC_VALUE))
              d.checked = false;
          })
        }
        break;
      case this.configService.helper.URS_VALUE:
        if (!json.checked) {
          list.forEach(d => {
            if ((d.id === this.configService.helper.SP_VALUE) || (d.id === this.configService.helper.IQTC_VALUE) || (d.id === this.configService.helper.OQTC_VALUE) || (d.id === this.configService.helper.PQTC_VALUE) || (d.id === this.configService.helper.IOQTC_VALUE) || (d.id === this.configService.helper.OPQTC_VALUE) || (d.id === this.configService.helper.RISK_ASSESSMENT_VALUE))
              d.checked = false;
          })
        }
        break;
    }
  }

  toggleForUrsAndSpec(json, list: any[]) {
    switch (json.id) {
      case this.configService.helper.SP_VALUE:
        if (json.dataFlag) {
          list.forEach(d => {
            if (d.id === this.configService.helper.URS_VALUE)
              d.dataFlag = true;
          })
        } else {
          list.forEach(d => {
            if ((d.id === this.configService.helper.IQTC_VALUE) || (d.id === this.configService.helper.OQTC_VALUE) || (d.id === this.configService.helper.PQTC_VALUE) || (d.id === this.configService.helper.IOQTC_VALUE) || (d.id === this.configService.helper.OPQTC_VALUE) || (d.id === this.configService.helper.RISK_ASSESSMENT_VALUE))
              d.dataFlag = false;
          })
        }
        break;
      case this.configService.helper.IQTC_VALUE:
        if (json.dataFlag) {
          list.forEach(d => {
            if ((d.id === this.configService.helper.URS_VALUE) || (d.id === this.configService.helper.SP_VALUE) || (d.id === this.configService.helper.RISK_ASSESSMENT_VALUE))
              d.dataFlag = true;
          })
        }
        break;
      case this.configService.helper.PQTC_VALUE:
        if (json.dataFlag) {
          list.forEach(d => {
            if ((d.id === this.configService.helper.URS_VALUE) || (d.id === this.configService.helper.SP_VALUE) || (d.id === this.configService.helper.RISK_ASSESSMENT_VALUE))
              d.dataFlag = true;
          })
        }
        break;
      case this.configService.helper.OQTC_VALUE:
        if (json.dataFlag) {
          list.forEach(d => {
            if ((d.id === this.configService.helper.URS_VALUE) || (d.id === this.configService.helper.SP_VALUE) || (d.id === this.configService.helper.RISK_ASSESSMENT_VALUE))
              d.dataFlag = true;
          })
        }
        break;
      case this.configService.helper.IOQTC_VALUE:
        if (json.dataFlag) {
          list.forEach(d => {
            if ((d.id === this.configService.helper.URS_VALUE) || (d.id === this.configService.helper.SP_VALUE) || (d.id === this.configService.helper.RISK_ASSESSMENT_VALUE))
              d.dataFlag = true;
          })
        }
        break;
      case this.configService.helper.OPQTC_VALUE:
        if (json.dataFlag) {
          list.forEach(d => {
            if ((d.id === this.configService.helper.URS_VALUE) || (d.id === this.configService.helper.SP_VALUE) || (d.id === this.configService.helper.RISK_ASSESSMENT_VALUE))
              d.dataFlag = true;
          })
        }
        break;
      case this.configService.helper.RISK_ASSESSMENT_VALUE:
        if (json.dataFlag) {
          list.forEach(d => {
            if ((d.id === this.configService.helper.URS_VALUE) || (d.id === this.configService.helper.SP_VALUE))
              d.dataFlag = true;
          })
        } else {
          list.forEach(d => {
            if ((d.id === this.configService.helper.IQTC_VALUE) || (d.id === this.configService.helper.OQTC_VALUE) || (d.id === this.configService.helper.PQTC_VALUE) || (d.id === this.configService.helper.IOQTC_VALUE) || (d.id === this.configService.helper.OPQTC_VALUE))
              d.dataFlag = false;
          })
        }
        break;
      case this.configService.helper.URS_VALUE:
        if (!json.dataFlag) {
          list.forEach(d => {
            if ((d.id === this.configService.helper.SP_VALUE) || (d.id === this.configService.helper.IQTC_VALUE) || (d.id === this.configService.helper.OQTC_VALUE) || (d.id === this.configService.helper.PQTC_VALUE) || (d.id === this.configService.helper.IOQTC_VALUE) || (d.id === this.configService.helper.OPQTC_VALUE) || (d.id === this.configService.helper.RISK_ASSESSMENT_VALUE))
              d.dataFlag = false;
          })
        }
        break;
    }
  }

  confirmAlert(list:any[]){
    var that = this;
    if (list.filter(j => j.checked).length > 0) {
      swal({
        title:"Write your comments here:",
        input: 'textarea',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Create new version',
        allowOutsideClick: false,
      })
      .then((value) => {
        if(value){
            that.createNewVersion(list,value);
        }else{
          swal({
            title: '',
            text: 'Comments is requried',
            type: 'info',
            timer: this.configService.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              that.confirmAlert(list);
            }
          });
        }
      });
    } else {
      swal({
        title: 'Info',
        text: 'Please select at least one document' ,
        type: 'info',
        timer: this.configService.helper.swalTimer,
        showConfirmButton: false,
        onClose: () => {
        }
      });
    }
  }

  createNewVersion(list:any[],userRemarks){
    this.adminComponent.spinnerFlag=true;
     let json ={ currentVersionId:this.currentVersionId,list:list,userRemarks:userRemarks};
     this.configService.HTTPPostAPI(json,"projectsetup/newVersionCreation").subscribe(resp=>{
         if(resp.message){
          swal({
            title: 'Info',
            text: resp.message,
            type: 'info',
            timer: this.configService.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              this.adminComponent.spinnerFlag=false;
              this.loadProjectDetailsForNewVersion(this.currentVersionId);
            }
          });
         }
        if(resp.result=="success"){
            swal({
              title: 'Success',
              text: 'New Version created',
              type: 'success',
              timer: this.configService.helper.swalTimer,
              showConfirmButton: false,
              onClose: () => {
                this.adminComponent.spinnerFlag=false;
                this.adminComponent.loadCurrentUserDetails();
                this.adminComponent.loadnavBar();
                this.versionCreationModal.hide();
                this.compelete.emit(true);
              }
            });
          } else {
            swal({
              title: 'Error',
              text: 'Something went Wrong ...Try Again',
              type: 'error',
              timer: 2000
            })
            this.adminComponent.spinnerFlag=false;
          }
        });
  }
}
