import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DynamicFormDTO, ConditionChildDTO, ConditionDTO } from '../../models/model';
import { ExternalDocumentApprovalComponentService } from '../external-document-approval/external-document-approval.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { isNullOrUndefined } from 'util';
import { Helper } from '../../shared/helper';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-external-dynamic-form',
  templateUrl: './external-dynamic-form.html',
  styleUrls: ['./external-dynamic-form.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class ExternalDynamicFormComponent implements OnInit {
  @ViewChild('formId') formValidation: any;
  @ViewChild('savemodal') savemodal: any;
  @ViewChild('fileuploaddiv') myInputVariable: ElementRef;
  @ViewChild('ShowImageModal') showImageModal: any;
  receivedId: string;
  public inputField: any = [];
  dynamicForm = new DynamicFormDTO();
  isExpired: boolean = false;
  spinnerFlag: boolean = false;
  externaluserData: any;
  enableCalculate: boolean = false;
  onExternalsaveForm: FormGroup;
  isSendOtp: boolean = false;
  isInvalidEmail: boolean = false;
  isInvalidOtp: boolean = false;
  submitted: boolean = false;
  dropDownSelectionRequired: boolean = false;
  isPublish: boolean = false;
  imageurl: any = "";
  isInvalidComments: boolean = false;
  tenantName:string
  constructor(public router: ActivatedRoute, public service: ExternalDocumentApprovalComponentService, private datePipe: DatePipe, public fb: FormBuilder, public helper: Helper, private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this.receivedId = this.router.snapshot.params["id"];
    this.spinnerFlag = true;
    if(!this.helper.isEmpty(localStorage.getItem("redirectReference"))){
      this.service.getTenantName(localStorage.getItem("redirectReference")).subscribe(resp=>{
        this.tenantName=resp.result;
        this.service.postApi(this.receivedId, 'externalApproval/loadExternalFormDetails',this.tenantName).subscribe(response => {
          this.spinnerFlag = false;
          this.externaluserData = response;
          this.isExpired = response.validityExpiryFlag;
          if (response.dynamicFormDTO && !this.isExpired) {
            this.dynamicForm = response.dynamicFormDTO;
            this.inputField = JSON.parse(this.dynamicForm.formData);
          }
        });
      });
    }
    this.onExternalsaveForm = this.fb.group({
      comments: ['', Validators.compose([
        Validators.required
      ])],
      email: ['', Validators.compose([
        Validators.required, Validators.pattern('[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')
      ])],
      otp: [],
    });
  }

  addRow(input) {
    this.inputField.forEach(element => {
      let jsonObject = {}
      if (element.id == input.id) {
        var labelViewNeeded = element.columns.filter(col => col.type == 'select' && col.multiple);
        var finalViewNeededData = labelViewNeeded;
        if (labelViewNeeded.length > 1) {
          var lengthList = labelViewNeeded.map(col => col.values.length)
          finalViewNeededData = labelViewNeeded.filter(col => lengthList.includes(col.values.length))
        }
        if (finalViewNeededData.length != 0) {
          if (finalViewNeededData[0].values.length != element.rows.length) {
            for (let index = 0; index < finalViewNeededData[0].values.length; index++) {
              let jsonArray = new Array();
              this.creatingRows(element, jsonArray, index, finalViewNeededData[0].values.length);
              jsonObject = {
                "row": jsonArray,
                "createdBy": this.externaluserData.name,
                "createdTime": Date.now(),
                "id": 0,
                "deleteFlag": "N",
                'order': index
              }
              element.rows.push(jsonObject);
            }
          }
        } else {
          let jsonArray = new Array();
          this.creatingRows(element, jsonArray);
          jsonObject = {
            "row": jsonArray,
            "createdBy": this.externaluserData.name,
            "createdTime": Date.now(),
            "id": 0,
            "deleteFlag": "N",
            'order': element.rows.length
          }
          element.rows.push(jsonObject);
        }
      }
    });
  }

  creatingRows(element, jsonArray, indexParent?, totalIndex?) {
    element.columns.forEach((col, index) => {
      let json = {}
      if (col.type != 'checkbox-group' && col.type != 'radio-group') {
        let values: any[];
        if (col.values)
          values = JSON.parse(JSON.stringify(col.values));//to keep source as it is
        if (col.multiple && values && values.length == totalIndex) {
          json = {
            name: (col.name + "-" + element.rows.length),
            value: values[indexParent] ? values[indexParent].label : ""
          }
        } else {
          this.switchForDefaultValue(col);
          if (col.type == 'select') {
            const defaultValue = col.values.filter(v => v.selected);
            if (defaultValue.length > 0) {
              col.value = defaultValue[0].value;
            }
          }
          json = {
            name: (col.name + "-" + element.rows.length),
            value: col.value
          }
        }
      } else {
        let values = JSON.parse(JSON.stringify(col.values));//to keep source as it is
        json = {
          name: (col.name + "-" + element.rows.length),
          values: values,
          checkBoxValidationFlag: false
        }
      }
      jsonArray.push(json)
    });
  }

  deleteRow(event, input, rowIndex) {
    let rows = input.rows;
    let fixedColumnFLag = true;
    for (const col in input.columns) {
      if (input.columns[col].type == 'select' && input.columns[col].multiple)
        fixedColumnFLag = false;
      break;
    }
    if (fixedColumnFLag) {
      if (event.srcElement.checked)
        rows[rowIndex].deleteFlag = "Y";
      else
        rows[rowIndex].deleteFlag = "N";
    } else {
      event.srcElement.checked = false;
    }
  }

  setCheckBoxValidation(tableJson) {
    tableJson.checkBoxValidationFlag = (tableJson.values.filter(e => e.selected).length != 0);
  }

  switchForDefaultValue(json) {
    var d = new Date()
    if (!json.disabled)
      switch (json.type) {
        case 'date': json.value = (json.value == undefined || json.value == '') ? this.datePipe.transform(d, 'yyyy-MM-dd') : json.value;
          break;
        case 'time': json.value = (json.value == undefined || json.value == '') ? this.datePipe.transform(d, 'HH:mm') : json.value;
          break;
        case 'datetime-local': json.value = (json.value == undefined || json.value == '') ? (this.datePipe.transform(d, 'yyyy-MM-dd') + "T" + this.datePipe.transform(d, 'HH:mm')) : json.value;
          break;
        case 'select':
          if (!json.multiple && (json.value == undefined || json.value == '')) {
            let j = json.values.filter(j => j.selected);
            if (j.length > 0) {
              json.value = j[0].value;
            }
          }
          break;
        default: json.value = (json.value == undefined || json.value == '') ? "" : json.value;
          break;
      }
  }

  setDefaultValue(inputField) {
    this.inputField.filter(data => data.formulaCalculation).map(field => field["formulaCalculation"]);
    inputField.forEach(json => {
      if (json.formulaCalculation)
        json.disabled = true
      this.enableCalculate = (json.name === "viewFormula") ? true : false;
      this.switchForDefaultValue(json);
    });
  }

  sendOtp() {
    this.isSendOtp = false;
    this.isInvalidEmail = false;
    const url = "externalApproval/verifyEmailAndSendOTPForForm/" + this.receivedId + "/" + this.onExternalsaveForm.get('email').value;
    this.spinnerFlag = true;
    this.service.getApi(url,this.tenantName).subscribe(response => {
      this.spinnerFlag = false;
      this.isSendOtp = response;
      this.isInvalidEmail = !this.isSendOtp;
    });
  }

  saveData(valid, publishFlag) {
    this.isInvalidOtp = false;
    this.isInvalidComments = false;
    if (publishFlag) {
      const url = "externalApproval/verifyOtpForForm/" + this.receivedId + "/" + this.onExternalsaveForm.get('otp').value;
      this.spinnerFlag = true;
      this.service.getApi(url,this.tenantName).subscribe(response => {
        if (response) {
          if (this.helper.isEmpty(this.onExternalsaveForm.get("comments").value)) {
            this.isInvalidComments = true;
            this.spinnerFlag = false;
          } else {
            this.saveDynamicFormData(valid, publishFlag);
          }
        } else {
          this.isInvalidOtp = true;
          this.spinnerFlag = false;
        }
      });
    } else {
      if (this.helper.isEmpty(this.onExternalsaveForm.get("comments").value)) {
        this.isInvalidComments = true;
      } else {
        this.spinnerFlag = true;
        this.saveDynamicFormData(valid, publishFlag);
      }
    }
  }

  onClickUpdateOrPublish(isPublish) {
    this.isInvalidOtp = false;
    this.isSendOtp = false;
    this.isInvalidEmail = false;
    this.isPublish = isPublish;
    this.onExternalsaveForm.reset();
    this.isInvalidComments = false;
  }

  saveDynamicFormData(valid, publishFlag) {
    this.spinnerFlag = true;
    this.submitted = true;
    let required = false;
    let checkBoxRequired = false;
    let fileRequiredTable = false;
    let checkBoxRequiredTable = false;
    if ((this.dynamicForm.projectEnabledFlag && this.dynamicForm.projectDropDownId == 0) || (this.dynamicForm.cleanRoomFlag && this.dynamicForm.cleanRoomId == 0) ||
      (this.dynamicForm.equipmentFlag && this.dynamicForm.equipmentId == 0)) {
      this.dropDownSelectionRequired = true;
    }
    for (let index = 0; index < this.inputField.length; index++) {
      const element = this.inputField[index];
      if (element.type == "file" && element.required == true) {
        if (element.values == undefined || element.values.length == 0) {
          required = true;
          break;
        }
      }
      if (element.type == "checkbox-group" && element.required == true) {
        if (element.values.filter(e => e.selected).length == 0) {
          if (element.other) {
            if (element.otherSelected) {
              element.value = new Array();
              if (element.otherValue != '')
                element.value.push(element.otherValue);
              else
                checkBoxRequired = true;
            } else {
              checkBoxRequired = true;
              break;
            }
          } else {
            checkBoxRequired = true;
            break;
          }
        } else {
          element.value = element.values.filter(e => e.selected).map(e => e.value);
        }
      }
      if (element.type == 'table') {
        for (let i = 0; i < element.rows.length; i++) {
          let row = element.rows[i];
          if (row.deleteFlag != 'Y') {
            for (let j = 0; j < row.row.length; j++) {
              const data = row.row[j];

              if (element.columns[j].type == "file" && element.columns[j].required) {
                if (data.values == undefined || data.values.length == 0) {
                  fileRequiredTable = true;
                  break;
                }
              }
              if (element.columns[j].type == "checkbox-group" && element.columns[j].required) {
                if (data.values.filter(e => e.selected).length == 0) {
                  element.checkBoxValidationFlag = false;
                  checkBoxRequiredTable = true;
                  break;
                } else {
                  element.checkBoxValidationFlag = true;
                }
              }
            }
          }
        }
      }
    }
    if (!valid || required || checkBoxRequired || fileRequiredTable || checkBoxRequiredTable || this.dropDownSelectionRequired) {
      this.spinnerFlag = false;
      return
    } else {
      let updateFlag = true;
      this.dynamicForm.publishedflag = publishFlag;
      this.dynamicForm.formData = JSON.stringify(this.inputField);
      if (this.dynamicForm.id == 0) {
        updateFlag = false;
      }
      this.dynamicForm.reasonForEdit = this.onExternalsaveForm.get("comments").value;
      this.service.postApi(this.dynamicForm, "externalApproval/saveExternalDynamicFormData/" + this.receivedId,this.tenantName).subscribe(result => {
        this.savemodal.hide();
        if (result.result == "success") {
          let saveOrUpdateText = updateFlag ? 'Updated' : 'Saved';
          swal({
            title: (publishFlag ? (saveOrUpdateText + ' And Published') : saveOrUpdateText + ' Successfully!'),
            text: this.dynamicForm.templateName + ' Record has been ' + (updateFlag ? 'Updated.' : 'Saved.'),
            type: 'success',
            timer: 2000,
            showConfirmButton: false,
            onClose: () => {
              this.ngOnInit();
            }
          });
        } else {
          swal({
            title: 'Error in ' + (updateFlag ? 'Updating!' : 'Saving!'),
            text: this.dynamicForm.templateName + ' Record has not been ' + (updateFlag ? 'Updated' : 'Saved'),
            type: 'error',
            timer: 2000
          });
        }
        this.spinnerFlag = false;
      }, error => {
        this.spinnerFlag = false;
        swal({
          title: 'Error in ' + (updateFlag ? 'Updating' : 'Saving!'),
          text: this.dynamicForm.templateName + ' Record has not been ' + (updateFlag ? 'Updated' : 'Saved'),
          type: 'error',
          timer: 2000
        }
        );
      });
    }
  }

  onFileUpload(event, input, groupedFormName?) {
    input.value = ""
    if (document.getElementById("iframeView" + input.name)) {
      document.getElementById("iframeView" + input.name).remove();
      document.getElementById("#" + input.name).setAttribute("class", "form-group row");
    }
    const filePath = 'IVAL/' + this.externaluserData.organizationOfLoginUser + '/' + this.externaluserData.projectName + '/' + this.externaluserData.projectVersionName + '/' + this.dynamicForm.permissionConstant + '/Attachments/';
    if (!input.values || !input.multiple)
      input.values = new Array();
    if (event.target.files.length != 0) {
      let totalFiles = event.target.files.length;
      for (let index = 0; index < totalFiles; index++) {
        this.spinnerFlag = true;
        let file = event.target.files[index];
        let fileName = file.name;
        this.service.getApi("externalApproval/checkIsValidFileSize/" + file.size,this.tenantName).subscribe(fileRes => {
          if (fileRes) {
            const formData: FormData = new FormData();
            formData.append('file', file, fileName);
            formData.append('filePath', filePath);
            formData.append('extension', fileName.split(".")[fileName.split(".").length - 1]);
            this.service.singleFileUpload(formData).subscribe(resp => {
              let date = Date.now();
              this.service.getCurrentDate(this.externaluserData.organizationOfLoginUser, date,this.tenantName).subscribe(res => {
                var json = { path: resp.path, fileName: fileName, date: date, displayDate: date };
                input.values.unshift(json);
                this.spinnerFlag = false;
              }, error => { this.spinnerFlag = false; });

            }, error => {
              this.spinnerFlag = false;
            })
          } else {
            this.helper.fileSizeWarning(fileName);
            this.spinnerFlag = false;
            this.myInputVariable.nativeElement.value = "";
          }
        })
      }
    }
  }

  deleteUploadedFile(fileList, index, id) {
    fileList.splice(index, 1);
  }

  conditionCheckFull(inputFeild) {
    let conditionJsonForInput = new Array();
    inputFeild.filter(e => e.conditions).forEach(element => {
      conditionJsonForInput.push({ 'input': element.name, 'conditions': element.conditions });
    });
    if (conditionJsonForInput.length > 0) {
      conditionJsonForInput.forEach(element => {
        this.conditionCheck(element.conditions, element.input, inputFeild);
      })
    }
  }

  conditionCheck(conditionList: any[], inputVariableName: string, inputFeilds) {
    let list = conditionList.filter(con => inputVariableName.includes(con.operandOneId) || inputVariableName.includes(con.operandTwoId));
    if (list.length > 0) {
      list.forEach(condition => {
        let result = this.getTheConditionValue(condition, inputFeilds, inputVariableName);
        inputFeilds.forEach(element => {
          if (element.name)
            if (element.name.includes(condition.resultOperandId)) {
              element.value = result['outPutValue'];
              element.color = result['outPutColor'];
            }
        });
      })
    }
  }

  conditionCheckForTableFull(tableId, fullJson, rows) {
    let conditionJsonForInput = new Array();
    if (tableId) {
      let tableJSON = fullJson.filter(e => e.id == tableId)[0];
      tableJSON.columns.filter(e => e.conditions).forEach(element => {
        conditionJsonForInput.push({ 'input': element.name, 'conditions': element.conditions });

      });
    }
    if (conditionJsonForInput.length > 0) {
      conditionJsonForInput.forEach(element => {
        this.conditionCheckForTable(element.conditions, element.input, rows, tableId, fullJson);
      });

    }
  }

  conditionCheckForTable(conditionList: any[], inputVariableName: string, inputFeilds, tableId, fullJson) {
    let list = conditionList.filter(con => inputVariableName.includes(con.operandOneId) || inputVariableName.includes(con.operandTwoId));
    if (list.length > 0) {
      list.forEach(condition => {
        let tableJSON;
        let withInJson: any[] = inputFeilds.map(e => e.name);
        if (tableId) {
          tableJSON = fullJson.filter(e => e.id == tableId)[0];
          withInJson = tableJSON.columns.map(e => e.name);
        }
        //json is there in list itself 
        if (withInJson.includes(condition.resultOperandId)) {
          let result = this.getTheConditionValue(condition, inputFeilds, inputVariableName, fullJson);
          inputFeilds.forEach(element => {
            if (element.name)
              if (element.name.includes(condition.resultOperandId)) {
                element.value = result['outPutValue'];
                element.color = result['outPutColor'];
              }
          });
        } else {
          // we need cumilative result
          if (tableJSON) {
            let result = new Array();
            for (let index = 0; index < tableJSON.rows.length; index++) {
              const element = tableJSON.rows[index];
              result.push(this.getTheConditionValue(condition, element.row, inputVariableName, fullJson));
              let finalResult = { 'outPutValue': condition.defaultValue, 'outPutColor': condition.defaultColor };
              let finalResultList = result.map(e => e.outPutValue);
              if (!finalResultList.includes(condition.defaultValue)) {
                finalResult = result[0];
              }
              fullJson.forEach(element => {
                if (element.name)
                  if (element.name.includes(condition.resultOperandId)) {
                    element.value = finalResult['outPutValue'];
                    element.color = finalResult['outPutColor'];
                  }
              });
            }
          }
        }
      })
    }
  }

  getTheConditionValue(condition: ConditionDTO, inputFeilds, inputName, fullJson?): object {
    let y;
    let x;
    let result;
    switch (condition.type) {
      case 'range':
        x = inputName
        result = this.rangeCalculation(condition, x, inputFeilds, fullJson);
        break;
      case 'comparator':
        inputFeilds.forEach(element => {
          if (element.name && element.name.includes(condition.operandTwoId))
            y = element.value;
          if (element.name && element.name.includes(condition.operandOneId))
            x = element.value;
        });
        if (condition.operandTwoId == 'constant') {
          y = condition.constantValue;
        }
        //out side of range
        if (fullJson) {
          if (!x) {
            let xValue = fullJson.filter(e => e.name && e.name.includes(condition.operandOneId))
            if (xValue.length > 0)
              x = xValue[0].value == '' ? NaN : xValue[0].value;
          }
          if (!y) {
            let yValue = fullJson.filter(e => e.name && e.name.includes(condition.operandTwoId));
            if (yValue.length > 0)
              y = yValue[0].value == '' ? NaN : yValue[0].value;
          }
        }
        result = this.comparatorCalculation(x, y, condition);
        break;
    }
    return result;
  }

  checkInputAndOutPutAreTable(): boolean {
    let result = false;
    return result;
  }

  comparatorCalculation(x: string, y: string, condition: ConditionDTO): object {
    let result = { outPutValue: '', outPutColor: '#ffffff' };
    let outPut = false;
    if (!isNullOrUndefined(x) && !isNullOrUndefined(y) && (x != '' || y != '')) {
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
            if (condition.caseSensitive) {
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
    } else {
      result['outPutValue'] = '';
      result['outPutColor'] = "#ffffff";
      return result;
    }
    if (outPut) {
      result['outPutValue'] = condition.outPutValue;
      result['outPutColor'] = condition.color;
    } else {
      result['outPutValue'] = condition.defaultValue;
      result['outPutColor'] = condition.defaultColor;
    }
    return result;
  }

  rangeCalculation(range: ConditionDTO, rangleToBeCheckFor, list, fullJson?): object {
    let result = { outPutValue: '', outPutColor: '#ffffff' };
    let outPutValue;
    let outPutColor;
    for (let index = 0; index < range.conditionChild.length; index++) {
      const rangeData: ConditionChildDTO = range.conditionChild[index];
      let lowerLimitValue;
      let upperLimitValue;
      let value;
      list.forEach(element => {
        if (element.name.includes(rangeData.lowerLimitValue))
          lowerLimitValue = element.value == '' ? NaN : element.value;
        if (element.name.includes(rangeData.upperLimitValue))
          upperLimitValue = element.value == '' ? NaN : element.value;
        if (element.name.includes(rangleToBeCheckFor))
          value = element.value == '' ? NaN : element.value;
      });
      if (rangeData.lowerLimitValue == 'constant') {
        lowerLimitValue = +rangeData.lowerConstantValue;
      }
      if (rangeData.upperLimitValue == 'constant') {
        upperLimitValue = +rangeData.upperConstantValue;
      }
      //If range is out side of table
      if (fullJson) {
        if (!upperLimitValue) {
          let ulv = fullJson.filter(e => e.name != undefined && e.name.includes(rangeData.upperLimitValue))
          if (ulv.length > 0)
            upperLimitValue = ulv[0].value == '' ? NaN : ulv[0].value;
        }
        if (!lowerLimitValue) {
          let llv = fullJson.filter(e => e.name != undefined && e.name.includes(rangeData.lowerLimitValue));
          if (llv.length > 0)
            lowerLimitValue = llv[0].value == '' ? NaN : llv[0].value;
        }
      }
      if (!isNaN(upperLimitValue) && !isNaN(lowerLimitValue) && !isNaN(value)) {
        value = +value;
        lowerLimitValue = +lowerLimitValue;
        upperLimitValue = +upperLimitValue;
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
      } else {
        outPutValue = '';
        outPutColor = "#ffffff";
      }
    }
    //No result found so set default value 
    if (!outPutValue && !outPutColor) {
      outPutValue = range.defaultValue;
      outPutColor = range.defaultColor;
    }
    result['outPutValue'] = outPutValue;
    result['outPutColor'] = outPutColor;
    return result;
  }
  /*START CALCULATION LOGIC*/
  calculation(list) {
    let listOfCalculation = new Array();
    list.filter(ele => ele.calculations).forEach(element => {
      listOfCalculation.push(element);
    });
    listOfCalculation.sort((a, b) => (+a.id) - (+b.id));
    listOfCalculation.forEach(inputData => {
      if (inputData.calculations) {
        inputData.calculations.forEach(calculation => {
          let y;
          let x;
          list.forEach(element => {
            if (element.name == calculation.operandTwoId) {
              y = element.value;
            }
            if (element.name == calculation.operandOneId) {
              x = element.value;
            }
          });
          if (calculation.operandTwoId == 'constant') {
            y = calculation.operandTwoConstant;
          }
          switch (inputData.type) {
            case 'number': this.numberCalculation(list, calculation, +x, +y);
              break;
            case 'date':
              this.dateCalculation(list, calculation, x, y);
              break;
            case 'datetime-local':
              this.dateTimeCalculation(list, calculation, x, y);
              break;
            case 'time': this.timeCalculation(list, calculation, x, y);
              break;
            case 'hidden': this.numberCalculation(list, calculation, +x, +y);
              break;
            default:
              break;
          }
        });
      }
    })
    this.conditionCheckFull(list);
  }

  calculationOfTableValue(list, tableId, fullJson) {
    let listOfCalculation = new Array();
    if (tableId) {
      let tableJSON = fullJson.filter(e => e.id == tableId)[0];
      tableJSON.columns.filter(ele => ele.calculations).forEach(element => {
        listOfCalculation.push(element);
      });
      fullJson.filter(ele => ele.calculations).forEach(element => {
        listOfCalculation.push(element);
      });
    }
    listOfCalculation.forEach(input => {
      if (input.calculations) {
        input.calculations.forEach(calculation => {
          let y;
          let x;
          list.forEach(element => {
            if (element.name.includes(calculation.operandTwoId))
              y = element.value;
            if (element.name.includes(calculation.operandOneId))
              x = element.value;
          });
          if (calculation.operandTwoId == 'constant') {
            y = calculation.operandTwoConstant;
          }
          if (!x) {
            let single = fullJson.filter(e => e.name != undefined && e.name.includes(calculation.operandOneId))
            if (single.length > 0)
              x = +single[0].value;
          }
          if (!y) {
            let single = fullJson.filter(e => e.name != undefined && e.name.includes(calculation.operandTwoId))
            if (single.length > 0)
              y = +single[0].value;
          }
          switch (input.type) {
            case 'number': this.numberCalculation(list, calculation, +x, +y);
              break;
            case 'date':
              this.dateCalculation(list, calculation, x, y);
              break;
            case 'datetime-local':
              this.dateTimeCalculation(list, calculation, x, y);
              break;
            case 'time': this.timeCalculation(list, calculation, x, y);
              break;
            case 'hidden': this.numberCalculation(list, calculation, +x, +y);
              break;
            default:
              break;
          }
        });
      }
    })
    this.conditionCheckForTableFull(tableId, fullJson, list);
    this.calculation(fullJson);
  }

  numberCalculation(list: any, calculation: any, x: number, y: number) {
    list.forEach(element => {
      if (element.name)
        if (element.name.includes(calculation.finalResultId)) {
          element.value = NaN;
          try {
            if (!isNaN(x) && !isNaN(y)) {
              var fixed = this.helper.getMaxDecimalPoint(x, y);
              switch (calculation.operator) {
                case "addition":
                  element.value = (x + y).toFixed(fixed);
                  break;
                case "subtraction":
                  element.value = (x - y).toFixed(fixed);
                  break;
                case "multiplication":
                  element.value = (x * y).toFixed(fixed);
                  break;
                case "division":
                  element.value = (x / y).toFixed(fixed == 0 ? 4 : fixed);
                  break;
                case "percentage":
                  element.value = (x * (y / 100)).toFixed(fixed);
                  break;
              }
            }
          } catch (error) {
            element.value = 0;
          }
        }
    });
  }

  dateCalculation(list: any, calculation: any, date1: any, date2OrConstant) {
    let finalResult;
    var date = new Date(Date.parse(date1));
    if (calculation.operandTwoId == 'constant') {
      if (calculation.operator == "addition") {
        finalResult = date.setDate(date.getDate() + date2OrConstant);
      } else {
        finalResult = date.setDate(date.getDate() - date2OrConstant);
      }
      finalResult = this.datePipe.transform(finalResult, 'yyyy-MM-dd');
    } else {
      var Difference_In_Time;
      if (calculation.operator == "addition") {
        Difference_In_Time = new Date(Date.parse(date2OrConstant)).getTime() + date.getTime();
      } else {
        Difference_In_Time = date.getTime() - new Date(Date.parse(date2OrConstant)).getTime();
      }
      finalResult = Difference_In_Time / (1000 * 3600 * 24);
    }
    list.forEach(element => {
      if (element.name)
        if (element.name.includes(calculation.finalResultId))
          element.value = finalResult;
    });
  }

  timeCalculation(list: any, calculation: any, time1: any, time2OrConstant: any) {
    let finalResult;
    var time = new Date(1970, 0, 0, time1.split(':')[0], time1.split(':')[1], 0);
    if (calculation.operandTwoId == 'constant') {
      if (calculation.operator == "addition") {
        finalResult = time.setTime(time.getTime() + (time2OrConstant * 60000));
      } else {
        finalResult = time.setTime(time.getTime() - (time2OrConstant * 60000));
      }
      finalResult = this.datePipe.transform(finalResult, 'HH:mm');
    } else {
      if (time2OrConstant) {
        var time2 = new Date(1970, 0, 0, time2OrConstant.split(':')[0], time2OrConstant.split(':')[1], 0);
        var Difference_In_Time;
        if (calculation.operator == "addition") {
          Difference_In_Time = time2.getTime() + time.getTime();
        } else {
          Difference_In_Time = time.getTime() - time2.getTime();
        }
        let diffMinutes = (Difference_In_Time / (60 * 1000)) % 60;
        let diffHours = (Difference_In_Time / (60 * 60 * 1000)) % 24;
        finalResult = ("" + diffHours).split(".")[0] + " hours," + ("" + diffMinutes).split(".")[0] + " minutes ";
      }
    }
    if (finalResult)
      list.forEach(element => {
        if (element.name)
          if (element.name.includes(calculation.finalResultId))
            element.value = finalResult;
      });
  }

  dateTimeCalculation(list: any, calculation: any, x: any, dateTime2OrConstant: any) {
    let finalResult;
    var dateTime = new Date(x);
    if (calculation.operandTwoId == 'constant') {
      if (calculation.operator == "addition") {
        finalResult = dateTime.setTime(dateTime.getTime() + (dateTime2OrConstant * 60000));
      } else {
        finalResult = dateTime.setTime(dateTime.getTime() - (dateTime2OrConstant * 60000));
      }
      finalResult = (this.datePipe.transform(dateTime, 'yyyy-MM-dd') + "T" + this.datePipe.transform(dateTime, 'HH:mm'));
    } else {
      if (dateTime2OrConstant) {
        var dateTime2 = new Date(dateTime2OrConstant);
        var Difference_In_Time;
        if (calculation.operator == "addition") {
          Difference_In_Time = dateTime.getTime() + dateTime2.getTime();
        } else {
          Difference_In_Time = dateTime.getTime() - dateTime2.getTime();
        }
        let diffDays = Difference_In_Time / (24 * 60 * 60 * 1000);
        let diffMinutes = (Difference_In_Time / (60 * 1000)) % 60;
        let diffHours = (Difference_In_Time / (60 * 60 * 1000)) % 24;
        finalResult = ("" + diffDays).split(".")[0] + " days, " + ("" + diffHours).split(".")[0] + " hours," + ("" + diffMinutes).split(".")[0] + " minutes ";
      }
    }
    if (finalResult)
      list.forEach(element => {
        if (element.name)
          if (element.name.includes(calculation.finalResultId))
            element.value = finalResult;
      });
  }
  /*END CALCULATION LOGIC*/

  restValueOfOther(input) {
    input.otherValue = '';
  }

  setCheckedData(formJson, input) {
    input.value = formJson.filter(element => element.selected).map(element => element.value);
  }

  setCheckedAsRadio(formJson, event, value, input?) {
    event.srcElement.checked = true
    if (value == 'govalOther') {
      if (input.other) {
        if (!input.otherSelected) {
          input.otherSelected = true
        }
      }
    } else {
      if (input && input.other) {
        input.otherSelected = false;
        this.restValueOfOther(input);
      }
    }
    formJson.forEach(element => {
      element.selected = false;
      if (element.value == value) {
        element.selected = true;
      }
    });
  }

  reference(list) {
    let listOfReferences = new Array();
    list.filter(ele => ele.references).forEach(element => {
      listOfReferences.push(element);
    });
    listOfReferences.sort((a, b) => (+a.id) - (+b.id));
    listOfReferences.forEach(inputData => {
      if (inputData.references) {
        inputData.references.forEach(referenceElement => {
          let referenceValue = " ";
          list.forEach(jsonElement => {
            referenceElement.referenceId.forEach((refId, index) => {
              if (jsonElement.name == refId) {
                if ("select" === jsonElement.type) {
                  let value = "govalOther" === jsonElement.value ? jsonElement.otherValue : jsonElement.value;
                  if (!this.helper.isEmptyWithoutZeroCheck(value))
                    referenceValue = referenceValue + value + " " + (index != referenceElement.referenceId.length - 1 ? referenceElement.inBetween + " " : "");
                } else if (!this.helper.isEmptyWithoutZeroCheck(jsonElement.value))
                  referenceValue = referenceValue + jsonElement.value + " " + (index != referenceElement.referenceId.length - 1 ? referenceElement.inBetween + " " : "");
                else
                  referenceValue = referenceValue + jsonElement.value;
              }
            });
          });
          list.forEach(jsonElement => {
            if ("table" === jsonElement.type) {
              jsonElement.columns.forEach(e => {
                if (e.name === referenceElement.columnId) {
                  if ("suffix" === referenceElement.referenceType) {
                    e.label = e.dynamicLabel + referenceValue;
                  } else if ("prefix" === referenceElement.referenceType) {
                    e.label = referenceValue + e.dynamicLabel;
                  }
                }
              });
            }
          });
        });
      }
    });
  }

  onlyNumberWithDecimal(event, data) {
    const pattern = /[0-9]+(\.[0-9][0-9][0-9][0-9])?/;
    var char = data + String.fromCharCode(event.charCode);
    if (char.split(".").length > 2 && !/[0-9]/.test(String.fromCharCode(event.charCode))) {
      event.preventDefault();
    }
    if (event.keyCode != 5 && !pattern.test(char)) {
      event.preventDefault();
    }
  }

}