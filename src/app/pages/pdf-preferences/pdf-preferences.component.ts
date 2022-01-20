import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IOption } from 'ng-select';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { CSVTemplate, csvTemplateModel, CustomExcelValidateDTO, CustomPdfSettingModel, dropDownDto } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { Permissions } from './../../shared/config';
import { pdfPreferencesServices } from './pdfPreferences.services';

@Component({
  selector: 'app-pdf-preferences',
  templateUrl: './pdf-preferences.component.html',
  styleUrls: ['./pdf-preferences.component.css',
   '../../../../node_modules/sweetalert2/dist/sweetalert2.min.css',
   '../../../../node_modules/ng2-toasty/style-bootstrap.css',
   '../../../../node_modules/ng2-toasty/style-default.css',
   '../../../../node_modules/ng2-toasty/style-material.css'],
  encapsulation: ViewEncapsulation.None
})
export class PdfPreferencesComponent implements OnInit {
  @ViewChild('variableModal') csvTemplateModal;
  @ViewChild('myFile') myFile: ElementRef;
  @ViewChild('pdfTab') tab: any;
  isFileExists:boolean=false;
  docxFile: any;
  public documentListForCustom: dropDownDto[]= new Array<dropDownDto>();
  multipleDoc: boolean = false;
  ParentMenu: any = "";
  customDtoModel: CustomPdfSettingModel = new CustomPdfSettingModel();
  multipleOptionList: Array<IOption> = new Array<IOption>();
  workFlowOptionList: Array<IOption> = new Array<IOption>();
  frezzeHistoryOptionList:Array<IOption> = new Array<IOption>();
  selectedTabId: string = "";
  spinnerFlag: boolean = false;
  isDocument: boolean = false;
  isPassword: boolean = false;
  isWaterMark: boolean = false;
  isDocNumber: boolean = false;
  pdfViewIcon: boolean = false;
  dataView: boolean = true;
  workFlowFlagLboolean = false;
  selectedColumns: any = new Array();
  selectedWorkFlowColumns: any = new Array();
  selectedFreezeHistoryColumns: any = new Array();
  customExcelValidateList:CustomExcelValidateDTO[]=new Array();
  inputField: any = new Array();
  linkedInputFeild: any =new Array();
  extendedForm:any;
  equipmentExtendedForm:any;
  batchExtendedForm:any;
  jsonInputField:any;
  viewData=false;
  isExcelFile:boolean=false;
  isShowExcelDetails:boolean=false;
  fileExtension:string="";
  sheetName:string="";
  rowNo:string="";
  workFlowSheetName:string="";
  workFlowRowNo:string="";
  sheetNamesList:dropDownDto[] =new Array<dropDownDto>();
  tabName:string = "Common pdf setting";
  modal: Permissions = new Permissions('', false);
  fileValidation='';
  sequenceNumberLimitArray=new Array();
  selectedvariables= new Array();//add all clicked variables in to list for csv export.
  selectedLables= new Array();//add all clicked variables in to list for csv export.
  selectedCategory= new Array();//add all clicked variables in to list for csv export.
  csvModel:CSVTemplate = new CSVTemplate();
  csvTempMap = new Map<string,string>();
  csvTemp = new Map<string,csvTemplateModel>();
  csvSaveSpinner:boolean = false;
  isCsvVariables:boolean = false;
  isMultiWorkFlow:boolean = false;
  disableSequenceStart=false;
  documentId: any = 0;

  constructor(private toastyService: ToastyService, private adminComponent: AdminComponent, private modalService: NgbModal,
    public helper: Helper, public pdfService: pdfPreferencesServices, public permissionService: ConfigService,
    private route: ActivatedRoute) {
      this.route.queryParams.subscribe(query => {
        if (query.docId)
          this.documentId = query.docId;
      });
  }
  
  ngOnInit() {
    this.getDocumentCustomList();
    this.adminComponent.setUpModuleForHelpContent("153");
    this.permissionService.loadPermissionsBasedOnModule("153").subscribe(resp => {
      this.modal = resp;
    });
    if (this.documentId) {
      const interval = setInterval(() => {
        if (this.tab) {
          this.selectedTabId = this.tab.activeId = 'tab-2';
          this.tabName = "Document Setting";
          clearInterval(interval);
        }
      }, 100)
    }
  }

