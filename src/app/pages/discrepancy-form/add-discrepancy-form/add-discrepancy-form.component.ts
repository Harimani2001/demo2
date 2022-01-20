import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IOption } from 'ng-select';
import { ISubscription } from 'rxjs/Subscription';
import swal from 'sweetalert2';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { CheckListDTO, DiscrepancyForm, LookUpItem } from '../../../models/model';
import { ConfigService } from '../../../shared/config.service';
import { Helper } from '../../../shared/helper';
import { DashBoardService } from '../../dashboard/dashboard.service';
import { DepartmentService } from '../../department/department.service';
import { FileUploadForDocComponent } from '../../file-upload-for-doc/file-upload-for-doc.component';
import { IQTCService } from '../../iqtc/iqtc.service';
import { projectPlanService } from '../../projectplan/projectplan.service';
import { projectsetupService } from '../../projectsetup/projectsetup.service';
import { UrlchecklistComponent } from '../../urlchecklist/urlchecklist.component';
import { UserService } from '../../userManagement/user.service';
import { DiscrepancyFormRoutesService } from '../discrepancy-form.service';
import { MasterControlService } from '../../master-control/master-control.service';
import { FormExtendedComponent } from '../../form-extended/form-extended.component';

@Component({
  selector: 'app-discrepancy-form',
  templateUrl: './add-discrepancy-form.component.html',
  styleUrls: ['./add-discrepancy-form.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddDiscrepancyFormComponent implements OnInit, AfterViewInit ,OnDestroy{
  @ViewChild('fileupload') public file: FileUploadForDocComponent;
  @ViewChild('urlchecklist')urlchecklist:any;
  @ViewChild('checkListURL')checkListURL: UrlchecklistComponent;
  @ViewChild('formExtendedId') private formExtendedComponent: FormExtendedComponent;
  public docItemList: any;
  public departmentList: any;
  public simpleOption: Array<IOption> = new Array<IOption>();
  public receivedId: string;
  public isUpdate: boolean = false;
  public isSave: boolean = false;
  public userList: any;
  public dynamicId: any;
  public isClicked: boolean = false;
  public selectdocument: any;
  public blockdocument: boolean;
  public disableFeild: boolean = false;
  public subscription: ISubscription;
  public spinnerFlag: boolean = true;
  public documentType: string;
  public modal: DiscrepancyForm = new DiscrepancyForm();
  editorSwap = false;
  public editor;
  submitted: boolean = false;
  actionTaken = false;
  resultAction = false;
  public errorMessage: string;
  public requestNoEnable = true;
  public dfStatus: LookUpItem;
  public failDocCodes: any[] = new Array();
  checklistName: string = "";
  isAddChecklist: boolean = false;
  fileList: any[] = new Array();
  isAddChecklistName: boolean = false;
  holdImage: boolean = false;
  holdvideo: boolean = false;
  testcaseName :any;
  videoFile: any = null;
  showAppCard: boolean = true;
  showCardFlag: boolean = true;
  testCaseType: string;
  editing = {};
  selectedCheckList:any;
  processedChecklistImages: any[] = new Array();
  checkListImages: Array<any> = [];
  @ViewChild('checkListImageModal') checkListImageModal: any;
  public slideIndex = 0;
  dFComponentSubscription: any;
  isCheckListEntered: boolean = false;
  isValidDocumentOrder: boolean = false;
  public dfCategory: LookUpItem;
  referenceFlag:boolean=false;
  tcPage=false;
  routerLink='/df/view-df';
  public inputField: any = [];
  constructor( public dfServices: DiscrepancyFormRoutesService,
    public dashBoardService: DashBoardService, public userService: UserService,
    public helper: Helper, public Service: projectsetupService,
    public deptService: DepartmentService, public route: ActivatedRoute,
    public projectplanService: projectPlanService, public _eref: ElementRef,
    public router: Router, public adminComponent: AdminComponent,
    public IqtcService: IQTCService, private permissionService: ConfigService, private masterControlService: MasterControlService) {
      this.dFComponentSubscription= adminComponent.configService.subscription(router);
  }
  ngOnDestroy(): void {
    if (this.dFComponentSubscription) {
      this.dFComponentSubscription.unsubscribe();
    }
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.receivedId != undefined) {
        this.spinnerFlag = true;
          var timer = setInterval(() => {
            if (this.file&& this.modal.testCaseName&& this.receivedId) {
              this.file.loadFileListForEdit(+this.receivedId, this.modal.testCaseName);
              clearInterval(timer);
            }
          }, 1000);
        this.spinnerFlag = false;
      }
    }, 1000);
  }

  ngOnInit() {
    this.receivedId = this.route.snapshot.params["id"];
    this.loadall();
    this.loadAllUsersBasedOnProject();
    this.route.queryParams
      .subscribe(params => {
        
       if(params.backUrl) {
        this.tcPage=true;
          this.routerLink=params.backUrl;
        }else{
          this.tcPage=false;
        }
        if (params.id  && !this.receivedId) {
          this.IqtcService.getDataForEdit(params.id,false).subscribe(jsonResp => {
            this.modal.requestRaised = false;
            this.testCaseType = jsonResp.result.testCaseType;
            this.modal.testCaseName = jsonResp.result.testCaseCode;
            this.modal.documentType = jsonResp.result.constantName;
            this.modal.testCaseId = "" + params.id
            this.documentType = this.testCaseType.toUpperCase();
            this.failDocCodes = new Array();
            this.failDocCodes.push({ 'key': this.modal.testCaseId, 'value': this.modal.testCaseName });
            this.disableFeild = true;
          })
        }
        if (params.fileId) {
          this.isUpdate = true;
          this.failDocCodes = new Array();
          this.modal = JSON.parse(params.rowData);
          this.modal.videoFileId = params.fileId;
          this.onChangeDocument();
          this.documentType = this.modal.documentCode;
          this.disableFeild = true;
          var timer = setInterval(() => {
            if (this.file) {
              this.file.loadFileListForEdit(params.id, this.modal.testCaseName).then(result=>{
                if(sessionStorage.getItem('file')){
                  this.file.setfileForDF(JSON.parse(this.permissionService.helper.decode(sessionStorage.getItem('file'))));
                  sessionStorage.removeItem('file');
                  }
              });
             
              clearInterval(timer);
            }
          }, 1000);
        }
      });

    
    if (this.receivedId){
      this.loadBasedOnId(this.receivedId);
    }else{
      this.masterControlService.loadJsonOfDocumentIfActive(this.helper.DISCREPANCY_VALUE).subscribe(res => {
        if (res != null) {
          this.inputField = JSON.parse(res.jsonStructure);
          this.formExtendedComponent.setDefaultValue(this.inputField);
        }
      });
    }
    
   
    this.dfServices.getDFStatus().subscribe(responce => {
      this.dfStatus = responce.statusList;
    });

    this.permissionService.HTTPPostAPI({"categoryName":"IssueCategory","orgId":0}, "lookup/getCategoryItemByName").subscribe(resp => {
      this.dfCategory = resp.response;
    });

    this.spinnerFlag = false;
    this.adminComponent.setUpModuleForHelpContent("134");
  }

  loadBasedOnId(id){
    this.blockdocument = true;
    this.dfServices.getDfDataById(id).subscribe(result => {
      if (!this.helper.isEmpty(result.data.jsonExtraData) && result.data.jsonExtraData != '[]')
          this.inputField = JSON.parse(result.data.jsonExtraData);
      this.modal = result.data;
      this.modal.documentType = "" + result.data.documentType;
      this.modal.testCaseId = "" + result.data.testCaseId;
      this.documentType = this.modal.documentCode;
      this.failDocCodes = new Array();
      this.failDocCodes.push({ 'key': this.modal.testCaseId, 'value': this.modal.testCaseName });
      this.isCheckListEntered=false;
    })
  }

  loadall() {
    this.adminComponent.configService.loadDocBasedOnProject().subscribe(resp => {
      this.docItemList = [];
      this.docItemList = new Array<any>();
      this.selectdocument = new Array<any>();
      resp.forEach(element => {
        if (element.key == "108" || element.key == "109" || element.key == "110" || element.key == "207" || element.key == "208") {
          this.selectdocument.push({ 'id': element.key, 'name': element.value });
        }
      });
    },
      err => {}
    );
    if (this.receivedId) {
      this.isUpdate = true;
      this.spinnerFlag = false;
    } else {
      this.spinnerFlag = false;
      this.isSave = true;
    }
  }

  onEditorCreated(quill) {
    this.editor = quill;
  }

  loadAllUsersBasedOnProject() {
    this.userService.loadAllUserBasedOnProject().subscribe(response => {
      this.simpleOption = this.helper.cloneOptions(response.result);
    });
  }

  onChangeDocument() {
    this.failDocCodes = [];
    switch ("" + this.modal.documentType) {
      case "108":
        this.documentType = "IQTC";
        this.populateFailDocuments("Fail", 1);
        break;
      case "109":
        this.documentType = "PQTC";
        this.populateFailDocuments("Fail", 3);
        break;
      case "110":
        this.documentType = "OQTC";
        this.populateFailDocuments("Fail", 2);
      case "207":
        this.documentType = "IOQTC";
        this.populateFailDocuments("Fail", 4);
      case "208":
        this.documentType = "OPQTC";
        this.populateFailDocuments("Fail", 5);
        break;
    }
  }

  populateFailDocuments(status: any, testCaseId: any) {
    this.spinnerFlag = true
    this.dfServices.populateFailDocument(status, testCaseId).subscribe(responce => {
      this.failDocCodes = responce.failDocList;
      this.spinnerFlag = false;
    });
  }

  getTestCaseCode(id){
    this.testcaseName = "";
    this.failDocCodes.forEach(element=>{
      if(id===element.key){
        this.testcaseName = element.value;
      }
    });
  }

  openSuccessUpdateSwal( formIsValid) {
    this.submitted=true;
    if (formIsValid) {
      swal({
        title: "Write your comments here:",
        input: 'textarea',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Update',
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
      })
        .then((value) => {
          if (value) {
            let userRemarks = "Comments : " + value;
              this.saveAndGoto(formIsValid,userRemarks);
          } else {
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
  }

  saveAndGoto(formIsValid,userRemarks?) {
    this.isCheckListEntered = false;
    this.submitted = false;
    this.spinnerFlag = true;
    this.showCardFlag = false;
    this.modal.checklist.forEach(checkList => {
      if (this.helper.isEmpty(checkList.checklistName))
          this.isCheckListEntered = true;
  });
  if (this.isCheckListEntered || this.isValidDocumentOrder) {
    this.submitted = true;
    this.spinnerFlag = false;
    return;
}
    if (!formIsValid) {
      this.submitted = true;
      this.spinnerFlag = false;
      return
    }
    this.modal.documentCode = this.documentType;
    this.modal.userRemarks = userRemarks;
    this.modal.jsonExtraData = JSON.stringify(this.inputField);
    this.dfServices.saveDF(this.modal).subscribe(responce => {
      this.failDocCodes = [];
      this.file.uploadFileListWithPath(responce.dto, this.helper.DISCREPANCY_VALUE).then(re=>{
      if (responce.result === "success") {
        this.modal = responce.dto;
        this.spinnerFlag = false;
       let message= this.isUpdate?"updated successfully":"saved successfully";
       
       swal({
          title: 'Success',
          text: 'Discrepancy form '+message,
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
          onClose: () => {
           if(this.tcPage){
            this.router.navigate([this.routerLink]);
           }else{
            this.router.navigate(["/df/view-df"]);
           }
            
            this.spinnerFlag = false;
            this.isUpdate = false;
          }
        });
      } else {
        swal({
          title: 'Error!',
          text: 'Oops something went Worng..',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
          onClose: () => {
            this.router.navigate(["/df/view-df"]);
            this.spinnerFlag = false;
          }
        });
      }
    });
    });

  }

  screenShot() {
    window.scrollTo(0, 0);
   
  }

  saveImage() {
    this.holdImage = true;
  }

  cancelImage() {
    this.modal.imageBase64 = null;
    this.holdImage = false;
  }

  show() {
    if(sessionStorage.getItem('file'))
    sessionStorage.removeItem('file')
    sessionStorage.setItem('file',this.permissionService.helper.encode(JSON.stringify(this.fileList)))
    this.adminComponent.openModalForScreenrecording(this.modal, this.modal.id, "/df/add-df" + (this.modal.id != 0 ?'/'+ this.modal.id : ''), this.receivedId,true);
  }

  addCheckList() {
    this.isAddChecklist = true;
    this.isAddChecklistName = true;
  }

  editRow(rowIndex) {
    for (let index = 0; index < this.modal.checklist.length; index++) {
      if (rowIndex == index)
        this.editing[index] = true;
      else
        this.editing[index] = false;
    }
  }

  deleteChecklistItem(data) {
    this.modal.checklist = this.modal.checklist.filter(event => event !== data);
    let i=0;
    this.modal.checklist.forEach(c=>c.displayOrder=++i);
    // this.modal.checklist.splice(index, 1);
  }

  onChangecheckList(){
    this.isCheckListEntered=false;
    this.modal.checklist.forEach(checkList =>{
      if(this.helper.isEmpty(checkList.checklistName))
        this.isCheckListEntered=true;
    });
  }

  addChecklistItem() {
    this.isCheckListEntered = false;
    this.modal.checklist.forEach(checkList => {
        if (this.helper.isEmpty(checkList.checklistName) )
            this.isCheckListEntered = true;
    });
    if (!this.isCheckListEntered) {
        let data = new CheckListDTO();
        data.id = 0;
        data.checklistName = "";
        data.displayOrder=this.modal.checklist.length+1;
        this.modal.checklist.push(data);
    }
  }

  saveChecklistItem() {
    let data = new CheckListDTO();
    data.checklistName = this.checklistName;
    this.modal.checklist.push(data);
    this.isAddChecklistName = false;
    this.checklistName = "";
  }

  closeChecklistItem() {
    this.isAddChecklistName = false;
    this.checklistName = "";
  }

  onSelectChecklist(item: CheckListDTO) {
    item.updatedTime = new Date();
    // this.IqtcService.updateChecklist(item).subscribe(jsonResp => {
    // });
  }
  onChangeCheckListImage(event,item) {
    this.processedChecklistImages=  new Array();
    this.checkListImages = new Array();
    for (let index = 0; index < event.target.files.length; index++) {
      const file: File = event.target.files[index];
      this.IqtcService.getFileNameAndURL(file).then((res) => {
          let image = { visible: false, fileName: file.name, imageDataUrl: res };
          item.files.push(image);
      });
  }
   
}

onChangeChecklistImage(event,item){
  // use event.originalEvent.clipboard for newer chrome versions
  var items = (event.clipboardData  || event.originalEvent.clipboardData).items;
  // find pasted image among pasted items
  var blob = null;
  for (var i = 0; i < items.length; i++) {
    if (items[i].type.indexOf("image") === 0) {
      blob = items[i].getAsFile();
    }
  }
  // load image if there is a pasted image
  if (blob !== null) {
  this.IqtcService.getFileNameAndURL(blob).then((res) => {
      let image = { visible: false, fileName: "Screenshot_"+new Date(), imageDataUrl: res };
      item.files.push(image);
  });
  }
}

plusCheckListSlides(n) {
    let index = this.processedChecklistImages.findIndex(function (element) {
        return element.visible === true;
      });
      if (n == 1) {
        let next = index + 1;
        if (next < this.processedChecklistImages.length) {
            this.processedChecklistImages[index].visible = false;
            this.processedChecklistImages[++index].visible = true;
        } else {
            this.processedChecklistImages[index].visible = false;
            this.processedChecklistImages[0].visible = true;
            index = 0;
        }
    } else {
        let prev = index - 1;
        let next =index;
        if (prev < 0) {
            this.processedChecklistImages[index].visible = false;
            this.processedChecklistImages[this.processedChecklistImages.length - 1].visible = true;
            index = this.processedChecklistImages.length - 1;
        } else {
            this.processedChecklistImages[prev].visible = true;
            this.processedChecklistImages[next].visible = false;
            index = prev;
        }
    }
} 
showCheckListModal(item:any) {
    this.selectedCheckList=item;
    this.checkListImages=this.selectedCheckList.files;
    this.processedChecklistImages=this.selectedCheckList.files;
    if(this.processedChecklistImages.length > 0){
        this.processedChecklistImages.forEach(element =>{
            element.visible=false;
        })
        this.processedChecklistImages[0].visible=true;
        this.checkListImageModal.show();
    }
} 
deleteCheckListSlide(){
    let index = this.processedChecklistImages.findIndex(function (element) {
        return element.visible === true;
      });
    this.processedChecklistImages.splice(index,1);
    if(this.processedChecklistImages.length > 0){
        this.processedChecklistImages.forEach(value => {
            value.visible=false;
        });
        this.processedChecklistImages[0].visible=true;
    } else {
        this.checkListImageModal.hide();
    }
    this.selectedCheckList.files=this.processedChecklistImages;
}
deleteCheckListImages(item){
    item.files=new Array();
} 
cancelVideo(){}

addFileToModal(event){
  this.fileList.push(event)
}

  validateReference(list) {
    if (this.checkListURL.validateList(list)){
      this.urlchecklist.hide();
      this.referenceFlag = false;
    }
  }
 
  closereference(list) {
    this.modal.urlChecklist = this.checkListURL.removeChecklist(list);
    this.urlchecklist.hide();
    this.referenceFlag = false;
  }

}
