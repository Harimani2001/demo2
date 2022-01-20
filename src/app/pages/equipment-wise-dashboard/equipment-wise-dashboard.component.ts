import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Helper } from '../../shared/helper';
import { EquipmentDetailedDashboardService } from './equipment-wise-dashboard.service';
import swal from 'sweetalert2';
import { Permissions } from './../../shared/config';
import { Equipment, FormReports, EquipmentDashboardDetails } from '../../models/model';
import { EquipmentService } from '../equipment/equipment.service';
import { AdminComponent } from '../../layout/admin/admin.component';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-equipment-wise-dashboard',
  templateUrl: './equipment-wise-dashboard.component.html',
  styleUrls: ['./equipment-wise-dashboard.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class EquipmentWiseDashboardComponent implements OnInit {
  spinnerFlag = false;
  dashboardDetails: any[]=new Array();
  filterDashboardDetails: any[]=new Array();
  historyDetails: any[]=new Array();
  equipmentList: any;
  equipmentListData:any;
  equipmentDetails: Equipment = new Equipment();
  formReports: FormReports = new FormReports();
  modal:EquipmentDashboardDetails = new EquipmentDashboardDetails();
  equipmentDashboard:EquipmentDashboardDetails = new EquipmentDashboardDetails();
  selectedEquipment:any;
  completeTaskList:any[]=new Array();
  pendingTaskList:any[]=new Array();
  datePipeFormat='yyyy-MM-dd';
  constructor( public route: Router,private adminComponent: AdminComponent,public equipmentService: EquipmentService,
    public helper:Helper,public service:EquipmentDetailedDashboardService,private servie: DateFormatSettingsService) { }

  ngOnInit() {
    this.loadOrgDateFormatAndTime();
    this.loadAllEquipments();
    this.loadDashboardDetails();
    this.adminComponent.setUpModuleForHelpContent("170");
    this.adminComponent.taskEquipmentId = 0;
    this.adminComponent.taskDocType = "170";
    this.adminComponent.taskDocTypeUniqueId = "";
  }

  loadAllEquipments() {
    this.spinnerFlag = true;
    this.equipmentService.loadAllActiveEquipment().subscribe(response => {
      this.spinnerFlag = false;
      if (response.result != null) {
        this.equipmentList = response.result;
        this.equipmentListData = response.result.map(data =>({"value":''+data.id,"label":data.name}));
      }
    }, error => { this.spinnerFlag = false });
  }
loadDashboardDetails(){
    this.service.loadEquipmentDashboardDetails().subscribe(result => {
      this.dashboardDetails = result.result;
    });
}
  onChangeEquipment(eqid:any){
    this.modal.equipmentId = eqid;
    this.spinnerFlag = true;
    this.filterDashboardDetails=[];
    if(!this.helper.isEmpty(this.modal.equipmentId)){
      this.dashboardDetails.forEach(element => {
        if(""+element.equipmentId === this.modal.equipmentId)
          this.filterDashboardDetails.push(element);
      });
      this.spinnerFlag = false;
    }else{
      this.spinnerFlag = false;
      this.filterDashboardDetails=this.dashboardDetails;
    }
  }
  loadEquipmentDetails(equipmentId) {
    this.equipmentDetails = new Equipment();
    if (!this.helper.isEmpty(equipmentId)) {
      this.equipmentList.forEach(element => {
        if (element.id === Number(equipmentId))
          this.equipmentDetails = element;
      });
    } else {
      this.equipmentDetails = new Equipment();
    }
  }
  loadEquipmentHistory(equipmentId) {
    this.selectedEquipment=equipmentId;
    this.equipmentDashboard.equipmentId=equipmentId;
    this.service.loadEquipmentDetails(this.equipmentDashboard).subscribe(result => {
      this.historyDetails = result.result;
    },error => {
      this.spinnerFlag = false
      swal({
        title: '',
        text: 'Something went Wrong ...Try Again',
        type: 'error',
        timer: this.helper.swalTimer,
        showConfirmButton: false
      }
      );
    });
  }
  downloadFile() {
    this.equipmentDashboard.equipmentId=this.selectedEquipment;
    this.spinnerFlag = true;
    this.service.generatePdf(this.equipmentDashboard).subscribe(res => {
      var blob: Blob = this.helper.b64toBlob(res._body, 'application/pdf');
      let name = "EquipmentStatus" + new Date().toLocaleDateString()+".pdf";
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, name);
      } else {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      this.spinnerFlag = false
    });
  }

  loadEquipmentTasks(eqid:any){
    this.equipmentService.loadEquipmentTasks(eqid).subscribe(res=>{
      if(res.completeList &&res.pendingList){
        this.completeTaskList=res.completeList;
        this.pendingTaskList=res.pendingList;
      }
      });
  }

  loadOrgDateFormatAndTime() {
    this.servie.getOrgDateFormat().subscribe(result => {
        if (!this.helper.isEmpty(result)) {
          this.datePipeFormat=result.datePattern.replace("mm", "MM")
          this.datePipeFormat=this.datePipeFormat.replace("YYYY", "yyyy");
        }
    });
}

  redirect(row){
    this.route.navigate(["taskCreation"], { queryParams: { id: row.id,equipmentId:this.modal.equipmentId, url: '/equipmentDetailDashboard'} })
  }

}
