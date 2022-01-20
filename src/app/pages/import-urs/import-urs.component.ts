import { Component, OnInit, EventEmitter, ViewChild, Output, Input} from '@angular/core';
import { ConfigService } from '../../shared/config.service';
import { LocationService } from '../location/location.service';
import { ImportUrsDataDTO } from '../../models/model';
import { Helper } from '../../shared/helper';
@Component({
  selector: 'app-import-urs',
  templateUrl: './import-urs.component.html',
  styleUrls: ['./import-urs.component.css']
})
export class ImportUrsComponent implements OnInit {
  @Input() inputProjectId:number=0;
  locationsList: any[] = new Array();
  projectList: any[] = new Array();
  locationId:any=0;
  projectId:any;
  ursListForImport:any[]=new Array();
  selectAllURS: boolean = false;
  selectAllSpec: boolean = false;
  selectAllRisk: boolean = false;
  selectAllIQTC: boolean = false;
  selectAllOQTC: boolean = false;
  selectAllPQTC: boolean = false;
  selectAllIOQTC: boolean = false;
  selectAllOPQTC: boolean = false;
  isSelectedForImport: boolean = false;
  permissionData: any[] = new Array();
  selectedUrsRow:any;
  spinnerFlag:boolean=false;
  selectedTestcaseType:string="";
  @ViewChild('importURSModal') importURSModal:any;
  dropdownSettings = {
    singleSelection: true,
    text: "Select Project",
    enableSearchFilter: true,
    classes: "myclass custom-class",
  };
  @Output() onClose = new EventEmitter();
  specCreate:boolean=false;
  riskCreate:boolean=false;
  iqtcCreate:boolean=false;
  pqtcCreate:boolean=false;
  oqtcCreate:boolean=false;
  ioqtcCreate:boolean=false;
  opqtcCreate:boolean=false;
  isDependentSelected:boolean=true;
  constructor(public permissionService: ConfigService,public locationService: LocationService,public helper:Helper) { }
  ngOnInit() {
  }
  showModalView(){
    this.loadLocationsForImport(); 
    this.importURSModal.show(); 
  }

  loadLocationsForImport(){
    this.locationService.loadAllActiveLocations().subscribe(response => {
      this.locationsList = response.result
    });
    
  }

  loadProjects() {
    this.projectList = [];
    this.permissionService.loadprojectOfUserAndCreatorForLocation(this.locationId).subscribe(response => {
      this.projectList = response.projectList.map(option => ({ id: option.id, itemName: option.projectName }));
    });  
  }
  onProjectChange(event){
    let url="urs/loadAllPublishedURSForImport/"+event[0].id+"/published";
    this.spinnerFlag=true;
    this.permissionService.HTTPGetAPI(url).subscribe(response => {
      this.ursListForImport=response.publishedList;
      this.spinnerFlag=false;
    });
    this.permissionService.HTTPGetAPI("projectsetup/loadStaticDocumentsForUserAndProject/0").subscribe(response =>{
      this.permissionData=response;
    });
    this.permissionService.loadPermissionsBasedOnModule(this.helper.SP_VALUE).subscribe(resp => {
      this.specCreate = resp.createButtonFlag;
    });
    this.permissionService.loadPermissionsBasedOnModule(this.helper.RISK_ASSESSMENT_VALUE).subscribe(resp => {
      this.riskCreate = resp.createButtonFlag;
    });
    this.permissionService.loadPermissionsBasedOnModule(this.helper.IQTC_VALUE).subscribe(resp => {
      this.iqtcCreate = resp.createButtonFlag;
    });
    this.permissionService.loadPermissionsBasedOnModule(this.helper.PQTC_VALUE).subscribe(resp => {
      this.pqtcCreate = resp.createButtonFlag;
    });
    this.permissionService.loadPermissionsBasedOnModule(this.helper.OQTC_VALUE).subscribe(resp => {
      this.oqtcCreate = resp.createButtonFlag;
    });
    this.permissionService.loadPermissionsBasedOnModule(this.helper.IOQTC_VALUE).subscribe(resp => {
      this.ioqtcCreate = resp.createButtonFlag;
    });
    this.permissionService.loadPermissionsBasedOnModule(this.helper.OPQTC_VALUE).subscribe(resp => {
      this.opqtcCreate = resp.createButtonFlag;
    }); 
  }
  onCloseImportURSModal(){
    this.ursListForImport=[];
    this.locationId=0;
    this.projectId=[];
    this.projectList=[];
    this.isSelectedForImport=false;
    this.selectAllURS=false;
    this.selectAllSpec=false;
    this.selectAllRisk=false;
    this.selectAllIOQTC=false;
    this.selectAllIQTC=false;
    this.selectAllOQTC=false;
    this.selectAllOPQTC=false;
    this.selectAllPQTC=false;
  }

