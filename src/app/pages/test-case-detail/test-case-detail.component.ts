import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { Permissions } from '../../shared/config';
import { FileUploadForDocComponent } from '../file-upload-for-doc/file-upload-for-doc.component';
import { UrsService } from '../urs/urs.service';
import { StepperClass, WorkflowDocumentStatusDTO } from './../../models/model';
import { ConfigService } from './../../shared/config.service';
import { Helper } from './../../shared/helper';
import { IQTCService } from './../iqtc/iqtc.service';

@Component({
  selector: 'test-case-detail',
  templateUrl: './test-case-detail.component.html',
  styleUrls: ['./test-case-detail.component.css']
})
export class TestCaseDetailComponent implements OnInit, AfterContentInit {
  @ViewChild('fileupload')
  private file: FileUploadForDocComponent;

  @Input('category')
  public category: any='';

  @Input('id')
  public id: any;

  @Input('tab')
  public tab: any;

  @Input('backUrl')
  public backUrl: any;

  @Output('onCancel')
  public onCancel:EventEmitter<any> = new EventEmitter();

  model =new Permissions(this.category,false);
  categoryName:any;
  testCaseDetail: any[] = new Array();
  testRunList: any[] = new Array();
  totalSize
  currentDoc
  isSelectedPublishData: boolean;
  slideIndex = 0;
  testRunCompareJson;
  isWorkflowDocumentOrderSequence:string;
  testRunId:string;
  selectedUrsDetails: any[] = new Array();
  freeze: boolean = false;
  freezeSFAbutton: boolean = false;
  stepViewFlag:boolean=false;
  screenshotViewFlag:boolean=false;
  videoViewFlag:boolean=false;
  referenceViewFlag:boolean=false;
  filesViewFlag:boolean=false;
  imagesViewFlag:boolean=false;
  constructor(public helper: Helper, public permissionService: ConfigService, public ursService: UrsService,
    public service: IQTCService, public router: Router, private adminComponent: AdminComponent) { }


  ngOnInit(): void {
    this.loadBasedOndId();
    this.helper.listen().subscribe((m: any) => {
      this.onclickNext({ id: m });
    });
  }

  ngAfterContentInit(): void {
    let interval = setInterval(() => {
      if (this.file && this.testCaseDetail.length > 0) {
        this.file.loadFileListForEdit(this.testCaseDetail[0].id, this.testCaseDetail[0].testCaseCode);
        clearInterval(interval);
      }
    }, 1000);
  }

  

  loadPermission(category) {
    // this.isWorkflowDocumentOrderSequence=false;
    if(category){
      this.permissionService.loadPermissionsBasedOnModule(category).subscribe(resp => {
        this.model = resp;
    });
      this.permissionService.isWorkflowDocumentOrderSequence(category).subscribe(resp => {
        this.isWorkflowDocumentOrderSequence = resp;
      });
      this.adminComponent.setUpModuleForHelpContent(category);
      this.adminComponent.taskEquipmentId = 0;
      this.adminComponent.taskDocType = category;
      this.adminComponent.taskEnbleFlag = true;
      this.categoryName=this.permissionService.helper.getTestCaseName(category);
    }else{
      this.model = new Permissions('', false);
    }
  }

  loadBasedOndId() {
    this.adminComponent.spinnerFlag = true;
    this.service.getDataForEdit(this.id,true).subscribe(jsonResp => {
      this.setUpData(jsonResp);
      this.adminComponent.spinnerFlag = false;
      this.loadPermission(jsonResp.result.constantName);
      this.loadTestRunOfPrevious(jsonResp.result);
    });
  }
  edit(row) {
    let backUrl = row.executionFlag ? '/tc-execution/' : '/tc-creation/';
    let queryParams = {
      status: backUrl + row.constantName
    }
    this.router.navigate(['/tc-edit', row.constantName, row.id], { queryParams: queryParams, skipLocationChange: true });
  }

