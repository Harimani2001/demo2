import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { DynamicTemplateDTO, StepperClass, WorkflowDocumentStatusDTO, UserPrincipalDTO, TaskTimerTrackingDTO, ProjectTaskDTO, CommonModel, ExternalApprovalDTO } from '../../models/model';
import { Permissions } from '../../shared/config';
import { CommonFileFTPService } from '../common-file-ftp.service';
import { ConfigService } from '../../shared/config.service';
import { AdminComponent } from '../../layout/admin/admin.component';
import { Helper } from '../../shared/helper';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { DynamicTemplateService } from './dynamic-template.service';
import { TaskCreationService } from '../task-creation/task-creation.service';
import { FormEsignVerificationComponent } from '../form-esign-verification/form-esign-verification.component';
import { Http } from '@angular/http';
import { Observable } from 'rxjs'
import { projectPlanService } from '../projectplan/projectplan.service';
import { DatePipe } from '@angular/common';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-dynamic-template',
  templateUrl: './dynamic-template.component.html',
  styleUrls: ['./dynamic-template.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css']
})
export class DynamicTemplateComponent implements OnInit {
  @ViewChild('auditSingleView') auditSingleView
  @ViewChild('formVerification') formVerification: FormEsignVerificationComponent;
  @ViewChild('draftPdfPreview') draftPdfPreview;
  @ViewChild('esignmodal') closeEsignModal: any;
  @ViewChild('modalLarge') approvalModal: any;
  @ViewChild('documentSign') documentChildComponent;
  @ViewChild('externalApprovalmodal') externalApprovalmodal: any;
  @ViewChild('forumView') documentForum;
  @ViewChild('fileuploaddiv') myInputVariable: ElementRef;
  public submitted = false;
  public spinnerFlag = false;
  dynamicTemplate = new DynamicTemplateDTO();
  permissionModel: Permissions = new Permissions(this.helper.TEMPLATE_VALUE, false);
  permissionData: any;
  singleFileUploadFlag: boolean = false;
  multiFileUploadFlag: boolean = false;
  uploadSingleFile: any;
  fileValidationMessage: any = "";
  revisionArray: any[] = new Array<any>();
  leftRevisionArray: any[] = new Array<any>();
  rightRevisionArray: any[] = new Array<any>();
  sourceFile: string = "";
  compareFile: string = "";
  revisionValidationMessage: string = "";
  modalSpinner: any = false;
  sourceFileName: any;
  compareFileName: any;
  routeback: any;
  viewIndividualData: boolean = false;
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  isWorkflowDocumentOrderSequence: string;
  public individualconstants: any;
  public individualId: any;
  projectTaskviewFlag: boolean = false;
  pendingTaskList: any[] = new Array();
  projectPlan: any = [];
  datePipeFormat = 'yyyy-MM-dd';
  timerTrackingDTO: TaskTimerTrackingDTO = new TaskTimerTrackingDTO();
  docLevelUserList: any = [];
  assignedUsers: any[] = new Array();
  currentTaskID: any;
  isUserInWorkFlow: boolean = false;
  modal: ProjectTaskDTO = new ProjectTaskDTO();
  viewpdf: boolean = false;
  draftIds: any[] = new Array();
  viewPdfPreview: boolean = false;
  commentsSwitch: boolean = false;
  pdfURL: any;
  outline: any[];
  pdf: any;
  error: any;
  height: any = "600px";
  heightOutline = '500px';
  public pageVariable: number = 1;
  rotation = 0;
  zoom = 1.1;
  originalSize = true;
  showAll = true;
  autoresize = true;
  fitToPage = false;
  isOutlineShown = true;
  pdfQuery = '';
  outLineList = new Array();
  commentsDocumentsList: any[] = new Array();
  public commonModel: CommonModel = new CommonModel();
  public getStatus: any = [];
  public filteredPendingDocList: any[] = new Array();
  public loadStepperList: any[] = new Array();
  currentLevelIndex: number;
  currentLevelData: any;
  public previewdoc: any = [];
  userApprovalList: any = new Array();
  public comments: any = null;
  public filteredData: any[] = new Array();
  public filteredApprovalData: any[] = new Array();
  public esignActionData: WorkflowDocumentStatusDTO[] = new Array<WorkflowDocumentStatusDTO>();
  public onExternalApprovalForm: FormGroup;
  externalApprovalDTO: ExternalApprovalDTO;
  groupingFlag: boolean = false;

