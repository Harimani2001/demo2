import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ApiConfigurationDTO, dropDownDto,APIParametersDTO,APICheckListDTO } from '../../models/model';
import { ApiConfigurationErrorTypes } from '../../shared/constants';
import { Helper } from '../../shared/helper';
import { AdminComponent } from '../../layout/admin/admin.component';
import { ConfigService } from '../../shared/config.service';
import { ApiConfigurationService } from './api-configuration.service';
import { Permissions } from './../../shared/config';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import swal from 'sweetalert2';
import { ToastyService, ToastData, ToastOptions } from 'ng2-toasty';
import { Router } from '@angular/router';
import { LookUpService } from '../LookUpCategory/lookup.service';
@Component({
  selector: 'app-api-configuration',
  templateUrl: './api-configuration.component.html',
  styleUrls: ['./api-configuration.component.css',
   '../../../../node_modules/sweetalert2/dist/sweetalert2.min.css',
  '../../../../node_modules/ng2-toasty/style-bootstrap.css',
  '../../../../node_modules/ng2-toasty/style-default.css',
  '../../../../node_modules/ng2-toasty/style-material.css'],
 encapsulation: ViewEncapsulation.None
})
export class ApiConfigurationComponent implements OnInit {

  @ViewChild('APIGetDataModal') apiGetDataModal: any;
  @ViewChild('myTable') table: any;
  public onAPIForm: FormGroup;
  data: any;
  modal: ApiConfigurationDTO = new ApiConfigurationDTO();
  public rowsOnPage = 10;
  public filterQuery = '';
  spinnerFlag = false;
  iscreate: boolean = false;
  isUpdate: boolean = false;
  isSave: boolean = false;
  projectsList: any[] = new Array();
  public documentList: dropDownDto[] = new Array<dropDownDto>();
  permissionModal: Permissions = new Permissions('195', false);
  isParameterListEntered:boolean=false;
  submitted:boolean = true;
  list:any[]=new Array();
  customKeyList:any[]=new Array();
  position = 'bottom-right';
  isSubmitted:boolean=false;
  frequencyList:any[]=new Array();
  datatypesList:any[]=new Array();
  calculationMethodsList:any[]=new Array();
  constantsList:any[]=new Array();
  isTestConnection:boolean=false;
  formDataList:any[]=new Array();
  isCheckListEntered:boolean=false;
  isRawDataFile:boolean=false;
  constructor(public router: Router,public permissionService: ConfigService, private comp: AdminComponent, public fb: FormBuilder, public service: ApiConfigurationService,
    public helper: Helper, public apiConfigurationErrorTypes: ApiConfigurationErrorTypes, public projectsetupService: projectsetupService,private toastyService: ToastyService,private lookUpService:LookUpService) { }

  ngOnInit() {
    this.comp.setUpModuleForHelpContent("196");
    this.comp.taskDocType = "196";
    this.comp.taskDocTypeUniqueId = "";
    this.comp.taskEquipmentId = 0;
    this.loadProjectsAndDocuments();
    this.loadAll();
    this.onAPIForm = this.fb.group({
      endpointUrl: ['', Validators.compose([
        Validators.required
      ])],
      apiKey: [],
      projectId: ['', Validators.compose([
        Validators.required
      ])],
      documentType: ['', Validators.compose([
        Validators.required
      ])],
      userName: [],
      password: [],
      frequency: [],
      rawDataFileType: [],
      active: ['', Validators.compose([
        Validators.required
      ])],
      backgroundJob: ['', Validators.compose([
        Validators.required
      ])],
    });
    this.permissionService.loadPermissionsBasedOnModule("196").subscribe(resp => {
      this.permissionModal = resp
    });
    this.lookUpService.getlookUpItemsBasedOnCategory("APIConfigFrequency").subscribe(res => {
      this.frequencyList = res.response;
    });
    this.lookUpService.getlookUpItemsBasedOnCategory("APIConfigDataTypes").subscribe(res => {
      this.datatypesList = res.response;
    });
  }
  loadProjectsAndDocuments() {
    this.permissionService.loadprojectOfUserAndCreator().subscribe(response => {
      this.projectsList = response.projectList;
    },
    );
  }
  onClickCreate() {
    this.isTestConnection=false;
    this.isSubmitted=false;
    this.isSave = true;
    this.iscreate = true;
    this.isUpdate = false;
    this.onAPIForm.reset();
    this.modal.id = 0;
    this.onAPIForm.get("active").setValue(true);
    this.onAPIForm.get("projectId").setValue("");
    this.onAPIForm.get("documentType").setValue("");
    this.onAPIForm.get("frequency").setValue("OnDemand");
    this.onAPIForm.get("rawDataFileType").setValue("");
    this.modal=new ApiConfigurationDTO();
    this.formDataList=new Array();
  }
  onClickCancel() {
    this.iscreate = false;
    this.modal=new ApiConfigurationDTO();
  }