  setUpData(jsonResp) {
    this.testCaseDetail = new Array();
    this.adminComponent.spinnerFlag = true;
    this.adminComponent.taskDocTypeUniqueId=jsonResp.result.id;
    this.ursService.getSelectedUrsAndSpecAndRiskDetails({ "ursIds": jsonResp.result.ursIds, "specIds": jsonResp.result.specificationIds, "riskIds": jsonResp.result.riskIds }).subscribe(resp => {
      this.selectedUrsDetails = resp.result;
    });
    this.workflowfunction(jsonResp)
    if (jsonResp.result.files.length != 0)
      jsonResp.result.files[0].visible = true;
    jsonResp.result.formData = JSON.parse(jsonResp.result.jsonExtraData);
    this.totalSize = jsonResp.total;
    this.currentDoc = jsonResp.current;
    if (jsonResp.result.executionFlag && !jsonResp.result.publishedflag) {
      this.isSelectedPublishData = true;
    } else {
      this.isSelectedPublishData = false;
    }
    for (let item of jsonResp.result.checklist) {
      if (item.files.length > 0) {
        item.files[0].visible = true;
      }
    }
    if (jsonResp.result.status === 'Fail')
        this.freeze = true;
      if (!jsonResp.result.status || jsonResp.result.status === 'In-Progress')
        this.freezeSFAbutton = true;
    this.testCaseDetail.push(jsonResp.result);
    
    this.testRunId=jsonResp.result.testRunId;
    let stepperModule: StepperClass = new StepperClass();
    stepperModule.constantName = jsonResp.result.constantName;
    stepperModule.documentIdentity = jsonResp.result.id;
    stepperModule.code = jsonResp.result.testCaseCode;
    stepperModule.publishedFlag = jsonResp.result.publishedflag;
    stepperModule.creatorId = jsonResp.result.creatorId;
    stepperModule.lastupdatedTime = jsonResp.result.updatedTime;
    stepperModule.displayCreatedTime = jsonResp.result.displayCreatedTime;
    stepperModule.displayUpdatedTime = jsonResp.result.displayUpdatedTime;
    stepperModule.documentTitle = jsonResp.result.description;
    stepperModule.createdBy = jsonResp.result.createdBy;
    stepperModule.updatedBy = jsonResp.result.updatedBy;
    stepperModule.testRunName = jsonResp.result.testRunName;
    this.helper.stepperchange(stepperModule);
    this.adminComponent.spinnerFlag = false;
  }

  loadTestRunOfPrevious(data) {
    if (data.testRunId) {
      this.testRunList = [];
      this.adminComponent.spinnerFlag = true;
      this.permissionService.HTTPPostAPI(data.masterId, "testCase/loadTestRunOfPrevious").subscribe(resp => {
        this.testRunList = resp;
        this.adminComponent.spinnerFlag = false
      }, err => this.adminComponent.spinnerFlag = false);
    }
  }

  getDataForTestCaseOfTestRun(masterId, testId) {
    this.adminComponent.spinnerFlag = true;
    this.permissionService.HTTPPostAPI({ 'testRunId': testId, 'masterId': masterId }, "testCase/getDataForTestCaseOfTestRun").subscribe(resp => {
        this.testRunCompareJson = resp.data;
        if(this.testRunCompareJson){
            if (this.testRunCompareJson.files.length != 0)
            this.testRunCompareJson.files[0].visible = true;
        
            for (let item of this.testRunCompareJson.checklist) {
                if (item.files.length > 0) {
                    item.files[0].visible = true;
                }
            }
        }
        this.adminComponent.spinnerFlag = false
    }, err => this.adminComponent.spinnerFlag = false);
}

