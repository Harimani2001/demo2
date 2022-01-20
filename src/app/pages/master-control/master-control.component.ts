import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { FormExtendToDocumentDTO } from '../../models/model';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { MasterControlService } from './master-control.service';

@Component({
  selector: 'app-master-control',
  templateUrl: './master-control.component.html',
  styleUrls: ['./master-control.component.css', '/../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class MasterControlComponent implements OnInit {
  projectId: any = '';
  tableViewFlag = true;
  viewIndividualData = false;
  spinnerFlag = false;
  projectList: any[] = new Array();
  documentListMap: Map<string, string> = new Map();
  formExtend: FormExtendToDocumentDTO = new FormExtendToDocumentDTO();
  listOfDocForProject: any[] = new Array();
  popupdata: any[];
  filterQuery: any;
  permissionData: any;
  permisionModal: Permissions = new Permissions("127", false);
  @ViewChild('mydatatable') table: any;
  constructor(public permissionService: ConfigService, private adminComponent: AdminComponent, public helper: Helper, private projectService: projectsetupService, private service: MasterControlService) {
  }

  ngOnInit() {
    this.adminComponent.setUpModuleForHelpContent("127");
    this.permissionService.loadPermissionsBasedOnModule("127").subscribe(resp => {
      this.permisionModal = resp
    });
    this.permissionService.loadProject().subscribe(response => {
      this.projectList = response.projectList;
    });
  }

  loadFormExtendDocumentsOfTheProject(projectId) {
    this.spinnerFlag = true;
    this.service.loadFormExtendDocumentsOfTheProject(projectId).subscribe(result => {
      if (result != null) {
        this.listOfDocForProject = result;
        this.spinnerFlag = false;
      } else this.spinnerFlag = false;
    }, error => { this.spinnerFlag = false; });
  }

  createFormExtendForStatic(newCreate) {
    this.filterQuery = "";
    if (newCreate)
      this.formExtend = new FormExtendToDocumentDTO();
    this.tableViewFlag = false;
    this.viewIndividualData = false;
  }

  viewRowDetails(row) {
    this.popupdata = JSON.parse(row.jsonStructure);
    this.formExtend = row;
    this.tableViewFlag = false;
    this.viewIndividualData = true;
  }

  changeHide(event) {
    this.tableViewFlag = event;
    this.viewIndividualData = false;
  }

  openSuccessCancelSwal() {
    var obj = this;
    swal({
      title: "Write your comments here:",
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
        if (value) {
          obj.formExtend.userRemarks = "Comments : " + value;
          this.deleteFormExtendOfTheDocument(obj.formExtend);
        } else {
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

  deleteFormExtendOfTheDocument(formExtend) {
    this.spinnerFlag = true;
    formExtend.deleteFlag = true;
    this.service.saveFormExtendToDocument(formExtend)
      .subscribe((resp) => {
        this.spinnerFlag = false;
        let responseMsg: string = resp.result;
        if (responseMsg === "success") {
          let timerInterval;
          swal({
            title: 'Deleted!',
            text: ' Record has been deleted.',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              this.viewIndividualData = false;
              this.tableViewFlag = true;
              this.loadFormExtendDocumentsOfTheProject(formExtend.projectId);
              clearInterval(timerInterval)
            }
          });
        } else {
          swal({
            title: 'Not Deleted!',
            text: 'Record has  not been deleted.',
            type: 'error',
            timer: this.helper.swalTimer,
            showConfirmButton: false
          });
        }
      }, (err) => {
        swal(
          {
            title: 'Not Deleted!',
            text: 'Record has  not been deleted.',
            type: 'error',
            timer: this.helper.swalTimer,
            showConfirmButton: false
          }
        );
        this.spinnerFlag = false;
      });
  }

}