  constructor(public fb: FormBuilder, public router: Router, public activeRouter: ActivatedRoute, private http: Http,
    public service: DynamicTemplateService, public helper: Helper, private adminComponent: AdminComponent,
    public permissionService: ConfigService, private commonService: CommonFileFTPService,
    private taskCreationService: TaskCreationService, public projectplanService: projectPlanService, public datePipe: DatePipe,
    private servie: DateFormatSettingsService) {
  }

  ngOnInit() {
      this.helper.listen().subscribe((m: any) => {
        this.loadDynamicTemplate(m, "/documentapprovalstatus", '/MainMenu')
      })
    this.onExternalApprovalForm = this.fb.group({
      name: ['', Validators.compose([
        Validators.required
      ])],
      email: ['', Validators.compose([
        Validators.required, Validators.pattern('[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')
      ])],
      remarks: ['', Validators.compose([
        Validators.required
      ])],
      validity: ['', Validators.compose([
        Validators.required
      ])]
    });
    this.permissionService.loadCurrentUserDetails().subscribe(res => {
      this.currentUser = res;
      this.adminComponent.setUpModuleForHelpContent("");
      this.adminComponent.taskEnbleFlag = true;
      this.adminComponent.taskDocType = "";
      this.adminComponent.taskDocTypeUniqueId = "";
      this.adminComponent.taskEquipmentId = 0;
      this.activeRouter.queryParams.subscribe(queryData => {
        if (queryData.status != undefined) {
          this.routeback = queryData.status;
          this.loadDynamicTemplate(queryData.id, queryData.exists, queryData.status);
          this.helper.changeMessageforId(queryData.id);
        } else {
          this.loadDynamicTemplate(queryData.id, queryData.exists, queryData.status);
        }
      });
      this.helper.listen().subscribe((m: any) => {
        this.loadDynamicTemplate(m, "true", "/documentapprovalstatus")
      });
    });
  }