  selectAllDataForImport(event,type) {
    if (event.currentTarget.checked) {
      this.ursListForImport.forEach(d => {
        switch(type){
          case "URS":
            d.selectedForImport = true;
            this.isSelectedForImport = true;
            this.selectAllURS = event.currentTarget.checked;
            break;
          case "Spec":
            d.selectedSpecForImport = true;
            break;
          case "Risk":
            d.selectedRiskForImport = true;
            break;
          case "IQTC":
            d.selectedIQTCForImport = true;
            break;
          case "OQTC":
            d.selectedOQTCForImport = true;
            break;
          case "PQTC":
            d.selectedPQTCForImport = true;
            break;
          case "IOQTC":
            d.selectedIOQTCForImport = true;
            break;
          case "OPQTC":
            d.selectedOPQTCForImport = true;
            break;
          }
       
      });
    } else {
      this.ursListForImport.forEach(d => {
        switch(type){
          case "URS":
            this.selectAllURS = event.currentTarget.checked;
            d.selectedForImport = false;
            this.isSelectedForImport = false;
            d.selectedSpecForImport = false;
            d.selectedRiskForImport = false;
            d.selectedIQTCForImport = false;
            d.selectedOQTCForImport = false;
            d.selectedPQTCForImport = false;
            d.selectedIOQTCForImport = false;
            d.selectedOPQTCForImport = false;
            break;
          case "Spec":
            d.selectedSpecForImport = false;
            break;
          case "Risk":
            d.selectedRiskForImport = false;
            break;
          case "IQTC":
            d.selectedIQTCForImport = false;
            break;
          case "OQTC":
            d.selectedOQTCForImport = false;
            break;
          case "PQTC":
            d.selectedPQTCForImport = false;
            break;
          case "IOQTC":
            d.selectedIOQTCForImport = false;
            break;
          case "OPQTC":
            d.selectedOPQTCForImport = false;
            break;
        }
      });
    }
  }

  onChangeImportSelectData() {
    for (let data of this.ursListForImport) {
      if (data.selectedForImport) {
        this.isSelectedForImport = true;
        break;
      } else {
        this.isSelectedForImport = false;
      }
    }
  }
  individualPermissionsresult(typeId: any) {
    let result=false;
    if (!this.permissionData) {
       result=false;
    } else {
     var permissionData = this.permissionData.filter(p => p.key == typeId);
      if (permissionData && permissionData.length > 0) {
        result=true;
      } else {
        result=false;
      }
      return result;
    }
  }
  onClickSpecIndividual(row){
    this.selectedUrsRow=new Object();
    this.selectedUrsRow=row;
    this.selectedUrsRow.selectedSpecList=new Array();
    if(!this.selectedUrsRow.specificationImportList){
      this.spinnerFlag=true;
      this.permissionService.HTTPGetAPI("urs/getPublishedUrsSpecMappingDetails/"+row.id).subscribe(res =>{
        this.spinnerFlag=false;
        this.selectedUrsRow.specificationImportList= res;
        if(row.selectedSpecForImport){
          this.selectIndividualSpec();
        }
      });
    }else{
      if(row.selectedSpecForImport){
        this.selectIndividualSpec();
      }else{
        this.selectedUrsRow.specificationImportList.forEach(element => {
          element.selectedForImport=false;
        });
      }
    }
  }
  selectIndividualSpec(){
    this.selectedUrsRow.specificationImportList.forEach(element => {
      element.selectedForImport=true;
      this.selectedUrsRow.selectedSpecList.push(element.id);
    });
  }
  onCloseIndividualSpec(){
    let ids=this.selectedUrsRow.specificationImportList.filter(m => m.selectedForImport).map(p => p.id);
    this.selectedUrsRow.selectedSpecList=ids;
    this.selectedUrsRow=new Object();
  }
  onClickRiskIndividual(row){
    this.selectedUrsRow=new Object();
    this.selectedUrsRow=row;
    this.selectedUrsRow.selectedRiskList=new Array();
    if(!this.selectedUrsRow.riskImportList){
      this.spinnerFlag=true;
      this.permissionService.HTTPGetAPI("urs/getPublishedUrsRiskMappingDetails/"+row.id).subscribe(res =>{
        this.spinnerFlag=false;
        this.selectedUrsRow.riskImportList=res;
        if(row.selectedRiskForImport){
          this.selectIndividualRisk();
        }
      });
    }else{
      if(row.selectedRiskForImport){
        this.selectIndividualRisk();
      }else{
        this.selectedUrsRow.riskImportList.forEach(element => {
          element.selectedForImport=false;
        });
      }
    }
  }
  selectIndividualRisk(){
    this.selectedUrsRow.riskImportList.forEach(element => {
      element.selectedForImport=true;
      this.selectedUrsRow.selectedRiskList.push(element.id);
    });
  }
  onCloseIndividualRisk(){
    let ids=this.selectedUrsRow.riskImportList.filter(m => m.selectedForImport).map(p => p.id);
    this.selectedUrsRow.selectedRiskList=ids;
    this.selectedUrsRow=new Object();
  }

