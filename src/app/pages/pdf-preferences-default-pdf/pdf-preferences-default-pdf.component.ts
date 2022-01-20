import { ImportSettingComponent } from './../import-setting/import-setting.component';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { CssDTO, dropDownDto, HeaderOrFooterChildDTO, HeaderOrFooterDTO, LookUpItem } from '../../models/model';
import { Helper } from '../../shared/helper';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { pdfPreferencesServices } from '../pdf-preferences/pdfPreferences.services';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
@Component({
  selector: 'app-pdf-preferences-default-pdf',
  templateUrl: './pdf-preferences-default-pdf.component.html',
  styleUrls: ['./pdf-preferences-default-pdf.component.css']
})
export class PdfPreferencesDefaultPdfComponent implements OnInit {
  @Input('document') document:boolean;
  @Input('isDocChapter') isDocChapter: boolean;
  @Input('docId') docId:any;
  @ViewChild('headerFooterConfigurationModal') headerFooterConfigurationModal:ModalBasicComponent;
  @ViewChild('copyHorFConfigurationModal') copyHorFConfigurationModal:any;
  @ViewChild('selectVariableModal') selectVariableModal:ModalBasicComponent;
  @ViewChild('customizeNameModal') customizeNameModal:ModalBasicComponent;
  @ViewChild('importPDFSetting') importPDFSetting:ImportSettingComponent;
  
  validationMessage:string='';
  existingDocumentNumber:String;
  modal: Permissions = new Permissions('', false);
  cssDTOModel: CssDTO = new CssDTO();
  headerFlag=false;
  footerFlag=false;
  mainPageFlag=false;
  configurationHOrF:HeaderOrFooterDTO;
  dropDownVariablesHOrF:LookUpItem[]=new Array();
  waterMarkDropDowns:LookUpItem[]=new Array();
  defaultPDFSpinnerFlag = false;
  public documentList: dropDownDto[] =new Array<dropDownDto>();
  type: any;
  docList: dropDownDto[] =new Array<dropDownDto>();
  applyCopy: boolean = false;
  isCopyHeader:boolean=false;
  isCopyFooter:boolean=false;
  isCopyMainPage:boolean=false;
  waterMarkSwap:boolean=false;
  listOfVariables:any[]=new Array();
  uniqueKey='';
  seletedJson:any=new Object();


  constructor(public pdfService:pdfPreferencesServices,private adminComponent: AdminComponent,
    private lookUpService:LookUpService, public helper: Helper,public config: ConfigService) { }

  ngOnInit() {
    if (!this.document) { // common pdf settings
      this.onDocumentChange("0");
    }
    else if (this.isDocChapter || this.docId) { //for table-of-content or organization form navigation
      this.onDocumentChange(this.docId);
      this.getDocumentList();
    } else {
      this.getDocumentList();
    }
     
    this.dropDownVariablesHOrFMethod();
    this.waterMarkDropDownVariables();
    this.adminComponent.setUpModuleForHelpContent("153");
    this.config.loadPermissionsBasedOnModule("153").subscribe(resp => {
      this.modal = resp;
    });
  }

  getDocumentList() {
    this.config.HTTPPostAPI(!this.isDocChapter,"admin/loadDocumentForPdfSetting").subscribe(resp => {
      this.documentList = resp;
    })
  }

  getDocumentListOnPermission() {
    this.lookUpService.loadDocumentForTableOfContentOnPermissions().subscribe(resp => {
      this.docList = resp;
      this.docList = this.docList.filter(data=>data.key!=this.cssDTOModel.documentType);
    })
  }

  checkCopyApply(doc,list){
    doc.configuration=!doc.configuration;
    this.applyCopy=(list.filter(doc=>doc.configuration).length>0);
  }

