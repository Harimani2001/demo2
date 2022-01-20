import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { VendorValidationDTO, DocumentSummaryDTO, User, UserPrincipalDTO, ExternalApprovalDTO, CommonModel, TemplateLibraryDTO } from '../../../models/model';
import { Helper } from '../../../shared/helper';
import swal from 'sweetalert2';
import { Permissions } from '../../../shared/config';
import { ConfigService } from '../../../shared/config.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { DocStatusService } from '../../document-status/document-status.service';
import { StepperClass,Page } from '../../../models/model';
import { CommonFileFTPService } from '../../common-file-ftp.service';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { IndividualDocumentItemWorkflowComponent } from '../../individual-document-item-workflow/individual-document-item-workflow.component';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { EsignAgreementMessege, externalApprovalErrorTypes } from '../../../shared/constants';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { IQTCService } from '../../iqtc/iqtc.service';
import { TemplatelibraryService } from '../templatelibrary.service';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-view-template',
  templateUrl: './view-template.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./view-template.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css']
})
export class ViewTemplateComponent implements OnInit {
  showSearch: boolean = false;
  search:boolean=false;

  @ViewChild('vendorTab') tab:any;
  spinnerFlag = true;
  @ViewChild('myTable') table: any;
  @ViewChild('documentcomments') documentcomments:any;
  viewIndividualDataFlag: boolean = false;
  popupdata:any=new Array();
  vendorValidationDTO: VendorValidationDTO = new VendorValidationDTO();
  commonModel: CommonModel = new CommonModel(); 
  modelInput:TemplateLibraryDTO=new TemplateLibraryDTO();
  routeback: any = null;
  draftData:any[]=new Array();
  publishedData:any[]=new Array();
  filterQuery:string="";
  selectAll:boolean=false;
  isSelectedPublishData:boolean=false;
  viewPdfPreview: boolean = false;
  commentsSwitch: boolean = false;
  pdfURL: any;
  outline: any[];
  pdf: any;
  error: any;
  height: any = "600px";
  heightOutline = '500px';
  public pageVariable: number = 1;
  rotation = 0;
  zoom = 1.1;
  originalSize = true;
  showAll = true;
  autoresize = true;
  fitToPage = false;
  isOutlineShown = true;
  pdfQuery = '';
  outLineList = new Array();
  commentsDocumentsList: any[] = new Array();
  draftIds: any[] = new Array();
  documentDetails: DocumentSummaryDTO=new DocumentSummaryDTO();
  getStatus:any=[];
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  @ViewChild("individualDocumentItemWorkflow") individualDocumentItemWorkflow: IndividualDocumentItemWorkflowComponent;
  selectedDataForWorkflow:any;
  viewSignature: boolean = false;
  public signaturePadOptions: Object = {
    'minWidth': 1,
    'canvasWidth': 540,
    'canvasHeight': 170,
  };
  esignForm:any;
  public errorList: any[] = new Array<any>();
  agreementCheck: boolean = false;
  esignSaveModal: User = new User();
  submitted: boolean;
  comments: any;
  public finalstatus: boolean = true;
  signature: any = "";
  public onExternalApprovalForm: FormGroup;
  externalApprovalDTO:ExternalApprovalDTO;
  isIndividualView:boolean=false;
  @ViewChild('externalApprovalmodal') externalApprovalmodal:any;
  page:Page=new Page();
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  currentLevelIndex:number;
  cards=['one'];
  public tableView: boolean = false;
  vendorListForPublish:any[]=new Array();
  loginUserId: any;