  workflowfunction(jsonResp: any) {
    if (jsonResp.result.publishedflag) {
      let workflowmodal: WorkflowDocumentStatusDTO = new WorkflowDocumentStatusDTO();
      workflowmodal.documentType = this.category;
      workflowmodal.documentId = jsonResp.result.id;
      workflowmodal.currentLevel = jsonResp.result.currentCommonLevel;
      workflowmodal.documentCode = jsonResp.result.testCaseCode;
      workflowmodal.workflowAccess = jsonResp.result.workflowAccess;
      workflowmodal.docName = this.permissionService.helper.getTestCaseName(this.category);
      workflowmodal.publishFlag = jsonResp.result.publishedflag;
      workflowmodal.testRunName=jsonResp.result.testRunName;
      this.helper.setIndividulaWorkflowData(workflowmodal);
    }
  }

  onClickClose() {
    this.onCancel.emit(true);
  }
  /** Click on Next and Previous */
  defaultSetup() {
    this.testCaseDetail = [];
  }
  onclickFirst(data) {
    if (!data.navigationPreviousEnds) {
      this.defaultSetup();
      this.adminComponent.spinnerFlag = true;
      this.service.getFirstData(data.id,true).subscribe(jsonResp => {
        this.setUpData(jsonResp);
        this.adminComponent.spinnerFlag = false;
      },
        err => {
        }
      );
    }
  }

  onclickPrevious(data) {
    if (!data.navigationPreviousEnds) {
      this.defaultSetup();
      this.adminComponent.spinnerFlag = true;
      this.service.getPreviousData(data.id,true).subscribe(jsonResp => {
        this.setUpData(jsonResp);
        this.adminComponent.spinnerFlag = false;
      },
        err => {
        }
      );
    }
  }
  onclickNext(data) {
    if (!data.navigationNextEnds) {
      this.defaultSetup();
      this.adminComponent.spinnerFlag = true;
      this.service.getNextData(data.id,true).subscribe(jsonResp => {
        this.setUpData(jsonResp);
        this.adminComponent.spinnerFlag = false;
      },
        err => {
        }
      );
    }
  }

  onclickLast(data) {
    if (!data.navigationNextEnds) {
      this.defaultSetup();
      this.adminComponent.spinnerFlag = true;
      this.service.getLastData(data.id,true).subscribe(jsonResp => {
        this.setUpData(jsonResp);
        this.adminComponent.spinnerFlag = false;
      },
        err => {
        }
      );
    }
  }

  /** Click on Next and Previous */


  /** PDF Preview */
  /**
  * @param flag => view or download
  * @param extention =>doc/docx
  */
  documentPreview(flag, extention, data) {
    this.adminComponent.spinnerFlag = true;
    data.downloadDocType = extention;
    this.service.loadPreviewDocument(data).subscribe(resp => {
      this.adminComponent.spinnerFlag = false;
      if (resp != null) {
        this.adminComponent.previewByBlob(data.testCaseCode + '.' + extention, resp, flag,
          this.permissionService.helper.getTestCaseName(this.category) + ' Preview');
      }
    }, err => this.adminComponent.spinnerFlag = false);
  }

  /** PDF Preview */

  publishOrSubmitForApprove(data) {
    var classObject = this;
    swal({
      title: 'Are you sure?',
      text: 'You wont be able to revert',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success m-r-10',
      cancelButtonClass: 'btn btn-danger',
      allowOutsideClick: false,
      buttonsStyling: false
    }).then(function () {
      classObject.publishIndividualData(data);
    });
  }

