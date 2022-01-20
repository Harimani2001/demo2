import { Component, OnInit, ViewEncapsulation,ViewChild } from '@angular/core';
import {transition, trigger, style, animate} from '@angular/animations';
import { WorkFlowDynamicTemplateService } from './work-flow-dynamic-template.service';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { Permissions } from '../../shared/config';
import swal from 'sweetalert2';
import { CommonFileFTPService } from '../common-file-ftp.service';
import { AdminComponent } from '../../layout/admin/admin.component';
import { UserPrincipalDTO } from '../../models/model';
@Component({
  encapsulation:ViewEncapsulation.None,
  selector: 'app-work-flow-dynamic-template',
  templateUrl: './work-flow-dynamic-template.component.html',
  styleUrls: ['./work-flow-dynamic-template.component.css','../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  providers:[WorkFlowDynamicTemplateService],
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({opacity: 0}),
        animate('400ms ease-in-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translate(0)'}),
        animate('400ms ease-in-out', style({opacity: 0}))
      ])
    ])
  ]
})
export class WorkFlowDynamicTemplateComponent implements OnInit {
  modalSpinner:any=false;
  isNavbarCollapsed=false;
  permissionModel: Permissions = new Permissions("",false);
  permissionData: any;
  unPublishedMasterTemplateList: any;
  publishedMasterTemplateList: any;
  spinnerFlag = false;
  singleFileUploadFlag= false;
  viewUnpublishedData=false;
  viewPublishedData=false;
  dto:any;
  workFlowLog=[];
  presentLevel;
  presentStatus;
  presentCreatedBy;
  presentModifiedDate;
  revisionArray:any[]=new Array<any>();
  leftRevisionArray:any[]=new Array<any>();
  rightRevisionArray:any[]=new Array<any>();
  sourceFile:string="";
  compareFile:string="";
  revisionValidationMessage:string="";
  public filterQuery = '';
  @ViewChild('myTable') table: any;
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  constructor(private adminComponent: AdminComponent,private service: WorkFlowDynamicTemplateService, public permissionService: ConfigService,public helper: Helper, private commonService: CommonFileFTPService) { 
    this.permissionService.loadPermissionsBasedOnModule(this.helper.MASTER_DYNAMIC_TEMPLATE_WORKFLOW).subscribe(resp=>{
      this.permissionModel=resp
    });
    window.scrollTo(0,0);
  }

  ngOnInit() {
    this.permissionService.loadCurrentUserDetails().subscribe(res => {
      this.currentUser = res;
    });
    this.adminComponent.setUpModuleForHelpContent(this.helper.MASTER_DYNAMIC_TEMPLATE_WORKFLOW);
    this.loadMasterFormForWorkFlow();
  }

  loadMasterFormForWorkFlow() {
    this.spinnerFlag = true;
    this.service.loadMasterTemplateForWorkFlow().subscribe(result => {
      this.unPublishedMasterTemplateList = result.unpublishedList;
      this.publishedMasterTemplateList = result.publishedList;
      this.spinnerFlag = false;
    })
  }
  viewRowDetailsOfPublished(row){
    this.dto=row;
    this.viewUnpublishedData=false;
    this.viewPublishedData=true;
  }
  viewRowDetails(row){
    this.viewUnpublishedData=true;
    this.dto=row;
  }
  loadDocumentCommentLog(row){
    this.service.loadLogOfMasterFormWorkFlow(row['masterDynamicTemplateDTO'].id).subscribe(resp => {
      this.presentLevel=""
      this.presentStatus=""
      this.presentCreatedBy=""
      this.presentModifiedDate=""
      this.workFlowLog=[];
      if(resp!=null){
        this.workFlowLog=resp;
        this.presentLevel=this.workFlowLog[0].levelName;
        this.presentStatus=this.workFlowLog[0].status;
        this.presentCreatedBy=this.workFlowLog[0].user;
        this.presentModifiedDate=this.workFlowLog[0].createdTime;
      }
    });
  }

