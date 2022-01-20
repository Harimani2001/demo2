import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMyDpOptions, MyDatePicker } from 'mydatepicker/dist';
import { IOption } from 'ng-select';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { DynamicFormDTO } from '../../models/model';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { AuditTrailViewComponent } from '../audit-trail-view/audit-trail-view.component';
import { DocumentStatusCommentLogComponent } from '../document-status-comment-log/document-status-comment-log.component';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { FormEsignVerificationComponent } from '../form-esign-verification/form-esign-verification.component';
import { WorkFlowDynamicFormService } from '../work-flow-dynamic-form/work-flow-dynamic-form.service';
import { StepperClass, User } from './../../models/model';
import { DashBoardService } from './../dashboard/dashboard.service';
import { DynamicFormViewService } from './dynamic-form-view.service';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { ExternalFormModalComponent } from '../external-form-modal/external-form-modal.component';

@Component({
  encapsulation:ViewEncapsulation.None,
  selector: 'app-dynamic-form-view',
  templateUrl: './dynamic-form-view.component.html',
  styleUrls: ['./dynamic-form-view.component.css','./../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
})
export class DynamicFormViewComponent implements OnInit,AfterViewInit{
  formName='';
  configOfCkEditior={
    removeButtons: 'Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,find,selection,spellchecker,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Bold,Italic,Underline,Strike,Subscript,Superscript,CopyFormatting,RemoveFormat,list,indent,blocks,align,bidi,NumberedList,BulletedList,Outdent,Indent,Blockquote,CreateDiv,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,Format,Font,FontSize,TextColor,BGColor,ShowBlocks,About',
    readOnly:true
  }
  @ViewChild('auditTrailFormGroup') auditTrail;
  @ViewChild('formTab') public tab:any;
  @ViewChild('documentcomments') documentcomments:DocumentStatusCommentLogComponent;
  @ViewChild('formDataListTab') tabSet:any;
  @ViewChild('formVerification') formVerification:FormEsignVerificationComponent;
  @ViewChild('auditView') auditView: AuditTrailViewComponent;
  @ViewChild('fromDateView') fromDateView:MyDatePicker;
  @ViewChild('toDateView') toDateView:MyDatePicker;
  @ViewChild('myTable') table: any;
  @ViewChild('externalFormModal') externalFormModal: ExternalFormModalComponent;
  
  csvExportFlag:boolean=false;
  selectAllCSVFlag:boolean =false;
  csvFullPermission:boolean =false;
  fromDate: any = {
    date:
      { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: 1 },
    jsdate: new Date(new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, 1).toString())
  };
  toDate: any = {
    date:
      { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()>30?new Date().getDate() :30 },
    jsdate: new Date(new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, 30).toString())
  };
  datePipeFormat='dd-MM-yyyy';
  public toDateOptions: IMyDpOptions = {
    dateFormat: this.datePipeFormat,
  };
  public fromDateOptions: IMyDpOptions = {
    dateFormat: this.datePipeFormat,
  };
  copyOfTable:any=new Array();
  pdfView=false;
  pdfURL:any;
  pdfName:string;
  equipmentFlag=false;
  modalSpinner = false;
  permissionModel: Permissions = new Permissions("",false);
  permissionMap:Object=new Map<string,Permissions>();
  publishButtonFlag=false;
  createButtonFlag=false;
  exportButtonFlag=false;
  workFlowFlag=false;
  inWorkFlowMessage="";
  public constants:any;
  public individualconstants :any;
  public individualId :any;
  public mappingId:any = 0;
  public masterDynamicFormId;
  public spinnerFlag = false;
  public rowsOnPage = 10;
  public sortBy = '';
  public sortOrder = 'desc';
  public filterQuery = '';
  public data: any[]=new Array();
  publishedData: any=new Array();
  dynamicForm=new DynamicFormDTO();
  viewIndividualData: boolean = false;
  public currentDocType:any;
  public currentDocStatus:any;
  public currentCreatedBy:any;
  public currentModifiedDate:any;
  commonDocumentStatusValue:any;
  public esignForm:any;
  popupdata = []=new Array<DynamicFormDTO>();
  statusLog:any=new Array();
  routeback:any;
  public list;
  public docSignselectList: Array<IOption> = new Array<IOption>();
  public modal: User = new User();
  public subscription;
  public currentId = null;
  isSelectedPublishData: boolean = false;
  selectAll:boolean=false;
  isMapping: boolean = false;
  tempDynamicForm=new DynamicFormDTO();
  public globalPublishFlag;
  nextId:any ="0";
  isWorkflowDocumentOrderSequence:string;
  viewpdf: boolean = false;
  draftIds:any[] = new Array();
  @ViewChild('forumView') forumView:any;
  commentsDocumentsList: any[] = new Array();
  forumFlag=true;
  outline: any[];
  pdf: any;
  error:any;
  height: any = "600px";
  heightOutline = '500px';
  public pageVariable:number = 1;
  rotation = 0;
  zoom = 1.1;
  originalSize = true;
  showAll = true;
  autoresize = true;
  fitToPage = false;
  isOutlineShown = true;
  pdfQuery = '';
  outLineList=new Array();
  formType:any;
  publishedToggle:boolean = false;
  queryMapping:any;
  
  constructor(public dashboardService: DashBoardService, public helper: Helper, public permissionService: ConfigService,
    public workFlowDynamicFormService: WorkFlowDynamicFormService, public router: Router,
    public adminComponent: AdminComponent, private activeRouter: ActivatedRoute,
    private service: DynamicFormViewService,
    public dynamicService: DynamicFormService) {
    }

  ngOnInit() {
      this.spinnerFlag = true;
      this.loadOrgDateFormatAndTime();
      this.activeRouter.queryParams.subscribe(query => {
        if (query.exists == "true") {
          this.routeback = query.id;
          this.isMapping = query.isMapping == "true" ? true : false;
          this.queryMapping =query.isMapping;
          if (this.isMapping) {
            this.mappingId = query.id;
          }
          const dto = new DynamicFormDTO();
          dto.id = query.id;
          dto.formMappingId = query.id;
          this.masterDynamicFormId = query.id;
          dto.isMapping = this.isMapping;
          dto.dynamicFormCode = query.documentCode;
          this.viewRowDetails(dto, query.status);
          this.helper.changeMessageforId(query.id);
        } else {
          this.masterDynamicFormId = query.id;
          this.loadData(this.masterDynamicFormId, query.isMapping);
        }
      });
      this.helper.listen().subscribe((m: any) => {
        this.dynamicService.getMinimalInfoBasedOnId(m).subscribe(resp=>{
          this.isMapping=resp.mapping;
          if(resp.mapping){
            this.masterDynamicFormId=resp.formMappingId;
          }else{
            this.masterDynamicFormId=resp.masterDynamicFormId;
          }
          this.viewRowDetails(resp, '/documentapprovalstatus' );
        });
      });
  }

  ngAfterViewInit(): void {
    this.spinnerFlag=true;
    setTimeout(()=>{
      this.permissionService.getUserPreference(this.helper.MASTER_DYNAMIC_FORM).subscribe(res =>{
        if (res.result)
          this.tab.activeId = res.result;
      });
      this.spinnerFlag=false;
    },600)
  }

  isCsvTemplateConfigExists(constant){
    this.permissionService.HTTPPostAPI(constant,'csvTemp/isCsvTemplateConfigExists').subscribe(resp=>{
      this.csvExportFlag=resp;
    })
  }

  saveCurrentTab(tabName){
    this.permissionService.saveUserPreference(this.helper.MASTER_DYNAMIC_FORM,tabName).subscribe(res =>{});
  }

  loadData(masterId,isMapping?){
    this.inWorkFlowMessage='';
    this.adminComponent.taskDocTypeUniqueId = "";
    this.adminComponent.taskEquipmentId = 0;
    this.selectAll = false;
    this.selectAllCSVFlag=false;
    if(isMapping)
    this.isMapping=isMapping=="true"?true:false;
    this.viewIndividualData = false;
    
    this.service.loadAllDataForProject({ "masterDynamicFormId":masterId,isMapping:isMapping }).subscribe(response => {
      if (response != null) {
        this.formName=response.name;
        this.formType=response.formType;
        this.equipmentFlag=response.equipmentFlag;
        this.data=response.unpublishedList;
        this.draftIds = this.data.map(m=>m.id);
        this.publishedData=response.publishedList;
        this.permissionMap=response.permissionMap;
        let inWorkFlowFlag=false;
        this.csvFullPermission=true;
        Object.keys(this.permissionMap).forEach((key:string)=>{
          if(!this.createButtonFlag){
            this.createButtonFlag=this.permissionMap[key].createButtonFlag;
          }
          if(!this.exportButtonFlag){
            this.exportButtonFlag=this.permissionMap[key].exportButtonFlag;
          }
          // if(!inWorkFlowFlag){
          //   inWorkFlowFlag=this.permissionMap[key].userInWorkFlow;
          // }
          if(!this.publishButtonFlag){
            this.publishButtonFlag=this.permissionMap[key].publishButtonFlag;
          }
          if(this.csvFullPermission){
            this.csvFullPermission=this.permissionMap[key].exportButtonFlag;
          }
        })
        // this.workFlowFlag=inWorkFlowFlag;
        // if(!inWorkFlowFlag){
        //   this.inWorkFlowMessage=`Note* :<span class="messages text-danger"> You are not in workflow. Please contact admin!.</span>`;
        // }
        this.adminComponent.setUpModuleForHelpContent(response.constant);
        this.adminComponent.taskEnbleFlag = true;
        if(response.groupId != ""){
          this.adminComponent.taskDocType = response.unique;
        }else{
          this.adminComponent.taskDocType = response.constant;}
          this.adminComponent.checkTheTaskData();
        this.constants = response.constant;
        this.loadSequenceWorkFlow(this.adminComponent.taskDocType);
        if(response.isMapping){
          this.mappingId = response.groupId;
        }
        this.isCsvTemplateConfigExists(this.adminComponent.taskDocType);
        
        this.permissionService.getUserPreference(this.helper.MASTER_DYNAMIC_FORM).subscribe(res =>{
          if (res.result){
            if(res.result==='audit')
            this.auditView.loadData(response.constant,response.groupId);
           let activeTab= res.result;
           if(activeTab=='draft'){
            this.commentsDocumentsList=this.data.map(u=>({'id': u.id,'type': "code",'value':  u.dynamicFormCode}));
           }if(activeTab=='published'){
            this.commentsDocumentsList=this.publishedData.map(u=>({'id': u.id,'type': "code",'value':  u.dynamicFormCode}));
           }
          }
        });
      }
      this.ngAfterViewInit();
    });
  }

  navigate(exists, data?: any) {
    if (this.createButtonFlag || (data && data.formType === "Document Specific")) {
      const queryParams = {
        exists: exists,
        id: this.masterDynamicFormId,
        isMapping: this.isMapping,
        redirectUrl: 'dynamicFormView/' + this.masterDynamicFormId + '?false?' + this.isMapping,
      };
      if (data !== undefined) {
        if (this.isMapping) {
          queryParams.id = data.formMappingId;
          queryParams['documentCode'] = data.dynamicFormCode;
          queryParams.redirectUrl = 'dynamicFormView/' + data.formMappingId + '?false?' + queryParams.isMapping;
          queryParams['partTab'] = this.nextId;
        } else {
          queryParams.id = data.id;
        }
      }
      this.router.navigate(['/dynamicForm/' + this.masterDynamicFormId], { queryParams: queryParams, skipLocationChange: true });
    } else {
      swal({
        title: 'Warning!', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
        text: "You don't have create permission. Please contact admin!.",
      });
    }
  }

  loadDocumentCommentLog(row) {
      row.createdBy=row.createdByName;
      row.constantName = row.permissionConstant;
      row.templateName=this.formName;
      this.documentcomments.loadDocumentCommentLog(row);
  }

  viewRowDetails(row: any, status) {
    this.commentsDocumentsList=[];
    this.pdfView=false;
    this.adminComponent.taskDocTypeUniqueId =''+ row.id;// To Populate the Task Popu data
    this.adminComponent.taskEquipmentId = row.equipmentId // To Populate the equipment daat in task
    this.tabChange('draft') ///need to change in time of performance
    this.commonDocumentStatusValue = status;
    this.popupdata = [];
    const queryParams = {
      exists: true,
      id: this.masterDynamicFormId,
      isMapping: this.isMapping,
    };
    if (this.isMapping) {
      queryParams.id = row.formMappingId;
      queryParams['documentCode'] = row.dynamicFormCode;
      this.commentsDocumentsList.push({"id":row.id,"value":row.dynamicFormCode,"type":"code"});
    } else {
      queryParams.id = row.id;
    }
    this.dynamicService.loadDynamicFormForProject(queryParams).subscribe(jsonResp => {
      if (jsonResp != null) {
        if (!this.isMapping) {
          jsonResp.formData = JSON.parse(jsonResp.formData);
          this.individualconstants = jsonResp.permissionConstant;
          this.individualId = jsonResp.id;
          this.commentsDocumentsList.push({"id":jsonResp.id,"value":jsonResp.dynamicFormCode,"type":"code"});
          this.stepperfunction(jsonResp.permissionConstant, jsonResp.dynamicFormCode, jsonResp.id,
            jsonResp.publishedflag, jsonResp.createdBy, jsonResp.updatedTime,
             jsonResp.displayCreatedTime, jsonResp.displayUpdatedTime, jsonResp.updatedByName, jsonResp.templateName);

          if (jsonResp.publishedflag && !jsonResp.workFlowCompletionFlag) {// both true direct PDF VIEW
            this.pdfView = true;
            this.documentPreview(jsonResp);
          }
          this.permissionBasedOnModule(jsonResp.permissionConstant,'');
        } else {
          jsonResp.formData = [];
          let publishCount =0;
          jsonResp.formDataList.forEach((element, i) => {
            if(this.nextId=="0"){
              this.nextId=element.id==row.id?""+i:"0";
            }
            if(element.publishedflag){
              publishCount++;
            }
            element.formDataArray = [{ formData: JSON.parse(element.formData) }];
          });
          
          if(jsonResp.formDataList.length!=0){
            this.toggle(this.nextId,jsonResp);
            if (jsonResp.formDataList.length == publishCount && !jsonResp.workFlowCompletionFlag) {// both true direct PDF VIEW
              this.pdfView = true;
              this.documentPreview(jsonResp);
            }
          }
        }
        this.tempDynamicForm = JSON.parse(JSON.stringify(jsonResp));
        this.popupdata.push(jsonResp);
        this.viewIndividualData = true;

      } else
        this.spinnerFlag = false;
    }, error => this.spinnerFlag = false);
  }

  closeDetailView() {
    this.viewIndividualData = false;
    this.pdfURL = ''; 
    this.pdfName = '';
    this.loadData(this.masterDynamicFormId, '' + this.isMapping);
  }

  openSuccessCancelSwal(data) {
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
        data.userRemarks="Comments : " + value;
        this.deleteTemplate(data);
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

    deleteTemplate(data) {
      let dynamicForm=JSON.parse(JSON.stringify(data));
      if(this.isMapping){
        this.nextId
        dynamicForm.id=dynamicForm.formDataList[+this.nextId].id;
      }
      this.spinnerFlag = true;
      dynamicForm.formData='[]';
      this.dynamicService.deleteDynamicForm(dynamicForm)
        .subscribe((resp) => {
          this.spinnerFlag = false;
          let responseMsg: string = resp.result;

          if (responseMsg === "success") {
            swal({
              title: 'Deleted!',
              text:this.dynamicForm.templateName + ' Record has been Deleted',
              type:'success',
              timer:2000,
              showConfirmButton:false,
              onClose: () => {
                this.viewIndividualData = false;
                this.loadData(this.masterDynamicFormId,''+this.isMapping);
              }
            });
          } else {
            swal(
              'Not Deleted!',
              this.dynamicForm.templateName + 'Record has not been Deleted',
              'error'
            );

          }

        }, (err) => {
          swal(
            'Not Deleted!',
            this.dynamicForm.templateName+ 'Record has not been Deleted',
            'error'
          );
          this.spinnerFlag = false;
        });
      }

  publish(){
    this.spinnerFlag=true;
    this.dynamicService.publishMultipleDynamicForm(this.data).subscribe(result => {
      this.isSelectedPublishData=false;
      this.spinnerFlag=false;
      this.loadData(this.masterDynamicFormId,''+this.isMapping);
      },error=>{this.spinnerFlag=false;});
}

  individualPublish(data, index) {
   let formName=data.templateName;
    let list = new Array();
    let dynamicForm = JSON.parse(JSON.stringify(data));
    if (this.isMapping) {
      dynamicForm.id = dynamicForm.formDataList[+index].id;
      formName=dynamicForm.formDataList[+index].formName;
    }
    this.spinnerFlag = true;
    dynamicForm.formData = '[]';
    dynamicForm.publishedflag = true;
    list.push(dynamicForm);
    this.dynamicService.publishMultipleDynamicForm(list).subscribe(result => {
      this.isSelectedPublishData = false;
      this.spinnerFlag = false;
      if(result.result=='success'){
        swal({
          title:'Published!',
          text:formName+' has published Successfully!',
          type:'success',
          timer:this.helper.swalTimer,
          showConfirmButton:false,
          onClose: () => {
            this.viewRowDetails(data,location.pathname);
          }
        });
      }else{
        swal({
          title:'Error',
          text:'Some Internal Issue has been occured. We will get back to You',
          type:'error',
          timer:this.helper.swalTimer
        })
      }
    },err=>{
      swal({
        title:'Error',
        text:'Some Internal Issue has been occured. We will get back to You',
        type:'error',
        timer:this.helper.swalTimer
      })
      this.spinnerFlag=false;
    });
  }

  selectAllData(event) {
    this.selectAll = event.currentTarget.checked;
    if (event.currentTarget.checked) {
      this.data.forEach(d => {
        if (this.permissionMap[d.permissionConstant].publishButtonFlag) {
          if (!this.isMapping) {
            d.publishedflag = true;
          } else {
            if (this.isMapping && (this.isWorkflowDocumentOrderSequence && (!d.workFlowSequenceFlag || d.perviousGroupPartCompleted))) {
              d.publishedflag = true;
            }
          }
        }
      });
      this.isSelectedPublishData = true;
    } else {
      this.data.filter(d => d.publishedflag).forEach(d => {
        d.publishedflag = false;
      });
      this.isSelectedPublishData = false;
    }
  }

  onChangePublishData(row,permissionMap) {
    row.publishedflag = !row.publishedflag;
    if (this.isMapping && row.commonWorkFlowForGroupForm) {
      this.data.filter(d => row.uniqueId == d.uniqueId).forEach(ele => {
        if ((row.uniqueId == ele.uniqueId) && permissionMap[ele.permissionConstant].publishButtonFlag) {
          ele.publishedflag = row.publishedflag;
        }
      });
    }
    this.isSelectedPublishData = this.data.filter(d => d.publishedflag).length > 0 ? true : false;
  }

  downloadTemplate(type: any, data: DynamicFormDTO) {
    this.spinnerFlag = true;
    let fileName = data.dynamicFormCode + "." + type;
    this.tempDynamicForm.downloadDocType = type;
    this.tempDynamicForm.formData = JSON.stringify(this.tempDynamicForm.formData);
    this.dynamicService.downloadPreviewDocument(this.tempDynamicForm).subscribe(resp => {
      this.tempDynamicForm.formData = JSON.parse(this.tempDynamicForm.formData);
      this.spinnerFlag = false;
      this.adminComponent.previewByBlob(fileName, resp, false, '');
    });
  }

  toggle(index,data){
    this.spinnerFlag=true;
    this.nextId = index
    var ele = index == -1 ? undefined : data.formDataList[+index];
    if (ele != undefined){
      this.permissionBasedOnModule(ele.permissionConstant,this.mappingId);
      this.individualconstants = ele.permissionUniqueConstant;
      this.individualId = ele.id;
      if(this.auditTrail && this.auditTrail.viewFlag)//when audit is in view and tab is changes need to update the audit
      this.auditTrail.loadData(this.individualconstants,this.individualId);
      this.stepperfunction(ele.permissionUniqueConstant,data.dynamicFormCode,ele.id,ele.publishedflag,
        data.createdBy,data.updatedTime,data.displayCreatedTime,data.displayUpdatedTime,data.updatedByName,data.templateName);
    }
    this.spinnerFlag=false;
   }

   stepperfunction(documentConstant,code,id,publishedflag,creatorId,updatedTime,displayCreatedTime,displayUpdatedTime,updatedBy,templateName) {
    this.spinnerFlag=true;
    this.globalPublishFlag=publishedflag;
    const stepperModule: StepperClass = new StepperClass();
     stepperModule.constantName = documentConstant;
     stepperModule.code = code;
     stepperModule.documentIdentity = id;
     stepperModule.publishedFlag = publishedflag;
     stepperModule.creatorId = creatorId;
     stepperModule.lastupdatedTime = updatedTime;
     stepperModule.displayCreatedTime = displayCreatedTime;
     stepperModule.displayUpdatedTime = displayUpdatedTime;
     stepperModule.documentTitle = templateName;
     stepperModule.createdBy = creatorId;
     stepperModule.updatedBy = updatedBy;
     this.helper.stepperchange(stepperModule);
     this.spinnerFlag=false;
  }

  loadSequenceWorkFlow(constant){
    this.permissionService.isWorkflowDocumentOrderSequence(constant).subscribe(resp => {
      this.isWorkflowDocumentOrderSequence = resp;
    });
  }

  tabChange(id: any){
    this.saveCurrentTab(id);
    this.selectAllCSVFlag=false;
    this.isSelectedPublishData=false;
    this.selectAll=false;
    if(id=='draft'){
      this.loadSequenceWorkFlow(this.adminComponent.taskDocType);
      this.loadData(this.masterDynamicFormId, this.queryMapping);
    }
    this.data.forEach(element => {
       element.publishedflag=false; 
    });
    this.publishedData.filter(e => e.completedAllPart).forEach(element => {
      element.flag = false;
    });
    if (id == 'feedback'){
      this.permissionService.loadDocumentForumCodes(this.adminComponent.taskDocType).subscribe(resp => {
        this.commentsDocumentsList = resp;
      });
    }
  }

  verify(data){
    if(this.isMapping){
     let res=data.formDataList[+this.nextId];
      this.formVerification.openMyModal(res.permissionUniqueConstant, data.dynamicFormCode, res.id);
    }else{
      this.formVerification.openMyModal(data.permissionConstant, data.dynamicFormCode, data.id);
    }
  }

  cloneOfDynamicForm(data){
    this.selectAll=false;
    this.isSelectedPublishData=false;
    this.spinnerFlag=true;
    let dynamicForm=JSON.parse(JSON.stringify(data));
    delete dynamicForm.formData
    this.permissionService.HTTPPostAPI(dynamicForm,"dynamicForm/cloneDynamicFormForProject").subscribe((resp) => {
      if(resp.result=='success'){
        swal({
          title:'Copied Successfully!',
          text:' ',
          type:'success',
          timer:this.helper.swalTimer,
          showConfirmButton:false,
          onClose: () => {
            this.loadData(this.masterDynamicFormId,''+this.isMapping);
          }
        });
      }else{
        swal({
          title:'Error',
          text:'Some Internal Issue has been occured. We will get back to You',
          type:'error',
          timer:this.helper.swalTimer
        })
        this.spinnerFlag=false;
      }
    },err=>{
      swal({
        title:'Error',
        text:'Some Internal Issue has been occured. We will get back to You',
        type:'error',
        timer:this.helper.swalTimer
      })
      this.spinnerFlag=false;
    });
  }

  permissionBasedOnModule(permissionConstant,groupId){
    this.permissionService.loadPermissionsBasedOnModule(permissionConstant,'',groupId).subscribe(resp=>{
      this.permissionModel=resp;
    });
  }

  documentPreview(data) {
    this.pdfURL='';
    if (this.pdfView) {
      if(this.pdfName && !this.pdfName.includes(data.dynamicFormCode)){
        this.pdfURL='';
      }
        this.spinnerFlag = true;
        let dynamicForm = JSON.parse(JSON.stringify(data));
        dynamicForm.formData = JSON.stringify(data.formData);
        this.dynamicService.loadPreviewDocument(dynamicForm).subscribe(resp => {
          this.spinnerFlag = false;
          if (resp != null) {
            const blob: Blob = new Blob([resp], { type: "application/pdf" });
            this.pdfURL = URL.createObjectURL(blob)
            this.pdfName = dynamicForm.dynamicFormCode + ".pdf";
          }
        }, err => {
          this.spinnerFlag = false;
        });
    }
  }

  downloadRawPDF(data:any){
    let fileName=data.dynamicFormCode+"_RawData.pdf";
    if(data.apiRawDataFilePath.includes(".xlsx"))
      fileName=data.dynamicFormCode+"_RawData.xlsx";
    this.adminComponent.downloadOrViewFile(fileName,data.apiRawDataFilePath,false);
  }

  loadOrgDateFormatAndTime() {
    this.permissionService.getOrgDateFormat().subscribe(result => {
      if (result) {
        this.datePipeFormat = result.datePattern.replace("YYYY", "yyyy");
        this.toDateOptions.dateFormat = this.datePipeFormat;
        this.fromDateOptions.dateFormat = this.datePipeFormat;
        this.datePipeFormat = result.datePattern.replace("mm", "MM");
      }
    });
  }
/**
 * 
 * @param date : Date
 * @param flag : true=> to date ; false=> from date
 */
  onDateChanged(date,flag:boolean){
    if (flag) {
      this.toDateView.opts.disableUntil = date.date;
      this.toDateView.setOptions();
    } else {
      this.fromDateView.opts.disableSince = date.date;
      this.fromDateView.setOptions();
    }
  }

  selectAllDataForCSVExport(event) {
    this.selectAllCSVFlag = event.currentTarget.checked;
    if (event.currentTarget.checked) {
      this.publishedData.filter(e => e.completedAllPart).forEach(e => {
        e.flag = true;
      })
    } else {
      this.publishedData.filter(e => e.completedAllPart).forEach(e => {
        e.flag = false;
      })
    }
  }

  onChangeCSV(row) {
    row.flag = !row.flag;
    if (this.isMapping && row.commonWorkFlowForGroupForm) {
      this.publishedData.filter(d => row.uniqueId == d.uniqueId).forEach(ele => {
        if ((row.uniqueId == ele.uniqueId)) {
          ele.flag = row.flag;
        }
      });
    }
    this.selectAllCSVFlag = this.publishedData.filter(e=>e.workFlowCompletionFlag).filter(e=>e.flag).length>0;
}

exportCSV(){
  let ids=new Array();
  let name=new Array();
 this.publishedData.filter(r=>r.value==this.adminComponent.taskDocType && r.flag).forEach(r => {
  ids.push(this.isMapping?+r.uniqueId:+r.id);
  name.push(r.dynamicFormCode);
 });
 ids=Array.from(new Set(ids));
 name=Array.from(new Set(name));
 let json={
   docType:this.adminComponent.taskDocType,
   ids:ids,
   name:name.join(",")
 }
 this.spinnerFlag = true;
 this.permissionService.HTTPPostAPI(json,'csvTemp/downloadExcelFromView').subscribe(resp=>{
  this.spinnerFlag = false;
    if (resp.result) {
      var nameOfFileToDownload = resp.sheetName + ".xls";
      this.adminComponent.previewOrDownloadByBase64(nameOfFileToDownload, resp.sheet, false);
    }else{
      this.spinnerFlag = false;
      swal({
        title: '400',
        text: 'Oops, something went wrong ,try again..',
        type: 'error',
        timer: this.helper.swalTimer,
        showConfirmButton: false
      })
    }
  },(err)=>{
      this.spinnerFlag = false;
      swal({
        title: '400',
        text: 'Oops, something went wrong ,try again..',
        type: 'error',
        timer: this.helper.swalTimer,
        showConfirmButton: false
      })
  });
}

createTask(input,dynamicForm:DynamicFormDTO,groupPart?){
  this.adminComponent.taskEquipmentId=dynamicForm.equipmentId;
  if(groupPart){ 
    this.adminComponent.taskDocType=''+dynamicForm.value;
    this.adminComponent.taskDocTypeUniqueId=''+groupPart.id;
  }else{
    this.adminComponent.taskDocType=dynamicForm.permissionConstant;
    this.adminComponent.taskDocTypeUniqueId=''+dynamicForm.id;
  }
  var dueDate;
  if(input.type=='date'){
  if(input.value)
    dueDate=input.value;
    let dateLocal=new Date(dueDate);
    dueDate= {year: dateLocal.getFullYear(), month: dateLocal.getMonth() + 1,day:dateLocal.getDate()};
  }else if(input.type=='datetime-local'){
    if(input.value){
     let splitDate= input.value.split("T")
     let dateLocal=new Date(splitDate[0]);
     dueDate= {year: dateLocal.getFullYear(), month: dateLocal.getMonth() + 1,day:dateLocal.getDate()};
    }
  }
  this.adminComponent.loadTaskDetails(dueDate,input.label?(input.label).replace("\\<.*?\\>", ""):'');
}

openDocumentForum(){
  this.forumView.showModalView();
  this.forumView.setPermissionConstant(this.adminComponent.taskDocType,this.commentsDocumentsList);
}

afterLoadComplete(pdf: PDFDocumentProxy) {
  this.pdf = pdf;
  this.loadOutline();
}

loadOutline() {
  this.pdf.getOutline().then((outline: any[]) => {
    this.outline = outline;
    if(this.outline)
    this.outLineList = this.outline.map(o => ({ id: o.title, value: o.title.replace(" ", ""), type: 'chapter' }));
    else{
      this.outLineList=new Array();
    }
  });
}

onError(error: any) {
  this.error = error; // set error
  if (error.name === 'PasswordException') {
    const password = prompt(
      'This document is password protected. Enter the password:'
    );
    if (password) {
      this.error = null;
      this.setPassword(password);
    }
  }
}

setPassword(password: string) {
  let newSrc;
  if (this.pdfURL instanceof ArrayBuffer) {
    newSrc = { data: this.pdfURL };
  } else if (typeof this.pdfURL === 'string') {
    newSrc = { url: this.pdfURL };
  } else {
    newSrc = { ...this.pdfURL };
  }
  newSrc.password = password;
  this.pdfURL = newSrc;
}

onClickTableOfContent(formId: any) {
  this.router.navigate(['/table-of-content'], { queryParams: { docId: formId, status: document.location.pathname }, skipLocationChange: true });
}

onClickTableOfContentForOrgForm(formId: any){
  this.router.navigate(['/pdfPreference'], { queryParams: { docId: formId, status: document.location.pathname }, skipLocationChange: true });
}
inviteUser(id){
  this.externalFormModal.onClickExternalApproval(id);
}
}
