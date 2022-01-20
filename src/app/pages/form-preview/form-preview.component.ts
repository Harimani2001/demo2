import { Component, Input, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ExpressionDTO, ConditionDTO, ConditionChildDTO } from '../../models/model';
import { Helper } from '../../shared/helper';

@Component({
  selector: 'app-form-preview',
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.css']
})
export class FormPreviewComponent implements AfterViewInit {

  @Input() inputField: any[];
  expressionBuilder: any[] = new Array<ExpressionDTO>();
  conditionBuilder: any[] = new Array<ConditionDTO>();
  expressionDropDownFirst: any[] = new Array();
  expressionDropDownSecond: any[] = new Array();
  expressionDropDownThird: any[] = new Array();
  configOfCkEditiorPreview = {
    removeButtons: 'Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,find,selection,spellchecker,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Bold,Italic,Underline,Strike,Subscript,Superscript,CopyFormatting,RemoveFormat,list,indent,blocks,align,bidi,NumberedList,BulletedList,Outdent,Indent,Blockquote,CreateDiv,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,Format,Font,FontSize,TextColor,BGColor,ShowBlocks,About',
    readOnly: true
  }
  @ViewChild('formulaDisplay') formulaDisplay: ElementRef;
  viewFormulaArr: any[] = new Array();
  @ViewChild('formula') formula: ElementRef;
  constructor(public helper: Helper, private renderer: Renderer2) {
  }
  ngAfterViewInit(): void {
    if (this.inputField) {
      this.createDropDownForExpression(this.inputField);
      this.resetTheExpressionForEdit(this.inputField);
      this.resetConditionForEdit(this.inputField);
      this.displayFormula(this.inputField);
    }
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

  onConditionTypeChange(condition: ConditionDTO, inputFeild: any[]) {
    let conditionDropDownFirst = new Array();
    let conditionDropDownThird = new Array();

    switch (condition.type) {
      case 'comparator':
        inputFeild.forEach(element => {
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
        inputFeild.forEach(element => {
          if (element.type == 'number' || element.type == 'hidden') {
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

  createDropDownForExpression(inputFeild: any[]) {
    this.expressionDropDownThird = new Array();
    this.expressionDropDownSecond = new Array();
    this.expressionDropDownFirst = new Array();
    inputFeild.forEach(element => {
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

  displayFormula(inputField:any[]) {
    inputField.forEach((item, index) => {
      if (item.name === "viewFormula") {
        this.viewFormulaArr = item.viewFormulaArr;
        this.viewFormula();
      }
    });
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

}
