import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import swal from 'sweetalert2';
import { config, defaultI18n, defaultOptions } from "../../formbuilder/config";
import { FormBuilderCreateor } from "../../formbuilder/form-builder";
import I18N from "../../formbuilder/mi18n";
import { ConditionChildDTO, ConditionDTO, ExpressionDTO, FormExtendToDocumentDTO } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { MasterControlService } from '../master-control/master-control.service';
import { projectsetupService } from '../projectsetup/projectsetup.service';
function initJq() {
  (function ($) {
    (<any>$.fn).formBuilder = function (data) {
      let options = {}
      if (data)
        options = { defaultFields: data }
      let elems = this;
      let { i18n, ...opts } = $.extend({}, defaultOptions, options, true);
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
              instance.actions = formBuilder.actions;
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
  selector: 'app-form-extend-master',
  templateUrl: './form-extend-master.component.html',
  styleUrls: ['./form-extend-master.component.css','/../../../../node_modules/sweetalert2/dist/sweetalert2.min.css','./../master-dynamic-forms/master-dynamic-forms.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FormExtendMasterComponent implements  OnInit, AfterViewInit {
  spinnerFlag = false;
  submitted = false;
  formBuilder: any;
  projectList: any[] = new Array();
  documentList: any[] = new Array();
  @Input() formExtend: FormExtendToDocumentDTO = new FormExtendToDocumentDTO();
  @Output() onHide = new EventEmitter<boolean>();
  expressionBuilder: any[] = new Array<ExpressionDTO>();
  expressionDropDownFirst: any[] = new Array();
  expressionDropDownSecond: any[] = new Array();
  expressionDropDownThird: any[] = new Array();
  conditionBuilder: any[] = new Array<ConditionDTO>();
  inputField: any = new Array();
  testInputField: any[] = new Array();
  testConditionDropDown=new Array();
  testConditionValue;
  @ViewChild('ConditionCheck') conditionCheckModal: any;
  constructor(public helper: Helper, private projectService: projectsetupService, private service: MasterControlService, private permissionService: ConfigService) { }

  ngOnInit() {
    initJq();
    this.permissionService.loadProject().subscribe(response => {
      this.projectList = response.projectList;
  });
  }

  ngAfterViewInit(): void {
    if(this.formExtend.id!=0){
      this.loadAllStaticDocumentForProject(this.formExtend.projectId);
      this.formBuilder = (<any>jQuery('.build-wrap')).formBuilder(JSON.parse(this.formExtend.jsonStructure));
      this.createDropDownForExpression(JSON.parse(this.formExtend.jsonStructure));
      this.resetTheExpressionForEdit(JSON.parse(this.formExtend.jsonStructure));
      this.resetConditionForEdit(JSON.parse(this.formExtend.jsonStructure));
    } else {
      this.formBuilder = (<any>jQuery('.build-wrap')).formBuilder([]);
      this.inputField = [];
    }
  }

  loadAllStaticDocumentForProject(projectId) {
    this.submitted = false;
    this.projectService.loadStaticDocumentOrderList(projectId).subscribe(jsonResp => {
      this.documentList = jsonResp.result;
      this.documentList.push(({ "key": this.helper.Unscripted_Value, "value": "Unscripted Testing" }));
      this.documentList.push(({ "key": this.helper.DISCREPANCY_VALUE, "value": "Discrepancy Form" }));
    });
  }

  loadFormExtendOfTheProjectParticularDocument(projectId, documentConstant) {
    this.spinnerFlag = true;
    this.service.loadFormExtendOfTheProjectParticularDocument(projectId, documentConstant).subscribe(result => {
      if (result != null) {
        this.formExtend = result;
        this.formBuilder.actions.setData(this.formExtend.jsonStructure);
        this.inputField = JSON.parse(this.formExtend.jsonStructure);
        this.createDropDownForExpression(JSON.parse(this.formExtend.jsonStructure));
        this.resetTheExpressionForEdit(JSON.parse(this.formExtend.jsonStructure));
        this.resetConditionForEdit(JSON.parse(this.formExtend.jsonStructure));
        this.spinnerFlag = false;
      } else {
        this.formExtend = new FormExtendToDocumentDTO();
        this.formExtend.projectId = projectId;
        this.formExtend.documentConstant = +documentConstant;
        this.spinnerFlag = false;
        this.formBuilder.actions.setData(this.formExtend.jsonStructure);
        this.inputField = [];
        this.createDropDownForExpression(this.inputField);
        this.resetTheExpressionForEdit(this.inputField);
        this.resetConditionForEdit(this.inputField);
      }
    }, error => { this.spinnerFlag = false; });
  }

  updateRow(valid) {
    if (valid)
      swal({
        title: "Write your comments here:",
        input: 'textarea',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Update',
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
      })
        .then((value) => {
          if (value) {
            let userRemarks = "Comments : " + value;
            this.saveAndGoto(valid, userRemarks);
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




  saveAndGoto(valid, userRemarks?) {
    if (valid && this.formExtend.documentConstant != 0 && this.formBuilder.formData != "[]") {
      this.spinnerFlag = true;
      this.formExtend.jsonStructure = this.formBuilder.formData;
      this.formExtend.jsonStructure = this.attachExpressionToFianlJSON(this.formExtend.jsonStructure);
      this.formExtend.jsonStructure = this.attachConditionToMainJson(this.formExtend.jsonStructure);
      this.formExtend.jsonExtraData = this.documentList.filter(dto => dto.key == this.formExtend.documentConstant)[0].documentListName;
      this.formExtend.userRemarks = userRemarks;
      this.service.saveFormExtendToDocument(this.formExtend).subscribe(result => {
        let ele = this.formExtend.id == 0 ? "Saved" : "Updated"
        if (result.result != "failure") {
          this.spinnerFlag = false;
          swal({
            title: 'Success',
            text: ele + ' Successfully',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
            }
          });
        }
      }, error => {
        this.spinnerFlag = false;
        swal({
          title: 'Error',
          text: 'Error has occured while saving... Please contact admin',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: false,
          onClose: () => {
          }
        });
      });
    } else {
      this.submitted = true;
      return;
    }
  }

  setHide() {
    this.onHide.emit(true);
  }

  /**Condition And Expression */
  onlyNumber(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 5 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  newExpression() {
    this.createDropDownForExpression();
    let dto = new ExpressionDTO()
    dto.id = '' + Date.now();
    this.expressionBuilder.push(dto);
  }

  createDropDownForExpression(inputFeild?: any[]) {
    this.expressionDropDownThird = new Array();
    this.expressionDropDownSecond = new Array();
    this.expressionDropDownFirst = new Array();
    if (!inputFeild)
      this.inputField = JSON.parse(this.formBuilder.formData);
    else
      this.inputField = inputFeild;
    this.inputField.forEach(element => {
      if (element.type == 'time' || element.type == 'date' || element.type == 'datetime-local' || element.type == 'number' || element.type == 'hidden') {
        this.expressionDropDownFirst.push({ key: element.name, value: element.label });
        this.expressionDropDownSecond.push({ key: element.name, value: element.label });
        this.expressionDropDownThird.push({ key: element.name, value: element.label });
      } else if (element.subtype === 'Text')
        this.expressionDropDownThird.push({ key: element.name, value: element.label });
    })
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
      });
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
    })
    this.expressionBuilder.sort((a, b) => (+a.id) - (+b.id))
  }



  onConditionTypeChange(condition: ConditionDTO, inputFeild?) {
    let conditionDropDownFirst = new Array();
    let conditionDropDownThird = new Array();

    if (!inputFeild)
      this.inputField = JSON.parse(this.formBuilder.formData);
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
        });
        condition['comparatorDropDownFirst'] = conditionDropDownFirst;
        condition['comparatorDropDownSecond'] = conditionDropDownFirst;
        condition['comparatorDropDownThird'] = conditionDropDownThird;
        if (condition.caseSensitive == undefined)
          condition.caseSensitive = false;
        break;
      case 'range':
        this.inputField.forEach(element => {
          if (element.type == 'number' || element.type == 'hidden') {
            conditionDropDownFirst.push({ key: element.name, value: element.label });
          }
          if (element.subtype == 'Text' || element.type == 'hidden') {
            conditionDropDownThird.push({ key: element.name, value: element.label });
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
      Number.parseInt(x);
      typeNumber = true;
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
}
