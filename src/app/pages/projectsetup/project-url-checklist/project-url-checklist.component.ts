import { ConfigService } from './../../../shared/config.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AdminComponent } from '../../../layout/admin/admin.component';

@Component({
  selector: 'app-project-url-checklist',
  templateUrl: './project-url-checklist.component.html',
  styleUrls: ['./project-url-checklist.component.css']
})
export class ProjectUrlChecklistComponent implements OnInit {
  @Input('view') view: string;
  @Input('projectId') projectId;
  @Input('checkList') public checkList: any[];
  @Output('onSuccess') onSuccess: EventEmitter<any> = new EventEmitter<any>();
  viewFlag = false;
  addFlag = false;
  singleAddFlag = false;
  checkListView: any[] = new Array();
  orgFormList: any[] = new Array();
  validForm = true;
  submittedCheckList = false;

  public documentSettings = {
    singleSelection: true,
    text: "Select Form",
    enableSearchFilter: true,
    classes: "myclass custom-class",
  };

  public formDataSettings = {
    singleSelection: true,
    text: "Select Form Data",
    enableSearchFilter: true,
    classes: "myclass custom-class",
  };
  spinnerFlag: boolean = false;
  titleValidateFlag: boolean = false;
  urlValidateFlag: boolean = false;
  formValidateFlag: boolean = false;
  constructor(private configService: ConfigService, private adminComponent: AdminComponent) { }

  ngOnInit(): void {
    this.typeOfView(this.view);
  }

  loadOrganizationForm() {
    this.configService.HTTPPostAPI("", "common/loadOrganizationForm").subscribe(resp => {
      this.orgFormList = resp;
    });
  }
  typeOfView(viewType) {
    this.viewFlag = false;
    this.addFlag = false;
    this.singleAddFlag = false;
    switch (viewType) {
      case 'project-summary':
        this.checkList = new Array();
        this.singleAddFlag = true;
        this.viewFlag = true;
        this.loadOrganizationForm();
        break;
      case 'project-setup-add':
        this.addFlag = true;
        this.loadOrganizationForm();
        break;

      case 'project-setup-view':
        this.checkList = new Array();
        this.loadProjectReferenceData(this.projectId);
        this.viewFlag = true;
        break;
    }
  }

  loadProjectReferenceData(projectId): Promise<boolean>{
    this.adminComponent.spinnerFlag = true;
    return new Promise<boolean>(resolve => {
    this.configService.HTTPPostAPI(projectId, 'projectsetup/loadProjectUrlData').subscribe(resp => {
      this.checkListView = resp.urlList;
      this.adminComponent.spinnerFlag = false;
      if(resp.urlList.length > 0)
        resolve(true);
      else
        resolve(false);
    }, err=>{
      resolve(false);
    });
  });
  }

  loadOrgFormData(dto) {
    this.adminComponent.spinnerFlag = true;
    dto.formList = new Array();
    dto.formId = new Array();
    if (dto.documentType.length > 0) {
      this.configService.HTTPPostAPI(dto.documentType[0].id, "dynamicForm/loadOrganizationFormData").subscribe(resp => {
        dto.formList = resp;
        this.adminComponent.spinnerFlag = false;
      }, err => this.adminComponent.spinnerFlag = false);
    } else {
      this.adminComponent.spinnerFlag = false;
    }
  }

  onChangeOfCategory(dto) {
    dto.formFlag = !dto.formFlag;
    if (dto.formFlag) {
      dto.title = "";
      dto.url = "";
    } else {
      dto.documentType = new Array();
      dto.formId = new Array();
      dto.formList = new Array();
    }
  }

  addUrlCheckList(list: any[]) {
    this.submittedCheckList = false;
    let json = {
      formFlag: false,
      title: '',
      url: '',
      documentType: new Array(),
      formId: new Array(),
      formList: new Array()
    }
    if (this.validateList(list)) {
      if (this.addFlag) {
        list.push(json);
      } else {
        this.checkList = new Array();
        this.checkList.push(json);
      }
    }
  }

  delete(list: any[], index: number) {
    list.splice(index, 1);
    this.validateList(list);
  }

  validateList(list: any[]): boolean {
   this.reset();
    if (list) {
      for (let index = 0; index < list.length; index++) {
        let dto = list[index];
        if (!dto.formFlag) {
          if (!dto.title || !dto.url) {
            this.validForm = false;
            return;
          }
        } else {
          if (dto.documentType.length == 0 || dto.formId.length == 0) {
            this.validForm = false;
           return;
          }
        }
      }
      // this.validForm = !this.checkurlName(list);
      // this.validForm = !this.checkurlPath(list);
      // this.validForm = !this.checkForm(list);
    }
    return this.validForm;
  }

  // checkurlName(list):boolean {
  //   if(this.validForm && list.length >1){
  //     let listdata = list.filter(f => !f.formFlag);
  //     let valueArr = listdata.map(function (item) {  return String(item.title) });
  //     this.titleValidateFlag = valueArr.some(function (item, idx) {
  //       return valueArr.indexOf(item) != idx
  //     });
  //   }
  //   return this.titleValidateFlag;
  // }

  // checkurlPath(list):boolean {
  //   if(this.validForm && list.length >1){
  //     let listdata = list.filter(f => !f.formFlag);
  //     let urlArr = listdata.map(function (item) {  return String(item.url) });
  //     this.urlValidateFlag = urlArr.some(function (item, idx) {
  //       return urlArr.indexOf(item) != idx
  //     });
  //   }
  //   return this.urlValidateFlag;
  // }

  // checkForm(list):boolean{
  //   if(this.validForm && list.length >1){
  //     let listdata = list.filter(f => f.formFlag);
  //     let urlArr = listdata.map(function (item) {  return String(item.formId[0].id) });
  //     this.formValidateFlag = urlArr.some(function (item, idx) {
  //       return urlArr.indexOf(item) != idx
  //     });
  //   }
  //   return  this.formValidateFlag;
  // }


  navigate(url, fullURL) {
    if (fullURL) {
      if (this.configService.helper.isValidUrl(url)) {
        window.open(url, '_blank');
      } else {
        window.open('http://' + url, '_blank');
      }

    } else {
      this.adminComponent.redirect(url, document.location.pathname);
    }
  }

  saveCheckList(checkList: any[]) {
    if (this.validateList(checkList)) {
      this.onSuccess.emit(checkList);
    }
  }

  checkURLName = ((testRunName,list) => {
    if (testRunName != '') {
      this.validateURL(testRunName, 'projectsetup/isURLTitlePresent').then(resp => {
        this.titleValidateFlag = resp;
      });
    } 
  })

  checkURLPathName = ((testRunName,list) => {
    if (testRunName != '') {
      this.validateURL(testRunName, 'projectsetup/isURLPathPresent').then(resp => {
        this.urlValidateFlag = resp;
      });
    } 
  })

  validateURL(type: string, url: string,formId?): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      let json = { 'projectID': this.projectId, 'title': type ,'formId':formId};
      this.configService.HTTPPostAPI(json, url).subscribe(resp => {
        resolve(resp);
      }, e => resolve(false));
    })
  }

  checkDupliateForm(dto,list){
    if (dto.documentType.length > 0) {
      this.validateURL(dto.documentType[0].id, 'projectsetup/isformPresentForChecklist',dto.formId[0].id).then(resp => {
        this.formValidateFlag = resp;
      });
    } 
  }

  reset(){
    this.titleValidateFlag=this.urlValidateFlag=this.formValidateFlag= false;
    this.validForm=true;
  }

}