  onDocumentChange(documentType: any) {
    this.validationMessage='';
    this.isCopyHeader = false;
    this.isCopyFooter = false;
    this.isCopyMainPage=false;
    this.defaultPDFSpinnerFlag = true;
    this.pdfService.loadCssDataForFormFields(documentType).subscribe(resp => {
      if (resp.result == "success") {
        this.defaultPDFSpinnerFlag = false;
        if (resp.list != null) {
          this.cssDTOModel = resp.list;
          this.existingDocumentNumber=new String(this.cssDTOModel.documentNumber);
          this.cssDTOModel.documentType=documentType;
          this.defaultPDFSpinnerFlag = false;
          this.headerFlag = this.cssDTOModel.headerConfiguration != null;
          this.footerFlag = this.cssDTOModel.footerConfiguration != null;
          this.mainPageFlag= this.cssDTOModel.mainPageConfiguration != null;
          if(this.headerFlag)
          this.isCopyHeader = this.cssDTOModel.headerConfiguration.childs.length>0;
          if(this.footerFlag)
          this.isCopyFooter = this.cssDTOModel.footerConfiguration.childs.length>0;
          if (this.mainPageFlag)
            this.isCopyMainPage = this.cssDTOModel.mainPageConfiguration.childs.length > 0;
          if(this.cssDTOModel.pdfDocStatusWaterMark)
          this.waterMarkSwap = true;
        } else {
          this.cssDTOModel = new CssDTO();
        }
      }
    });
  }

  applyCopyConfigurationSwal(docList) {
    var obj = this
    swal({
      title: 'Are you sure?', text: 'You wont be able to revert', type: 'warning',
      showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, apply it!', cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success m-r-10', cancelButtonClass: 'btn btn-danger',allowOutsideClick: false,
      buttonsStyling: false
    }).then(function () {
      obj.copyheaderOrFooterConfiguration(docList);
    });
  }

