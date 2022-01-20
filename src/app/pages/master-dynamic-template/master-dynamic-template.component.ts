import { Component, OnInit, ViewEncapsulation,ViewChild } from '@angular/core';
import { Helper } from '../../shared/helper';
import { MasterDynamicTemplateService } from './master-dynamic-template.service';
import { MasterDynamicTemplate, MasterDynamicWorkFlowConfigDTO, UserPrincipalDTO,  } from '../../models/model';
import { CommonFileFTPService } from '../common-file-ftp.service';
import swal from 'sweetalert2';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { IOption } from 'ng-select';
import { UserService } from '../userManagement/user.service';
import { userRoleservice } from '../role-management/role-management.service';
import { AdminComponent } from '../../layout/admin/admin.component';
import { ConfigService } from '../../shared/config.service';

@Component({
  selector: 'app-dynamic-template',
  templateUrl: './master-dynamic-template.component.html',
  styleUrls: ['./master-dynamic-template.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [MasterDynamicTemplateService, CommonFileFTPService, projectsetupService,userRoleservice,UserService],
})

export class MasterDynamicTemplateComponent implements OnInit {
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  public sortOrder = 'desc';
  public templateList: any;
  public unPublishedTemplateList:any;
  public publishedTemplateList:any;
  formFlag = false;
  submitted = false;
  spinnerFlag = false;
  templateId = 0;
  fileValidationMessage:any="";
  masterDynamicTemplate: MasterDynamicTemplate = new MasterDynamicTemplate();
  singleFileUploadFlag: boolean = false;
  uploadSingleFile: any;
  singleFile = "";
  validationMessage = "";
  workFlowOptions: Array<IOption> = new Array<IOption>();

  workFlowDto = new MasterDynamicWorkFlowConfigDTO();
  levelList: any;
  roleList: Array<IOption> = new Array<IOption>();
  userList: Array<IOption> = new Array<IOption>();
  masterWorkFLowConfigData: any;
  roleIds=[];
  @ViewChild('mydatatable') table: any;
  currentUser:UserPrincipalDTO=new  UserPrincipalDTO();
  constructor(private adminComponent: AdminComponent,public service: MasterDynamicTemplateService, public helper: Helper, private commonService: CommonFileFTPService, private projectService: projectsetupService, private userService: UserService,private roleService:userRoleservice,public permissionService: ConfigService) { }


  ngOnInit() {
    this.permissionService.loadCurrentUserDetails().subscribe(res => {
      this.currentUser = res;
    });
    this.adminComponent.setUpModuleForHelpContent("");
    this.adminComponent.taskDocType = "";
    this.adminComponent.taskDocTypeUniqueId = "";
    this.adminComponent.taskEnbleFlag = true;
    this.adminComponent.taskEquipmentId = 0;
    this.spinnerFlag = true;
    this.loadTemplate();
    this.projectService.loadWorkFlowLevels().subscribe(response => {
      this.workFlowOptions = response.list.map(option => ({ value: option.id, label: option.workFlowLevelName }));
    });
    this.loadRole();
    this.loadUser(this.roleIds);
  }

 /*START : MASTER DYNAMIC TEMPLATE*/
  loadTemplate() {
    this.formFlag = false;
    this.service.loadTemplate().subscribe(result => {
      this.templateList = result;
      this.unPublishedTemplateList=this.templateList.filter(up=>!up.publishedFlag);
      this.publishedTemplateList=this.templateList.filter(up=>up.publishedFlag);
      this.spinnerFlag = false;
    }, err => {
      this.spinnerFlag = false;
    });
  }


  loadTemplateToEdit(id) {
    this.spinnerFlag = true;
    this.deletePDFView();
    if (id != 0) {
      this.service.editDynamicTemplate(id).subscribe(result => {

        if (result != null) {
          this.masterDynamicTemplate = result;
          this.formFlag = true;
        }
        this.spinnerFlag = false;
      }, error => {
        this.spinnerFlag = false;
      })
    } else {
      this.masterDynamicTemplate = new MasterDynamicTemplate();
      this.formFlag = false;
      this.spinnerFlag = false;
    }
  }

  saveData() {
    this.submitted = true;
    if (this.masterDynamicTemplate.templateName == "" || this.masterDynamicTemplate.fileName == "" || this.validationMessage != "" || this.fileValidationMessage != "") {
      return
    } else {
      this.spinnerFlag = true;
      this.service.createMasterDynamicTemplate(this.masterDynamicTemplate).subscribe(result => {
        let timerInterval
        if (result.result == "success") {
          let saveOrUpdate=(this.masterDynamicTemplate.id == 0) ?"Saved":"Updated";
          this.spinnerFlag = false;
          swal({
            title:saveOrUpdate +' Successfully!',
            text:this.masterDynamicTemplate.templateName + ' template has been saved.',
            type:'success',
            timer:this.helper.swalTimer,
            showConfirmButton:false,
            onClose: () => {
              this.loadTemplate();
              clearInterval(timerInterval)
            }
          });
        }
      }, error => {
        this.spinnerFlag = false;
        swal({
          title:'Error in Saving',
          text:this.masterDynamicTemplate.templateName + ' template has not  been saved',
          type:'error',
          timer:this.helper.swalTimer,
          showConfirmButton:false
        }

        );
      })
    }
  }

  showNext = (() => {
    var timer: any = 2;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.service.isTemplateExists(this.masterDynamicTemplate.templateName).subscribe(
          jsonResp => {
            let responseMsg: boolean = jsonResp;
            if (responseMsg == true) {
              this.validationMessage = "Dynamic template with this name already exist.";
            } else {
              this.validationMessage = "";
            }
          }
        );
      }, 600);
    }
  })();

  loadForm() {
    this.formFlag = true;
    this.masterDynamicTemplate = new MasterDynamicTemplate();
    this.validationMessage = "";
  }

  deleteTemplate(value,id) {
    this.spinnerFlag = true;
    let masterDynamicTemplate = new MasterDynamicTemplate();
    masterDynamicTemplate.id = id;
    masterDynamicTemplate.userRemarks="Comments : " + value;
    this.service.deleteTemplate(masterDynamicTemplate)
      .subscribe((resp) => {
        let timerInterval
        this.spinnerFlag = false;
        let responseMsg: string = resp.result;

        if (responseMsg === "success") {
          swal({
            title:'Deleted!',
            text:this.masterDynamicTemplate.templateName + ' record has been deleted.',
            type:'success',
            timer:this.helper.swalTimer,
            showConfirmButton:false,
            onClose: () => {
              this.loadTemplate();
              clearInterval(timerInterval)
            }
          });

        } else {
          swal({
            title:'Not Deleted!',
            text:this.masterDynamicTemplate.templateName + ' has  not been deleted.',
            type:'error',
            timer:this.helper.swalTimer,
            showConfirmButton:false
          }
          );

        }

      }, (err) => {
        swal(
          'Not Deleted!',
          this.masterDynamicTemplate.templateName + 'has  not been deleted.',
          'error'
        );
        this.spinnerFlag = false;
      });
  }
  deleteTemplateSwal(id) {
    var obj = this
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
        this.deleteTemplate(value,id);
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
  /*END : MASTER DYNAMIC TEMPLATE*/

/*START : MASTER DYNAMIC TEMPLATE WORK FLOW*/
  goToWorkFlowConfig(id){
    document.getElementById("workFlowId").click();
    this.loadTemplate();
    this.loadNumberOfLevelsForMasterDynamicTemplate(id);
    this.loadTable(id)
}
editLevel(data) {
  this.workFlowDto = data;
  this.roleIds=data.roleIds;
  this.loadUser(data.roleIds);
}
saveWorkFlowData(formValid) {
  this.submitted = true;
  if (!formValid) {
    return
  } else {
    this.service.saveWorkFlowData(this.workFlowDto).subscribe(respo => {
      this.spinnerFlag = false;
      let timerInterval;
      if (respo.result == "success") {
        swal({
          title:'Saved Successfully!',
          text:'Configuration has been saved.',
          type:'success',
          timer:this.helper.swalTimer,
          showConfirmButton:false,
          onClose: () => {
            this.loadTable(this.workFlowDto.masterId)
            clearInterval(timerInterval)
          }
        });
      }else{
        swal({
          title:'Error in Saving',
          text:'Configuration has not  been saved',
          type:'error',
          timer:this.helper.swalTimer,
          showConfirmButton:false,
        }
        );
      }
    }, error => {
      swal({
        title:'Error in Saving',
        text:'Configuration has not  been saved',
        type:'error',
        timer:this.helper.swalTimer,
        showConfirmButton:false,
      });
    });
  }

}
loadRole(){
  this.roleService.loadroles().subscribe(result => {
    for (let key in result) {
      let value = result[key];
      this.roleList.push({ "value": key, "label":value})
    }
    this.roleList= this.roleList.map(option => ({ value: option.value, label: option.label}));
  });
}
 loadUser(roleIds:any[]) {
    this.spinnerFlag = true;
    this.userService.loadAllUsersForTemplatesAndForms().subscribe(
      jsonResp => {
        let list:any[]= jsonResp.result;
        list=list.filter (data=>roleIds.includes(""+data.role));
        this.userList = list.map(option => ({ value: option.id, label: option.firstName + " " + option.lastName }));
        this.spinnerFlag = false;
      }, err => { this.spinnerFlag = false; });
  }

  addNewLevel(masterDynamicId){
    this.workFlowDto = new MasterDynamicWorkFlowConfigDTO();
    this.workFlowDto.masterId=masterDynamicId;
    this.roleIds=[];
  }


  loadNumberOfLevelsForMasterDynamicTemplate(masterDynamicId) {
    this.spinnerFlag = true;
    this.workFlowDto = new MasterDynamicWorkFlowConfigDTO();
    this.workFlowDto.masterId=masterDynamicId;
    this.roleIds=[];
    this.loadTable(masterDynamicId);
    this.service.loadNumberOfLevelsForMasterDynamicTemplate(masterDynamicId).subscribe(result => {
      this.levelList = result;
      this.spinnerFlag = false;
    }, err => { this.spinnerFlag = false; });
  }

  loadTable(masterDynamicId) {
    this.spinnerFlag = true;
    this.service.loadAll(masterDynamicId).subscribe(result => {
      this.spinnerFlag = false;
      this.masterWorkFLowConfigData = result.list;
    }, error => { this.spinnerFlag = false; });
  }

/*END : MASTER DYNAMIC TEMPLATE WORK FLOW*/

/* START:PDF OPERATIONS*/
deleteUploadedFile() {
  this.masterDynamicTemplate.filePath = "";
  this.masterDynamicTemplate.fileName = "";
  this.deletePDFView();
}
deletePDFView() {
  if (document.getElementById("iframeView")){
    document.getElementById("iframeView").remove();
    document.getElementById("fileUploadIdMasterTemplate").setAttribute("class","form-group row");
  }

}
onSingleFileUpload(event) {
  this.fileValidationMessage="";
  this.deletePDFView();
  if (event.target.files.length != 0) {
    let file = event.target.files[0];
    let fileName = event.target.files[0].name;
    this.singleFileUploadFlag = true;
    if (fileName.toLocaleLowerCase().match('.doc') || fileName.toLocaleLowerCase().match('.docx') || fileName.toLocaleLowerCase().match('.pdf')) {
      const filePath = 'IVAL/' + this.currentUser.orgId + '/MasterDynamicTemplates/';
      const formData: FormData = new FormData();
      formData.append('file', file, fileName);
      formData.append('filePath', filePath);
      formData.append('extension', fileName.split(".")[fileName.split(".").length - 1]);
      this.commonService.singleFileUpload(formData).subscribe(resp => {
        this.masterDynamicTemplate.filePath = resp.path;
        this.masterDynamicTemplate.fileName = fileName;
        this.singleFileUploadFlag = false;
      }, error => {
        this.singleFileUploadFlag = false;
      })
    } else {
      this.singleFileUploadFlag = false;
      this.fileValidationMessage="Upload .pdf,.doc,.docx file only";
    }
  }
}
  downloadFileOrView(input, viewFlag) {
    this.spinnerFlag=true;
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
/* END:PDF OPERATIONS*/


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
  let find = document.querySelector('#fileUploadIdMasterTemplate');
  find.setAttribute("class","well well-lg form-group row");
  find.appendChild(iframe);
  this.spinnerFlag=false;
}
}


