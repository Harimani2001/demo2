import { Component, OnInit, EventEmitter, ViewChild, Output, ViewEncapsulation } from '@angular/core';
import { ConfigService } from '../../shared/config.service';
import { LocationService } from '../location/location.service';
import { ImportUrsDataDTO } from '../../models/model';
import { Helper } from '../../shared/helper';
@Component({
  selector: 'app-import-chapter',
  templateUrl: './import-chapter.component.html',
  styleUrls: ['./import-chapter.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class ImportChapterComponent implements OnInit {
  spinnerFlag: boolean = false;
  @ViewChild('importChapterModal') importChapterModal: any;
  @Output() onClose = new EventEmitter();
  documentType: any;
  validationMessage = '';
  chapterList: any = new Array();
  tableList: any = new Array();
  constantsList: any = new Array();
  importValidationMessage = '';
  importsectionscount = 0;
  importDataCount = 0;
  stepperList:any=new Array();
  isImported:boolean=false;
  selectAll: boolean = false;
  importSuccess :boolean=false;
  constructor(public configService: ConfigService, public helper: Helper) { }
  ngOnInit() {
  }
  showModalView(documentType: any) {
    this.importSuccess=false;
    this.importValidationMessage="";
    this.validationMessage="";
    this.stepperList=[];
    this.isImported=false;
    this.stepperList.push({"stepName":"Upload","thisIsCurrent":true,"completed":false});
    this.stepperList.push({"stepName":"Review & Map","thisIsCurrent":false,"completed":false});
    this.stepperList.push({"stepName":"Import & Status","thisIsCurrent":false,"completed":false});
    this.chapterList = [];
    this.documentType = documentType;
    this.importChapterModal.show();
    this.configService.HTTPGetAPI('pdfSetting/loadDocumentContantsByDocType/' + documentType).subscribe(resp => {
      this.constantsList = resp;
    });
  }

  extractFile(event) {
    this.validationMessage = "";
    if (event.target.files[0].name.match('.docx')) {
      const formData: FormData = new FormData();
      formData.append('file', event.target.files[0], event.target.files[0].name);
      formData.append('docType', this.documentType);
      this.spinnerFlag = true;
      this.configService.HTTPPostAPI(formData, 'pdfSetting/uploadTemplate').subscribe(resp => {
        this.stepperList[1].thisIsCurrent=true;
        this.stepperList[0].thisIsCurrent=false;
        this.stepperList[0].completed=true;
        this.spinnerFlag = false;
        event.target.value = '';
        if (resp.message) {
          this.validationMessage = resp.message;
        }
        if (resp.result) {
          this.chapterList = resp.result;
        }
      });
    } else {
      this.validationMessage = "Please upload .docx file";
    }
  }
  import() {
    this.importValidationMessage = "";
    let selectedList = this.chapterList.filter(f => f.selectedForImport);
    if (selectedList.length > 0) {
      selectedList.forEach(element => {
        if(element.selectedForDocumentData){
          // element.tableData.columns.forEach(column =>{
          //   column.backgroundColor="white";
          //   if(this.helper.isEmpty(column.mappingField)){
          //     column.backgroundColor="yellow";
          //     this.importValidationMessage = "Please check the errors";
          //   }
          // });
          this.importValidationMessage=this.validateDocumentData(element);
        }else{
          element.backgroundColor="white";
          if(this.helper.isEmpty(element.chapterName)){
            element.backgroundColor="yellow";
            this.importValidationMessage = "Please clear the errors";
          }
        }
      });
      if(this.helper.isEmpty(this.importValidationMessage)){
        this.spinnerFlag = true;
        this.importSuccess=false;
        this.configService.HTTPPostAPI(selectedList, 'pdfSetting/importTemplateData/'+this.documentType).subscribe(resp => {
          this.isImported=true;
          this.stepperList[2].completed=true;
          this.stepperList[1].thisIsCurrent=false;
          this.stepperList[0].thisIsCurrent=false;
          this.stepperList[1].completed=true;
          this.chapterList=[];
          this.spinnerFlag = false;
          if(resp.result === 'success'){
            this.importsectionscount=resp.chapterCount;
            this.importDataCount=resp.dataCount;
            this.importSuccess=true;
          }
        }, err => {
          this.spinnerFlag = false;
          this.importSuccess=false;
          this.isImported=true;
          this.stepperList[2].thisIsCurrent=true;
          this.stepperList[1].thisIsCurrent=false;
          this.stepperList[0].thisIsCurrent=false;
          this.stepperList[1].completed=true;
        });
      }
    } else {
      this.importValidationMessage = "Please select at least one chaptet to import";
    }
  }
  onChangeDocumentData(chapter: any) {
    if (chapter.selectedForDocumentData) {
      chapter.tableData.columns.forEach(element => {
        this.constantsList.forEach(type => {
          if (element.label.trim().includes(type.value)) {
            element.mappingField = type.key;
          }
        });
      });
    }
  }
  onCloseModal(){
    this.onClose.emit();
  }

  selectAllData(event) {
    this.selectAll = event.currentTarget.checked;
    if (event.currentTarget.checked) {
      this.chapterList.forEach(d => {
        d.selectedForImport = true;
      });
    } else {
      this.chapterList.forEach(d => {
        d.selectedForImport = false;
      });
    }
  }
  onClickEdit(chapter){
    this.chapterList.forEach(d => {
      d.selectedForEdit = false;
    });
    chapter.selectedForEdit=true;
  }

  onChangeMappingField(column){
    column.backgroundColor="white";
    this.importValidationMessage="";
  }
  validateDocumentData(data) : string{
    let result:string="";
    switch(this.documentType){
      case "107":
        let mappingFields:any[]=data.tableData.columns.map(c => c.mappingField);
        if(!mappingFields.includes("ursRequirement"))
          result="URS Name,";
        if(!mappingFields.includes("ursCategory"))
          result=result.concat(" URS Category,");
        if(!mappingFields.includes("ursPriority"))
          result=result.concat(" URS Priority");
        if(!this.helper.isEmpty(result)){
          result=result.concat(" required for document Data");
        }else{
          data.tableData.rows.forEach(row => {
            data.tableData.columns.forEach((column,index) => {
              row.backgroundColor="white";
              if("ursRequirement" === column.mappingField || "ursCategory" === column.mappingField || "ursPriority" === column.mappingField){
                if(this.helper.isEmpty(row.row[index].value)){
                  result="Please check the errors";
                  row.row[index].backgroundColor="yellow";
                }
              }
            });
          });
        }
        break;
      case "108":
        result= this.validateTestcaseData(data,"tcIqtcDescription","tcIqtcExpectedResult");
        break;
      case "109":
        result= this.validateTestcaseData(data,"tcPqtcDescription","tcPqtcExpectedResult"); 
        break;
      case "110": 
        result= this.validateTestcaseData(data,"tcOqtcDescription","tcOqtcExpectedResult");
        break;
      case "207": 
        result= this.validateTestcaseData(data,"tcIoqtcDescription","tcIoqtcExpectedResult");
        break;
      case "208":
        result= this.validateTestcaseData(data,"tcOpqtcDescription","tcOpqtcExpectedResult"); 
        break;
      case "200":
        let specMappingFields:any[]=data.tableData.columns.map(c => c.mappingField);
        if(!specMappingFields.includes("spType"))
          result="Specification Type,";
        if(!specMappingFields.includes("spDescription"))
          result=result.concat(" Specification Description,");
        if(!this.helper.isEmpty(result)){
          result=result.concat(" required for document Data");
        }else{
          data.tableData.rows.forEach(row => {
            data.tableData.columns.forEach((column,index) => {
              row.backgroundColor="white";
              if("spType" === column.mappingField || "spDescription" === column.mappingField){
                if(this.helper.isEmpty(row.row[index].value)){
                  result="Please check the errors";
                  row.row[index].backgroundColor="yellow";
                }
              }
            });
          });
        }
        break;case "113":
        let riskMappingFields:any[]=data.tableData.columns.map(c => c.mappingField);
        if(!riskMappingFields.includes("riskFactor"))
          result="Risk Factor,";
        if(!riskMappingFields.includes("riskScnerio"))
          result=result.concat(" Risk Scnerio,");
        if(!riskMappingFields.includes("riskProbability"))
          result=result.concat(" Probability,");
        if(!riskMappingFields.includes("riskSeverity"))
          result=result.concat(" Severity,");
        if(!riskMappingFields.includes("riskDetectablity"))
          result=result.concat(" Detectablity,");
        if(!this.helper.isEmpty(result)){
          result=result.concat(" required for document Data");
        }else{
          data.tableData.rows.forEach(row => {
            data.tableData.columns.forEach((column,index) => {
              row.backgroundColor="white";
              if("riskFactor" === column.mappingField || "riskScnerio" === column.mappingField|| "riskProbability" === column.mappingField|| "riskSeverity" === column.mappingField|| "riskDetectablity" === column.mappingField){
                if(this.helper.isEmpty(row.row[index].value)){
                  result="Please check the errors";
                  row.row[index].backgroundColor="yellow";
                }
              }
            });
          });
        }
        break;
    }
    return result;
  }

  validateTestcaseData(data,description,expectedResult):string{
    let result:string="";
    let mappingFields:any[]=data.tableData.columns.map(c => c.mappingField);
        if(!mappingFields.includes(description))
          result="Test Description,";
        if(!mappingFields.includes(expectedResult))
          result=result.concat(" Expected Result,");
        if(!this.helper.isEmpty(result)){
          result=result.concat(" required for document Data");
        }else{
          data.tableData.rows.forEach(row => {
            data.tableData.columns.forEach((column,index) => {
              row.backgroundColor="white";
              if(description === column.mappingField || expectedResult === column.mappingField){
                if(this.helper.isEmpty(row.row[index].value)){
                  result="Please check the errors";
                  row.row[index].backgroundColor="yellow";
                }
              }
            });
          });
        }
    return result;
  }
}
