import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IOption } from 'ng-select';
import { FileUploader } from 'ng2-file-upload';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { CheckListEquipmentDTO, CheckListTestCaseDTO } from '../../models/model';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { TestCaseType } from '../../shared/constants';
import { Helper } from '../../shared/helper';
import { CategoryService } from '../category/category.service';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { priorityService } from '../priority/priority.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { RiskAssessmentService } from '../risk-assessment/risk-assessment.service';
import { SpecificationMasterService } from '../specification-master/specification-master.service';
import { UrsService } from '../urs/urs.service';
import { BulkUploadService } from './bulk-upload.service';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./bulk-upload.component.css', '../../../../node_modules/sweetalert2/dist/sweetalert2.min.css']
})
export class BulkUploadComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({
    url: 'URL_For_Upload',
    isHTML5: true
  });
  @ViewChild('ursCheckListModal') ursCheckListModal: any;
  @ViewChild('testCaseCheckListModal') testCaseCheckListModal: any;
  myInputVariable: ElementRef;
  public docItemList: any[];
  selectedDocument: string = "";
  public validationMessage: string = "";
  correctFile = false;
  fileList: any;
  spinnerFlag = false;
  testCaseTypes: TestCaseType = new TestCaseType();
  excelData: any;
  editing = {};
  categoryList: any[] = new Array();
  priorityList: any[] = new Array();
  potentialList: any[] = new Array();
  implemenationList: any[] = new Array();
  testingMethodList: any[] = new Array();
  isLoading: boolean = false;
  isUploaded: boolean = false;
  isValidTableData: boolean = false;
  simpleOption: Array<IOption> = new Array<IOption>();
  ursList: any[];
  fieldErrorList: Array<any> = new Array<any>();
  isDynamicForm: boolean = false;
  formExtendedColumns: any;
  riskProbability: any[] = new Array();
  riskSeverity: any[] = new Array();
  riskPriority: any[] = new Array();
  riskDetectability: any[] = new Array();
  permissionModal: Permissions = new Permissions("135", false);
  enviroments: any[] = new Array();
  specificationType: any[] = new Array();
  isReadOnly: boolean = false;
  spList: any[] = new Array();
  specSimpleOption: Array<IOption> = new Array<IOption>();
  riskSimpleOption: Array<IOption> = new Array<IOption>();
  checkList: any[] = new Array();
  isCheckListEntered: boolean = false;
  complianceRequirements:any[]=new Array();
  dropdownSettings = {
    singleSelection: false,
    text: "Select Compliance Requirements",
    enableCheckAll: true,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 3,
    classes: "myclass custom-class",
  };
  constructor(private datePipe: DatePipe, public configService: ConfigService, private comp: AdminComponent,
    public riskService: RiskAssessmentService, public ursService: UrsService, public categoryService: CategoryService,
    public priorityService: priorityService, public projectService: projectsetupService, public helper: Helper,
    public bulkUploadService: BulkUploadService, public lookUpService: LookUpService, public spService: SpecificationMasterService) {
  }

  ngOnInit() {
    this.comp.setUpModuleForHelpContent("135");
    this.comp.taskDocType = "135";
    this.comp.taskDocTypeUniqueId = "";
    this.comp.taskEquipmentId = 0;
    this.isValidTableData = false;
    this.bulkUploadService.loadDocumentsList().subscribe(res => {
      this.docItemList = res;
    });
    this.categoryService.loadCategory().subscribe(res => {
      this.categoryList = res.result;
    });
    this.priorityService.loadAllPriority().subscribe(res => {
      this.priorityList = res.result;
    });
    this.lookUpService.getlookUpItemsBasedOnCategory("URSPotentialRisk").subscribe(res => {
      this.potentialList = res.response;
    });
    this.lookUpService.getlookUpItemsBasedOnCategory("URSImplementationMethod").subscribe(res => {
      this.implemenationList = res.response;
    });
    this.lookUpService.getlookUpItemsBasedOnCategory("URSTestingMethod").subscribe(res => {
      this.testingMethodList = res.response;
    });
    this.ursService.getDropDownOfPublishedURS().subscribe(res => {
      this.ursList = res;
      this.onChangeUrs();
    });
    this.riskService.loadRiskLookupValues("RPNProbability").subscribe(res => {
      if (res.result === this.helper.SUCCESS_RESULT_MESSAGE)
        this.riskProbability = res.response;
    });
    this.riskService.loadRiskLookupValues("RPNSeverity").subscribe(res => {
      if (res.result === this.helper.SUCCESS_RESULT_MESSAGE)
        this.riskSeverity = res.response;
    });
    this.riskService.loadRiskLookupValues("RPNDetectability").subscribe(res => {
      if (res.result === this.helper.SUCCESS_RESULT_MESSAGE)
        this.riskDetectability = res.response;
    });
    this.riskService.loadRiskLookupValues("RPNPriority").subscribe(res => {
      if (res.result === this.helper.SUCCESS_RESULT_MESSAGE)
        this.riskPriority = res.response;
    });
    this.lookUpService.getlookUpItemsBasedOnCategory("Environment").subscribe(res => {
      this.enviroments = res.response;
    });
    this.lookUpService.getlookUpItemsBasedOnCategory("SpecificationMaster").subscribe(res => {
      this.specificationType = res.response;
    });
    this.spService.getDropDownOfPublishedSpec().subscribe(res => {
      this.spList = res;
      this.onChangeSpec();
    });
    this.riskService.loadAllPublishedRiskData().subscribe(res => {
      if (res.result)
        this.riskSimpleOption = res.result.map(option => ({ value: '' + option.id, label: option.riskFactor }));
    });

    this.configService.HTTPGetAPI("complianceAssessment/loadAllCompliancesForUrs").subscribe(response => {
      this.complianceRequirements = response.result.map(option => ({ id: option.id, itemName: option.category }));;
    });
  }

  loadPermissions(docType: any) {
    let mappingId = "";
    if (+docType > 1000) {
      var data = this.docItemList.filter(d => d.key == docType);
      if (data.length != 0) {
        if (data[0].mappingFlag)
          mappingId = data[0].mappingId;
      }
    }
    this.configService.loadPermissionsBasedOnModule(docType, mappingId != "" ? docType : "", mappingId).subscribe(resp => {
      this.permissionModal = resp
    });
  }

  onChangeUrs() {
    if (!this.helper.isEmpty(this.ursList)) {
      this.simpleOption = this.cloneOptions(this.ursList);
    }
  }

  onChangeSpec() {
    if (!this.helper.isEmpty(this.spList)) {
      this.specSimpleOption = this.cloneOptions(this.spList);
    }
  }

  private cloneOptions(options: Array<any>): Array<IOption> {
    return options.map(option => ({ value: option.value, label: option.label }));
  }

  extractFile(event: any) {
    this.isValidTableData = false;
    this.validationMessage = "";
    this.uploader = new FileUploader({
      url: 'URL_For_Upload',
      isHTML5: true
    });
    if (event.target.files[0].name.match('.xls')) {
      this.correctFile = true;
      this.fileList = event.target.files;
      if (this.uploader.queue.length > 1) {
        this.uploader.queue = new Array(this.uploader.queue[1]);
      }
      this.onClickOfUploadButton();
    } else {
      this.validationMessage = "Please upload .xls file";
    }
  }

  onChangeDocument() {
    if (this.myInputVariable != undefined)
      this.myInputVariable.nativeElement.value = "";
    this.uploader.queue = [];
    this.isUploaded = false;
    this.loadPermissions(this.selectedDocument);
  }

  editRow(rowIndex) {
    for (let index = 0; index < this.excelData.length; index++) {
      if (rowIndex == index)
        this.editing[index] = true;
      else
        this.editing[index] = false;
    }
  }

  updateValue(event, cell, cellValue, row) {
    this.excelData[row.$$index][cell] = event.target.value;
  }

  onCategoryChange(categoryId, row) {
    this.categoryList.forEach(element => {
      if (Number(categoryId) === element.id)
        row.categoryName = element.categoryName;
      else
        row.categoryName = "";
    });
  }

  onPriorityChange(priorityId, row) {
    this.priorityList.forEach(element => {
      if (Number(priorityId) === element.id)
        row.priorityName = element.priorityName;
      else
        row.priorityName = "";
    });
  }

  onTestingRequired(row) {
    if (row.testingRequired) {
      row.implementationMethod = "Out of box";
      this.onChangePotentialAndImplemenation(row);
    } else {
      row.implementationMethod = "";
      row.testingMethod = "";
    }
  }

  onChangePotentialAndImplemenation(row) {
    if (row.implementationMethod === 'Custom' && row.potentialRisk === 'High') {
      row.testingMethod = this.testingMethodList[0].key;
    } else if (row.implementationMethod === 'Configured' && row.potentialRisk === 'High') {
      row.testingMethod = this.testingMethodList[0].key;
    } else {
      row.testingMethod = this.testingMethodList[1].key;
    }
  }

  sampleFileDownload() {
    let url = "";
    let fileName = 'sampleFile.xls';
    switch (this.selectedDocument) {
      case "107": {
        url = "urs/downloadSampleForURS";
        fileName = 'sampleURS' + '_' + new Date().getTime() + '.xls';
        this.download(url, fileName, this.selectedDocument);
        break;
      }
      case "200": {
        url = "sp_Master/downloadSampleForSpecification";
        fileName = 'sampleSpecification' + '_' + new Date().getTime() + '.xls';
        this.download(url, fileName, this.selectedDocument);
        break;
      }
      case "108": {
        url = "testCase/downloadSampleForTestcase";
        fileName = 'sampleIQTC' + '_' + new Date().getTime() + '.xls';
        this.download(url, fileName, this.selectedDocument);
        break;
      }
      case "109": {
        url = "testCase/downloadSampleForTestcase";
        fileName = 'samplePQTC' + '_' + new Date().getTime() + '.xls';
        this.download(url, fileName, this.selectedDocument);
        break;
      }
      case "110": {
        url = "testCase/downloadSampleForTestcase";
        fileName = 'sampleOQTC' + '_' + new Date().getTime() + '.xls';
        this.download(url, fileName, this.selectedDocument);
        break;
      }
      case "207": {
        url = "testCase/downloadSampleForTestcase";
        fileName = 'sampleIOQTC' + '_' + new Date().getTime() + '.xls';
        this.download(url, fileName, this.selectedDocument);
        break;
      }
      case "208": {
        url = "testCase/downloadSampleForTestcase";
        fileName = 'sampleOPQTC' + '_' + new Date().getTime() + '.xls';
        this.download(url, fileName, this.selectedDocument);
        break;
      }
      case "113": {
        url = "risk-assessment/downloadSampleXLS";
        fileName = 'sampleRiskAssessment' + '_' + new Date().getTime() + '.xls';
        this.download(url, fileName, this.selectedDocument);
        break;
      }
      case "128": {
        url = "vendor/downloadSampleExcel";
        fileName = 'sampleVendorValidation' + '_' + new Date().getTime() + '.xls';
        this.download(url, fileName, this.selectedDocument);
        break;
      }
      default: {
        url = "dynamicForm/downloadSampleForForm";
        let selectedDoc: any = this.docItemList.filter(d => d.key === this.selectedDocument);
        fileName = selectedDoc[0].value + '_' + new Date().getTime() + '.xls';
        const formdata: FormData = new FormData();
        formdata.append("documentConstant", this.selectedDocument);
        formdata.append("mappingId", selectedDoc[0].mappingFlag ? selectedDoc[0].mappingId : 0);
        this.download(url, fileName, formdata);
      }
    }
  }

  download(url: any, fileName: any, data) {
    this.bulkUploadService.downloadSampleFile(url, data).subscribe(res => {
      this.comp.previewOrDownloadByBase64(fileName, res.body, false);
    });
  }

  onClickOfUploadButton() {
    let url = "";
    let testcaseType: any
    let documentConstant;
    let mappingId = "";
    switch (this.selectedDocument) {
      case "107": {
        url = "urs/readExcelFile"
        documentConstant = this.helper.URS_VALUE;
        break;
      }
      case "200": {
        url = "sp_Master/readExcelFile";
        documentConstant = this.helper.SP_VALUE;
        break;
      }
      case "108": {
        url = "testCase/readExcelFile";
        testcaseType = this.testCaseTypes.IQTC;
        documentConstant = this.helper.IQTC_VALUE;
        break;
      }
      case "109": {
        url = "testCase/readExcelFile";
        testcaseType = this.testCaseTypes.PQTC;
        documentConstant = this.helper.PQTC_VALUE;
        break;
      }
      case "110": {
        url = "testCase/readExcelFile";
        testcaseType = this.testCaseTypes.OQTC;
        documentConstant = this.helper.OQTC_VALUE;
        break;
      }
      case "207": {
        url = "testCase/readExcelFile";
        testcaseType = this.testCaseTypes.IOQTC;
        documentConstant = this.helper.IOQTC_VALUE;
        break;
      }
      case "208": {
        url = "testCase/readExcelFile";
        testcaseType = this.testCaseTypes.OPQTC;
        documentConstant = this.helper.OPQTC_VALUE;
        break;
      }
      case "113": {
        url = "risk-assessment/readExcelFile";
        documentConstant = this.helper.RISK_ASSESSMENT_VALUE;
        break;
      }
      case "128": {
        url = "vendor/readExcelFile";
        documentConstant = this.helper.VENDOR_VALIDATION_VALUE;
        break;
      }
      default: {
        url = "dynamicForm/readExcelFile";
        let selectedDoc: any = this.docItemList.filter(d => d.key === this.selectedDocument);
        documentConstant = this.selectedDocument;
        mappingId = selectedDoc[0].mappingFlag ? selectedDoc[0].mappingId : 0;
        break;
      }
    }
    this.spinnerFlag = true;
    this.validationMessage = "";
    if (this.fileList.length > 0) {
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();
      formData.append('file', file, file.name);
      formData.append('testCaseType', testcaseType);
      formData.append('documentConstant', documentConstant);
      formData.append('mappingId', mappingId);
      this.bulkUploadService.saveBulkDocuments(formData, url).subscribe(resp => {
        this.spinnerFlag = false;
        this.onChangeDocument();
        this.excelData = resp.list;
        if (this.excelData.length > 0) {
          if (+this.selectedDocument >= 1000 && this.excelData.length > 0) {
            this.isDynamicForm = true;
            this.populateDynamicFormData();
          } else {
            this.isDynamicForm = false;
            for (let data of this.excelData) {
              if (!this.helper.isEmpty(data.jsonExtraData) && data.jsonExtraData != []) {
                data.jsonExtraData = JSON.parse(data.jsonExtraData);
                this.formExtendedColumns = data.jsonExtraData;
              }
            }
          }
          this.isUploaded = true;
        } else {
          this.validationMessage = 'Please upload a valid File';
          this.isUploaded = false;
        }
      }, err => {
        this.validationMessage = 'Error in Excel File';
        this.isUploaded = false;
        this.spinnerFlag = false;
      }
      );
    }
  }

  populateDynamicFormData(): boolean {
    var result: boolean = false;
    for (let headerData of this.excelData) {
      headerData.jsonData = JSON.parse(headerData.jsonData);
      if (headerData.rowList.length > 0) {
        for (let bodyData of headerData.rowList) {
          bodyData.jsonData = JSON.parse(bodyData.jsonData);
        }
      } else {
        result = true;
      }
      var onlyTable = headerData.jsonData.filter(json => "table" == json.type);
      if (onlyTable.length == headerData.jsonData.length)
        result = false;
    }
    return result;
  }

  importData() {
    this.isValidTableData = false;
    let url = "";
    switch (this.selectedDocument) {
      case "107": {
        url = "urs/saveBulkURS";
        this.validateURSData();
        break;
      }
      case "200": {
        url = "sp_Master/saveBulkSpecification";
        this.validateSpecificationData();
        break;
      }
      case "108": {
        url = "testCase/saveBulkTestCases";
        this.validateTestCaseData();
        break;
      }
      case "109": {
        url = "testCase/saveBulkTestCases";
        this.validateTestCaseData();
        break;
      }
      case "110": {
        url = "testCase/saveBulkTestCases";
        this.validateTestCaseData();
        break;
      }
      case "207": {
        url = "testCase/saveBulkTestCases";
        this.validateTestCaseData();
        break;
      }
      case "208": {
        url = "testCase/saveBulkTestCases";
        this.validateTestCaseData();
        break;
      }
      case "113": {
        url = "risk-assessment/saveBulkRiskAssessment";
        this.validateRiskAssessmentData();
        break;
      }
      case "128": {
        url = "vendor/saveBulkVendor";
        this.validateVendorValidationData();
        break;
      }
      default: {
        url = "dynamicForm/saveBulkFromExcel";
        if (+this.selectedDocument >= 1000 && this.excelData.length > 0) {
          this.validataDynamicFormData();
        }
      }
    }
    if (!this.isValidTableData) {
      let excelData = JSON.parse(JSON.stringify(this.excelData));
      if (+this.selectedDocument < 1000) {
        for (let data of excelData) {
          data.jsonExtraData = JSON.stringify(data.jsonExtraData);
        }
      } else {
        for (let headerData of excelData) {
          headerData.jsonData = JSON.stringify(headerData.jsonData);
          for (let bodyData of headerData.rowList) {
            bodyData.jsonData = JSON.stringify(bodyData.jsonData);
          }
        }
      }
      this.spinnerFlag = true;
      this.bulkUploadService.saveBulkDocuments(excelData, url).subscribe(resp => {
        let responseMsg: string = resp.result;
        this.spinnerFlag = false;
        if (responseMsg === "success") {
          this.spinnerFlag = false;
          swal({
            title: 'Success',
            text: 'Data Saved Successfully',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,

            onClose: () => {
              this.isUploaded = false;
              this.selectedDocument = "";
              this.spinnerFlag = false;
              this.ngOnInit();
            }
          });
        } else {
          swal({
            title: 'Error',
            text: responseMsg,
            type: 'error',
            timer: 5000,
          });
          this.ngOnInit();
          this.spinnerFlag = false;
        }
      }, err => {
        swal(
          'Error',
          ' Data has been not saved.',
          'error'
        );
        this.spinnerFlag = false;
      }
      );
    }
  }

  validateURSData() {
    for (let element of this.excelData) {
      if (this.helper.isEmpty(element.ursName) || this.helper.isEmpty(element.category) || this.helper.isEmpty(element.priority) || this.isCheckListEntered || this.validateStaticDocumentJsonData(element.jsonExtraData)) {
        this.isValidTableData = true;
      }
    }
  }

  validateSpecificationData() {
    for (let element of this.excelData) {
      if (this.helper.isEmpty(element.ursListCommaSeparatedValue) || this.helper.isEmpty(element.spTypeKey) || this.helper.isEmpty(element.spDescription)) {
        this.isValidTableData = true;
      }
    }
  }

  validateStaticDocumentJsonData(jsonData: any): boolean {
    let result: boolean = false;
    let enableUpload: any[] = jsonData.filter(field => field.fieldError == true);
    if (enableUpload.length > 0)
      result = true;
    else
      result = false;
    return result;
  }

  onlyNumber(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 5 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  calculationOfTableValue(input, list) {
    if (input.calculations) {
      input.calculations.forEach(calculation => {
        let y;
        let x;
        list.forEach(element => {
          if (element.name.includes(calculation.operandTwoId))
            y = element.value;
          if (element.name.includes(calculation.operandOneId))
            x = element.value;
        });
        if (calculation.operandTwoId == 'constant') {
          y = calculation.operandTwoConstant;
        }
        switch (input.type) {
          case 'number': this.numberCalculation(list, calculation, +x, +y);
            break;
          case 'date':
            this.dateCalculation(list, calculation, x, y);
            break;
          case 'datetime-local':
            this.dateTimeCalculation(list, calculation, x, y);
            break;
          case 'time': this.timeCalculation(list, calculation, x, y);
            break;
          default:
            break;
        }
      });
    }
  }

  dateCalculation(list: any, calculation: any, date1: any, date2OrConstant) {
    let finalResult;
    var date = new Date(Date.parse(date1));
    if (calculation.operandTwoId == 'constant') {
      if (calculation.operator == "addition") {
        finalResult = date.setDate(date.getDate() + date2OrConstant);
      } else {
        finalResult = date.setDate(date.getDate() - date2OrConstant);
      }
      finalResult = this.datePipe.transform(finalResult, 'yyyy-MM-dd');
    } else {
      var Difference_In_Time;
      if (calculation.operator == "addition") {
        Difference_In_Time = new Date(Date.parse(date2OrConstant)).getTime() + date.getTime();
      } else {
        Difference_In_Time = date.getTime() - new Date(Date.parse(date2OrConstant)).getTime();
      }
      finalResult = Difference_In_Time / (1000 * 3600 * 24);
    }
    list.forEach(element => {
      if (element.name)
        if (element.name.includes(calculation.finalResultId))
          element.value = finalResult;
    });
  }

  timeCalculation(list: any, calculation: any, time1: any, time2OrConstant: any) {
    let finalResult;
    var time = new Date(1970, 0, 0, time1.split(':')[0], time1.split(':')[1], 0);
    if (calculation.operandTwoId == 'constant') {
      if (calculation.operator == "addition") {
        finalResult = time.setTime(time.getTime() + (time2OrConstant * 60000));
      } else {
        finalResult = time.setTime(time.getTime() - (time2OrConstant * 60000));
      }
      finalResult = this.datePipe.transform(finalResult, 'HH:mm');
    } else {
      if (time2OrConstant) {
        var time2 = new Date(1970, 0, 0, time2OrConstant.split(':')[0], time2OrConstant.split(':')[1], 0);
        var Difference_In_Time;
        if (calculation.operator == "addition") {
          Difference_In_Time = time2.getTime() + time.getTime();
        } else {
          Difference_In_Time = time.getTime() - time2.getTime();
        }
        let diffMinutes = (Difference_In_Time / (60 * 1000)) % 60;
        let diffHours = (Difference_In_Time / (60 * 60 * 1000)) % 24;
        finalResult = ("" + diffHours).split(".")[0] + " hours," + ("" + diffMinutes).split(".")[0] + " minutes ";
      }
    }
    if (finalResult)
      list.forEach(element => {
        if (element.name)
          if (element.name.includes(calculation.finalResultId))
            element.value = finalResult;
      });
  }

  dateTimeCalculation(list: any, calculation: any, x: any, dateTime2OrConstant: any) {
    let finalResult;
    var dateTime = new Date(x);
    if (calculation.operandTwoId == 'constant') {
      if (calculation.operator == "addition") {
        finalResult = dateTime.setTime(dateTime.getTime() + (dateTime2OrConstant * 60000));
      } else {
        finalResult = dateTime.setTime(dateTime.getTime() - (dateTime2OrConstant * 60000));
      }
      finalResult = (this.datePipe.transform(dateTime, 'yyyy-MM-dd') + "T" + this.datePipe.transform(dateTime, 'HH:mm'));
    } else {
      if (dateTime2OrConstant) {
        var dateTime2 = new Date(dateTime2OrConstant);
        var Difference_In_Time;
        if (calculation.operator == "addition") {
          Difference_In_Time = dateTime.getTime() + dateTime2.getTime();
        } else {
          Difference_In_Time = dateTime.getTime() - dateTime2.getTime();
        }
        let diffDays = Difference_In_Time / (24 * 60 * 60 * 1000);
        let diffMinutes = (Difference_In_Time / (60 * 1000)) % 60;
        let diffHours = (Difference_In_Time / (60 * 60 * 1000)) % 24;
        finalResult = ("" + diffDays).split(".")[0] + " days, " + ("" + diffHours).split(".")[0] + " hours," + ("" + diffMinutes).split(".")[0] + " minutes ";
      }
    }
    if (finalResult)
      list.forEach(element => {
        if (element.name)
          if (element.name.includes(calculation.finalResultId))
            element.value = finalResult;
      });
  }

  numberCalculation(list: any, calculation: any, x: number, y: number) {
    list.forEach(element => {
      if (element.name)
        if (element.name.includes(calculation.finalResultId)) {
          element.value = 0;
          switch (calculation.operator) {
            case "addition":
              element.value = x + y;
              break;
            case "subtraction":
              element.value = x - y;
              break;
            case "multiplication":
              element.value = x * y;
              break;
            case "division":
              element.value = x / y;
              break;
            case "percentage":
              element.value = (x * (y / 100));
              break;
          }
        }
    });
  }

  onUrsChange(ursList: any, row: any) {
    row.ursNameList = "";
    this.simpleOption.forEach(element => {
      ursList.forEach(item => {
        if (item === element.value) {
          row.ursNameList = element.label + "," + row.ursNameList;
        }
      });
    });
  }

  onRiskUrsChange(ursList: any, row: any) {
    row.ursListCommaSeparatedValue = "";
    this.simpleOption.forEach(element => {
      ursList.forEach(item => {
        if (item === element.value) {
          row.ursListCommaSeparatedValue = element.label + "," + row.ursListCommaSeparatedValue;
        }
      });
    });
  }

  onRiskSpecChange(specificationIds: any, row: any) {
    row.specListCommaSeparatedValue = "";
    this.specSimpleOption.forEach(element => {
      specificationIds.forEach(item => {
        if (item === element.value) {
          row.specListCommaSeparatedValue = element.label + "," + row.specListCommaSeparatedValue;
        }
      });
    });
  }

  onRiskChange(riskIds: any, row: any) {
    row.riskCommaSeparatedValue = "";
    this.riskSimpleOption.forEach(element => {
      riskIds.forEach(item => {
        if (item === element.value) {
          row.riskCommaSeparatedValue = element.label + "," + row.riskCommaSeparatedValue;
        }
      });
    });
  }

  validateTestCaseData() {
    this.excelData.forEach(element => {
      if (!this.isValidTableData)
        if (this.validateStaticDocumentJsonData(element.jsonExtraData) || this.helper.isEmpty(element.description)
          || this.helper.isEmpty(element.expectedResult) || this.isCheckListEntered
          || (this.helper.isEmpty(element.ursNameList) && this.helper.isEmpty(element.specListCommaSeparatedValue) && this.helper.isEmpty(element.riskCommaSeparatedValue))
        ) {
          this.isValidTableData = true;
        }
        else { this.isValidTableData = false; }
    });
  }

  onProbabilityOfOccuranceChange(id, row) {
    this.riskProbability.forEach(element => {
      if (!this.helper.isEmpty(id))
        if (Number(id) === element.key)
          row.probabilityOfOccuranceName = element.value;
        else
          row.probabilityOfOccuranceName = "";
    });
  }

  onSeverityChange(id, row) {
    this.riskSeverity.forEach(element => {
      if (!this.helper.isEmpty(id))
        if (Number(id) === element.key)
          row.severityName = element.value;
        else
          row.severityName = "";
    });
  }

  onDetectabilityChange(id, row) {
    this.riskDetectability.forEach(element => {
      if (!this.helper.isEmpty(id))
        if (Number(id) === element.key)
          row.detectabilityName = element.value;
        else
          row.detectabilityName = "";
    });
  }

  onSpecificationTypeChange(id, row) {
    this.specificationType.forEach(element => {
      if (!this.helper.isEmpty(id))
        if (id === element.key)
          row.spTypeValue = element.value;
        else
          row.spTypeValue = "";
    });
  }

  validateRiskAssessmentData() {
    this.excelData.forEach(element => {
      if (!this.isValidTableData)
        if (this.helper.isEmpty(element.riskFactor) || this.helper.isEmpty(element.riskScenario)
          || this.helper.isEmpty(element.probabilityOfOccurance) || this.helper.isEmpty(element.severity)
          || this.helper.isEmpty(element.detectability) || this.validateStaticDocumentJsonData(element.jsonExtraData)
          || (this.helper.isEmpty(element.ursListCommaSeparatedValue) && this.helper.isEmpty(element.specListCommaSeparatedValue))) {
          this.isValidTableData = true;
        }
        else {
          this.isValidTableData = false;
        }
    });
  }

  validateVendorValidationData() {
    this.excelData.forEach(element => {
      if (!this.isValidTableData)
        if (this.helper.isEmpty(element.documentName) || this.helper.isEmpty(element.uploadedFile) || this.validateStaticDocumentJsonData(element.jsonExtraData)) {
          this.isValidTableData = true;
        }
        else { this.isValidTableData = false; }
    });
  }

  onChangeField(jsonObject: any) {
    if (!this.helper.isEmptyWithoutZeroCheck(jsonObject.value))
      jsonObject.fieldError = false;
    else
      jsonObject.fieldError = true;

    this.validataDynamicFormData();
  }

  onChangeFieldForDateAndDropdowns(jsonObject: any) {
    jsonObject.fieldError = false;
    this.isValidTableData = false;
  }

  setCheckBoxValidation(tableJson) {
    tableJson.checkBoxValidationFlag = (tableJson.values.filter(e => e.selected).length != 0);
  }

  setCheckedAsRadio(formJson, event, value) {
    event.srcElement.checked = true
    formJson.forEach(element => {
      element.selected = false;
      if (element.value == value) {
        element.selected = true;
      }
    });
  }

  fieldValidation(jsonObject: any) {
    jsonObject.fieldError = false;
    if (jsonObject.type != 'header' && jsonObject.type != 'newline' && jsonObject.type != 'paragraph' && jsonObject.type != 'table')
      switch (jsonObject.type) {
        case "file":
          if (jsonObject.values == undefined || jsonObject.values.length == 0) {
            jsonObject.fieldError = true;
          }
          break;
        case "checkbox-group":
          if (jsonObject.values.filter(e => e.selected).length == 0) {
            jsonObject.fieldError = true;
          }
          break;
        case "radio-group":
          if (jsonObject.values.filter(e => e.selected).length == 0) {
            jsonObject.fieldError = true;
          }
          break;
        default:
          if (!jsonObject.type) {
            if (jsonObject.name.includes("checkbox-group") || jsonObject.name.includes("radio-group")) {
              if (jsonObject.values.filter(e => e.selected).length == 0) {
                jsonObject.fieldError = true;
              }
            } else {
              if (this.helper.isEmptyWithoutZeroCheck(jsonObject.value)) {
                jsonObject.fieldError = true;
              }
            }
            break;
          } else {
            if (this.helper.isEmptyWithoutZeroCheck(jsonObject.value)) {
              jsonObject.fieldError = true;
            }
          }
          break;
      }
  }

  validataDynamicFormData() {
    this.fieldErrorList = [];
    for (let headerData of this.excelData) {
      for (let bodyData of headerData.rowList) {
        bodyData.jsonData.forEach(element => {
          this.fieldValidation(element);
        });
        let enableUpload: any[] = bodyData.jsonData.filter(field => field.fieldError);
        if (enableUpload.length > 0)
          this.fieldErrorList.push(enableUpload);
      }
    }
    if (this.fieldErrorList.length > 0) {
      this.isValidTableData = true;
    } else {
      this.isValidTableData = false;
    }
  }

  onChangeFileName(jsonObject) {
    if (!this.helper.isEmpty(jsonObject.value)) {
      this.bulkUploadService.isFileExists(jsonObject.value).subscribe(jsonResp => {
        let responseMsg: boolean = jsonResp;
        if (responseMsg == true) {
          jsonObject.fieldError = true;
          jsonObject.errorMessage = "File Names are not Matched..";
        } else {
          jsonObject.fieldError = false;
        }
      }
      );
    } else {
      jsonObject.fieldError = true;
    }
  }

  openURSCheckListModal(row) {
    if (!this.helper.isEmpty(row)) {
      this.checkList = row.checklist;
      this.ursCheckListModal.show();
      this.onChangecheckList();
    }
  }

  addChecklistItem() {
    this.isCheckListEntered = false;
    this.checkList.forEach(item => {
      if (this.helper.isEmpty(item.checklistName) || this.helper.isEmpty(item.displayOrder))
        this.isCheckListEntered = true;
    });
    if (!this.isCheckListEntered) {
      this.checkList.push({ 'id': 0, 'checklistName': '', 'expectedResult': '', 'displayOrder': this.checkList.length + 1 });
    }
    setTimeout(() => {
      $('#check_list_name_id_' + (this.checkList.length - 1)).focus();
    }, 600);
  }

  onChangecheckList() {
    this.isCheckListEntered = false;
    this.checkList.forEach(item => {
      if (this.helper.isEmpty(item.checklistName))
        this.isCheckListEntered = true;
    });
  }

  deleteCheckList(index, list: any[]) {
    list = list.splice(index, 1);
    this.onChangecheckList();
  }

  openTestCaseCheckListModal(row) {
    if (!this.helper.isEmpty(row)) {
      this.checkList = row.checklist;
      this.testCaseCheckListModal.show();
      this.onChangecheckList();
    }
  }

}
