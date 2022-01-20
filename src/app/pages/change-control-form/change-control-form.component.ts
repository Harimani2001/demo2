import { Component, OnInit,ViewEncapsulation,ViewChild } from '@angular/core';
import { CCFService } from './change-control-form.service';
import { Helper } from '../../shared/helper';
import { DepartmentService } from '../department/department.service';
import { IOption } from 'ng-select';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Permissions } from '../../shared/config';
import { AdminComponent } from '../../layout/admin/admin.component';
import { ConfigService } from '../../shared/config.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { UserPrincipalDTO, ChangeControlForm, WorkflowDocumentStatusDTO, StepperClass } from '../../models/model';
import { MasterControlService } from '../master-control/master-control.service';
import { MasterDynamicFormsService } from '../master-dynamic-forms/master-dynamic-forms.service';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { DatePipe } from '../../../../node_modules/@angular/common';
import { UserService } from '../userManagement/user.service';
import { AuditTrailViewComponent } from '../audit-trail-view/audit-trail-view.component';
@Component({
  selector: 'app-change-control-form',
  templateUrl: './change-control-form.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./change-control-form.component.css','./../../../../node_modules/sweetalert2/dist/sweetalert2.min.css']
})
export class ChangeControlFormComponent implements OnInit {
  filterQuery='';
   ccf: FormGroup;
   spinnerFlag:boolean = false;
   ccfType:any;
   ccfStatus:any;
   priorityList:any;
   iscreate: boolean = false;
   isUpdate: boolean = false;
   isSave: boolean = false;
   submitted:boolean=false;
   simpleOptionDepartment: Array<IOption> = new Array<IOption>();
   dept:string = '';
   permissionData: any;
   permisionModal: Permissions = new Permissions("191",false);
   users:any[];
   usersList: any = [];
   userItemList = [];
   currentUser: UserPrincipalDTO = new UserPrincipalDTO();
   modal:ChangeControlForm = new ChangeControlForm();
   inputField:any=[];
   dynamicForm: boolean = false;
   formList: any[] = new Array();
   data:any;
   completed:any;
   published:any;
   viewData: any;
   ccfCode:string = "";
   viewIndividualData: boolean = false;
   isLogEntry: boolean = false;
   selectedForms: any[];
   selectedForm: any = "";
   selectedRow: any;
   ccfDynamicFormData: any[] = new Array();
   publishedMandatoryFeildJson: any = {};
   tableView: boolean = false;
   isSelectedPublishData:boolean=false;
   statusCountList:any; 
   routeback:any=null;
   roleBack:any=null;
   commonDocumentStatusValue:any;
   redirctUrlFormCCFView:any;
  @ViewChild('auditView') auditView: AuditTrailViewComponent;
  validation_messages = {
      'dept': [
        { type: 'required', message: 'Department is Required' },
      ],
      'description': [
        { type: 'required', message: 'Description is Required' },
      ],
      'priority': [
        { type: 'required', message: 'Priority is Required' },
      ],
      'users': [
        { type: 'required', message: 'User is Required' },
      ],
      'reason': [
        { type: 'required', message: 'Reason /Justification for change is Required' },
      ],
      // 'impactassessment': [
      //   { type: 'required', message: 'Impactassessment is Required' },
      // ],
      // 'assessment': [
      //   { type: 'required', message: 'Risk Assessment is Required' },
      // ],
      // 'regulatorynotification': [
      //   { type: 'required', message: 'User is Required' },
      // ],
      // 'status': [
      //   { type: 'required', message: 'Status is Required' },
      // ],
      // 'dynamicForm': [
      //   { type: 'required', message: 'User is Required' },
      // ],
      
  }
  @ViewChild('myTable') table: any;
  constructor(private userService:UserService,private route: ActivatedRoute,private datePipe: DatePipe,private router: Router,public masterDynamicFormService:MasterDynamicFormsService,public masterControlService:MasterControlService,public projectsetupService: projectsetupService,public configService: ConfigService,private comp: AdminComponent,public fb: FormBuilder,public service:CCFService,public helper:Helper,public departService:DepartmentService) { 
   
    // let completeURL = "" + location.href;
    // let splitURL = completeURL.split("&");
    // if (completeURL.includes("isLog")) {
    //   this.isLogEntry = true;
    // this.selectedForm = parseInt(splitURL[splitURL.length - 1].replace(/[^0-9\.]/g, ''), 10);
    // }

    this.route.queryParams.subscribe(rep => {
      if (rep.id !== undefined) {
        this.routeback = rep.id
        if (rep.roleBack != undefined) {
          this.roleBack = rep.roleBack;
        }
        this.loadRowDetails(rep.id, rep.status);
        this.helper.changeMessageforId(rep.id);
      }
    });
    this.helper.listen().subscribe((m:any) => {
      this.loadRowDetails(m,"/documentapprovalstatus")
  });
  }

