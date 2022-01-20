import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { RiskAssessment, JsonResponse, MatrixDTO } from '../../../models/model';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';
import { Helper } from '../../../shared/helper';
import { RiskAssessmentService } from '../risk-assessment.service';
import swal from 'sweetalert2';
import { UrsService } from '../../urs/urs.service';
import { IOption } from '../../../../../node_modules/ng-select';
import { LookUpService } from '../../LookUpCategory/lookup.service';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { FormExtendedComponent } from '../../form-extended/form-extended.component';
import { MasterControlService } from '../../master-control/master-control.service';
import { riskAssessment } from '../../../shared/constants';
import { SpecificationMasterService } from '../../specification-master/specification-master.service';
import { ConfigService } from '../../../shared/config.service';

@Component({
  selector: 'app-add-risk-assessment',
  templateUrl: './add-risk-assessment.component.html',
  styleUrls: ['./add-risk-assessment.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AddRiskAssessmentComponent implements OnInit {
  @ViewChild('formExtendedId') private formExtendedComponent: FormExtendedComponent;
  @ViewChild('ursAndSpecificationModal') private ursAndSpecificationModal: any;
  @ViewChild('mydatatable') table: any;
  @ViewChild('selectDataTable') selectDataTable: any;
  filterQuery = '';
  public inputField: any = [];
  public spinnerFlag = false;
  modal: RiskAssessment = new RiskAssessment();
  riskPriorityNoteFlag: boolean = false;
  probabilityOfOc: number;
  Severity: number;
  class: number;
  Detectabilty: number;
  priority: number;
  loading: boolean = false;
  response: JsonResponse;
  submitted: boolean = false;
  valadationMessage: string;
  errorMessage: string;
  receivedId: string;
  simpleOption: Array<IOption> = new Array<IOption>();
  selectedUrsIds: any[] = new Array();
  selectedSpecUrsId:any[]=new Array();
  selectedSPIds: any[] = new Array();
  selectedUrsDetails: any[] = new Array();
  isLoading: boolean = false;
  probabilityRequired: boolean = true;
  severityRequired: boolean = true;
  detectabilityRequired: boolean = true;
  Detectabiltydata: any;
  riskProbability: any[] = new Array();
  riskSeverity: any[] = new Array();
  riskPriority: any[] = new Array();
  riskDetectability: any[] = new Array();
  ursList: any[] = new Array();
  tempNumber: number = 0;
  data: any[] = new Array();
  ursIdsForView: any[] = new Array();
  validateUrs: boolean = false;
  public simpleOptionSpecification: Array<IOption> = new Array<IOption>();
  createMarix: number = 10;
  matrixList: MatrixDTO[] = new Array();
  ursAndSpecList: any[] = new Array();
  ursDetailedView :boolean;
  riskConstants:riskAssessment = new riskAssessment();
  failTestCaseId=0;
  backURL:any='/riskAssessment';
  rangePError:string="";
  rangeSError:string="";
  rangeVError:string="";
  constructor(public spService: SpecificationMasterService, private comp: AdminComponent, public service: RiskAssessmentService, public ursService: UrsService,
    public router: Router, public helper: Helper, private route: ActivatedRoute, public lookUpService: LookUpService,
    private masterControlService: MasterControlService, public config: ConfigService) {

    this.masterControlService.loadJsonOfDocumentIfActive(this.helper.RISK_ASSESSMENT_VALUE).subscribe(res => {
      if (res != null)
        this.inputField = JSON.parse(res.jsonStructure);
    });
  }

  ngOnInit() {
    this.loadall();
    this.loadAllPriorityDetails();
    this.service.loadRiskLookupValues("RPNProbability").subscribe(resp => {
      if (resp.result === this.helper.SUCCESS_RESULT_MESSAGE)
        this.riskProbability = resp.response;
    });
    this.service.loadRiskLookupValues("RPNSeverity").subscribe(resp => {
      if (resp.result === this.helper.SUCCESS_RESULT_MESSAGE)
        this.riskSeverity = resp.response;
    });
    this.service.loadRiskLookupValues("RPNDetectability").subscribe(resp => {
      if (resp.result === this.helper.SUCCESS_RESULT_MESSAGE)
        this.riskDetectability = resp.response;
    });
    this.service.loadRiskLookupValues("RPNPriority").subscribe(resp => {
      if (resp.result === this.helper.SUCCESS_RESULT_MESSAGE)
        this.riskPriority = resp.response;
    });
    this.comp.setUpModuleForHelpContent(this.helper.RISK_ASSESSMENT_VALUE);
    this.loadDefaultMatrix();

    setTimeout(() => {
      $('#riskFActor').focus();
    }, 600);
  }

  loadUrsAndSpecDetails() {
    this.spinnerFlag = true;
    this.ursService.getUrsAndSpecForProject().subscribe(jsonResp => {
      this.ursAndSpecList = jsonResp.result;

      if (this.selectedSPIds) {
        this.ursAndSpecList.forEach(row => {
          row.childList.filter(f => (this.selectedSPIds.includes(f.id))).forEach(element => element.selected = true);
        })
        this.ursAndSpecList.forEach(row => {
          row.childList.forEach(data => {
            if (data.selected) {
              if (!this.ursIdsForView.includes(row.id))
                this.ursIdsForView = [...this.ursIdsForView, row.id];
            }
          });
        })
        this.ursService.getSelectedUrsAndSpecAndRiskDetails({ "ursIds": this.selectedUrsIds, "specIds": this.selectedSPIds, "riskIds": [] }).subscribe(resp => {
          this.selectedUrsDetails = resp.result;
          this.spinnerFlag = false;
        });
      }
    }, err => { this.spinnerFlag = false; });
  }

  selectURS(urs) {
    this.ursAndSpecList.filter(f => f.id == urs.id).forEach(data => {
      urs.selected ? (data.selected = false) : (data.selected = true);
    })
  }

  selectSpec(spec) {
    let isSelected= spec.selected;
    this.ursAndSpecList.forEach(row => {
      row.childList.filter(f => f.id == spec.id).forEach(data => {
        isSelected  ? (data.selected = false) : (data.selected = true);
      });
    })
  }

  onCloseUrsAndSpecPopup(flag) {
    let specList =new Array();
    if (flag) {
      this.ursIdsForView  = new Array();
      this.selectedSPIds  = new Array();
      this.selectedUrsIds = this.ursIdsForView = this.ursAndSpecList.filter(f => f.selected).map(m => m.id);
      this.ursAndSpecList.forEach(row => {
        specList.push(...row.childList);
        row.childList.forEach(data => {
          if (data.selected) {
            this.selectedSPIds.push(data.id);
          }
        });
      })
      this.selectedSpecUrsId=specList.filter(s=>this.selectedSPIds.includes(s.id)).map(s=>s.ursId);
    } else {
      this.ursAndSpecList.filter(f => (!this.selectedUrsIds.includes(f.id))).forEach(element => element.selected = false);
      this.ursAndSpecList.forEach(row => {
        specList.push(...row.childList);
        row.childList.filter(f => (!this.selectedSPIds.includes(f.id))).forEach(element => element.selected = false);
      })
      this.selectedSpecUrsId=specList.filter(s=>this.selectedSPIds.includes(s.id)).map(s=>s.ursId);
    }

    this.ursService.getSelectedUrsAndSpecAndRiskDetails({ "ursIds": this.selectedUrsIds, "specIds": this.selectedSPIds, "riskIds": [] }).subscribe(resp => {
      this.selectedUrsDetails = resp.result;
    });
    this.ursViewIdSet();
    this.ursAndSpecificationModal.hide();
  }

  ursViewIdSet(){
    this.ursIdsForView = new Array();
    this.ursIdsForView.push(... this.selectedUrsIds);
    this.ursIdsForView.push(...this.selectedSpecUrsId);
    this.ursIdsForView = this.ursIdsForView.filter((value, index, self) => self.indexOf(value) === index);
    this.validateUrs = !(this.ursIdsForView && this.ursIdsForView.length > 0);
  }

  openSuccessUpdateSwal(formIsValid) {
    if (formIsValid || this.modal.residualFlag) {
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
            this.onsubmit(true, userRemarks);
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
  }

  onsubmit(formIsValid, userRemarks?) {
    if (!this.helper.isEmpty(this.selectedUrsIds) || !this.helper.isEmpty(this.selectedSPIds)) {
      if (this.modal.probabilityOfOccurance == 0) {
        this.probabilityRequired = false;
        formIsValid = false;
      } else {
        this.probabilityRequired = true;
      }
      if (this.modal.detectability == 0) {
        this.detectabilityRequired = false;
        formIsValid = false;
      } else {
        this.detectabilityRequired = true;
      }
      if (this.modal.severity == 0) {
        this.severityRequired = false;
        formIsValid = false;
      } else {
        this.severityRequired = true;
      }
      if (formIsValid && this.formExtendedComponent.validateChildForm()) {
        if (this.modal.probabilityOfOccurance != 0 && this.modal.detectability != 0 && this.modal.severity != 0) {
          this.isLoading = true;
          this.spinnerFlag = true;
          this.modal.ursList = this.selectedUrsIds;
          this.modal.jsonExtraData = JSON.stringify(this.inputField);
          this.modal.isDefault = "false"
          if(this.failTestCaseId){
            this.modal.failTestCaseId=this.failTestCaseId;
          }
          if (this.receivedId !== undefined) {
            this.modal.id = + this.receivedId;
          } else {
            this.modal.id = 0;
          }
          this.modal.userRemarks = userRemarks;
          this.modal.specificationIds = this.selectedSPIds;
          this.service.create(this.modal).subscribe(jsonResp => {
            let responseMsg: string = jsonResp.result;
            if (responseMsg === "success") {
              this.loading = false;
              this.spinnerFlag = false;
              swal({
                title: 'success', type: 'success', timer: this.helper.swalTimer,
                text: this.receivedId?'Risk Assessment updated successfully': 'Risk Assessment saved successfully',
                showConfirmButton: false,
                onClose: () => {
                  if (!this.backURL) {
                    this.backURL = '/riskAssessment';
                  }
                  this.router.navigate([this.backURL]);
                }
              });
            } else {
              this.isLoading = false;
              this.spinnerFlag = false;
              this.submitted = false;
              this.valadationMessage = responseMsg;
              swal({
                title: 'error', text: 'Error occured',
                type: 'error', timer: this.helper.swalTimer, showConfirmButton: false
              })
            }
          },
            (err) => {
              this.isLoading = false;
              this.spinnerFlag = false;
              swal({
                title: 'error', text: 'Error occured',
                type: 'error', timer: this.helper.swalTimer, showConfirmButton: false
              })
            });
        } else {
          this.loading = false;
          this.spinnerFlag = false;
          this.submitted = true;
          return;
        }
      }
      else {
        this.loading = false;
        this.spinnerFlag = false;
        this.submitted = true;
        return;
      }
    } else {
      this.validateUrs = true;
      this.submitted = true;
    }
  }

  publishData() {
    this.spinnerFlag = true;
    this.modal.publishedflag = true;
    let data = [];
    data.push(this.modal);
    this.service.publishRiskAssessment(data).subscribe(result => {
      this.spinnerFlag = false;
      this.router.navigate(["/riskAssessment"]);
    });
  }

  loadAllPriorityDetails() {
    this.service.loadAllPriority().subscribe(response => {
      if (response.result != null)
        this.data = response.result;
    })
  }

  loadall() {
    this.ursService.getUsrListForProject().subscribe(jsonResp => {
      this.spinnerFlag = true;
      this.ursList = jsonResp.result;
      this.simpleOption = jsonResp.result.map(option => ({ value: +option.id, label: option.ursCode }));
      this.receivedId = this.route.snapshot.params["id"];
      if (this.receivedId) {
        this.service.edit(this.receivedId).subscribe(jsonResp => {
          this.modal = jsonResp.result;
          
          if (jsonResp.result.jsonExtraData != null && jsonResp.result.jsonExtraData != '[]')
            this.inputField = JSON.parse(jsonResp.result.jsonExtraData);

          this.Severity = Number(this.modal.severity);
          this.priority = Number(this.modal.priority);
          this.getColor(this.priority);
          this.Detectabilty = Number(this.modal.detectability);
          this.probabilityOfOc = Number(this.modal.probabilityOfOccurance);
          this.Detectabiltydata = Number(this.modal.detectability);

          this.selectedUrsIds = this.ursIdsForView = jsonResp.result["selectedUrsIds"].map(d => +d);
          this.ursAndSpecList.filter(f => (this.selectedUrsIds.includes(f.id))).forEach(element => element.selected = true);

          this.selectedSPIds = jsonResp.result["specificationIds"].map(d => +d);
          this.ursAndSpecList.forEach(row => {
            row.childList.filter(f => (this.selectedSPIds.includes(f.id))).forEach(element => element.selected = true);
          })

          this.ursAndSpecList.forEach(row => {
            row.childList.forEach(data => {
              if (data.selected && !this.ursIdsForView.includes(row.id)) {
                this.ursIdsForView = [...this.selectedUrsIds, row.id];
              }
            });
          })
          this.ursService.getSelectedUrsAndSpecAndRiskDetails({ "ursIds": this.selectedUrsIds, "specIds": this.selectedSPIds, "riskIds": [] }).subscribe(resp => {
            this.selectedUrsDetails = resp.result;
          });
          this.csscal('rangeV', this.modal.detectability);
          this.csscal('rangeS', this.modal.severity);
          this.csscal('rangeP', this.modal.probabilityOfOccurance);

          this.csscal('rangeRV', this.modal.residualDetetablity);
          this.csscal('rangeRS', this.modal.residualServerity);
          this.csscal('rangeRP', this.modal.residualProbability);
          this.spinnerFlag = false;
        }, err => {
          this.spinnerFlag = false;
        });
      } else {
        this.modal.detectability = 0;
        this.modal.probabilityOfOccurance = 0;
        this.modal.severity = 0;

        this.modal.residualDetetablity = 0;
        this.modal.residualProbability = 0;
        this.modal.residualServerity = 0;
      }


      this.route.queryParams.subscribe(query => {
        let ursId = query.ursForRisk;
        if (ursId) {
          this.selectedUrsIds.push(...ursId.map(u=>+u)); 
          this.ursIdsForView.push(...ursId.map(u=>+u));
        }
        let specId = query.specForRisk;
        if (specId) {
          this.selectedSPIds.push(...specId.map(u=>+u));
        }
        if(query.testCaseId){
          this.failTestCaseId=query.testCaseId;
          this.modal.failTestCaseCode= query.testCaseCode;
          
        }
         if(query.status)
        this.backURL=query.status;
      
      });
      this.loadUrsAndSpecDetails();
      this.spinnerFlag = false;
    },
      err => {
      });
  }

  csscal(id, value) {
    this.rangePError="";
    this.rangeSError="";
    this.rangeVError="";
    if(value > 0 && value <=this.createMarix){
      var rangeV = document.getElementById(id),
      newValue = Number((value - 1) * 100 / (this.createMarix - 1)),
      newPosition = this.createMarix - (newValue * 0.2);
      rangeV.innerHTML = `<span>${value}</span>`;
      rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`;
    }else{
      if("rangeP" === id){
        this.rangePError="Probability of occurance must between 1 to "+this.createMarix;
      }else if("rangeS" === id){
        this.rangeSError="Severity must between 1 to "+this.createMarix;
      }else if("rangeV" === id){
        this.rangeVError="Detectability must between 1 to "+this.createMarix;
      }
    }
  }

  rpn(s, p, d) {
    if (s != undefined && p != undefined && d != undefined) {
      this.modal.rpn = 0;
      this.modal.rpn = s * p * d;
    }
  }

  // 10*10 priority calculatuon
  rpnCalculation() {
    this.modal.priority=undefined;
    if (this.modal.probabilityOfOccurance != undefined && this.modal.severity != undefined && this.modal.detectability != undefined) {
      if(this.modal.probabilityOfOccurance > 0 && this.modal.probabilityOfOccurance <=this.createMarix && this.modal.severity > 0 && this.modal.severity <=this.createMarix && this.modal.detectability > 0 && this.modal.detectability <=this.createMarix){
          this.modal.rpn = 0;
          this.modal.critical = 0;
          this.modal.rpn = Number(this.modal.probabilityOfOccurance) * Number(this.modal.severity) * Number(this.modal.detectability);
          this.modal.critical = Number(this.modal.probabilityOfOccurance) * Number(this.modal.severity);
          if (this.modal.rpn > 320) {
            this.modal.priority = 3;
          } else if (this.modal.rpn < 321 && this.modal.rpn > 63) {
            this.modal.priority = 2;
          } else if (this.modal.rpn < 64 && this.modal.rpn != 0) {
            this.modal.priority = 1;
          }
          if ((this.modal.rpn < 320) && (this.modal.severity > 8 || this.modal.probabilityOfOccurance > 8)) {
            this.modal.priority = 3;
            if (this.modal.rpn != 0)
              this.riskPriorityNoteFlag = true;
          } else {
            this.riskPriorityNoteFlag = false;
          }
          if (this.modal.severity > 8 || this.modal.probabilityOfOccurance > 8) {
            this.modal.priority = 3;
          }
      }
    }
    if (this.modal.probabilityOfOccurance == 0) {
      this.probabilityRequired = false;
    } else {
      this.probabilityRequired = true;
    }
    if (this.modal.detectability == 0) {
      this.detectabilityRequired = false;
    } else {
      this.detectabilityRequired = true;
    }
    if (this.modal.severity == 0) {
      this.severityRequired = false;
    } else {
      this.severityRequired = true;
    }
  }

  // 3*3 priority calculatuon
  rpnCalculationMatrix() {
    this.modal.priority=undefined;
    if (this.modal.probabilityOfOccurance != undefined && this.modal.severity != undefined && this.modal.detectability != undefined) {
      if(this.modal.probabilityOfOccurance > 0 && this.modal.probabilityOfOccurance <=this.createMarix && this.modal.severity > 0 && this.modal.severity <=this.createMarix && this.modal.detectability > 0 && this.modal.detectability <=this.createMarix){
        this.modal.rpn = 0;
        this.modal.critical = 0;
        this.modal.rpn = Number(this.modal.probabilityOfOccurance) * Number(this.modal.severity) * Number(this.modal.detectability);
        this.modal.critical = Number(this.modal.probabilityOfOccurance) * Number(this.modal.severity);
        if (this.modal.rpn < 5 && this.modal.rpn != 0) {
          this.modal.priority = 1;
        } else if (this.modal.rpn > 5 && this.modal.rpn < 10) {
          this.modal.priority = 2;
        } else if (this.modal.rpn > 8) {
          this.modal.priority = 3;
        }
        if (this.modal.detectability == 3 && this.modal.critical == 1) {
          this.modal.priority = 2;
        }
        if (this.modal.detectability == 3 && this.modal.critical == 3) {
          this.modal.priority = 3;
        }
        if (this.modal.detectability == 3 && this.modal.critical == 9) {
          this.modal.priority = 3;
        }
      }
    }
    if (this.modal.probabilityOfOccurance == 0) {
      this.probabilityRequired = false;
    } else {
      this.probabilityRequired = true;
    }
    if (this.modal.detectability == 0) {
      this.detectabilityRequired = false;
    } else {
      this.detectabilityRequired = true;
    }
    if (this.modal.severity == 0) {
      this.severityRequired = false;
    } else {
      this.severityRequired = true;
    }
  }

  // 5*5 priority calculatuon
  rpnCalculationMatrixFor5x5() {
    this.modal.priority=undefined;
    if (this.modal.probabilityOfOccurance != undefined && this.modal.severity != undefined && this.modal.detectability != undefined) {
      if(this.modal.probabilityOfOccurance > 0 && this.modal.probabilityOfOccurance <=this.createMarix && this.modal.severity > 0 && this.modal.severity <=this.createMarix && this.modal.detectability > 0 && this.modal.detectability <=this.createMarix){
        this.modal.rpn = 0;
        this.modal.critical = 0;
        this.modal.rpn = Number(this.modal.probabilityOfOccurance) * Number(this.modal.severity) * Number(this.modal.detectability);
        this.modal.critical = Number(this.modal.probabilityOfOccurance) * Number(this.modal.severity);
        for (let index = 0; index < this.matrixList.length; index++) {
          if (this.modal.rpn <= this.matrixList[index].max && this.modal.rpn >= this.matrixList[index].min && this.modal.rpn != 0) {
            this.modal.priority = Number(this.riskPriority.filter(f => f.value == this.matrixList[index].type).map(m => m.key));
          }
        }
      }
    }
    if (this.modal.probabilityOfOccurance == 0) {
      this.probabilityRequired = false;
    } else {
      this.probabilityRequired = true;
    }
    if (this.modal.detectability == 0) {
      this.detectabilityRequired = false;
    } else {
      this.detectabilityRequired = true;
    }
    if (this.modal.severity == 0) {
      this.severityRequired = false;
    } else {
      this.severityRequired = true;
    }
  }

  setProbOfOcc(data) {
    this.probabilityOfOc = Number(data);
    if (Number(data) != 2) {
      this.calculationChanges(Number(data));
      this.probabilityOfOc = this.tempNumber;
    }
    this.rpn(this.Severity, this.probabilityOfOc, this.Detectabiltydata);
    if (this.probabilityOfOc != 0 || this.probabilityOfOc != null || this.Severity != 0 || this.Severity != null) {
      this.riskassessmentmatrixclass()
    }
    if (this.class != 0 || this.class != null || this.Detectabilty != 0 || this.Detectabilty != null)
      this.riskassessmentmatrixpriority();
  }

  calculationChanges(data: number) {
    if (data == 1) {
      this.tempNumber = 3
    } if (data == 3) {
      this.tempNumber = 1
    }
  }

  setSeverity(data) {
    this.Severity = Number(data);
    if (Number(data) != 2) {
      this.calculationChanges(Number(data));
      this.Severity = this.tempNumber;
    }
    this.rpn(this.Severity, this.probabilityOfOc, this.Detectabiltydata);
    if (this.probabilityOfOc != 0 || this.probabilityOfOc != null || this.Severity != 0 || this.Severity != null) {
      this.riskassessmentmatrixclass()
    }
    if (this.class != 0 || this.Detectabilty != 0) {
      this.riskassessmentmatrixpriority();
    }
  }

  setDetecatabily(data) {
    this.Detectabiltydata = Number(data)
    this.rpn(this.Severity, this.probabilityOfOc, this.Detectabiltydata);
    this.Detectabilty = data;
    if (this.probabilityOfOc != 0 || this.probabilityOfOc != null || this.Severity != 0 || this.Severity != null) {
      this.riskassessmentmatrixclass()
    }
    if (this.priority != 0 || this.Detectabilty != 0 || this.priority != null || this.Detectabilty != null) {
      this.riskassessmentmatrixpriority();
    }
  }

  //priority
  riskassessmentmatrixpriority() {
    let riskclass = Number(this.class);
    switch (riskclass) {
      case 1:
        if (this.Detectabilty == 1) {
          this.priority = 2;
        }
        if (this.Detectabilty == 2) {
          this.priority = 1;
        }
        if (this.Detectabilty == 3) {
          this.priority = 1;
        }
        this.modal.priority = this.priority;
        break;
      case 2:
        if (this.Detectabilty == 1) {
          this.priority = 3;
        }
        if (this.Detectabilty == 2) {
          this.priority = 2;
        }
        if (this.Detectabilty == 3) {
          this.priority = 1;
        }
        this.modal.priority = this.priority;
        break;

      case 3:
        if (this.Detectabilty == 1) {
          this.priority = 3;
        }
        if (this.Detectabilty == 2) {
          this.priority = 3;
        }
        if (this.Detectabilty == 3) {
          this.priority = 2;
        }
        this.modal.priority = this.priority;
        break;
      default:
        break;
    }
  }

  //class
  riskassessmentmatrixclass() {
    let probabilityOfOc = this.probabilityOfOc;
    switch (probabilityOfOc) {
      case 1:
        if (this.Severity == 1) {
          this.class = 1;
        }
        if (this.Severity == 2) {
          this.class = 1;
        }
        if (this.Severity == 3) {
          this.class = 2;
        }
        this.modal.riskclass = this.class;
        break;
      case 2:
        if (this.Severity == 1) {
          this.class = 1;
        }
        if (this.Severity == 2) {
          this.class = 2;
        }
        if (this.Severity == 3) {
          this.class = 3;
        }
        this.modal.riskclass = this.class;
        break;
      case 3:
        if (this.Severity == 1) {
          this.class = 2;
        }
        if (this.Severity == 2) {
          this.class = 3;
        }
        if (this.Severity == 3) {
          this.class = 3;
        }
        this.modal.riskclass = this.class;
        break;
      default:
        break;
    }
  }

  public getColor(data: any) {
    let priorityName: any;
    let returnColor: any = '';
    let filteredData: any;

    priorityName = String(this.riskPriority.filter(f => f.key == data ).map(m => m.value));
       
    if (priorityName != undefined)
      filteredData = this.data.filter(res => priorityName == res.priorityName);
    if (!this.helper.isEmpty(filteredData))
      filteredData.forEach(element => {
        returnColor = element.priorityColor;
      });
    return returnColor;
  }

  /**
  * @param flag => view or download
  * @param extention =>doc/docx
  */
  documentPreview(flag, extention) {
    this.spinnerFlag = true;
    this.modal.downloadDocType = extention;
    this.service.loadPreviewDocument(this.modal).subscribe(resp => {
      this.spinnerFlag = false;
      if (resp != null) {
        this.comp.previewByBlob(this.modal.assessmentCode + '.' + extention, resp, flag, 'Risk Assessment Preview');
      }
    }, err => this.spinnerFlag = false);
  }

  loadMultipleSelectUrsAndSpec() {
    this.ursAndSpecList.forEach(data => data.selected = this.selectedUrsIds.includes(data.id) ? true : false);
    this.ursAndSpecList.forEach(row => {
      row.childList.forEach(data => data.selected = this.selectedSPIds.includes(data.id) ? true : false);
    });
    this.ursAndSpecificationModal.show();
    this.filterQuery = '';
  }

  loadDefaultMatrix() {
    this.config.HTTPPostAPI("", "risk-assessment/loadDefaultMatrixForRisk").subscribe(resp => {
      if (resp.result == "success" && resp.data.length > 0) {
        this.createMarix = resp.data[0].matrixSize;
        this.matrixList = resp.data;
      }
    });
  }

  toggleExpandRow(row) {
    this.selectDataTable.rowDetail.toggleExpandRow(row);
  }

  residualrpnCalculation() {
    if (this.modal.residualProbability != undefined && this.modal.residualServerity != undefined && this.modal.residualDetetablity != undefined) {
      this.modal.residualRpn = 0;
      this.modal.residualCritical = 0;
      this.modal.residualRpn = Number(this.modal.residualProbability) * Number(this.modal.residualServerity) * Number(this.modal.residualDetetablity);
      this.modal.residualCritical = Number(this.modal.residualProbability) * Number(this.modal.residualServerity);
      if (this.modal.residualRpn > 320) {
        this.modal.residualPriority = 3;
      } else if (this.modal.residualRpn < 321 && this.modal.residualRpn > 63) {
        this.modal.residualPriority = 2;
      } else if (this.modal.residualRpn < 64 && this.modal.residualRpn != 0) {
        this.modal.residualPriority = 1;
      }
      if ((this.modal.residualRpn < 320) && (this.modal.residualServerity > 8 || this.modal.residualProbability > 8)) {
        this.modal.residualPriority = 3;
        if (this.modal.residualRpn != 0)
          this.riskPriorityNoteFlag = true;
      } else {
        this.riskPriorityNoteFlag = false;
      }
      if (this.modal.residualServerity > 8 || this.modal.residualProbability > 8) {
        this.modal.residualPriority = 3;
      }
    }
    if (this.modal.residualProbability == 0) {
      this.probabilityRequired = false;
    } else {
      this.probabilityRequired = true;
    }
    if (this.modal.residualDetetablity == 0) {
      this.detectabilityRequired = false;
    } else {
      this.detectabilityRequired = true;
    }
    if (this.modal.residualServerity == 0) {
      this.severityRequired = false;
    } else {
      this.severityRequired = true;
    }
  }

  // 3*3 priority calculatuon
  residualrpnCalculationMatrix() {
    if (this.modal.residualProbability != undefined && this.modal.residualServerity != undefined && this.modal.residualDetetablity != undefined) {
      this.modal.residualRpn = 0;
      this.modal.residualCritical = 0;
      this.modal.residualRpn = Number(this.modal.residualProbability) * Number(this.modal.residualServerity) * Number(this.modal.residualDetetablity);
      this.modal.residualCritical = Number(this.modal.residualProbability) * Number(this.modal.residualServerity);

      if (this.modal.residualRpn < 5 && this.modal.residualRpn != 0) {
        this.modal.residualPriority = 1;
      } else if (this.modal.residualRpn > 5 && this.modal.residualRpn < 10) {
        this.modal.residualPriority = 2;
      } else if (this.modal.residualRpn > 8) {
        this.modal.residualPriority = 3;
      }

      if (this.modal.residualDetetablity == 3 && this.modal.residualCritical == 1) {
        this.modal.residualPriority = 2;
      }

      if (this.modal.residualDetetablity == 3 && this.modal.residualCritical == 3) {
        this.modal.residualPriority = 3;
      }

      if (this.modal.residualDetetablity == 3 && this.modal.residualCritical == 9) {
        this.modal.residualPriority = 3;
      }
    }
    if (this.modal.residualProbability == 0) {
      this.probabilityRequired = false;
    } else {
      this.probabilityRequired = true;
    }
    if (this.modal.detectability == 0) {
      this.detectabilityRequired = false;
    } else {
      this.detectabilityRequired = true;
    }
    if (this.modal.residualServerity == 0) {
      this.severityRequired = false;
    } else {
      this.severityRequired = true;
    }
  }

  // 5*5 priority calculatuon
  residualrpnCalculationMatrixFor5x5() {
    if (this.modal.residualProbability != undefined && this.modal.residualServerity != undefined && this.modal.residualDetetablity != undefined) {
      this.modal.residualRpn = 0;
      this.modal.residualCritical = 0;
      this.modal.residualRpn = Number(this.modal.residualProbability) * Number(this.modal.residualServerity) * Number(this.modal.residualDetetablity);
      this.modal.residualCritical = Number(this.modal.residualProbability) * Number(this.modal.residualServerity);
      for (let index = 0; index < this.matrixList.length; index++) {
        if (this.modal.residualRpn <= this.matrixList[index].max && this.modal.residualRpn >= this.matrixList[index].min && this.modal.residualRpn != 0) {
          this.modal.residualPriority = Number(this.riskPriority.filter(f => f.value == this.matrixList[index].type).map(m => m.key));
        }
      }
    }
    if (this.modal.residualProbability == 0) {
      this.probabilityRequired = false;
    } else {
      this.probabilityRequired = true;
    }
    if (this.modal.residualDetetablity == 0) {
      this.detectabilityRequired = false;
    } else {
      this.detectabilityRequired = true;
    }
    if (this.modal.residualServerity == 0) {
      this.severityRequired = false;
    } else {
      this.severityRequired = true;
    }
  }
}