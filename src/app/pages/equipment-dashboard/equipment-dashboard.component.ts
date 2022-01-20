import { Component, OnInit } from '@angular/core';
import { FormReports, DynamicFormDTO, Equipment } from '../../models/model';
import { EquipmentService } from '../equipment/equipment.service';
import { MasterDynamicFormsService } from '../master-dynamic-forms/master-dynamic-forms.service';
import { Helper } from '../../shared/helper';
import { EquipmentDashboardService } from './equipment-dashboard.service';
import { DatePipe } from '@angular/common';
import { AdminComponent } from '../../layout/admin/admin.component';

@Component({
  selector: 'app-equipment-dashboard',
  templateUrl: './equipment-dashboard.component.html',
  styleUrls: ['./equipment-dashboard.component.css']
})
export class EquipmentDashboardComponent implements OnInit {
  spinnerFlag = false;
  equipmentList: any;
  formList: any[] = new Array();
  formReports: FormReports = new FormReports();
  isCurrentbatch:boolean=false;
  isPreviousbatch:boolean=false;
  currentbatchData:any;
  previousbatchData:any;
  currentbatchColumns: any[] =new Array();
  previousbatchColumns: any[] =new Array();
  equipmentDetails: Equipment = new Equipment();
  constructor( private adminComponent: AdminComponent,private datePipe: DatePipe,public service:EquipmentDashboardService, public equipmentService: EquipmentService,public masterDynamicFormService: MasterDynamicFormsService,public helper: Helper) { }

  ngOnInit() {
    this.loadAllEquipments();
    this.adminComponent.setUpModuleForHelpContent("178");
  }
  loadAllEquipments() {
    this.spinnerFlag = true;
    this.equipmentService.loadAllActiveEquipment().subscribe(response => {
      this.spinnerFlag = false;
      if (response.result != null) {
        this.equipmentList = response.result;
      }
    }, error => { this.spinnerFlag = false });
  }
  onChangeEquipment() {
    if (!this.helper.isEmpty(this.formReports.equipmentId)) {
      this.masterDynamicFormService.loadPublishedTemplateByEquipment(this.formReports.equipmentId).subscribe(result => {
        if (result != null){
          this.formList = result;
        }
      });
      this.loadEquipmentDetails();
    } else {
      this.formList = [];
    }
    this.formReports.formId="";
    this.onChangeForm();
  }

  onChangeForm() {
    this.isCurrentbatch=false;
    this.isPreviousbatch=false;
    this.currentbatchData=new DynamicFormDTO();
    this.previousbatchData=new DynamicFormDTO();
    if (!this.helper.isEmpty(this.formReports.formId)) {
      this.service.loadFormsData(this.formReports).subscribe(response => {
        if(!this.helper.isEmpty(response.currentBatch)){
          this.isCurrentbatch=true;
          this.currentbatchData=response.currentBatch;
          this.currentbatchColumns=new Array();
          this.currentbatchData.formData=JSON.parse(this.currentbatchData.formData);
          this.createDyanamicColumn(this.currentbatchData.formData,this.currentbatchColumns);
        }
        if(!this.helper.isEmpty(response.previousBatch)){
          this.isPreviousbatch=true;
          this.previousbatchData=response.previousBatch;
          this.previousbatchColumns=new Array();
          this.previousbatchData.formData=JSON.parse(this.previousbatchData.formData);
          this.createDyanamicColumn(this.previousbatchData.formData,this.previousbatchColumns);
        }
      });
    }
  }
  createDyanamicColumn(formData:any[],resultColumns){
    formData.forEach(json=>{
      if (json.required && (json.type =='select' ||json.type =='time' || json.type == 'date' || json.type =='number' || json.type =='text' || json.type =='datetime-local' )){
        let jsonData={
          header:json.label,
          value: json.value,
        }
        if(json.type==='datetime-local')
        jsonData.value= this.datePipe.transform(jsonData.value, 'dd-MM-yyyy HH:mm ');

        if(json.type==='date')
        jsonData.value= this.datePipe.transform(jsonData.value, 'dd-MM-yyyy');

        if(json.type =='select'){
          json.values.forEach(element => {
            if(element.value==json.value)
            jsonData.value=element.label;
          });
        }
        resultColumns.push(jsonData);
      }
    });
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
}