  ngOnInit() {
    //this.loadAll();
    this.loadAllStatusCount();
    this.ccf = this.fb.group({
      type: [],
      dept: ['', Validators.compose([
        Validators.required
      ])],
      dynamicFormFlag: [],
      name: [],
      description: ['', Validators.compose([
        Validators.required
      ])],
      priority: ['', Validators.compose([
        Validators.required
      ])],
      users: ['', Validators.compose([
        Validators.required
      ])],
      reason: ['', Validators.compose([
        Validators.required
      ])],
      impactassessment: [],
      assessment: [],
      regulatorynotificationFlag: [],
      status: [],
      formId:[],
      dynamicFormName:[],
    });

    this.isSave = true;
    this.configService.loadCurrentUserDetails().subscribe(res => {
      this.currentUser = res;
    //this.loadUsers();
  });
    this.loadCCFStatus();
    this.loadCCFType();
    this.loadDept();
    this.loadPriority();
    this.loadForms();
    this.comp.setUpModuleForHelpContent("191");
    this.comp.taskDocType = "191";
    this.comp.taskDocTypeUniqueId = "";
    this.comp.taskEquipmentId = 0;
    this.comp.taskEnbleFlag = true;
    this.configService.loadPermissionsBasedOnModule("191").subscribe(resp=>{
      this.permisionModal=resp
    });

    this.laodJsonStrucutre();
  }