  copyheaderOrFooterConfiguration(documentList){
    let ids = documentList.filter(f=> true===f.configuration).map(m=>m.key);
    this.cssDTOModel.type = this.type;
    this.cssDTOModel.copyConfigIds = ids;
    this.adminComponent.spinnerFlag=true;
    this.pdfService.copyheaderOrFooterConfiguration(this.cssDTOModel).subscribe(resp => {
      this.adminComponent.spinnerFlag=false;
      if (resp.result == "success") {
        this.copyHorFConfigurationModal.hide();0
        swal({
          title: 'Copied Successfully!',
          text: '',
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        swal({
          title: 'Error',
          text: 'oops something went wrong',
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
      }
    });
  }

  defaultPdfView() {
    this.defaultPDFSpinnerFlag = true;
    
    this.pdfService.loadDefaultPdf(this.cssDTOModel).subscribe(resp => {
      if (resp != null) {
        this.adminComponent.previewByBlob('Sample.pdf',resp,true,'Preview of Document');
        this.defaultPDFSpinnerFlag = false;
      }
    });
  }
  dropDownVariablesHOrFMethod() {
    this.dropDownVariablesHOrF=new Array();
    this.lookUpService.getlookUpItemsBasedOnCategory("defaultPDFVariable").subscribe(result => {
      this.dropDownVariablesHOrF = result.response;
    });
  }
  waterMarkDropDownVariables() {
    this.lookUpService.getlookUpItemsBasedOnCategory("WatermarkDropdown").subscribe(result => {
      this.waterMarkDropDowns = result.response;
    });
  }
  getFileNameAndURL(event, dto: HeaderOrFooterChildDTO) {
    let file: File = event.target.files[0];
    dto.text = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      dto.image = reader.result;
    }
    reader.readAsDataURL(file);
  }

  headerFooterConfiguration(type){
    this.headerFooterConfigurationModal.show();
    this.headerFooterConfigurationModal.spinnerShow();
    switch (type) {
      case 'header':
        if (!this.cssDTOModel.headerConfiguration) {
          this.cssDTOModel.headerConfiguration = new HeaderOrFooterDTO();
          this.cssDTOModel.headerConfiguration.childs.push(new HeaderOrFooterChildDTO());
        }
        this.cssDTOModel.headerConfiguration.type = type;
        this.configurationHOrF = this.cssDTOModel.headerConfiguration;
        break;
      case 'footer':
        if (!this.cssDTOModel.footerConfiguration) {
          this.cssDTOModel.footerConfiguration = new HeaderOrFooterDTO();
          this.cssDTOModel.footerConfiguration.childs.push(new HeaderOrFooterChildDTO());
        }
        this.cssDTOModel.footerConfiguration.type = type;
        this.configurationHOrF = this.cssDTOModel.footerConfiguration;
        break;
      case 'mainPage':
        if (!this.cssDTOModel.mainPageConfiguration) {
          this.cssDTOModel.mainPageConfiguration = new HeaderOrFooterDTO();
          this.cssDTOModel.mainPageConfiguration.childs.push(new HeaderOrFooterChildDTO());
        }
        this.cssDTOModel.mainPageConfiguration.type = type;
        this.configurationHOrF = this.cssDTOModel.mainPageConfiguration;
        break;
    }
    this.headerFooterConfigurationModal.spinnerHide();
  }
  enableHeader() {
    this.headerFlag = !this.headerFlag;
    if (this.headerFlag) {
      this.cssDTOModel.headerConfiguration =new HeaderOrFooterDTO();
    } else {
      this.cssDTOModel.headerConfiguration = null;
    }
  }
  enableFooter() {
    this.footerFlag = !this.footerFlag;
    if (this.footerFlag) {
      this.cssDTOModel.footerConfiguration =new HeaderOrFooterDTO();
    } else {
      this.cssDTOModel.footerConfiguration = null;
    }
  }

  enableMainPage() {
    this.mainPageFlag = !this.mainPageFlag;
    if (this.mainPageFlag) {
      this.cssDTOModel.mainPageConfiguration = new HeaderOrFooterDTO();
    } else {
      this.cssDTOModel.mainPageConfiguration = null;
    }
  }
  addOrRemoveChild(index: number, addOrRemoveFlag: boolean, list: HeaderOrFooterChildDTO[]) {
    if (addOrRemoveFlag) {
      //add 
      let child = new HeaderOrFooterChildDTO();
      child.order=list.length+1
      list.push(child);
      list= list.sort((n1,n2) => n1.order - n2.order);
      list=list.reverse();
    } else {
      //remove
      list.splice(index, 1);
    }
  }

  copyHorFConfiguration(type){
    this.type = type;
    this.copyHorFConfigurationModal.show();
  }

  submitHeaderOrFooter(){
    switch (this.configurationHOrF.type) {
      case 'header':
        this.cssDTOModel.headerConfiguration = this.configurationHOrF;
        break;
      case 'footer':
        this.cssDTOModel.footerConfiguration = this.configurationHOrF;
        break;
      case 'mainPage':
        this.cssDTOModel.mainPageConfiguration = this.configurationHOrF;
        break;
    }
    this.headerFooterConfigurationModal.hide();
  }

  saveAndGoto() {
    this.defaultPDFSpinnerFlag = true;
    if (this.waterMarkSwap)
      this.cssDTOModel.pdfWaterMark = null;
    else
      this.cssDTOModel.pdfDocStatusWaterMark = null;
    if (this.helper.isNonWorkFlowDocument(this.cssDTOModel.documentType) && this.cssDTOModel.documentNumber) {
      this.isDocumentNumberExists(this.cssDTOModel.documentNumber, this.cssDTOModel.documentType).then(resp => {
        if (resp) {
          this.save();
        }else{
          this.defaultPDFSpinnerFlag = false;
        }
      })
    } else {
      this.save();
    }
  }

  save(){
    this.pdfService.saveCssForFormFields(this.cssDTOModel).subscribe(resp => {
      this.defaultPDFSpinnerFlag = false;
      if (resp.result == "success") {
        this.onDocumentChange(this.cssDTOModel.documentType);
        swal({
          title: 'Saved Successfully!',
          text: '',
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        this.defaultPDFSpinnerFlag = false;
        swal({
          title: 'Error',
          text: 'oops something went wrong',
          type: 'error',
          timer: 2000,
          showConfirmButton: false
        })
      }
    });
  }

  isDocumentNumberExists(text, documentType): Promise<any> {
    return new Promise<any>(resolve => {
      if (this.existingDocumentNumber != text) {
        let json = { documentNumber: text, documentType: documentType }
        this.config.HTTPPostAPI(json, 'workflowConfiguration/isDocumentNumberExists').subscribe(resp => {
          this.validationMessage = resp.message;
          if (!this.validationMessage) {
            resolve(true);
          }
          resolve(false);
        }, errr => resolve(false));
      } else {
        resolve(true);
      }
    });
  }

  orderList(list:any[]){
    let index = 1;
    list.forEach(e => e.order = index++);
  }

  moveUpOrDown(list: any[], index, upFlag) {
    let i:number=-1;
    if (upFlag) {
      i = index - 1;
    } else {
      i = index + 1;
    }
    if (i!=-1) {
      let element = list[index];
      list[index] = list[i];
      list[index].order=index+1;
      list[i] = element;
      list[i].order=i+1;
    }
  }

  selectAll(event,list){
    list.forEach(element => {
      element.checked=event.srcElement.checked;
    });
  }

  selectCheckBox(list: any[], json) {
    json.checked = !json.checked;
    let selected = list.filter(e => e.checked).sort((a, b) => a.order - b.order);
    let unSelected = list.filter(e => !e.checked).sort((a, b) => a.order - b.order);
    list = [];
    list.push(...selected);
    list.push(...unSelected);
    let index = 1;
    list.forEach(e => e.order = index++);
    (<any>this.cssDTOModel).checkList = list;
  }

  checkAlreadyDocumentNumberExists(text) {
    return new Promise<boolean>(resolve => {
      this.validationMessage = '';
      if (this.existingDocumentNumber != text) {
        this.adminComponent.spinnerFlag = true;
        let json = { documentNumber: text, documentType: this.cssDTOModel.documentType }
        this.config.HTTPPostAPI(json, 'workflowConfiguration/isDocumentNumberExists').subscribe(resp => {
          this.validationMessage = resp.message;
          resolve(this.validationMessage?false:true);
          this.adminComponent.spinnerFlag = false;
        }, err => {
          this.adminComponent.spinnerFlag = false;
          resolve(false);
        });
      }
    })
  }

  saveDocumentNumber(newDocumentNumber) {
    this.checkAlreadyDocumentNumberExists(this.cssDTOModel.documentNumber).then(resp=>{
      if(resp){
        this.adminComponent.spinnerFlag = true;
        let json = { documentNumber: newDocumentNumber, documentType: this.cssDTOModel.documentType }
        this.config.HTTPPostAPI(json, 'workflowConfiguration/updateDocumentNumber').subscribe(resp => {
          
          if (resp.result == "success") {
            swal({
              title: 'Updated Successfully!',
              text: '',
              type: 'success',
              timer: 2000,
              showConfirmButton: false,
              onClose:()=>{
                // this.onDocumentChange(this.cssDTOModel.documentType);
              }
            });
          } else {
            this.defaultPDFSpinnerFlag = false;
            swal({
              title: 'Error',
              text: 'oops something went wrong',
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            })
          }
          this.adminComponent.spinnerFlag = false;
        }, err => {
          this.adminComponent.spinnerFlag = false;
        });
      }
    })
  }

  selectVariablesForPDF(key) {
   this.uniqueKey=key;
    switch (key) {
      case 'chapter9':
        this.listOfVariables = this.cssDTOModel.approvalHistoryColumns;
        break;

      case 'chapter10':
        this.listOfVariables = this.cssDTOModel.revisionHistoryColumns;
        break;

      case 'chapter11':
        this.listOfVariables = this.cssDTOModel.selectedColumns;
        break;
      case 'chapter20':
        this.listOfVariables = this.cssDTOModel.preApprovalHistoryColumns;
        break;

    }
    this.selectVariableModal.show();
  }

  customizeNameForPDF(json) {
    this.seletedJson=json;
    this.customizeNameModal.show();
   }

  selectVariableOnChanges(list, doc) {
    doc.checked = !doc.checked;
    if (!doc.checked) {
      doc.name = doc.defaultName;
    }
    let selected = list.filter(e => e.checked).sort((a, b) => a.order - b.order);
    let unSelected = list.filter(e => !e.checked).sort((a, b) => a.order - b.order);
    list = [];
    list.push(...selected);
    list.push(...unSelected);
    let index = 1;
    list.forEach(e => e.order = index++);
    this.listOfVariables = list;
  }
  
  applySelectVariableModal(list: any[]) {
    switch (this.uniqueKey) {
      case 'chapter9':
        this.cssDTOModel.approvalHistoryColumns = list;
        break;

      case 'chapter10':
        this.cssDTOModel.revisionHistoryColumns = list;
        break;

      case 'chapter11':
        this.cssDTOModel.selectedColumns = list;
        break;

      case 'chapter20':
        this.cssDTOModel.preApprovalHistoryColumns = list;
        break;
    }
    this.selectVariableModal.hide();

  }
  onChangeType(header){
    header.text="";
  }
 
}
