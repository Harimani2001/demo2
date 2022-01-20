import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { RiskAssessmentService } from '../risk-assessment/risk-assessment.service';
import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { Router } from '@angular/router';
import { priorityService } from '../priority/priority.service';
import { UrsService } from '../urs/urs.service';
import { CategoryService } from '../category/category.service';

@Component({
  selector: 'app-table-report',
  templateUrl: './table-report.component.html',
  styleUrls: ['./table-report.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TableReportComponent implements OnInit {
  @Input() docId: string = '';
  riskData: any[] = new Array();
  colorForCritical:any;
  colorForHigh: any;
  colorForMedium: any;
  colorForLow: any;
  ursData: any[] = new Array();
  categoryList: any[] = new Array();
  priorityList: any[] = new Array();
  drapt: number = 0;
  published: number = 0;
  inProgress: number = 0;
  completed: number = 0;
  total: number = 0;
  spinnerFlag: boolean = false;
  priorityDataList: any[] = new Array();
  createMarix: number = 10;
  elements: any;
  matrixLength:number;
  nameForCritical:any;
  nameForHigh: any;
  nameForMedium: any;
  nameForLow: any;
  constructor(public service: RiskAssessmentService, public permissionService: ConfigService, public helper: Helper, public router: Router, public priorityService: priorityService,
    public ursService: UrsService, public categoryService: CategoryService) {

  }

  ngOnInit() {
    this.loadDefalutPriorityDetails();
    this.loadAllRiskData();
    this.loadAllUrsData();
    this.loadAllPriority();
    this.loadAllCategory();
    this.loadDefaultMatrix();
  }

  loadDefalutPriorityDetails() {
    if (this.docId === '113') {
      this.spinnerFlag = true;
      let priorityData: any[] = new Array();
      this.priorityService.loadAllPriority().subscribe(jsonResp => {
        priorityData = jsonResp.result;
        priorityData.forEach(data => {
          switch (data.priorityName) {
            case 'High':
              this.colorForHigh = data.priorityColor;
              this.nameForHigh = data.priorityName;
              break;
            case 'Medium':
              this.colorForMedium = data.priorityColor;
              this.nameForMedium = data.priorityName;
              break;
            case 'Low':
              this.colorForLow = data.priorityColor;
              this.nameForLow = data.priorityName;
              break;
            default:
              switch (data.priorityName) {
                case 'Critical':
                  this.colorForCritical = data.priorityColor;
                  this.nameForCritical = data.priorityName;
                  break;
                case 'Major':
                  this.colorForHigh = data.priorityColor;
                  this.nameForHigh = data.priorityName;
                  break;
                case 'Moderate':
                  this.colorForMedium = data.priorityColor;
                  this.nameForMedium = data.priorityName;
                  break;
                case 'Minor':
                  this.colorForLow = data.priorityColor;
                  this.nameForLow = data.priorityName;
                  break;
                default:
                  break;
              }
              break;
          }
        })
        this.spinnerFlag = false;
      })
    }
  }

  loadAllRiskData() {
    if (this.docId === '113') {
      this.spinnerFlag = true;
      this.service.loadAllRiskData().subscribe(jsonResp => {
        this.riskData = jsonResp.result;
        this.spinnerFlag = false;
      });
    }
  }

  getColorForRiskTable(sev: any, occ: any, size: any) {
    if (size == 3)
      switch (sev) {
        case 3:
          return (occ > 1) ? this.colorForHigh : this.colorForMedium;
        case 2:
          return (occ > 2) ? this.colorForHigh : (occ < 2) ? this.colorForLow : this.colorForMedium;
        case 1:
          return (occ > 2) ? this.colorForMedium : this.colorForLow;
        default:
          break;
      }
    else if (size == 10)
      switch (sev) {
        case 10:
          return this.colorForHigh;
        case 9:
          return this.colorForHigh;
        case 8:
          return (occ > 1) ? this.colorForHigh : this.colorForMedium;
        case 7:
          return (occ > 2) ? this.colorForHigh : this.colorForMedium;
        case 6:
          return (occ > 3) ? this.colorForHigh : (occ < 2) ? this.colorForLow : this.colorForMedium;
        case 5:
          return (occ > 4) ? this.colorForHigh : (occ < 3) ? this.colorForLow : this.colorForMedium;
        case 4:
          return (occ > 5) ? this.colorForHigh : (occ < 4) ? this.colorForLow : this.colorForMedium;
        case 3:
          return (occ > 6) ? this.colorForHigh : (occ < 5) ? this.colorForLow : this.colorForMedium;
        case 2:
          return (occ > 7) ? this.colorForHigh : (occ < 6) ? this.colorForLow : this.colorForMedium;
        case 1:
          return (occ > 8) ? this.colorForHigh : (occ < 7) ? this.colorForLow : this.colorForMedium;
        default:
          break;
      }
    else
      if ( this.matrixLength > 3)
        switch (sev) {
          case 5:
            return  this.colorForCritical ;
          case 4:
            return (occ > 3) ? this.colorForCritical : (occ < 2) ?this.colorForMedium: this.colorForHigh;
          case 3:
            return (occ > 4) ? this.colorForCritical : (occ < 2 ) ? this.colorForLow :(occ == 2)? this.colorForMedium:this.colorForHigh;
          case 2:
            return (occ > 4) ? this.colorForCritical : (occ < 2) ? this.colorForLow :(occ == 4)?this.colorForHigh: this.colorForMedium;
          case 1:
            return (occ > 4) ? this.colorForCritical :(occ < 4) ? this.colorForLow:this.colorForMedium;
          default:
            break;
        }
      else
        switch (sev) {
          case 5:
            return (occ > 1) ? this.colorForHigh : this.colorForMedium;
          case 4:
            return (occ > 2) ? this.colorForHigh : this.colorForMedium;
          case 3:
            return (occ > 3) ? this.colorForHigh : (occ < 2) ? this.colorForLow : this.colorForMedium;
          case 2:
            return (occ > 4) ? this.colorForHigh : (occ < 2) ? this.colorForLow : this.colorForMedium;
          case 1:
            return (occ > 3) ? this.colorForMedium : this.colorForLow;
          default:
            break;
        }
  }

  getRiskCount(severity: any, occurance: any) {
    let length = this.riskData.filter(data => data.severity == severity.toString() && data.probabilityOfOccurance == occurance.toString()).length;
    if (length === 0)
      return '';
    else
      return length;
  }

  getPriority(sev: any, occ: any, size: any) {
    let length = this.riskData.filter(data => data.severity == sev.toString() && data.probabilityOfOccurance == occ.toString()).length;
    if (length > 0) {
      if (size == 3)
        switch (sev) {
          case 3:
            return (occ > 1) ? 'High' : 'Medium';
          case 2:
            return (occ > 2) ? 'High' : (occ < 2) ? 'Low' : 'Medium';
          case 1:
            return (occ > 2) ? 'Medium' : 'Low';
          default:
            break;
        }
      else if (size == 10)
        switch (sev) {
          case 10:
            return 'High';
          case 9:
            return 'High';
          case 8:
            return (occ > 1) ? 'High' : 'Medium';
          case 7:
            return (occ > 2) ? 'High' : 'Medium';
          case 6:
            return (occ > 3) ? 'High' : (occ < 2) ? 'Low' : 'Medium';
          case 5:
            return (occ > 4) ? 'High' : (occ < 3) ? 'Low' : 'Medium';
          case 4:
            return (occ > 5) ? 'High' : (occ < 4) ? 'Low' : 'Medium';
          case 3:
            return (occ > 6) ? 'High' : (occ < 5) ? 'Low' : 'Medium';
          case 2:
            return (occ > 7) ? 'High' : (occ < 6) ? 'Low' : 'Medium';
          case 1:
            return (occ > 8) ? 'High' : (occ < 7) ? 'Low' : 'Medium';
          default:
            break;
        }
      else
      if ( this.matrixLength > 3)
      switch (sev) {
        case 5:
          return (occ > 2) ? this.nameForCritical : this.nameForHigh;
        case 4:
          return (occ > 3) ? this.nameForCritical : (occ < 2) ?this.nameForMedium: this.nameForHigh;
        case 3:
          return (occ > 4) ? this.nameForCritical : (occ < 2 ) ? this.nameForLow :(occ == 2)? this.nameForMedium:this.nameForHigh;
          case 2:
            return (occ > 4) ? this.nameForCritical : (occ < 2) ? this.nameForLow :(occ == 4)?this.nameForHigh: this.nameForMedium;
          case 1:
            return (occ > 4) ? this.nameForCritical :(occ < 4) ? this.nameForLow:this.nameForMedium;
          default:
          break;
      }
    else
        switch (sev) {
          case 5:
            return (occ > 1) ? this.nameForHigh : this.nameForMedium;
          case 4:
            return (occ > 2) ? this.nameForHigh : this.nameForMedium;
          case 3:
            return (occ > 3) ? this.nameForHigh : (occ < 2) ? this.nameForLow : this.nameForMedium;
          case 2:
            return (occ > 4) ? this.nameForHigh : (occ < 2) ? this.nameForLow : this.nameForMedium;
          case 1:
            return (occ > 3) ? this.nameForMedium : this.nameForLow;
          default:
            break;
        }
    } else {
      return '';
    }
  }

  getPopUpData(sev: any, occ: any) {
    this.total = 0;
    this.drapt = 0;
    this.inProgress = 0;
    this.completed = 0;
    this.total = this.riskData.filter(data => data.severity === sev.toString() && data.probabilityOfOccurance === occ.toString()).length;
    this.drapt = this.riskData.filter(data => data.severity === sev.toString() && data.probabilityOfOccurance === occ.toString() && data.status === 'Draft').length;
    this.inProgress = this.riskData.filter(data => data.severity === sev.toString() && data.probabilityOfOccurance === occ.toString() && data.status != 'Completed' && data.status != 'Draft').length;
    this.completed = this.riskData.filter(data => data.severity === sev.toString() && data.probabilityOfOccurance === occ.toString() && data.status === 'Completed').length;
  }

  loadAllCategory() {
    if (this.docId === '107') {
      this.spinnerFlag = true;
      this.categoryService.loadCategory().subscribe(response => {
        let category = response.result;
        if (!this.helper.isEmpty(category)) {
          category.forEach(element => {
            this.categoryList.push(element.categoryName);
          });
        }
        this.spinnerFlag = false;
      });
    }
  }

  loadAllPriority() {
    if (this.docId === '107') {
      this.spinnerFlag = true;
      this.priorityService.loadAllPriority().subscribe(response => {
        this.priorityDataList = response.result;
        if (!this.helper.isEmpty(this.priorityDataList)) {
          this.priorityDataList.forEach(element => {
            this.priorityList.push(element.priorityName);
          });
        }
        this.spinnerFlag = false;
      });
    }
  }

  loadAllUrsData() {
    if (this.docId === '107') {
      this.spinnerFlag = true;
      this.ursService.getAllUsrDetails().subscribe(jsonResp => {
        this.ursData = jsonResp.result;
        this.spinnerFlag = false;
      })
    }
  }

  getColorForUrsTable(priorityName: any) {
    let priorityColor = '';
    this.priorityDataList.forEach(element => {
      if (element.priorityName === priorityName)
        priorityColor = element.priorityColor;
    });
    return priorityColor;
  }

  getUrsCount(priority: any, category: any) {
    let ursLength = this.ursData.filter(data => data.priorityName === priority && data.categoryName === category).length;
    if (ursLength === 0)
      return '';
    else
      return ursLength;
  }

  getUrsPopUpData(prioriry: any, category: any) {
    this.total = 0;
    this.drapt = 0;
    this.inProgress = 0;
    this.completed = 0;
    this.total = this.ursData.filter(data => data.priorityName === prioriry && data.categoryName === category).length;
    this.drapt = this.ursData.filter(data => data.priorityName === prioriry && data.categoryName === category && data.status === 'Draft').length;
    this.inProgress = this.ursData.filter(data => data.priorityName === prioriry && data.categoryName === category && data.status != 'Completed' && data.status != 'Draft').length;
    this.completed = this.ursData.filter(data => data.priorityName === prioriry && data.categoryName === category && data.status === 'Completed').length;
  }

  loadDefaultMatrix() {
    if (this.docId === '113') {
    this.permissionService.HTTPPostAPI("", "risk-assessment/loadDefaultMatrixForRisk").subscribe(resp => {
      if (resp.result == "success" && resp.data.length > 0) {
        this.createMarix = resp.data[0].matrixSize;
        this.matrixLength = resp.data.length;
      } else
        this.createMarix = 10;
      if (this.createMarix == 10)
        this.elements = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {},];
      else if (this.createMarix == 5)
        this.elements = [{}, {}, {}, {}, {}];
      else
        this.elements = [{}, {}, {}];

    });
  }
  }
}