  loadCCFStatus(){
     this.service.loadCCFStatus("CCFStatus","ccf/getCCFStatus").subscribe(resp =>{
          this.ccfStatus = resp;
    });
  }
  publishData(){
    this.spinnerFlag = true;
    this.service.saveData(this.data,"ccf/publish").subscribe(result=>{
      this.spinnerFlag = false;
      this.isSelectedPublishData=false;
      this.loadAll();
    });
    
}
loadStatuWiseData(statusName:any){
  this.spinnerFlag = true;
  this.service.loadData(statusName,"ccf/loadStatusdata").subscribe(result =>{
    this.spinnerFlag = false;
    this.tableView = true;
    this.data = result.draft;
    this.completed = result.completed;
    this.published = result.publish;
  });
}
  loadAll(){
    this.spinnerFlag = true;
    this.iscreate = false;
    this.service.loadData("","ccf/loadAll").subscribe(result =>{
      this.spinnerFlag = false;
          this.data = result.draft;
          this.completed = result.completed;
          this.published = result.publish;
    });
    //this.loadAllStatusCount();
  }
  loadAllStatusCount(){
    this.spinnerFlag = true;
    this.service.loadData("","ccf/statusCount").subscribe(result =>{
      this.statusCountList = result.result;
      this.spinnerFlag = false;
    });
  }
  onCloseCCFPopup(){
    this.loadAll();
    this.loadAllStatusCount();
  }
  onCloseUrsPopup(){
    this.modal.selectedUsers=this.users.filter(data =>data.selected).map(a => a.id);
    this.ccf.get("users").setValue(this.modal.selectedUsers)
  }
  onChangeUsers(event){
    this.onChangeDept();
    this.modal.selectedUsers = event;
    this.users.forEach(element =>{element.selected=false;});
    this.modal.selectedUsers.forEach(data =>{
      this.users.forEach(element =>{
        if(element.id===data)
            element.selected=true;
      });
    });
  }
  loadCCFType(){
    this.service.loadCCFStatus("CCFTypes","ccf/getCCFTypes").subscribe(resp =>{
            this.ccfType = resp;
    });
  }
  loadUsers() {
    this.projectsetupService.loadUsersByProject(this.currentUser.projectId).subscribe(resp => {
      if (resp.list != null) {
        this.users= resp.list;
        this.usersList = resp.list.map(option => ({ value: option.id, label: option.userName }));
        //this.ccf.get("users").setValue(this.currentUser.id.toString());
      }
    });
  }
  loadDept(){
    this.departService.loadDepartment().subscribe(resp =>{
      this.simpleOptionDepartment = this.helper.cloneOptions(resp.result);
    });
  }
  loadPriority(){
    this.service.loadData("","ccf/getPriority").subscribe(result =>{
        this.priorityList = result;
        this.ccf.get("status").setValue("Open");
    });
  }
  onTabChange() {

  }
  onChangeLog() {
    this.ccfDynamicFormData = [];
    if (!this.helper.isEmpty(this.selectedForm)) {
      this.spinnerFlag = true;
     let infoList= this.selectedForms.filter(option => option.key == this.selectedForm);
      if(infoList.length!=0){
        this.spinnerFlag = false;
      let info=  infoList[0];
      let requestData = { "masterDynamicFormIdOrMappingId":info.mappingId, "ccfId": this.selectedRow.id,"isMapping":info.mappingFlag };
      this.service.loadAllCCFFormData(requestData).subscribe(response => {
        this.spinnerFlag = false;
        this.publishedMandatoryFeildJson = {
          rows: new Array(),
          columns: new Array()
        }
        response.result.forEach((element, index) => {
          element.formData = JSON.parse(element.formData);
          this.createDyanamicColumn(element.formData, index, this.publishedMandatoryFeildJson);
          this.ccfDynamicFormData.push(element)
        });
      }, error => { this.spinnerFlag = false });
    }
    }
  }
  createDyanamicColumn(formData: any[], index, mandatoryFeildJson) {
    let column = new Array();
    let row = new Array();
    formData.forEach(json => {
      if (json.required && (json.type == 'select' || json.type == 'time' || json.type == 'date' || json.type == 'number' || json.type == 'text' || json.type == 'datetime-local')) {
        if (index == 0) {
          column.push(json.label);
        }
        let value = json.value;
        if (json.type === 'datetime-local')
          value = this.datePipe.transform(json.value, 'dd-MM-yyyy HH:mm ');

        if (json.type === 'date')
          value = this.datePipe.transform(json.value, 'dd-MM-yyyy');

        if (json.type == 'select') {
          json.values.forEach(element => {
            if (element.value == json.value)
              value = element.label;
          });
        }
        row.push(value);
      }
    });
    if (index == 0)
      mandatoryFeildJson.columns = column;
    mandatoryFeildJson.rows.push(row)
  }
  navigate() {
    const form = this.selectedForms.filter(option => option.key == this.selectedForm);
    if (form.length != 0) {
      form.forEach(element => {
        var queryParams = {
          exists: false,
          id: element.mappingId,
          redirectUrl: location.href.replace(location.origin, "") + '?isLog:true&id:' + this.selectedRow.id + '&formId:' + element.mappingId,
          isMapping: element.mappingFlag,
          ccfId: this.selectedRow.id,
        }
        this.router.navigate(['dynamicForm/' + this.selectedForm], { queryParams: queryParams, skipLocationChange: true })
      });
    }
  }
  cancelLogEntry() {
    this.isLogEntry = false;
    this.router.navigateByUrl(this.router.createUrlTree(['ccf']))
  }
  onChangeCompleteFlag(data:any){
    this.spinnerFlag = true;
    let timerInterval;
   this.service.saveData(data,"ccf/complatedFlag").subscribe(result =>{
     if(result.result ==='success' ){
       this.spinnerFlag = false;
       swal({
        title:'Status!',
        text:'Status changed successfully',
        type:'success',
        timer:this.helper.swalTimer,
        showConfirmButton:false,
        onClose: () => {
          clearInterval(timerInterval);
          this.loadAll();
        }
      });

     }
   });
  }

