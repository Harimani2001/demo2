import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { Permissions } from '../../../shared/config';
import { ConfigService } from '../../../shared/config.service';
import { Helper } from '../../../shared/helper';
import { AuditTrailViewComponent } from '../../audit-trail-view/audit-trail-view.component';
import { FileUploadForDocComponent } from '../../file-upload-for-doc/file-upload-for-doc.component';
import { priorityService } from '../../priority/priority.service';
import { projectsetupService } from '../../projectsetup/projectsetup.service';
import { UrsService } from '../urs.service';
import { DocumentSummaryDTO, StepperClass, WorkflowDocumentStatusDTO, Page } from './../../../models/model';
import { LocationService } from '../../location/location.service';
import { ImportUrsComponent } from '../../import-urs/import-urs.component';
import { ComplianceAssesmentModalComponent } from '../../compliance-assesment-modal/compliance-assesment-modal.component';
@Component({
  selector: 'app-view-urs',
  templateUrl: './view-urs.component.html',
  styleUrls: ['./view-urs.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class ViewUrsComponent implements OnInit, AfterViewInit {
  @ViewChild('ursTab') tab: any;
  @ViewChild('myTable') table: any;
  @ViewChild('modalFileViewer') preViewModal: any; fileupload
  @ViewChild('fileupload') private file: FileUploadForDocComponent;
  @ViewChild('documentcomments') documentcomments: any;
  @ViewChild('auditView') auditView: AuditTrailViewComponent;
  @ViewChild('forumView') forumView: any;
  @ViewChild('UrsCodeOrderModal') ursCodeOrderModal: any;
  @ViewChild('importUrs') importUrs: ImportUrsComponent;
  documentForumModal: boolean = false;
  correctFile = false;
  spinnerFlag = false;
  redirctUrlFormUrsView: any;
  public filterQuery = '';
  public unPublishedList: any[] = new Array();
  public unPublishedListForOrder: any[] = new Array();
  publishedData: any[] = new Array();
  popupdata = [];
  selectAll: boolean = false;
  total: any;
  current: any;
  viewIndividualData: boolean = false;
  modal: Permissions = new Permissions(this.helper.URS_VALUE, false);
  riskPermission: Permissions = new Permissions(this.helper.RISK_ASSESSMENT_VALUE, false);
  testCase: Permissions = new Permissions(this.helper.TEST_CASE_CREATION_VALUE, false);
  specification: Permissions = new Permissions(this.helper.SP_VALUE, false);
  adHocPermission: Permissions = new Permissions(this.helper.Unscripted_Value, false);
  isSelectedPublishData: boolean = false;
  search: boolean = false;
  rowData: any = null;
  roleBack: any = null;
  routeback: any = null;
  workFlowPermis = [];
  riskWorkFlowPer: boolean = false;
  spWorkFlowPer: boolean = false;
  testcaseWorkFlowPer: boolean = false;
  ursData: any[] = new Array();
  viewFlagUrs: boolean = false;
  isWorkflowDocumentOrderSequence: string;
  isMultiplePDF: boolean = false;
  fileFlag: boolean = true;
  priorityList: any;
  returnColor: any = '';
  isTestcaseModulePermission: boolean = false;
  documentDetails: DocumentSummaryDTO;
  viewpdf: boolean = false;
  draftIds: any[] = new Array();
  viewPdfPreview: boolean = false;
  viewCsvExport: boolean = false;
  count: boolean = false;
  commentsDocumentsList: any[] = new Array();
  showSearch: boolean = false;
  page: Page = new Page();
  ursListForPublish: any[] = new Array();
  documentLock: boolean;
  @ViewChild('complianceAssesmentModal') complianceAssesmentModal:ComplianceAssesmentModalComponent;
  constructor(public helper: Helper, public ursService: UrsService,
    public permissionService: ConfigService, public router: Router, public priorityService: priorityService, private projectsetupService: projectsetupService,
    public adminComponent: AdminComponent, private route: ActivatedRoute, private auditPage: AuditTrailViewComponent, public locationService: LocationService) {
    this.loadPermissions();
    this.route.queryParams.subscribe(query => {
      if (!this.helper.isEmpty(query.id)) {
        this.routeback = query.id
        if (query.roleBack != undefined) {
          this.roleBack = query.roleBack;
        }
        this.viewRowDetails(query.id, query.status);
        this.helper.changeMessageforId(query.id);
      } else if (query.task) {
        let taskQueryParam = JSON.parse(this.helper.decode(query.task));
        this.adminComponent.onChange(taskQueryParam.projectId, taskQueryParam.locationId, true);
        this.saveCurrentTab(taskQueryParam.draft == 'false' ? "approve" : "draft");
      }
    });
    this.helper.listen().subscribe((m: any) => {
      this.viewRowDetails(m)
    })
  }

  loadPermissions(data?) {
    if (data) {
      this.count = data.draft + data.published > 0;
    }
    this.permissionService.loadPermissionsBasedOnModule(this.helper.URS_VALUE).subscribe(resp => {
      this.modal = resp;
    });
    //To Check the create permission
    this.permissionService.loadPermissionsBasedOnModule(this.helper.RISK_ASSESSMENT_VALUE).subscribe(resp => {
      this.riskPermission = resp;
    });
    this.permissionService.loadPermissionsBasedOnModule(this.helper.SP_VALUE).subscribe(resp => {
      this.specification = resp;
    });
    this.permissionService.loadPermissionsBasedOnModule(this.helper.Unscripted_Value).subscribe(resp => {
      this.adHocPermission = resp;
    });
    this.permissionService.loadPermissionsBasedOnModule(this.helper.IQTC_VALUE).subscribe(resp => {
      if (resp.createButtonFlag) {
        this.testCase = resp;
      } else {
        this.permissionService.loadPermissionsBasedOnModule(this.helper.PQTC_VALUE).subscribe(resp1 => {
          if (resp1.createButtonFlag) {
            this.testCase = resp1;
          } else {
            this.permissionService.loadPermissionsBasedOnModule(this.helper.OQTC_VALUE).subscribe(resp2 => {
              if (resp2.createButtonFlag) {
                this.testCase = resp2;
              } else {
                this.permissionService.loadPermissionsBasedOnModule(this.helper.IOQTC_VALUE).subscribe(resp3 => {
                  if (resp3.createButtonFlag) {
                    this.testCase = resp3;
                  } else {
                    this.permissionService.loadPermissionsBasedOnModule(this.helper.OPQTC_VALUE).subscribe(resp4 => {
                      this.testCase = resp4;
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
    this.permissionService.checkIndividualModulePermission(this.helper.TEST_CASE_CREATION_VALUE).subscribe(resp => {
      this.isTestcaseModulePermission = resp;
    });
  }

  ngOnInit() {
    this.page.pageNumber = 0;
    this.page.size = this.helper.PAGE_SIZE;;
    this.setPage({ offset: 0 });
    this.adminComponent.setUpModuleForHelpContent(this.helper.URS_VALUE);
    this.adminComponent.taskDocType = this.helper.URS_VALUE;
    this.adminComponent.taskDocTypeUniqueId = '';
    this.adminComponent.taskEquipmentId = 0;
    this.adminComponent.taskEnbleFlag = true;
    this.loadTheWorkFlowPermissions();
    this.checkUrsDataPresent();
    this.getDocumentLockStatus();
  }

  ngAfterViewInit(): void {
    this.permissionService.getUserPreference(this.helper.URS_VALUE).subscribe(res => {
      if (res.result)
        this.tab.activeId = res.result;
    });
  }

  getDocumentLockStatus() {
    this.permissionService.HTTPGetAPI("workflowConfiguration/getDocumentLockStatus/" + this.helper.URS_VALUE).subscribe(jsonResp => {
      this.documentLock = jsonResp.result;
    })
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.permissionService.getUserPreference(this.helper.URS_VALUE).subscribe(res => {
      if (res.result)
        this.loadAll(res.result);
      else
        this.loadAll();
    });
  }

  saveCurrentTab(tabName) {
    this.permissionService.saveUserPreference(this.helper.URS_VALUE, tabName).subscribe(res => { });
  }
  /**
   * @param rowId =>unique Id of the URS
   * @param redirectURL => url to redirect from where the URS is viewed
   */
  viewRowDetails(rowId: any, redirectURL?) {
    this.fileFlag = true;
    this.adminComponent.taskDocTypeUniqueId = rowId;
    this.adminComponent.taskEquipmentId = 0;
    this.viewFlagUrs = false;
    this.spinnerFlag = true;
    if (redirectURL)
      this.redirctUrlFormUrsView = redirectURL;
    this.popupdata = [];
    this.ursService.getDataForEdit(rowId).subscribe(jsonResp => {
      this.workflowfunction(jsonResp);
      this.stepperfunction(jsonResp);
      this.total = jsonResp.total;
      this.current = jsonResp.current;
      jsonResp.result.formData = JSON.parse(jsonResp.result.jsonExtraData);
      this.priority(jsonResp.result.priorityName)
      this.popupdata.push(jsonResp.result);
      this.viewIndividualData = true;
      var timer = setInterval(() => {
        if (this.file && jsonResp.result.ursCode && jsonResp.result.id) {
          this.file.loadFileListForEdit(jsonResp.result.id, jsonResp.result.ursCode).then((result) => {
            this.fileFlag = result;
            this.spinnerFlag = false;
          }).catch((err) => {
            this.spinnerFlag = false;
          });
          clearInterval(timer);
        }
      }, 600)
    });
    this.ursService.getDataForEditForUrsMapping(rowId).subscribe(resp => {
      this.ursData = resp;
    });
  }
  /**
   * @param data =>navigation method return of loading next or pervious URS
   */
  reload(data) {
    this.viewRowDetails(data.result);
  }

  /**
   *
   * @param jsonResp =>input for stepper for work flow in view of URS
   */
  stepperfunction(jsonResp: any) {
    const stepperModule: StepperClass = new StepperClass();
    stepperModule.constantName = jsonResp.result.constantName;
    stepperModule.code = jsonResp.result.ursCode;
    stepperModule.lastupdatedTime = jsonResp.result.updatedTime;
    stepperModule.documentIdentity = jsonResp.result.id;
    stepperModule.publishedFlag = jsonResp.result.publishedflag;
    stepperModule.creatorId = jsonResp.result.creatorId;
    stepperModule.displayCreatedTime = jsonResp.result.displayCreatedTime;
    stepperModule.displayUpdatedTime = jsonResp.result.displayUpdatedTime;
    stepperModule.documentTitle = jsonResp.result.ursName;
    stepperModule.createdBy = jsonResp.result.createdBy;
    stepperModule.updatedBy = jsonResp.result.updatedBy;
    this.helper.stepperchange(stepperModule);
  }

  workflowfunction(jsonResp: any) {
    if (jsonResp.result.publishedflag) {
      const workflowmodal: WorkflowDocumentStatusDTO = new WorkflowDocumentStatusDTO();
      workflowmodal.documentType = this.helper.URS_VALUE;
      workflowmodal.documentId = jsonResp.result.id;
      workflowmodal.currentLevel = jsonResp.result.currentCommonLevel;
      workflowmodal.documentCode = jsonResp.result.ursCode;
      workflowmodal.workflowAccess = jsonResp.result.workflowAccess;
      workflowmodal.docName = 'User Requirement Specification';
      workflowmodal.publishFlag = jsonResp.result.publishedflag;
      this.helper.setIndividulaWorkflowData(workflowmodal);
    }
  }

  /**
   * @param id unique id of the single urs for edit
   */
  editPopupData(id) {
    this.router.navigate(['/URS/add-urs/', id]);
  }

  /**
   * Close the view of the single document
   */
  onClickClose() {
    if (this.redirctUrlFormUrsView) {
      this.router.navigate([this.redirctUrlFormUrsView], { queryParams: { id: this.roleBack }, skipLocationChange: true });
    } else {
      this.adminComponent.taskEquipmentId = 0;
      this.adminComponent.taskDocType = this.helper.URS_VALUE;
      this.adminComponent.taskDocTypeUniqueId = "";
      setTimeout(() => {
        this.permissionService.getUserPreference(this.helper.URS_VALUE).subscribe(res => {
          if (res.result)
            this.tab.activeId = res.result;

          if ('published' === this.tab.activeId) {
            this.loadAll('published');
          } else {
            this.loadAll('draft');
          }
        });
      }, 10)
      this.viewIndividualData = false;
      this.fileFlag = true;
    }


  }

  /**
   * @param tabId => its a optional parameter to load data from REST API.
   * By default it will load draft tab
   */
  loadAll(tabId?) {
    this.search = false;
    this.unPublishedList = [];
    this.publishedData = [];
    var currentTab = 'draft';
    if (tabId) {
      currentTab = tabId;
    }
    if (currentTab == 'draft')
      this.permissionService.isWorkflowDocumentOrderSequence(this.helper.URS_VALUE).subscribe(resp => {
        this.isWorkflowDocumentOrderSequence = resp;
      });
    if (currentTab != 'draft') {
      this.selectAll = false
    }
    if (currentTab == 'draft' || currentTab == 'published') {
      this.spinnerFlag = true;
      this.search = true;

      this.commentsDocumentsList = new Array();
      this.ursService.getUsrListBasedOnCurrentTab(this.page.pageNumber, currentTab).subscribe(
        jsonResp => {
          this.page.totalElements = jsonResp.totalElements;
          this.page.totalPages = jsonResp.totalPages;
          if (jsonResp.unpublishedList && jsonResp.unpublishedList.length > 0) {
            this.unPublishedList = jsonResp.unpublishedList;
            this.draftIds = this.unPublishedList.map(m => m.id);
            this.commentsDocumentsList = this.unPublishedList.map(u => ({ 'id': u.id, 'type': "code", 'value': u.ursCode }));
          }

          if (jsonResp.publishedList && jsonResp.publishedList.length > 0) {
            this.publishedData = jsonResp.publishedList;
            this.commentsDocumentsList = this.publishedData.map(u => ({ 'id': u.id, 'type': "code", 'value': u.ursCode }));
          }
          if (this.selectAll && currentTab == 'draft') {
            this.unPublishedList.forEach(d => {
              d.publishedflag = true;
            });
          }
          this.spinnerFlag = false;
          if ((this.publishedData.length != 0 || this.unPublishedList.length != 0) && !this.isMultiplePDF) {
            this.permissionService.isMultiplePDF(this.helper.URS_VALUE).subscribe(resp => {
              this.isMultiplePDF = resp;
            });
          }
          if (currentTab == 'draft')
            this.viewPdfPreview = true;
        },
        err => {
          this.spinnerFlag = false;
        }
      );
    } else {
      if (currentTab == 'summary')
        this.viewCsvExport = true;
      if (currentTab == 'feedback') {
        this.permissionService.loadDocumentForumCodes(this.helper.URS_VALUE).subscribe(resp => {
          this.commentsDocumentsList = resp;
        });
      }
    }
  }

  /**
  * @param dataObj =>URS Object
  * @param i => index of the array
  */
  openSuccessCancelSwal(dataObj, i) {
    delete dataObj.formData
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
          dataObj.userRemarks = "Comments : " + value;
          this.deleteUrs(dataObj, i);
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

  /**
   * @param dataObj =>URS Object
   * @param i => index of the array
   */
  deleteUrs(dataObj, i) {
    this.ursService.deleteUrs(dataObj).subscribe((resp) => {
      if (resp.result === 'success') {
        swal({
          title: 'Deleted!', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
          text: dataObj.ursCode + ' record has been deleted',
          onClose: () => {
            this.unPublishedList.splice(i, 1);
            if (resp.noData === 'N') {
              setTimeout(() => {
                this.loadAll('draft');
              }, 10)
              this.viewIndividualData = false;
            } else {
              this.loadAll();
              this.viewIndividualData = false;
            }
          }
        });
      } else {
        swal({
          title: 'Not Deleted!', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
          text: dataObj.ursCode + ' record has not been deleted'
        });
      }
    }, (err) => {
      swal({
        title: 'Not Deleted!', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
        text: dataObj.ursCode + ' record has not been deleted'
      });
    });
  }

  /**
   * Method for CSV Export
   */
  excelExport() {
    this.ursService.excelExport().subscribe(resp => {
      if (resp.result) {
        var nameOfFileToDownload = resp.sheetName + ".xls";
        this.adminComponent.previewOrDownloadByBase64(nameOfFileToDownload, resp.sheet, false);
      }
    })
  }

  /**
   * @param row => urs object for log of the approval
   * Main variables are : id and document constant
   */
  loadDocumentCommentLog(row) {
    this.documentcomments.loadDocumentCommentLog(row);
  }

  /**
   * To Publish draft URS
   */
  publishData() {
    this.spinnerFlag = true;
    this.ursService.publish(this.selectAll ? this.ursListForPublish : this.unPublishedList).subscribe(result => {
      this.isSelectedPublishData = false;
      this.spinnerFlag = false;
      this.loadAll();
    }, er => {
    });
  }

  /**
   * @param data => URS object
   * Single Publish of draft for URS in individual view
   */
  SinglepublishData(data) {
    this.spinnerFlag = true;
    data.publishedflag = true;
    this.ursService.singlePublish(data).subscribe(res => {
      if (res.msg === this.helper.SUCCESS_RESULT_MESSAGE) {
        if (res.finish === undefined) {
          this.viewRowDetails(res.result);
        } else {
          this.loadAll();
          this.viewIndividualData = false;
        }
        this.spinnerFlag = false;
        swal({
          title: 'Success',
          text: 'Record has been published',
          type: 'success',
          timer: 2000, showConfirmButton: false
        });
      } else {
        this.spinnerFlag = false;
      }
    });
  }

  /**
   * To Enable Publish button on bulk publish of URS
   */
  onChangePublishData() {
    for (let data of this.unPublishedList) {
      if (data.publishedflag) {
        this.isSelectedPublishData = true;
        break;
      } else {
        this.isSelectedPublishData = false;
      }
    }
  }

  /**
   * @param tabName => draft or published or audit are the two tab to load data from REST API
   */
  tabChange(tabName: any) {
    this.permissionService.saveUserPreference(this.helper.URS_VALUE, tabName).subscribe(res => {
      this.tab.activeId = tabName;
      this.viewPdfPreview = false;
      this.viewCsvExport = false;
      this.isSelectedPublishData = false;
      if (tabName === 'draft') {
        this.page.pageNumber = 0;
        this.setPage({ offset: 0 });
        this.viewPdfPreview = true;
        this.getDocumentLockStatus();
      } else if (tabName === 'published') {
        this.page.pageNumber = 0;
        this.setPage({ offset: 0 });
      } else if (tabName === 'summary') {
        this.viewCsvExport = true;
        this.search = false;
      } else {
        this.search = false;
      }
    });
  }

  onClickTableOfContent() {
    this.router.navigate(['/table-of-content'], { queryParams: { docId: this.helper.URS_VALUE, status: document.location.pathname }, skipLocationChange: true });
  }

  onClickRisk(ursId: number) {
    this.router.navigate(['/add-riskAssessment'], { queryParams: { ursForRisk: [ursId], status: document.location.pathname }, skipLocationChange: true });
  }

  onClickTestCases(ursId: number) {
    this.router.navigate(['/tc-add'], { queryParams: { ursForTest: ursId, status: document.location.pathname }, skipLocationChange: true });
  }

  onClickSP(ursId: number) {
    this.router.navigate(['/sp-master'], { queryParams: { ursForSP: ursId, status: document.location.pathname }, skipLocationChange: true });
  }

  onClickAdHoc(ursId: number) {
    this.router.navigate(['/Ad-hoc/add-Ad-hoc-testcase'], { queryParams: { ursForAdHoc: ursId, status: document.location.pathname }, skipLocationChange: true });
  }

  loadTheWorkFlowPermissions() {
    this.permissionService.loadDocBasedOnProject().subscribe(res => {
      this.workFlowPermis = res;
      if (this.workFlowPermis.length > 0) {
        if (this.workFlowPermis.filter(data => data.key == this.helper.RISK_ASSESSMENT_VALUE).length > 0) {
          this.riskWorkFlowPer = true;
        }
        if (this.workFlowPermis.filter(data => data.key == this.helper.IQTC_VALUE).length > 0) {
          this.testcaseWorkFlowPer = true;
        } else if (this.workFlowPermis.filter(data => data.key == this.helper.PQTC_VALUE).length > 0) {
          this.testcaseWorkFlowPer = true;
        } else if (this.workFlowPermis.filter(data => data.key == this.helper.OQTC_VALUE).length > 0) {
          this.testcaseWorkFlowPer = true;
        } else if (this.workFlowPermis.filter(data => data.key == this.helper.IOQTC_VALUE).length > 0) {
          this.testcaseWorkFlowPer = true;
        } else if (this.workFlowPermis.filter(data => data.key == this.helper.OPQTC_VALUE).length > 0) {
          this.testcaseWorkFlowPer = true;
        }
        if (this.workFlowPermis.filter(data => data.key == this.helper.SP_VALUE).length > 0) {
          this.spWorkFlowPer = true;
        }
      }
    });
  }

  selectAllData(event) {
    this.selectAll = event.currentTarget.checked;
    if (event.currentTarget.checked) {
      this.unPublishedList.forEach(d => {
        d.publishedflag = true;
      });
      this.isSelectedPublishData = true;
    } else {
      this.unPublishedList.forEach(d => {
        d.publishedflag = false;
      });
      this.isSelectedPublishData = false;
    }
  }

  /**
 * @param flag => view or download
 * @param extention =>doc/docx
 */
  documentPreview(flag, extention, data) {
    this.spinnerFlag = true;
    data.downloadDocType = extention;
    this.ursService.loadPreviewDocument(data).subscribe(resp => {
      this.spinnerFlag = false;
      if (resp != null) {
        this.adminComponent.previewByBlob(data.ursCode + '.' + extention, resp, flag, 'User Requirement Specification Preview');
      }
    }, err => this.spinnerFlag = false);
  }

  multipleDocumentPreview(flag, extention) {
    this.spinnerFlag = true;
    this.ursService.loadPreviewForMultipleDocument(extention, this.helper.URS_VALUE).subscribe(resp => {
      this.spinnerFlag = false;
      if (resp != null) {
        this.adminComponent.previewByBlob('URS' + '.' + extention, resp, flag, 'User Requirement Specification Preview');
      }
    }, err => this.spinnerFlag = false);
  }

  priority(data) {
    this.priorityList = [];
    this.priorityService.loadAllPriority().subscribe(response => {
      this.priorityList = response.result;
      let filteredData: any;
      filteredData = this.priorityList.filter(res => data == res.priorityName);
      if (!this.helper.isEmpty(filteredData))
        filteredData.forEach(element => {
          this.returnColor = element.priorityColor;
        });
      return this.returnColor;
    });
  }

  createURS() {
    if (this.modal.createButtonFlag && this.modal.userInWorkFlow) {
      this.router.navigate(["/URS/add-urs"])
    } else {
      if (!this.modal.createButtonFlag) {
        swal({
          title: 'Warning!', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
          text: "You don't have create permission. Please contact admin!.",
        });
      }
    }
  }

  checkUrsDataPresent() {
    this.projectsetupService.loadDocumentSummary(this.helper.URS_VALUE).subscribe(jsonResp => {
      this.documentDetails = jsonResp.result;
    });
  }

  openDocumentForum() {
    this.documentForumModal = true;
    this.forumView.showModalView();
  }

  closeDocumentForum() {
    this.documentForumModal = false;
  }

  deactivateURS(row) {
    swal({
      title: "Write your comments here:",
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Deactivate',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      useRejections: false
    })
      .then((value) => {
        if (value.dismiss === "cancel")
          row.deactiveFlag = !row.deactiveFlag;
        else if (value.value) {
          const stepperModule = new StepperClass();
          stepperModule.constantName = row.constantName;
          stepperModule.code = row.ursCode;
          stepperModule.lastupdatedTime = row.updatedTime;
          stepperModule.documentIdentity = row.id;
          stepperModule.userRemarks = value.value;
          this.spinnerFlag=true;
          this.permissionService.HTTPPostAPI(stepperModule, "workFlow/deactivateDocument").subscribe(result => {
            this.spinnerFlag=false;
            if (result) {
              swal({
                title: 'success', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
              });
              this.loadAll('published');
              this.viewIndividualData = false;
              this.fileFlag = true;
            }
            else {
              row.deactiveFlag = !row.deactiveFlag;
              swal({
                title: 'Warning!', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
                text: "URS not Deactivated.",
              });
            }
          });
        } else {
          swal({
            title: '',
            text: 'Comments is requried',
            type: 'info',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
          });
          row.deactiveFlag = !row.deactiveFlag;
        }
      },
      err => {
        this.spinnerFlag = false;
      });
  }
  loadDataForOrder() {
    this.unPublishedListForOrder = this.unPublishedList;
    this.unPublishedListForOrder = this.unPublishedListForOrder.sort((a, b) => (a.ursCode < b.ursCode ? -1 : 1));
    this.orderList(this.unPublishedListForOrder);
  }
  orderList(list: any[]) {
    let index = 1;
    list.forEach(e => e.order = index++);
  }

  moveUpOrDown(list: any[], index, upFlag) {
    let i: number = -1;
    if (upFlag) {
      i = index - 1;
    } else {
      i = index + 1;
    }
    if (i != -1) {
      let element = list[index];
      list[index] = list[i];
      list[index].order = index + 1;
      list[i] = element;
      list[i].order = i + 1;
    }
  }
  updateOrder(userRemarks: any) {
    this.spinnerFlag = true;
    if (this.unPublishedListForOrder.length > 0) {
      this.unPublishedListForOrder[0].userRemarks = userRemarks;
    }
    this.ursService.updateUrsCodeOrder(this.unPublishedListForOrder).subscribe(jsonResp => {
      this.spinnerFlag = false;
      this.ursCodeOrderModal.hide();
      this.loadAll('draft');
    });
  }

  openSuccessUpdateSwal() {
    swal({
      title: "Write your comments here:",
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Update',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
    })
      .then((value) => {
        if (value) {
          let userRemarks = "Comments : " + value;
          this.updateOrder(userRemarks);
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


  navigateToChild(key, row) {
    let url;
    let id;
    let roleBack = this.popupdata.length > 0 ? this.popupdata[0].id : 0
    switch (key) {
      case "200":
        url = '/sp-master';
        id = row.id;

        break;
      case "113":
        url = '/riskAssessment';
        id = row.id;
        break;
      case "150":
        url = row.url;
        id = row.id;
        roleBack = "/URS/view-urs";
        break;
      case "201":
        url = '/Ad-hoc/view-Ad-hoc-testcase';
        id = row.id;
        break;
      default:
        url = undefined
        break;
    }
    if (url) {
      this.router.navigate([url],
        {
          queryParams: {
            id: id,
            status: "/URS/view-urs",
            roleBack: roleBack,
            roleBackId: this.popupdata.length > 0 ? this.popupdata[0].id : 0
          },
          skipLocationChange: true
        });
    }

  }
  importUrsModal() {
    this.importUrs.showModalView();
  }

  onChangeStatus(checkList) {
    this.spinnerFlag = true;
    this.permissionService.HTTPGetAPI("urs/changeChecklistStatus/" + checkList.id).subscribe(res => {
      if (res.result) {
        checkList.updatedBy = res.result.updatedBy;
        checkList.displayUpdatedTime = res.result.displayUpdatedTime;
      }
      this.spinnerFlag = false;
    });
  }
  onCloseImportUrsModal() {
    this.loadAll('draft')
  }
  loadSelectAllDataForPublish(event) {
    this.ursListForPublish = new Array();
    if (event.currentTarget.checked) {
      this.spinnerFlag = true;
      this.ursService.getUsrListBasedOnCurrentTab(-1, 'draft').subscribe(jsonResp => {
        this.spinnerFlag = false;
        this.ursListForPublish = jsonResp.unpublishedList;
        this.ursListForPublish.forEach(d => {
          d.publishedflag = true;
        });
      });
    }
  }
  
  onClickCompliance(data){
    this.complianceAssesmentModal.viewModalWithData(data.complianceRequirements,data.id);
  }

  onSubmitComplianceAssesment(event){
    this.popupdata[0].complianceRequirements=event;
  }
}