  onClickSave() {
    let timerInterval
    this.isParameterListEntered=false;
    this.modal.parameters.forEach(parameter =>{
      if(this.helper.isEmpty(parameter.paramaterName) ||this.helper.isEmpty(parameter.dataType))
      this.isParameterListEntered=true;
    });
    if (this.onAPIForm.valid && !this.isParameterListEntered) {
      this.isSubmitted=true;
      this.spinnerFlag = true;
      this.populateDTO();
      this.modal.mappingId = this.documentList.filter(d => d.key == this.modal.documentType)[0].mappingId;
      this.modal.mappingFormData=this.formDataList;
      this.modal.mappingFormData.forEach(element => {
        element.form = JSON.stringify(element.form);
      });
      this.service.saveApiConfiguration(this.modal).subscribe(jsonResp => {
        this.spinnerFlag = false;
        if (jsonResp) {
          this.loadAll();
          this.iscreate = false;
          this.spinnerFlag = false
          let mes = 'API Configuration is Added';
          if (this.isUpdate) {
            mes = "API Configuration is updated"
          }
          swal({
            title: '',
            text: mes,
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
            
              clearInterval(timerInterval)
            }
          });
        } else {
          swal({
            title: '',
            text: 'Something went Wrong ...Try Again',
            type: 'error',
            timer: this.helper.swalTimer
          }
          )
        }
      },
        err => {
          this.spinnerFlag = false
        }
      );
    } else {
      Object.keys(this.onAPIForm.controls).forEach(field => {
        const control = this.onAPIForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
  populateDTO(){
    this.modal.projectId = this.onAPIForm.get("projectId").value;
    this.modal.documentType = this.onAPIForm.get("documentType").value;
    this.modal.endpointUrl = this.onAPIForm.get("endpointUrl").value;
    this.modal.apiKey = this.onAPIForm.get("apiKey").value;
    this.modal.userName = this.onAPIForm.get("userName").value;
    this.modal.password = this.onAPIForm.get("password").value;
    this.modal.frequency = this.onAPIForm.get("frequency").value;
    this.modal.rawDataFileType = this.onAPIForm.get("rawDataFileType").value;
    this.modal.active = this.onAPIForm.get("active").value;
    this.modal.backgroundJob = this.onAPIForm.get("backgroundJob").value;
  }
  loadAll() {
    this.spinnerFlag = true;
    this.service.loadAll().subscribe(response => {
      this.spinnerFlag = false
      this.data = response
    }, error => { this.spinnerFlag = false });
  }
  deleteAPIConfiguration(dataObj): string {
    let timerInterval;
    let status = '';
    this.spinnerFlag = true
    let apiConfigurationDTO = new ApiConfigurationDTO();
    apiConfigurationDTO.id = dataObj.id;
    this.service.deleteById(apiConfigurationDTO)
      .subscribe((response) => {
        this.spinnerFlag = false
        if (response) {
          swal({
            title: 'Deleted!',
            text: 'Api Configuration' + dataObj.name + '  has been deleted.',
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
            text: 'Api Configuration ' + dataObj.name + '  has not been deleted.',
            type: 'error',
            timer: this.helper.swalTimer
          }
          );
        }
      }, (err) => {
        status = "failure";
        swal({
          title: 'Not Deleted!',
          text: dataObj.name + 'is not deleted...Something went wrong',
          type: 'error',
          timer: this.helper.swalTimer
        }
        );
      });
    return status;
  }
  editApiConfiguration(data: ApiConfigurationDTO) {
    this.isTestConnection=false;
    this.isSubmitted=false;
    this.iscreate = true;
    this.isSave = false;
    this.isUpdate = true;
    this.modal = data;
    this.formDataList=new Array();
    this.onAPIForm.get("projectId").setValue(data.projectId);
    this.onAPIForm.get("documentType").setValue(data.documentType);
    this.onAPIForm.get("endpointUrl").setValue(data.endpointUrl);
    this.onAPIForm.get("apiKey").setValue(data.apiKey);
    this.onAPIForm.get("userName").setValue(data.userName);
    this.onAPIForm.get("password").setValue(data.password);
    this.onAPIForm.get("frequency").setValue(data.frequency);
    this.onAPIForm.get("rawDataFileType").setValue(data.rawDataFileType);
    this.onAPIForm.get("active").setValue(data.active);
    this.onAPIForm.get("backgroundJob").setValue(data.backgroundJob);
    this.loadForms(data.projectId,data.documentType);
    this.onChangeRawDataFileType(data.rawDataFileType);
  }
  openSuccessCancelSwal(dataObj) {
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
        this.deleteAPIConfiguration(dataObj);
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
  onChangeDocument(event){
    if(!this.helper.isEmpty(event) && !this.helper.isEmpty(this.modal.projectId)){
      this.modal.documentType=event;
      let mappingId = this.documentList.filter(d => d.key == event)[0].mappingId;
      this.loadFormJsonData(this.modal.projectId,event,mappingId);
      this.onChangeProjectAndDocument();
    }
  }
  loadFormJsonData(projectId:any,documentType:any, mappingId:any){
    this.spinnerFlag = true;
    this.service.loadFormJsonData(projectId,documentType,mappingId).subscribe(resp => {
      this.spinnerFlag = false;
      this.formDataList=resp;
      this.formDataList.forEach(element => {
        element.form = JSON.parse(element.form);
      });
      this.isSubmitted=false;
    });
  }
  onChangeProject(event){
    this.onAPIForm.get("documentType").setValue("");
    this.loadForms(event,null);
    this.modal.projectId=event;
    this.onChangeProjectAndDocument();
   }
   loadForms(projectId,documentType){
    this.spinnerFlag = true;
    this.service.loadAllForms(projectId).subscribe(resp => {
      this.documentList = resp;
      this.spinnerFlag = false;
      if(!this.helper.isEmpty(documentType)){
        let mappingId = this.documentList.filter(d => d.key == documentType)[0].mappingId;
        this.loadFormJsonData(projectId,documentType,mappingId);
      }
    });
   }
   onChangeProjectAndDocument(){
    if(!this.helper.isEmpty(this.modal.documentType) && !this.helper.isEmpty(this.modal.projectId)){
      this.spinnerFlag = true;
      this.service.loadByProjectAndDocument(this.modal.projectId,this.modal.documentType).subscribe(response => {
        this.spinnerFlag = false;
       if(!this.helper.isEmpty(response.result)){
        this.isUpdate = true;
        this.isSave = false;
        this.modal = response.result;
        this.onAPIForm.get("endpointUrl").setValue(this.modal.endpointUrl);
        this.onAPIForm.get("apiKey").setValue(this.modal.apiKey);
        this.onAPIForm.get("userName").setValue(this.modal.userName);
        this.onAPIForm.get("password").setValue(this.modal.password);
        this.onAPIForm.get("frequency").setValue(this.modal.frequency);
        this.onAPIForm.get("rawDataFileType").setValue(this.modal.rawDataFileType);
        this.onAPIForm.get("active").setValue(this.modal.active);
        this.onAPIForm.get("backgroundJob").setValue(this.modal.backgroundJob);
       }else{
        this.modal.id=0
        this.onAPIForm.get("endpointUrl").setValue("");
        this.onAPIForm.get("apiKey").setValue("");
        this.onAPIForm.get("userName").setValue("");
        this.onAPIForm.get("password").setValue("");
       }
      }, error => { this.spinnerFlag = false });
    }
   }
   addParameter(){
    this.isParameterListEntered=false;
    this.modal.parameters.forEach(parameter =>{
      if(this.helper.isEmpty(parameter.paramaterName) ||this.helper.isEmpty(parameter.dataType))
      this.isParameterListEntered=true;
    });
    if(!this.isParameterListEntered){
      let data=new APIParametersDTO();
      data.id=0;
      data.paramaterName="";
      data.dataType="";
      this.modal.parameters.push(data);
    }
  }
  addChecklistItem(){
    this.isCheckListEntered=false;
    this.modal.rawDataColumns.forEach(checkList =>{
      if(this.helper.isEmpty(checkList.name) ||this.helper.isEmpty(checkList.name) ||this.helper.isEmpty(checkList.displayOrder))
      this.isCheckListEntered=true;
    });
    if(!this.isCheckListEntered){
      let data=new APICheckListDTO();
      data.name="";
      data.form="";
      data.displayOrder=this.modal.rawDataColumns.length+1;
      this.modal.rawDataColumns.push(data);
    }
  }
  deleteCheckList(data){
    this.modal.rawDataColumns = this.modal.rawDataColumns.filter(event => event !== data);
  }
  deleteParameter(data){
    this.modal.parameters = this.modal.parameters.filter(event => event !== data);
  }
  getData(){
    this.submitted = false;
    if(this.modal.parameters.length > 0){
      this.isParameterListEntered=false;
      this.modal.parameters.forEach(parameter =>{
        if(this.helper.isEmpty(parameter.paramaterName) ||this.helper.isEmpty(parameter.dataType))
          this.isParameterListEntered=true;
      });
      if(!this.isParameterListEntered)
        this.apiGetDataModal.show();
    }else{
      this.getApiData();
    }
  }
  testConnection(data: ApiConfigurationDTO) {
    this.submitted = false;
    this.modal=data;
    this.isTestConnection=true;
    if(data.parameters.length > 0){
      this.apiGetDataModal.show();
    }else{
      this.modal.testAPIAuditRequired=true;
      this.getApiData();
    }
  }
  getparametersData(form: NgForm){
    this.submitted = true;
    if (!form.valid ) {
      return
    }else{
      this.apiGetDataModal.hide();
      if(this.isTestConnection){
        this.modal.testAPIAuditRequired=true;
        this.getApiTestConnection();
      }else{
        this.getApiData();
      }
      form.resetForm();
    }
  }
  resetParameterForm(form: NgForm){
    form.resetForm();
  }
  getApiData(){
    this.spinnerFlag = true;
    this.populateDTO();
    let apiConfigurationDTO = new ApiConfigurationDTO();
    apiConfigurationDTO.id = this.modal.id;
    apiConfigurationDTO.projectId=  this.modal.projectId;
    apiConfigurationDTO.documentType= this.modal.documentType;
    apiConfigurationDTO.endpointUrl=this.modal.endpointUrl;
    apiConfigurationDTO.apiKey=this.modal.apiKey;
    apiConfigurationDTO.userName=this.modal.userName;
    apiConfigurationDTO.password=this.modal.password;
    apiConfigurationDTO.parameters=this.modal.parameters;
    this.service.getAPIData(apiConfigurationDTO).subscribe(resp => {
      this.spinnerFlag = false;
      if(resp.successFlag){
        this.list=resp.result;
        this.customKeyList=resp.customKeys;
        if(this.isTestConnection){
          swal(
            'API Success',
            'API Success',
            'success'
          ).then(responseMsg => {
           
          }); 
        }
      }else{
        swal(
          'API Error',
          resp.message+', Please Contact Administrator',
          'error'
        ).then(responseMsg => {
         
        });
      }
    });
  }
  getApiTestConnection(){
    this.spinnerFlag = true;
    this.service.getAPIData(this.modal).subscribe(resp => {
      this.spinnerFlag = false;
      if(resp.successFlag){
        if(this.isTestConnection){
          swal(
            'API Success',
            'API Success',
            'success'
          ).then(responseMsg => {
          }); 
        }
      }else{
        swal(
          'API Error',
          resp.message+', Please Contact Administrator',
          'error'
        ).then(responseMsg => {
        });
      }
    });
  }
  copyInputMessage(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.addToast({title:val+ ' copied to clipboard!', timeout: 3000, theme:'bootstrap', position:'bottom-right', type:'success'})
  }
  addToast(options) {
    if (options.closeOther) {
      this.toastyService.clearAll();
    }
    this.position = options.position ? options.position : this.position;
    const toastOptions: ToastOptions = {
      title: options.title,
      msg: options.msg,
      showClose: options.showClose,
      timeout: options.timeout,
      theme: options.theme,
      onAdd: (toast: ToastData) => {
        /* added */
      },
      onRemove: (toast: ToastData) => {
        /* removed */
      }
    };

    switch (options.type) {
      case 'default': this.toastyService.default(toastOptions); break;
      case 'info': this.toastyService.info(toastOptions); break;
      case 'success': this.toastyService.success(toastOptions); break;
      case 'wait': this.toastyService.wait(toastOptions); break;
      case 'error': this.toastyService.error(toastOptions); break;
      case 'warning': this.toastyService.warning(toastOptions); break;
    }
  }
  onChangeRawDataFileType(event){
    this.isRawDataFile=false;
    if(!this.helper.isEmpty(event))
      this.isRawDataFile=true;
    else
      this.modal.rawDataColumns=[];
  }
}