  loadForms(){
    this.masterDynamicFormService.loadFormOrMappedFormBasedOnProject(true).subscribe(result => {
      this.ccf.get("formId").setValue("");
      if (result != null){
        this.formList = result.map(option => ({ value: option.key, label: option.value, mappingFlag: option.mappingFlag, mappingId: option.mappingId }));
      }
    });
  }
  onClickCancel(){
  this.iscreate = false;
  }
  onClickCreate(){
    this.isSave = true;
    this.iscreate = true;
    this.isUpdate = false;
    this.submitted = false;
    this.ccf.reset();
    this.modal.id = 0;
    this.ccf.get("status").setValue("Open");
  }
  editTask(dto:ChangeControlForm){
    this.iscreate = true;
    this.isUpdate = true;
    this.isSave = false;
    this.modal.id = dto.id;
    this.ccfCode= dto.ccfCode;
    this.ccf.get("dept").setValue(dto.selectedDept);
    this.ccf.get("type").setValue(dto.cfftype);
    this.ccf.get("name").setValue(dto.name);
    this.onChangeDept();
    this.ccf.get("description").setValue(dto.description);
    this.ccf.get("priority").setValue(dto.selectPriorityId);
    this.ccf.get("reason").setValue(dto.reason);
    this.ccf.get("impactassessment").setValue(dto.impactassessment);
    this.ccf.get("assessment").setValue(dto.assessment);
    this.ccf.get("regulatorynotificationFlag").setValue(dto.regulatorynotificationFlag);
    this.ccf.get("status").setValue(dto.status);
    this.dynamicForm = dto.dynamicFormFlag;
    this.ccf.get("dynamicFormFlag").setValue(dto.dynamicFormFlag);
    this.ccf.get("formId").setValue(dto.dynamicFormsList.map(d=>d.key));
    if(!dto.dynamicFormFlag && dto.jsonExtraData!=null&&dto.jsonExtraData!='[]'){
      this.inputField=JSON.parse(dto.jsonExtraData);
    }else{
      this.laodJsonStrucutre();
    }
    this.ccf.get("users").setValue(dto.editSelectedUsers);
  }
  logEntry(row) {
    this.selectedRow = row;
    this.selectedForm = "";
    this.selectedForms = row.dynamicFormsList;
    this.isLogEntry = true;
  }
  onClickSave(){
    this.spinnerFlag = true;
    this.submitted=true;
    let timerInterval;
    if(this.ccf.valid) {
    this.populateModal();
     this.service.saveData(this.modal,"ccf/saveccfData").subscribe(resp =>{
         if(resp.result === 'success'){
           this.spinnerFlag = false;
           this.ccf.reset();
          swal({
            title:'Saved!',
            text:'CCF Saved Successfully',
            type:'success',
            timer:this.helper.swalTimer,
            showConfirmButton:false,
            onClose: () => {
              this.iscreate = false;
              clearInterval(timerInterval);
              this.loadAll();
              this.loadAllStatusCount();
            }
          });
         }else{
          this.spinnerFlag = false;
          swal({
            title:'',
            text:'Something went Wrong ...Try Again',
            type:'error',
            timer:this.helper.swalTimer,
            showConfirmButton:false
          });
          this.iscreate = false;
          this.loadAll();
          this.loadAllStatusCount();
         }
     },err => {
      this.spinnerFlag = false;
      swal({
        title:'error',
        text:'Something went Wrong ...Try Again',
        type:'error',
        timer:this.helper.swalTimer,
        showConfirmButton:false,
        onClose: () => {
          this.iscreate = false;
          clearInterval(timerInterval);
          this.loadAll();
          this.loadAllStatusCount();
        }
      })
    });
    }else{
      this.spinnerFlag = false;
    }

  }

  populateModal() {
    let selectedDeptIds: any[] = new Array();
    this.modal.loginUserId = this.currentUser.id;
    this.modal.globalProjectId = this.currentUser.projectId;
    this.modal.projectVersionId = this.currentUser.versionId;
    selectedDeptIds = this.ccf.get("dept").value;
    this.modal.selectedDept = selectedDeptIds;
    this.modal.cfftype = this.ccf.get("type").value;
    this.modal.name = this.ccf.get("name").value;
    this.modal.selectedUsers = this.ccf.get("users").value;
    this.modal.description = this.ccf.get("description").value;
    this.modal.selectPriorityId = this.ccf.get("priority").value;
    this.modal.reason = this.ccf.get("reason").value;
    this.modal.impactassessment = this.ccf.get("impactassessment").value;
    this.modal.assessment = this.ccf.get("assessment").value;
    this.modal.status = this.ccf.get("status").value;
    this.modal.regulatorynotificationFlag = this.ccf.get("regulatorynotificationFlag").value;
    this.modal.ccfCode = this.ccfCode;
    if(this.dynamicForm){
      if (this.ccf.get("formId").value != "") {
        var listOfIds = this.ccf.get("formId").value;
        if(!this.helper.isEmpty(listOfIds)){
          this.formList.forEach(element => {
            if (listOfIds.includes(element.value)) {
              let json = { key: element.value, value: element.label, mappingId: element["mappingId"], mappingFlag: element["mappingFlag"] };
              this.modal.dynamicFormsList.push(json);
            }
          });
        }
      }
      let selectedFormId:any[] = new Array();
      selectedFormId = this.ccf.get("formId").value;
      this.modal.formId = selectedFormId;
    }else{
      this.modal.formId = new Array<String>();
    }
    this.modal.jsonExtraData=JSON.stringify(this.inputField);
  }
  onChangeRemainderFlag(event: any){
    this.modal.regulatorynotificationFlag = event;
  }

