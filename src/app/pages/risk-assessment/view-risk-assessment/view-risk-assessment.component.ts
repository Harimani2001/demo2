import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';
import { Helper } from '../../../shared/helper';
import { DocumentSummaryDTO, RiskAssessment, WorkflowDocumentStatusDTO, Page } from '../../../models/model';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { Permissions } from '../../../shared/config';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { ConfigService } from '../../../shared/config.service';
import { RiskAssessmentService } from '../risk-assessment.service';
import { StepperClass } from './../../../models/model';
import { priorityService } from '../../priority/priority.service';
import { projectsetupService } from '../../projectsetup/projectsetup.service';
import { UrsService } from '../../urs/urs.service';

@Component({
  selector: 'app-view-risk-assessment',
  templateUrl: './view-risk-assessment.component.html',
  styleUrls: ['./view-risk-assessment.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ViewRiskAssessmentComponent implements OnInit, AfterViewInit {
  @ViewChild('riskTab') tab: any;
  @ViewChild('myTable') table: any;
  @ViewChild('documentcomments') documentcomments: any;
  spinnerFlag = false;
  commonDocumentStatusValue: any;
  total: any;
  current: any;
  unPublishedList: any[] = new Array();
  testcaseData: any[] = new Array();
  viewFlagUrs: boolean = false;
  publishedList: any[] = new Array();
  selectAll: boolean = false;
  dataXls: any;
  riskAssessmentModal: RiskAssessment[];
  isRiskButton: boolean = true;
  public filterQuery = '';
  viewIndividualData: boolean = false;
  riskAssesmentData: any = [];
  modal: Permissions = new Permissions(this.helper.RISK_ASSESSMENT_VALUE, false);
  subscription: any;
  routeback: any = null;
  roleBack: any = null;
  public currentDocType: any;
  public currentDocStatus: any;
  public currentCreatedBy: any;
  public currentModifiedDate: any;
  modalSpinner: boolean = false;
  testCase: Permissions = new Permissions(this.helper.TEST_CASE_CREATION_VALUE, false);
  unScriptedTestCase: Permissions = new Permissions(this.helper.Unscripted_Value, false);
  isSelectedPublishData: boolean = false;
  isWorkflowDocumentOrderSequence: string;
  isMultiplePDF: boolean = false;
  priorityList: any;
  returnColor: any = '';
  residualReturnColor: any = '';
  isUnScriptedTestcaseModulePermission: boolean = false;
  isTestcaseModulePermission: boolean = false;
  workFlowPermis = [];
  testcaseWorkFlowPer: boolean = false;
  search: boolean = false;
  documentDetails: DocumentSummaryDTO;
  viewpdf: boolean = false;
  draftIds: any[] = new Array();
  viewPdfPreview: boolean = false;
  viewCsvExport: boolean = false;
  @ViewChild('forumView') forumView: any;
  documentForumModal: boolean = false;
  commentsDocumentsList: any[] = new Array();
  ursDetailedView: boolean;
  selectedUrsDetails: any[] = new Array();
  residualRiskAssessment: boolean = false;
  showSearch: boolean = false;
  page: Page = new Page();
  riskListForPublish: any[] = new Array();
  documentLock: boolean;

  constructor(public permissionService: ConfigService, public service: RiskAssessmentService, private projectsetupService: projectsetupService,
    public helper: Helper, public router: Router, public adminComponent: AdminComponent, public priorityService: priorityService,
    private route: ActivatedRoute, public ursService: UrsService) {
    this.loadPermissions();
    this.route.queryParams.subscribe(query => {
      if (!this.helper.isEmpty(query.id)) {
        this.adminComponent.taskDocType = this.helper.RISK_ASSESSMENT_VALUE;
        this.adminComponent.taskEquipmentId = 0;
        this.adminComponent.taskDocTypeUniqueId = query.id;
        this.routeback = query.status;
        this.commonDocumentStatusValue = query.status;
        if (query.roleBack != undefined) {
          this.roleBack = query.roleBack;
        }
        this.viewRowDetails(query.id, query.status)
        this.helper.changeMessageforId(query.id)
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

  ngOnInit() {
    this.page.pageNumber = 0;
    this.page.size = this.helper.PAGE_SIZE;;
    this.setPage({ offset: 0 });
    this.adminComponent.setUpModuleForHelpContent(this.helper.RISK_ASSESSMENT_VALUE);
    this.adminComponent.taskDocType = this.helper.RISK_ASSESSMENT_VALUE;
    this.adminComponent.taskEquipmentId = 0;
    this.adminComponent.taskDocTypeUniqueId = "";
    this.checkRiskDataPresent();
    this.getDocumentLockStatus();
  }

  saveCurrentTab(tabName) {
    this.permissionService.saveUserPreference(this.helper.RISK_ASSESSMENT_VALUE, tabName).subscribe(res => { });
  }

  getDocumentLockStatus() {
    this.permissionService.HTTPGetAPI("workflowConfiguration/getDocumentLockStatus/" + this.helper.RISK_ASSESSMENT_VALUE).subscribe(jsonResp => {
      this.documentLock = jsonResp.result;
    })
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.permissionService.getUserPreference(this.helper.RISK_ASSESSMENT_VALUE).subscribe(res => {
      if (res.result)
        this.loadRiskDataOnTab(res.result);
      else
        this.loadRiskDataOnTab();
    });
  }
  ngAfterViewInit(): void {
    this.permissionService.getUserPreference(this.helper.RISK_ASSESSMENT_VALUE).subscribe(res => {
      if (res.result)
        this.tab.activeId = res.result;
    });
  }

  loadPermissions() {
    this.permissionService.loadPermissionsBasedOnModule(this.helper.RISK_ASSESSMENT_VALUE).subscribe(resp => {
      this.modal = resp;
    });
    this.permissionService.checkIndividualModulePermission(this.helper.TEST_CASE_CREATION_VALUE).subscribe(resp => {
      this.isTestcaseModulePermission = resp;
    });
    this.permissionService.checkIndividualModulePermission(this.helper.Unscripted_Value).subscribe(resp => {
      this.isUnScriptedTestcaseModulePermission = resp;
    });

    this.permissionService.loadPermissionsBasedOnModule(this.helper.Unscripted_Value).subscribe(resp => {
      if (resp.createButtonFlag) {
        this.unScriptedTestCase = resp;
      }
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
    this.permissionService.loadDocBasedOnProject().subscribe(res => {
      this.workFlowPermis = res;
      if (this.workFlowPermis.length > 0) {
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
      }
    });
  }

  loadRiskDataOnTab(tabName?) {
    this.search = false;
    this.unPublishedList = [];
    this.publishedList = [];
    this.draftIds = [];
    this.commentsDocumentsList = new Array();
    var currentTab = 'draft';
    if (tabName) {
      currentTab = tabName;
    }
    if (currentTab == 'draft')
      this.permissionService.isWorkflowDocumentOrderSequence(this.helper.RISK_ASSESSMENT_VALUE).subscribe(resp => {
        this.isWorkflowDocumentOrderSequence = resp;
      });
    if (currentTab != 'draft') {
      this.selectAll = false
    }
    if (currentTab == 'draft' || currentTab == 'published') {
      this.spinnerFlag = true;
      this.search = true;
      this.service.loadRiskDataOnTab(this.page.pageNumber, currentTab).subscribe(jsonResp => {
        this.page.totalElements = jsonResp.totalElements;
        this.page.totalPages = jsonResp.totalPages;
        if (jsonResp.unpublishedList && jsonResp.unpublishedList.length > 0) {
          this.unPublishedList = jsonResp.unpublishedList;
          this.draftIds = this.unPublishedList.map(m => m.id);
          this.commentsDocumentsList = this.unPublishedList.map(u => ({ 'id': u.id, 'type': "code", 'value': u.assessmentCode }));
        }
        if (jsonResp.publishedList && jsonResp.publishedList.length > 0) {
          this.publishedList = jsonResp.publishedList;
          this.commentsDocumentsList = this.publishedList.map(u => ({ 'id': u.id, 'type': "code", 'value': u.assessmentCode }));
        }

        this.spinnerFlag = false;
        if ((this.unPublishedList.length != 0 || this.publishedList.length != 0) && !this.isMultiplePDF) {
          this.permissionService.isMultiplePDF(this.helper.RISK_ASSESSMENT_VALUE).subscribe(resp => {
            this.isMultiplePDF = resp;
          });
        }
        if (this.selectAll && currentTab == 'draft') {
          this.unPublishedList.forEach(d => {
            d.publishedflag = true;
          });
        }
        if (currentTab = 'audit')
          this.viewPdfPreview = true;
      }, err => { this.spinnerFlag = false; });
    } else {
      if (currentTab == 'summary') {
        this.viewCsvExport = true;
      }

      if (currentTab == 'feedback') {
        this.permissionService.loadDocumentForumCodes(this.helper.RISK_ASSESSMENT_VALUE).subscribe(resp => {
          this.commentsDocumentsList = resp;
        });
      }
    }
  }

  /**
   * @param tabName => draft or published are the two tab to load data from REST API
   */
  tabChange(tabName: any) {
    this.permissionService.saveUserPreference(this.helper.RISK_ASSESSMENT_VALUE, tabName).subscribe(res => {
      this.viewPdfPreview = this.viewCsvExport = this.isSelectedPublishData = false;
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
    this.router.navigate(['/table-of-content'], { queryParams: { docId: this.helper.RISK_ASSESSMENT_VALUE, status: document.location.pathname }, skipLocationChange: true });
  }

  onClickTestCases(riskId: number) {
    this.router.navigate(['/tc-add'], { queryParams: { riskForTest: riskId, status: document.location.pathname }, skipLocationChange: true });
  }

  onClickUnScriptedTestCases(riskId: number) {
    this.router.navigate(['/Ad-hoc/add-Ad-hoc-testcase'], { queryParams: { riskForTest: riskId, status: document.location.pathname }, skipLocationChange: true });
  }

  openSuccessCancelSwal(deleteObj, i) {
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
          deleteObj.userRemarks = value;
          this.delete(deleteObj, i);
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

  delete(dataObj, i) {
    this.service.delete(dataObj).subscribe((resp) => {
      if (resp.result === "success") {
        swal({
          title: 'Deleted!', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
          text: 'Record has been deleted',
          onClose: () => {
            this.unPublishedList.splice(i, 1);
            if (resp.noData === 'N') {
              this.viewRowDetails(resp.id);
            } else {
              this.loadRiskDataOnTab();
              this.viewIndividualData = false;
            }
          }
        });
      } else {
        swal({
          title: 'Not Deleted!', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
          text: 'Record has not been deleted',
        });
      }
    }, (err) => {
      swal({
        title: 'Not Deleted!', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
        text: 'Record has not been deleted',
      });
    });
  }

  viewRowDetails(rowId: any, status?) {
    this.adminComponent.taskDocType = this.helper.RISK_ASSESSMENT_VALUE;
    this.adminComponent.taskDocTypeUniqueId = rowId;
    this.adminComponent.taskEquipmentId = 0;
    this.viewFlagUrs = false;
    if (status != undefined)
      this.commonDocumentStatusValue = status;
    this.spinnerFlag = true;
    this.riskAssesmentData = [];
    this.service.edit(rowId).subscribe(jsonResp => {
      this.viewIndividualData = true;
      this.ursService.getSelectedUrsAndSpecAndRiskDetails({ "ursIds": jsonResp.result.selectedUrsIds, "specIds": jsonResp.result.specificationIds, "riskIds": [] }).subscribe(resp => {
        this.selectedUrsDetails = resp.result;
      });
      jsonResp.result.formData = JSON.parse(jsonResp.result.jsonExtraData);
      this.priority(jsonResp.result.priorityName);
      this.residualPriority(jsonResp.result.residualPriorityName);
      this.riskAssesmentData.push(jsonResp.result);
      this.workflowfunction(jsonResp);
      let stepperModule: StepperClass = new StepperClass();
      stepperModule.constantName = jsonResp.result.constantName;
      stepperModule.documentIdentity = jsonResp.result.id;
      stepperModule.code = jsonResp.result.assessmentCode;
      stepperModule.publishedFlag = jsonResp.result.publishedflag;
      stepperModule.creatorId = jsonResp.result.creatorId;
      stepperModule.lastupdatedTime = jsonResp.result.lastUpdatedTime;
      this.helper.stepperchange(stepperModule);
      this.total = jsonResp.total;
      this.current = jsonResp.current;
      this.spinnerFlag = false;
      this.service.mappedTestCaseDetails(rowId).subscribe(res => {
        this.testcaseData = res;
      });
    },
      err => {
        this.spinnerFlag = false;
      }
    );
  }

  reload(data) {
    this.viewRowDetails(data.result);
  }

  workflowfunction(jsonResp: any) {
    if (jsonResp.result.publishedflag) {
      const workflowmodal: WorkflowDocumentStatusDTO = new WorkflowDocumentStatusDTO();
      workflowmodal.documentType = this.helper.RISK_ASSESSMENT_VALUE;
      workflowmodal.documentId = jsonResp.result.id;
      workflowmodal.currentLevel = jsonResp.result.currentCommonLevel;
      workflowmodal.documentCode = jsonResp.result.assessmentCode;
      workflowmodal.workflowAccess = jsonResp.result.workflowAccess;
      workflowmodal.docName = 'Risk Assessment';
      workflowmodal.publishFlag = jsonResp.result.publishedflag;
      this.helper.setIndividulaWorkflowData(workflowmodal);
    }
  }

  excelExport() {
    this.service.excelExport().subscribe(resp => {
      if (resp.result) {
        this.adminComponent.previewOrDownloadByBase64(resp.sheetName + ".xls", resp.sheet, false);
      }
    })
  }

  loadDocumentCommentLog(row) {
    row.constantName = this.helper.RISK_ASSESSMENT_VALUE;
    this.documentcomments.loadDocumentCommentLog(row);
  }

  publishData() {
    this.spinnerFlag = true;
    this.service.publishRiskAssessment(this.selectAll ? this.riskListForPublish : this.unPublishedList).subscribe(result => {
      this.spinnerFlag = false;
      this.tabChange('draft');
      this.selectAll = false;
    });
  }

  SinglepublishData(data) {
    this.spinnerFlag = true;
    data.publishedflag = true;
    this.service.singlePublishRiskAssessment(data).subscribe(res => {
      if (res.msg === this.helper.SUCCESS_RESULT_MESSAGE) {
        if (res.finish === undefined) {
          this.viewRowDetails(res.result);
        } else {
          this.loadRiskDataOnTab();
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

  onClickClose() {
    this.adminComponent.taskDocTypeUniqueId = "";
    this.adminComponent.taskEquipmentId = 0;
    this.viewIndividualData = false;
    setTimeout(() => {
      this.permissionService.getUserPreference(this.helper.RISK_ASSESSMENT_VALUE).subscribe(res => {
        if (res.result)
          this.tab.activeId = res.result;
        this.tabChange(this.tab.activeId);
      });
    }, 10)
  }

  selectAllData(event) {
    this.selectAll = event.currentTarget.checked;
    if (event.currentTarget.checked) {
      this.unPublishedList.forEach(d => {
        if (d.allURSWFCompleted && d.allSpecWFCompleted) {
          d.publishedflag = true;
          this.isSelectedPublishData = true;
        }
      });
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
    this.service.loadPreviewDocument(data).subscribe(resp => {
      this.spinnerFlag = false;
      if (resp != null) {
        this.adminComponent.previewByBlob(data.assessmentCode + '.' + extention, resp, flag, 'Risk Assessment Preview');
      }
    }, err => this.spinnerFlag = false);
  }

  multipleDocumentPreview(flag, extention) {
    this.spinnerFlag = true;
    this.service.loadPreviewForMultipleDocument(extention, this.helper.RISK_ASSESSMENT_VALUE).subscribe(resp => {
      this.spinnerFlag = false;
      if (resp != null) {
        this.adminComponent.previewByBlob('Risk Assessment' + '.' + extention, resp, flag, 'Risk Assessment Preview');
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
  residualPriority(data) {
    this.priorityList = [];
    this.priorityService.loadAllPriority().subscribe(response => {
      this.priorityList = response.result;
      let filteredData: any;
      filteredData = this.priorityList.filter(res => data == res.residualPriorityName);
      if (!this.helper.isEmpty(filteredData))
        filteredData.forEach(element => {
          this.residualReturnColor = element.priorityColor;
        });
      return this.residualReturnColor;
    });
  }

  createRisk() {
    if (this.modal.createButtonFlag && this.modal.userInWorkFlow) {
      this.router.navigate(["/add-riskAssessment"])
    } else {
      if (!this.modal.createButtonFlag) {
        swal({
          title: 'Warning!', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
          text: "You don't have create permission. Please contact admin!.",
        });
      }
    }
  }

  checkRiskDataPresent() {
    this.projectsetupService.loadDocumentSummary(this.helper.RISK_ASSESSMENT_VALUE).subscribe(jsonResp => {
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

  urlRedirection(id, riskId) {
    this.router.navigate(['/URS/view-urs'], { queryParams: { id: id, status: '/riskAssessment', roleBack: riskId }, skipLocationChange: true });
  }
  onClickResidual(row) {
    swal({
      title: "Write your comments here:",
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Residual Risk Assessment',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
      useRejections: false
    })
      .then((value) => {
        if (value.dismiss === "cancel") {
          this.residualRiskAssessment = false;
        } else if (value.value) {
          this.spinnerFlag = true;
          this.permissionService.HTTPGetAPI("risk-assessment/changeToDraft/" + row.id + "/" + value.value).subscribe(result => {
            this.spinnerFlag = false;
            if (result) {
              this.residualRiskAssessment = false;
              this.router.navigate(["/add-riskAssessment", row.id])
            }
            else {
              this.residualRiskAssessment = false;
              swal({
                title: 'Warning!', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
                text: "Risk Assessment not Deactivated.",
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
          this.residualRiskAssessment = false;
        }
      });
  }

  navigateToChild(key, row) {
    let url;
    let id;
    let roleBack = this.riskAssesmentData.length > 0 ? this.riskAssesmentData[0].id : 0
    switch (key) {
      case "150":
        url = row.url;
        id = row.id;
        roleBack = '/riskAssessment';
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
        { queryParams: { id: id, status: '/riskAssessment', roleBack: roleBack, roleBackId: this.riskAssesmentData.length > 0 ? this.riskAssesmentData[0].id : 0 }, skipLocationChange: true });
    }
  }
  loadSelectAllDataForPublish(event) {
    this.riskListForPublish = new Array();
    if (event.currentTarget.checked) {
      this.spinnerFlag = true;
      this.service.loadRiskDataOnTab(-1, 'draft').subscribe(jsonResp => {
        this.spinnerFlag = false;
        this.riskListForPublish = jsonResp.unpublishedList;
        this.riskListForPublish.forEach(d => {
          if (d.allURSWFCompleted && d.allSpecWFCompleted) {
            d.publishedflag = true;
            this.isSelectedPublishData = true;
          }
        });
      });
    }
  }
}
