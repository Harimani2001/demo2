import { WorkflowDocumentStatusDTO, StepperClass } from './../../models/model';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMyDpOptions, MyDatePicker } from 'mydatepicker/dist';
import swal from 'sweetalert2';
import { TestRunDTO } from '../../models/model';
import { Permissions } from '../../shared/config';
import { Helper } from '../../shared/helper';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';
import { ConfigService } from './../../shared/config.service';

@Component({
  selector: 'test-run',
  templateUrl: './test-run.component.html',
  styleUrls: ['./test-run.component.css', '../../../../node_modules/sweetalert2/dist/sweetalert2.min.css']
})
export class TestRunComponent implements OnInit, AfterViewInit, OnChanges {
  onlyView = false;
  selectAll = false;
  @ViewChild('formWizard') formWizard: any;
  testRunSpinnerFlag = true;
  @Input('type') type: string;
  @Input('access') permission: Permissions = new Permissions('', false);
  @Output('onComplete') onComplete: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output('afterLoad') afterLoad: EventEmitter<any[]> = new EventEmitter<any[]>();
  @ViewChild('date') date: MyDatePicker;
  @ViewChild('testRunTable') table: any;
  title = ''
  viewPDFFlag = false;
  pdfSrc = '';
  public testRunGroup: FormGroup;
  showPublish = false;
  testRunNameMessage: string = '';
  totalSelected: number = 0;
  lastChecked = null;
  public model: TestRunDTO = null;
  testRunList = new Array();
  filterQueryTestRun = '';
  submitted = false;
  userList = new Array();
  testCaseMasterList: any[] = new Array();
  unSelectedTestCaseList: any[] = new Array();
  selectedTestCaseList: any[] = new Array();
  public searchData: any[] = new Array();
  toggle = false;
  step2ShowNext: boolean = false;
  viewTestRunFlag: boolean = true;
  datePipeFormat = 'dd-MM-yyyy';
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: this.datePipeFormat,
    disableUntil: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() - 1 },
  };
  dropdownSettings = {
    singleSelection: false,
    text: "Select Users",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 5,
    classes: "myclass custom-class",
    position: 'top'
  };

  constructor(public formBuilder: FormBuilder, private configService: ConfigService, private dateService: DateFormatSettingsService,
    public helper: Helper) {
    this.helper.listen().subscribe((m: any) => {
      this.editTestRun(m, true, 'Summary');
    })
  }

  ngAfterViewInit(): void {
    this.testRunSpinnerFlag = false;
  }

  ngOnInit(): void {
    this.loadDefault();
    this.loadOrgDateFormatAndTime();
    this.loadUsers();
  }

  ngOnDestroy() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.type) {
      if (changes.type.previousValue != this.type) {
        this.loadDefault();
      }
    }
  }

  loadDefault() {
    this.filterQueryTestRun = '';
    this.selectAll = false;
    this.viewTestRun();
  }

  checkTestRunName = ((testRunName) => {
    setTimeout(() => {
      this.testRunSpinnerFlag = true;
      this.validateTestRunName(testRunName, this.type, this.model.id).then(resp => {
        this.testRunNameMessage = resp;
        this.testRunSpinnerFlag = false;
      });
    }, 600);
  })

  validateTestRunName(testRunName: string, type: string, testRunId: number): Promise<string> {
    return new Promise<string>((resolve) => {
      let json = { 'testRunName': testRunName, 'type': type, 'testRunId': testRunId };
      this.configService.HTTPPostAPI(json, 'testCase/isTestRunExists').subscribe(resp => {
        resolve(resp.message);
      }, e => resolve(""));
    })
  }

  loadUsers() {
    this.configService.getAllUsersForProjectAndDocumentType(undefined, this.type).subscribe(resp => {
      this.userList = resp.map(option => ({ id: option.id, itemName: option.userName }));
    });
  }

  loadOrgDateFormatAndTime() {
    this.dateService.getOrgDateFormat().subscribe(result => {
      if (result) {
        this.datePipeFormat = result.datePattern.replace("YYYY", "yyyy");
        this.myDatePickerOptions.dateFormat = this.datePipeFormat;
        this.datePipeFormat = result.datePattern.replace("mm", "MM");
        if (this.date)
          this.date.setOptions();
      }
    });
  }

  openBtnClicked() {
    if (!this.date.showSelector)
      this.date.openBtnClicked();
  }

  close() {
    this.onComplete.emit(true);
  }

  viewTestRun() {
    this.testRunSpinnerFlag = true;
    this.filterQueryTestRun = '';
    this.configService.HTTPPostAPI(this.type, 'testCase/loadAllTestRun').subscribe(resp => {
      this.testRunList = resp;
      this.afterLoad.emit(this.testRunList.map(u => ({ 'id': u.id, 'type': "code", 'value': (u.testRunName).replace(" ", "_") })))
      this.viewTestRunFlag = true;
      this.testRunSpinnerFlag = false;
    }, e => this.testRunSpinnerFlag = false);
  }

  addTestRun() {
    this.title = 'Create Test Run';
    this.submitted = false;
    this.testRunGroup = null;
    this.model = new TestRunDTO();
    this.setGroup(this.model);
    this.onlyView = false;
    this.viewTestRunFlag = false;
    this.testRunSpinnerFlag = false;
  }

  editTestRun(id, onlyViewFlag, title) {
    this.onlyView = onlyViewFlag;
    this.title = title;
    this.testRunSpinnerFlag = true;
    this.configService.HTTPPostAPI(id, 'testCase/loadBasedOnTestRunId').subscribe(resp => {
      if (resp) {
        this.model = resp;
        this.setGroup(this.model);
        this.stepperfunction(this.model);
        this.workflowfunction(this.model);
        if (onlyViewFlag) {
          this.loadMasterTestCase(this.model.id);
        }
      } else {
        this.addTestRun();
      }
    });
  }

  setGroup(model: TestRunDTO) {
    this.testRunNameMessage = '';
    this.testRunGroup = this.formBuilder.group({
      id: [model.id],
      testRunName: [model.testRunName, Validators.compose([Validators.required])],
      testRunDescription: [model.testRunDescription],
      users: [model.users, Validators.compose([Validators.required])],
      targetDate: [model.targetDate ? { date: JSON.parse(model.targetDate) } : null, Validators.compose([Validators.required])],
      activeFlag: [model.activeFlag],
      documentSequence: [model.documentSequence],
      preApprovalFlag: [model.preApprovalFlag]
    });
    if (model.id != 0) {
      //this.testRunGroup.get('testRunName').disable();
    } else {
      this.testRunGroup.reset();
      this.testRunGroup.get('activeFlag').setValue(true);
      this.testRunGroup.get('testRunName').enable();
      this.testRunGroup.get('preApprovalFlag').enable();
      this.model.buttonDisable = false;
    }
    this.viewTestRunFlag = false;
    this.testRunSpinnerFlag = false;
  }

  setModel(formGroup: FormGroup) {
    this.model.testRunName = formGroup.get("testRunName").value;
    this.model.testRunDescription = formGroup.get("testRunDescription").value ? formGroup.get("testRunDescription").value : "";
    this.model.users = formGroup.get("users").value;
    this.model.targetDate = JSON.stringify(formGroup.get("targetDate").value.date);
    this.model.activeFlag = formGroup.get("activeFlag").value;
    this.model.testCaseType = this.type;
    this.model.documentSequence = formGroup.get("documentSequence").value;
    this.model.preApprovalFlag = formGroup.get("preApprovalFlag").value;
  }

  openSuccessUpdateSwal(formGroup: FormGroup) {
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
          this.save(formGroup, userRemarks);
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

  save(formGroup: FormGroup, userRemarks?) {
    this.submitted = true;
    if (!formGroup.valid || this.testRunNameMessage) {
      return;
    } else {
      this.testRunSpinnerFlag = true;
      this.setModel(formGroup);
      if (this.model.id)
        this.model.userRemarks = userRemarks;
      this.configService.HTTPPostAPI(this.model, "testCase/saveTestRun").subscribe(resp => {
        this.testRunSpinnerFlag = false;
        if (resp.result == "success") {
          swal({
            title: 'Success',
            text: 'Test Run created Successfully',
            type: 'success',
            timer: this.configService.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              this.model.id = resp.id;
              this.editTestRun(this.model.id, false, 'Edit Test Run');
              this.navigateNext();
            }
          });
        } else {
          swal({
            title: 'Error',
            text: 'oops something went wrong',
            type: 'error',
            timer: this.configService.helper.swalTimer,
            showConfirmButton: false
          });
        }
      }, error => {
        this.testRunSpinnerFlag = false;
        swal({
          title: 'Error',
          text: 'oops something went wrong',
          type: 'error',
          timer: this.configService.helper.swalTimer,
          showConfirmButton: false
        });
      })
    }
  }

  onStepChange(title) {
    this.title = title;
    switch (title) {
      case 'Create Test Run':
        this.addTestRun();
        break;
      case 'Edit Test Run':
        this.editTestRun(this.model.id, false, this.title);
        break;
      case 'Select Test Case':
        this.loadMasterTestCase(this.model.id);
        break;
      case 'Summary':
        this.editTestRun(this.model.id, false, this.title);
        break;
    }
  }

  loadMasterTestCase(testRunId) {
    this.showPublish = false;
    this.testRunSpinnerFlag = true;
    let json = { 'docType': this.type, 'testRunId': testRunId };
    this.configService.HTTPPostAPI(json, "testCase/loadMasterTestCase").subscribe(resp => {
      this.testRunSpinnerFlag = false;
      if (resp) {
        resp.sort((a, b) => (a.testCaseCode.split("-")[1] - b.testCaseCode.split("-")[1]));
        resp.sort((a, b) => (a.displayOrder - b.displayOrder));
        resp.sort((a, b) => (a.canRemove - b.canRemove));
        resp.sort((a, b) => (b.checked - a.checked));
        this.searchData = resp;
        this.testCaseMasterList = resp;
        this.unSelectedTestCaseList = this.testCaseMasterList.filter(ele => !ele.checked);
        this.selectedTestCaseList = this.testCaseMasterList.filter(ele => ele.checked);
        this.totalSelected = this.testCaseMasterList.filter(ele => ele.checked).length;
        if (this.totalSelected > 0) {
          this.showPublish = true;
        }
      }
    }, error => {
      this.testCaseMasterList = new Array();
      this.testRunSpinnerFlag = false;
    });
  }

  stepperfunction(jsonResp: TestRunDTO) {
    const stepperModule: StepperClass = new StepperClass();
    stepperModule.constantName = this.helper.getTRForTestcase(jsonResp.testCaseType);
    stepperModule.code = jsonResp.testRunName;
    stepperModule.lastupdatedTime = jsonResp.updatedTime;
    stepperModule.documentIdentity = jsonResp.id;
    stepperModule.publishedFlag = jsonResp.publishFlag;
    stepperModule.creatorId = jsonResp.creatorId;
    stepperModule.displayCreatedTime = jsonResp.displayCreatedTime;
    stepperModule.displayUpdatedTime = jsonResp.displayUpdatedTime;
    stepperModule.documentTitle = jsonResp.testRunName;
    stepperModule.createdBy = jsonResp.createdBy;
    stepperModule.updatedBy = jsonResp.updatedBy;
    this.helper.stepperchange(stepperModule);
  }

  workflowfunction(jsonResp: TestRunDTO) {
    if (jsonResp.publishFlag) {
      const workflowmodal: WorkflowDocumentStatusDTO = new WorkflowDocumentStatusDTO();
      workflowmodal.documentType = this.helper.getTRForTestcase(jsonResp.testCaseType);
      workflowmodal.documentId = jsonResp.id;
      workflowmodal.currentLevel = jsonResp.currentCommonLevel;
      workflowmodal.documentCode = jsonResp.testRunName;
      workflowmodal.workflowAccess = jsonResp.workflowAccess;
      workflowmodal.docName = 'Test Run';
      workflowmodal.publishFlag = jsonResp.publishFlag;
      this.helper.setIndividulaWorkflowData(workflowmodal);
    }
  }

  saveTestCases(list: any[], model: TestRunDTO) {
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
          this.model.userRemarks = userRemarks;
          this.createTestCaseForTestRun(list, model);
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

  createTestCaseForTestRun(list, model: TestRunDTO) {
    this.testRunSpinnerFlag = true;
    let i = 1;
    list.forEach(element => {
      if (element.checked) {
        element.displayOrder = i;
        ++i;
      }
    });
    let json = { 'list': list, 'testRunId': model.id, 'userRemarks': model.userRemarks };
    this.configService.HTTPPostAPI(json, "testCase/createTestCaseForTestRun").subscribe(resp => {
      this.testRunSpinnerFlag = false;
      if (resp.result == "success") {
        swal({
          title: 'Success',
          text: 'Test Run ' + this.model.id ? 'Updated' : 'Saved' + ' successfully',
          type: 'success',
          timer: this.configService.helper.swalTimer,
          showConfirmButton: false,
          onClose: () => {
            this.loadMasterTestCase(this.model.id);
            this.navigateNext();
          }
        });
      } else {
        swal({
          title: 'Error',
          text: 'oops something went wrong',
          type: 'error',
          timer: this.configService.helper.swalTimer,
          showConfirmButton: false
        });
      }
    }, error => {
      this.testRunSpinnerFlag = false;
      swal({
        title: 'Error',
        text: 'oops something went wrong',
        type: 'error',
        timer: this.configService.helper.swalTimer,
        showConfirmButton: false
      });
    });
  }

  cloneSwalForTestRun(id) {
    var that = this;
    swal({
      title: "New Test Run Name",
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Yes, clone it!',
      confirmButtonClass: 'btn btn-success m-r-10',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, cancel!',
      cancelButtonClass: 'btn btn-danger m-r-10',
      allowOutsideClick: false,
      showLoaderOnConfirm: true,
      preConfirm: result => new Promise((resolve, reject) => {
        if (result) {
          that.validateTestRunName(result, that.type, 0).then(message => {
            if (message) {
              reject(message)
            } else {
              resolve(null)
            }
          })
        } else {
          reject('Please enter Test Run Name');
        }
      })
    }).then((value) => {
      that.cloneTestRun(value, id);
    });
  }

  cloneTestRun(value, id) {
    this.testRunSpinnerFlag = true;
    let json = { 'testRunId': id, 'newTestRunName': value };
    this.configService.HTTPPostAPI(json, 'testCase/cloneTestRun').subscribe(resp => {
      this.testRunSpinnerFlag = false;
      if (resp.result == "success") {
        swal({
          title: 'Success',
          text: 'Cloned Test Run successfully',
          type: 'success',
          timer: this.configService.helper.swalTimer,
          showConfirmButton: false,
          onClose: () => {
            this.viewTestRun();
          }
        });
      } else {
        swal({
          title: 'Error',
          text: 'oops something went wrong',
          type: 'error',
          timer: this.configService.helper.swalTimer,
          showConfirmButton: false
        });
      }
    }, error => {
      this.testRunSpinnerFlag = false;
      swal({
        title: 'Error',
        text: 'oops something went wrong',
        type: 'error',
        timer: this.configService.helper.swalTimer,
        showConfirmButton: false
      });
    });
  }

  publish(id, title) {
    this.configService.HTTPPostAPI(id, 'testCase/publishTestRun').subscribe(resp => {
      this.testRunSpinnerFlag = false;
      swal({
        title: '',
        text: resp.result,
        type: resp.type,
        timer: this.configService.helper.swalTimer,
        showConfirmButton: false,
        onClose: () => {
          this.model.publishFlag = true;
          this.onStepChange(title);
        }
      });
    }, error => {
      swal({
        title: 'Error',
        text: 'oops something went wrong',
        type: 'error',
        timer: this.configService.helper.swalTimer,
        showConfirmButton: false
      });
    });
  }

  viewPDF() {
    this.testRunSpinnerFlag = true;
    this.configService.HTTPPostAPIFile('testCase/approvalPDF', this.model.id).subscribe(blobResponse => {
      const blob: Blob = new Blob([blobResponse], { type: "application/pdf" });
      this.pdfSrc = URL.createObjectURL(blob);
      this.viewPDFFlag = true;
      this.testRunSpinnerFlag = false;
    });
  }

  closePDF() {
    this.viewPDFFlag = false;
    this.pdfSrc = '';
  }

  reload() {
    this.editTestRun(this.model.id, this.onlyView, 'Summary');
  }

  navigatePrevious() {
    this.formWizard.previous();
  }

  navigateNext() {
    this.formWizard.next();
  }

  downloadFile(data) {
    this.testRunSpinnerFlag = true;
    const stepperModule: StepperClass = new StepperClass();
    stepperModule.constantName = data.testRunType;
    stepperModule.documentIds = new Array();
    stepperModule.documentIds.push(data.id);
    this.configService.HTTPPostAPI(stepperModule, 'workFlow/pdfPreviewfortimeline').subscribe(response => {
      this.testRunSpinnerFlag = false;
      var responseBolb: any[] = this.b64toBlob(response.pdf)
      const blob: Blob = new Blob(responseBolb, { type: "application/pdf" });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = data.testRunName + ".pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
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

  onSearch() {
    this.testCaseMasterList = [];
    if (!this.helper.isEmpty(this.filterQueryTestRun)) {
      this.searchData.forEach(data => {
        if (data.testCaseCode.toLowerCase().indexOf(this.filterQueryTestRun.toLowerCase()) > -1 || data.description.toLowerCase().indexOf(this.filterQueryTestRun.toLowerCase()) > -1) {
          if (!this.testCaseMasterList.includes(data)) {
            this.testCaseMasterList.push(data);
          }
        }
      });
    } else {
      this.testCaseMasterList = this.searchData;
    }
    this.getSelectedAndDeSelectedList();
  }

  selectTestCases(flag: boolean) {
    this.selectAll = flag;
    this.testCaseMasterList.forEach(element => {
      if (element.canRemove) {
        element.checked = flag;
      }
    });
    this.getSelectedAndDeSelectedList();
  }

  selectTestCase(json) {
    if (json.canRemove) {
      json.checked = !json.checked;
      this.testCaseMasterList.sort((a, b) => (b.checked - a.checked));
      this.getSelectedAndDeSelectedList();
    }
  }

  getSelectedAndDeSelectedList() {
    this.unSelectedTestCaseList = this.testCaseMasterList.filter(ele => !ele.checked);
    this.selectedTestCaseList = this.testCaseMasterList.filter(ele => ele.checked);
    this.totalSelected = this.testCaseMasterList.filter(ele => ele.checked).length;
  }

  resetTheView() {
    $(window).scrollTop(200);
  }

  onDropSuccess(item) {
    item.sort((a, b) => (a.canRemove - b.canRemove));
    item.sort((a, b) => (b.checked - a.checked));
  }

}