  constructor(public fb: FormBuilder, public esignAgreementMessage: EsignAgreementMessege,private commonService: CommonFileFTPService,
    public vendorService: TemplatelibraryService, public helper: Helper, private permissionService: ConfigService, 
    private route: ActivatedRoute, private routers: Router, public adminComponent: AdminComponent, public docStatusService: DocStatusService,
    public externalApprovalErrorTypes:externalApprovalErrorTypes, public iqtcServices: IQTCService,private sanitizer: DomSanitizer) {
    this.isIndividualView=false;
    this.route.queryParams.subscribe(query => {
      if (!this.helper.isEmpty(query.id)) {
        this.adminComponent.taskDocType = this.helper.TEMPLATE_LIBRARY_VALUE;
        this.adminComponent.taskEquipmentId = 0;
        this.adminComponent.taskDocTypeUniqueId = query.id;
        this.routeback = query.status;
        this.isIndividualView=true;
        this.helper.changeMessageforId(query.id)
      }
    });
    this.adminComponent.setUpModuleForHelpContent(this.helper.TEMPLATE_LIBRARY_VALUE);
    this.adminComponent.taskDocType = this.helper.TEMPLATE_LIBRARY_VALUE;
    this.adminComponent.taskEquipmentId = 0;
    this.adminComponent.taskDocTypeUniqueId = "";
    this.adminComponent.taskEnbleFlag = true;
  }
  userId:any;
  ngOnInit() {
    this.page.pageNumber = 0;
    this.page.size = this.helper.PAGE_SIZE;
    // this.permissionService.loadCurrentUserDetails().subscribe(res => {
    //   this.currentUser = res;
    //   this.userId = res.id;
    // })
    // this.setPage({ offset: 0 });
    this.permissionService.loadCurrentUserDetails().subscribe(res => {
      this.currentUser = res;
      this.setPage({ offset: 0 });
    })

    this.search=true;

  }
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.loadAllData();
 
  }

  saveCurrentTab(tabName){
    this.permissionService.saveUserPreference(this.helper.TEMPLATE_LIBRARY_VALUE,tabName).subscribe(res =>{});
  }

  changeview(value: any) {
    this.tableView = value;
    this.loadAllData();
    //this.config.saveUserPreference("Home",this.tableView?"table":"card").subscribe(res =>{});
  }

  tabChange(tabName: any) {
    this.permissionService.saveUserPreference(this.helper.TEMPLATE_LIBRARY_VALUE,tabName).subscribe(res =>{
      this.tab.activeId = tabName;
      this.viewPdfPreview = false;
      this.isSelectedPublishData = false;
      if (tabName === 'draft') {
        this.page.pageNumber = 0;
        this.setPage({ offset: 0 });
        this.viewPdfPreview = true;
      } else if (tabName === 'published') {
        this.page.pageNumber = 0;
        this.setPage({ offset: 0 });
      } else if (tabName === 'summary') {
        this.search = false;
      } else {
        this.search = false;
      }
    });
  }

  tableData:any;
  loadAllData() {
    this.page.pageNumber = 0;
    if(this.tableView === false)
      this.modelInput.view = "Table";
    else
    this.modelInput.view = "Card";
    this.spinnerFlag = true;
    this.modelInput.userId = this.currentUser.id
    this.vendorService.loadTableData(this.page.pageNumber, this.modelInput).subscribe(response => {
      this.spinnerFlag = false
      if (response.list != null) {
        this.page.totalElements = response.totalElements;
        this.page.totalPages = response.totalPages; 
        this.tableData = response.list
      }
    }, error => { this.spinnerFlag = false });
  }


  downloadImage(data) {
  return data.bannerImage
  }

  loadAll(tabId?){
    this.search = false;
    this.draftData = [];
    this.publishedData = [];
    var currentTab = 'summary';
    if (tabId) {
      currentTab = tabId;
    }
    if(currentTab != 'draft'){
      this.selectAll=false
    }
    if (currentTab === 'summary'){
    }else if (currentTab != 'audit') {
      if(!this.isIndividualView)
        this.spinnerFlag = true;

        this.search = true;
        
      this.commentsDocumentsList= new Array();
      this.vendorService.loadVendorValidationDetailsBasedOnProject(this.page.pageNumber,currentTab).subscribe(jsonResp => {
        this.page.totalElements = jsonResp.totalElements;
        this.page.totalPages = jsonResp.totalPages;  
        if (jsonResp.unpublishedList && jsonResp.unpublishedList.length > 0){
            this.draftData = jsonResp.unpublishedList;
          }
          if (jsonResp.publishedList && jsonResp.publishedList.length > 0){
            this.publishedData = jsonResp.publishedList;
          }
          if(this.selectAll &&currentTab == 'draft'){
            this.draftData.forEach(d => {
              d.publishedflag = true;
            });
          }
          if(!this.isIndividualView)
            this.spinnerFlag = false;
        },
        err => {
          this.spinnerFlag = false;
        }
      );
    }else{
      this.spinnerFlag = false;
    }
  }

  createVendor() {
      this.routers.navigate(["/templatelibrary/add-template"]);   
  }

 
 
  onClickClose() {
    this.adminComponent.taskDocTypeUniqueId = "";
    this.adminComponent.taskEquipmentId = 0;
    setTimeout(() => {
      this.permissionService.getUserPreference(this.helper.TEMPLATE_LIBRARY_VALUE).subscribe(res => {
        if (res.result)
          this.tab.activeId = res.result;

        if ('published' === this.tab.activeId) {
          this.loadAllData();
        } else {
          this.loadAllData();
        }
      });
    }, 10)
    this.viewIndividualDataFlag = false;
  }


  downloadFileOrViewAfterPublish(viewFlag) {
      this.spinnerFlag = true;
      const ids: any[] = new Array();
      const stepperModule: StepperClass = new StepperClass();
      stepperModule.constantName = this.helper.TEMPLATE_LIBRARY_VALUE;
      ids.push(this.vendorValidationDTO.id);
      stepperModule.documentIds = ids;
      this.permissionService.HTTPPostAPI(stepperModule, 'workFlow/pdfPreviewfortimeline').subscribe(response => {
        var responseBolb: any[] = this.b64toBlob(response.pdf)
        const blob: Blob = new Blob(responseBolb, { type: "application/pdf" });
        if (viewFlag) {
          this.pdfURL = URL.createObjectURL(blob);
          this.spinnerFlag = false;
        }
      }, error => {
        this.spinnerFlag = false;
      })
  }


  private b64toBlob(b64Data) {
    var sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return byteArrays;
  }
  downloadFileOrView(input, viewFlag) {
      this.spinnerFlag = true;
      let filePath = input.filePath;
      let fileName = input.fileName;
      this.commonService.loadFile(filePath).subscribe(resp => {
        let contentType = this.commonService.getContentType(fileName.split(".")[fileName.split(".").length - 1]);
        var blob: Blob = new Blob([resp], { type: contentType });
        if (viewFlag) {
          if (!contentType.match(".pdf")) {
            this.commonService.convertFileToPDF(blob, fileName).then((respBlob) => {
              this.pdfURL = URL.createObjectURL(respBlob);
              this.spinnerFlag = false;
            });
          } else {
            this.pdfURL = URL.createObjectURL(blob);
            this.spinnerFlag = false;
          }
        } else {
          this.iqtcServices.auditForMultipleFileDownload(input.vendorCode, fileName, this.helper.TEMPLATE_LIBRARY_VALUE,input.id).subscribe(resp => { });
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
          this.spinnerFlag = false;
        }
      }, error => {
        this.spinnerFlag = false;
      })
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
        dataObj.approverComments="Comments : " + value;
        this.deleteTemplateLibrary(dataObj);
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


 loadImage() {
    console.log("Image is loaded");
  }

  deleteTemplateLibrary(dataObj): boolean {
    dataObj.documentFormData = "";
    let status = false;
    this.vendorService.deleteTemplateLibrary(dataObj)
      .subscribe((resp) => {
        if (resp.result) {
          this.ngOnInit();
          status = true;
          swal({
            title: 'Deleted!',
            text: dataObj.projectName + ' has been deleted',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
                this.onClickClose();
                this.viewIndividualDataFlag = false;
                this.closeIndividualData();
            }
          });
        } else {
          status = false;
          swal({
            title: 'Not Deleted!',
            text: dataObj.vendorCode + 'has  not been deleted',
            type: 'error',
            timer: this.helper.swalTimer,
          }
          );
        }
      }, (err) => {
        status = false;

        swal(
          'Not Deleted!',
          dataObj.vendorCode + 'has  not been deleted',
          'error'
        );

      });
    return status;
    }

  closeIndividualData() {
    this.viewIndividualDataFlag = false
    this.adminComponent.taskDocType = this.helper.TEMPLATE_LIBRARY_VALUE;
    this.adminComponent.taskDocTypeUniqueId = "";
    this.adminComponent.taskEquipmentId = 0;
  }

  

  toEdit(id) {
    this.routers.navigate(['/templatelibrary/add-template',id]);
  }

  
  selectAllData(event){
    this.selectAll = event.currentTarget.checked;;
    if(event.currentTarget.checked){
      this.draftData.forEach(d => {
        d.publishedflag = true;
      });
      this.isSelectedPublishData=true;
    }else{
      this.draftData.forEach(d => {
        d.publishedflag = false;
      });
      this.isSelectedPublishData=false;
    }
  }

  

 
  onClickSearch() {
    this.showSearch = !this.showSearch;
    if (true)
      setTimeout(() => {
        $('#searchBox').focus();
      }, 200);
  }

  
}