  laodJsonStrucutre(){
    this.masterControlService.loadJsonOfDocumentIfActive(this.helper.CHANGE_CONTROL).subscribe(res=>{
      if(res!=null){this.inputField=JSON.parse(res.jsonStructure);}
        
      });
  }

  
  onChangeDynamicFlag(event: any) {
    if(event == false){
      this.formList = [];
      this.loadForms();
    }
      this.dynamicForm = event;
      this.modal.regulatorynotificationFlag = event;
  }
  trackByFn(index, item) {    
    return item.id; // unique id corresponding to the item
 }
 openSuccessCancelSwal(dataObj, id) {
  swal({
    title:"Write your comments here:",
    input: 'textarea',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Delete',
    showLoaderOnConfirm: true,
    allowOutsideClick: false,
  })
  .then((value) => {
    if(value){
      dataObj.userRemarks="Comments : " + value;
      this.deleteLocation(dataObj);
    }else{
      swal({
        title: '',
        text: 'Comments is requried',
        type: 'info',
        timer: this.helper.swalTimer,
        showConfirmButton: false,
      });
    }
  });
}

deleteLocation(dataObj): string {
  let status = '';
  let ccf = new ChangeControlForm();
  ccf.id = dataObj.id;
  ccf.userRemarks = dataObj.userRemarks;
  this.service.saveData(ccf,"ccf/delete")
    .subscribe((response) => {
      let responseMsg: string = response.result;
      let timerInterval;
      if (responseMsg === "success") {
        swal({
          title: 'Deleted!',
          text: '',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false,

          onClose: () => {
            this.loadAll();
            clearInterval(timerInterval)
          }
        });
      } else {
        status = "failure";
        swal({
          title: 'Not Deleted!',
          text: '',
          type: 'error',
          timer: this.helper.swalTimer,
        });
      }
    }, (err) => {
      status = "failure";
      swal({
        title: 'Not Deleted!',
        text: "",
        type: 'error',
        timer: this.helper.swalTimer,
      }

      );
    });
  return status;
}
loadRowDetails(id:any,status?){
  if(status!=undefined){
    this.commonDocumentStatusValue=status;
    this.redirctUrlFormCCFView = status;
  }
  this.service.loadData(id,"ccf/loadById").subscribe(result =>{
       this.viewData = result.result;
    this.workflowfunction(this.viewData);
    this.stepperfunction(this.viewData);
    if(!this.viewData.dynamicFormFlag && this.viewData.jsonExtraData!=null&&this.viewData.jsonExtraData!='[]'){
      this.inputField=JSON.parse(this.viewData.jsonExtraData);
    }
    this.viewIndividualData = true;

  });
}
viewRowDetails(row:any,status?) {
    this.viewData = row;
    if(status!=undefined)
  this.commonDocumentStatusValue=status;
  this.workflowfunction(this.viewData);
  this.stepperfunction(this.viewData);
  if(!this.viewData.dynamicFormFlag && this.viewData.jsonExtraData!=null&&this.viewData.jsonExtraData!='[]'){
    this.inputField=JSON.parse(this.viewData.jsonExtraData);
  }
  this.viewIndividualData = true;

}
workflowfunction(jsonResp: any) {
  if ( jsonResp.publishedflag) {
    const workflowmodal: WorkflowDocumentStatusDTO = new WorkflowDocumentStatusDTO();
      workflowmodal.documentType = this.helper.CHANGE_CONTROL;
      workflowmodal.documentId = jsonResp.id;
      //workflowmodal.currentLevel = jsonResp.result.currentCommonLevel;
      workflowmodal.documentCode = jsonResp.ccfCode;
      //workflowmodal.workflowAccess = jsonResp.result.workflowAccess;
      workflowmodal.docName = 'Change Control Form';
      workflowmodal.publishFlag = jsonResp.publishedflag;
      this.helper.setIndividulaWorkflowData(workflowmodal);
      }
}
stepperfunction(jsonResp: any) {
  const stepperModule: StepperClass = new StepperClass();
   stepperModule.constantName = this.helper.CHANGE_CONTROL;
    stepperModule.code = jsonResp.ccfCode;
   stepperModule.documentIdentity = jsonResp.id;
   stepperModule.publishedFlag = jsonResp.publishedflag;
   stepperModule.creatorId = jsonResp.creatorId;
   stepperModule.lastupdatedTime= jsonResp.updatedDate;   
   stepperModule.displayCreatedTime= jsonResp.displayCreatedTime;
   stepperModule.displayUpdatedTime= jsonResp.displayUpdatedTime;
   stepperModule.documentTitle= jsonResp.name;
   stepperModule.createdBy= jsonResp.createdBy;
   stepperModule.updatedBy= jsonResp.updatedBy;
   this.helper.stepperchange(stepperModule);
}
changeview(value) {
  this.tableView = value;
  if(this.tableView){
    this.loadAll();
  }else{
    this.loadAllStatusCount();
  }
}
documentPreview(){
  this.spinnerFlag = true;
  this.populateModal();
  this.service.loadPreviewDocument(this.modal,"ccf/previewCCFDocument").subscribe(resp=>{
    this.comp.previewByBlob("CCFpreview.pdf",resp,true,"Change Control Form");
    this.spinnerFlag = false;
  })
  
}

downloadPdf(data:any){
  this.modal = data;
  this.spinnerFlag = true;
   this.service.loadPreviewDocument(this.modal,"ccf/downloadCCFDocument").subscribe(resp=>{
    this.comp.previewByBlob(this.modal.ccfCode+".pdf",resp,false,"Change Control Form");
    this.spinnerFlag = false;
  },(err) =>{
     this.spinnerFlag = false;
     swal({
      title: 'Oops, something went wrong',
      text: '',
      type: 'error',
      timer: this.helper.swalTimer,
    });
  });

}
loadDataById(ccfId:any){
  this.service.loadData(ccfId,"ccf/loadById").subscribe(resp =>{
      this.viewData = resp.result;
      if(!this.viewData.dynamicFormFlag && this.viewData.jsonExtraData!=null&&this.viewData.jsonExtraData!='[]'){
        this.inputField=JSON.parse(this.viewData.jsonExtraData);
      }
      this.viewIndividualData = true;
  });
}

onChangeDept(){
  let selectedDeptIds: any[] = new Array();
  selectedDeptIds =this.ccf.get("dept").value;
  if(null != selectedDeptIds){
  this.userService.loadAllUserBasedOnDepartment(selectedDeptIds).subscribe(result =>{
    this.users= result.result;
        this.usersList = result.result.map(option => ({ value: option.key, label: option.value }));
  })
}
}
onChangePublishData(){
  for(let data of this.data){
    if(data.publishedflag){
      this.isSelectedPublishData=true;
      break;
    }else{
      this.isSelectedPublishData=false;
    }
  }
}
  individualPermissions(typeId: any) {
    if (this.permissionData == undefined || this.permissionData == null) {
      return false;
    } else {
      for (var i = 0; i < this.permissionData.length; i++) {
        if (this.permissionData[i].permissionValue == typeId) {
          if (this.permissionData[i].viewButtonFlag === true) {
            this.permisionModal.viewButtonFlag = true;
          }
          if (this.permissionData[i].deleteButtonFlag === true) {
            this.permisionModal.deleteButtonFlag = true;
          }
          if (this.permissionData[i].updateButtonFlag === true) {
            this.permisionModal.updateButtonFlag = true;
          }
          if (this.permissionData[i].createButtonFlag === true) {
            this.permisionModal.createButtonFlag = true;
          }

        }
      }
    }
  }

}
