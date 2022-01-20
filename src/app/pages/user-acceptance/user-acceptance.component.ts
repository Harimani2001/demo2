import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { Urs, SpecificationMasterDTO } from '../../models/model';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { UrsService } from '../urs/urs.service';
import { FileUploadForDocComponent } from '../file-upload-for-doc/file-upload-for-doc.component';
import { FormEsignVerificationComponent } from '../form-esign-verification/form-esign-verification.component';

@Component({
  selector: 'app-user-acceptance',
  templateUrl: './user-acceptance.component.html',
  styleUrls: ['./user-acceptance.component.css']
})
export class UserAcceptanceComponent implements OnInit {
  @ViewChild('myTable') table: any;
  @ViewChild('fileupload') private file: FileUploadForDocComponent;
  @ViewChild('formVerification') formVerification: FormEsignVerificationComponent;
  spinnerFlag: boolean = false;
  public traceabilityData: any = new Array();
  modalpermission: Permissions;
  public filterQuery = '';
  data: any;
  constructor(public ursService: UrsService,
    public helper: Helper, public router: Router,
    private adminComponent: AdminComponent,
    private permissionService: ConfigService,) {
    this.modalpermission = new Permissions(this.helper.User_Acceptance, false);
  }

  ngOnInit() {
    this.adminComponent.setUpModuleForHelpContent(this.helper.User_Acceptance);
    this.loaddata();
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  downloadFile() {
    this.spinnerFlag = true;
    this.permissionService.HTTPPostAPI("", "userAcceptance/loadCSVFile").subscribe(result => {
      this.spinnerFlag = false;
      this.adminComponent.previewOrDownloadByBase64("userAcceptance.xls", result.listXls, false);
    }, error => { this.spinnerFlag = false });
  }

  editStatus(row) {
    row.flag = true;
  }

  loaddata() {
    this.data =[];
    this.spinnerFlag = true;
    this.permissionService.loadPermissionsBasedOnModule(this.helper.User_Acceptance).subscribe(resp => {
      this.modalpermission = resp;
    }, error => { this.spinnerFlag = false });
    this.permissionService.HTTPPostAPI("", "userAcceptance/loadUserAcceptance").subscribe(result => {
      for (var key in result.data) {
        result.data[key].forEach(element => {
          this.data.push(element);
          // this.traceabilityData.push(element);
        });
        // this.data = { 'name': key, 'dto': result.data[key] }
        // this.traceabilityData.push(this.data);
      }
      this.spinnerFlag = false;
      this.file.loadFileListForEdit("0", "");
    }, error => { this.spinnerFlag = false });
  }

  remarks(row, event) {
    row.remarks = event.target.value;
  }

  saveData() {
    this.spinnerFlag = true;
    let ursList = new Array();
    this.data.forEach(element => {
      // data.dto.forEach(element => {
        let ursdata = new Urs();
        ursdata.id = element.id;
        ursdata['remarks'] = element.remarks;
        ursdata['userAcceptance'] = element.userAcceptance;
        let specList = new Array();
        element.specList.forEach(element => {
          let spec = new SpecificationMasterDTO();
          spec.id = element.id;
          spec['remarks'] = element.remarks;
          spec['userAcceptance'] = element.userAcceptance;
          specList.push(spec);
        });
        ursdata.specData = specList;
        ursList.push(ursdata);
      // });
    })
    this.permissionService.HTTPPostAPI(ursList, "userAcceptance/saveUserAcceptance").subscribe(resp => {
      this.spinnerFlag = false;
      let ursdata = new Urs();
      this.file.uploadFileList(ursdata, this.helper.User_Acceptance,"User Acceptance").then(re => { });
      if (resp.result == "success") {
        swal({
          title: 'Success',
          text: 'User Acceptance Added successfully',
          type: 'success',
          timer: this.permissionService.helper.swalTimer,
          showConfirmButton: false,
        });
      } else {
        swal({
          title: 'Error',
          text: 'oops something went wrong',
          type: 'error',
          timer: this.permissionService.helper.swalTimer,
          showConfirmButton: false
        });
      }
    }, error => {
      this.spinnerFlag = false;
      swal({
        title: 'Error',
        text: 'oops something went wrong',
        type: 'error',
        timer: this.permissionService.helper.swalTimer,
        showConfirmButton: false
      });
    });
  }

  verify(documentType, documentCode, documentId) {
    this.formVerification.openMyModal(documentType, documentCode, documentId);
  }

}