  selectIndividualIqtc(){
    this.selectedUrsRow.IQTCImportList.forEach(element => {
      element.selectedForImport=true;
      this.selectedUrsRow.selectedIqtcList.push(element.id);
    });
  }

  selectIndividualPqtc(){
    this.selectedUrsRow.PQTCImportList.forEach(element => {
      element.selectedForImport=true;
      this.selectedUrsRow.selectedPqtcList.push(element.id);
    });
  }

  selectIndividualOqtc(){
    this.selectedUrsRow.OQTCImportList.forEach(element => {
      element.selectedForImport=true;
      this.selectedUrsRow.selectedOqtcList.push(element.id);
    });
  }

  selectIndividualIoqtc(){
    this.selectedUrsRow.IOQTCImportList.forEach(element => {
      element.selectedForImport=true;
      this.selectedUrsRow.selectedIoqtcList.push(element.id);
    });
  }

  selectIndividualOpqtc(){
    this.selectedUrsRow.OPQTCImportList.forEach(element => {
      element.selectedForImport=true;
      this.selectedUrsRow.selectedOpqtcList.push(element.id);
    });
  }

  onClickTestcasesIndividual(row, type) {
    this.selectedUrsRow=new Object();
    this.selectedUrsRow = row;
    this.selectedTestcaseType=type;
    switch (type) {
      case "108":
        this.selectedUrsRow.selectedIqtcList=new Array();
        if(!this.selectedUrsRow.IQTCImportList){
          this.spinnerFlag=true;
          this.permissionService.HTTPGetAPI("urs/getPublishedUrsTestcasesMappingDetails/" + row.id + "/" + type).subscribe(res => {
            this.spinnerFlag=false;
            this.selectedUrsRow.IQTCImportList=res;
            if(row.selectedIQTCForImport){
              this.selectIndividualIqtc()
            }
          });
        }else{
          if(row.selectedIQTCForImport){
            this.selectIndividualIqtc();
          }else{
            this.unSelectTestcases(this.selectedUrsRow.IQTCImportList);
          }
        }
        break;
      case "109":
        this.selectedUrsRow.selectedPqtcList=new Array();
        if(!this.selectedUrsRow.PQTCImportList){
          this.spinnerFlag=true;
          this.permissionService.HTTPGetAPI("urs/getPublishedUrsTestcasesMappingDetails/" + row.id + "/" + type).subscribe(res => {
            this.spinnerFlag=false;
            this.selectedUrsRow.PQTCImportList=res;
            if(row.selectedPQTCForImport){
              this.selectIndividualPqtc();
            }
          });
        }else{
          if(row.selectedPQTCForImport){
            this.selectIndividualPqtc();
          }else{
            this.unSelectTestcases(this.selectedUrsRow.PQTCImportList);
          }
        }
        break;
      case "110":
        this.selectedUrsRow.selectedOqtcList=new Array();
        if(!this.selectedUrsRow.OQTCImportList){
          this.spinnerFlag=true;
          this.permissionService.HTTPGetAPI("urs/getPublishedUrsTestcasesMappingDetails/" + row.id + "/" + type).subscribe(res => {
            this.spinnerFlag=false;
            this.selectedUrsRow.OQTCImportList=res;
            if(row.selectedOQTCForImport){
              this.selectIndividualOqtc();
            }
          });
        }else{
          if(row.selectedOQTCForImport){
            this.selectIndividualOqtc();
          }else{
            this.unSelectTestcases(this.selectedUrsRow.OQTCImportList);
          }
        }
        break;
      case "207":
        this.selectedUrsRow.selectedIoqtcList=new Array();
        if(!this.selectedUrsRow.IOQTCImportList){
          this.spinnerFlag=true;
          this.permissionService.HTTPGetAPI("urs/getPublishedUrsTestcasesMappingDetails/" + row.id + "/" + type).subscribe(res => {
            this.spinnerFlag=false;
            this.selectedUrsRow.IOQTCImportList=res;
            if(row.selectedIOQTCForImport){
              this.selectIndividualIoqtc();
            }
          });
        }else{
          if(row.selectedIOQTCForImport){
            this.selectIndividualIoqtc();
          }else{
            this.unSelectTestcases(this.selectedUrsRow.IOQTCImportList);
          }
        }
        break;
      case "208":
        this.selectedUrsRow.selectedOpqtcList=new Array();
        if(!this.selectedUrsRow.OPQTCImportList){
          this.spinnerFlag=true;
          this.permissionService.HTTPGetAPI("urs/getPublishedUrsTestcasesMappingDetails/" + row.id + "/" + type).subscribe(res => {
            this.spinnerFlag=false;
            this.selectedUrsRow.OPQTCImportList=res;
            if(row.selectedOPQTCForImport){
              this.selectIndividualOpqtc();
            }
          });
        }else{
          if(row.selectedOPQTCForImport){
            this.selectIndividualOpqtc();
          }else{
            this.unSelectTestcases(this.selectedUrsRow.OPQTCImportList);
          }
        }
        break;
    }
  }

