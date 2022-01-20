import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Permissions } from './../../shared/config';
import { AdminComponent } from '../../layout/admin/admin.component';
import { Helper } from '../../shared/helper';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { EquipmentService } from '../equipment/equipment.service';
import { MasterDynamicFormsService } from '../master-dynamic-forms/master-dynamic-forms.service';
import { FormReportsService } from './form-reports.service';
import { DocumentStatusCommentLogComponent } from '../document-status-comment-log/document-status-comment-log.component';
import swal from 'sweetalert2';
import { ConfigService } from '../../shared/config.service';
@Component({
  selector: 'app-form-reports',
  templateUrl: './form-reports.component.html',
  styleUrls: ['./form-reports.component.css','./../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None,

})
export class FormReportsComponent implements OnInit {
  @ViewChild('documentcomments') documentcomments:DocumentStatusCommentLogComponent;
  permissionModal: Permissions = new Permissions("165",false);
  spinnerFlag = false;
  data: any;
  viewIndividualData: boolean = false;
  popupdata = [];
  formList: any[] = new Array();
  publishedMandatoryFeildJson: any = {};
  commonDocumentStatusValue: any;
  public tempRowId: any;
  public dataXls: any;
  selectedFormIndex: string = "";
  isexcelExport:boolean=false;
  isMapping:boolean=false;
  showCsvButton: boolean = false;
  public filterQuery = '';
  @ViewChild('myTable') table: any;
  constructor(public permissionService:ConfigService, private adminComponent: AdminComponent,public dynamicService: DynamicFormService, private datePipe: DatePipe, public masterDynamicFormService: MasterDynamicFormsService, public helper: Helper, public service: FormReportsService, public equipmentService: EquipmentService) { }

  ngOnInit() {
    this.adminComponent.setUpModuleForHelpContent("165");
    this.adminComponent.taskDocType = "165";
    this.adminComponent.taskDocTypeUniqueId = "";
    this.adminComponent.taskEquipmentId = 0;
    this.masterDynamicFormService.loadEquipmentMappingForms().subscribe(result => {
      if (result != null){
        this.formList = result;
      }
    });
    this.permissionService.loadPermissionsBasedOnModule("165").subscribe(resp=>{
      this.permissionModal=resp;
    }); 
  }


  loadAllFormData() {
    this.data = [];
    this.spinnerFlag = true;
    this.showCsvButton= true;
    if (this.selectedFormIndex!='') {
      let formData: FormData = new FormData();
      formData.append('permissionConstant', this.formList[this.selectedFormIndex].key);
      formData.append('mappingId', this.formList[this.selectedFormIndex].mappingId);
      this.service.loadAllForms(formData).subscribe(result => {
        this.spinnerFlag = false;
        if (result != null) {
          this.publishedMandatoryFeildJson = {
            rows: new Array(),
            columns: new Array()
          }
          result.forEach((element, index) => {
            element.formData = JSON.parse(element.formData);
            this.createDyanamicColumn(element.formData, index, this.publishedMandatoryFeildJson);
            this.data.push(element)
          });
        }
      },error => { this.spinnerFlag = false });
    } else {
      this.spinnerFlag = false;
      this.data = [];
    }
  }
  viewRowDetails(row: any, status) {
    let mappingId= this.formList[this.selectedFormIndex].mappingId;
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
  loadDocumentCommentLog(row) {
    row.createdBy=row.createdByName;
    row.constantName = row.permissionConstant;
    row.templateName= this.formList[this.selectedFormIndex].value;
    this.documentcomments.loadDocumentCommentLog(row);
  }
  toggle(index,data){
    var ele=data.formDataList[index];
   }
  excelExport() {
    this.spinnerFlag = true;
    if(!this.isexcelExport){
      this.data.forEach(element => {
        element.downloadDocType = 'Equipment Summary';
        element.formData=JSON.stringify(element.formData);
      });
    }
    // this.isexcelExport=true;
    this.service.excelExport(this.data).subscribe(resp => {
      this.spinnerFlag = false;
      if (resp.result) {
        this.dataXls = resp.sheet;
        var nameOfFileToDownload = "FormData.xls";
        var blob: Blob = this.helper.b64toBlob(this.dataXls, 'application/xls');
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, nameOfFileToDownload);
        } else {
          this.spinnerFlag = false;
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = nameOfFileToDownload;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          // swal({
          //   title: '401',
          //   text: 'Something went Wrong ...Try Again',
          //   type: 'error',
          //   timer: this.helper.swalTimer,
          //   showConfirmButton: false
          // }
          // );
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

}
