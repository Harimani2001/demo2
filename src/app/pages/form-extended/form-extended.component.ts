import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ElementRef, ViewChild } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { ConditionChildDTO, ConditionDTO, UserPrincipalDTO } from '../../models/model';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { CommonFileFTPService } from '../common-file-ftp.service';

@Component({
  selector: 'app-form-extended',
  templateUrl: './form-extended.component.html',
  styleUrls: ['./form-extended.component.css']
})

export class FormExtendedComponent implements OnInit {
  @Input() public inputField: any;
  @Input() public documentId: any;
  @Input() public submitted = false;
  @Output() isChildFormValid: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('fileuploaddiv') myInputVariable: ElementRef;
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  public spinnerFlag = false;
  configOfCkEditior = {
    removeButtons: 'Save,Source,Preview,NewPage,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Language,CreateDiv,About,ShowBlocks,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Anchor,spellchecker,Link,Unlink'
  }
  singleFileUploadFlag: boolean = false;

  constructor(public configService: ConfigService, private datePipe: DatePipe, public helper: Helper,
    private commonService: CommonFileFTPService) {
  }

  ngOnInit(): void {
    this.configService.loadCurrentUserDetails().subscribe(resp => {
      this.currentUser = resp;
    });
    this.setDefaultValue(this.inputField)
  }

  public validateChildForm(): boolean {
    if (this.validateForm()) {
      return true;
    } else {
      return false;
    }
  }