  unSelectTestcases(list:any){
    list.forEach(element => {
      element.selectedForImport=false;
    });
  }

  onCloseIndividualTestcases(){
    switch (this.selectedTestcaseType) {
      case "108":
        this.selectedUrsRow.selectedIqtcList=this.selectedUrsRow.IQTCImportList.filter(m => m.selectedForImport).map(p => p.id);
        break;
      case "109":
        this.selectedUrsRow.selectedPqtcList=this.selectedUrsRow.PQTCImportList.filter(m => m.selectedForImport).map(p => p.id);
        break;
      case "110":
        this.selectedUrsRow.selectedOqtcList=this.selectedUrsRow.OQTCImportList.filter(m => m.selectedForImport).map(p => p.id);
        break;
      case "207":
        this.selectedUrsRow.selectedIoqtcList=this.selectedUrsRow.IOQTCImportList.filter(m => m.selectedForImport).map(p => p.id);
        break;
      case "208":
        this.selectedUrsRow.selectedOpqtcList=this.selectedUrsRow.OPQTCImportList.filter(m => m.selectedForImport).map(p => p.id);
        break;
    }
    this.selectedUrsRow=new Object();
  }
  onCloseClearObject(){
    this.selectedUrsRow=new Object();
  }
  // importUrsData(){
  //   let list:ImportUrsDataDTO[]=new Array();
  //  let selectedList=this.ursListForImport.filter(m => m.selectedForImport);
  //  selectedList.forEach(element => {
  //   let data:ImportUrsDataDTO=new ImportUrsDataDTO();
  //   data.ursId=element.id;
  //   data.testCasesList=new Array();
  //    if (element.selectedIqtcList)
  //      data.testCasesList.push(...element.selectedIqtcList);
  //    if (element.selectedOqtcList)
  //      data.testCasesList.push(...element.selectedOqtcList);
  //    if (element.selectedPqtcList)
  //      data.testCasesList.push(...element.selectedPqtcList);
  //    if (element.selectedIoqtcList)
  //      data.testCasesList.push(...element.selectedIoqtcList);
  //    if (element.selectedOpqtcList)
  //      data.testCasesList.push(...element.selectedOpqtcList);
  //   data.specList=element.selectedSpecList;
  //   data.riskList=element.selectedRiskList;
  //   list.push(data);
  //  });
  //  this.spinnerFlag=true;
  //  this.permissionService.HTTPPostAPI(list,"urs/saveUrsImportData").subscribe(res =>{
  //   this.spinnerFlag=false;
  //   this.importURSModal.hide();
  //   this.onClose.emit(true);
  //   this.onCloseImportURSModal();
  //  });
  // }

  importUrsData(){
    let list:ImportUrsDataDTO[]=new Array();
   let selectedList=this.ursListForImport.filter(m => m.selectedForImport);
   selectedList.forEach(element => {
    let data:ImportUrsDataDTO=new ImportUrsDataDTO();
    data.ursId=element.id;
    list.push(data);
   });
   this.spinnerFlag=true;
   this.permissionService.HTTPPostAPI(list,"urs/importUrsData/"+this.inputProjectId+"/"+this.isDependentSelected).subscribe(res =>{
    this.spinnerFlag=false;
    this.importURSModal.hide();
    this.onClose.emit(true);
    this.onCloseImportURSModal();
   });
  }
  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  
}