  check(){
    this.permissionService.HTTPPostAPI(this.customDtoModel.docType,"pdfSetting/checkAnyDocumentIsPublishedOfProject").subscribe(resp=>{
      this.disableSequenceStart=resp;
    })
  }


  selectFile(event) {
    this.isFileExists=true;
    this.isExcelFile=false;
    this.isShowExcelDetails=false;
    this.docxFile = event.target.files[0];
    if (this.docxFile.name.toLocaleLowerCase().match('.doc') || this.docxFile.name.toLocaleLowerCase().match('.docx')){
      this.uploadFile();
    }else{
      this.fileValidation="Please upload .doc or .docx file";
    }
  }

  getSheetNamesFormExcel(){
    let formData: FormData = new FormData();
    formData.append('file', this.docxFile, this.docxFile.name);
    this.pdfService.getSheetNamesFormExcel(formData).subscribe(resp => {
      this.sheetNamesList=resp;
    });
  }
  
  validateFile(){
    let errors:any[]=new Array();
    this.customExcelValidateList=[];
    if(!this.isDocument){
      this.inputField.forEach(item => {
        item.form.forEach(data => {
          if(data.type==='table'){
            if(!this.helper.isEmptyWithoutZero(data.sheetNo) && !this.helper.isEmptyWithoutZero(data.rowNo)){
              let dto=new CustomExcelValidateDTO();
              dto.referenceId=data.id;
              dto.sheetNo=data.sheetNo;
              dto.rowNo=data.rowNo;
              this.customExcelValidateList.push(dto);
            }else{
              errors.push(false);
            }
          }
        });
      });
    }else{
      if(this.multipleDoc){
        if(!this.helper.isEmptyWithoutZero(this.sheetName) && !this.helper.isEmptyWithoutZero(this.rowNo)){
          let dto=new CustomExcelValidateDTO();
          dto.referenceId=this.customDtoModel.docType;
          dto.sheetNo=this.sheetName;
          dto.rowNo=this.rowNo;
          this.customExcelValidateList.push(dto);
        }else{
          errors.push(false);
        }
      }
    }
    if(this.customDtoModel.workFlow){
      if(!this.helper.isEmptyWithoutZero(this.workFlowSheetName) && !this.helper.isEmptyWithoutZero(this.workFlowRowNo)){
        let dto=new CustomExcelValidateDTO();
        dto.referenceId="WorkFlow";
        dto.sheetNo=this.workFlowSheetName;
        dto.rowNo=this.workFlowRowNo;
        this.customExcelValidateList.push(dto);
      }else{
        errors.push(false);
      }
    }
    if(errors.length ==0){
      this.customDtoModel.customExcelValidateList=this.customExcelValidateList;
      this.uploadFile();
    }
  }
  uploadFile(){
    if( this.fileValidation==''){
    this.spinnerFlag = true;
    if (this.customDtoModel.mappingId === "Document"||this.customDtoModel.mappingId ==="Form"||this.customDtoModel.mappingId ==="Template")
      this.customDtoModel.mappingId = "0";
    let formData: FormData = new FormData();
    formData.append('file', this.docxFile, this.docxFile.name);
    formData.append('dto', JSON.stringify(this.customDtoModel));
    this.pdfService.saveUploadedFile(formData).subscribe(resp => {
      this.spinnerFlag = false;
      this.isExcelFile=false;
      if (resp.result !== "success") {
        this.myFile.nativeElement.value = "";
        swal({
          title: 'Error',
          text: resp.result + ' with form data',
          type: 'error',
          showConfirmButton: true
        });
      } else {
        if (resp.fileName != null)
          this.customDtoModel.selectedFileName = resp.fileName;
        swal({
          title: 'success',
          text: 'Document Validated Successfully',
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }
  }

  

  onChangePassword(){
   if(!this.isPassword)
     this.customDtoModel.password = "";
  }
  onChangeWorterMark(){
    if(!this.isWaterMark)
      this.customDtoModel.watermark = "";
   }
   onChangeDocNumber(){
     if(!this.isDocNumber)
         this.customDtoModel.documentNumber = "";
   }
  getDocumentCustomList() {
    this.permissionService.HTTPPostAPI('', 'admin/loadDocumentForPdfCustomSetting').subscribe(resp => {
      this.documentListForCustom = resp;
    });
  }

  openLg(content) {
    this.modalService.open(content, { size: 'lg' });
  }
  

  docChanged(docType) {
    this.isMultiWorkFlow = true;
    this.selectedCategory = new Array();
    this.selectedLables = new Array();
    this.selectedvariables = new Array();
    this.isExcelFile=false;
    this.isShowExcelDetails=false;
    this.isFileExists=false;
    this.csvModel.docType = docType;
    if(!this.helper.isEmpty(this.myFile))
      this.myFile.nativeElement.value = "";
    this.extendedForm="";
    this.pdfViewIcon = false;
    let mappingId = this.documentListForCustom.filter(d => d.key == docType)[0].mappingId;
    this.spinnerFlag = true;
    this.isDocument = false;
    this.multipleDoc = false;
    this.isPassword = false;
    this.isWaterMark = false;
    this.isDocNumber = false;
    this.selectedColumns = [];
    this.selectedWorkFlowColumns = [];
    this.pdfService.loadCustomPdfSettings(docType, mappingId).subscribe(resp => {
      if (resp.result != null) {
        this.customDtoModel = resp.result;
        this.customDtoModel.mappingId = this.documentListForCustom.filter(d => d.key == this.customDtoModel.docType)[0].mappingId;
        if (this.customDtoModel.mappingId === "Document"||this.customDtoModel.mappingId === "Template")
          this.isDocument = true;
        if(!this.helper.isEmpty(this.customDtoModel.fileName)){
          this.fileExtension=this.customDtoModel.fileName.split(".")[this.customDtoModel.fileName.split(".").length-1]
          if(this.fileExtension === "xls" || this.fileExtension === "xlsx"){
            this.sheetNamesList=this.customDtoModel.sheetNames;
            this.isShowExcelDetails=true;
          }
        }
        this.inputField = this.customDtoModel.formVariable;
        this.inputField.forEach(element => {
          element.form = JSON.parse(element.form);
        });
        this.linkedInputFeild=this.customDtoModel.linkedForm;
        this.linkedInputFeild.forEach((element,index) => {
          element.form = JSON.parse(element.form);
          let sno={name: "SNo-AutoIncrement", type: "text", label: "S.No"};
          element.form.push(sno);
          this.loadLinkedFormTable(element,index);
          if(element.table)
          this.onChangeLinkedFormMultiSelect(element,this.customDtoModel.selectedLinkedFormVariable[index])
        });
        this.newArraySequenceNumber(this.customDtoModel.sequenceNumberLimit);
        if (this.customDtoModel.customExcelValidateList.length > 0) {
          this.inputField.forEach(item => {
            item.form.forEach(data => {
              if (data.type === 'table') {
                this.customDtoModel.customExcelValidateList.forEach(customDto => {
                  if (customDto.referenceId == data.id) {
                    data.id = customDto.referenceId;
                    data.sheetNo = customDto.sheetNo;
                    data.rowNo = customDto.rowNo;
                  }
                });
              }
            });
          });
        }
        if (this.customDtoModel.singleDocument) {
          this.multipleDoc = !this.customDtoModel.singleDocument;
        } else if (this.customDtoModel.id != 0) {
          this.multipleDoc = !this.customDtoModel.singleDocument;
        } else {
          this.customDtoModel.singleDocument = !this.customDtoModel.singleDocument;
        }
        if(!this.helper.isEmpty(this.customDtoModel.watermark))
          this.isWaterMark = true;
        if(!this.helper.isEmpty(this.customDtoModel.password))
          this.isPassword = true;
        if(!this.helper.isEmpty(this.customDtoModel.documentNumber))
          this.isDocNumber = true;
       
        this.workFlowOptionList = resp.result.workFlowVariables.map(option => ({ value: option.key, label: option.value }))
        this.frezzeHistoryOptionList=resp.result.freezeHistoryVariables.map(option => ({ value: option.key, label: option.value }));
        this.onChangeWorkFlowMultiSelect();
        if( !this.customDtoModel.singleDocument){
          this.loadMultipleOptionList()
          this.onChangeMultiSelect();
        }
        this.onChangeFreezeHistoryMultiSelect();
        
        if(!this.helper.isEmpty(this.customDtoModel.extendedForm)){
          this.extendedForm=JSON.parse( this.customDtoModel.extendedForm);
        }
        if(!this.helper.isEmpty(this.customDtoModel.equipmentExtendedForm)){
             this.equipmentExtendedForm = JSON.parse( this.customDtoModel.equipmentExtendedForm);
        }
        if(!this.helper.isEmpty(this.customDtoModel.batchExtendedForm)){
          this.batchExtendedForm = JSON.parse( this.customDtoModel.batchExtendedForm);
     }
        this.spinnerFlag = false;
        if (!this.helper.isEmpty(this.customDtoModel.filePath))
          this.pdfViewIcon = true;

          if(this.customDtoModel.id!=0){
            this.check();
          }else{
            this.disableSequenceStart=false;
          }
      } else {
        this.spinnerFlag = false;
        this.customDtoModel = new CustomPdfSettingModel();
        this.disableSequenceStart=false;
      }
      this.customDtoModel.customExcelValidateList.forEach(customDto => {
        if (customDto.referenceId == docType) {
          this.sheetName = customDto.sheetNo;
          this.rowNo = customDto.rowNo;
        }else if(customDto.referenceId == "WorkFlow"){
          this.workFlowSheetName = customDto.sheetNo;
          this.workFlowRowNo= customDto.rowNo;
        }
      });
    });
    this.loadCsvVariablesData(docType);
    
  }
 addCSVTemplateVarables(val: string,label:string,category:string,temp?:any){
   label =label.replace('&nbsp;',"");
   label =label.replace('&amp;',"");
  this.selectedvariables.push(val);
  if(temp != undefined){
     this.selectedLables.push(temp.label);
  }else{
    this.selectedLables.push(label);
  }
  this.selectedCategory.push(category);
   this.removeDuplicates();
  this.csvTempMap.set(label,val);
  if(temp == undefined){
  this.csvTemp.set(label,new csvTemplateModel(label,val,category));
  }else{
    this.csvTemp.set(label,new csvTemplateModel(temp.label,val,category));
  }
 }
  copyInputMessage(val: string,label:string,category:string,temp?:any) {
    if(this.isCsvVariables){
    this.addCSVTemplateVarables(val,label,category,temp);
    }
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

  onChangeMultiSelect() {
    this.selectedColumns = [];
    if (!this.helper.isEmpty(this.customDtoModel.selectedDocumentVariable) && this.customDtoModel.selectedDocumentVariable.length > 0) {
      this.customDtoModel.selectedDocumentVariable.forEach(variable => {
            this.selectedColumns.push(this.multipleOptionList.filter(option=>option.value==variable)[0]);
        });
    }
  }

  onChangeWorkFlowMultiSelect() {
    this.selectedWorkFlowColumns = [];
    if (!this.helper.isEmpty(this.customDtoModel.selectedWorkFlowVariables) && this.customDtoModel.selectedWorkFlowVariables.length > 0) {
      this.customDtoModel.selectedWorkFlowVariables.forEach(variable => {
            this.selectedWorkFlowColumns.push(this.workFlowOptionList.filter(option=>option.value==variable)[0]);
      });
    }
  }

  onChangeFreezeHistoryMultiSelect() {
    this.selectedFreezeHistoryColumns = [];
    if (!this.helper.isEmpty(this.customDtoModel.selectedFreezeHistoryVariables) && this.customDtoModel.selectedFreezeHistoryVariables.length > 0) {
      this.customDtoModel.selectedFreezeHistoryVariables.forEach(variable => {
            this.selectedFreezeHistoryColumns.push(this.frezzeHistoryOptionList.filter(option=>option.value==variable)[0]);
      });
    }
  }

  changeWorkFlow() {
    if (!this.customDtoModel.workFlow) {
      this.selectedWorkFlowColumns = [];
      this.customDtoModel.selectedWorkFlowVariables = [];
    }
  }

  changeFreezeHistory() {
    if (!this.customDtoModel.freezeHistory) {
      this.selectedFreezeHistoryColumns = [];
      this.customDtoModel.selectedFreezeHistoryVariables=[];
    }
  }

  onChangeSingle() {
    this.selectedColumns = [];
    this.customDtoModel.selectedDocumentVariable = [];
    this.customDtoModel.singleDocument = !this.customDtoModel.singleDocument;
    this.multipleDoc = !this.customDtoModel.singleDocument;
    this.customDtoModel.selectedWorkFlowVariables = [];
    this.customDtoModel.selectedFreezeHistoryVariables = [];
    this.customDtoModel.selectedLinkedFormVariable = [];
  }

  onChangeMultiple() {
    this.loadMultipleOptionList();
    this.selectedColumns = [];
    this.customDtoModel.selectedDocumentVariable = [];
    this.multipleDoc = !this.multipleDoc;
    this.customDtoModel.singleDocument = !this.multipleDoc;
  }

  loadMultipleOptionList(){
    this.multipleOptionList = this.customDtoModel.documentVariable.map(option => ({ value: option.key, label: option.value }));
    if(this.extendedForm)
    this.multipleOptionList.push(...  this.extendedForm
      .filter(data => data.type != 'header' && data.type != 'table' && data.type != 'hidden')
      .map(option => ({ value: option.name, label: option.label })));
  }


  

  
  saveCustomSettings() {
    //this.prepareCsvTemplateData();
    this.customExcelValidateList=[];
    if(!this.isDocument){
      this.inputField.forEach(item => {
        item.form.forEach(data => {
          if(data.type==='table'){
            if(!this.helper.isEmptyWithoutZero(data.sheetNo) && !this.helper.isEmptyWithoutZero(data.rowNo)){
              let dto=new CustomExcelValidateDTO();
              dto.referenceId=data.id;
              dto.sheetNo=data.sheetNo;
              dto.rowNo=data.rowNo;
              this.customExcelValidateList.push(dto);
            }
          }
        });
      });
    }else{
      if(this.multipleDoc){
        if(!this.helper.isEmptyWithoutZero(this.sheetName) && !this.helper.isEmptyWithoutZero(this.rowNo)){
          let dto=new CustomExcelValidateDTO();
          dto.referenceId=this.customDtoModel.docType;
          dto.sheetNo=this.sheetName;
          dto.rowNo=this.rowNo;
          this.customExcelValidateList.push(dto);
        }
      }
    }
    if(this.customDtoModel.workFlow){
      if(!this.helper.isEmptyWithoutZero(this.workFlowSheetName) && !this.helper.isEmptyWithoutZero(this.workFlowRowNo)){
        let dto=new CustomExcelValidateDTO();
        dto.referenceId="WorkFlow";
        dto.sheetNo=this.workFlowSheetName;
        dto.rowNo=this.workFlowRowNo;
        this.customExcelValidateList.push(dto);
      }
    }
    this.customDtoModel.customExcelValidateList=this.customExcelValidateList;
    this.spinnerFlag = true;
    if (this.customDtoModel.mappingId === "Document"||this.customDtoModel.mappingId ==="Form"||this.customDtoModel.mappingId ==="Template")
      this.customDtoModel.mappingId = "0";
    this.pdfService.saveCustomPdfSetting(this.customDtoModel).subscribe(resp => {
      if (resp.result == "success") {
        this.spinnerFlag = false;
        this.docChanged(this.customDtoModel.docType);
        swal({
          title: 'Saved Successfully!',
          text: 'Details has been saved.',
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        this.spinnerFlag = false;
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
  
  onChangeTab(id: any) {
    this.selectedTabId=id;
    if (this.selectedTabId === 'tab-1') {
      this.tabName = "Common Setting";
    }else if (this.selectedTabId === 'tab-2') {
      this.tabName = "Document Setting";
    }else if(this.selectedTabId === 'tab-3') {
      this.isCsvVariables = false;
      this.selectedCategory = new Array();
      this.selectedLables = new Array();
      this.selectedvariables = new Array();
      this.pdfViewIcon = false;
      this.customDtoModel = new CustomPdfSettingModel();
      this.tabName = "Custom Setting";
    }else{
      this.viewData=false;
    }
  }

  
  pdfView() {
    this.spinnerFlag = true;
    let mappingId = this.documentListForCustom.filter(d => d.key == this.customDtoModel.docType)[0].mappingId;
    
    this.pdfService.downloadPreviewDocument(this.customDtoModel.docType, mappingId).subscribe(resp => {
      this.spinnerFlag = false;
      if (resp != null) {
        this.adminComponent.previewByBlob('Sample.pdf',resp,true,'Preview of Document');
      }
    },er=> this.spinnerFlag = false);
  }

  downloadFileOrView(filePath, viewFlag, fileName) {
    this.adminComponent.downloadOrViewFile(fileName,filePath,viewFlag,'Preview of Document');
  }
  viewRowDetails(json:any){
     this.viewData=true;
      this.jsonInputField=json;
   }
   
  addToast(options) {
    if (options.closeOther) {
      this.toastyService.clearAll();
    }
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
  onChangeSheetAndRowNo(){

  }

  loadLinkedFormTable(item,index){
    item.tableList=new Array();
    item.selectedLinkedFormColumns  =new Array();
    if(item.table){
      item.tableList.push(({ value: 'code', label: 'Code' }))
      item.tableList.push(...  item.form
        .filter(data => data.type != 'header' && data.type != 'table' && data.type != 'hidden')
        .map(option => ({ value: option.name, label: option.label })));
    }else{
      this.customDtoModel.selectedLinkedFormVariable[index].selectedVariables=new Array();
    }
  }

  onChangeLinkedFormMultiSelect(item,tableJson) {
    item.selectedLinkedFormColumns  =new Array();
    if (!this.helper.isEmpty(tableJson.selectedVariables) && tableJson.selectedVariables.length > 0) {
      tableJson.selectedVariables.forEach(variable => {
        item.selectedLinkedFormColumns.push(item.tableList.filter(option=>option.value==variable)[0]);
      });
    }
  }

  newArraySequenceNumber(length){
    this.sequenceNumberLimitArray=new Array(length);
  }

  onlyNumber(event){
    const pattern = /[0-9]$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 5 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
    
    setTimeout(() => {
      if(this.customDtoModel.sequenceNumberLimit<3 ){
        this.customDtoModel.sequenceNumberLimit=3;
        this.newArraySequenceNumber(this.customDtoModel.sequenceNumberLimit)
      }
      if(this.customDtoModel.sequenceNumberLimit>20 ){
        this.customDtoModel.sequenceNumberLimit=20;
        this.newArraySequenceNumber(this.customDtoModel.sequenceNumberLimit)
      }
      
    }, 10);
        
    if(event.keyCode == 189 ||event.keyCode == 187)
    event.preventDefault();
    
  }

  removeVar(index:any,variable:any){
    this.selectedLables.splice(index, 1); 
    this.selectedvariables.splice(index, 1); 
    this.selectedCategory.splice(index,1)
    this.csvTempMap.delete(variable);
    this.csvTemp.delete(variable);
  }

  prepareCsvTemplateData(){
    this.csvModel.csvTemplateDto = new Array();
    Array.from(this.csvTemp.values()).forEach(value => {
      let data = new csvTemplateModel(value.label,value.name,value.category);
      this.csvModel.csvTemplateDto.push(data);
    });
    }
enableCsvOptions(){
  if(this.isCsvVariables){
    this.isMultiWorkFlow = true;
  }else{
    this.isMultiWorkFlow = false;
  }
}
  saveCsvTemplatesVariables(){
    this.csvSaveSpinner = true;
   this.prepareCsvTemplateData();
   this.csvModel.docType = this.customDtoModel.docType;
   this.pdfService.saveCsvTemplatesVariables(this.csvModel).subscribe(resp => {
     this.csvSaveSpinner = false;
    if (resp.result == "success") {
      this.csvTemplateModal.hide();
      this.csvSaveSpinner = false;
      this.csvModel.id = resp.id;
      //this.docChanged(this.customDtoModel.docType);
      swal({
        title: 'Saved Successfully!',
        text: '',
        type: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      this.csvModel.id = resp.id;
      this.csvTemplateModal.hide();
      this.csvSaveSpinner = false;
      swal({
        title: 'Error',
        text: 'oops something went wrong',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
    }
  
  },(err)=>{
   this.spinnerFlag = false;
  });
}

removeDuplicates(){
  var category = new Set(this.selectedCategory);
  var variable = new Set(this.selectedvariables);
  var lables = new Set(this.selectedLables);
  this.selectedCategory = Array.from(category);
  this.selectedvariables = Array.from(variable);
  this.selectedLables = Array.from(lables);
}
  loadCsvVariablesData(docType:any){
    this.pdfService.loadCsvVariables(docType).subscribe(result =>{
      if(result!="" && result != undefined){
        this.csvModel.csvTemplateDto = new Array();
        this.csvModel.docType = docType;
       this.csvModel = result;
       for(let varibles of this.csvModel.csvTemplateDto){
        this.selectedvariables.push(varibles.name);
        this.selectedLables.push(varibles.label);
        this.selectedCategory.push(varibles.category);
        this.csvTemp.set(varibles.label,new csvTemplateModel(varibles.label,varibles.name,varibles.category));
       }
       if(this.csvModel.csvTemplateName != null){
        this.isCsvVariables = true;
        this.isMultiWorkFlow = false;
       }else{
        this.isCsvVariables = false;
        this.isMultiWorkFlow = true;
       }
      }
   },(err)=>{
     this.spinnerFlag = false;
   });

  }
}

