import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { NewEquipmemtDashboardService } from './new-equipmemt-dashboard.service';
import { EquipmentService } from '../equipment/equipment.service';
import { Helper } from '../../shared/helper';
import { Equipment, EquipmentDashboardDetails } from '../../models/model';
import { EquipmentDetailedDashboardService } from '../equipment-wise-dashboard/equipment-wise-dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminComponent } from '../../layout/admin/admin.component';
import swal from 'sweetalert2';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';
@Component({
  selector: 'app-new-equipmemt-dashboard',
  templateUrl: './new-equipmemt-dashboard.component.html',
  styleUrls: ['./new-equipmemt-dashboard.component.css','./../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NewEquipmemtDashboardComponent implements OnInit {
  data: any[]=new Array();
  filtredData: any[]=new Array()
  spinnerFlag = false;
  equipmentList: any;
  equipmentDataList:any;
  seletedEquipment:string="";
  equipmentDetails: Equipment = new Equipment();
  equipmentDashboard:EquipmentDashboardDetails = new EquipmentDashboardDetails();
  dashboardDetails: any[]=new Array();
  receivedId: string;
  isReceivedId:boolean=false;
  completeTaskList:any[]=new Array();
  pendingTaskList:any[]=new Array();
  datePipeFormat='yyyy-MM-dd';
  constructor(public route: Router, private adminComponent: AdminComponent,public router: ActivatedRoute,public dashboardService:EquipmentDetailedDashboardService,
     public equipmentService: EquipmentService,public helper:Helper,private service: NewEquipmemtDashboardService,private servie: DateFormatSettingsService) { }

  ngOnInit() {
    this.loadOrgDateFormatAndTime();
    this.adminComponent.setUpModuleForHelpContent("178");
   this.receivedId=this.router.snapshot.params["id"];
   if(this.receivedId != ':id'){
      this.isReceivedId=true;
      this.spinnerFlag = true;
      this.service.loadEquipmentsDetailsById(this.receivedId).subscribe(response => {
      this.spinnerFlag = false
      this.data = response.result;
      this.filtredData = response.result;
    }, error => { this.spinnerFlag = false });
   }else{
    this.loadAll();
    this.loadAllEquipments();
   }
  }
  loadAll() {
    this.spinnerFlag = true;
    this.service.loadEquipmentsDetails().subscribe(response => {
      this.spinnerFlag = false
      this.data = response.result;
      // this.filtredData = response.result;
    }, error => { this.spinnerFlag = false });
  }
  loadAllEquipments() {
    this.spinnerFlag = true;
    this.equipmentService.loadAllActiveEquipment().subscribe(response => {
      this.spinnerFlag = false;
      if (response.result != null) {
        this.equipmentList = response.result;
        this.equipmentDataList = response.result.map(option =>
         ({"value":''+option.id,"label":option.name}));
        
      }
    }, error => { this.spinnerFlag = false });
  }
  onChangeEquipment(equipmentId:any){
   this.seletedEquipment = equipmentId;
    this.spinnerFlag = true;
    this.filtredData=[];
    if(!this.helper.isEmpty(equipmentId)){
      this.spinnerFlag = false
      this.data.forEach(element => {
        if(""+element.equipmentId === equipmentId)
          this.filtredData.push(element);
      });
    }else{
      this.filtredData=this.data;
      this.spinnerFlag = false
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
    this.equipmentDashboard.equipmentId=equipmentId;
    this.dashboardService.loadEquipmentDetails(this.equipmentDashboard).subscribe(result => {
      this.dashboardDetails = result.result;
      this.spinnerFlag = false;
    },error => {
      this.spinnerFlag = false;
      swal({
        title: 'Error in Saving',
        text: "oops something went wrong",
        type: 'error',
        timer: this.helper.swalTimer,
        showConfirmButton: false,
      }

      );
    })
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
    this.route.navigate(["taskCreation"], { queryParams: { id: row.id,equipmentId:this.seletedEquipment, url: '/newEquipmentDashboard/:id'} })
  }
}
