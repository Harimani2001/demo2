import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Helper } from '../../shared/helper';
import { AdminComponent } from '../../layout/admin/admin.component';
import { ConfigService } from '../../shared/config.service';
import { Permissions } from '../../shared/config';
import { SpecificationMasterDTO, WorkflowDocumentStatusDTO, StepperClass, Page } from '../../models/model';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { UrsService } from '../urs/urs.service';
import { IOption } from '../../../../node_modules/ng-select';
import { FormExtendedComponent } from '../form-extended/form-extended.component';
import { FileUploadForDocComponent } from '../file-upload-for-doc/file-upload-for-doc.component';
import { SpecificationMasterService } from './specification-master.service';
import swal from 'sweetalert2';
import { AuditTrailViewComponent } from '../audit-trail-view/audit-trail-view.component';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { MasterControlService } from '../master-control/master-control.service';
@Component({
  selector: 'app-specification-master',
  templateUrl: './specification-master.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./specification-master.component.css', '../../../../node_modules/sweetalert2/dist/sweetalert2.min.css']
})

export class SpecificationMasterComponent implements OnInit {
  public filterQuery = '';
  routeback: any = null;
  roleBack: any = null;
  spinnerFlag = false;
  data: any;
  permissionModal: Permissions = new Permissions(this.helper.SP_VALUE, false);
  riskPermission: Permissions = new Permissions(this.helper.RISK_ASSESSMENT_VALUE, false);
  testCase: Permissions = new Permissions(this.helper.TEST_CASE_CREATION_VALUE, false);
  adHocPermission: Permissions = new Permissions(this.helper.Unscripted_Value, false);
  modal: SpecificationMasterDTO = new SpecificationMasterDTO();
  spType: any;
  ursList: any[] = new Array();
  simpleOption: Array<IOption> = new Array<IOption>();
  selectedUrsIds: any[] = new Array();
  selectedUrsDetails: any[] = new Array();
  showAdd: boolean = false;
  editorSwap: boolean = false;
  submitted: boolean = false;
  public editor;
  fileFlag: boolean = true;
  popupdata = [];
  search: boolean = true;
  receivedId: string;
  @ViewChild('formExtendedId') private formExtendedComponent: FormExtendedComponent;
  @ViewChild('fileupload') private file: FileUploadForDocComponent;
  @ViewChild('documentcomments') documentcomments: any;
  @ViewChild('auditView') auditView: AuditTrailViewComponent;
  @ViewChild('spTab') tab: any;
  @ViewChild('ursModal') private ursModal: any;
  @ViewChild('myTable') table: any;
  public inputField: any = new Array();
  public unPublishedList: any[] = new Array();
  publishedData: any[] = new Array();
  isSelectedPublishData: boolean = false;
  isWorkflowDocumentOrderSequence: string;
  viewIndividualData: boolean = false;
  total: any;
  current: any;
  isMultiplePDF: boolean = false;
  selectAll: boolean = false;
  specData: any[] = new Array();
  viewFlagSpec: boolean = false;
  isTestcaseModulePermission: boolean = false;
  workFlowPermis = [];
  riskWorkFlowPer: boolean = false;
  testcaseWorkFlowPer: boolean = false;
  redirctUrlFormUrsView: any;
  viewpdf: boolean = false;
  draftIds: any[] = new Array();
  viewPdfPreview: boolean = false;
  viewCsvExport: boolean = false;
  @ViewChild('forumView') forumView: any;
  documentForumModal: boolean = false;
  commentsDocumentsList: any[] = new Array();
  backURL: any;
  showSearch: boolean = false;
  page: Page = new Page();
  specListForPublish: any[] = new Array();
  documentLock: boolean;