  publishIndividualData(data) {
    this.defaultSetup();
    this.adminComponent.spinnerFlag = true;
    if (!data.publishedflag && !data.executionFlag) {
      data.masterFlag = true;
      this.service.publishTestCaseToMaster(data).subscribe(resp => {
        if (resp.result)
          this.setUpData(resp);
        else
          this.onClickClose();
        this.adminComponent.spinnerFlag = false;
      });
    } else
      if (!data.publishedflag && data.executionFlag) {
        data.publishedflag = true;
        this.service.publishTestCase(data).subscribe(resp => {
          this.isSelectedPublishData = false;
          if (resp.result)
            this.setUpData(resp);
          else
            this.onClickClose();
          this.adminComponent.spinnerFlag = false;
        });
      }
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
            timer: this.permissionService.helper.swalTimer,
            showConfirmButton: false,
          });
        }

      });
  }

  delete(dataObj, i) {
    this.adminComponent.spinnerFlag = true;
    this.service.deleteTestCase(dataObj)
      .subscribe((resp) => {
        this.adminComponent.spinnerFlag = false;
        if (resp.result === "success") {
          swal({
            title: 'Deleted!', type: 'success', timer: this.permissionService.helper.swalTimer, showConfirmButton: false,
            text: ' Record has been deleted',
            onClose: () => {
              this.onClickClose();
            }
          });
        } else {
          swal({
            title: 'Not Deleted!', type: 'error', timer: this.permissionService.helper.swalTimer,
            text: ' Record has not been deleted'
          });
        }
      }, (err) => {
        this.adminComponent.spinnerFlag = false;
        swal({
          title: 'Not Deleted!', type: 'error', timer: this.permissionService.helper.swalTimer,
          text: ' Record has not been deleted'
        });
      });
  }


  /** Check List */
  plusChecklistSlides(n, files) {
    let index = files.findIndex(function (element) {
      return element.visible === true;
    });
    if (n == 1) {
      let next = index + 1;
      if (next < files.length) {
        files[index].visible = false;
        files[++index].visible = true;
      } else {
        files[index].visible = false;
        files[0].visible = true;
        index = 0;
      }
    } else {
      let prev = index - 1;
      let next = index;
      if (prev < 0) {
        files[index].visible = false;
        files[files.length - 1].visible = true;
        index = files.length - 1;
      } else {
        files[prev].visible = true;
        files[next].visible = false;
        index = prev;
      }
    }
  }

  /** Check list */

  /** Upload Image Slide */
  plusSlides(forward, list: any[]) {
    if (forward == 1) {
      let prev = this.slideIndex;
      let next = this.slideIndex + 1;
      if (next < list.length) {
        list[this.slideIndex].visible = false;
        list[++this.slideIndex].visible = true;
      } else {
        list[this.slideIndex].visible = false;
        list[0].visible = true;
        this.slideIndex = 0;
      }
    } else {
      let prev = this.slideIndex - 1;
      let next = this.slideIndex;
      if (prev < 0) {
        list[this.slideIndex].visible = false;
        list[list.length - 1].visible = true;
        this.slideIndex = list.length - 1;
      } else {
        list[prev].visible = true;
        list[next].visible = false;
        this.slideIndex = prev;
      }
    }
  }
  /** Upload Image Slide */

  /** Screenshot or Image */
  view(path, isImage) {
    if (isImage)
      this.adminComponent.downloadOrViewFile('temp.png', path, true, 'ScreenShot Image');
    else
      this.adminComponent.downloadOrViewFile('temp.webm', path, true, 'Recorded Video');
  }

  urlRedirection(id, testCaseId) {
    this.router.navigate(['/URS/view-urs'], { queryParams: { id: id, status: this.backUrl + "/" + testCaseId }, skipLocationChange: true });
  }

  loadData(data, type) {
    this.adminComponent.spinnerFlag = true;
    this.permissionService.HTTPGetAPI("testCase/loadTestcaseChildData/"+data.id+"/"+type).subscribe(resp => {
      this.adminComponent.spinnerFlag = false;
      if(resp.result){
        switch (type) {
          case "images":
            data.files=resp.result;
            if (data.files.length != 0)
              data.files[0].visible = true;
            break;
          case "testSteps":
            data.checklist=resp.result;
            for (let item of data.checklist) {
              if (item.files.length > 0) {
                item.files[0].visible = true;
              }
            }
            break;
          case "urlChecklist":
            data.urlChecklist=resp.result;
            break;
          case "videos":
            data.videoList=resp.result;
            break;
          case "screenshots":
            data.imageList=resp.result;
            break;
        }
      }
    });
  }
}
