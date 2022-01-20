import { Component, OnInit, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import swal from 'sweetalert2';
import { DatePipe } from '../../../../../node_modules/@angular/common';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { Helper } from '../../../shared/helper';
import { projectPlanService } from '../projectplan.service';
import { ConfigService } from '../../../shared/config.service';
import { IMyDpOptions } from 'mydatepicker/dist';
import { DateFormatSettingsService } from '../../date-format-settings/date-format-settings.service';
import { UserService } from '../../userManagement/user.service';
import { IOption } from 'ng-select';
import { ModalBasicComponent } from '../../../shared/modal-basic/modal-basic.component';
import { Permissions } from '../../../shared/config';

@Component({
  selector: 'app-add-projectplan',
  templateUrl: './add-projectplan.component.html',
  styleUrls: ['./add-projectplan.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
})

export class AddProjectplanComponent implements OnInit {
  @ViewChild('date') date: any;
  @ViewChild('date1') date1: any;
  @ViewChild('sendMailModal') sendMailModal: ModalBasicComponent;
  @ViewChild('myExpansionPanel') mySingleExpansionPanel: any;
  @ViewChildren('myExpansionPanel') myExpansionPanel: any;
  public spinnerFlag: boolean = false;
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
  };
  projectPlanData: any;
  projectSelectionFlag: boolean = false;
  currentDoc: any;
  desciptionFlag: boolean = false;
  currentLevel: any;
  usersFlag: boolean = false;
  oldDesc: any;
  oldUsers: any;
  datePipeFormat = 'dd-MM-yyyy';
  levelDropdown = {
    singleSelection: false,
    classes: "myclass custom-class",
    badgeShowLimit: 1,
    disabled: true
  };
  dropdownSettings = {
    singleSelection: false,
    text: "Select Users",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    badgeShowLimit: 5,
    classes: "myclass custom-class",
  };
  projectStartDate: any;
  projectEndDate: any;
  public userList: Array<IOption> = new Array<IOption>();
  selectedUsersForEmail: any;
  remarksForEmail: any;
  notificationFlag: boolean = false;
  levelDesciptionFlag: boolean;
  oldLevelDesc: any;
  mappingId: any;
  permissionModal: Permissions = new Permissions(this.helper.PROJECTPLAN, false);
  oldResponsibility: any;
  configOfCkEditior = {
    removeButtons: 'Save,Source,Preview,NewPage,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Language,CreateDiv,About,ShowBlocks,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Anchor,spellchecker,Link,Unlink',
    height: 100
  }
  oldScrollY: number;
  showExpansion: boolean = false;

  constructor(private adminComponent: AdminComponent, private configService: ConfigService,
    public helper: Helper, public route: ActivatedRoute, private userService: UserService,
    public projectplanService: projectPlanService,
    public router: Router, public datePipe: DatePipe, private dateFormatSettingsService: DateFormatSettingsService) {
  }

  ngOnInit() {
    this.loadProjectPlan();
    this.loadOrgDateFormatAndTime();
    this.adminComponent.setUpModuleForHelpContent("116");
    this.adminComponent.taskDocType = "116";
    this.adminComponent.taskDocTypeUniqueId = "";
    this.adminComponent.taskEquipmentId = 0;
    this.configService.loadPermissionsBasedOnModule(this.helper.PROJECTPLAN).subscribe(resp => {
      this.permissionModal = resp;
    });
  }

  loadAllUsersOnProject() {
    this.spinnerFlag = true;
    this.userService.loadAllUserBasedOnOrganization().subscribe(jsonResp => {
      if (jsonResp.result != null) {
        this.userList = jsonResp.result.map(option => ({ id: Number(option.id), itemName: option.firstName + " " + option.lastName }));
        this.selectedUsersForEmail = jsonResp.result.map(option => ({ id: Number(option.id), itemName: option.firstName + " " + option.lastName }));
      }
      this.spinnerFlag = false;
    }, err => { this.spinnerFlag = false; });
  }

  loadOrgDateFormatAndTime() {
    this.dateFormatSettingsService.getOrgDateFormat().subscribe(result => {
      if (!this.helper.isEmpty(result)) {
        this.myDatePickerOptions.dateFormat = result.datePattern.replace("YYYY", "yyyy");
        this.datePipeFormat = result.datePattern.replace("mm", "MM")
        this.datePipeFormat = this.datePipeFormat.replace("YYYY", "yyyy");
      }
    });
  }

  loadProjectPlan() {
    this.spinnerFlag = true;
    this.projectSelectionFlag = true;
    this.projectPlanData = new Array();
    this.projectplanService.loadProjectPlan().subscribe(jsonResp => {
      let planData: any;
      planData = jsonResp.result;
      if (!this.helper.isEmpty(planData)) {
        if (planData.startTargetDate) {
          this.projectStartDate = planData.startTargetDate.year + "-" + planData.startTargetDate.month + "-" + planData.startTargetDate.day;
        }
        if (planData.endTargetDate) {
          this.projectEndDate = planData.endTargetDate.year + "-" + planData.endTargetDate.month + "-" + planData.endTargetDate.day;
        }
        planData.child.forEach(element => {
          element.child.forEach(data => {
            if (!this.helper.isEmpty(data.startTargetDate)) {
              data.startTargetDate = { date: { year: data.startTargetDate.year, month: data.startTargetDate.month, day: data.startTargetDate.day } };
            }
            if (!this.helper.isEmpty(data.endTargetDate)) {
              data.endTargetDate = { date: { year: data.endTargetDate.year, month: data.endTargetDate.month, day: data.endTargetDate.day } };
            }
          });
        });
      }
      this.projectPlanData = planData;
      this.spinnerFlag = false;
    })
  }

  onChangeTargetStartDate(event: any, docType: any, level: any, itemIndex: any) {
    if (!this.spinnerFlag && event) {
      this.spinnerFlag = true;
      this.oldScrollY = window.scrollY;  // Work around Chrome issue (#2712)
      this.projectPlanData.child.forEach(element => {
        element.child.forEach(data => {
          if (!this.helper.isEmpty(data.startTargetDate) && !this.helper.isEmpty(data.endTargetDate)) {
            data.startTargetDate = data.startTargetDate.date;
            data.endTargetDate = data.endTargetDate.date;
          }
          if (element.itemName === docType.itemName && data.itemName === level.itemName)
            data.startTargetDate = event.date;
        });
      });
      this.projectplanService.calculationForProjectPlan(this.projectPlanData).subscribe(jsonResp => {
        this.projectPlanData = jsonResp.result;
        this.projectPlanData.child.forEach(element => {
          element.child.forEach(data => {
            if (!this.helper.isEmpty(data.startTargetDate)) {
              data.startTargetDate = { date: { year: data.startTargetDate.year, month: data.startTargetDate.month, day: data.startTargetDate.day } };
            }
            if (!this.helper.isEmpty(data.endTargetDate)) {
              data.endTargetDate = { date: { year: data.endTargetDate.year, month: data.endTargetDate.month, day: data.endTargetDate.day } };
            }
          });
        });
        setTimeout(() => {
          if (this.myExpansionPanel) {
            this.myExpansionPanel._results.filter((element, index) => {
              if (index == itemIndex)
                element.toggle();
            });
          }
        }, 5);
        this.showExpansion = false;
        this.spinnerFlag = false;
        this.pageSize();
      })
    } else if (!this.spinnerFlag) {
      docType.child.forEach(element => {
        element.startTargetDate = null;
        element.endTargetDate = null;
      });
    }
  }

  onChangeTargetEndDate(event: any, docType: any, level: any, itemIndex: any, levelIndex: any) {
    if (!this.spinnerFlag && event) {
      this.spinnerFlag = true;
      this.oldScrollY = window.scrollY;  // Work around Chrome issue (#2712)
      this.projectPlanData.child.forEach(element => {
        element.child.forEach(data => {
          if (!this.helper.isEmpty(data.startTargetDate) && !this.helper.isEmpty(data.endTargetDate)) {
            data.startTargetDate = data.startTargetDate.date;
            data.endTargetDate = data.endTargetDate.date;
          }
          if (element.itemName === docType.itemName && data.itemName === level.itemName){
            data.endTargetDate = event.date;
          }
        });
      });
      this.projectPlanData.itemIndex = itemIndex;
      this.projectPlanData.levelIndex = levelIndex;
      this.projectplanService.calculationForProjectPlanOnTargetEndDate(this.projectPlanData).subscribe(jsonResp => {
        this.projectPlanData = jsonResp.result;
        this.projectPlanData.child.forEach(element => {
          element.child.forEach(data => {
            if (!this.helper.isEmpty(data.startTargetDate)) {
              data.startTargetDate = { date: { year: data.startTargetDate.year, month: data.startTargetDate.month, day: data.startTargetDate.day } };
            }
            if (!this.helper.isEmpty(data.endTargetDate)) {
              data.endTargetDate = { date: { year: data.endTargetDate.year, month: data.endTargetDate.month, day: data.endTargetDate.day } };
            }
          });
        });
        setTimeout(() => {
          if (this.myExpansionPanel) {
            this.myExpansionPanel._results.filter((element, index) => {
              if (index == itemIndex)
                element.toggle();
            });
          }
        }, 5);
        this.showExpansion = false;
        this.spinnerFlag = false;
        this.pageSize();
      })
    } else if (!this.spinnerFlag) {
      docType.child.forEach(element => {
        element.startTargetDate = null;
        element.endTargetDate = null;
      });
    }
  }

  pageSize() {
    var timer = setInterval(() => {
      if (this.oldScrollY) {
        window.scrollTo(null, this.oldScrollY);
        clearInterval(timer);
      }
    }, 1000)
  }

  onlyNumber(event, docType: any, level: any, itemIndex: any) {
    const pattern = /[0-9]$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 5 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
    setTimeout(() => {
      this.projectPlanData.child.forEach(element => {
        element.child.forEach(data => {
          if (element.itemName === docType.itemName && data.itemName === level.itemName) {
            if (data.sla < 1)
              data.sla = 1;
            if (data.sla > 31)
              data.sla = 31;
            this.onChangeSla(data.sla, docType, level, itemIndex);
          }
        });
      });
    }, 10);
    if (event.keyCode == 189 || event.keyCode == 187)
      event.preventDefault();
  }

  onChangeSla(sla: any, docType: any, level: any, itemIndex: any) {
    if ((sla > 0 && sla < 32) && !this.spinnerFlag) {
      this.spinnerFlag = true;
      this.oldScrollY = window.scrollY;
      this.projectPlanData.child.forEach(element => {
        element.child.forEach(data => {
          if (!this.helper.isEmpty(data.startTargetDate) && !this.helper.isEmpty(data.endTargetDate)) {
            data.startTargetDate = data.startTargetDate.date;
            data.endTargetDate = data.endTargetDate.date;
          }
          if (element.itemName === docType.itemName && data.itemName === level.itemName)
            data.sla = sla;
        });
      });
      this.projectplanService.calculationForProjectPlan(this.projectPlanData).subscribe(jsonResp => {
        this.projectPlanData = jsonResp.result;
        this.projectPlanData.child.forEach(element => {
          element.child.forEach(data => {
            if (!this.helper.isEmpty(data.startTargetDate)) {
              data.startTargetDate = { date: { year: data.startTargetDate.year, month: data.startTargetDate.month, day: data.startTargetDate.day } };
            }
            if (!this.helper.isEmpty(data.endTargetDate)) {
              data.endTargetDate = { date: { year: data.endTargetDate.year, month: data.endTargetDate.month, day: data.endTargetDate.day } };
            }
          });
        });
        setTimeout(() => {
          if (this.myExpansionPanel) {
            this.myExpansionPanel._results.filter((element, index) => {
              if (index == itemIndex)
                element.toggle();
            });
          }
        }, 5);
        this.showExpansion = false;
        this.spinnerFlag = false;
        this.pageSize();
      }, err => { this.spinnerFlag = false; })
    }
  }

  getUsers(doc: any, level: any, mapping: any) {
    this.usersFlag = false;
    this.currentDoc = doc;
    this.currentLevel = level;
    this.mappingId = mapping;
    this.projectPlanData.child.forEach(element => {
      element.child.forEach(data => {
        if (doc === element.id && level === data.id) {
          if (!this.helper.isEmpty(data.selectedUsers)) {
            this.oldUsers = JSON.parse(JSON.stringify(data.selectedUsers));
          }
        }
      });
    });
  }

  deselectUsers() {
    this.projectPlanData.child.forEach(element => {
      element.child.forEach(data => {
        if (element.id === this.currentDoc && data.id === this.currentLevel)
          data.selectedUsers = this.oldUsers;
      });
    });
  }

  getDescription(doc: any) {
    this.currentDoc = doc;
    if (this.mySingleExpansionPanel) {
      this.mySingleExpansionPanel.toggle();
    }
    this.projectPlanData.child.forEach(element => {
      if (doc === element.id) {
        if (!this.helper.isEmpty(element.description)) {
          this.oldDesc = element.description;
          this.desciptionFlag = true;
        } else
          this.desciptionFlag = false;
      }
    });
  }

  cancelDescription() {
    this.projectPlanData.child.forEach(element => {
      if (element.id === this.currentDoc)
        element.description = this.oldDesc;
    });
  }

  getLevelDescription(doc: any, level: any, mapping: any) {
    this.currentDoc = doc;
    this.currentLevel = level;
    this.mappingId = mapping;
    this.projectPlanData.child.forEach(element => {
      element.child.forEach(data => {
        if (doc === element.id && level === data.id) {
          if (!this.helper.isEmpty(data.description) || !this.helper.isEmpty(data.responsibility)) {
            this.oldLevelDesc = data.description;
            this.oldResponsibility = data.responsibility;
            this.levelDesciptionFlag = true;
          } else
            this.levelDesciptionFlag = false;
        }
      })
    });
  }

  cancelLevelDescription() {
    this.projectPlanData.child.forEach(element => {
      element.child.forEach(data => {
        if (element.id === this.currentDoc && data.id === this.currentLevel) {
          data.description = this.oldLevelDesc;
          data.responsibility = this.oldResponsibility;
        }
      });
    });
  }

  onSave() {
    this.spinnerFlag = true;
    this.projectPlanData.child.forEach(element => {
      element.child.forEach(data => {
        if (!this.helper.isEmpty(data.startTargetDate) && !this.helper.isEmpty(data.endTargetDate)) {
          data.startTargetDate = data.startTargetDate.date;
          data.endTargetDate = data.endTargetDate.date;
        }
      });
    });
    this.projectplanService.saveProjectPlan(this.projectPlanData).subscribe(jsonResp => {
      this.spinnerFlag = false;
      if (jsonResp.result == "success") {
        this.spinnerFlag = false;
        this.loadProjectPlan();
        swal({
          title: 'Success',
          text: 'Project Plan created successfully',
          type: 'success',
          timer: 2000, showConfirmButton: false
        });
      }
    }, err => { this.spinnerFlag = false; });
  }

  sendEmail() {
    let planData = this.projectPlanData;
    if (this.notificationFlag) {
      planData.child.forEach(element => {
        if (this.currentDoc === element.itemName) {
          element.child.forEach(data => {
            if (this.currentLevel === data.itemName) {
              let childData = [];
              childData.push(data);
              element.child = childData;
              let levelData = [];
              levelData.push(element)
              planData.child = levelData;
            }
          })
        }
      })
    }
    planData.child.forEach(element => {
      element.child.forEach(data => {
        if (!this.helper.isEmpty(data.startTargetDate) && !this.helper.isEmpty(data.endTargetDate)) {
          data.startTargetDate = data.startTargetDate.date;
          data.endTargetDate = data.endTargetDate.date;
        }
      });
    });
    if (!this.helper.isEmpty(planData) && !this.helper.isEmpty(this.selectedUsersForEmail)) {
      this.sendMailModal.spinnerShow();
      planData.selectedUsersForEmail = this.selectedUsersForEmail;
      planData.remarksForEmail = this.remarksForEmail;
      this.projectplanService.sendProjectPlanEmail(planData).subscribe(jsonResp => {
        if (jsonResp.result == "success") {
          this.sendMailModal.spinnerHide();
          swal({
            title: 'Success',
            text: 'Project Plan Email is Sent!',
            type: 'success',
            timer: this.helper.swalTimer, showConfirmButton: false
          });
        } else {
          this.sendMailModal.spinnerHide();
          swal({
            title: 'Error',
            text: 'Error in Sending Project Plan Email!',
            type: 'error',
            timer: this.helper.swalTimer, showConfirmButton: false,
          });
        }
        this.notificationFlag = false;
      }, err => { this.sendMailModal.spinnerHide(); });
    }
  }

  cancelEmail() {
    this.remarksForEmail = null;
  }

  loadLevelUsers(doc: any, level: any, LevelUsers: any) {
    this.currentDoc = doc;
    this.currentLevel = level;
    this.notificationFlag = true;
    if (!this.helper.isEmpty(LevelUsers)) {
      this.userList = LevelUsers;
      this.selectedUsersForEmail = LevelUsers;
    }
  }

  onUserChange(event) {
    if (event.length == 0)
      this.usersFlag = true;
    else
      this.usersFlag = false;
  }

  expandAll() {
    this.showExpansion = true;
    if (this.myExpansionPanel) {
      this.myExpansionPanel._results.forEach(element => {
        if (!element.isToggled)
          element.toggle();
      });
    }
  }

  collapseAll() {
    this.showExpansion = false;
    if (this.myExpansionPanel) {
      this.myExpansionPanel._results.forEach(element => {
        if (element.isToggled)
          element.toggle();
      });
    }
  }

  excelExport() {
    this.projectplanService.excelExport().subscribe(resp => {
      if (resp.result) {
        var nameOfFileToDownload = resp.sheetName + ".xls";
        this.adminComponent.previewOrDownloadByBase64(nameOfFileToDownload, resp.sheet, false);
      }
    })
  }

}