
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { DOCUMENT } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import swal from 'sweetalert2';
import { BehaviorSubject, Observable } from '../../../../node_modules/rxjs';
import { CommonModel, dropDownDto, NavMasterDto, User, UserPrincipalDTO, ModulePermissionDto } from '../../models/model';
import { AuthenticationService } from '../../pages/authentication/authentication.service';
import { DateFormatSettingsService } from '../../pages/date-format-settings/date-format-settings.service';
import { FileUploadForDocService } from '../../pages/file-upload-for-doc/file-upload-for-doc.service';
import { FileViewComponent } from '../../pages/file-view/file-view.component';
import { IQTCService } from '../../pages/iqtc/iqtc.service';
import { KnowledgeBaseService } from '../../pages/knowledge-base/knowledge-base.service';
import { LocationService } from '../../pages/location/location.service';
import { projectsetupService } from '../../pages/projectsetup/projectsetup.service';
import { UrsService } from '../../pages/urs/urs.service';
import { ConfigService } from '../../shared/config.service';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';
import { Permissions } from '../../shared/config';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css', './notification.scss', '/../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  providers: [projectsetupService, UrsService, ConfigService, FileUploadForDocService],
})

export class AdminComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modalSmallProjectGlobal') modalSmallProjectGlobal;
  @ViewChild('createProjectModal') createProjectModal;
  @ViewChild('modalSmallTaskGlobal') modalTaskGlobal;
  @ViewChild('TaskCreation') modalTaskCreation;
  @ViewChild('fileuploadAdmin') private fileupload: any;
  @ViewChild('viewFileGlobal') private viewFile: FileViewComponent;
  @ViewChild('headernotification') el: ElementRef;
  @ViewChild('iframeKnowId') iframe: ElementRef;
  @ViewChild('modalLarge') modalLarge: any;
  @ViewChild('videoModalSmall') modalSmall: ModalBasicComponent;
  @ViewChild('videoViewTag') videoViewTag: any;
  isloading = false;
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  navDocuments: any[] = new Array();
  navForms: any[] = new Array();
  navTemplates: any[] = new Array();
  public titleList: any[] = new Array();
  public notificationList: any;
  selectedModule: string = "";
  // This is use for creating the task form their component;
  public taskDocType: string;
  public taskDocTypeUniqueId: string = "";
  public taskEquipmentId: number = 0;
  public taskEnbleFlag: boolean = false;
  // This is use for creating the task form their component;
  knowledgeBaseContent: any;
  content: string = "";
  public navMasterDto: NavMasterDto = new NavMasterDto();
  showModal: boolean = false;
  spinnerFlag: boolean = false;
  videoSpinnerFlag: boolean = false;
  // for screen recording
  documentType: any;
  videoFile: any;
  mainElementDisplay: boolean = false;
  showSuccessMsg: boolean = false;
  timeZone: string = "";
  receivedId: any;
  location: any;
  projectStatus: boolean = true;
  locationsList: any;
  data: any;
  globalProjectId: any;
  showMeFlag: boolean = false;
  showProjectSelectionModel: boolean = false;
  projectName: string = "";
  createprojectSpinnerFlag: boolean = false;
  validationMessage: string = "";
  gxpFormFlag: boolean = true;
  searchText: string;
  selectedIndex = -1;
  list = [];
  filteredList = [];
  userModules: Array<ModulePermissionDto> = [];
  public source = new BehaviorSubject<dropDownDto>(new dropDownDto());
  globalProjectObservable = this.source.asObservable();
  model: User;
  modal: CommonModel = new CommonModel();
  isApplicationAdmin: boolean = false;
  userName: string;
  roleName: string;
  isViewOrgProfile: boolean = false;
  isViewDashboard: boolean = false;
  isViewDocumentApproval: boolean = false;
  validationProjectModuleList = [];
  projectPermission: Permissions = new Permissions("100", false);
  projectCountFlag = false;
  constructor(private renderer2: Renderer2, @Inject(DOCUMENT) private _document, public service: IQTCService,
    public authenticationService: AuthenticationService, private cdr: ChangeDetectorRef, public locationService: LocationService,
    private http: Http, public config: ConfigService, public router: Router, public projectsetupService: projectsetupService,
    public configService: ConfigService, public knowledgeBaseService: KnowledgeBaseService, private servie: DateFormatSettingsService) {

    (function ($) {
      "use strict";
      //Open notification dropdown when clicking on element
      $(document).on('click', "a[data-dropdown='notificationMenu']", function (e) {
      });
      //Open search dropdown when clicking on element
      $(document).on('click', "a[data-dropdown='searchMenu']", function (e) {
      });

      //Close dropdowns on document click
      $(".dropdown-container").click(function (e) {
        e.stopPropagation();
      });

      $(document).on('click', '#dropdownOverlay', function (e) {
        var el = (<any>$(e.currentTarget)[0]).activeElement;
        if (typeof $(el).attr('data-dropdown') === 'undefined') {
          $('#dropdownOverlay').remove();
          $('.dropdown-container.expanded').removeClass('expanded');
        }
      })

      $(document).click(function (e) {
        var el = (<any>$(e.currentTarget)[0]).activeElement;
        if (typeof $(el).attr('data-dropdown') === 'undefined') {
          $('#dropdownOverlay').remove();
          $('.dropdown-container.expanded').removeClass('expanded');
        }
      });

      $(document).on('click', '.notification-list-item', function (e) {
        e.stopPropagation();
      });

      $(function () {
        var header = $(".start-style");
        $(window).scroll(function () {
          var scroll = $(window).scrollTop();
          if (scroll >= 10) {
            header.removeClass('start-style').addClass("scroll-on");
          } else {
            header.removeClass("scroll-on").addClass('start-style');
          }
        });
      });

      //Animation
      $(document).ready(function () {
        $('body.hero-anime').removeClass('hero-anime');
      });

      //Menu On Hover
      $('body').on('mouseenter mouseleave', '.nav-item', function (e) {
        if ($(window).width() > 750) {
          var _d = $(e.target).closest('.nav-item'); _d.addClass('show');
          setTimeout(function () {
            _d[_d.is(':hover') ? 'addClass' : 'removeClass']('show');
          }, 1);
        }
      });

      //Switch light/dark
      $("#switch").on('click', function () {
        if ($("body").hasClass("dark")) {
          $("body").removeClass("dark");
          $("#switch").removeClass("switched");
        }
        else {
          $("body").addClass("dark");
          $("#switch").addClass("switched");
        }
      });

    })(jQuery);
    this.taskEnbleFlag = false;
  }

  opennotificationdropdown(e) {
    e.preventDefault();
    var container = $(e.currentTarget).parent();
    var dropdown = container.find('.dropdown');
    var containerWidth = container.width();
    dropdown.css({
      'right': containerWidth / 2 + 'px'
    })
    container.toggleClass('expanded " "');
  }

  ovenenvelope(e) {
    e.stopPropagation();
    if ($(e.currentTarget).parent().hasClass('expanded')) {
      $('.notification-group').removeClass('expanded');
    }
    else {
      $('.notification-group').removeClass('expanded');
      $(e.currentTarget).parent().toggleClass('expanded');
    }
  }

  loadnavBar() {
    this.configService.HTTPGetAPI("modules/getDefaultModulesForSearch").subscribe(res =>{
      if(res){
        this.validationProjectModuleList=res.map(m => m.value);
      }
    });
    this.configService.HTTPPostAPI("", "modules/loadNavBarPermission").subscribe(response => {
      this.navMasterDto = response;
      // Loading Respective module if the user has access
      if (this.navMasterDto.formsPermission) {
        this.loadNavBarForms();
      }
      if (this.navMasterDto.templatesPermission) {
        this.loadNavBarTemplates();
      }
      if (!this.isApplicationAdmin) {
        this.loadNavBarForDocuments();
      }
      this.isloading = true;
    });
  }

  loadNavBarForms() {
    this.configService.HTTPPostAPI("", "modules/loadNavBarForms").subscribe(jsonResp => {
      this.navForms = jsonResp;
    });
  }

  loadNavBarTemplates() {
    this.configService.HTTPPostAPI("", "modules/loadNavBarTemplates").subscribe(jsonResp => {
      this.navTemplates = jsonResp;
    });
  }

  loadNavBarForDocuments() {
    this.configService.HTTPPostAPI("", "modules/loadNavBarForDocuments").subscribe(response => {
      this.navDocuments = response;
    });
  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    if (localStorage.length > 0 && localStorage.getItem('token')) {
      this.loadCurrentUserDetails().then(() => {
        if (this.currentUser.adminFlag != "A" && this.currentUser.defaultProjectId && this.currentUser.disableModel === "N") {
          if (!localStorage.getItem('pop_up_shown')) {
            this.showProjectModal();
            this.showProjectSelectionModel = true;
            localStorage.setItem('pop_up_shown', this.configService.helper.encode("Y"))
          }
        }
      });
      if (document.location.pathname !== "/login") {
        this.loadnavBar();
      }
      this.loadOrgDateFormat();
      if (null != localStorage.getItem("token")) {
        this.loadNotification();
      }

      this.router.events.subscribe((ev) => {
        if (ev instanceof NavigationEnd) {
          if (null != localStorage.getItem("token"))
            this.loadNotification()
          this.removeDraftOfProjectSetUp()
        }
      });
      this.loadLocation();
      this.loadUserModules();
    } else {
      this.router.navigate(["/login"]);
    }
    this.configService.checkIndividualModulePermission(226).subscribe(resp => {
      this.isViewOrgProfile = resp;
    });
    this.configService.checkIndividualModulePermission(101).subscribe(resp => {
      this.isViewDashboard = resp;
    });
    this.configService.checkIndividualModulePermission(181).subscribe(resp => {
      this.isViewDocumentApproval= resp;
    });
    this.configService.loadPermissionsBasedOnModule("100").subscribe(resp => {
      this.projectPermission = resp
    });
    this.projectsetupService.canCreateProject().subscribe(res => {
      this.projectCountFlag = res;
    });
  }

  ngAfterViewInit() {
  }

  loadCurrentUserDetails(): Promise<any> {
    return new Promise<any>(resolve => {
      this.configService.loadCurrentUserDetails().subscribe(jsonResp => {
        this.currentUser = jsonResp;
        if (this.config.helper.APPLICATION_ADMIN == this.currentUser.adminFlag)
          this.isApplicationAdmin = true;
        this.userName = this.currentUser.username;
        this.roleName = this.currentUser.roleName;
        this.model = new User();
        this.modal = new CommonModel();
        this.model.userName = this.currentUser.username.toLocaleUpperCase();
        this.modal.globalProjectName = this.currentUser.projectName;
        this.modal.globalProjectId = this.currentUser.projectId;
        this.modal.projectVersionName = this.currentUser.versionName;
        this.location = this.currentUser.currentProjectLocationId;
        this.projectStatus = this.currentUser.projectStatus === "published";
        resolve(jsonResp);
      });
    });
  }

  loadOrgDateFormat() {
    this.spinnerFlag = true;
    this.servie.getOrgDateFormat().subscribe(result => {
      if (!this.config.helper.isEmpty(result)) {
        this.timeZone = result.timeZoneId;
      }
      this.spinnerFlag = false;
    });
  }

  logOut() {
    this.authenticationService.logOut(this.model).subscribe(jsonResp => { });
    this.config.helper.clearLocalStorage();
    this.router.navigate(["/login"]);
  }

  showProjectModal() {
    this.showProjectSelectionModel = false;
    this.loadLocation();
    this.loadProjects();
    if (this.modalSmallProjectGlobal) {
      this.modalSmallProjectGlobal.show();
    }
  }

  onChange(projectId: any, locationId: any, dontRedirect?: boolean): Promise<void> {
    this.spinnerFlag = true;
    return new Promise<void>(resolve => {
      this.configService.saveCurrentProject({ "projectId": projectId, "locationId": locationId }).subscribe(response => {
        this.spinnerFlag = false;
        let list = this.titleList.filter(p => p.id == projectId);
        if (list.length != 0) {
          this.modal.globalProjectName = list[0].itemName;
          this.modal.globalProjectId = list[0].id;
        } else {
          this.modal.globalProjectName = 'No Active Project Available';
          this.modal.globalProjectId = 0
        }
        this.loadCurrentUserDetails();
        this.loadUserModules();
        this.loadnavBar();
        let dropDown: dropDownDto = new dropDownDto()
        dropDown.key = "" + this.modal.globalProjectId;
        dropDown.value = this.modal.globalProjectName;
        this.source.next(dropDown);
        if (!dontRedirect) {
            this.router.navigateByUrl('/dashboard', {skipLocationChange: false}).then(() =>
            this.router.navigate(['/MainMenu']));
        }
        resolve();
      }, err => resolve());
    })
  }

  loadNotification() {
    if (localStorage.getItem('token')) {
      this.loadnotification("", "usernotification/loadnotification")
        .catch((e: any) => Observable.throw(this.handleError(e))).subscribe(response => {
          this.notificationList = response;
          this.cdr.markForCheck();
        }, err => {
          this.cdr.markForCheck();
        })
    } else {
      this.router.navigate(["/login"]);
    }
  }

  handleError(error): any {
    if (error && error.status == 401 && error.error == "Unauthorized") {
      localStorage.clear()
      this.router.navigate(['/login']);
    }
    return new Map<string, any>();
  }

  viewedFlagForsinglenotification(item, list: any[], index?) {
    const data: any[] = new Array<any>();
    data.push(item);
    this.loadnotification(data, 'usernotification/checkedNotification').subscribe(response => {
      if (!list) {
        this.loadNotification();
        this.cdr.markForCheck();
      } else {
        list.splice(index, 1);
        if (list.length == 0)
          this.loadNotification();
      }
    });
  }

  loadnotification(data?, url?) {
    return this.http.post(this.config.helper.common_URL + url, data, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  notification(url?) {
    return this.http.post(this.config.helper.common_URL + url, this.config.getRequestOptionArgs())
      .map((resp) => resp.json())
      .catch(res => {
        return Observable.throw(res.json());
      });
  }

  onChangeStatus() {
    this.projectStatus = !this.projectStatus;
    this.loadProjects();
  }

  loadProjects() {
    return new Promise<any>(resolve => {
      this.titleList = [];
      let ele: any = document.getElementById('defaultCheckBoxId');
      if (ele) {
        ele.value = false;
        ele.checked = false;
      }
      if (this.location && ('' + this.location)) {
        this.configService.loadprojectOfUserAndCreatorForLocation(this.location, this.projectStatus).subscribe(response => {
          this.titleList = response.projectList.map(option => ({ id: option.id, itemName: option.projectName }));
          let project = this.titleList.filter(p => p.id === this.modal.globalProjectId);
          if (project && project.length > 0) {
            this.globalProjectId = project[0].id;
          }
          if (this.modal.globalProjectId == this.currentUser.defaultProjectId && (+this.location == this.currentUser.defaultProjectLocationId)) {
            if (ele) {
              ele.value = true;
              ele.checked = true;
            }
          } else {
            if (ele) {
              ele.value = false;
              ele.checked = false;
            }
          }
          if (this.titleList.filter(f => this.modal.globalProjectId === f.id).length != 0) {
            this.configService.saveCurrentProject({ "projectId": this.modal.globalProjectId, "locationId": this.location }).subscribe(response => {
              this.loadCurrentUserDetails();
              let dropDown: dropDownDto = new dropDownDto()
              dropDown.key = "" + this.modal.globalProjectId;
              dropDown.value = this.modal.globalProjectName;
              this.source.next(dropDown);
            });
          }
          resolve('');
        });
      }
    })
  }

  loadLocation() {
    this.locationService.loadAllActiveLocations().subscribe(response => {
      this.locationsList = response.result;
    });
  }

  update(values: dropDownDto) {
    this.source.next(values);
  }

  redirectEBMR(url) {
    this.router.navigate([url]);
  }

  redirect(url, status?) {
    var queryParams = {};
    if (status) {
      queryParams["status"] = status;
    }
    if (url.includes("dynamicForm")) {
      let finalURLList = url.split("?");
      queryParams["exists"] = finalURLList[1];
      queryParams["id"] = finalURLList[0].split("/")[1];
      queryParams["isMapping"] = finalURLList[2];
      if (finalURLList[3]) {
        queryParams["documentCode"] = finalURLList[3];
      }
      this.router.navigate([finalURLList[0]], { queryParams: queryParams, skipLocationChange: true });
    } else if (url.includes("newDynamicTemplate")) {
      let finalURLList = url.split("?");
      let valueList = finalURLList[1].split("&");
      queryParams["exists"] = valueList[1];
      queryParams["id"] = valueList[0];
      this.router.navigate([finalURLList[0]], { queryParams: queryParams, skipLocationChange: true });
    } else {
      this.router.navigateByUrl(url);
    }
  }

  taskURLNavigation(row: any) {
    let queryParam = {
      draft: String(row.draft),
      taskId: row.id,
      type: row.documentConstant
    }
    let url = row.url;
    if (row.documentId.length > 0 && row.documentId[0] == this.config.helper.VENDOR_VALIDATION_VALUE) {
      url = "/documentapprovalstatus";
    }
    else {
      if (!url || url.includes('null')) {
        url = "/documentapprovalstatus";
      }
    }
    if (url == "/documentapprovalstatus" && row.documentId.length > 0) {
      queryParam['documentId'] = row.documentId[0];
      queryParam['documentName'] = row.documentType;
    }
    let json = { task: this.config.helper.encode(JSON.stringify(queryParam)) }
    this.router.navigate([url], { queryParams: json })
  }

  onClickHelp() {
    if (!this.config.helper.isEmpty(this.selectedModule)) {
      this.knowledgeBaseService.callAPI("knowledgebase/loadModuleContent", this.selectedModule).subscribe((resp) => {
        if (!this.config.helper.isEmpty(resp.data)) {
          this.showModal = true;
          this.knowledgeBaseContent = resp.data;
          this.content = this.knowledgeBaseContent.content;
          this.receivedId = this.knowledgeBaseContent.id;
          this.fileupload.loadFileListForEdit(this.receivedId, this.config.helper.KNOWLEDGEBASE).then((result) => {
            this.spinnerFlag = false;
          }).catch((err) => {
            this.spinnerFlag = false;
          })
        } else {
          this.modalLarge.hide();
          this.showModal = false;
          this.router.navigate(['/knowledgeBase/view-knowledgeBase']);
        }
      });
    } else {
      this.modalLarge.hide();
      this.showModal = false;
      this.router.navigate(['/knowledgeBase/view-knowledgeBase']);
    }
  }

  setUpModuleForHelpContent(moduleId: any) {
    this.selectedModule = moduleId;
  }

  routeToUrl(row) {
    if (row.projectId != null) {
      this.onChange(row.projectId, row.locationId).then(() => {
        this.notificationrouteToUrl(row)
      })
    } else {
      this.notificationrouteToUrl(row)
    }
  }

  notificationrouteToUrl(row) {
    if (row.category == this.config.helper.PERMISSION_CATEGORY_FORM || row.category == 'Form_Group' || row.category == this.config.helper.PERMISSION_CATEGORY_TEMPLATE) {
      if (row.url) {
        this.redirect(row.url, location.pathname);
      }
      this.viewedFlagForsinglenotification(row, undefined);
    }
    else {
      this.router.navigate([row.url], { queryParams: { id: row.documentId, status: '/documentapprovalstatus', exists: true, list: row.selectedDocuments } });
    }
  }

  getMapSize(data) {
    var len = 0;
    for (var count in data) {
      len++;
    }
    return len;
  }

  removeDraftOfProjectSetUp() {
    localStorage.removeItem(this.config.helper.PERMISSION_CATEGORY_DOCUMENT);
    localStorage.removeItem(this.config.helper.PERMISSION_CATEGORY_FORM);
    localStorage.removeItem(this.config.helper.PERMISSION_CATEGORY_TEMPLATE);
    localStorage.removeItem(this.config.helper.PERMISSION_CATEGORY_FORM_GROUP);
  }

  openModalForScreenrecording(modelData, dfId, url, queryParams, dfFlag) {
    this.mainElementDisplay = false;
    this.showSuccessMsg = false;
    this.openVideoRecording(modelData, dfId, url, queryParams, dfFlag);
  }

  openVideoRecording(row, dfId, url, queryParams, dfFlag) {
    let iqId, documentName;
    let dpfId = dfId;
    if (dfFlag) {
      iqId = null;
      if (dfId == 0)
        dpfId = null;
      documentName = "discrepancy_form";
    } else {
      iqId = row.id;
      documentName = row.testCaseCode;
    }
    if (!queryParams)
      queryParams = null;

    let json = {
      rowData: row,
      iqId: iqId,
      dfId: dpfId,
      queryParams: queryParams,
      documentName: documentName,
      documentType: this.documentType,
      url: url
    }
    localStorage.setItem('row_video', this.config.helper.encode(JSON.stringify(json)));
    const s = this.renderer2.createElement('script');
    s.type = 'text/javascript';
    s.src = '../../../assets/js/recorder.js';
    s.text = ``;
    this.renderer2.appendChild(this._document.body, s);
    var modalTag = document.getElementById('videoBody');
    modalTag.style.height = window.innerHeight - 200 + "px";
    this.modalSmall.show();
  }

  scrollToViewVideo() {
    this.modalSmall.show();
    this.mainElementDisplay = true;
    this.showSuccessMsg = false;
    var iframeTag = document.getElementById("video_iframe");
    iframeTag.setAttribute('src', window.URL.createObjectURL(fileTOTypeScript));
    iframeTag.setAttribute("style", "display:inline-block");
  }

  uploadFile() {
    let json;
    if (localStorage.getItem('row_video')) {
      json = JSON.parse(this.config.helper.decode(localStorage.getItem('row_video')));
    }
    localStorage.setItem('row_video', this.config.helper.encode(JSON.stringify(json)));
    if (json.iqId === null && json.dfId === null) {
      json.documentType = this.config.helper.DISCREPANCY_VALUE;
    }
    if (json.dfId) {
      json.documentType = this.config.helper.DISCREPANCY_VALUE;
    }
    this.videoSpinnerFlag = true;
    this.modalSmall.spinnerShow();
    this.videoFile = fileTOTypeScript;
    if (localStorage.getItem('rowData'))
      localStorage.removeItem('rowData');
    this.service.saveRecordedVideo(this.videoFile, json.documentName, json.iqId, json.dfId, json.documentType).subscribe(jsonResp => {
      let rowData = json.rowData;
      if (jsonResp.result === "success") {
        this.showSuccessMsg = true;
        this.videoSpinnerFlag = false;
        this.modalSmall.spinnerHide()
        this.closeView();
        if (json.queryParams != null) {
          if (json.iqId != null)
            this.router.navigate([json.url + "/" + json.queryParams]);
          else
            this.router.navigate([json.url], { queryParams: { id: json.queryParams, rowData: JSON.stringify(rowData) }, skipLocationChange: true, replaceUrl: true });
        } else {
          if (json.iqId != null)
            this.router.navigate([json.url], { queryParams: {}, skipLocationChange: true, replaceUrl: true });
          else
            this.router.navigate([json.url], { queryParams: { rowData: JSON.stringify(rowData), fileId: jsonResp.fileDto.id }, skipLocationChange: true, replaceUrl: true });
        }
        setTimeout(() => {
          this.loadnavBar();
        }, 1500)
      }
    }, err => {
      this.modalSmall.spinnerHide();
      swal({
        title: 'Error', type: 'error', timer: this.configService.helper.swalTimer,
        text: ' Error in uploading the file, Please contact admin...!'
      });
    });
  }

  closeView() {
    this.modalSmall.hide();
    var iframe = document.getElementById('video_iframe');
    if (iframe) {
      iframe.setAttribute('src', '');
      iframe.setAttribute("style", "display:none");
    }
    this.videoFile = null;
    this.mainElementDisplay = false;
    this.showSuccessMsg = false;

  }

  /*Start Global File View From Any Module Methods*/
  /**
   * @param fileName => file name of the file
   * @param sFTPFilePath => file path of the SFTP
   * @param viewOrDownloadFlag => only viewing =true || download the file = false
   * @param headerName => in preview of modal ,the header name 
   */
  downloadOrViewFile(fileName: string, sFTPFilePath: string, viewOrDownloadFlag: boolean, headerName?: string): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      if (this.viewFile) {
        this.viewFile.downloadFileOrView(fileName, sFTPFilePath, viewOrDownloadFlag, headerName).then(resp => {
          resolve(resp);
        })
      }
    })
  }

  /**
   * @param fileName => file name of the file
   * @param blobResponse => blob response
   * @param viewOrDownloadFlag => only viewing =true || download the file = false
   * @param headerName => in preview of modal ,the header name 
   */
  previewByBlob(fileName: string, blobResponse: any, viewOrDownloadFlag: boolean, headerName?: string) {
    if (this.viewFile)
      this.viewFile.previewByBlob(fileName, blobResponse, viewOrDownloadFlag, headerName);
  }

  /**
   * @param fileName => file name of the file
   * @param base64 => base64 response
   * @param viewOrDownloadFlag => only viewing =true || download the file = false
   * @param headerName => in preview of modal ,the header name 
   */
  previewOrDownloadByBase64(fileName: string, base64: any, viewOrDownloadFlag: boolean, headerName?: string) {
    if (this.viewFile)
      this.viewFile.previewOrDownloadByBase64(fileName, base64, viewOrDownloadFlag, headerName);
  }

  loadTaskDetails(dueDate?, title?) {
    this.modalTaskGlobal.show();
    this.modalTaskCreation.loadEquipment();
    this.modalTaskCreation.onClickCreate();
    this.modalTaskCreation.setTaskGobalValues(this.taskDocType, this.taskDocTypeUniqueId, this.taskEquipmentId, dueDate, title);
  }

  checkTheTaskData() {
    if (this.taskDocType != undefined && this.taskDocType != '') {
      this.taskEnbleFlag = true;
    } else {
      this.taskEnbleFlag = false;
    }
  }

  onClickSave() {
    this.modalTaskCreation.onClickSave();
  }

  onCloseOfTask(id) {
    this.modalTaskGlobal.hide();
  }

  closeMyModal(event) {
    if (document.querySelector('#' + event))
      document.querySelector('#' + event).classList.remove('md-show');
  }

  enableShowMe() {
    this.showMeFlag = !this.showMeFlag;
    if (this.showMeFlag)
      this.configService.disablePopUpModel().subscribe(jsonResp => {
        if (jsonResp.result) {
          this.loadCurrentUserDetails();
          this.modalSmallProjectGlobal.hide();
        }
      });
  }

  saveDefaultProject(projectId) {
    this.spinnerFlag=true;
    if (projectId && projectId != this.globalProjectId) {
      this.globalProjectId = projectId;
      let location = this.location;
      this.configService.saveDefaultProjectForUser({ "projectId": this.globalProjectId, "locationId": this.location }).subscribe(rep => {
        if (rep.result === 'success') {
          this.loadCurrentUserDetails().then(resp => {
            this.location = location;
            this.onChange(this.globalProjectId, this.location).then(resp => {
              this.spinnerFlag=false;
              this.modalSmallProjectGlobal.hide();
            });
          });
        }
      });
    }
  }

  onRedirectFromReference(data: any) {
    localStorage.removeItem("redirectReference");
    // if ("114" === data.value) {
    //   this.router.navigate([data.url], { queryParams: { id: btoa(data.globalProjectId), tab: btoa("gxp"), external: btoa("true") } });
    // } else {
      this.spinnerFlag = true;
      this.loadProjects();
      this.configService.saveCurrentProject({ "projectId": data.globalProjectId, "locationId": data.globalLocationId }).subscribe(response => {
        this.spinnerFlag = false;
        let list = this.titleList.filter(p => p.id == data.globalProjectId);
        if (list.length != 0) {
          this.modal.globalProjectName = list[0].itemName;
          this.modal.globalProjectId = list[0].id;
        } else {
          this.modal.globalProjectName = 'No Active Project Available';
          this.modal.globalProjectId = 0
        }
        this.loadCurrentUserDetails();
        let dropDown: dropDownDto = new dropDownDto()
        dropDown.key = "" + this.modal.globalProjectId;
        dropDown.value = this.modal.globalProjectName;
        this.source.next(dropDown);
        if (data.url && data.documentPrimaryKey) {
          if (data.flag)
            this.router.navigate([data.url], { queryParams: { testRunId: data.documentPrimaryKey } });
          else
            this.router.navigate([data.url], { queryParams: { id: data.documentPrimaryKey } });
        } else {
          if (data.url) {
            this.router.navigate([data.url]);
          } else {
            if (data.value === "212" || data.value === "213" || data.value === "214" || data.value === "215" || data.value === "216") {
              this.router.navigate(["documentapprovalstatus"], { queryParams: { documentType: data.value, documentId: data.documentPrimaryKey } });
            } else {
              this.router.navigate(["documentapprovalstatus"], { queryParams: { documentType: data.value } });
            }
          }
        }
      });
    //}
  }

  onClickCreateProject() {
    this.projectName = "";
    this.createProjectModal.show();
  }

  onClickSaveProject() {
    this.createprojectSpinnerFlag = true;
    if (this.validationMessage === "" && this.projectName != "") {
      this.configService.HTTPPostAPI(this.projectName, "projectsetup/createProject/" + this.gxpFormFlag).subscribe(res => {
        this.createprojectSpinnerFlag = false;
        this.createProjectModal.hide();
        this.configService.saveCurrentProject({ "projectId": res.data.id, "locationId": res.data.selectedLocations[0].id }).subscribe(response => {
          this.loadCurrentUserDetails().then(rr => {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(["requirementSummary"]);
            });
          })
        });
      });
    }
  }
  showNext = (() => {
    return () => {
      setTimeout(() => {
        this.validationMessage = "";
        if (this.projectName != '') {
          this.config.HTTPPostAPI(this.projectName, "projectsetup/isExistsProjectName").subscribe(
            jsonResp => {
              let responseMsg: boolean = jsonResp;
              if (responseMsg == true) {
                this.validationMessage = "Project with this name already exist.";
              } else {
                this.validationMessage = "";
              }
            }
          );
        }
      }, 200);
    }
  })();

  loadUserModules(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.configService.HTTPGetAPI('home/loadSearchModuleList').subscribe(jsonResp => {
        if (jsonResp.result === 'success') {
          this.userModules = jsonResp.moduleList;
          this.list = this.userModules.map(m => m.moduleName);
          resolve(true);
        }
      }, err => {
        resolve(false);
      })
    })
  }

  onKeyPress(event) {
    switch (event.key) {
      case 'Escape':
        this.selectedIndex = -1;
        this.selectItem(this.selectedIndex);
        break;
      case 'Enter':
        this.selectedIndex = this.selectedIndex < 0 ? 0 : this.selectedIndex;
        this.selectItem(this.selectedIndex);
        break;
      case 'ArrowDown':
        this.selectedIndex = (this.selectedIndex + 1) % this.filteredList.length;
        document.getElementById('search-item').scrollIntoView(true);
        break;
      case 'ArrowUp':
        if (this.selectedIndex <= 0) {
          this.selectedIndex = this.filteredList.length;
        }
        this.selectedIndex = (this.selectedIndex - 1) % this.filteredList.length;
        document.getElementById('search-item').scrollIntoView(false);
        break;
      default:
        break;
    }
  }

  getFilteredList() {
    if (!this.configService.helper.isEmpty(this.searchText)) {
      this.filteredList = this.list.filter(f => f.toLowerCase().startsWith(this.searchText.toLowerCase()));
    } else {
      this.filteredList = this.validationProjectModuleList;
    }
  }

  moduleSearch() {
    if (!this.configService.helper.isEmpty(this.searchText)) {
      const module = this.userModules.filter(f => f.moduleName.toLowerCase() === this.searchText.toLowerCase());
      if (module && module[0].url) {
        if (module[0].moduleName === 'GxP Assessment') {
          this.router.navigate(["Project-setup/add-projectsetup"], { queryParams: { id: btoa(this.currentUser.projectId), tab: btoa('gxp') } });
        }else if (module[0].moduleName === 'Document Workflow') {
          this.router.navigate(["Project-setup/add-projectsetup"], { queryParams: { id: btoa(this.currentUser.projectId), tab: btoa('workflow') } });
        } else if (module[0].moduleName === 'Test Execution Reports') {
          this.router.navigate(["dashboard"], { queryParams: { tabId: 'graphView', url: window.location.pathname } });
        }else if (module[0].moduleName === 'Workflow Levels') {
          this.router.navigate([module[0].url], { queryParams: { tabId: 'tab2'} });
        }else {
          this.redirect(module[0].url);
        }
        this.searchText = "";
        this.filteredList = [];
      }
    } else {
      this.filteredList = this.validationProjectModuleList;
    }
  }

  openSearchDropdown(event) {
    this.getFilteredList();
    var container = $(event.currentTarget).parent();
    if (container && container[0].className === "dropdown-container") {
      container.toggleClass('expanded " "');
    }
  }

  selectItem(ind) {
    this.selectedIndex = ind;
    this.searchText = this.filteredList[this.selectedIndex];
    this.moduleSearch();
  }

}
