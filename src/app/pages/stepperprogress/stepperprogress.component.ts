import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StepperClass, ExternalApprovalDTO } from './../../models/model';
import { ConfigService } from './../../shared/config.service';
import { Helper } from './../../shared/helper';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IndividualDocumentWorkflowService } from '../individual-document-workflow/individual-document-workflow.service';
import swal from 'sweetalert2';
import { externalApprovalErrorTypes } from '../../shared/constants';
@Component({
  selector: 'app-stepperprogress',
  templateUrl: './stepperprogress.component.html',
  styleUrls: ['./stepperprogress.component.css']
})
export class StepperprogressComponent implements OnInit,OnDestroy {

  @Input() isIcon: boolean = false;
  @ViewChild('levelDescription') levelDescription:any;
  @ViewChild('externalApprovalmodal') externalApprovalmodal:any;
  leveList=null;
  public subscription:any=[];
  public getStatus:any=[];
  public publishedData:any;
  public levels:any;
  public users:any;
  public stepperModule: StepperClass = null
  @Input() constant: any=null;
  spinnerFlag:boolean=false;
  content:any;
  flag:boolean=true;
  userApprovalList=new Array();
  public onExternalApprovalForm: FormGroup;
  externalApprovalDTO:ExternalApprovalDTO;
  currentLeveldata:any;
  public loadStepperList: any[] = new Array();
  currentLevelIndex:number;
  workflowJobStatus:boolean=false;
  constructor(public helper: Helper, public config: ConfigService,private service: IndividualDocumentWorkflowService,public fb: FormBuilder,public externalApprovalErrorTypes:externalApprovalErrorTypes) { }

  ngOnInit() {
    this.publishedData = null;
    this.getStatus = null;
    if ( null != this.constant) {
      this.stepperModule = new StepperClass();
      this.stepperModule.constantName = this.constant;
      this.spinnerFlag=true;
      this.config.loaddocumentStepper(this.stepperModule).subscribe(response => {
        this.getStatus = response;
        this.stepperModule = null;
        this.spinnerFlag=false;
      });
    }
    this.subscription.push(this.helper.steppermodel.subscribe(
      data => {
 if (data !== 'no data') {
   this.publishedData = data;
   this.spinnerFlag=true;
   if(!this.helper.isEmpty(this.publishedData.constantName)){
    this.config.HTTPGetAPI("common/getWorkflowJobStatus/"+this.publishedData.constantName+"/"+false).subscribe(res =>{
      this.workflowJobStatus=res.result;
    })
   }
   this.config.loaddocumentStepper(data).subscribe(response => {
    this.getStatus = response;
    console.log(this.getStatus);
    this.getStatus.forEach((element,index) => {
      if(element.permission && !element.userApprovalDone){
        this.currentLeveldata=element;
        this.currentLevelIndex=index;
      }
      if (null != element.workflowDto) {
        element.workflowDto.documentCode = this.publishedData.code; 
        element.workflowDto.displayCreatedTime = (<any>data).displayCreatedTime;
        element.workflowDto.displayUpdatedTime = (<any>data).displayUpdatedTime;
        element.workflowDto.documentTitle = (<any>data).documentTitle;
        element.workflowDto.createdBy = (<any>data).createdBy;
        element.workflowDto.updatedBy = (<any>data).updatedBy;
        if(this.publishedData.testRunName)
        element.workflowDto.testRunName = this.publishedData.testRunName;
      }
    });
    this.spinnerFlag=false;
    data = null;
  });
 }
}));
this.onExternalApprovalForm = this.fb.group({
  name: ['', Validators.compose([
    Validators.required
  ])],
  email: ['', Validators.compose([
    Validators.required,Validators.pattern('[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')
  ])],
  remarks: ['', Validators.compose([
    Validators.required
  ])],
  validity: ['', Validators.compose([
    Validators.required
  ])]
});
}

ngOnDestroy(): void {
  if(!this.helper.stepper.closed){
    this.subscription.forEach(element => {
      element.unsubscribe(); 
    }); 
   }
  this.helper.stepperchange('no data');
}

getDescription(data:any){
  this.flag=false;
  this.content=data;
  this.levelDescription.show();
}
onClickExternalApproval(data){
  this.onExternalApprovalForm.reset();
  this.onExternalApprovalForm.get("validity").setValue(2);
  this.externalApprovalDTO=new ExternalApprovalDTO();
  const ids: any[] = new Array();
  ids.push({"key":this.publishedData.documentIdentity,"value":this.publishedData.code});
  this.externalApprovalDTO.documentType = this.publishedData.constantName;
  this.externalApprovalDTO.documentIds = ids;
  this.externalApprovalDTO.levelId=data.filter(f => f.lastEntry)[0].levelId;
}
onClickSave(){
  if (this.onExternalApprovalForm.valid) {
    this.spinnerFlag=true;
    this.externalApprovalDTO.email = this.onExternalApprovalForm.get("email").value;
    this.externalApprovalDTO.validity = this.onExternalApprovalForm.get("validity").value;
    this.externalApprovalDTO.remarks = this.onExternalApprovalForm.get("remarks").value;
    this.externalApprovalDTO.name = this.onExternalApprovalForm.get("name").value;
    this.service.Api(this.externalApprovalDTO, 'externalApproval/saveExternalApprovalDetails').subscribe(response => {
      this.spinnerFlag=false;
      this.externalApprovalmodal.hide();
      swal({
        title: '',
        text: 'Success',
        type: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    });
  }else {
    Object.keys(this.onExternalApprovalForm.controls).forEach(field => {
      const control = this.onExternalApprovalForm.get(field);            
      control.markAsTouched({ onlySelf: true });      
    });
  }
}

loadStepperData() {
  this.getStatus.forEach((element,index) => {
    if(index < this.currentLevelIndex){
      element.workFlowCompleted=true;
    }else if(this.currentLevelIndex == undefined){
      element.workFlowCompleted=true;
    }else{
      element.workFlowCompleted=false;
    }
  });
    this.getStatus=this.getStatus.filter(d => d.status !="Rejected" && d.status != "Deactivated");
    let newStatus:any[]=new Array();
    for(let element of this.getStatus.reverse()){
      let levels=newStatus.filter(d => d.levelId == element.levelId);
      if(levels.length == 0)
        newStatus.push(element);
    }
    this.getStatus= newStatus.reverse();
  }
}