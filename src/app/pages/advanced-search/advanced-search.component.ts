import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { IOption } from 'ng-select';
import { ISubscription } from 'rxjs/Subscription';
import { AdminComponent } from '../../layout/admin/admin.component';
import { AdvancedSearch, DiscrepancyForm, DynamicFormDTO, DynamicTemplateDTO, MasterDynamicForm, Projectplan, RiskAssessment, SpecificationMasterDTO, Urs, Vendor, VsrDTO } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { DashBoardService } from '../dashboard/dashboard.service';
import { DepartmentService } from '../department/department.service';
import { projectPlanService } from '../projectplan/projectplan.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { UserService } from '../userManagement/user.service';
import { TestCaseModel } from './../../models/model';
import { AdvencedSearchService } from './advanced-search.service';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css']
})
export class AdvancedSearchComponent implements OnInit {
  public docItemList: any;
  public departmentList: any;
  public simpleOption: Array<IOption> = new Array<IOption>();
  public simpleOptionDepartment: Array<IOption> = new Array<IOption>();
  public receivedId: string;
  public isUpdate: boolean = false;
  public projectPlanModal: Projectplan;
  public isSave: boolean = false;
  public userList: any;
  public dynamicId: any;
  public isClicked: boolean = false;
  public startdate1: NgbDateStruct;
  public Enddate1: NgbDateStruct;
  public selectdocument: any;
  public blockdocument: boolean;
  public subscription: ISubscription;
  public spinnerFlag: boolean = true;
  public model:AdvancedSearch;
  submitted: boolean = false;
  public textInput:any;
  public timeout:any;
  public searchData:any;
  public ursModel:Urs;
  public specModel:SpecificationMasterDTO;
  public vsrModel:Array<VsrDTO> = new Array();
  public templateModel:DynamicTemplateDTO;
  public dfData : DiscrepancyForm;
  public iqtcModel:TestCaseModel;
  public riskModel:RiskAssessment;
  public vendorModel:Vendor
  public searchValue:string;
  public sizeOfList:any;
  public timeforMethodCall:any;
  public masterDynamic:Array<MasterDynamicForm>;
  public dynamicFormData:Array<DynamicFormDTO>=new Array();
  datePipeFormat='dd-MM-yyyy';

  constructor(public searchServices:AdvencedSearchService, public dashBoardService: DashBoardService,
     public userService: UserService, public helper: Helper,private servie: DateFormatSettingsService,
      public Service: projectsetupService, public deptService: DepartmentService,
       public route: ActivatedRoute, public projectplanService: projectPlanService, 
       public _eref: ElementRef, public router: Router, public datePipe: DatePipe, public adminComponent: AdminComponent,public configService:ConfigService) {
        this.subscription = this.adminComponent.globalProjectObservable.subscribe(
      data => {
        this.loadall();
      },
      err => {},
      () => {},
    );
   }

  ngOnInit() {
    this.loadAllUsersBasedOnProject();
    this.adminComponent.setUpModuleForHelpContent("");
    this.loadOrgDateFormatAndTime();
  }

  loadOrgDateFormatAndTime() {
    this.servie.getOrgDateFormat().subscribe(result => {
        if (!this.helper.isEmpty(result)) {
          this.datePipeFormat=result.datePattern.replace("mm", "MM")
          this.datePipeFormat=this.datePipeFormat.replace("YYYY", "yyyy");
        }
    });
  }

  loadall() {
    this.projectPlanModal = new Projectplan();
    this.configService.loadDocBasedOnProject().subscribe(resp => { 
      this.docItemList = [];
      this.docItemList = new Array<any>();
      this.selectdocument = [];
      this.selectdocument = new Array<any>();
      let dfItemList:any;
      resp.forEach(element => {
        if(element.key == "108" || element.key == "109" || element.key == "110" || element.key == "207" || element.key == "208"){
         if( this.docItemList.filter(d=>d.key=='108').length==0)
          this.docItemList.push({ 'key': "108", 'value': "Test Case" });
        }else{
          this.docItemList.push(element);
        }
      });
      dfItemList = {'key':"134",'value':"Discrepancy Form"};
      this.docItemList.push(dfItemList);
        this.receivedId = this.route.snapshot.params["id"];
        if (this.receivedId == undefined) {
          for (const keyd in this.docItemList) {
            this.selectdocument.push(this.docItemList[keyd])
          }
          this.loadAllUsersBasedOnProject();
        }
        else {
          this.blockdocument = true;
          for (const keyd in this.docItemList) {
            this.selectdocument.push(this.docItemList[keyd])
          }
        }
    },
      err => {}
    );
    this.deptService.loadDepartment().subscribe(jsonResp => {
      this.simpleOptionDepartment = this.helper.cloneOptions(jsonResp.result);
    });
    this.receivedId = this.route.snapshot.params["id"];
    if (this.receivedId !== undefined) {
      this.isUpdate = true;
      this.spinnerFlag = true;
    } else{
      this.spinnerFlag = false;
      this.isSave = true;
    }
  }

