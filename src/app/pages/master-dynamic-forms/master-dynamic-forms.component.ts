import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IMyDpOptions } from 'mydatepicker/dist';
import { IOption } from 'ng-select';
import swal from 'sweetalert2';
import { config, defaultI18n, defaultOptions } from "../../formbuilder/config";
import { FormBuilderCreateor } from "../../formbuilder/form-builder";
import I18N from "../../formbuilder/mi18n";
import { AdminComponent } from '../../layout/admin/admin.component';
import { ConditionChildDTO, ConditionDTO, ExpressionDTO, FormulaDTO, MasterDynamicForm, ReferenceDTO, UserPrincipalDTO } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { DateFormatSettingsService } from '../date-format-settings/date-format-settings.service';
import { DepartmentService } from '../department/department.service';
import { EquipmentService } from '../equipment/equipment.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { UserService } from '../userManagement/user.service';
import { MasterDynamicFormsService } from './master-dynamic-forms.service';

function initJq() {
  (function ($) {
    (<any>$.fn).formBuilder = function (data) {
      let options = {}
      if (data)
        options = { defaultFields: data }
      let elems = this;
      let { i18n, ...opts }:any = $.extend({}, defaultOptions, options, true);
      (<any>config).opts = opts;
      let i18nOpts = $.extend({}, defaultI18n, i18n, true);
      let instance = {
        actions: {
          getData: null,
          setData: null,
          save: null,
          showData: null,
          setLang: null,
          addField: null,
          removeField: null,
          clearFields: null
        },
        get formData() {
          return instance.actions.getData('json');
        },

        promise: new Promise(function (resolve, reject) {
          new I18N().init(i18nOpts).then(() => {
            elems.each(i => {
              let formBuilder = new FormBuilderCreateor().getFormBuilder(opts, elems[i]);
              $(elems[i]).data('formBuilder', formBuilder);
              instance.actions =formBuilder.actions;
            });
            delete instance.promise;
            resolve(instance);
          }).catch(console.error);
        })

      };

      return instance;
    };
  })(jQuery);
}
@Component({
  selector: 'app-dynamic-forms',
  templateUrl: './master-dynamic-forms.component.html',
  styleUrls: ['./master-dynamic-forms.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None,
})

export class MasterDynamicFormsComponent implements OnInit, AfterViewInit {
  @Output() onClose = new EventEmitter<boolean>();
  @ViewChild('tableViewId') tableViewId: ElementRef;
  @ViewChild('modal') preViewModal: any;
  @ViewChild('ConditionCheck') conditionCheckModal: any;
  @ViewChild('date') date: any;
  @ViewChild('date1') date1: any;
  inputField: any = new Array();
  testInputField: any[] = new Array();
  testConditionDropDown = new Array();
  testConditionValue;
  workFlowSettingFlag = false;
  spinnerFlag = false;
  buttonValue = "Save";
  buttonFlag = false;
  submitted = false;
  templateId: any = 0;
  templateName: String;
  templateList: any;
  masterDynamicForm: MasterDynamicForm = new MasterDynamicForm();
  validationMessage: string = "";
  validationMessageForForm: string = "";
  workFlowOptions: Array<IOption> = new Array<IOption>();
  formBuilder: any[] = new Array();
  expressionBuilder: any[] = new Array<ExpressionDTO>();
  formulaBuilder: any = new FormulaDTO();
  referenceBuilder: any[] = new Array<ReferenceDTO>();
  uniqueIdListForTable: any = [0];
  equipmentList: any[] = new Array();
  expressionDropDownFirst: any[] = new Array();
  expressionDropDownSecond: any[] = new Array();
  expressionDropDownThird: any[] = new Array();
  conditionBuilder: any[] = new Array<ConditionDTO>();
  publishedFormFlag = false; //form demo approved form required for edit
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mm-yyyy',
  };
  referenceDropDownFirst: any[] = new Array();
  referenceDropDownSecond: any[] = new Array();
  referenceDropDownThird: any[] = new Array();
  isEnableInBetween: boolean = false;
  simpleOptionDepartment: Array<IOption> = new Array<IOption>();
  templateOwnerList: any[] = new Array();
  tableColumnsDropDown: IOption[];
  formulaArray: string[] = new Array();
  @ViewChild('div') div: ElementRef;
  @ViewChild('formula') formula: ElementRef;
  formulaContent: any[] = new Array();
  showConstanField: boolean = false;
  constantV: any;
  addFormulaFlag: boolean = false;
  currentDialog = null;
  queryParams: any
  formulaCalculationArray: any[] = new Array();
  viewFormulaArr: any[] = new Array();
  originalDropdown: any[] = new Array<IOption>();
  showFormulas:boolean = false;
  operator:string ="";
  opeartorArr:any=[
    {"name": "Constant","value":"constant"},
    {"name":"Summation","value":"&#8721;"},
    {"name":"Addition","value":"+"},
    {"name":"Subtraction","value":"-"},
    {"name":"Multiplication","value":"*"},
    {"name":"Division","value":"/"}
  ]
  selectControl:any
  @ViewChild("formulaBuilderId",null) contactForm:NgForm;

  constructor(public configService: ConfigService, private adminComponent: AdminComponent, private renderer: Renderer2,
    public router: Router, public builder: FormBuilder, public service: MasterDynamicFormsService,
    public helper: Helper, private projectService: projectsetupService, private dateFormatSettingsService: DateFormatSettingsService,
    public equipmentService: EquipmentService, private datePipe: DatePipe,
    public deptService: DepartmentService, private userService: UserService) {
    Window["masterDynamicFormComponent"] = this;
  }


  ngOnInit() {
    this.loadOrgDateFormatAndTime();
    let today = new Date();
    this.myDatePickerOptions = {
      dateFormat: 'dd-mm-yyyy',
      disableUntil: { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() - 1 },
    };
    this.adminComponent.setUpModuleForHelpContent(this.helper.MASTER_DYNAMIC_FORM);
    this.spinnerFlag = true;
    this.buttonFlag = false;
    initJq();
    this.formBuilder[0] = (<any>jQuery('.build-wrap')).formBuilder();
    this.configService.loadCurrentUserDetails().subscribe(res => {
      this.currentUser = res;
      this.loadEquipmentBasedOnOrg();
      this.loadTemplate();
      this.projectService.loadWorkFlowLevels().subscribe(response => {
        this.workFlowOptions = response.list.map(option => ({ value: option.id, label: option.workFlowLevelName }));
      });
    });
    this.deptService.loadDepartment().subscribe(jsonResp => {
      this.simpleOptionDepartment = this.helper.cloneOptions(jsonResp.result);
    });
    this.referenceDropDownThird.push({ key: 'prefix', value: 'Prefix' });
    this.referenceDropDownThird.push({ key: 'suffix', value: 'Suffix' });

  }
  loadEquipmentBasedOnOrg() {
    this.equipmentService.loadEquipmentsByuser().subscribe(response => {
      if (response.result != null) {
        this.equipmentList = response.result.map(option => ({ value: option.id, label: option.name }));
      }
    }, error => { this.spinnerFlag = false });
  }
  ngAfterViewInit(): void {
    this.dynamicFormUI("visible");
    if (localStorage.getItem("masterFormId") != undefined) {
      let row: any = new MasterDynamicForm();
      let dynamic: any = new MasterDynamicForm();
      row.id = window.atob(localStorage.getItem("masterFormId"));
      if(row.id != '0')
        this.loadTemplateToEdit(row);
      else {
        //Importing the values from file and save
        dynamic = JSON.parse(localStorage.getItem("masterDynamicFormDTO"));
        this.loadImportTemplate(dynamic);
      }
        
    }
  }

  loadOrgDateFormatAndTime() {
    this.dateFormatSettingsService.getOrgDateFormat().subscribe(result => {
      if (!this.helper.isEmpty(result)) {
        this.myDatePickerOptions.dateFormat = result.datePattern.replace("YYYY", "yyyy");
        this.date.setOptions();
        this.date1.setOptions();
      }
    });
  }

  loadTemplate() {
    this.validationMessageForForm = "";
    this.workFlowSettingFlag = false;
    this.service.loadTemplate().subscribe(result => {
      this.templateList = result;
      this.spinnerFlag = false;
    }, err => {
      this.spinnerFlag = false;
    });
  }
  loadTemplateToEdit(row) {
    this.validationMessageForForm = "";
    this.spinnerFlag = true;
    this.service.editDynamicForm(row.id).subscribe(result => {
      if (result != null) {
        this.masterDynamicForm = result;
        this.masterDynamicForm.departments = this.masterDynamicForm.departments.map(d => '' + d);
        if (!this.helper.isEmpty(this.masterDynamicForm.effectiveDate))
          this.masterDynamicForm.effectiveDate = this.populateDate(this.masterDynamicForm.effectiveDate);
        if (!this.helper.isEmpty(this.masterDynamicForm.nextReviewDate))
          this.masterDynamicForm.nextReviewDate = this.populateDate(this.masterDynamicForm.nextReviewDate);
        this.onChangeDept(this.masterDynamicForm.departments, false);
        this.publishedFormFlag = result['publishedFlag'];
        this.masterDynamicForm.publishedFlag = false;//form demo approved form required for edit
        this.resetDataForEdit(this.masterDynamicForm.formStructure)
        this.dynamicFormUI("visible");
        this.buttonValue = "Update";
        this.workFlowSettingFlag = true;
        this.createDropDownForExpression(JSON.parse(this.masterDynamicForm.formStructure));
        this.createDropDownForReference(JSON.parse(this.masterDynamicForm.formStructure));
        this.resetTheExpressionForEdit(JSON.parse(this.masterDynamicForm.formStructure));
        this.resetTheRefernceForEdit(JSON.parse(this.masterDynamicForm.formStructure));
        this.resetConditionForEdit(JSON.parse(this.masterDynamicForm.formStructure));
      }
      this.spinnerFlag = false;
    }, error => {
      this.hideNewTemplateForm();
      this.spinnerFlag = false;
    })
  }

  loadImportTemplate(row) {
    this.validationMessageForForm = "";
    this.spinnerFlag = true;
    if (row != null) {
      this.masterDynamicForm = row;
      if (!this.helper.isEmpty(this.masterDynamicForm.effectiveDate))
        this.masterDynamicForm.effectiveDate = this.populateDate(this.masterDynamicForm.effectiveDate);
      if (!this.helper.isEmpty(this.masterDynamicForm.nextReviewDate))
        this.masterDynamicForm.nextReviewDate = this.populateDate(this.masterDynamicForm.nextReviewDate);
      this.resetDataForEdit(this.masterDynamicForm.formStructure)
      this.dynamicFormUI("visible");
      this.createDropDownForExpression(JSON.parse(this.masterDynamicForm.formStructure));
      this.createDropDownForReference(JSON.parse(this.masterDynamicForm.formStructure));
      this.resetTheExpressionForEdit(JSON.parse(this.masterDynamicForm.formStructure));
      this.resetTheRefernceForEdit(JSON.parse(this.masterDynamicForm.formStructure));
      this.resetConditionForEdit(JSON.parse(this.masterDynamicForm.formStructure));
      localStorage.removeItem("masterDynamicFormDTO");
    }
    this.spinnerFlag = false;  
  }

  populateDate(date: any): any {
    let result: any = new Object();
    if (!this.helper.isEmpty(date)) {
      let dateString = date.split("-");
      result.date = { year: dateString[0], month: dateString[1].charAt(0) === '0' ? dateString[1] = dateString[1].substr(1) : dateString[1], day: dateString[2].charAt(0) === '0' ? dateString[2] = dateString[2].substr(1) : dateString[2] };
    } else {
      result = "";
    }
    return result;
  }

  saveData() {
    this.submitted = true;
    if (!this.helper.isEmpty(this.masterDynamicForm.effectiveDate))
      this.masterDynamicForm.effectiveDate = this.helper.dateToSaveInDB(this.masterDynamicForm.effectiveDate.date);
    if (!this.helper.isEmpty(this.masterDynamicForm.nextReviewDate))
      this.masterDynamicForm.nextReviewDate = this.helper.dateToSaveInDB(this.masterDynamicForm.nextReviewDate.date);
    this.masterDynamicForm.departmentName = this.simpleOptionDepartment.filter(d => this.masterDynamicForm.departments.includes('' + d.value)).map(d => d.label).toString()
    this.validationMessageForForm = "";
    this.masterDynamicForm.formStructure = this.createFinalJSON(this.formBuilder);
    this.masterDynamicForm.formStructure = this.attachExpressionToFianlJSON(this.masterDynamicForm.formStructure);
    this.masterDynamicForm.formStructure = this.attachConditionToMainJson(this.masterDynamicForm.formStructure);
    this.masterDynamicForm.formStructure = this.attachReferenceToFinalJSON(this.masterDynamicForm.formStructure);
    this.masterDynamicForm.formStructure = this.attachFormulaToFinalJSON(this.masterDynamicForm.formStructure);
    let tableJson: any[] = JSON.parse(this.masterDynamicForm.formStructure);
    tableJson.forEach(element => {
      if (element.type == "table") {
        element.name = element.name.trim();
        if (this.helper.isEmpty(element.name))
          this.validationMessageForForm = "Table Name cannot be empty";
      }
    });
    if (this.masterDynamicForm.templateOwnerId != 0 && this.masterDynamicForm.formStructure != "[]" && this.masterDynamicForm.templateName != "" && this.masterDynamicForm.workFlowLevels.length != 0 && this.validationMessage == "" && this.validationMessageForForm == "" && this.masterDynamicForm.departments.length > 0) {
      this.spinnerFlag = true;
      if (this.masterDynamicForm.id == 0) {
        this.masterDynamicForm.createdBy = this.currentUser.id;
      }
      this.masterDynamicForm.publishedFlag = this.publishedFormFlag;
      this.masterDynamicForm.globalProjectId = this.currentUser.projectId;
      this.masterDynamicForm.updatedBy = this.currentUser.id;
      this.masterDynamicForm.loginUserId = this.currentUser.id;
      this.masterDynamicForm.organizationOfLoginUser = this.currentUser.orgId;
      this.masterDynamicForm.projectVersionId = this.currentUser.versionId;
      this.service.createMasterDynamicForm(this.masterDynamicForm).subscribe(result => {
        if (result.result != "failure") {
          this.spinnerFlag = false;
          let timerInterval;
          swal({
            title: 'Saved Successfully!',
            text: this.masterDynamicForm.templateName + ' Form has been Saved',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              localStorage.setItem("masterFormId", window.btoa(result.id));
              document.getElementById("workFlowSetUpId").click();
              this.loadTemplate();
              this.workFlowSettingFlag = true;
              clearInterval(timerInterval)
            }
          });
        }
      }, error => {
        this.spinnerFlag = false;
        swal({
          title: 'Error in Saving',
          text: this.masterDynamicForm.templateName + ' Form has not been Saved',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
        }

        );
      })
    } else {
      if (this.masterDynamicForm.formStructure == '[]') {
        this.validationMessageForForm = "Form cannot be empty";
        window.scrollTo(0, document.body.scrollHeight);
        return;
      }
      return;
    }

  }

  showNext = (() => {
    var timer: any = 2;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!this.helper.isEmpty(this.masterDynamicForm.templateName)) {
          this.service.isTemplateExists(this.masterDynamicForm.templateName).subscribe(
            jsonResp => {
              let responseMsg: boolean = jsonResp;
              if (responseMsg == true) {
                this.validationMessage = "Dynamic form with this name already exist.";
              } else {
                this.validationMessage = "";
              }
            }
          );
        }
      }, 600);
    }
  })();


  loadForm() {
    this.masterDynamicForm = new MasterDynamicForm();
    this.masterDynamicForm.workFlowLevels = new Array();
    this.dynamicFormUI("visible");
    //errror
    // this.formBuilder.actions.setData(JSON.stringify(""));
    this.validationMessage = "";
    this.workFlowSettingFlag = false;
  }

  hideNewTemplateForm() {
    this.onClose.emit(true);
  }


  deleteTemplate(id) {
    this.spinnerFlag = true;
    let masterDynamicForm = new MasterDynamicForm();
    masterDynamicForm.id = id;
    masterDynamicForm.updatedBy = this.currentUser.id;
    masterDynamicForm.loginUserId = this.currentUser.id;
    masterDynamicForm.organizationOfLoginUser = this.currentUser.orgId;
    masterDynamicForm.globalProjectId = this.currentUser.projectId;
    this.service.deleteTemplate(masterDynamicForm)
      .subscribe((resp) => {
        this.spinnerFlag = false;
        let responseMsg: string = resp.result;
        let timerInterval;
        if (responseMsg === "success") {
          this.hideNewTemplateForm();
          swal({
            title: 'Deleted!',
            text: this.masterDynamicForm.templateName + ' Form has been Deleted',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              this.loadTemplate();
              clearInterval(timerInterval)
            }
          });

        } else {
          swal({
            title: 'Not Deleted!',
            text: this.masterDynamicForm.templateName + 'Form has not been Deleted',
            type: 'error',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
          }

          );

        }

      }, (err) => {
        swal({
          title: 'Not Deleted!',
          text: this.masterDynamicForm.templateName + 'Form has not been Deleted',
          type: 'error'
        }

        );
        this.spinnerFlag = false;
      });
  }
  deleteTemplateSwal(id) {
    var obj = this
    swal({
      title: 'Are you sure?',
      text: 'You wont be able to revert',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success m-r-10',
      cancelButtonClass: 'btn btn-danger',
      allowOutsideClick: false,
      buttonsStyling: false
    }).then(function () {
      obj.deleteTemplate(id);
    });
  }

  dynamicFormUI(view) {
    var element = document.getElementById("build-wrap");
    element.setAttribute("style", "visibility:" + view + ";padding: 10px;");
    this.buttonFlag = true;
    this.buttonValue = 'Save';
    this.workFlowSettingFlag = false;
  }

  addTable(id?: number, json?: any, tableName?: string, order?: number) {
    let length = this.uniqueIdListForTable.length;
    let uniqueId;
    if (id != undefined) {
      uniqueId = id;
    }
    else
      uniqueId = new Date().getTime();
    const div = document.createElement('div');
    div.setAttribute("id", "" + uniqueId);

    const rowDiv = document.createElement('div');
    rowDiv.setAttribute("class", "row");
    let innerHtml = `
       <label class="col-sm-2">Table Name:</label>
       <input type="text"  class="form-control col-sm-6"  id="tableName-`+ uniqueId + `" placeholder="Enter Table Name" value="` + (id != undefined ? tableName : '') + `"   />
       <label class="col-sm-2">Table Order:</label>
       <input type="number" min="0" class="form-control col-sm-2"  id="tableOrder-`+ uniqueId + `" placeholder="Enter Table Order" value="` + (id != undefined ? order : 0) + `"    />
    `
    rowDiv.innerHTML = innerHtml;
    const tableDiv = document.createElement('div');
    tableDiv.setAttribute("id", 'table-' + uniqueId)
    tableDiv.setAttribute("class", 'tableDragDropClassHide')
    div.appendChild(document.createElement('hr'));
    div.appendChild(rowDiv);
    div.appendChild(document.createElement('br'));
    div.appendChild(tableDiv);
    const delButton = document.createElement('input');
    delButton.setAttribute("id", this.formBuilder.length + "-" + uniqueId);
    delButton.setAttribute("type", "button");
    delButton.setAttribute("value", "Delete Table");
    delButton.setAttribute("class", 'btn-danger')
    delButton.addEventListener('click', () => {
      let idwithFormLength = (<any>event.currentTarget).id;
      const stringList = idwithFormLength.split('-');
      this.formBuilder[stringList[0]] = undefined;
      $('#' + stringList[1]).remove();
    });
    div.appendChild(delButton);
    this.renderer.appendChild(this.tableViewId.nativeElement, div);
    this.uniqueIdListForTable[length] = uniqueId;
    if (id != undefined)
      this.formBuilder[length] = (<any>jQuery('#' + 'table-' + uniqueId)).formBuilder(json);
    else
      this.formBuilder[length] = (<any>jQuery('#' + 'table-' + uniqueId)).formBuilder();
  }

  createFinalJSON(formBuilder): string {
    let mainJson: any[] = JSON.parse(formBuilder[0].formData);

    for (let index = 1; index < formBuilder.length; index++) {
      const element = formBuilder[index];
      if (element != undefined) {
        let tableJson = {
          type: "table",
          name: (<any>document.getElementById('tableName-' + this.uniqueIdListForTable[index])).value,
          columns: JSON.parse(element.formData),
          rows: [],
          id: this.uniqueIdListForTable[index],
          fixedRow: this.fixedRow(JSON.parse(element.formData))
        }

        let order = (<any>document.getElementById('tableOrder-' + this.uniqueIdListForTable[index])).value
        if (order != undefined && order < mainJson.length && order > 0) {
          mainJson.splice(order, 0, tableJson);
          tableJson['tableOrder'] = order
        } else {
          mainJson[mainJson.length] = tableJson;
          tableJson['tableOrder'] = mainJson.length;
        }
      }
    }
    return JSON.stringify(mainJson);
  }

  fixedRow(inputs) {
    for (const col in inputs) {
      if (inputs[col].type == 'select' && inputs[col].multiple)
        return true;
    }
    return false;
  }


  preViewData() {
    this.inputField = JSON.parse(this.createFinalJSON(this.formBuilder))
    this.preViewModal.show();
  }

  resetDataForEdit(jsonString) {
    let mainJson: any[] = JSON.parse(jsonString);
    let tableJson = new Array();
    mainJson.forEach((item, index) => {
      if (item.type == 'table') {
        tableJson.push(item);
        delete mainJson[index];
      }
    });
    mainJson = mainJson.filter(json => json).map(json => json);
    mainJson.forEach((item, index) => {
      if (item.name === "viewFormula") {
        this.viewFormulaArr = item.viewFormulaArr;
        mainJson.splice(index, 1);
      }
    });
    if(this.masterDynamicForm.id != 0)
      this.formBuilder[0].actions.setData(JSON.stringify(mainJson));
    else
      this.formBuilder[0].promise.then(function (fb) {
          fb.actions.setData(JSON.stringify(mainJson));
      });
    
    tableJson.forEach((element, index) => {
      this.addTable(element.id, element.columns, element.name, element.tableOrder);
    });
    let filtered = mainJson.filter(data => data.formulaCalculation).map(field => field["formulaCalculation"]);
    filtered.forEach((item, index) => {
      this.formulaCalculationArray.push({ name: item.finalResultId, calculation: item });
    })
    this.viewFormula();

  }

  createDropDownForExpression(inputFeild?: any[]) {
    this.expressionDropDownThird = new Array();
    this.expressionDropDownSecond = new Array();
    this.expressionDropDownFirst = new Array();
    if (!inputFeild)
      this.inputField = JSON.parse(this.createFinalJSON(this.formBuilder));
    else
      this.inputField = inputFeild;
    this.inputField.forEach(element => {
      if (element.type == 'time' || element.type == 'date' || element.type == 'datetime-local' || element.type == 'number' || element.type == 'hidden') {
        this.expressionDropDownFirst.push({ key: element.name, value: element.label });
        this.expressionDropDownSecond.push({ key: element.name, value: element.label });
        this.expressionDropDownThird.push({ key: element.name, value: element.label });
      } else if (element.subtype === 'Text')
        this.expressionDropDownThird.push({ key: element.name, value: element.label });

      if (element.type == 'table') {
        element.columns.forEach(e => {
          if (e.type == 'time' || e.type == 'date' || e.type == 'datetime-local' || e.type == 'number' || e.type == 'hidden') {
            this.expressionDropDownFirst.push({ key: e.name, value: e.label });
            this.expressionDropDownSecond.push({ key: e.name, value: e.label });
            this.expressionDropDownThird.push({ key: e.name, value: e.label });
          } else if (e.subtype === 'Text')
            this.expressionDropDownThird.push({ key: e.name, value: e.label });
        });

      }


    })
  }

  createDropDownForReference(inputFeild?: any[]) {
    this.referenceDropDownFirst = new Array<IOption>();
    this.referenceDropDownSecond = new Array<IOption>();
    if (!inputFeild)
      this.inputField = JSON.parse(this.createFinalJSON(this.formBuilder));
    else
      this.inputField = inputFeild;
    this.inputField.forEach(element => {
      if (element.subtype === 'Text' || element.type === 'select' || element.type == 'time' || element.type == 'date' || element.type == 'datetime-local' || element.type == 'number' || element.type == 'hidden') {
        this.referenceDropDownSecond.push({ value: element.name, label: element.label });
      }
      if (element.type == 'table') {
        element.columns.forEach(e => {
          this.referenceDropDownFirst.push({ key: e.name, value: e.label });
        });
      }
    })
  }

  createDropDownForFormula(inputFeild?: any[]) {
    this.tableColumnsDropDown = new Array<IOption>();
    if (!inputFeild)
      this.inputField = JSON.parse(this.createFinalJSON(this.formBuilder));
    else
      this.inputField = inputFeild;

    this.inputField.forEach(element => {
      if (element.type == 'table') {
        element.columns.forEach(e => {
          this.tableColumnsDropDown.push({ value: e.name, label: e.label });
        });
      }
      else if (element.type == 'text' || element.type == 'number') {
        this.tableColumnsDropDown.push({ value: element.name, label: element.label });
      }
    })

    this.originalDropdown = this.tableColumnsDropDown;
    this.viewFormulaArr.forEach((element, index) => {
      this.tableColumnsDropDown = this.tableColumnsDropDown.filter(item => item.label !== element.name);
    })

  }

  onlyNumber(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 5 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  newExpression(index) {
    this.createDropDownForExpression();
    let dto = new ExpressionDTO()
    dto.id = '' + Date.now();
    this.expressionBuilder.push(dto);
  }
  newReference() {
    this.createDropDownForReference();
    let dto = new ReferenceDTO()
    dto.id = '' + Date.now();
    this.referenceBuilder.push(dto);
  }
  newCondition(index) {
    let dto = new ConditionDTO()
    dto.id = '' + Date.now();
    this.conditionBuilder.push(dto);
  }

  deleteCondition(index) {
    this.conditionBuilder.splice(index, 1);
  }

  deleteExpression(index) {
    this.expressionBuilder.splice(index, 1);
  }
  deleteReference(index) {
    this.referenceBuilder.splice(index, 1);
  }

  attachExpressionToFianlJSON(formStructure): string {
    let mainJson = JSON.parse(formStructure);
    this.expressionBuilder.forEach((expression, index) => {
      expression.operandTwoConstant = (!expression.operandTwoConstant) ? 0 : expression.operandTwoConstant;
      mainJson.forEach(element => {
        if ((expression.operandOneId == element.name || expression.operandTwoId == element.name)) {
          if (!element.calculations || index == 0) {
            element.calculations = new Array();
          }
          element.calculations.push(expression);
        } else if (expression.finalResultId == element.name) {
          element.disabled = true;
        }

        if (element.type == "table") {
          element.columns.forEach(e => {
            if ((expression.operandOneId == e.name || expression.operandTwoId == element.name)) {
              if (!e.calculations || index == 0) {
                e.calculations = new Array();
              }
              e.calculations.push(expression);
            } else if (expression.finalResultId == e.name) {
              e.disabled = true;
            }
          });
        }
      });
    });
    return JSON.stringify(mainJson);
  }

  attachReferenceToFinalJSON(formStructure): string {
    let mainJson = JSON.parse(formStructure);
    this.referenceBuilder.forEach(reference => {
      mainJson.forEach(element => {
        reference.referenceId.forEach(refId => {
          if ((refId == element.name)) {
            if (!element.references) {
              element.references = new Array();
            }
            element.references.push(reference);
          }
        });
      });
    });
    mainJson.forEach(jsonElement => {
      if ("table" === jsonElement.type) {
        jsonElement.columns.forEach(e => {
          e.dynamicLabel = e.label;
        });
      }
    });
    return JSON.stringify(mainJson);
  }

  resetTheExpressionForEdit(inputFeild: any[]) {
    this.expressionBuilder = new Array();
    let ids = new Array();

    inputFeild.forEach(element => {
      if ((element.type == 'time' || element.type == 'date' || element.type == 'datetime-local' || element.type == 'number' || element.type == 'hidden')) {
        if (element.calculations) {
          element.calculations.forEach(expression => {
            if (!ids.includes(expression.id)) {
              ids.push(expression.id);
              this.expressionBuilder.push(expression)
            }
          });
        }
      }

      if (element.type == "table") {
        element.columns.forEach(e => {
          if (e.calculations) {
            e.calculations.forEach(expression => {
              if (!ids.includes(expression.id)) {
                ids.push(expression.id);
                this.expressionBuilder.push(expression)
              }
            });
          }
        });

      }
    })
    this.expressionBuilder.sort((a, b) => (+a.id) - (+b.id))
  }

  resetTheRefernceForEdit(inputFeild: any[]) {
    let ids = new Array();
    this.referenceBuilder = new Array();
    inputFeild.forEach(element => {
      if ((element.subtype === 'Text' || element.type === 'select' || element.type == 'time' || element.type == 'date' || element.type == 'datetime-local' || element.type == 'number' || element.type == 'hidden')) {
        if (element.references) {
          element.references.forEach(reference => {
            if (!ids.includes(reference.id)) {
              ids.push(reference.id);
              this.onChangeReferenceIds(reference.referenceId, reference);
              this.referenceBuilder.push(reference);
            }
          });
        }
      }
    })
    this.referenceBuilder.sort((a, b) => (+a.id) - (+b.id))
  }

  onConditionTypeChange(condition: ConditionDTO, inputFeild?) {
    let conditionDropDownFirst = new Array();
    let conditionDropDownThird = new Array();

    if (!inputFeild)
      this.inputField = JSON.parse(this.createFinalJSON(this.formBuilder));
    else
      this.inputField = inputFeild;

    switch (condition.type) {
      case 'comparator':
        this.inputField.forEach(element => {
          if (element.type == 'number' || element.subtype == 'Text' || element.type == 'hidden') {
            conditionDropDownFirst.push({ key: element.name, value: element.label });
          }
          if (element.subtype == 'Text') {
            conditionDropDownThird.push({ key: element.name, value: element.label });
          }
          if (element.type == 'table') {
            element.columns.forEach(e => {
              if (e.type == 'number' || e.subtype == 'Text' || e.type == 'hidden') {
                conditionDropDownFirst.push({ key: e.name, value: e.label });
              }
              if (e.subtype == 'Text') {
                conditionDropDownThird.push({ key: e.name, value: e.label });
              }
            });

          }
        });
        condition['comparatorDropDownFirst'] = conditionDropDownFirst;
        condition['comparatorDropDownSecond'] = conditionDropDownFirst;
        condition['comparatorDropDownThird'] = conditionDropDownThird;
        if (condition.caseSensitive == undefined)
          condition.caseSensitive = false;
        break;
      case 'range':
        this.inputField.forEach(element => {
          if (element.type == 'number' || element.type == 'hidden' || element.subtype == 'Text') {
            conditionDropDownFirst.push({ key: element.name, value: element.label });
          }
          if (element.subtype == 'Text' || element.type == 'hidden') {
            conditionDropDownThird.push({ key: element.name, value: element.label });
          }
          if (element.type == 'table') {
            element.columns.forEach(e => {
              if (e.type == 'number' || e.type == 'hidden') {
                conditionDropDownFirst.push({ key: e.name, value: e.label });
              }
              if (e.subtype == 'Text' || e.type == 'hidden') {
                conditionDropDownThird.push({ key: e.name, value: e.label });
              }
            });

          }
        });
        condition['conditionDropDownFirst'] = conditionDropDownFirst;
        condition['conditionDropDownSecond'] = conditionDropDownFirst;
        condition['conditionDropDownThird'] = conditionDropDownThird;
        if (!condition['conditionChild']) {
          condition['conditionChild'] = new Array();
          let child = new ConditionChildDTO();
          child.id = '' + Date.now();
          condition['conditionChild'].push(child)
        }
        break;
    }
  }

  conditionChildCreate(conditionChild) {
    let child = new ConditionChildDTO();
    child.id = '' + Date.now();
    conditionChild.push(child);
  }

  deleteChildCondition(conditionChild, i) {
    conditionChild.splice(i, 1);
  }

  testCondition(conditions) {
    this.testConditionDropDown = new Array();
    conditions.map(c => this.testConditionDropDown.push({ 'key': c, 'value': c.name }));
    this.testConditionValue = undefined
    this.testInputField = new Array();
    this.conditionCheckModal.show();
  }

  testConditionOnValueChange(condition: ConditionDTO) {
    this.testInputField = new Array();
    let feildRequired = new Array();
    let whichAllNeededJson = new Array();
    switch (condition.type) {
      case 'range':
        condition['conditionDropDownFirst'].forEach(element => {
          if (!feildRequired.includes(element.key)) {
            feildRequired.push(element.key)
          }
        });
        condition['conditionDropDownThird'].forEach(element => {
          if (!feildRequired.includes(element.key)) {
            feildRequired.push(element.key)
          }
        });


        whichAllNeededJson.push(condition.operandOneId);
        condition.conditionChild.forEach(ele => {
          if (whichAllNeededJson.indexOf(ele.lowerLimitValue) == -1)
            whichAllNeededJson.push(ele.lowerLimitValue);
          if (whichAllNeededJson.indexOf(ele.upperLimitValue) == -1)
            whichAllNeededJson.push(ele.upperLimitValue);
        })
        whichAllNeededJson.push(condition.operandTwoId);
        whichAllNeededJson.push(condition.resultOperandId);
        feildRequired = feildRequired.filter(e => whichAllNeededJson.indexOf(e) != -1);
        break;
      case 'comparator':
        condition['comparatorDropDownFirst'].forEach(element => {
          if (!feildRequired.includes(element.key)) {
            feildRequired.push(element.key)
          }
        });
        condition['comparatorDropDownThird'].forEach(element => {
          if (!feildRequired.includes(element.key)) {
            feildRequired.push(element.key)
          }
        });

        whichAllNeededJson.push(condition.operandOneId);
        whichAllNeededJson.push(condition.operandTwoId);
        whichAllNeededJson.push(condition.resultOperandId);
        feildRequired = feildRequired.filter(e => whichAllNeededJson.indexOf(e) != -1);
        break;
    }
    JSON.parse(JSON.stringify(this.inputField)).forEach(element => {
      if (feildRequired.indexOf(element.name) != -1) {
        this.testInputField.push(element);
      }
      if (element.type == 'table') {
        element.columns.forEach(e => {
          if (feildRequired.indexOf(e.name) != -1) {
            this.testInputField.push(e);
          }
        });

      }
    });
  }

  conditionCheck(condition: any, inputVariableName: string, inputFeilds) {
    this.getTheConditionValue(condition, inputFeilds, inputVariableName);
  }

  getTheConditionValue(condition: ConditionDTO, inputFeilds, inputName) {
    let y;
    let x;
    switch (condition.type) {
      case 'range':
        x = inputName
        this.rangeCalculation(condition, x, inputFeilds);
        break;

      case 'comparator':

        inputFeilds.forEach(element => {
          if (element.name == condition.operandTwoId)
            y = element.value;
          if (element.name == condition.operandOneId)
            x = element.value;
        });
        if (condition.operandTwoId == 'constant') {
          y = condition.constantValue;
        }
        this.comparatorCalculation(x, y, condition, inputFeilds);
        break;
    }
  }

  comparatorCalculation(x: any, y: string | number, condition: ConditionDTO, list) {
    let outPut = false;
    let typeNumber = false;
    try {
      typeNumber = !isNaN(Number.parseInt(x));
    } catch (error) {
      typeNumber = false;
    }
    switch (condition.operator) {
      case 'equals':
        if (typeNumber) {
          try {
            outPut = +x == +y
          } catch (error) {
            outPut = false;
          }
        } else {
          if (!condition.caseSensitive) {
            outPut = ('' + x).toLocaleLowerCase() == ('' + y).toLocaleLowerCase();
          } else {
            outPut = x == y;
          }
        }
        break;
      case 'notEqualTo':
        if (typeNumber) {
          try {
            outPut = +x != +y
          } catch (error) {
            outPut = false;
          }
        } else {
          if (!condition.caseSensitive) {
            outPut = ('' + x).toLocaleLowerCase() != ('' + y).toLocaleLowerCase();
          } else {
            outPut = x != y;
          }
        }
        break;
      case 'greaterThan':
        if (typeNumber) {
          try {
            outPut = +x > +y
          } catch (error) {
            outPut = false;
          }
        } else {
          outPut = false;
        }
        break;
      case 'greaterThanEqual':
        if (typeNumber) {
          try {
            outPut = +x >= +y
          } catch (error) {
            outPut = false;
          }
        } else {
          outPut = false;
        }
        break;
      case 'lessThan':
        if (typeNumber) {
          try {
            outPut = +x < +y
          } catch (error) {
            outPut = false;
          }
        } else {
          outPut = false;
        }
        break;
      case 'lessThanEqual':
        if (typeNumber) {
          try {
            outPut = +x <= +y
          } catch (error) {
            outPut = false;
          }
        } else {
          outPut = false;
        }
        break;
    }

    let outPutValue;
    let outPutColor;
    if (outPut) {
      outPutValue = condition.outPutValue;
      outPutColor = condition.color;
    } else {
      outPutValue = condition.defaultValue;
      outPutColor = condition.defaultColor;
    }
    if (outPutValue)
      list.forEach(element => {
        if (element.name)
          if (element.name.includes(condition.resultOperandId)) {
            element.value = outPutValue;
            element.color = outPutColor;
          }
      });
  }

  rangeCalculation(range: ConditionDTO, rangleToBeCheckFor, list) {
    let outPutValue;
    let outPutColor;
    for (let index = 0; index < range.conditionChild.length; index++) {
      const rangeData: ConditionChildDTO = range.conditionChild[index];
      let lowerLimitValue;
      let upperLimitValue;
      let value;
      list.forEach(element => {
        if (element.name == rangeData.lowerLimitValue)
          lowerLimitValue = +element.value;
        if (element.name == rangeData.upperLimitValue)
          upperLimitValue = +element.value;
        if (element.name == range.operandOneId)
          value = +element.value;
      });
      if (rangeData.lowerLimitValue == 'constant') {
        lowerLimitValue = +rangeData.lowerConstantValue;
      }
      if (rangeData.upperLimitValue == 'constant') {
        upperLimitValue = +rangeData.upperConstantValue;
      }
      switch (rangeData.lowerLimitCondition + rangeData.upperLimitCondition) {
        case 'greaterThanlessThan':
          if (value > lowerLimitValue && value < upperLimitValue) {
            outPutValue = rangeData.outPutValue;
            outPutColor = rangeData.color;
          }

          break;
        case 'greaterThanlessThanEqual':
          if (value > lowerLimitValue && value <= upperLimitValue) {
            outPutValue = rangeData.outPutValue;
            outPutColor = rangeData.color;
          }

          break;
        case 'greaterThanEquallessThan':
          if (value >= lowerLimitValue && value < upperLimitValue) {
            outPutValue = rangeData.outPutValue;
            outPutColor = rangeData.color;
          }

          break;
        case 'greaterThanEquallessThanEqual':
          if (value >= lowerLimitValue && value <= upperLimitValue) {
            outPutValue = rangeData.outPutValue;
            outPutColor = rangeData.color;
          }
          break;
      }
    }
    //No result found so set default value 
    if (!outPutValue) {
      outPutValue = range.defaultValue;
      outPutColor = range.defaultColor;
    }

    list.forEach(element => {
      if (element.name)
        if (element.name.includes(range.resultOperandId)) {
          element.value = outPutValue;
          element.color = outPutColor;
        }
    });


  }

  attachConditionToMainJson(formStructure): string {
    let mainJson = JSON.parse(formStructure);
    let conditionBuilder = JSON.parse(JSON.stringify(this.conditionBuilder))
    conditionBuilder.forEach((condition: ConditionDTO, index) => {
      delete condition['conditionDropDownFirst']
      delete condition['conditionDropDownSecond']
      delete condition['conditionDropDownThird']
      delete condition['comparatorDropDownFirst']
      delete condition['comparatorDropDownSecond']
      delete condition['comparatorDropDownThird']
      mainJson.forEach(element => {
        if ((condition.operandOneId == element.name)) {
          if (!element.conditions) {
            element.conditions = new Array();
          }
          element.conditions.push(condition);
        } else if (condition.resultOperandId == element.name) {
          element.disabled = true;
        }

        if (element.type == "table") {
          element.columns.forEach(e => {
            if ((condition.operandOneId == e.name)) {
              if (!e.conditions) {
                e.conditions = new Array();
              }
              e.conditions.push(condition);
            } else if (condition.resultOperandId == e.name) {
              e.disabled = true;
            }
          });
        }
      });
    });
    return JSON.stringify(mainJson);

  }

  resetConditionForEdit(inputFeild: any[]) {
    let conditionList = new Array();
    inputFeild.filter(e => e.conditions).map(e => e.conditions).forEach(element => {
      if (element)
        element.forEach(data => {
          conditionList.push(data);
        });
    });
    inputFeild.filter(e => e.type == 'table').map(e => e.columns).forEach(ele => {
      ele.map(e => e.conditions).forEach(element => {
        if (element)
          element.forEach(data => {
            conditionList.push(data);
          });
      })
    });
    let ids = new Array();
    this.conditionBuilder = new Array();
    conditionList.forEach(condition => {
      if (!ids.includes(condition.id)) {
        ids.push(condition.id);
        this.conditionBuilder.push(condition);
      }
    })
    this.conditionBuilder.forEach(condition => {
      this.onConditionTypeChange(condition, inputFeild);
    })
  }
  openBtnClicked() {
    if (!this.date.showSelector)
      this.date.openBtnClicked();
    if (!this.date1.showSelector)
      this.date1.openBtnClicked();
  }
  onChangeDept(event, resetUserFlag) {
    if (resetUserFlag) {
      this.masterDynamicForm.templateOwnerId = 0;
    }
    this.userService.loadAllUserBasedOnDepartment(event).subscribe(resp => {
      this.templateOwnerList = resp.result;
    });
  }
  onChangeReferenceIds(event, reference: ReferenceDTO) {
    reference.enableInBetween = false;
    if (event.length > 1)
      reference.enableInBetween = true;
  }

  addFormula() {
    this.addFormulaFlag = true;
    if (this.div !== undefined) {
      const childElements = this.div.nativeElement.children;
      for (let child of childElements) {
        this.renderer.removeChild(this.div.nativeElement, child);
      }
    }
    else {
      this.createDropDownForFormula();
      let dto = new FormulaDTO()
      dto.id = '' + Date.now();
      this.inputField = JSON.parse(this.createFinalJSON(this.formBuilder));
      this.inputField = this.inputField.filter(data => data.type == 'table')
    }
  }

  deleteFormula(index) {
    this.addFormulaFlag = false;
    this.formulaBuilder = new FormulaDTO();
    this.formulaArray = [];
  }

  cancelFormula(formulaID) {
    this.formulaBuilder = new FormulaDTO();
    this.formulaArray = [];
    this.addFormulaFlag = false;
    this.operator="";
  }

  attachFormulaToFinalJSON(formStructure): string {
    let mainJson = JSON.parse(formStructure);
    this.formulaCalculationArray.forEach(formula => {
      mainJson.forEach(element => {
        if ((formula.name == element.name)) {
          if (!element.formulaCalculation) {
            element.formulaCalculation = {};
          }
          element.formulaCalculation = formula.calculation;
        }
      });
    });
    mainJson.push({ name: "viewFormula", viewFormulaArr: this.viewFormulaArr, type: "formula" })
    return JSON.stringify(mainJson);
  }

  removeFormula(formulaID) {
    document.getElementById(formulaID).outerHTML = "";
    document.getElementById("field-" + formulaID).outerHTML = "";
    if (this.div !== undefined) {
      const childElements = this.div.nativeElement.children;
      for (let child of childElements) {
        this.renderer.removeChild(this.div.nativeElement, child);
      }
    }
  }

  saveFormula(formulaID) {
    let summationColumn;
    let formulaObj = {};
    this.removeFormula(formulaID);
    let obtainLabel = this.tableColumnsDropDown.filter(ele => ele.value == this.formulaBuilder.toBePlaced).map(data => data.label)
    this.viewFormulaArr.push({
      "formula": this.formulaArray.map(data => data).reduce((prev, current) => prev + current),
      "name": obtainLabel[0],
      "mathOperation": (this.formulaBuilder.mathOperation === 'fixedDecimal') ? false : true,
      "mathFunction": this.formulaBuilder.mathOperation,
      "decimalPlaces": this.formulaBuilder.decimalPlaces
    });
    this.viewOneFormula(obtainLabel[0])

    if (this.formulaBuilder.type == "summation") {
      summationColumn = this.tableColumnsDropDown.filter(ele => ele.label == this.formulaArray[1]).map(data => data.value);
      formulaObj = {
        "operator": this.formulaBuilder.type,
        "columnId": summationColumn[0],
        "finalResultId": this.formulaBuilder.toBePlaced,
        "formula": this.formulaArray,
        "mathOperation": (this.formulaBuilder.mathOperation === 'fixedDecimal') ? false : true,
        "mathFunction": this.formulaBuilder.mathOperation,
        "decimalPlaces": this.formulaBuilder.decimalPlaces
      }
    } else {
      this.formulaArray = this.formulaArray.map(formula => {
        formula = (!(formula == '&#8721;' || formula == '+' || formula == '-' || formula == '*' || formula == '/') && isNaN(+formula)) ?
          this.inputField.filter(field => field.label == formula)[0]['name'] : formula;
        return formula
      })
      formulaObj = {
        "operator": this.formulaBuilder.type,
        "finalResultId": this.formulaBuilder.toBePlaced,
        "formula": this.formulaArray,
        "mathOperation": (this.formulaBuilder.mathOperation === 'fixedDecimal') ? false : true,
        "mathFunction": this.formulaBuilder.mathOperation,
        "decimalPlaces": this.formulaBuilder.decimalPlaces
      }
    }
    this.formulaCalculationArray.push({ name: this.formulaBuilder.toBePlaced, calculation: formulaObj });
    this.formulaArray = [];
    this.formulaBuilder = new FormulaDTO();
    this.tableColumnsDropDown = this.tableColumnsDropDown.filter(item => item.value !== this.formulaBuilder.toBePlaced);
    this.deleteFormula(0);
    this.cancelFormula(0);
  }

  addElement(select: HTMLSelectElement,data) {
    if (data === 'constant') {
      this.showConstanField = true;
      data = data.toString()
    } else {
      this.showConstanField = false;
      const p: HTMLTableCellElement = this.renderer.createElement('span');
      let color: any = '';
      let style: any = 'margin-top: 8px;text-align: center; font-size: 30px;';
      let tag = '<span  class=" ' + color + ' "' + ' waves-effect waves-light data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" style="' + style + '">' + data + '&nbsp</span>&nbsp;';
      let braces = '<h1>' + data + ' &nbsp; </h1>'
      p.innerHTML = (data == "(" || data == ")") ? braces : tag + "&nbsp";
      this.renderer.appendChild(this.div.nativeElement, p);
      this.formulaArray.push(data);
      if(!this.helper.isEmpty(select))
        select.value = "";
    }
  }
  viewFormula() {
    if (this.viewFormulaArr.length > 0) {
      this.viewFormulaArr.forEach((element, index) => {
        if (element.name != '') {
          const p = this.renderer.createElement('span');
          this.renderer.setProperty(p, 'id', element.name);
          let decimalValueExist = (element.mathOperation) ? '' : element.decimalPlaces;
          p.innerHTML = '<div class="row col-md-12 well"><div class="col-md-2"> <h5><b>' + "&nbsp;&nbsp;" + (index + 1) + "&nbsp;&nbsp;" + element.name + '</b></h5></div>' +
            '<div class="col-md-7" style="margin-top: 8px;font-size: 30px;">' + element.formula + '</div>'
            + '<div class="col-md-2">' + ((element.mathFunction!=='')?element.mathFunction.charAt(0).toUpperCase() : "")+ ((element.mathFunction!=='')?element.mathFunction.slice(1).toLowerCase():"") + '&nbsp;' + decimalValueExist + '</div>'
            + '<div class="col-md-1"> <button style=" justify-content: flex-end;" class="btn  btn-danger btn-round btn-outline-danger pull-right" type="button" onclick="Window.masterDynamicFormComponent.removeRespectiveFormula(' + index + ')">&nbsp;Remove&nbsp;</button>&nbsp;<br><br></div></div>'
          this.renderer.appendChild(this.formula.nativeElement, p)
          p.onclick = "window.doSomething()";
        }
      });
    }
  }

  viewOneFormula(index) {
    if (this.viewFormulaArr.length > 0) {
      let element = this.viewFormulaArr.filter(data => data.name === index)[0]
      // this.viewFormulaArr.forEach((element, index) => {
      if (element.name != '') {
        const p = this.renderer.createElement('span');
        this.renderer.setProperty(p, 'id', element.name);
        let decimalValueExist = (element.mathOperation) ? '' : element.decimalPlaces;
        let spliceIndex = this.viewFormulaArr.length - 1;
        p.innerHTML = '<div class="row col-md-12 well"><div class="col-md-2"> <h5><b>' + "&nbsp;&nbsp;" + (this.viewFormulaArr.length) + "&nbsp;&nbsp;" + element.name + '</b></h5></div>' +
          '<div class="col-md-7" style="margin-top: 8px;font-size: 30px;">' + element.formula + '</div>'
          + '<div class="col-md-2">' + element.mathFunction.charAt(0).toUpperCase() + element.mathFunction.slice(1).toLowerCase() + '&nbsp;' + decimalValueExist + '</div>'
          + '<div class="col-md-1"> <button style=" justify-content: flex-end;" class="btn  btn-danger btn-round btn-outline-danger pull-right" type="button" onclick="Window.masterDynamicFormComponent.removeRespectiveFormula(' + spliceIndex + ')">&nbsp;Remove&nbsp;</button>&nbsp;<br><br></div></div>'
        this.renderer.appendChild(this.formula.nativeElement, p)
        p.onclick = "window.doSomething()";
      }
      // });
    }
  }

  removeRespectiveFormula(index) {
    let arr = []
    let formulaElement = this.viewFormulaArr[index];
    for (var i = index; i < this.viewFormulaArr.length; i++) {
      if ((index + 1) >= this.viewFormulaArr.length)
        arr.push(false);
      else if (this.viewFormulaArr[index + 1].name.includes(formulaElement.name)) {
        arr.push(true);
      }
    }
    let checker = array => array.every(Boolean);
    console.log(checker(arr));
    if (!checker(arr)) {
      if (this.formula !== undefined) {
        const childElements = this.formula.nativeElement.children;
        for (let child of childElements) {
          if ((child.attributes.id.nodeValue === formulaElement.name) && !checker(arr))
            this.renderer.removeChild(this.formula.nativeElement, child);
        }
      }
      this.viewFormulaArr.splice(index, 1);
      this.tableColumnsDropDown.push(this.originalDropdown.filter(ele => ele.label == formulaElement.name)[0]);
    } else {
      swal({
        title: 'Cannot remove the parent formula ',
        text: 'Please remove all the dependent formula and try again',
        type: 'error',
        timer: this.helper.swalTimer,
        showConfirmButton: false
      })
    }
  }

}
