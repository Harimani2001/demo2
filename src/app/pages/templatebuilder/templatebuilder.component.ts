import { testmail } from './../../models/model';
import swal from 'sweetalert2';
import { Permissions } from './../../shared/config';
import { FormControl, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LookUpService } from '../LookUpCategory/lookup.service';
import { Helper } from '../../shared/helper';
import { LookUpCategory, LookUpItem, templateBuilder, UserPrincipalDTO, CommonModel, defaultTemplateDto } from '../../models/model';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { TemplateBuiderService } from './templatebuilder.service';
import { UserService } from '../userManagement/user.service';
import { IOption } from 'ng-select';
import { AdminComponent } from '../../layout/admin/admin.component';
import { ConfigService } from '../../shared/config.service';

declare var grapesjs: any; // Important!

@Component({
  selector: 'app-templatebuilder',
  templateUrl: './templatebuilder.component.html',
  styleUrls: ['./templatebuilder.component.css', '../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class TemplatebuilderComponent implements OnInit {
  submitted = false;
  public editor: any;
  public lookUpCategory: LookUpCategory = new LookUpCategory();
  public settingsCategory: LookUpCategory = new LookUpCategory();
  public userSelectionList: LookUpItem[] = new Array();
  public settingsSelectionList: LookUpItem[] = new Array();
  public templateModal: templateBuilder = new templateBuilder();
  public templateModalArray: templateBuilder[] = new Array();
  public templateList: templateBuilder[] = new Array();
  public templateFormController: any;
  public settingsFormController: any;
  public spinnerFlag: boolean = false;
  public addFlag: boolean = false;
  public SettingsFlag: boolean = false;
  rootUser: boolean = false;
  public titleList: any;
  permissionData: any;
  permissionModal: Permissions = new Permissions("177", false);
  public uiSwitch: boolean = true;
  public userModalList: any[] = new Array();
  public testEmailModal: testmail = new testmail();
  public settingsModal: defaultTemplateDto = new defaultTemplateDto();
  public settingsModalList: defaultTemplateDto[] = new Array();
  modal: CommonModel = new CommonModel();
  userList: Array<IOption> = new Array<IOption>();
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  updateFlag: boolean = false;
  constructor(private adminComponent: AdminComponent, private userService: UserService, private configService: ConfigService, public projectsetupService: projectsetupService, private tempService: TemplateBuiderService, private projectService: projectsetupService, public lookupService: LookUpService, public helperServie: Helper) { }

  ngOnInit() {
    this.configService.loadCurrentUserDetails().subscribe(response => {
      this.currentUser = response;
      if (this.helperServie.APPLICATION_ADMIN === response.roleName) {
        this.rootUser = true;
        this.permissionsForRoot();
      } else {
        this.configService.loadPermissionsBasedOnModule("177").subscribe(resp => {
          this.permissionModal = resp
        });
      }
      this.loadTemplateList();
      this.spinnerFlag = true;
      this.templateFormController = new FormGroup({
        templateName: new FormControl(this.templateModal.templateName, [Validators.required]),
      });

      this.settingsFormController = new FormGroup({
        templatefor: new FormControl(this.settingsModal.templatefor, [Validators.required]),
        templateId: new FormControl(this.settingsModal.templateId, [Validators.required]),
      });
      this.adminComponent.setUpModuleForHelpContent("177");
    });

  }
  loadProjects() {
    this.modal.globalProjectName = this.currentUser.projectName;
    this.modal.globalProjectId = this.currentUser.projectId;
    this.modal.projectVersionName = this.currentUser.versionName;
    this.configService.loadProject().subscribe(response => {
      this.titleList = response.projectList;
    });
  }

  settingsDropDown() {
    this.settingsSelectionList = [];
    this.settingsCategory.id = this.helperServie.Settingsid;
    this.lookupService.getlookUpItems(this.settingsCategory).subscribe((data) => {
      this.settingsSelectionList = data.response;
      this.templateList = this.templateModalArray.filter(f=>f.activeFlag);
    });
  }

  showeditor() {
    this.spinnerFlag = true;
    setTimeout(() => { this.loadGrapesJS(); }, 100);
  }

  getLookUpItem(lookUpCategory: LookUpCategory, type: String) {
    this.userSelectionList = [];
    this.lookupService.getlookUpItems(lookUpCategory).subscribe((data) => {
      this.userSelectionList = data.response;
      let result = null;
      this.userSelectionList.forEach(element => {
        result = `<option value=` + element.value + `>` + element.key + `</option>` + result;
      });
      this.editor.RichTextEditor.add('custom-vars', {
        icon: `<select style="background-color: #DDDDDD;" class="gjs-field">
        <option value="">- ` + type + `-</option>`
          + result + `</select>`,
        event: 'change',
        attributes: { title: type },
        result: (rte, action) => rte.insertHTML(action.btn.firstChild.value),
        update: (rte, action) => { action.btn.firstChild.value = ''; }
      });
      this.spinnerFlag = false;
    });
  }

  loadGrapesJS() {
    this.spinnerFlag = false;
    this.editor = grapesjs.init({
      container: '#gjs',
      plugins: ['gjs-preset-newsletter'],
      pluginsOpts: {
        'gjs-preset-newsletter': {
          modalTitleImport: 'Import template',
        }
      },
    });


    var panelManager = this.editor.Panels;
    panelManager.addButton('options', {
      id: 'clearCanvas',
      className: 'fa fa-trash',
      attributes: { title: "Clear Canvas" },
      command: e => e.runCommand('core:canvas-clear'),
      active: false
    });

    setTimeout(() => {
      this.loaddropdown();
      if (this.editor != null)
        this.editor.setComponents(this.templateModal.templateContent);
      this.editor.store();
    }, 33);


  }
  loadusersForTestEmail() {
    this.userService.loadAllUsersForTemplatesAndForms().subscribe(
      jsonResp => {
        let list: any[] = jsonResp.result;
        this.userList = list.map(option => ({ value: option.email, label: option.email }));
        this.spinnerFlag = false;
        let defaultEmail = this.currentUser.email;
        // this.userList.push({ value: defaultEmail, label: defaultEmail })
        this.userModalList.push(defaultEmail);

      }, err => { this.spinnerFlag = false; });
  }

  test(row) {
    this.testEmailModal.templateId = row.id;
    this.loadusersForTestEmail()
  }

  send() {
    this.testEmailModal.userModalList = this.userModalList;
    this.tempService.test(this.testEmailModal).subscribe(result => {
      this.swalfunction(result.data, result.data == "success" ? "Success" : "Error", result.data == "success" ? "success" : "error")
      this.loadTemplateList();
    });
  }

  loaddropdown() {
    if (this.addFlag) {
      this.lookUpCategory.id = this.helperServie.userSuggestionId;
      this.getLookUpItem(this.lookUpCategory, 'User Data');
      this.lookUpCategory.id = this.helperServie.documentSuggestionId;
      this.getLookUpItem(this.lookUpCategory, 'Document Data');
      this.lookUpCategory.id = this.helperServie.equipmentSuggestionId;
      this.getLookUpItem(this.lookUpCategory, 'Equipment Data');
    }
  }

  addTemplate(flag: boolean) {
    this.templateFormController.reset()
    this.addFlag = flag;
    this.editor = null;
    this.templateModal = new templateBuilder();
    this.templateModal.activeFlag = true;
    this.templateModal.id = 0;
    this.showeditor();
  }

  // service methods
  saveTemplate() {
    this.templateModal.id == 0 ? this.updateFlag = false : this.updateFlag = true;
    this.templateModal.templateName = this.templateFormController.get('templateName').value;
    this.templateModal.createdUser = this.currentUser.id;
    this.templateModal.templateContent = this.editor.runCommand('gjs-get-inlined-html');
    this.tempService.saveEmailTemplate(this.templateModal).subscribe(result => {
      if (!this.updateFlag)
        this.swalfunction("Saved Successfully", "", "success");
      else
        this.swalfunction("Updated Successfully", "", "success");
      this.loadTemplateList();
      this.addFlag = false;
    });
  }

  edit(row) {
    setTimeout(() => {
      this.templateModal = new templateBuilder();
      this.addTemplate(!this.addFlag)
      this.tempService.getmodal(row.id).subscribe(result => {
        this.templateModal = result.data;
        this.templateFormController.setValue({
          templateName: this.templateModal.templateName
        });
        this.loadGrapesJS();
      });
    }, 33);
  }

  delete(row) {
    let templateModal = new templateBuilder();
    templateModal.id = row.id;
    templateModal.userRemarks = row.userRemarks;
    this.tempService.deletemodal(templateModal).subscribe(result => {
      if (result.data) {
        this.swalfunction("deleted Successfully", "", "success")
        this.loadTemplateList();
      } else
        this.swalfunction("Template is mapped; It cannot be deleted!", "", "warning")
    });
  }

  loadTemplateList() {
    this.spinnerFlag = true;
    this.tempService.getEmailTemplateBasedOnOrgId().subscribe(result => {
      this.templateModalArray = result.data;
      this.spinnerFlag = false;
    });
  }

  swalfunction(text: any, title: any, type: any) {
    let timerInterval;
    swal({
      title: title,
      text: text,
      type: type,
      timer: this.helperServie.swalTimer,
      showConfirmButton: false,
      onClose: () => {
        this.addFlag = false;
        clearInterval(timerInterval)
      }
    });
  }

  permissionsForRoot() {
    this.permissionModal.viewButtonFlag = true;
    this.permissionModal.updateButtonFlag = true;
    this.permissionModal.importButtonFlag = true;
    this.permissionModal.createButtonFlag = true;
    this.permissionModal.publishButtonFlag = true;
    this.permissionModal.deleteButtonFlag = true;
  }

  view(id: any) {
    this.templateModal = new templateBuilder();
    this.addTemplate(!this.addFlag)
    this.tempService.getmodal(id).subscribe(result => {
      this.templateModal = result.data;
      this.templateFormController.setValue({
        templateName: this.templateModal.templateName
      });
      setInterval(() => {
      });
      this.editor.setComponents(this.templateModal.templateContent);
      this.editor.store();
    });
  }

  swaldelete(row) {
    this.tempService.templateIsUsed(row.id).subscribe(
      jsonResp => {
        let responseMsg: boolean = jsonResp;
        if (responseMsg == true) {
          swal({
            title: 'Info',
            text: 'Cannot be deleted as this Template is already in Use!!',
            type: 'warning',
            showConfirmButton: false,
            timer: 3000, allowOutsideClick: false
          });
        } else {
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
                row.userRemarks = "Comments : " + value;
                this.delete(row);
              } else {
                swal({
                  title: '',
                  text: 'Comments is requried',
                  type: 'info',
                  timer: this.helperServie.swalTimer,
                  showConfirmButton: false,
                });
              }
            });
        }
      });
  }

  SwitchUi(data: any) {
    this.uiSwitch = data;
    this.SettingsFlag = false;
  }

  settingsView(data: any) {
    this.loadProjects()
    this.settingsDropDown()
    this.loadSettingsList()
    this.SettingsFlag = data;
    this.settingsFormController.reset();
  }

  loadSettingsList() {
    this.settingsModal.orgId = this.currentUser.orgId;
    if (null != this.settingsModal.orgId && undefined != this.settingsModal.orgId)
      this.tempService.loadSettingsListByProjectId(this.settingsModal).subscribe(result => {
        this.settingsModalList = result.data;
        this.spinnerFlag = false;
      });
  }

  saveEmailSettings() {
    this.spinnerFlag = true;
    this.settingsModal.orgId = this.currentUser.orgId;
    this.settingsModal.templatefor = this.settingsFormController.get('templatefor').value;
    this.settingsModal.templateId = this.settingsFormController.get('templateId').value;
    this.settingsModal.userId = this.currentUser.id;
    this.tempService.saveSettings(this.settingsModal).subscribe(result => {
      swal("Saved Successfully", "", "success")
      this.loadSettingsList();
      this.addFlag = false;
    });
  }

}
