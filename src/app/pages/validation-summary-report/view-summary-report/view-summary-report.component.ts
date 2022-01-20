import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Helper } from '../../../shared/helper';
import { VsrService } from '../validation-summary.service';
import { VsrDTO } from '../../../models/model';
import { Router } from '@angular/router';
import { Permissions } from '../../../shared/config';
import swal from 'sweetalert2';
import { AdminComponent } from '../../../layout/admin/admin.component';

@Component({
  selector: 'app-view-summary-report',
  templateUrl: './view-summary-report.component.html',
  styleUrls: ['./view-summary-report.component.css','../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class ViewSummaryReportComponent implements OnInit {
  @ViewChild('myTable') table: any;
  data:any;
  viewData = [];
  spinnerFlag: boolean = false;
  publishedData:any;
  isSelectedPublishData:boolean =  false;
  tableAppCard:boolean=true;
  viewAppCard:boolean = false;
  public filterQuery = '';
  constructor(private comp: AdminComponent,public vsrService:VsrService,  public helper: Helper) { }

  ngOnInit() {
    this.loadData();
    this.comp.setUpModuleForHelpContent("137");
  }

  loadData(){
    this.spinnerFlag = true;
    this.vsrService.getAllReports().subscribe(responce=>{
    this.data = responce.unpublishedList;
    this.publishedData = responce.publishedList;
    this.spinnerFlag = false;
  })
  }

  onChangePublishData(){
     
    for(let data of this.data){
      if(data.publishedFlag){
        this.isSelectedPublishData=true;
        break;
      }else{
        this.isSelectedPublishData=false;
      }
    }
  }

  publishData(){
    this.spinnerFlag = true;
    this.vsrService.publishRecord(this.data).subscribe(response => {
      if (response.result === "success") {
        status = "success";
        swal(
            'Published Successfully!',
            'Record has been published.',
            'success'
        );
        this.spinnerFlag = false;
        this.isSelectedPublishData=false;
      }else{
        swal(
            'Published Failed!',
            'Record has not been published. Try again!',
            'error'
        );
        this.spinnerFlag = false;
      } 
      this.loadData();
    });
  }

  delete(id:any){
    this.spinnerFlag = true;
    this.vsrService.deleteReport(id).subscribe(response=>{
      if(response.result ==="success"){
        swal(
          'Success',
          'Report has been deleted successfully',
          'success'
        )
        this.loadData();
        this.spinnerFlag = false;
      }else{
        swal(
          'Error!',
          'Oops something went Worng..',
          'error'
        )
        this.spinnerFlag = false;
      }
    });
  }

  viewReport(id:any){
    this.tableAppCard = false;
    this.viewAppCard = true;
    this.spinnerFlag = true;
    this.vsrService.getReportById(id).subscribe(response=>{
      this.viewData.push(response.data);
      this.spinnerFlag = false;
    });

  }

  closeView(){
    this.tableAppCard = true;
    this.viewAppCard = false;
  }

}