  loadAllUsersBasedOnProject() {
    this.userService.loadAllUserBasedOnProject().subscribe(response => {
      this.simpleOption = this.helper.cloneOptions(response.result);
    });
  }
    populateActualDate(documentType:any){
      this.projectplanService.loadActualDate(documentType).subscribe(response => {
        this.projectPlanModal.actualStartDate = response.actualStartDate;
        this.projectPlanModal.actualEndDate = response.actEndDate;
      });
    }
    
    onSearchChange(): void { 
      this.isClicked=true;
     if(!this.helper.isEmpty(this.projectPlanModal.documentConstantName) && this.searchValue.length > 0){
      this.spinnerFlag = true;
      this.searchServices.loadDocuments(this.projectPlanModal.documentConstantName,this.searchValue).subscribe(jsonResp => {
        if (jsonResp.result == "success") {
          this.spinnerFlag = false;
          this.sizeOfList = jsonResp.sizeOfList;
          this.timeforMethodCall = "("+jsonResp.methodCallTime + ") seconds";
          this.ursModel = null;
          if(this.sizeOfList != 0){
            this.dynamicFormData = new Array();
            this.ursModel = jsonResp.ursList;
            this.specModel = jsonResp.specList;
            this.iqtcModel = jsonResp.testCasesList;
            this.dfData = jsonResp.dfList;
            this.riskModel = jsonResp.riskList;
            this.vendorModel = jsonResp.vendorList;
            this.vsrModel  = jsonResp.vsrList;
            if(this.vsrModel){
              this.vsrModel.forEach(element => {
                if(element.validationExpiryDate){
                  let start = JSON.parse(element.validationExpiryDate);
                  element.validationExpiryDate = this.datePipe.transform(new Date(start.year, start.month - 1, start.day), this.datePipeFormat);
                }
              });
            }
            this.templateModel = jsonResp.dynamicTemplate;
            for(let data of jsonResp.dynamicForm){
              data.formData = JSON.parse(data.formData);
              this.dynamicFormData.push(data);
            }
          }else{
            this.ursModel = null;
            this.specModel = null;
            this.iqtcModel = null;
            this.dfData = null;
            this.vendorModel = null;
            this.riskModel = null;
            this.masterDynamic = null;
            this.vsrModel = null;
            this.templateModel = null;
          }
          
        }
        else {
          this.ursModel = null;
          this.specModel = null;
          this.iqtcModel = null;
          this.dfData = null;
          this.vendorModel = null;
          this.riskModel = null;
          this.spinnerFlag = false;
          this.masterDynamic = null;
          this.vsrModel = null;
          this.templateModel = null;
          this.sizeOfList = 0;
          this.timeforMethodCall = "("+jsonResp.methodCallTime + ")"+"seconds";
        }
      });
    }else{
      this.ursModel = null;
      this.specModel = null;
      this.sizeOfList = 0;
      this.timeforMethodCall = "("+0.001+ ")"+"seconds";
      this.dfData = null;
      this.iqtcModel = null;
      this.vendorModel = null;
      this.riskModel = null;
      this.spinnerFlag = false;
      this.masterDynamic = null;
      this.vsrModel = null;
      this.templateModel = null;
    }
  }

  viewTestcase(url) {
    var queryParams = { "status": '/search' };
    this.router.navigate([url], { queryParams: queryParams, skipLocationChange: false });
  }

  urlRedirect(row:any){
    if (row.url.toLowerCase().indexOf('ynamic') >= 0) {
      this.adminComponent.redirect(row.url, '/search')
    }
    if (row.url.toLowerCase().indexOf('ynamic') < 0) {
      this.router.navigate([row.url], { queryParams: { id: row.documentId, status: '/search', exists: true, list: row.selectedDocuments } })
    }
  }
}
