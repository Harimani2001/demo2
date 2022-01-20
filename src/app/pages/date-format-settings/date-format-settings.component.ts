import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OraganizationService } from '../organization/organization.service';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { IOption } from 'ng-select';
import { DateFormatSettingsService } from './date-format-settings.service';
import { DateFormatDTO } from '../../models/model';
import { Helper } from '../../shared/helper';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-date-format-settings',
  templateUrl: './date-format-settings.component.html',
  styleUrls: ['./date-format-settings.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
}) 
export class DateFormatSettingsComponent implements OnInit {
  public onDateForm: FormGroup;
  timeZoneList: Array<IOption> = new Array<IOption>();
  dateFormatList: any[] = new Array();
  datePatternList: Array<IOption> = new Array<IOption>();
  constructor( private adminComponent: AdminComponent,private servie: DateFormatSettingsService,
     public fb: FormBuilder, private oraganizationService: OraganizationService, 
     public lookUpService: LookUpService, public helper: Helper
     ,public permissionService: ConfigService,private datePipe: DatePipe) { }
  modal: DateFormatDTO = new DateFormatDTO();
  spinnerFlag: boolean = false;
  isSelectedOtherFormat: boolean = false;
  isValidDateFormat: boolean = false;
  convertedDate: string = "";
  ValidationMessage = "";
  pattern:any;
  permissionModal=new Permissions(this.helper.DATE_FORMAT,false);
  ngOnInit() {
    this.datePatternList= ([
      {value: "dd-mm-yyyy", label: "dd-MM-yyyy"},
      {value: "mm-dd-yyyy", label: "MM-dd-yyyy"},
      {value: "yyyy-mm-dd", label: "yyyy-MM-dd"},
      {value: "dd/mm/yyyy", label: "dd/MM/yyyy"},
      {value: "mm/dd/yyyy", label: "MM/dd/yyyy"},
      {value: "yyyy/mm/dd", label: "yyyy/MM/dd"},
      {value: "dd:mm:yyyy", label: "dd:MM:yyyy"},
      {value: "mm:dd:yyyy", label: "MM:dd:yyyy"},
      {value: "yyyy:dd:mm", label: "yyyy:dd:MM"},
  ]);
    this.getTimeZoneList();
    this.loadOrgDateFormat();
    this.onDateForm = this.fb.group({
      timeZone: ['', Validators.compose([
        Validators.required
      ])],
      dateFormat: ['', Validators.compose([
        Validators.required
      ])],
      datePattern: ['dd-mm-yyyy', Validators.compose([
        Validators.required
      ])],
    });
    this.adminComponent.setUpModuleForHelpContent("189");
    this.permissionService.loadPermissionsBasedOnModule(this.helper.DATE_FORMAT).subscribe(resp=>{
      this.permissionModal=resp;
    });
  }
  getTimeZoneList() {
    this.oraganizationService.getTimezoneList().subscribe(result => {
      this.timeZoneList = result.map(option => ({ value: option.key, label: option.key }));
    });
    this.permissionService.HTTPPostAPI("0","lookup/loadDateFormatForOrganization").subscribe(result => {
      this.dateFormatList = result;
    });
  }
  loadOrgDateFormat() {
    this.spinnerFlag = true;
    this.servie.getOrgDateFormat().subscribe(result => {
      if (!this.helper.isEmpty(result)) {
        this.modal = result;
        this.onDateForm.get("timeZone").setValue(this.modal.timeZoneId);
        this.onDateForm.get("dateFormat").setValue(this.modal.dateFormat);
        this.onDateForm.get("datePattern").setValue(this.modal.datePattern);
        this.onTypeDateFormat();
        this.onChangePickerFormat();
      }
      this.spinnerFlag = false;
    });
  }
  saveOrgDateFormat() {
    this.modal.dateFormat = this.onDateForm.get("dateFormat").value;
    this.modal.timeZoneId = this.onDateForm.get("timeZone").value;
    this.modal.datePattern = this.onDateForm.get("datePattern").value;
    this.modal.newDateFormat=this.isSelectedOtherFormat;
    this.spinnerFlag = true;
    this.servie.saveOrgDateFormat(this.modal).subscribe(result => {
    location.reload();
      swal({
        title: 'Updated!',
        text: 'Date format is updated successfully.',
        type: 'success',
        timer: this.helper.swalTimer
      });
      this.spinnerFlag = false;
    });
  }
  onChangeDateFormat() {
    let selectedValue = this.onDateForm.get("dateFormat").value;
    if ("Other" === selectedValue) {
      this.isSelectedOtherFormat = true;
      this.onDateForm.get("dateFormat").setValue("");
      this.convertedDate = "";
    } else {
      this.isSelectedOtherFormat = false;
    }
    this.onTypeDateFormat();
  }
  onTypeDateFormat() {
    this.spinnerFlag = false;
    if (!this.helper.isEmpty(this.onDateForm.get("dateFormat").value)) {
      this.spinnerFlag = true;
      setTimeout(()=>{
        this.servie.validateOrgDateFormat(this.onDateForm.get("dateFormat").value, this.onDateForm.get("timeZone").value).subscribe(result => {
          this.convertedDate = result.date;
          this.isValidDateFormat = result.flag;
          this.spinnerFlag = false;
        });
      },60);
     
    }
  };

  onChangePickerFormat(){
    let patt= this.onDateForm.get("datePattern").value.split(" ",2);
    let d=patt;
    if(patt.length>1){
     d= d[0].replace("mm", "MM");
     d = d.replace("YYYY", "yyyy");
     d = d +" "+patt[1]
    }else{
      d = d[0].replace("mm", "MM");
      d = d.replace("YYYY", "yyyy");
    }
  this.pattern=  this.datePipe.transform(new Date(),d);
  }
}
