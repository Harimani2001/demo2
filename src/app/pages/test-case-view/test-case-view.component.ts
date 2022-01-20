import { IQTCService } from '../iqtc/iqtc.service';
import { ConfigService } from '../../shared/config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Permissions } from '../../shared/config';
import { AdminComponent } from '../../layout/admin/admin.component';
import swal from 'sweetalert2';

@Component({
  selector: 'app-test-case-view',
  templateUrl: './test-case-view.component.html',
  styleUrls: ['./test-case-view.component.css']
})
export class TestCaseViewComponent implements OnInit {
  @ViewChild('testCaseTab') tab: any;
  @ViewChild('myTable') table: any;
  @Input('category')
  public category = '';

  permissionModal = new Permissions(this.category, false);
  draftIds: any[] = new Array();
  viewpdf
  viewPdfPreview: boolean = false;
  viewCsvExport: boolean = false;
  ursDetailedView: boolean = false;
  isSelectedToMaster: boolean;
  isSelectedPublishData: boolean;
  isWorkflowDocumentOrderSequence: any;
  draftData: any[] = new Array();
  publishedData: any[] = new Array();
  mySubscription:any;
  constructor(private activeRouter: ActivatedRoute, public permissionService: ConfigService,
    public service: IQTCService, public router: Router, private adminComponent: AdminComponent) {

    this.permissionService.helper.listen().subscribe((m: any) => {
      // this.viewRowDetails(m, "/documentapprovalstatus")
    });
    this.mySubscription = permissionService.subscription(router);
  }

  ngOnInit(): void {
  }

  loadData() {

  }

  createTestCase() {
    if (this.permissionModal.createButtonFlag && this.permissionModal.userInWorkFlow) {
      this.adminComponent.spinnerFlag = true;
      this.permissionService.checkIndividualModulePermission(this.permissionService.helper.TEST_CASE_CREATION_VALUE).subscribe(resp => {
        this.adminComponent.spinnerFlag = false;
        if (this.permissionModal.createButtonFlag && this.permissionModal.userInWorkFlow && resp) {
          this.router.navigate(["/testCaseCreation"], { queryParams: { type: this.permissionService.helper.getTestCaseName(this.category) } })
        } else {
          this.createSwalMessage();
        }
      }, err => {
        this.adminComponent.spinnerFlag = false;
        this.createSwalMessage();
      });
    } else {
      this.createSwalMessage();
    }
  }

  createSwalMessage() {
    swal({
      title: 'Warning!', type: 'error', timer: this.permissionService.helper.swalTimer, showConfirmButton: false,
      text: !this.permissionModal.createButtonFlag ? "You don't have create permission. Please contact admin!." :
        "Testcase creation module permission is disabled. Please contact admin!.",
    });
  }

  excelExport() {
    this.service.excelExport(this.permissionService.helper.getTestCaseId(this.category)).subscribe(resp => {
      if (resp.result) {
        this.adminComponent.previewOrDownloadByBase64(resp.sheetName + ".xls", resp.sheet, false);
      }
    });
  }

  publishData() {
    this.adminComponent.spinnerFlag = true;
    
  }

  multipleDocumentPreview(flag, extention) {
    this.adminComponent.spinnerFlag = true;
    this.service.loadPreviewForMultipleDocument(extention, this.category).subscribe(resp => {
      this.adminComponent.spinnerFlag = false;
      if (resp != null) {
        this.adminComponent.previewByBlob(this.permissionService.helper.getTestCaseName(this.category) + '.' + extention,
          resp, flag, this.permissionService.helper.getTestCaseName(this.category) + ' Preview');
      }
    }, err => this.adminComponent.spinnerFlag = false);
  }
}