  loadDynamicTemplate(id, exists, redirectUrl) {
    if (redirectUrl) {
      this.routeback = redirectUrl;
    } else {
      this.routeback = "/MainMenu"
    }
    if ("/documentapprovalstatus" === exists || this.helper.isEmpty(exists))
      exists = "true";
    this.service.loadDynamicTemplateForProject({ "id": id, "exists": exists }).subscribe(res => {
      if (res != null) {
        this.dynamicTemplate = res;
        this.draftIds.push(this.dynamicTemplate.id);
        this.commentsDocumentsList.push({ "id": this.dynamicTemplate.id, "value": this.dynamicTemplate.dynamicTemplateCode, "type": "code" });
        this.adminComponent.taskDocType = this.dynamicTemplate.permissionConstant;
        this.adminComponent.taskDocTypeUniqueId = id;
        this.adminComponent.taskEnbleFlag = true;
        this.adminComponent.taskEquipmentId = 0;
        this.workflowfunction(res);
        this.permissionService.loadPermissionsBasedOnModule(this.dynamicTemplate.permissionConstant).subscribe(resp => {
          this.permissionModel = resp;
        });
        this.permissionService.isWorkflowDocumentOrderSequence(this.dynamicTemplate.permissionConstant).subscribe(resp => {
          this.isWorkflowDocumentOrderSequence = resp;
        });
        let docList = [this.dynamicTemplate.permissionConstant];
        this.permissionService.isUserInWorkFlow(docList).subscribe(resp => {
          this.isUserInWorkFlow = resp;
        });
        this.adminComponent.setUpModuleForHelpContent(this.dynamicTemplate.permissionConstant);
        this.spinnerFlag = false;
        if (this.dynamicTemplate.publishedflag)
          this.downloadFileOrViewAfterPublish(true);
        else
          this.downloadFileOrView(this.dynamicTemplate, true);
        if (this.dynamicTemplate.id != 0 && !this.dynamicTemplate.publishedflag)
          this.viewPdfPreview = true;
        else
          this.viewPdfPreview = false;
        if (this.dynamicTemplate.id != 0) {
          let stepperModule: StepperClass = new StepperClass();
          stepperModule.constantName = this.dynamicTemplate.permissionConstant;
          stepperModule.documentIdentity = this.dynamicTemplate.id;
          stepperModule.code = this.dynamicTemplate.dynamicTemplateCode;
          stepperModule.publishedFlag = this.dynamicTemplate.publishedflag;
          stepperModule.creatorId = this.dynamicTemplate.createdBy;
          stepperModule.lastupdatedTime = this.dynamicTemplate.updatedTime;
          stepperModule.displayCreatedTime = this.dynamicTemplate.displayCreatedTime;
          stepperModule.displayUpdatedTime = this.dynamicTemplate.displayUpdatedTime;
          stepperModule.documentTitle = this.dynamicTemplate.templateName;
          stepperModule.createdBy = this.dynamicTemplate.createdByName;
          stepperModule.updatedBy = this.dynamicTemplate.lastUpdatedByName;
          this.helper.stepperchange(stepperModule);
          this.individualconstants = this.dynamicTemplate.permissionConstant;
          this.individualId = this.dynamicTemplate.id;
        }
        if (this.auditSingleView && this.auditSingleView.viewFlag)//when audit is in view and tab is changes need to update the audit
          this.auditSingleView.loadData(this.individualconstants, this.individualId);
        this.loadTaskData();
      } else {
        this.spinnerFlag = false
      }
    })
  }

  onClickHide() {
    this.draftPdfPreview.hide();
    this.viewpdf = false;
    this.ngOnInit();
  }

  workflowfunction(jsonResp: any) {
    if (jsonResp.publishedflag) {
      const workflowmodal: WorkflowDocumentStatusDTO = new WorkflowDocumentStatusDTO();
      workflowmodal.documentType = jsonResp.permissionConstant;
      workflowmodal.documentId = jsonResp.id;
      workflowmodal.currentLevel = jsonResp.currentCommonLevel;
      workflowmodal.documentCode = jsonResp.dynamicTemplateCode;
      workflowmodal.workflowAccess = jsonResp.workflowAccess;
      workflowmodal.docName = jsonResp.templateName;
      workflowmodal.publishFlag = jsonResp.publishedflag;
      this.helper.setIndividulaWorkflowData(workflowmodal);
    }
  }

  openSuccessCancelSwal() {
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
          this.saveDynamicTemplateData(userRemarks);
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

  saveDynamicTemplateData(userRemarks?) {
    this.submitted = true;
    if (this.dynamicTemplate.fileName == "" || this.fileValidationMessage != "") {
      return
    } else {
      if (this.dynamicTemplate.id == 0) {
        this.dynamicTemplate.createdBy = this.currentUser.id;
      } else {
        this.dynamicTemplate.userRemarks = userRemarks;
      }
      this.dynamicTemplate.updatedBy = this.currentUser.id;
      this.dynamicTemplate.loginUserId = this.currentUser.id;
      this.dynamicTemplate.organizationOfLoginUser = this.currentUser.orgId;
      this.dynamicTemplate.projectId = this.currentUser.projectId;
      this.dynamicTemplate.globalProjectId = this.currentUser.projectId;
      this.dynamicTemplate.projectVersionId = this.currentUser.versionId;
      this.service.saveDynamicTemplateForProject(this.dynamicTemplate).subscribe(data => {
        if (data.result.message == "success") {
          this.spinnerFlag = false;
          var status = this.dynamicTemplate.id == 0 ? "Saved" : "Update";
          swal({
            title: status + ' Successfully!',
            text: this.dynamicTemplate.templateName + ' template has been saved.',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              if (this.dynamicTemplate.id == 0) {
                let url = 'newDynamicTemplate?' + data.result.id + '&true'
                this.adminComponent.redirect(url);
              }
              this.adminComponent.loadNavBarTemplates();
            }
          });
        }
      }, error => {
        this.spinnerFlag = false;
        swal({
          title: 'Error in Saving',
          text: this.dynamicTemplate.templateName + ' template has not  been saved',
          type: 'error',
          timer: this.helper.swalTimer
        }
        );
      });
    }
  }

