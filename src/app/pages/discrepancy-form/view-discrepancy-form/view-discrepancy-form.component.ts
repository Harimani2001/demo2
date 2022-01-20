import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartOptions } from 'chart.js';
import swal from 'sweetalert2';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { Permissions } from '../../../shared/config';
import { ConfigService } from '../../../shared/config.service';
import { Helper } from '../../../shared/helper';
import { FileUploadForDocComponent } from '../../file-upload-for-doc/file-upload-for-doc.component';
import { ImageviewComponent } from '../../imageview/imageview.component';
import { IQTCService } from '../../iqtc/iqtc.service';
import { VideoViewerComponent } from '../../video-viewer/video-viewer.component';
import { ViewTestcaseFileListComponent } from '../../view-testcase-file-list/view-testcase-file-list.component';
import { DiscrepancyFormRoutesService } from '../discrepancy-form.service';
import { dropDownDto, StepperClass, WorkflowDocumentStatusDTO } from './../../../models/model';
@Component({
  selector: 'app-view-discrepancy-form',
  templateUrl: './view-discrepancy-form.component.html',
  styleUrls: ['./view-discrepancy-form.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class ViewDiscrepancyFormComponent implements OnInit, AfterViewInit {
  @ViewChild('discrepancyTab') tab: any;
  @ViewChild('viewImageComponent') viewImageComponent: ImageviewComponent;
  @ViewChild('viewVideoComponent') viewVideoComponent: VideoViewerComponent;
  @ViewChild('modalFileViewer') preViewModal: any;
  @ViewChild('fileupload') private file: FileUploadForDocComponent;
  @ViewChild('viewFileOfTestCase') private viewFile: ViewTestcaseFileListComponent;
  @ViewChild('workFlowForDF') workFlowForDF: any;
  completedData: any;
  publishedData: any = [];
  public spinnerFlag: boolean = false;
  isSelectedPublishData: boolean = false;
  popupDFData = [];
  viewDFDetails: boolean = false;
  imageURL: any;
  videoURL: any;
  routeback: any = null;
  selectedVideo: string = "";
  selectedScreenShot: string = "";
  tableView: boolean = false;
  commonDocumentStatusValue: any;
  isTestCaseVersionCreated: boolean = false;
  selectAll: boolean = false;
  @ViewChild('myTable') table: any;
  permisionModal: Permissions = new Permissions('134', false);
  category: any;
  dfDropDown: dropDownDto;
  public filterQuery = '';
  search: boolean = true;
  hideCategory: boolean = true;
  viewPdfPreview: boolean= false;
  fileFlag: boolean = true;
  dfList:any = [];
  data:any;
  dfListFlag:boolean = false;
  pieChartType: string = 'pie';
  showSearch: boolean = false;
  pieChartWithWorkFlow: Array<any> = [{
    backgroundColor: ['#eb5334', '#87CEFA', '#ebe834', '#97DC21'],
  }];
  pieChartWithNoWorkFlow: Array<any> = [{
    backgroundColor: ['#eb5334', '#87CEFA', '#97DC21'],
  }];
  pieChartLabelsWithWorkFlow: string[] = ['Draft', 'Published', 'In-Progress', 'Completed'];
  pieChartLabelsWithNoWorkFlow: string[] = ['Draft', 'Published', 'Completed'];
  pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'left',
    },
  };

  constructor(public permissionService: ConfigService, private comp: AdminComponent, public route: ActivatedRoute, private router: Router, private dfServices: DiscrepancyFormRoutesService, public helper: Helper, public iqtcServices: IQTCService) { }

  ngOnInit() {
    this.tableView = true;
    this.viewDFDetails=false;
    this.permissionService.getUserPreference(this.helper.DISCREPANCY_VALUE).subscribe(res =>{
      if (res.result)
        this.loadData(res.result);
      else
        this.loadData();
    });
    this.comp.setUpModuleForHelpContent("134");
    this.comp.taskDocType = "134";
    this.comp.taskDocTypeUniqueId = "";
    this.comp.taskEquipmentId = 0;
    this.permissionService.loadPermissionsBasedOnModule("134").subscribe(resp => {
      this.permisionModal = resp
    });
    this.route.queryParams.subscribe(rep => {
      if (rep.id !== undefined) {
        this.routeback = rep.id
        if (rep.status != undefined) {
          this.commonDocumentStatusValue = rep.status;
        } else {
          this.routeback = null;
        }
        if (rep.testcase != undefined) {
          this.viewDFOfTestCase(rep.id);
        } else {
          this.viewDF(rep.id);
        }
      }
    });
    this.helper.listen().subscribe((m: any) => {
      this.viewDF(m)
    })
    this.loadDropDownDf();
    this.loadSummaryForDF();
  }
  ngAfterViewInit(): void {
   let interval= setInterval(()=>{
      if(this.tab){
        if (localStorage.getItem('discrepancyTab')){
          this.tab.activeId = this.helper.decode(localStorage.getItem('discrepancyTab'));
          this.spinnerFlag = false;
        }
        clearInterval(interval);
      }
    },100);
  }

  loadData(tabId?) {
    this.selectAll = false;
    this.search = false;
    this.tableView=true;
    this.viewDFDetails=false;
    var currentTab;
    if (!tabId) {
      if (localStorage.getItem('discrepancyTab')) {
        currentTab = this.helper.decode(localStorage.getItem('discrepancyTab'));
      } else {
        currentTab = "onGoing";
      }
    } else {
      currentTab = tabId
    }
    if (currentTab != 'summary') {
        this.search = true;
    this.spinnerFlag = true;
    this.dfServices.getDfData(currentTab).subscribe(responce => {
      this.publishedData = responce.publishedList;
      this.completedData = responce.completedList;
      this.spinnerFlag = false;
    })
  }
  }

  view(path, isImage) {
    if (isImage)
      this.comp.downloadOrViewFile('dummyImage.png', path, true, 'ScreenShot Image');
    else
      this.comp.downloadOrViewFile('dummyVideo.webm', path, true, 'Recorded Video');
  }

  openSuccessCancelSwal(deleteObj, id) {
    swal({
      title: "Write your comments here:",
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
        if (value) {
          deleteObj.userRemarks = "Comments : " + value;
          this.deleteForm(deleteObj);
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
  deleteForm(deleteObj) {
    this.spinnerFlag = true;
    this.dfServices.deleteFormData(deleteObj).subscribe(response => {

      if (response.result === "success") {
        status = "success";
        swal({
          title: 'Deleted Successfully!',
          text: 'Record has been deleted',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        }

        );
        this.loadData();
        this.spinnerFlag = false;
      } else {
        swal({
          title: 'Delete Failed!',
          text: 'Record has not been uploaded. Try again!',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        }

        );
        this.spinnerFlag = false;
      }
    })
  }

  ViewFileList(fileList, isImage) {
    if (isImage)
      this.viewFile.viewImage(fileList, isImage);
    else
      this.viewFile.viewVideo(fileList, isImage);
  }

  onChangePublishData() {
    this.isSelectedPublishData = this.publishedData.filter(data => data.publishFlag).length > 0 ? true : false;
  }

  enableTableView() {
    this.comp.taskDocType = "";
    this.comp.taskDocTypeUniqueId = "";
    this.comp.taskEquipmentId = 0;
    setTimeout(() => {
      this.permissionService.getUserPreference(this.helper.DISCREPANCY_VALUE).subscribe(res => {
        if (res.result)
          this.tab.activeId = res.result;
      });
    }, 10)
    this.tableView = true;
    this.viewDFDetails = false;
  }

  viewDF(rowId: any) {
    this.fileFlag = true;
    this.tableView = false;
    this.spinnerFlag = true;
    this.popupDFData = [];
    this.dfServices.getDfDataById(rowId).subscribe(jsonResp => {
      if (jsonResp.data.length != 0) {
        this.popupDFData.push(jsonResp.data);
        this.comp.taskDocType = this.popupDFData[0].documentType.toString();
        this.comp.taskDocTypeUniqueId = this.popupDFData[0].testCaseId;
        this.comp.taskEquipmentId = 0;
      }
      this.viewDFDetails = true;
      this.dfServices.isTestCaseCreated(rowId).subscribe(jsonResp => {
        this.isTestCaseVersionCreated = jsonResp.result;
      })
      this.workflowfunction(jsonResp);
      this.stepperfunction(jsonResp);

      let interval = setInterval(() => {
        if (this.file) {
          this.file.loadFileListForEdit(jsonResp.data.id, jsonResp.data.testCaseName).then((result) => {
            this.fileFlag = result;
            clearInterval(interval);
          }).catch((err) => {
            this.spinnerFlag = false;
            clearInterval(interval);
          });
          this.spinnerFlag = false;
        }
      }, 1000);
    
    })
  }
  wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
      end = new Date().getTime();
    }
  }
  
  onClickTestCase(type, id, dfId) {
    this.router.navigate(['/tc-execution/'+type], { queryParams: { id: id, status: '/df/view-df', dfID: dfId } });
  }

  viewDFOfTestCase(testcaseId: any) {
    this.tableView = false;
    this.spinnerFlag = true;
    this.popupDFData = [];
    this.iqtcServices.loadDFData(testcaseId).subscribe(jsonResp => {
      if (jsonResp.data.length != 0)
        this.popupDFData.push(jsonResp.data);
      this.viewDFDetails = true;
      this.spinnerFlag = false;
    })
  }

  stepperfunction(jsonResp: any) {
    const stepperModule: StepperClass = new StepperClass();
    stepperModule.constantName = this.helper.getDFForTestCase(jsonResp.data.documentType);
    stepperModule.code = jsonResp.data.testCaseName;
    stepperModule.documentIdentity = jsonResp.data.id;
    stepperModule.publishedFlag = jsonResp.data.publishFlag;
    stepperModule.creatorId = jsonResp.data.creatorId;
    stepperModule.lastupdatedTime = jsonResp.data.updatedTime;
    stepperModule.displayCreatedTime = jsonResp.data.displayCreatedTime;
    stepperModule.displayUpdatedTime = jsonResp.data.displayUpdatedTime;
    stepperModule.documentTitle = jsonResp.data.testCaseName;
    stepperModule.createdBy = jsonResp.data.createdBy;
    stepperModule.updatedBy = jsonResp.data.updatedBy;
    this.wait(1000);
    this.helper.stepperchange(stepperModule);
    this.viewDFDetails = true;
    this.spinnerFlag = false;

  }
  workflowfunction(jsonResp: any) {
    if (jsonResp.data.publishFlag) {
      const workflowmodal: WorkflowDocumentStatusDTO = new WorkflowDocumentStatusDTO();
      workflowmodal.documentType = this.helper.DISCREPANCY_VALUE;
      workflowmodal.documentId = jsonResp.data.id;
      workflowmodal.currentLevel = jsonResp.data.currentCommonLevel;
      workflowmodal.documentCode = jsonResp.data.testCaseName;
      workflowmodal.workflowAccess = jsonResp.data.workflowAccess;
      workflowmodal.docName = 'Discripancy form';
      workflowmodal.publishFlag = jsonResp.data.publishFlag;
      this.helper.setIndividulaWorkflowData(workflowmodal);
    }
  }
  publishData() {
    this.spinnerFlag = true;
    this.dfServices.publishTestCases(this.publishedData).subscribe(response => {
      if (response.result === "success") {
        status = "success";
        swal({
          title: 'Submitted Successfully!',
          text: 'Record has been Submitted',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        }
        );
        this.spinnerFlag = false;
        this.isSelectedPublishData = false;
      } else {
        swal({
          title: 'Submittion Failed!',
          text: 'Record has not been Submitted. Try again!',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        }
        );
        this.spinnerFlag = false;
      }
      this.loadData();
    });
  }

  SinglepublishData(data){
    this.spinnerFlag = true;
    data.publishFlag = true;
    this.permissionService.HTTPPostAPI(data,"discrepancy/singlePublish").subscribe(res=>{
      if (res.result === "success") {
        status = "success";
        swal({
          title: 'Submitted Successfully!',
          text: 'Record has been Submitted',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        }
        );
        this.spinnerFlag = false;
        this.isSelectedPublishData = false;
        this.viewDF(data.id);
      } else {
        swal({
          title: 'Submittion Failed!',
          text: 'Record has not been Submitted. Try again!',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        }
        );
        this.spinnerFlag = false;
      }
      this.loadData();
    });
  }

  loadVideo(id) {
    this.spinnerFlag = true;
    this.dfServices.loadVideoFile(id, this.selectedVideo).subscribe(jsonResp => {
      if (jsonResp != null) {
        this.comp.downloadOrViewFile('dummyVideo.webm', jsonResp.path, true, 'Recorded Video');
      }
      this.spinnerFlag = false;
    });
  }

  reload() {
    this.loadData();
    this.closeView();
  }

  closeView() {
    this.imageURL = "";
    this.selectedScreenShot = "";
    this.selectedVideo = "";
    this.videoURL = ""
  }

  loadImage(id) {
    this.spinnerFlag = true;
    this.dfServices.loadImageFile(id, this.selectedScreenShot).subscribe(jsonResp => {
      this.imageURL = jsonResp.image;
      this.viewImageComponent.openView(this.imageURL);
      this.spinnerFlag = false;
    }, error => this.spinnerFlag = false);

  }
  saveCurrentTab(tabName){
    this.permissionService.saveUserPreference(this.helper.DISCREPANCY_VALUE,tabName).subscribe(res =>{});
  }

  tabChange(id: any) {
    this.saveCurrentTab(id);
    this.isSelectedPublishData = false;
    switch (id) {
      case "completed":
        this.loadData(id);
       
        this.search = true;
        break;
      case "onGoing":
        this.loadData(id);
        this.viewPdfPreview = false;
        this.search = true;
        break;
      case "audit":
        this.search = false;
        break;
      case "approve":
        this.onChangeDocument();
        this.search = false;
        break;
        case "summary":
          this.loadSummaryForDF();
          this.search = false;
          break;
      default:
        break;
    }
  }


  selectAllDataForSubmit(event) {
    this.selectAll = event.currentTarget.checked;
    if (event.currentTarget.checked) {
      this.publishedData.forEach(d => {
        if (d.dfStatus == 'Resolved' || d.dfStatus == 'N.A') {
          this.isSelectedPublishData = true;
          d.publishFlag = true;
        } else
          d.publishFlag = false;
      });

    } else {
      this.publishedData.forEach(d => {
        d.publishFlag = false;
      });
      this.isSelectedPublishData = false;
    }
  }

  onChangeDocument() {
    const interval = setInterval(() => {
      if (this.workFlowForDF) {
        this.workFlowForDF.permissionConstant = this.category;
        this.workFlowForDF.loadDefault();
        clearInterval(interval);
      }
    }, 600)

  }

  loadDropDownDf() {
    this.dfServices.getAllDFDropDownListForProject().subscribe(response => {
      if (response.data.length > 0) {
        this.hideCategory = true;
        this.dfDropDown = response.data;
      }else
      this.hideCategory = false;
      if (response.data.length == 1) {
        this.category = this.dfDropDown[0].key;
        this.onChangeDocument();
      }
    });
  }

  loadSummaryForDF(){
    this.permissionService.HTTPPostAPI("0","discrepancy/getSummaryDataForProject").subscribe(res=>{
      this.data = res.data;
      this.comboChartData();
     });
  }

  comboChartData(){
    this.data.forEach((version,index) => {
      let comboChartData =  {
        chartType: 'ComboChart',
        dataTable: [],
        options: {
          height: 165,
          width:1000,
          vAxis: { title: 'No of Documents' },
          hAxis: { title: 'Document' },
          seriesType: 'bars',
          series: { 5: { type: 'line' } },
          colors: ['#919aa3', '#62d1f3', '#FFB64D', '#93BE52','#97DC21'],
          chartArea:{left:50,top:25, width:800},
        },
      };
     version.nodataInChartFlag=true;
      version.dto.forEach((document:any) => {
          let documentData:any[]=new Array();
          documentData.push(document.name);
          documentData.push(document.noRun);
          documentData.push(document.resolved);
          documentData.push(document.hold);
          documentData.push(document.pending);
          documentData.push(document.na);
          comboChartData.dataTable.push(documentData);
      });
      if(comboChartData.dataTable.length>0){
        comboChartData.dataTable.unshift(['Document', 'New', 'Resolved', 'Hold', 'Pending','N.A']);
      }
      version['comboChartData']=comboChartData;
    });
  }

  // loadDetailedView(data:any){
  //   this.dfList=[];
  //   this.dfListFlag=true;
  //   this.dfList=data.dfList;
  // }

  pieChartView(element,flag){
    let chartData = new Array();
        chartData.push(element.Draft);
        chartData.push(element.Publish);
        if(flag)
        chartData.push(element.inProgress);
        chartData.push(element.Completed);
    return chartData;
  }

}
