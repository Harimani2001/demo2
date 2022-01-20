import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IOption } from 'ng-select';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { Condition, EmailRule, templateBuilder, UserPrincipalDTO } from '../../models/model';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { TemplateBuiderService } from '../templatebuilder/templatebuilder.service';
import { EmailRuleService } from './email-rule.service';

@Component({
  selector: 'app-email-rule',
  templateUrl: './email-rule.component.html',
  styleUrls: ['./email-rule.component.css', '../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmailRuleComponent implements OnInit {
  templateEmptyFlag = true;
  i: number;
  templateId: any;
  templateViewData: any = "";
  @ViewChild('modal') preViewModal: any;
  viewIndividualData: boolean = false;
  popupdata: any = [];
  isTable = true;
  spinnerFlag = false;
  submitted = false;
  public templateModalArray: templateBuilder[] = new Array();
  projectList: any[] = new Array();
  documentList: any[] = new Array();
  model: any = new EmailRule();
  public permissionModal: Permissions = new Permissions("174", false);
  list: any;
  rootUser: boolean = false;
  userList: Array<IOption> = new Array<IOption>();
  ruleNameValidation: string = '';
  actionTypeList: any[];
  frequencyList: any[];
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  currentRuleName: any;
  dropdownSettings = {
    singleSelection: true,
    text: "Select Project",
    enableSearchFilter: true,
    classes: "myclass custom-class",
  };
  globalProjectId = [];
  public filterQuery = '';
  @ViewChild('myTable') table: any;
  constructor(private adminComponent: AdminComponent, private tempService: TemplateBuiderService,
    public permissionService: ConfigService, public helper: Helper,
    private projectService: projectsetupService, private service: EmailRuleService,
    private lookUpService: LookUpService) {
    this.permissionService.loadCurrentUserDetails().subscribe(response => {
      this.currentUser = response;
      if (this.helper.APPLICATION_ADMIN === this.currentUser.adminFlag) {
        this.rootUser = true;
        this.permissionForRootUser();
      } else {
        this.permissionService.loadPermissionsBasedOnModule("174").subscribe(resp => {
          this.permissionModal = resp
        });
      }
    })
    this.lookUpService.getlookUpItemsBasedOnCategory("frequency").subscribe(res => {
      this.frequencyList = res.response;
    });
    this.lookUpService.getlookUpItemsBasedOnCategory("actionType").subscribe(res => {
      this.actionTypeList = new Array();
      res.response.forEach(option => {
        this.actionTypeList.push({ "key": option.key, "value": option.value, "disabled": false })
      });
    });
    this.adminComponent.setUpModuleForHelpContent("174");
  }

  ngOnInit() {
    this.spinnerFlag = true;
    this.permissionService.loadProject().subscribe(response => {
      this.projectList = response.projectList.map(option => ({ id: option.id, itemName: option.projectName }));
    });
    this.loadTemplateList();
    this.loadAll();
    this.spinnerFlag = false;
  }

  loadAll() {
    this.spinnerFlag = true;
    this.isTable = true;
    this.service.getAllEmailRules().subscribe(resp => {
      this.list = resp.data;
      this.spinnerFlag = false;
    })
  }

  resetData() {
    this.model.conditionList = [];
  }

  viewForEdit(modal) {
    this.viewIndividualData = false;
    this.ruleNameValidation = '';
    this.isTable = false;
    this.model = modal;
    this.currentRuleName = this.model.ruleName;
    if (this.model.projectId != 0) {
      this.globalProjectId = this.projectList.filter(p => p.id == this.model.projectId);
      this.loadAllDocumentForProject(this.model.projectId);
    }
  }

  createCopy(modal) {
    this.model = modal;
    this.model.id = 0;
    this.permissionService.getCurrentDate().subscribe(Response => {
      this.model.ruleName = this.model.ruleName + "-" + Response;
      this.saveRule(true);
    })
  }

  viewRowDetails(row) {
    let data = row;
    data.conditionList.forEach(element => {
      element.frequencyText = "";
      element.actionTypeText = "";
      var frequencyValue = this.frequencyList.filter(frequency => frequency.key == element.frequency);
      if (frequencyValue)
        element.frequencyText = frequencyValue[0].value;
      var actionTypeValue = this.actionTypeList.filter(action => action.key == element.actionType);
      if (actionTypeValue)
        element.actionTypeText = actionTypeValue[0].value;
    });
    this.popupdata = [];
    this.viewIndividualData = true;
    this.isTable = false;
    this.popupdata.push(data);
  }

  showNext = (() => {
    var timer: any = 2;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (this.currentRuleName != this.model.ruleName) {
          if (!this.helper.isEmpty(this.model.ruleName) && !this.helper.isEmpty(this.model.ruleName)) {
            this.service.isExistsRuleForOrg(this.model.ruleName).subscribe(resp => {
              if (resp)
                this.ruleNameValidation = 'Rule already exists...!'
              else
                this.ruleNameValidation = '';
            });
          }
        } else
          this.ruleNameValidation = '';
      }, 600);
    }
  })();

  addRule() {
    this.isTable = false;
    this.ruleNameValidation = '';
    this.model = new EmailRule();
    this.globalProjectId = [];
    this.model.conditionList.push(new Condition("", [], ""));
  }

  addCondition(list, flagToAdd) {
    var actionSelected: string[] = list.map(option => option.actionType);
    this.actionTypeList.forEach(element => {
      if (actionSelected.includes(element.key))
        element.disabled = true;
      else
        element.disabled = false;
    })
    if (flagToAdd)
      list.push(new Condition("", [], ""));
  }

  removeCondition(list, index) {
    list.splice(index, 1);
    this.addCondition(list, false);
  }

  addTemplate(condition, index) {
    this.i = index;
    this.templateId = condition.templateId;
    this.templateViewData = "";
    this.preViewModal.show();
  }

  setTemplateValue(value, index) {
    this.templateViewData = "";
    this.model.conditionList[index].templateName = "";
    this.model.conditionList[index].templateId = value;
    this.templateModalArray.forEach(ele => {
      if (ele.id == value) {
        this.model.conditionList[index].templateName = ele.templateName;
        this.templateViewData = ele.templateContent;
      }
    });
  }

  loadDataForProject(ids) {
    let projectId = ids[0].id;
    this.loadAllDocumentForProject(projectId)
  }

  loadAllDocumentForProject(projectId) {
    this.spinnerFlag = true;
    this.documentList = [];
    this.permissionService.loadDocBasedOnProject(projectId).subscribe(resp => {
      this.documentList = resp.filter(d => d.key != '137');
      this.spinnerFlag = false;
    }, error => {
      this.spinnerFlag = false;
    });
    this.projectService.loadUsersByProject(projectId).subscribe(resp => {
      this.userList = resp.list.map(option => ({ value: option.id, label: option.userName }));
      this.spinnerFlag = false;
    });
  }

  saveRule(validForm) {
    this.submitted = true;
    if (validForm && this.model.conditionList && this.model.conditionList.length > 0) {
      this.spinnerFlag = true;
      this.templateEmptyFlag = true;
      this.model.projectId = this.globalProjectId[0].id;
      this.model.conditionList.forEach(element => {
        if (element.templateId == 0) {
          this.templateEmptyFlag = false;
          return
        }
      });
      if (this.ruleNameValidation == '' && this.templateEmptyFlag) {
        this.model.orgId = this.currentUser.orgId;
        if (this.rootUser) {
          this.model.orgId = 0;
        }
        this.model.loginUserId = this.currentUser.id;
        if (this.model.id == 0) {
          this.model.createdBy = this.currentUser.id;
        }
        this.model.updatedBy = this.currentUser.id;
        this.service.saveEmailRule(this.model).subscribe(resp => {
          let v = this.model.id == 0 ? 'Saved' : 'Updated';
          if (resp.result == 'success') {
            swal({
              title: 'Success',
              text: v + ' Successfully',
              type: 'success',
              timer: this.helper.swalTimer,
              showConfirmButton: false,
            });
            this.loadAll();
            this.spinnerFlag = false;
          } else {
            swal({
              title: 'Error',
              text: 'Error occur',
              type: 'error',
              timer: this.helper.swalTimer,
              showConfirmButton: false,
            });
          }
        })
      } else {
        this.spinnerFlag = false;
        return;
      }
    }
  }

  openSuccessCancelSwal(deleteObj, i) {
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
          this.deleteUser(deleteObj, i);
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

  loadTemplateList() {
    this.tempService.getEmailTemplateBasedOnOrgId().subscribe(result => {
      this.templateModalArray = result.data;
    });
  }

  deleteUser(dataObj, i): string {
    let status = '';
    dataObj.deleteFlag = true;
    this.model.updatedBy = this.currentUser.id;
    this.service.saveEmailRule(dataObj).subscribe((resp) => {
      let responseMsg: string = resp.result;
      if (responseMsg === "success") {
        status = "success";
        swal({
          title: 'Deleted!',
          text: 'Record has been deleted.',
          type: 'success',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
        }).then(responseMsg => {
          this.list.splice(i, 1);
        });
        this.loadAll();
      } else {
        swal({
          title: 'Not Deleted!',
          text: 'Record has been deleted.',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
        }).then(responseMsg => {
          this.loadAll();
        });
      }

    }, (err) => {
      swal({
        title: 'Not Deleted!',
        text: 'Record has been deleted.',
        type: 'error',
        timer: this.helper.swalTimer,
        showConfirmButton: false,
      }).then(responseMsg => {
        this.loadAll();
      });
    });
    return status;
  }

  permissionForRootUser() {
    this.permissionModal.workFlowButtonFlag = true;
    this.permissionModal.viewButtonFlag = true;
    this.permissionModal.deleteButtonFlag = true;
    this.permissionModal.updateButtonFlag = true;
    this.permissionModal.createButtonFlag = true;
    this.permissionModal.publishButtonFlag = true;
  }

}