  deleteTemplateSwal(dynamicTemplate, id) {
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
          dynamicTemplate.userRemarks = "Comments : " + value;
          this.deleteTemplate(dynamicTemplate);
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

  deleteTemplate(dynamicTemplate) {
    this.spinnerFlag = true;
    dynamicTemplate.id = dynamicTemplate.id;
    dynamicTemplate.updatedBy = this.currentUser.id;
    dynamicTemplate.loginUserId = this.currentUser.id;
    dynamicTemplate.organizationOfLoginUser = this.currentUser.orgId;
    dynamicTemplate.projectId = this.currentUser.projectId;
    dynamicTemplate.globalProjectId = this.currentUser.projectId;
    this.dynamicTemplate.projectVersionId = this.currentUser.versionId;
    this.service.deleteDynamicTemplate(dynamicTemplate)
      .subscribe((resp) => {
        this.spinnerFlag = false;
        let responseMsg: string = resp.result;
        if (responseMsg === "success") {
          swal({
            title: 'Deleted!',
            text: this.dynamicTemplate.templateName + ' record has been deleted.',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              let url = 'newDynamicTemplate?' + this.dynamicTemplate.masterDynamicTemplateId + '&false';
              this.adminComponent.redirect(url);
              this.adminComponent.loadNavBarTemplates();
            }
          });
        } else {
          swal({
            title: 'Not Deleted!',
            text: this.dynamicTemplate.templateName + ' has  not been deleted.',
            type: 'error',
            timer: this.helper.swalTimer
          });
        }
      }, (err) => {
        swal({
          title: 'Not Deleted!',
          text: this.dynamicTemplate.templateName + 'has  not been deleted.',
          type: 'error',
          timer: this.helper.swalTimer
        });
        this.spinnerFlag = false;
      });
  }

  /* START:PDF OPERATIONS*/
  deleteUploadedFile() {
    this.dynamicTemplate.filePath = "";
    this.dynamicTemplate.fileName = "";
    this.deletePDFView();
  }

  deletePDFView() {
    // if (document.getElementById("iframeView")) {
    //   document.getElementById("iframeView").remove();
    //   document.getElementById("fileUploadIdDynamicTemplate").setAttribute("class", "form-group row");
    // }
  }

  onSingleFileUpload(event) {
    this.permissionService.checkIsValidFileSize(event.target.files[0].size).subscribe(fileRes => {
      if (fileRes) {
        this.fileValidationMessage = "";
        this.deletePDFView();
        if (event.target.files.length != 0) {
          this.spinnerFlag = true;
          let file = event.target.files[0];
          let fileName = event.target.files[0].name;
          this.singleFileUploadFlag = true;
          if (fileName.toLocaleLowerCase().match('.doc') || fileName.toLocaleLowerCase().match('.docx') || fileName.toLocaleLowerCase().match('.pdf')) {
            let filePath = "IVAL/" + this.currentUser.orgId + "/" + this.currentUser.projectName + "/" + this.currentUser.versionName + "/" + this.dynamicTemplate.permissionConstant + "/Attachments/";
            const formData: FormData = new FormData();
            formData.append('file', file, fileName);
            formData.append('filePath', filePath);
            formData.append('extension', fileName.split(".")[fileName.split(".").length - 1]);
            this.commonService.singleFileUpload(formData).subscribe(resp => {
              this.spinnerFlag = false;
              if (resp.result) {
                this.dynamicTemplate.filePath = resp.path;
                this.dynamicTemplate.fileName = fileName;
                this.singleFileUploadFlag = false;
                this.downloadFileOrView(this.dynamicTemplate, true);
              } else {
                this.downloadFileOrView(this.dynamicTemplate, true);
              }
            }, error => {
              this.spinnerFlag = false;
              this.singleFileUploadFlag = false;
            });
          } else {
            this.spinnerFlag = false;
            this.singleFileUploadFlag = false;
            this.fileValidationMessage = "Upload .pdf,.doc,.docx file only";
          }
        }
      } else {
        this.helper.fileSizeWarning(event.target.files[0].name);
        this.myInputVariable.nativeElement.value = "";
      }
    });
  }