  constructor(private masterControlService: MasterControlService, public service: SpecificationMasterService, private route: ActivatedRoute, private auditPage: AuditTrailViewComponent,
    public ursService: UrsService, public lookUpService: LookUpService, public helper: Helper, public permissionService: ConfigService, private adminComponent: AdminComponent,
    public router: Router) {
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
      if (query.status)
        this.backURL = query.status;
    });
    this.helper.listen().subscribe((m: any) => {
      this.viewRowDetails(m)
    })
  }

  loadPermissions() {
    this.permissionService.loadPermissionsBasedOnModule(this.helper.SP_VALUE).subscribe(resp => {
      this.permissionModal = resp;
    });
    //To Check the create permission
    this.permissionService.loadPermissionsBasedOnModule(this.helper.RISK_ASSESSMENT_VALUE).subscribe(resp => {
      this.riskPermission = resp;
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

  ngOnInit(): void {
    this.selectAll = false;
    this.page.pageNumber = 0;
    this.page.size = this.helper.PAGE_SIZE;;
    this.setPage({ offset: 0 });
    this.route.queryParams.subscribe(query => {
      if (query.ursForSP) {
        this.intialize();
        this.loadURS(query.ursForSP);
      }
    });
    this.adminComponent.setUpModuleForHelpContent(this.helper.SP_VALUE);
    this.adminComponent.taskDocType = this.helper.SP_VALUE;
    this.adminComponent.taskDocTypeUniqueId = '';
    this.adminComponent.taskEquipmentId = 0;
    this.adminComponent.taskEnbleFlag = true;
    this.loadTheWorkFlowPermissions();
    this.getSP_Types();
    this.getDocumentLockStatus();
    this.permissionService.loadDocumentForumCodes(this.helper.SP_VALUE).subscribe(resp => {
      this.commentsDocumentsList = resp;
    });
  }

  getDocumentLockStatus() {
    this.permissionService.HTTPGetAPI("workflowConfiguration/getDocumentLockStatus/" + this.helper.SP_VALUE).subscribe(jsonResp => {
      this.documentLock = jsonResp.result;
    })
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.permissionService.getUserPreference(this.helper.SP_VALUE).subscribe(res => {
      if (res.result)
        this.loadAll(res.result);
      else
        this.loadAll();
    });
  }
  ngAfterViewInit(): void {
    this.permissionService.getUserPreference(this.helper.SP_VALUE).subscribe(res => {
      if (res.result)
        this.tab.activeId = res.result;
    });
  }

  saveCurrentTab(tabName) {
    this.permissionService.saveUserPreference(this.helper.SP_VALUE, tabName).subscribe(res => { });
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
      }
    });
  }

  onClickTableOfContent() {
    this.router.navigate(['/table-of-content'], { queryParams: { docId: this.helper.SP_VALUE, status: document.location.pathname }, skipLocationChange: true });
  }

  onClickRisk(specId: any) {
    this.router.navigate(['/add-riskAssessment'], { queryParams: { specForRisk: [specId], status: document.location.pathname }, skipLocationChange: true });
  }

  onClickTestCases(specId: number) {
    this.router.navigate(['/tc-add'], { queryParams: { specForTest: specId, status: document.location.pathname }, skipLocationChange: true });
  }

  onClickAdHoc(specId: number) {
    this.router.navigate(['/Ad-hoc/add-Ad-hoc-testcase'], { queryParams: { specForAdHoc: specId, status: document.location.pathname }, skipLocationChange: true });
  }

  loadAll(tabId?) {
    this.unPublishedList = [];
    this.publishedData = [];
    this.draftIds = [];

    this.search = false;
    var currentTab = 'draft';
    if (tabId) {
      currentTab = tabId;
    }
    if (currentTab == 'draft')
      this.permissionService.isWorkflowDocumentOrderSequence(this.helper.SP_VALUE).subscribe(resp => {
        this.isWorkflowDocumentOrderSequence = resp;
      });
    if (currentTab != 'draft') {
      this.selectAll = false
    }
    if (currentTab == 'draft' || currentTab == 'published') {
      this.spinnerFlag = true;
      this.search = true;
      this.service.getUsrListBasedOnCurrentTab(this.page.pageNumber, currentTab).subscribe(
        jsonResp => {
          this.page.totalElements = jsonResp.totalElements;
          this.page.totalPages = jsonResp.totalPages;
          if (jsonResp.unpublishedList && jsonResp.unpublishedList.length > 0) {
            this.unPublishedList = jsonResp.unpublishedList;
            this.draftIds = this.unPublishedList.map(m => m.id);
          }
          if (jsonResp.publishedList && jsonResp.publishedList.length > 0)
            this.publishedData = jsonResp.publishedList;
          this.spinnerFlag = false;
          if ((this.publishedData.length != 0 || this.unPublishedList.length != 0) && !this.isMultiplePDF) {
            this.permissionService.isMultiplePDF(this.helper.SP_VALUE).subscribe(resp => {
              this.isMultiplePDF = resp;
            });
          }
          if (this.selectAll && currentTab == 'draft') {
            this.unPublishedList.forEach(d => {
              d.published = true;
            });
          }
          if (currentTab = 'audit')
            this.viewPdfPreview = true;
        },
        err => {
          this.spinnerFlag = false;
        }
      );
    } else {
      if (currentTab == 'summary') {
        this.viewCsvExport = true;
      }
      if (currentTab == 'feedback') {
        this.permissionService.loadDocumentForumCodes(this.helper.SP_VALUE).subscribe(resp => {
          this.commentsDocumentsList = resp;
        });
      }
    }
  }

  loadDocumentCommentLog(row) {
    this.documentcomments.loadDocumentCommentLog(row);
  }

  onChangePublishData() {
    for (let data of this.unPublishedList) {
      if (data.published) {
        this.isSelectedPublishData = true;
        break;
      } else {
        this.isSelectedPublishData = false;
      }
    }
  }

  getSP_Types() {
    this.spinnerFlag = true
    this.lookUpService.getlookUpItemsBasedOnCategory("SpecificationMaster").subscribe(response => {
      this.spinnerFlag = false
      if (response.result == "success") {
        this.spType = response.response
      }
    }, error => { this.spinnerFlag = false });
  }

  loadURS(ursId?): Promise<void> {
    return new Promise<void>((resolve) => {
      this.ursService.getUsrListForProject().subscribe(jsonResp => {
        if (!this.helper.isEmpty(jsonResp.result)) {
          this.ursList = jsonResp.result;
          this.simpleOption = jsonResp.result.map(option => ({ value: +option.id, label: option.ursCode }));
        }
        resolve()
      }, err => {
        this.ursList = [];
        resolve();
      });
      if (ursId) {
        this.showAdd = true;
        this.selectedUrsIds.push(+ursId);
        this.ursList.filter(f => (!this.selectedUrsIds.includes(f.id))).forEach(element => element.selected = false);
        this.ursService.getUrsDeatils(this.selectedUrsIds).subscribe(resp => {
          this.selectedUrsDetails = resp.result;
        });
      }
    });
  }

  onChangeURS() {
    this.ursList.forEach(element => { element.selected = false; });
    this.selectedUrsIds.forEach(data => {
      this.selectedUrsIds.forEach(element => {
        if (element.id === data)
          element.selected = true;
      });
    });
    this.ursService.getUrsDeatils(this.selectedUrsIds).subscribe(resp => {
      this.selectedUrsDetails = resp.result;
    });
  }

  onEditorCreated(quill) {
    this.editor = quill;
  }

  onClickCreate() {
    if (this.permissionModal.createButtonFlag && this.permissionModal.userInWorkFlow) {
      this.intialize();
      this.loadURS();
    } else {
      if (!this.permissionModal.createButtonFlag) {
        swal({
          title: 'Warning!', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
          text: "You don't have create permission. Please contact admin!.",
        });
      }
    }
  }

  intialize() {
    this.receivedId = "";
    this.selectedUrsIds = [];
    this.modal = new SpecificationMasterDTO();
    this.showAdd = true;
    this.selectedUrsDetails = [];
    if (this.submitted)
      this.submitted = false;
    this.loadFormExtend();
  }

  viewRowDetails(rowId: any, redirectURL?) {
    this.fileFlag = true;
    this.adminComponent.taskDocTypeUniqueId = rowId;
    this.adminComponent.taskEquipmentId = 0;
    this.viewFlagSpec = false;
    this.spinnerFlag = true;
    if (redirectURL)
      this.redirctUrlFormUrsView = redirectURL;
    this.popupdata = [];
    this.service.getDataForEdit(rowId).subscribe(jsonResp => {
      this.spinnerFlag = false;
      this.workflowfunction(jsonResp);
      this.stepperfunction(jsonResp);
      this.total = jsonResp.total;
      this.current = jsonResp.current;
      jsonResp.result.formData = JSON.parse(jsonResp.result.jsonExtraData);
      this.popupdata.push(jsonResp.result);
      this.viewIndividualData = true;
      setTimeout(() => {
        this.file.loadFileListForEdit(jsonResp.result.id, jsonResp.result.ursCode).then((result) => {
          this.fileFlag = result;
        }).catch((err) => {
          this.spinnerFlag = false;
        });;
        this.spinnerFlag = false;
      }, 1000)
    });
    this.service.getDataForEditForSpecMapping(rowId).subscribe(resp => {
      this.specData = resp;
    });
  }

  stepperfunction(jsonResp: any) {
    const stepperModule: StepperClass = new StepperClass();
    stepperModule.constantName = this.helper.SP_VALUE;
    stepperModule.code = jsonResp.result.spCode;
    stepperModule.lastupdatedTime = jsonResp.result.updatedTime;
    stepperModule.documentIdentity = jsonResp.result.id;
    stepperModule.publishedFlag = jsonResp.result.published;
    stepperModule.creatorId = jsonResp.result.creatorId;
    stepperModule.displayCreatedTime = jsonResp.result.displayCreatedTime;
    stepperModule.displayUpdatedTime = jsonResp.result.displayUpdatedTime;
    stepperModule.documentTitle = jsonResp.result.ursName;
    stepperModule.createdBy = jsonResp.result.createdBy;
    stepperModule.updatedBy = jsonResp.result.updatedBy;
    this.helper.stepperchange(stepperModule);
  }

  workflowfunction(jsonResp: any) {
    if (jsonResp.result.published) {
      const workflowmodal: WorkflowDocumentStatusDTO = new WorkflowDocumentStatusDTO();
      workflowmodal.documentType = this.helper.SP_VALUE;
      workflowmodal.documentId = jsonResp.result.id;
      workflowmodal.currentLevel = jsonResp.result.currentCommonLevel;
      workflowmodal.documentCode = jsonResp.result.spCode;
      workflowmodal.workflowAccess = jsonResp.result.workflowAccess;
      workflowmodal.docName = 'Specification';
      workflowmodal.publishFlag = jsonResp.result.published;
      this.helper.setIndividulaWorkflowData(workflowmodal);
    }
  }

  openSuccessUpdateSwal(formIsValid) {
    if (formIsValid) {
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
            this.saveAndGoto(formIsValid, userRemarks);
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
  }

  saveAndGoto(formIsValid, userRemarks?) {
    this.spinnerFlag = true;
    //!this.formExtendedComponent.validateChildForm()
    if (!formIsValid) {
      this.submitted = true;
      this.spinnerFlag = false;
      return;
    } else {
      this.submitted = false;
      if (this.receivedId != '') {
        this.modal.id = + this.receivedId;
      } else {
        this.modal.id = 0;
      }
      this.modal.spUrsIds = this.selectedUrsIds;
      this.modal.userRemarks = userRemarks;
      this.modal.jsonExtraData = JSON.stringify(this.inputField);
      this.service.saveSP(this.modal).subscribe(result => {
        this.submitted = false;
        this.spinnerFlag = false;
        this.file.uploadFileList(result.dto, this.helper.SP_VALUE, result.dto.spCode).then(re => {
          if (result.result === "success") {
            if (!this.receivedId) {
              swal({
                title: 'Success', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
                text: 'Specification Saved Successfully',
                onClose: () => {
                  this.onClickBack();
                }
              });
            } else {
              swal({
                title: 'Success', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
                text: 'Specification Master Updated Successfully',
                onClose: () => {
                  this.onClickBack();
                }
              });
            }
          } else {
            swal({
              title: 'Error', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
              text: ' Specification Master has not  been saved.',
            }
            );
          }
        },
          err => {
            this.submitted = false;
            this.spinnerFlag = false;
            swal({
              title: 'Error', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
              text: ' User Requirement specification has not  been saved.',
            }
            );
          });
      }, (err) => {
        this.loadAll();
        this.spinnerFlag = false;
        swal({
          title: 'Error', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
          text: ' Specification Master has not  been saved.',
        }
        );
      });
    }
  }

  onClickEdit(data: any) {
    if (this.viewIndividualData) {
      this.viewIndividualData = false;
    }
    this.receivedId = data.id;
    this.showAdd = true;
    this.getSP_Types();
    this.loadURS();
    if (this.receivedId !== undefined) {
      this.service.getDataForEdit(this.receivedId).subscribe(result => {
        if (result.result.jsonExtraData != null && result.result.jsonExtraData != '[]')
          this.inputField = JSON.parse(result.result.jsonExtraData);
        this.modal = result.result;
        this.selectedUrsIds = this.modal.spUrsIds;
        this.ursService.getUrsDeatils(this.selectedUrsIds).subscribe(resp => {
          this.selectedUrsDetails = resp.result;
        });
        if (!this.helper.isEmpty(this.modal.spDescription) && (this.modal.spDescription.includes('<p>')))
          this.editorSwap = true;
        this.file.loadFileListForEdit(this.receivedId, this.modal.spCode).then(() => this.spinnerFlag = false);
      });
    } else {
      this.loadFormExtend();
      this.spinnerFlag = false;
    }
    this.adminComponent.setUpModuleForHelpContent(this.helper.SP_VALUE);

  }

  loadFormExtend() {
    this.masterControlService.loadJsonOfDocumentIfActive(this.helper.SP_VALUE).subscribe(res => {
      if (res) {
        this.inputField = JSON.parse(res.jsonStructure);
        this.formExtendedComponent.setDefaultValue(this.inputField);
      }
    });
  }
  onClickClose() {
    if (this.backURL) {
      this.router.navigate([this.backURL], { queryParams: { id: this.roleBack }, skipLocationChange: true });
    } else {
      this.adminComponent.taskEquipmentId = 0;
      this.adminComponent.taskDocType = this.helper.SP_VALUE;
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

  onClickBack() {
    if (this.backURL) {
      this.router.navigate([this.backURL]);
    } else {
      this.showAdd = false;
      this.loadAll();
    }
  }

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

  tabChange(tabName: any) {
    this.permissionService.saveUserPreference(this.helper.SP_VALUE, tabName).subscribe(res => {
      this.tab.activeId = tabName;
      this.viewCsvExport = this.viewPdfPreview = this.isSelectedPublishData = false;
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

  selectAllData(event) {
    this.selectAll = event.currentTarget.checked;
    if (event.currentTarget.checked) {
      this.unPublishedList.forEach(d => {
        if (d.allURSWFCompleted) {
          d.published = true;
          this.isSelectedPublishData = true;
        }
      });
    } else {
      this.unPublishedList.forEach(d => {
        d.published = false;
      });
      this.isSelectedPublishData = false;
    }
  }

  publishData() {
    this.spinnerFlag = true;
    this.service.publish(this.selectAll ? this.specListForPublish : this.unPublishedList).subscribe(result => {
      this.isSelectedPublishData = false;
      this.selectAll=false;
      this.spinnerFlag = false;
      this.loadAll();
    }, er => {
    });
  }

  deleteUrs(dataObj, i) {
    this.service.deleteUrs(dataObj).subscribe((resp) => {
      if (resp.result === 'success') {
        swal({
          title: 'Deleted!', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
          text: dataObj.spCode + ' record has been deleted',
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
          text: dataObj.spCode + ' record has not been deleted'
        });
      }
    }, (err) => {
      swal({
        title: 'Not Deleted!', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
        text: dataObj.spCode + ' record has not been deleted'
      });
    });
  }

  SinglepublishData(data) {
    this.spinnerFlag = true;
    data.publishedflag = true;
    this.service.singlePublish(data).subscribe(res => {
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
* @param flag => view or download
* @param extention =>doc/docx
*/
  documentPreview(flag, extention, data) {
    this.spinnerFlag = true;
    data.downloadDocType = extention;
    this.service.loadPreviewDocument(data).subscribe(resp => {
      this.spinnerFlag = false;
      if (resp != null) {
        this.adminComponent.previewByBlob(data.spCode + '.' + extention, resp, flag, 'Specification Preview');
      }
    }, err => this.spinnerFlag = false);
  }

  multipleDocumentPreview(flag, extention) {
    this.spinnerFlag = true;
    this.service.loadPreviewForMultipleDocument(extention, this.helper.SP_VALUE).subscribe(resp => {
      this.spinnerFlag = false;
      if (resp != null) {
        this.adminComponent.previewByBlob('Specification' + '.' + extention, resp, flag, 'Specification Preview');
      }
    }, err => this.spinnerFlag = false);
  }

  loadMultipleSelectUrs() {
    this.ursList.forEach(data => data.selected = this.selectedUrsIds.includes(data.id) ? true : false);
    this.ursModal.show();
  }

  onCloseUrsPopup(flag) {
    if (flag)
      this.selectedUrsIds = this.ursList.filter(data => data.selected).map(a => a.id);
    this.ursService.getUrsDeatils(this.selectedUrsIds).subscribe(resp => {
      this.selectedUrsDetails = resp.result;
    });
    this.ursModal.hide();
  }

  reload(data) {
    this.viewRowDetails(data.result);
  }

  excelExport() {
    this.service.excelExport().subscribe(resp => {
      if (resp.result) {
        var nameOfFileToDownload = resp.sheetName + ".xls";
        this.adminComponent.previewOrDownloadByBase64(nameOfFileToDownload, resp.sheet, false);
      }
    })
  }

  openDocumentForum() {
    this.documentForumModal = true;
    this.forumView.showModalView();
  }

  closeDocumentForum() {
    this.documentForumModal = false;
  }

  urlRedirection(id, specId) {
    this.router.navigate(['/URS/view-urs'], { queryParams: { id: id, status: '/sp-master', roleBack: specId }, skipLocationChange: true });
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
        roleBack = '/sp-master';
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
            status: '/sp-master',
            roleBack: roleBack,
            roleBackId: this.popupdata.length > 0 ? this.popupdata[0].id : 0
          },
          skipLocationChange: true
        });
    }

  }
  loadSelectAllDataForPublish(event) {
    this.specListForPublish = new Array();
    if (event.currentTarget.checked) {
      this.spinnerFlag = true;
      this.service.getUsrListBasedOnCurrentTab(-1, 'draft').subscribe(jsonResp => {
        this.spinnerFlag = false;
        this.specListForPublish = jsonResp.unpublishedList;
        this.specListForPublish.forEach(d => {
          if (d.allURSWFCompleted) {
            d.published = true;
            this.isSelectedPublishData = true;
          }
        });
      });
    }
  }
}
