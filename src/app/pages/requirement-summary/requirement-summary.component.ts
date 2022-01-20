import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { UrsService } from '../urs/urs.service';
import { ImportUrsComponent } from '../import-urs/import-urs.component';
import { Urs, CheckListEquipmentDTO, ProjectSetup, UserPrincipalDTO, CommonModel, StepperClass } from '../../models/model';
import swal from 'sweetalert2';
import { CategoryService } from '../category/category.service';
import { priorityService } from '../priority/priority.service';
import { AddDocumentWorkflowComponent } from '../add-document-workflow/add-document-workflow.component';
import { ComplianceAssesmentModalComponent } from '../compliance-assesment-modal/compliance-assesment-modal.component';

@Component({
  selector: 'app-requirement-summary',
  templateUrl: './requirement-summary.component.html',
  styleUrls: ['./requirement-summary.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class RequirementSummaryComponent implements OnInit {
  @ViewChild('importUrs') importUrs:ImportUrsComponent;
  @ViewChild('addDocumentWorkFlow') addDocumentWorkFlow:AddDocumentWorkflowComponent;
  @ViewChild('createUrsModal') createUrsModal:any;
  @ViewChild('complianceAssesmentModal') complianceAssesmentModal:ComplianceAssesmentModalComponent;
  data: any[] = new Array();
  specification: Permissions = new Permissions(this.helper.SP_VALUE, false);
  riskPermission: Permissions = new Permissions(this.helper.RISK_ASSESSMENT_VALUE, false);
  testCase: Permissions = new Permissions(this.helper.TEST_CASE_CREATION_VALUE, false);
  adHocPermission: Permissions = new Permissions(this.helper.Unscripted_Value, false);
  spinnerFlag = false;
  windowHeight = window;
  detailedViewData: any = new Object();
  specList: any[] = new Array();
  riskList: any[] = new Array();
  testCasesList: any[] = new Array();
  adHocList: any[] = new Array();
  @ViewChild('specPanel') specPanel: any;
  @ViewChild('riskPanel') riskPanel: any;
  @ViewChild('testcasePanel') testcasePanel: any;
  @ViewChild('adHocPanel') adHocPanel: any;
  workFlowPermis = [];
  spWorkFlowPer: boolean = false;
  riskWorkFlowPer: boolean = false;
  testcaseWorkFlowPer: boolean = false;
  isTestcaseModulePermission: boolean = false;
  permissionModal: Permissions = new Permissions(this.helper.URS_VALUE, false);
  public inputField: any = [];
  ursSpinnerFlag = false;
  modal: Urs = new Urs();
  editorSwap: boolean = false;
  submitted: boolean = false;
  valadationMessage: string;
  categoryList: any;
  priorityList: any = new Array();
  returnColor: any = '';
  isWorkflowDocumentOrderSequence: string;
  isCheckListEntered:boolean=false;
  potentialList:any;
  implemenationList:any;
  testingMethodList:any;
  projectId:number=0;
  projectSetup: ProjectSetup = new ProjectSetup();
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  isProjectNameEdit:boolean=false;
  projectName:string="";
  validationMessage: string = "";
  unPublishedListForOrder: any[] = new Array();
  @ViewChild('UrsCodeOrderModal') ursCodeOrderModal: any;
  public commonModel: CommonModel = new CommonModel();
  public filteredPendingDocList: any[] = new Array();
  isEnableWorkflow:boolean=false;
  isWorkFlowpage:boolean=false;
  
  percentage: number = 0;
  progressBarColour: string;

  specPercentage: number = 0;
  specProgressBarColour: string;

  riskPercentage: number = 0;
  riskProgressBarColour: string;

  unscriptedPercentage: number = 0;
  unscriptedProgressBarColour: string;
  constructor(private ursService: UrsService, public helper: Helper, public router: Router, public permissionService: ConfigService,public categoryService: CategoryService, public priorityService: priorityService) {
    this.loadPermissions();
  }

  ngOnInit() {
    this.loadTheWorkFlowPermissions();
    this.permissionService.loadCurrentUserDetails().subscribe(jsonResp => {
      this.currentUser = jsonResp;
      this.projectId =this.currentUser.projectId;
      this.loadData();
      this.loadDocuments();
      this.permissionService.HTTPPostAPI(this.projectId,"projectsetup/editproject").subscribe(jsonResp => {
        if (jsonResp.result == 'success') {
          this.projectSetup = jsonResp.data;
          this.projectName=this.projectSetup.projectName;
        }
      });     
    });
  }
  onClickProjectname(){
    this.isProjectNameEdit=true;
  }

  showNext = (() => {
    return () => {
      setTimeout(() => {
        this.validationMessage = "";
        if (!this.helper.isEmpty(this.projectName) && this.projectName != this.projectSetup.projectName) {
          this.permissionService.HTTPPostAPI(this.projectName,"projectsetup/isExistsProjectName").subscribe(
            jsonResp => {
              let responseMsg: boolean = jsonResp;
              if (responseMsg == true) {
                this.validationMessage ="Project with this name already exist.";
              } else {
                this.validationMessage = "";
              }
            }
          );
        }
      }, 200);
    }
  })();

  saveProjectName() {
      this.spinnerFlag = true;
      this.projectSetup.projectName=this.projectName;
      this.projectSetup.editOnlyName=true;
      this.permissionService.HTTPPostAPI(this.projectSetup,"projectsetup/createnew").subscribe(jsonResp => {
        let responseMsg: string = jsonResp.result;
        this.spinnerFlag = false;
        this.isProjectNameEdit=false;
        if (responseMsg === "success") {
          swal({
            title: 'Success',
            text: 'Project "' + this.projectSetup.projectName + '" updated successfully',
            type: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        } 
      }, err => { this.spinnerFlag = false });
    }

  loadData(){
    this.spinnerFlag=true;
    this.ursService.loadRequirementSummary(this.projectId).subscribe(jsonResp => {
      this.spinnerFlag = false;
      this.data = jsonResp;
    },
      err => {
        this.spinnerFlag = false;
      }
    );
  }

  loadPermissions() {
    this.permissionService.isWorkflowDocumentOrderSequence(this.helper.URS_VALUE).subscribe(resp => {
      this.isWorkflowDocumentOrderSequence = resp;
    });
    this.permissionService.loadPermissionsBasedOnModule(this.helper.URS_VALUE).subscribe(resp => {
      this.permissionModal = resp;
    });
    this.permissionService.loadPermissionsBasedOnModule(this.helper.SP_VALUE).subscribe(resp => {
      this.specification = resp;
    });
    this.permissionService.loadPermissionsBasedOnModule(this.helper.RISK_ASSESSMENT_VALUE).subscribe(resp => {
      this.riskPermission = resp;
    });
    this.permissionService.loadPermissionsBasedOnModule(this.helper.IQTC_VALUE).subscribe(resp => {
      if (resp.createButtonFlag) {
        this.testCase = resp;
      } else {
        this.permissionService.loadPermissionsBasedOnModule(this.helper.PQTC_VALUE).subscribe(resp1 => {
          if (resp1.createButtonFlag) {
            this.testCase = resp1;
          } else {
            this.permissionService.loadPermissionsBasedOnModule(this.helper.OQTC_VALUE).subscribe(resp2 => {
              if (resp2.createButtonFlag) {
                this.testCase = resp2;
              } else {
                this.permissionService.loadPermissionsBasedOnModule(this.helper.IOQTC_VALUE).subscribe(resp3 => {
                  if (resp3.createButtonFlag) {
                    this.testCase = resp3;
                  } else {
                    this.permissionService.loadPermissionsBasedOnModule(this.helper.OPQTC_VALUE).subscribe(resp4 => {
                      this.testCase = resp4;
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
    this.permissionService.checkIndividualModulePermission(this.helper.TEST_CASE_CREATION_VALUE).subscribe(resp => {
      this.isTestcaseModulePermission = resp;
    });
    this.permissionService.loadPermissionsBasedOnModule(this.helper.Unscripted_Value).subscribe(resp => {
      this.adHocPermission = resp;
    });
  }

  loadTheWorkFlowPermissions() {
    this.permissionService.loadDocBasedOnProject().subscribe(res => {
      this.workFlowPermis = res;
      if (this.workFlowPermis.length > 0) {
        if (this.workFlowPermis.filter(data => data.key == this.helper.SP_VALUE).length > 0) {
          this.spWorkFlowPer = true;
        }
        if (this.workFlowPermis.filter(data => data.key == this.helper.RISK_ASSESSMENT_VALUE).length > 0) {
          this.riskWorkFlowPer = true;
        }
        if (this.workFlowPermis.filter(data => data.key == this.helper.IQTC_VALUE).length > 0) {
          this.testcaseWorkFlowPer = true;
        } else if (this.workFlowPermis.filter(data => data.key == this.helper.PQTC_VALUE).length > 0) {
          this.testcaseWorkFlowPer = true;
        } else if (this.workFlowPermis.filter(data => data.key == this.helper.OQTC_VALUE).length > 0) {
          this.testcaseWorkFlowPer = true;
        } else if (this.workFlowPermis.filter(data => data.key == this.helper.IOQTC_VALUE).length > 0) {
          this.testcaseWorkFlowPer = true;
        } else if (this.workFlowPermis.filter(data => data.key == this.helper.OPQTC_VALUE).length > 0) {
          this.testcaseWorkFlowPer = true;
        }
      }
    });
  }


  onClickRisk(ursId: number) {
    this.router.navigate(['/add-riskAssessment'], { queryParams: { ursForRisk: [ursId], status: document.location.pathname }, skipLocationChange: true });
  }

  onClickTestCases(ursId: number) {
    this.router.navigate(['/tc-add'], { queryParams: { ursForTest: ursId, status: document.location.pathname }, skipLocationChange: true });
  }

  onClickSP(ursId: number) {
    this.router.navigate(['/sp-master'], { queryParams: { ursForSP: ursId, status: document.location.pathname }, skipLocationChange: true });
  }

  onClickAdHoc(ursId: number) {
    this.router.navigate(["/Ad-hoc/add-Ad-hoc-testcase"], { queryParams: { ursForAdHoc: ursId, status: document.location.pathname }, skipLocationChange: true });
  }

  loadDetailedView(data: any) {
    this.permissionService.HTTPGetAPI("urs/loadUrsCheckListById/"+data.id).subscribe(res =>{
      this.detailedViewData = data;
      this.permissionService.HTTPGetAPI("urs/loadComplianceRequirements/"+data.id).subscribe(response => {
        this.detailedViewData.complianceRequirements=response.result;
        this.detailedViewData.checklist=res;
        if (this.specPanel.isToggled)
          this.loadSpecDetails(this.detailedViewData.id);
        if (this.riskPanel.isToggled)
          this.loadRiskDetails(this.detailedViewData.id);
        if (this.testcasePanel.isToggled)
          this.loadTestcaseDetails(this.detailedViewData.id);
        if (this.adHocPanel.isToggled)
          this.loadAdHocDetails(this.detailedViewData.id);
      });
    });
  }

  loadSpecDetails(id) {
    this.spinnerFlag = true;
    this.ursService.getUrsSpecMappingDetails(id).subscribe(jsonResp => {
      this.spinnerFlag = false;
      this.specList = jsonResp;
    },
      err => {
        this.spinnerFlag = false;
      }
    );
  }

  loadRiskDetails(id) {
    this.spinnerFlag = true;
    this.ursService.getUrsRiskMappingDetails(id).subscribe(jsonResp => {
      this.spinnerFlag = false;
      this.riskList = jsonResp;
    },
      err => {
        this.spinnerFlag = false;
      }
    );
  }

  loadTestcaseDetails(id) {
    this.spinnerFlag = true;
    this.ursService.getUrsTestcasesMappingDetails(id).subscribe(jsonResp => {
      this.spinnerFlag = false;
      this.testCasesList = jsonResp;
    },
      err => {
        this.spinnerFlag = false;
      }
    );
  }

  loadAdHocDetails(id) {
    this.spinnerFlag = true;
    this.ursService.getUrsAdHocMappingDetails(id).subscribe(jsonResp => {
      this.spinnerFlag = false;
      this.adHocList = jsonResp;
    },
      err => {  
        this.spinnerFlag = false;
      }
    );
  }
  navigateToChild(key, row) {
    let url;
    let id;
    let  roleBack;
    switch (key) {
      case "200":
        url = '/sp-master';
        id = row.id;
       
        break;
      case "113":
        url = '/riskAssessment';
        id = row.id;
        break;
      case "150":
        url = row.url;
        id = row.id;
        roleBack="/URS/view-urs";
        break;
      case "201":
        url = '/Ad-hoc/view-Ad-hoc-testcase';
        id = row.id;
        break;
      default:
        url = undefined
        break;
    }
    if (url) {
      this.router.navigate([url],
        {
          queryParams: {
               id: id, 
               status: "/requirementSummary",
               roleBack:roleBack,
              }, 
              skipLocationChange: true });
     }

  }

  onCloseImportUrsModal(){
    this.loadData();
  }
  importUrsModal(){
    this.importUrs.showModalView();
  }

  urlRedirection(urs) {
    this.router.navigate(['/URS/add-urs',urs.id], { queryParams: {redirectUrl:'/requirementSummary'}, skipLocationChange: true });
  }
  saveAndGoto(formIsValid) {
    this.isCheckListEntered = false;
    this.modal.checklist.forEach(checkList => {
      if (this.helper.isEmpty(checkList.checklistName) || this.helper.isEmpty(checkList.displayOrder))
        this.isCheckListEntered = true;
    });
    this.ursSpinnerFlag = true;
    if (!formIsValid || this.modal.category == 0 || this.modal.priority == 0 || this.isCheckListEntered) {
      this.submitted = true;
      this.ursSpinnerFlag = false;
      return;
    }
    else {
      this.modal.id = 0;
      this.modal.jsonExtraData="[]";
      this.modal.projectSetupId=this.projectId;
      this.ursService.saveAndGoto(this.modal).subscribe(result => {
        this.loadData();
        this.submitted = false;
        this.ursSpinnerFlag = false;
        if (result.result === "success") {
            swal({
              title: 'Success', type: 'success', timer: this.helper.swalTimer, showConfirmButton: false,
              text: 'User Requirement Specification Updated Successfully',
              onClose: () => {
                this.createUrsModal.hide();
              }
            });
        } else {
          if(result.result === "failure"){
            swal({
              title: 'Error', type: 'error', timer: this.helper.swalTimer, showConfirmButton: false,
              text: ' User Requirement specification has not  been saved.',
            }
            );
          }else{
            swal({
              title: 'Warning', type: 'warning', timer: this.helper.swalTimer, showConfirmButton: false,
              text: result.result,
            }
            );
          }
        }
      }, err => {
        this.submitted = false;
        this.ursSpinnerFlag = false;
      });
    }
  }
  onClickCreateUrs() {
    this.modal=new Urs();
    this.modal.potentialRisk ="None";
    this.submitted = false;
    this.modal.testingRequired=true;
    this.returnColor="";
    this.permissionService.HTTPPostAPI({ "categoryName": "URSTestingMethod", "orgId": 0 }, "lookup/getCategoryItemByName").subscribe(result => {
      this.testingMethodList = result.response;
      this.onTestingRequired();
    });
    this.categoryService.loadCategory().subscribe(response => {
      this.categoryList = response.result;
    });
    this.priorityService.loadAllPriority().subscribe(response => {
      this.priorityList = response.result;
    });
    this.permissionService.HTTPPostAPI({ "categoryName": "URSPotentialRisk", "orgId": 0 }, "lookup/getCategoryItemByName").subscribe(result => {
      this.potentialList = result.response;
    });

    this.permissionService.HTTPPostAPI({ "categoryName": "URSImplementationMethod", "orgId": 0 }, "lookup/getCategoryItemByName").subscribe(result => {
      this.implemenationList = result.response;
    });
  }
  
  selectOption(data) {
    let filteredData: any;
    filteredData = this.priorityList.filter(res => Number(data) == res.id);
    if (!this.helper.isEmpty(filteredData))
      filteredData.forEach(element => {
        this.returnColor = element.priorityColor;
      });
    return this.returnColor;
  }

  /**
   * Checklist
   */
  addChecklistItem() {
    this.isCheckListEntered = false;
    this.modal.checklist.forEach(checkList => {
      if (this.helper.isEmpty(checkList.checklistName) || this.helper.isEmpty(checkList.displayOrder))
        this.isCheckListEntered = true;
    });
    if (!this.isCheckListEntered) {
      let data = new CheckListEquipmentDTO();
      data.id = 0;
      data.checklistName = "";
      data.displayOrder = this.modal.checklist.length + 1;
      this.modal.checklist.push(data);
    }
    setTimeout(() => {
      $('#check_list_name_id_' + (this.modal.checklist.length - 1)).focus();
    }, 600);
  }

  onChangecheckList() {
    this.isCheckListEntered = false;
    this.modal.checklist.forEach(checkList => {
      if (this.helper.isEmpty(checkList.checklistName))
        this.isCheckListEntered = true;
    });
  }
  deleteCheckList(data) {
    this.modal.checklist = this.modal.checklist.filter(event => event !== data);
  }

  singlepublishData(data) {
    this.spinnerFlag = true;
    data.publishedflag = true;
    this.ursService.singlePublish(data).subscribe(res => {
      this.loadData();
      this.loadDocuments();
      if (res.msg === this.helper.SUCCESS_RESULT_MESSAGE) {
        data.status="Published"
        this.spinnerFlag = false;
        swal({
          title: 'Success',
          text: 'Record has been published',
          type: 'success',
          timer: 2000, showConfirmButton: false
        });
      } else {
        this.spinnerFlag = false;
      }
    });
  }
  onChangeStatus(checkList){
    this.spinnerFlag=true;
    this.permissionService.HTTPGetAPI("urs/changeChecklistStatus/"+checkList.id).subscribe(res =>{
      if(res.result){
        checkList.updatedBy=res.result.updatedBy;
        checkList.displayUpdatedTime=res.result.displayUpdatedTime;
      }
      this.spinnerFlag=false;
    });
  }
  onCloseDetailedView(){
    this.permissionService.HTTPGetAPI("urs/getUrsChecklistStatusCount/"+this.detailedViewData.id).subscribe(res =>{
      if(res.result){
        this.detailedViewData.checkListstatusCount=res.result;
      }
    });
  }
  onTestingRequired(){
    if(this.modal.testingRequired){
      this.modal.implementationMethod ="Out of box";
      this.onChangePotentialAndImplemenation();
    }else{
      this.modal.implementationMethod ="";
      this.modal.testingMethod ="";
    }
  }
  onChangePotentialAndImplemenation(){
    if(this.modal.implementationMethod === 'Custom' && this.modal.potentialRisk === 'High'){
      this.modal.testingMethod = this.testingMethodList[0].key;
    }else{
      this.modal.testingMethod = this.testingMethodList[1].key;
    }
  }
  loadDataForOrder(){
    this.permissionService.HTTPGetAPI("urs/loadDraftDataForProject/"+this.projectId).subscribe(
      jsonResp => {
        if (jsonResp.unpublishedList && jsonResp.unpublishedList.length > 0){
          this.unPublishedListForOrder=jsonResp.unpublishedList;
          this.unPublishedListForOrder = this.unPublishedListForOrder.sort((a, b) => (a.ursCode < b.ursCode ? -1 : 1));
          this.orderList(this.unPublishedListForOrder);
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
  updateOrder(userRemarks:any){
    this.spinnerFlag=true;
    if(this.unPublishedListForOrder.length > 0){
      this.unPublishedListForOrder[0].userRemarks=userRemarks;
    }
    this.ursService.updateUrsCodeOrder(this.unPublishedListForOrder).subscribe(jsonResp => {
      this.spinnerFlag=false;
      this.ursCodeOrderModal.hide();
      this.loadData();
    });
  }
  publishData() {
    this.spinnerFlag = true;
    let url="urs/loadAllPublishedURSForImport/"+this.projectId+"/draft";
    this.permissionService.HTTPGetAPI(url).subscribe(jsonResp => {
      let list= jsonResp.unpublishedList;
      list.forEach(d => {
        d.publishedflag = true;
      });
      this.ursService.publish(list).subscribe(result => {
        this.spinnerFlag = false;
        this.loadData();
        this.loadDocuments();
        swal({
          title: 'Success',
          text: 'Records has been published',
          type: 'success',
          timer: 2000, showConfirmButton: false
        });
      }, er => {
      });
    });
  }
  onCloseAddWorkflowModal(){

  }
  onClickWorkflow(){
    this.addDocumentWorkFlow.showModalView();
  }

  loadDocuments() {
    this.permissionService.loadCurrentUserDetails().subscribe(response => {
      this.currentUser = response;
      this.spinnerFlag=true;
      this.commonModel.type = 'workflowapprovalStatus';
      this.commonModel.categoryName = 'pending';
      this.commonModel.dataType = 'opt1';
      this.commonModel.value=this.helper.URS_VALUE;
      this.permissionService.HTTPGetAPI("common/getWorkflowJobStatus/"+this.helper.URS_VALUE+"/"+false).subscribe(res =>{
        this.permissionService.HTTPPostAPI(this.commonModel, 'workFlow/loadDocumentsForUserAndDocumentType').subscribe(response => {
          this.filteredPendingDocList = response.pendingList;
            this.bulkApprovalTimeLine();
        },
          err => {
            this.spinnerFlag = false
        });
      });
    });
  }
  bulkApprovalTimeLine() {
    this.isEnableWorkflow=false;
    this.spinnerFlag=true;
    const stepperModule: StepperClass = new StepperClass()
    stepperModule.constantName = this.helper.URS_VALUE;
    this.permissionService.HTTPPostAPI(stepperModule, 'workFlow/bulkDocumentApproveTimeLine').subscribe(response => {
      let getStatus = response.timeLine;
      for(let element of getStatus){
        element.errorList = this.filteredPendingDocList.filter(e => e.currentLevel === element.levelId);
        if (this.filteredPendingDocList.length > 0 && element.errorList && element.errorList.length > 0) {
          if (element.permission) {
            this.isEnableWorkflow=true;
          }
        }
      }
      this.spinnerFlag=false;
    });
  }
  calculatePercentage(totalSum, value) {
    if (totalSum == 0 && value == 0)
      this.percentage = 0;
    else
      this.percentage = Math.floor(value / totalSum * 100);
    this.progressBarColour = this.percentage == 100 ? "progress-bar bg-success" : "progress-bar";
    return this.percentage;
  }

  specCalculatePercentage(totalSum, value) {
    if (totalSum == 0 && value == 0)
      this.specPercentage = 0;
    else
      this.specPercentage = Math.floor(value / totalSum * 100);
    this.specProgressBarColour = this.specPercentage == 100 ? "progress-bar bg-success" : "progress-bar";
    return this.specPercentage;
  }

  riskCalculatePercentage(totalSum, value) {
    if (totalSum == 0 && value == 0)
      this.riskPercentage = 0;
    else
      this.riskPercentage = Math.floor(value / totalSum * 100);
    this.specProgressBarColour = this.riskPercentage == 100 ? "progress-bar bg-success" : "progress-bar";
    return this.riskPercentage;
  }

  unscriptedCalculatePercentage(totalSum, value) {
    if (totalSum == 0 && value == 0)
      this.unscriptedPercentage = 0;
    else
      this.unscriptedPercentage = Math.floor(value / totalSum * 100);
    this.unscriptedProgressBarColour = this.unscriptedPercentage == 100 ? "progress-bar bg-success" : "progress-bar";
    return this.unscriptedPercentage;
  }
  onClickCompliance(){
    this.complianceAssesmentModal.viewModal();
  }
  onSubmitComplianceAssesment(event){
    this.modal.complianceRequirements=event.map(option => ({ id: option.id, itemName: option.category }));
    if(this.detailedViewData)
      this.detailedViewData.complianceRequirements=event;
  }

  onClickCompliances(data){
    this.complianceAssesmentModal.viewModalWithData(data.complianceRequirements,data.id);
  }

}