  showPdf(flag: boolean) {
    if (this.dynamicTemplate.publishedflag)
      this.downloadFileOrViewAfterPublish(flag);
    else
      this.downloadFileOrView(this.dynamicTemplate, flag);
  }

  Api(data, url) {
    return this.http.post(this.helper.common_URL + url, data, this.permissionService.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json())
      })
  }

  private b64toBlob(b64Data) {
    var sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return byteArrays;
  }

  downloadFileOrViewAfterPublish(viewFlag) {
    this.currentLevelData = null;
    this.userApprovalList = [];
    this.previewdoc = [];
    this.commonModel.type = 'workflowapprovalStatus';
    this.commonModel.categoryName = 'pending';
    this.commonModel.dataType = 'opt1';
    this.commonModel.value = this.dynamicTemplate.permissionConstant;
    this.permissionService.HTTPPostAPI(this.commonModel, 'workFlow/loadDocumentsForUserAndDocumentType').subscribe(response => {
      this.filteredPendingDocList = response.pendingList;
      const stepperModule: StepperClass = new StepperClass()
      stepperModule.constantName = this.dynamicTemplate.permissionConstant;
      stepperModule.documentIdentity = this.dynamicTemplate.id;
      this.permissionService.HTTPPostAPI(stepperModule, 'workFlow/bulkDocumentApproveTimeLine').subscribe(response => {
        this.getStatus = response.timeLine;
        if (this.getStatus.length > 0)
          this.getStatus.forEach((element, index) => {
            element.errorList = this.filteredPendingDocList.filter(e => e.currentLevel === element.levelId);
            if (this.filteredPendingDocList.length > 0 && element.errorList && element.errorList.length > 0) {
              element.thisIsCurrent = true;
              this.currentLevelIndex = index;
              this.currentLevelData = element;
              this.userApprovalList = element.userApprovalList;
              this.previewdoc = element.errorList;
            }
          });
        if (this.filteredPendingDocList.length === 0)
          this.spinnerFlag = false;
      });
    },
      err => {
        this.spinnerFlag = false
      })
    if (this.permissionModel.exportButtonFlag || viewFlag) {
      this.spinnerFlag = true;
      const ids: any[] = new Array();
      const stepperModule: StepperClass = new StepperClass();
      stepperModule.constantName = '' + this.dynamicTemplate.permissionConstant;
      ids.push(this.dynamicTemplate.id);
      stepperModule.documentIds = ids;
      this.Api(stepperModule, 'workFlow/pdfPreviewfortimeline').subscribe(response => {
        var responseBolb: any[] = this.b64toBlob(response.pdf)
        const blob: Blob = new Blob(responseBolb, { type: "application/pdf" });
        if (viewFlag) {
          this.pdfURL = URL.createObjectURL(blob);
          this.spinnerFlag = false;
        }
      }, error => {
        this.spinnerFlag = false;
      })
    }
  }

  downloadFileOrView(input, viewFlag) {
    if (this.permissionModel.exportButtonFlag || viewFlag) {
      this.spinnerFlag = true;
      let filePath = input.filePath;
      let fileName = input.fileName;
      this.commonService.loadFile(filePath).subscribe(resp => {
        let contentType = this.commonService.getContentType(fileName.split(".")[fileName.split(".").length - 1]);
        var blob: Blob = new Blob([resp], { type: contentType });
        if (viewFlag) {
          if (!contentType.match(".pdf")) {
            this.commonService.convertFileToPDF(blob, fileName).then((respBlob) => {
              this.pdfURL = URL.createObjectURL(respBlob);
              this.spinnerFlag = false;
            });
          } else {
            this.pdfURL = URL.createObjectURL(blob);
            this.spinnerFlag = false;
          }
        } else {
          this.commonService.downloadFileAudit(fileName, input.templateName, "138", input.dynamicTemplateCode, input.masterDynamicTemplateId);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
          } else {
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
          this.spinnerFlag = false;
        }
      }, error => {
        this.spinnerFlag = false;
      })
    }
  }
  /* END:PDF OPERATIONS*/
  // createIFrame(blob_url) {
  //   var iframe;
  //   var elementExists = document.getElementById("iframeView");
  //   if (!elementExists)
  //     iframe = document.createElement('iframe');
  //   else
  //     iframe = elementExists;

  //   iframe.setAttribute("id", "iframeView")
  //   iframe.setAttribute("height", "1200px");
  //   iframe.setAttribute("width", "1000px");
  //   iframe.src = blob_url;
  //   let find = document.querySelector('#fileUploadIdDynamicTemplate');
  //   find.setAttribute("class", "well well-lg form-group row");
  //   find.appendChild(iframe);
  //   this.spinnerFlag = false;
  // }
  publishDynamicTemplateData() {
    this.service.publish(this.dynamicTemplate.id).subscribe((resp) => {
      swal({
        title: 'Published Successfully!',
        text: this.dynamicTemplate.templateName + ' template has been published.',
        type: 'success',
        timer: this.helper.swalTimer,
        showConfirmButton: false,
        onClose: () => {
          this.adminComponent.loadNavBarTemplates();
          this.ngOnInit();
        }
      });
    });
  }

  revisionForDocument(dto) {
    this.viewIndividualData = true;
    var element = document.getElementById("overflowCompareId");
    element.setAttribute("style", "visibility:hidden");
    this.sourceFile = "";
    this.compareFile = "";
    this.modalSpinner = false;
    this.service.loadDynamicTemplateLogBasedOnId({ id: dto.id, masterTemplateId: dto.masterDynamicTemplateId }).subscribe(resp => {
      if (resp.list != null) {
        this.revisionArray = resp.list;
        this.leftRevisionArray = resp.list;
        this.rightRevisionArray = resp.list;
      }
    });
  }

  removeDataFromList(id, leftOrRightSideFlag) {
    if (leftOrRightSideFlag) {
      this.leftRevisionArray = this.revisionArray.filter(value => value.id != id);
    } else {
      this.rightRevisionArray = this.revisionArray.filter(value => value.id != id);
    }
  }
  /*END:REVISION FOR DOCUMENT*/

  getFileNameForRevisionRight(value) {
    this.sourceFileName = value.currentTarget.selectedOptions[0].label;
  }

  getFileNameForRevisionLeft(value) {
    this.compareFileName = value.currentTarget.selectedOptions[0].label;
  }

  compareTwoFile() {
    this.modalSpinner = true;
    this.revisionValidationMessage = "";
    if (this.sourceFile == '')
      this.revisionValidationMessage = "Please Select the file in Source File Drop Down";
    if (this.compareFile == '')
      this.revisionValidationMessage = "Please Select the file in Compare File Drop Down";
    if (this.sourceFile == '' && this.compareFile == '')
      this.revisionValidationMessage = "Please Select the file in both Drop Down";
    if (this.revisionValidationMessage != '') {
      this.modalSpinner = false;
      return;
    } else {
      this.commonService.compareTwoFile({ sourceFilePath: this.sourceFile, compareFilePath: this.compareFile }).subscribe(res => {
        let data = {
          "sourceFileName": this.sourceFileName, "compareFile": this.compareFileName,
          "templateName": this.dynamicTemplate.templateName, "uniqid": this.dynamicTemplate.dynamicTemplateCode, "value": this.dynamicTemplate.masterDynamicTemplateId,
          "isTemplate": true, "templateId": this.dynamicTemplate.id
        };
        this.commonService.auditRevision(data).subscribe(resp => { });
        var sourceFile = <any>document.getElementById("sourceFileId");
        var compareFile = <any>document.getElementById("compareFileId");
        var sourceFileContentBinary = window.atob(res.sourceFileContent);
        var sourceFileContentArray = [];
        for (var i = 0; i < sourceFileContentBinary.length; i++) {
          sourceFileContentArray.push(sourceFileContentBinary.charCodeAt(i));
        }
        setTimeout(() => {
          sourceFile.src = URL.createObjectURL(new Blob([new Uint8Array(sourceFileContentArray)], { type: 'application/pdf' }));
        }, 1500);
        var diffrenceFileContentBinary = window.atob(res.diffrenceFileContent);
        var diffrenceFileContentArray = [];
        for (var i = 0; i < diffrenceFileContentBinary.length; i++) {
          diffrenceFileContentArray.push(diffrenceFileContentBinary.charCodeAt(i));
        }
        setTimeout(() => {
          compareFile.src = URL.createObjectURL(new Blob([new Uint8Array(diffrenceFileContentArray)], { type: 'application/pdf' }));
          var element = document.getElementById("overflowCompareId");
          element.setAttribute("style", "visibility:visible");
          this.modalSpinner = false;
        }, 1500);
      })
    }
  }

  onClickViewClose() {
    this.viewIndividualData = false;
    this.ngOnInit();
    this.sourceFile = '';
    this.compareFile = '';
  }

  loadTaskData() {
    this.taskCreationService.loadTasksForDocument(this.dynamicTemplate.permissionConstant).subscribe(res => {
      if (res.pendingList)
        this.pendingTaskList = res.pendingList;
    }, err => {
      this.spinnerFlag = false;
    });
    this.projectplanService.loadProjectPlanForPermissionConstant(this.dynamicTemplate.permissionConstant).subscribe(res => {
      if (res.ProjectPlan)
        res.ProjectPlan.forEach(element => {
          if (!this.helper.isEmpty(element.startTargetDate)) {
            var today = new Date(element.startTargetDate.year, element.startTargetDate.month - 1, element.startTargetDate.day);
            element.startTargetDate = this.datePipe.transform(today, this.datePipeFormat);
            today = new Date(element.endTargetDate.year, element.endTargetDate.month - 1, element.endTargetDate.day);
            element.endTargetDate = this.datePipe.transform(today, this.datePipeFormat);
          }
        });
      this.projectPlan = res.ProjectPlan;
    }, err => {
      this.spinnerFlag = false;
    });
  }

  verify(documentType, documentCode, documentId) {
    this.formVerification.openMyModal(documentType, documentCode, documentId);
  }

  loadOrgDateFormatAndTime() {
    this.servie.getOrgDateFormat().subscribe(result => {
      if (!this.helper.isEmpty(result)) {
        this.datePipeFormat = result.datePattern.replace("mm", "MM")
        this.datePipeFormat = this.datePipeFormat.replace("YYYY", "yyyy");
      }
    });
  }

  startTime(row: any) {
    this.spinnerFlag = true;
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var month = today.getMonth() + 1;
    var date = today.getFullYear() + "-" + month + "-" + today.getDate() + " " + time;
    this.timerTrackingDTO.projectTaskId = row.id;
    this.timerTrackingDTO.startTimer = time;
    this.timerTrackingDTO.endTimer = "";
    this.timerTrackingDTO.activeFlag = "Y";
    this.timerTrackingDTO.startDate = date;
    this.timerTrackingDTO.endDate = "";
    this.taskCreationService.saveTimer(this.timerTrackingDTO).subscribe(result => {
      if (result.result == "success") {
        this.loadTaskData();
        this.spinnerFlag = false;
        swal({
          title: row.taskCode + " Start at " + time,
          text: 'Task started.',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: true,
        });
      } else {
        this.spinnerFlag = false;
        swal({
          title: 'error',
          text: 'Oops, something went wrong',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: true,
        });
      }
    });
  }

  endTime(row: any) {
    swal({
      title: "Write your comments here",
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Save',
      confirmButtonColor: "#93BE52",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#FC6180",
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
    })
      .then((value) => {
        if (value) {
          this.endTimer(row, value);
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

  endTimer(row: any, valu: any) {
    this.spinnerFlag = true;
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var month = today.getMonth() + 1;
    var date = today.getFullYear() + "-" + month + "-" + today.getDate() + " " + time;
    this.timerTrackingDTO.projectTaskId = row.id;
    this.timerTrackingDTO.endTimer = time;
    this.timerTrackingDTO.startTimer = "";
    this.timerTrackingDTO.startDate = "";
    this.timerTrackingDTO.activeFlag = "N";
    this.timerTrackingDTO.endDate = date;
    this.timerTrackingDTO.comments = valu;
    this.taskCreationService.saveTimer(this.timerTrackingDTO).subscribe(result => {
      if (result.result == "success") {
        this.spinnerFlag = false;
        this.loadTaskData();
        swal({
          title: row.taskCode + " End at " + time,
          text: 'Task Ended.',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: true,
        });
      } else {
        this.spinnerFlag = false;
        swal({
          title: 'error',
          text: 'Oops, something went wrong',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: true,
        });
      }
    });
  }

  editTask(row) {
    this.router.navigate(["taskCreation"], { queryParams: { id: row.id, url: '/' + 'editTask' } })
  }

  getLevelUsers(row: any) {
    if (!this.helper.isEmpty(row)) {
      this.currentTaskID = row.id;
      this.docLevelUserList = row.userDTO.map(m => ({ value: m.organizationId, label: m.firstName }));
      let usernameList = row.selectedUserNames.split(',');
      this.assignedUsers = new Array();
      usernameList.forEach(item => {
        this.docLevelUserList.forEach(data => {
          if (item === data.label)
            this.assignedUsers.push(data.value);
        });
      });
    }
  }

  reAssignUsers() {
    this.spinnerFlag = true;
    this.modal = new ProjectTaskDTO();
    this.taskCreationService.loadTasksBasedOnId(this.currentTaskID).subscribe(resp => {
      let taskData = resp.dto;
      taskData.selectedUsers = this.assignedUsers;
      taskData.userDTO = [];
      this.modal = taskData;
      this.modal.baseURL = this.helper.common_URL;
      this.modal.Url = '/"taskCreation?id=' + this.modal.id;
      this.taskCreationService.reAssignTaskUsers(this.modal).subscribe(jsonRep => {
        if (jsonRep.result === "success") {
          swal({
            title: '',
            text: 'Users Added Successfully',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
          });
          this.loadTaskData();
          this.spinnerFlag = false;
        }
      })
    }, err => {
      this.spinnerFlag = false;
    });
  }

  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
    this.loadOutline();
  }

  loadOutline() {
    this.pdf.getOutline().then((outline: any[]) => {
      this.outline = outline;
      if (this.outline)
        this.outLineList = this.outline.map(o => ({ id: o.title, value: o.title.replace(" ", ""), type: 'chapter' }));
      else {
        this.outLineList = new Array();
      }
    });
  }

  onError(error: any) {
    this.error = error; // set error
    if (error.name === 'PasswordException') {
      const password = prompt(
        'This document is password protected. Enter the password:'
      );
      if (password) {
        this.error = null;
        this.setPassword(password);
      }
    }
  }

  setPassword(password: string) {
    let newSrc;
    if (this.pdfURL instanceof ArrayBuffer) {
      newSrc = { data: this.pdfURL };
    } else if (typeof this.pdfURL === 'string') {
      newSrc = { url: this.pdfURL };
    } else {
      newSrc = { ...this.pdfURL };
    }
    newSrc.password = password;
    this.pdfURL = newSrc;
  }

  onClickTableOfContent(docId: any) {
    this.router.navigate(['/table-of-content'], { queryParams: { docId: docId, status: document.location.pathname }, skipLocationChange: true });
  }

  changeGroupingFlag() {
    this.groupingFlag = !this.groupingFlag;
    this.documentForum.groupAndUnGroup(this.groupingFlag);
  }

}
