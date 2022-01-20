import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateISOParserFormatter } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-parser-formatter';
import { AdminComponent } from '../../layout/admin/admin.component';
import { BatchCreation, Equipment, FormReports } from '../../models/model';
import { Helper } from '../../shared/helper';
import { BatchCreationService } from '../batch-creation/batch-creation.service';
import { DocStatusService } from '../document-status/document-status.service';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { EquipmentService } from '../equipment/equipment.service';
import { MasterDynamicFormsService } from '../master-dynamic-forms/master-dynamic-forms.service';
import { ShiftService } from '../shift/shift.service';
import { EquipmentStatusService } from './equipment-status.service';
import { DocumentStatusCommentLogComponent } from '../document-status-comment-log/document-status-comment-log.component';
import swal from 'sweetalert2';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';
import { ConfigService } from '../../shared/config.service';
import { Permissions } from '../../shared/config';
import { MyDatePicker } from 'mydatepicker/dist';
import { IMyDpOptions } from 'mydatepicker/dist';
@Component({
  selector: 'app-equipment-status',
  templateUrl: './equipment-status.component.html',
  styleUrls: ['./equipment-status.component.css','./../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None,
})
export class EquipmentStatusComponent implements OnInit {
  @ViewChild('documentcomments') documentcomments:DocumentStatusCommentLogComponent;
  @ViewChild('date') date:any;   
  @ViewChild('date1') date1:any;
  @ViewChild('myTable') table: any;
  spinnerFlag = false;
  equipmentList: any;
  equipmentData:any;
  shiftList: any;
  public today: any;
  public validDate: any;
  formReports: FormReports = new FormReports();
  data: any;
  filteredData: any;
  statusLog: any = new Array();
  modalSpinner = false;
  public currentDocType: any;
  public currentDocStatus: any;
  public currentCreatedBy: any;
  public currentModifiedDate: any;
  viewIndividualData: boolean = false;
  commonDocumentStatusValue: any;
  public tempRowId: any;
  popupdata = [];
  formList: any[] = new Array();
  formMultiList: any[] = new Array();
  isValidDate: boolean = false;
  fromDate: any;
  toDate: any;
  newFromDate: any;
  newToDate: any;
  public filterQuery = '';
  public dataXls: any;
  selectedForms = [];
  dropdownSettings = {};
  dataTable: any[] = new Array();
  public tableView: boolean = false;
  comboChartData: any;
  isShowChart: boolean = false;
  mainFromList: any;
  equipmentDetails: Equipment = new Equipment();
  batchDetails: BatchCreation = new BatchCreation();
  batchList = new Array();
  formColumns: any[] =new Array();
  publishedMandatoryFeildJson:any={};
  isexcelExport:boolean=false;
  isMapping:boolean=false;
  pattern="d-m-Y";
  permissionModal: Permissions = new Permissions("162",false);
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
};
  constructor( private adminComponent: AdminComponent,private datePipe: DatePipe,public batchCreationService: BatchCreationService, 
    public dynamicService: DynamicFormService, public docStatusService: DocStatusService, 
    public masterDynamicFormService: MasterDynamicFormsService, public helper: Helper, public fb: FormBuilder, 
    public service: EquipmentStatusService, public equipmentService: EquipmentService,
     public shiftService: ShiftService,private servie: DateFormatSettingsService,public permissionService:ConfigService) { }

  ngOnInit() {
    this.loadOrgDateFormat()
    this.loadOrgDateFormatAndTime()
    this.adminComponent.setUpModuleForHelpContent("162");
    this.isexcelExport=false;
    this.loadAllEquipments();
    this.loadAllShifts();
    this.tableView = true;
    this.dropdownSettings = {
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class",
      maxHeight: 150
    };

    this.permissionService.loadPermissionsBasedOnModule("162").subscribe(resp=>{
      this.permissionModal=resp
    });
  }
  onChangeEquipment(eqid:any) {
    this.formReports.equipmentId = eqid;
    this.spinnerFlag = true;
    if (!this.helper.isEmpty(this.formReports.equipmentId)) {
      this.masterDynamicFormService.loadPublishedTemplateByEquipment(this.formReports.equipmentId).subscribe(result => {
        this.spinnerFlag = false;
        if (result != null){
          this.formList = result;
        }
      },error => { this.spinnerFlag = false 
        swal({
          title: '404',
          text: 'Something went Wrong ...Try Again',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        }
        );});
    } else {
      this.spinnerFlag = false;
      this.formList = [];
      swal({
        title: 'Info',
        text: 'Please select the equipment..',
        type: 'info',
        timer: this.helper.swalTimer,
        showConfirmButton: false
      }
      );
    }
    if (!this.helper.isEmpty(this.formReports.equipmentId)) {
      this.dynamicService.loadBatchForEquipmentRegister(this.formReports.equipmentId).subscribe(result => {
        if (result != null){
          this.batchList = result;
          this.formReports.batchId="";
          this.formReports.formId="";
        }
      });
    } else {
      this.batchList = [];
    }
    this.formReports.formId="";
  }

  onChangeBatch() { 
    this.filteredData=[];
    if (!this.helper.isEmpty(this.formReports.batchId)) {
        this.data.forEach(element => {
          if(element.batchId === Number(this.formReports.batchId))
            this.filteredData.push(element);
        });
    }else{
      this.filteredData=this.data;
    }
  }

  createChartData() {
    this.isShowChart = false;
    this.dataTable = [];
    let status = ['Status', 'UnPublished', 'Published', 'Pending', 'Completed',];
    this.dataTable.push(status);
    if (!this.helper.isEmpty(this.data)) {
      let dataResult = [this.data[0].templateName,
      this.data.filter(form => !form.publishedflag).length,
      this.data.filter(form => form.publishedflag).length,
      this.data.filter(form => (form.publishedflag && !form.workFlowCompletionFlag)).length,
      this.data.filter(form => form.workFlowCompletionFlag).length];
      this.dataTable.push(dataResult);
      this.isShowChart = true;
    }
    this.comboChartData = {
      chartType: 'ComboChart',
      dataTable: this.dataTable,
      options: {
        height: 300,
        vAxis: { title: 'Count', minValue: 11 },
        hAxis: { title: 'Form Name' },
        seriesType: 'bars',
        colors: ['#919aa3', '#62d1f3', '#FFB64D', '#93BE52',],
      },
    };
  }
  changeview(value) {
    this.helper.setEquipmentStatusGridorTable(value)
    this.tableView = value;
    this.createChartData();
  }
  onChangeFromDate(data: any) {
    this.fromDate = data;
    this.compareDates();
  }

  onChangeToDate(data: any) {
    this.toDate = data;
    this.compareDates();
  }
  compareDates() {
    this.isValidDate = false;
    this.validDate = this.fromDate;
    let fromDate = this.validDate.jsdate;
    this.validDate = this.toDate;
    let toDate = this.validDate.jsdate;

    if (fromDate > toDate)
      this.isValidDate = true;

    if (!this.isValidDate&&(this.formReports.shiftId!="")&&(+this.formReports.shiftId!=0)) {
      this.loadAllFormData();
    }
  }
  loadAllEquipments() {
    this.spinnerFlag = true;
    this.equipmentService.loadAllActiveEquipment().subscribe(response => {
      this.spinnerFlag = false;
      if (response.result != null) {
        this.equipmentList = response.result;
        this.equipmentData = response.result.map(option => ({"value":''+option.id,"label":option.name}));
      }
    }, error => { this.spinnerFlag = false });
  }

  loadAllShifts() {
    this.spinnerFlag = true;
    this.shiftService.loadAllActiveShifts().subscribe(response => {
      this.spinnerFlag = false
      if (response.result != null) {
        this.shiftList = response.result;
      }
    }, error => { this.spinnerFlag = false });
  }
  onChangeShift() {
    this.loadAllFormData();
  }
  loadAllFormData() {
    this.data=[];
    this.filteredData=[];
    this.spinnerFlag=true;
    if (!this.helper.isEmpty(this.formReports.equipmentId) && this.formReports.formId!="") {
      let formReport={
        equipmentId:this.formReports.equipmentId,
	      batchId:this.formReports.batchId,
          formId:this.formList[this.formReports.formId].key,
	      shiftId:this.formReports.shiftId,
        status:'',
        startDate: this.fromDate.date['day'] + "/" + this.fromDate.date['month'] +"/"+this.fromDate.date['year'],
        // startDate:this.fromDate.day + "/" + this.fromDate.month + "/" + this.fromDate.year,
        endDate: this.toDate.date['day'] + "/" + this.toDate.date['month'] +"/"+this.toDate.date['year'],
          // endDate:this.toDate.day + "/" + this.toDate.month + "/" + this.toDate.year,
	      mappingId:this.formList[this.formReports.formId].mappingId
      }
      
      this.service.loadAllForms(formReport).subscribe(response => {
        this.spinnerFlag = false;
        this.publishedMandatoryFeildJson={
          rows:new Array(),
          columns:new Array()
        }
        response.result.forEach((element,index) => {
          element.formData=JSON.parse(element.formData);
          this.createDyanamicColumn(element.formData,index,this.publishedMandatoryFeildJson);
          this.data.push(element);
        });
        this.filteredData=this.data;
        if (!this.tableView)
          this.createChartData();
      }, error => { this.spinnerFlag = false });
    }else{
      this.data=[];
      this.spinnerFlag=false;
    }
  }

  loadDocumentCommentLog(row) {
    row.createdBy=row.createdByName;
    row.constantName = row.permissionConstant;
    row.templateName=this.formList[this.formReports.formId].value;
    this.documentcomments.loadDocumentCommentLog(row);
  }
  viewRowDetails(row: any, status) {
    let mappingId=this.formList[this.formReports.formId].mappingId;
    this.commonDocumentStatusValue = status;
    this.tempRowId = row.id;
    this.popupdata = [];
    let data:any;
    if(mappingId<=0){
      data={ "id": row.id, "exists": true };
    }else{
      data={ "id": mappingId, "exists": true,"isMapping":true,"documentCode":row.dynamicFormCode };
    }
    this.dynamicService.loadDynamicFormForProject(data).subscribe(jsonResp => {
      if (jsonResp != null) {
        if(mappingId<=0){
          jsonResp.formData = JSON.parse(jsonResp.formData);
        }else{
          this.isMapping=true;
          jsonResp.formData = [];
          jsonResp.formDataList.forEach((element, i) => {
            element.formDataArray = [{ formData: JSON.parse(element.formData) }];
          });
          if(jsonResp.formDataList.length!=0){
            this.toggle(0,jsonResp);
          }
        }
        this.popupdata.push(jsonResp)
        this.viewIndividualData = true;
      }
    });
  }
  toggle(index,data){
    var ele=data.formDataList[index];
   }

  excelExport() {
    this.spinnerFlag = true;
    if(!this.isexcelExport){
      this.filteredData.forEach(element => {
        element.downloadDocType = 'Equipment Register';
        element.formData=JSON.stringify(element.formData);
      });
    }
    this.service.excelExport(this.filteredData).subscribe(resp => {
      this.spinnerFlag = false;
      if (resp.result) {
        this.filteredData.forEach(element => {
          element.downloadDocType = 'Equipment Register';
          element.formData=JSON.parse(element.formData);
        });
        this.dataXls = resp.sheet;
        var nameOfFileToDownload = "FormData.xls";
        var blob: Blob = this.helper.b64toBlob(this.dataXls, 'application/xls');
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, nameOfFileToDownload);
        } else {
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = nameOfFileToDownload;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      }
    },error => { this.spinnerFlag = false 
      swal({
        title: '404',
        text: 'Something went Wrong ...Try Again',
        type: 'error',
        timer: this.helper.swalTimer,
        showConfirmButton: false
      }
      );});
  }
  loadEquipmentDetails() {
    this.equipmentDetails = new Equipment();
    if (!this.helper.isEmpty(this.formReports.equipmentId)) {
      this.equipmentList.forEach(element => {
        if (element.name === this.formReports.equipmentId || element.id === Number(this.formReports.equipmentId))
          this.equipmentDetails = element;
      });
    } else {
      this.equipmentDetails = new Equipment();
    }
  }
  loadBatchDetails() {
    this.batchDetails = new BatchCreation();
    if (!this.helper.isEmpty(this.formReports.batchId)) {
      this.batchCreationService.editBatch(this.formReports.batchId).subscribe(response => {
        if (!this.helper.isEmpty(response.result))
          this.batchDetails = response.result
      });
    } else {
      this.batchDetails = new BatchCreation();
    }
  }

  createDyanamicColumn(formData:any[],index,mandatoryFeildJson){
    let column=new Array();
    let row=new Array();
    formData.forEach(json=>{
      if (json.required && (json.type =='select' ||json.type =='time' || json.type == 'date' || json.type =='number' || json.type =='text' || json.type =='datetime-local' )){
        if(index==0){
          column.push(json.label);
        }
        let value=json.value;
        if(json.type==='datetime-local')
        value= this.datePipe.transform(json.value, 'dd-MM-yyyy HH:mm ');

        if(json.type==='date')
        value= this.datePipe.transform(json.value, 'dd-MM-yyyy');

        if(json.type =='select'){
          json.values.forEach(element => {
            if(element.value==json.value)
            value=element.label;
          });
        }
        row.push(value);
      }
    });
    if(index==0)
    mandatoryFeildJson.columns=column;
    mandatoryFeildJson.rows.push(row)
  }

  loadOrgDateFormat() {
    this.servie.getOrgDateFormatForDatePicker().subscribe(result => {
        if (!this.helper.isEmpty(result)) {
            this.pattern = result.replace("y","Y");
        }
    });
  }
  loadOrgDateFormatAndTime() {
    this.servie.getOrgDateFormat().subscribe(result => {
        if (!this.helper.isEmpty(result)) {
            this.myDatePickerOptions.dateFormat=result.datePattern.replace("YYYY", "yyyy");
            this.today = new Date();
            this.fromDate =  {date: {year: this.today.getFullYear(),month: this.today.getMonth() + 1,day: this.today.getDate()}};
            this.toDate =  {date: {year: this.today.getFullYear(),month: this.today.getMonth() + 1,day: this.today.getDate()}};
            this.date.setOptions();
            this.date1.setOptions();
        }
    });
  }

  openBtnClicked(event){
    if(!this.date.showSelector)
    this.date.openBtnClicked();
    if(!this.date1.showSelector)
    this.date1.openBtnClicked();
    this.date1.opts.alignSelectorRight=true
  }
}

