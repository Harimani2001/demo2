import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PeriodicReviewService } from './periodic-review.service';
import { ConfigService } from '../../shared/config.service';
import { UserPrincipalDTO } from '../../models/model';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateISOParserFormatter } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-parser-formatter';
import { Helper } from '../../shared/helper';
import { periodicReviewErrorTypes } from '../../shared/constants';
import { Permissions } from './../../shared/config';
import { DashBoardService } from '../dashboard/dashboard.service';
import { AdminComponent } from '../../layout/admin/admin.component';
import swal from 'sweetalert2';
@Component({
  selector: 'app-periodic-review',
  templateUrl: './periodic-review.component.html',
  styleUrls: ['./periodic-review.component.css','../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class PeriodicReviewComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  public onReviewDateForm=null;
  currentUser:UserPrincipalDTO=new UserPrincipalDTO();
  spinnerFlag = false;
  data: any=[];
  projectList: any=[];
  projectId: string = "";
  isSelectedForReviewDate:boolean=false;
  public today: NgbDateStruct;
  public validDate: NgbDateStruct;
  permissionModal: Permissions = new Permissions(this.helper.PERIODIC_REVIEW, false);
  isEditReviewDate:boolean=false;
  editReviewDateData:any;
  changeVersionData:any;
  viewIndividualDataFlag: boolean = false;
  public filterQuery = '';
  constructor(public adminComponent:AdminComponent,public service: PeriodicReviewService, public configService: ConfigService,public fb: FormBuilder,public helper: Helper,public periodicReviewErrorTypes:periodicReviewErrorTypes,public dashBoardService:DashBoardService) { }

  ngOnInit() {
    this.adminComponent.setUpModuleForHelpContent(this.helper.PERIODIC_REVIEW);
    this.loadProjects();
    this.loadCurrentuser();
    this.onReviewDateForm =this.fb.group({
      reviewDate:  ['', Validators.required],
    });
    let now = new Date();
    let tempData = new NgbDateISOParserFormatter;
    this.today = tempData.parse(now.toISOString());
    this.configService.loadPermissionsBasedOnModule(this.helper.PERIODIC_REVIEW).subscribe(resp => {
      this.permissionModal = resp
    });
  }
  loadCurrentuser(){
    this.configService.loadCurrentUserDetails().subscribe(response => {
      this.currentUser=response;
      this.projectId=this.currentUser.projectId;
      this.loadDocumentsForProject();
    });
  }
  openDatepicker(id) {
    id.toggle()
   }
  loadDocumentsForProject() {
    this.spinnerFlag = true;
    this.service.loadDocuments(this.projectId).subscribe(response => {
      this.spinnerFlag = false
      if (response.result != null) {
        this.data = response.result;
      }
    }, error => { this.spinnerFlag = false });
  }
  onClickSelect() {
    for(let data of this.data){
      if(data.selectedFlag){
        this.isSelectedForReviewDate=true;
        break;
      }else{
        this.isSelectedForReviewDate=false;
      }
    }
  }
  loadProjects() {
    this.configService.loadprojectOfUserAndCreator().subscribe(response => {
      this.projectList = response.projectList;
    });
  }
  resetReviewForm(){
    this.isEditReviewDate=false;
    this.onReviewDateForm.reset();
  }
  saveReviewDate(){
    let list:any=new Array();
    this.spinnerFlag = true;
    if(this.onReviewDateForm.valid ){
      let reviewDate=this.populateSaveDate(this.onReviewDateForm.get("reviewDate").value);
      // this.configService.findHoliday(reviewDate).subscribe(res =>{
      //        if(res){
      //          alert("Selected date is a holiday, please select some other date");
      //          return;
      //        }
      // });
      if(!this.isEditReviewDate){
        this.data.map(m=>{
          m.globalProjectId=this.projectId;
          if(m.selectedFlag)
            m.reviewDate=reviewDate;
        });
        list=this.data;
      }else{
        this.editReviewDateData.selectedProjectId=this.projectId;
        this.editReviewDateData.reviewDate=reviewDate;
        list.push(this.editReviewDateData);
      }
      this.service.saveReviewDatesForDocuments(list).subscribe(response => {
        this.spinnerFlag = false;
        this.closebutton.nativeElement.click();
        this.loadDocumentsForProject();
      }, error => { this.spinnerFlag = false });
    }else{
      Object.keys(this.onReviewDateForm.controls).forEach(field => {
        const control = this.onReviewDateForm.get(field);            
        control.markAsTouched({ onlySelf: true });      
      });
    }
  }
  populateSaveDate(date:any):any{
    let result;
    if(!this.helper.isEmpty(date)){
      this.validDate = date;
      result=this.validDate.year+ "-"+ this.validDate.month + "-"+this.validDate.day  ;
    }else{
      result="";
    }
   return result;
  }
  editReviewDate(row){
    this.isEditReviewDate=true;
    this.editReviewDateData=row;
    if(!this.helper.isEmpty(row.reviewDate))
      this.onReviewDateForm.get("reviewDate").setValue(this.populateDate(row.reviewDate));
    else
      this.onReviewDateForm.reset();
  }
  populateDate(date: any):any{
    let result;
    if(!this.helper.isEmpty(date)){
      let tempData = new NgbDateISOParserFormatter;
      let dateString = date.split("-");
      let validDate = new Date();
      validDate.setDate(dateString[2]);
      validDate.setMonth(dateString[1] - 1);
      validDate.setFullYear(dateString[0]);
      result= tempData.parse(validDate.toISOString());
    }else{
      result="";
    }
    return result;
  }
  changeDocVersion(row:any){
    this.spinnerFlag = true;
    this.changeVersionData = row;
    this.changeVersionData.selectedProjectId=this.projectId;
    this.service.saveDocumentVersion(this.changeVersionData).subscribe(result=>{
      this.spinnerFlag = false;
      if(result.result != "success"){
        swal({
                title:'warning',
                text:result.result,
                type:'warning',
                showConfirmButton:true,
              });
      }else{
        if(result.result == "success"){
        swal({
          title:'info',
          text:result.result,
          type:'question',
          timer:2000,
          showConfirmButton:false,
          onClose: () => {
            this.loadProjects();
            this.loadCurrentuser();
          }
        })
      }else{
        swal({
          title:'error',
          text:"Version is not changed..please try again",
          type:'error',
          timer:2000,
          showConfirmButton:false,
          onClose: () => {
           
          }
        })
      }
      }
     

    },error => { this.spinnerFlag = false 
      swal({
        title:'400',
        text:"Something went worng, please try again",
        type:'error',
        timer:this.helper.swalTimer,
        showConfirmButton:false,
      })
    });
  }
  viewPdf(row){
    this.viewIndividualDataFlag = true;
      this.spinnerFlag = true;
      this.dashBoardService.downloadDocumentPdf(row.docId, row.projectVersionId,"dashboard").subscribe(res => {
        var blob: Blob =this.helper.b64toBlob(res._body, 'application/pdf');
        this.createPdfIFrame(URL.createObjectURL(blob));
      });
  }
  createPdfIFrame(blob_url) {
    var iframe;
    var elementExists = document.getElementById("iframeView");
    if (!elementExists)
      iframe = document.createElement('iframe');
    else
      iframe = elementExists;

    iframe.setAttribute("id", "iframeView")
    iframe.setAttribute("height", "1200px");
    iframe.setAttribute("width", "1200px");
    iframe.src = blob_url;
    let find = document.querySelector('#fileUploadIdVendor');
    find.setAttribute("class", "well well-lg form-group row");
    find.appendChild(iframe);
    
    this.spinnerFlag = false;
  }
  closeIndividualData() {
    this.viewIndividualDataFlag = false
  }
}