  validateForm(): boolean {
    for (let index = 0; index < this.inputField.length; index++) {
      const element = this.inputField[index];
      if (element.required) {
        switch (element.type) {
          case "file":
            if (element.values == undefined || element.values.length == 0) {
              return false;
            }
            break;
          case "checkbox-group":
            if (element.values.filter(e => e.selected).length == 0) {
              element.value = "";
              return false;
            } else {
              element.value = "added";
            }
            break;
          case "radio-group":
            if (element.values.filter(e => e.selected).length == 0) {
              element.value = "";
              return false;
            } else {
              element.value = "added";
            }
            break;
          case "table":
            break;
          default:
            if (element.value == undefined || !element.value) {
              return false;
            }
            break;
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
                  return false;
                }
              }
              if (element.columns[j].type == "checkbox-group" && element.columns[j].required) {
                if (data.values.filter(e => e.selected).length == 0) {
                  element.checkBoxValidationFlag = false;
                  return false;
                } else {
                  element.checkBoxValidationFlag = true;
                  break;
                }
              }
            }
          }
        }
      }
    }
    return true;
  }

  setCheckedData(formJson, checkBoxId) {
    let checkedData = [];
    formJson.forEach(element => {
      if (element.selected)
        checkedData.push(element.value);
    });
    this.inputField.forEach(element => {
      if (element.name == checkBoxId) {
        element.value = checkedData;
      }
    });
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

  onFileUpload(event, input) {
    input.value = ""
    if (document.getElementById("iframeView" + input.name)) {
      document.getElementById("iframeView" + input.name).remove();
      document.getElementById("#" + input.name).setAttribute("class", "form-group row");
    }
    const filePath = 'IVAL/' + this.currentUser.orgId + '/' + this.currentUser.projectName + '/' + this.currentUser.versionName + '/' + this.documentId + '/Attachments/';
    if (!input.values || !input.multiple)
      input.values = new Array();
    if (event.target.files.length != 0) {
      let totalFiles = event.target.files.length;
      for (let index = 0; index < totalFiles; index++) {
        this.spinnerFlag = true;
        let file = event.target.files[index];
        let fileName = file.name;
        this.configService.checkIsValidFileSize(file.size).subscribe(fileRes => {
          if (fileRes) {
            const formData: FormData = new FormData();
            formData.append('file', file, fileName);
            formData.append('filePath', filePath);
            formData.append('extension', fileName.split(".")[fileName.split(".").length - 1]);
            this.commonService.singleFileUpload(formData).subscribe(resp => {
              let date = Date.now();
              this.configService.getCurrentDate(date).subscribe(res => {
                var json = { path: resp.path, fileName: fileName, date: date, displayDate: res };
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
        });
      }
    }
  }

  deleteUploadedFile(fileList, index, id) {
    fileList.splice(index, 1);
    var elementExists = document.getElementById('iframeView' + id);
    if (elementExists)
      elementExists.remove();
  }

  downloadFileOrView(fileName, filePath, viewFlag, id) {
    this.spinnerFlag = true;
    this.commonService.loadFile(filePath).subscribe(resp => {
      let contentType = this.commonService.getContentType(fileName.split(".")[fileName.split(".").length - 1]);
      var blob: Blob = new Blob([resp], { type: contentType });//this.b64toBlob(resp,"");
      if (viewFlag) {
        if (!contentType.match(".pdf")) {
          this.commonService.convertFileToPDF(blob, fileName).then((respBlob) => {
            this.createIFrame(URL.createObjectURL(respBlob), id, fileName);
          }).catch(() => this.spinnerFlag = false);
        } else {
          this.createIFrame(URL.createObjectURL(blob), id, fileName);
        }
      } else {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        this.spinnerFlag = false
      }
    }, error => this.spinnerFlag = false)
  }

  createIFrame(blob_url, id, fileName) {
    var iframe;
    var elementExists = document.getElementById('iframeView' + id);
    if (elementExists)
      elementExists.remove();
    /*Main DIV is created*/
    var mainDiv = document.createElement('div');
    mainDiv.setAttribute('id', 'iframeView' + id);
    mainDiv.setAttribute('class', 'well well-lg form-group');
    var strong = document.createElement('strong')
    strong.innerHTML = fileName;
    mainDiv.appendChild(strong);
    var button = document.createElement('button');
    button.setAttribute('class', 'btn btn-outline-danger btn-danger btn-round');
    button.setAttribute('style', 'float:right;');
    button.innerHTML = "Close";
    button.addEventListener('click', function (event) {
      if (document.getElementById("iframeView" + id)) {
        document.getElementById("iframeView" + id).remove();
        document.getElementById("#" + id).setAttribute("class", "");
      }
    });
    iframe = document.createElement('iframe');
    iframe.setAttribute('height', (window.innerHeight + 500) + 'px');
    iframe.setAttribute('width', (window.innerWidth - 500) + 'px');
    iframe.src = blob_url;
    mainDiv.appendChild(button);
    mainDiv.appendChild(document.createElement('br'));
    mainDiv.appendChild(iframe);
    let find = document.querySelector('#' + id);
    find.appendChild(mainDiv);
    this.spinnerFlag = false;
  }

  onlyNumber(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 5 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
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
        default: json.value = (json.value == undefined || json.value == '') ? "" : json.value;
          break;
      }
  }

  setDefaultValue(inputField) {
    inputField.forEach(json => {
      this.switchForDefaultValue(json);
    });
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

  numberCalculation(list: any, calculation: any, x: number, y: number) {
    list.forEach(element => {
      if (element.name)
        if (element.name.includes(calculation.finalResultId)) {
          element.value = NaN;
          try {
            if (!isNaN(x) && !isNaN(y)) {
              const fixed = this.helper.getMaxDecimalPoint(x, y);
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
                  element.value = (x / y).toFixed(fixed);
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
  /*END CALCULATION LOGIC*/

  // --------------------Condition Check-----------------------------//
  conditionCheckFull(inputFeild) {
    let conditionJsonForInput = new Array();
    // Add existing condition
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
          if (element.name != undefined && element.name.includes(condition.operandTwoId))
            y = element.value;
          if (element.name != undefined && element.name.includes(condition.operandOneId))
            x = element.value;
        });
        if (condition.operandTwoId == 'constant') {
          y = condition.constantValue;
        }
        //out side of range
        if (fullJson) {
          if (!x) {
            let xValue = fullJson.filter(e => e.name != undefined && e.name.includes(condition.operandOneId))
            if (xValue.length > 0)
              x = xValue[0].value == '' ? NaN : xValue[0].value;
          }
          if (!y) {
            let yValue = fullJson.filter(e => e.name != undefined && e.name.includes(condition.operandTwoId));
            if (yValue.length > 0)
              y = yValue[0].value == '' ? NaN : yValue[0].value;
          }
        }
        result = this.comparatorCalculation(x, y, condition);
        break;
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

  comparatorCalculation(x: string, y: string, condition: ConditionDTO): object {
    let result = { outPutValue: '', outPutColor: '#ffffff' };
    let outPut = false;
    if (!isNullOrUndefined(x) && !isNullOrUndefined(y) && (x != '' || y != '')) {
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
  /**Add table Things */
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
                "createdBy": this.currentUser.username,
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
            "createdBy": this.currentUser.username,
            "createdTime": Date.now(),
            "id": 0,
            "deleteFlag": "N",
            'order': element.rows.length
          }
          element.rows.push(jsonObject);
        }
      }
      this.submitted = true;
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

  restValueOfOther(input) {
    input.otherValue = '';
  }

}