  changeStatus(row,status) {
    this.dto.flag=status;
    swal({
      title: 'Comments',
      input: 'textarea',
      confirmButtonText: 'Submit',
      showCancelButton: true,
      animation: false,
      showCloseButton: true,
      inputPlaceholder: "Please Write Comments" ,
        
    }).then((comments)=> {
      if(comments==""){
        swal.showLoading();
        swal.showValidationError('Please Enter the Comments');
        swal.hideLoading();
      }else{
        this.dto.comments=comments;
        this.spinnerFlag=true;
        this.service.levelApproveSubmit(this.dto).subscribe(res => {
         this.spinnerFlag=false;
          if (res.result== "success") {
            swal(
              'Approved Successfully!',
              ' ',
              'success'
            ).then(resp => {
              this.viewUnpublishedData = false;
              this.viewPublishedData = false;
              this.loadMasterFormForWorkFlow();
            });
          } else {
            swal(
              'Error',
              'Some Internal Issue has been occured .We will get back to You',
              'error'
            );
            this.viewUnpublishedData = false;
            this.viewPublishedData = false;
          }
        }
        );
      }
    }).catch(swal.noop);
    
  }

/* START:PDF OPERATIONS*/
  deleteUploadedFile() {
    this.dto['masterDynamicTemplateDTO'].filePath = "";
    this.dto['masterDynamicTemplateDTO'].fileName = "";
    this.deletePDFView();
  }
  deletePDFView() {
    if (document.getElementById("iframeView")){
      document.getElementById("iframeView").remove();
      document.getElementById("fileUploadIdTemplateWorkFlow").setAttribute("class","form-group row");
    }
  }
  onSingleFileUpload(event) {
    this.deletePDFView();
    if (event.target.files.length != 0) {
      let file = event.target.files[0];
      let fileName = event.target.files[0].name;
      this.singleFileUploadFlag = true;
      if (fileName.match('.doc') || fileName.match('.docx') || fileName.match('.pdf')) {
        let filePath = "IVAL/" + this.currentUser.orgId + "/masterDynamicTemplate/";
        const formData: FormData = new FormData();
        formData.append('file', file, fileName);
        formData.append('filePath', filePath);
        formData.append('extension', fileName.split(".")[fileName.split(".").length - 1]);
        this.commonService.singleFileUpload(formData).subscribe(resp => {
          this.dto['masterDynamicTemplateDTO'].filePath = resp.path;
          this.dto['masterDynamicTemplateDTO'].fileName = fileName;
          this.singleFileUploadFlag = false;
        }, error => {
          this.singleFileUploadFlag = false;
        })
      } else {
        this.singleFileUploadFlag = false;
      }
    }
  }
    downloadFileOrView(input, viewFlag) {
      let filePath = input.filePath;
      let fileName = input.fileName;
      this.commonService.loadFile(filePath).subscribe(resp => {
        let contentType = this.commonService.getContentType(fileName.split(".")[fileName.split(".").length - 1]);
        var blob: Blob = new Blob([resp], { type: contentType });
        if (viewFlag) {
          if (!contentType.match(".pdf")) {
            this.commonService.convertFileToPDF(blob, fileName).then((respBlob)=>{
              this.createIFrame(URL.createObjectURL(respBlob));
            });
          }else{
            this.createIFrame(URL.createObjectURL(blob));
          }
        } else {
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
          } else {
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        }
      })
    }

    createIFrame(blob_url){
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
      let find = document.querySelector('#fileUploadIdTemplateWorkFlow');
      find.setAttribute("class","well well-lg form-group row");
      find.appendChild(iframe);
      this.spinnerFlag=false;
    }


    /*START:REVISION FOR DOCUMENT*/
    revisionForDocument(dto){
      var element= document.getElementById("overflowWorkFlowCompareId");
      element.setAttribute("style", "visibility:hidden");
      this.sourceFile="";
      this.compareFile="";
      this.modalSpinner=false;
    this.service.loadLogOfMasterFormWorkFlow(dto.id).subscribe(resp => {
      if(resp!=null){
        
        this.revisionArray=resp;
        this.leftRevisionArray=resp;
        this.rightRevisionArray=resp;
      }
    });
  }

  removeDataFromList(id,leftOrRightSideFlag){
    if(leftOrRightSideFlag){
      this.leftRevisionArray= this.revisionArray.filter(value=>value.id!=id);
    }else{
      this.rightRevisionArray= this.revisionArray.filter(value=>value.id!=id);
    }
  }
     /*END:REVISION FOR DOCUMENT*/

     compareTwoFile() {
      this.modalSpinner=true;
      this.revisionValidationMessage = "";
      if (this.sourceFile == '')
        this.revisionValidationMessage = "Please Select the file in Source File Drop Down";
      if (this.compareFile == '')
        this.revisionValidationMessage = "Please Select the file in Compare File Drop Down";
      if (this.sourceFile == '' && this.compareFile == '')
        this.revisionValidationMessage = "Please Select the file in both Drop Down";
    
      if (this.revisionValidationMessage != '') {
        this.modalSpinner=false;
        return;
      } else {
        this.commonService.compareTwoFile({sourceFilePath:this.sourceFile,compareFilePath: this.compareFile}).subscribe(res=>{
          var sourceFile = <any>document.getElementById("workFlowSourceFileId");
          var compareFile = <any>document.getElementById("workFlowCompareFileId");
           var sourceFileContentBinary = window.atob(res.sourceFileContent);
             var sourceFileContentArray = [];
          for (var i = 0; i < sourceFileContentBinary.length; i++) {
            sourceFileContentArray.push(sourceFileContentBinary.charCodeAt(i));
          }
      
            setTimeout( () => {
              sourceFile.src= URL.createObjectURL(new Blob([new Uint8Array(sourceFileContentArray)], {type: 'application/pdf'}));   
            }, 1500);
          
            var diffrenceFileContentBinary = window.atob(res.diffrenceFileContent);
            var diffrenceFileContentArray = [];
         for (var i = 0; i < diffrenceFileContentBinary.length; i++) {
          diffrenceFileContentArray.push(diffrenceFileContentBinary.charCodeAt(i));
         }
     
           setTimeout( () => {
             compareFile.src= URL.createObjectURL(new Blob([new Uint8Array(diffrenceFileContentArray)], {type: 'application/pdf'}));   
             var element= document.getElementById("overflowWorkFlowCompareId");
             element.setAttribute("style", "visibility:visible");
             this.modalSpinner=false;
            }, 1500);
    
        })
        }
    }
    

}
