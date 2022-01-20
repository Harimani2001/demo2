import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import swal from 'sweetalert2';
import { GXPModel } from '../../../models/model';
import { FormEsignVerificationComponent } from '../../form-esign-verification/form-esign-verification.component';
import { AdminComponent } from './../../../layout/admin/admin.component';
import { ConfigService } from './../../../shared/config.service';
import { ModalBasicComponent } from './../../../shared/modal-basic/modal-basic.component';
import { Helper } from '../../../shared/helper';
import { AddDocumentWorkflowComponent } from '../../add-document-workflow/add-document-workflow.component';

@Component({
  selector: 'app-gxp',
  templateUrl: './gxp.component.html',
  styleUrls: ['./gxp.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class GxpComponent implements OnInit {
  @Input('freezeFlag') freezeFlag;
  @Input('projectId') projectId;
  @Input('id') id;
  @Output() load: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('formVerification') formVerification: FormEsignVerificationComponent;
  @ViewChild('infoGxPDocument') infoGxPDocument: ModalBasicComponent;
  @ViewChild('copyPdfSettingsModal') copyPdfSettingsModal: ModalBasicComponent;
  sectionOne: any[] = new Array();
  sectionTwo: any[] = new Array();
  sectionThree: any[] = new Array();
  gampCategoriesList: any[] = new Array();
  sectionFour: any[] = new Array();
  sectionFive: any[] = new Array();
  sectionSix: any[] = new Array();
  model: GXPModel = new GXPModel();
  matrixList = new Array();
  matrixConclusionList = new Array();
  @Output() onFreeze: EventEmitter<boolean> = new EventEmitter();
  documentList: any[] = new Array();
  categoryName = '';
  ImportprojectsList: any[] = new Array();

  constructor(private configService: ConfigService, private adminComponent: AdminComponent,public helper:Helper) { }

  ngOnInit(): void {
    this.adminComponent.spinnerFlag = true;
    this.configService.HTTPGetAPI("projectsetup/loadGxPFormRemarks/"+this.projectId).subscribe(resp =>{
      if(resp.result){
        this.model.section1Remarks=resp.result.section1Remarks;
        this.model.section2Remarks=resp.result.section2Remarks;
        this.model.section3Remarks=resp.result.section3Remarks;
        this.model.section4Remarks=resp.result.section4Remarks;
        this.model.section5Remarks=resp.result.section5Remarks;
        this.model.section6Remarks=resp.result.section6Remarks;
      }
    });
    this.loadSectionOne().then(r => {
      this.loadSectionTwo().then(r => {
        this.loadSectionThree().then(r => {
           this.loadsectionFour().then(r => {
            this.createMatrix();
            this.loadsectionFive();
          })
        })
      })
    })
    this.loadGAMPCategories();
    this.loadMatrixConclusion();
  }

  loadSection(sectionId: number, projectId) {
    return new Promise<any[]>(resolve => {
      this.configService.HTTPPostAPI({ sectionId: sectionId, projectId: projectId }, 'projectsetup/loadQuestionSection').subscribe(resp => {
        resolve(resp);
      }, err => {
        resolve([]);
      });
    })
  }

  loadSectionOne() {
    return new Promise<any>((resolve) => {
      this.loadSection(1, this.projectId).then(response => {
        this.sectionOne = response;
        this.setGXPOrNot();
        resolve(true);
      });
    })
  }

  setGXPOrNot() {
    this.model.sectionFirst = this.sectionOne.filter(f => f.answer == 'Y').length > 0 ? 'GxP' : 'Non-GxP';
    if (this.model.sectionFirst == 'GxP') {
      this.model.sectionSecond = '';
      this.model.sectionThree = '';
      this.model.sectionFour = '';
      this.model.sectionFive = '';
    } else {
      this.model.sectionSecond = 'NA';
      this.model.sectionThree = 'NA';
      this.model.sectionFour = 'NA';
      this.model.sectionFive = 'NA';
    }
    this.setDefaultForNonGXP();
  }
  setSystemRisk(){
    if (this.sectionFour.filter(f => f.answer == '').length == 0) {
      this.model.sectionFour = this.sectionFour.filter(f => f.answer == 'Y').length > 0 ? 'High' : 'Low';
      this.setMatrix();
    }
  }

  setDefaultForNonGXP() {
    this.sectionTwo.forEach(f => f.answer = '');
    this.sectionThree.forEach(f => f.answer = '');
    this.sectionFour.forEach(f => f.answer = '');
    this.matrixList.forEach(element => {
      element.list.forEach(e => {
        e.checked = ''
      });
    })
    // this.sectionFive.forEach(f => f.answer = '');
    // this.sectionSix.forEach(f => f.answer = 'N');
  }

  loadSectionTwo() {
    return new Promise<any>((resolve) => {
      this.loadSection(2, this.projectId).then(response => {
        this.sectionTwo = response;
        this.setERESOrNot();
        resolve(true);
      });
    })
  }

  onChangeERESOrNot(event,q) {
    if (this.sectionTwo.filter(f => f.answer == '').length == 0) {
      let nCount = this.sectionTwo.filter(f => f.answer == 'N').length;
      if (nCount == this.sectionTwo.length) {
        this.model.sectionSecond = 'Non ERES Relevant';
      } else if (nCount == 0) {
        this.model.sectionSecond = 'ERES Relevant';
      } else {
        let ans1;
        let ans2;
        let ans3;
        this.sectionTwo.forEach(e=> {
          if(e.uniqueId == 'eaq1')
              ans1=e.answer;
          if(e.uniqueId == 'eaq2')
            ans2=e.answer;
          if(e.uniqueId == 'eaq3')
            ans3=e.answer;
        });
        if (ans1 == 'N' && ans2 == 'N' && ans3 == 'Y') {
          if(!this.helper.isEmpty( this.model.sectionSecond)){
            q.answer=(q.answer=='N')?'Y':'N';
          }else{
            q.answer='';
          }
          // this.model.sectionSecond = '';
          event.srcElement.checked = false;
          swal({ title: 'Warning', text: 'This is invalid scenario. Kindly select appropriate values', type: 'warning', timer: 3000, allowOutsideClick: false });
        }else if ((ans1 == 'Y' || ans2 == 'Y') && ans3 == 'Y') {
          this.model.sectionSecond = 'ERES Relevant';
        }else if ((ans1 == 'Y' || ans2 == 'Y') && ans3 == 'N') {
          this.model.sectionSecond = 'ER Relevant';
        } 
      }
    }
    if (this.model.sectionFirst != 'GxP') {
      this.model.sectionSecond = "NA";
      this.setDefaultForNonGXP();
    }
  }

  setERESOrNot() {
    if (this.sectionTwo.filter(f => f.answer == '').length == 0) {
      let nCount = this.sectionTwo.filter(f => f.answer == 'N').length;
      if (nCount == this.sectionTwo.length) {
        this.model.sectionSecond = 'Non ERES Relevant';
      } else if (nCount == 0) {
        this.model.sectionSecond = 'ERES Relevant';
      } else {
        let ans1;
        let ans2;
        let ans3;
        this.sectionTwo.forEach(e=> {
          if(e.uniqueId == 'eaq1')
              ans1=e.answer;
          if(e.uniqueId == 'eaq2')
            ans2=e.answer;
          if(e.uniqueId == 'eaq3')
            ans3=e.answer;
        });
        if ((ans1 == 'Y' || ans2 == 'Y') && ans3 == 'Y') {
          this.model.sectionSecond = 'ERES Relevant';
        }else if ((ans1 == 'Y' || ans2 == 'Y') && ans3 == 'N') {
          this.model.sectionSecond = 'ER Relevant';
        } 
      }
    }
    if (this.model.sectionFirst != 'GxP') {
      this.model.sectionSecond = "NA";
      this.setDefaultForNonGXP();
    }
  }

  loadGAMPCategories() {
    this.configService.HTTPPostAPI({ projectId: this.projectId }, 'projectsetup/loadGAMPCategories').subscribe(resp => {
      this.gampCategoriesList = resp
    }, err => {
      this.gampCategoriesList = new Array();
    });
  }

  loadSectionThree() {
    return new Promise<any>((resolve) => {
      this.loadSection(3, this.projectId).then(response => {
        this.sectionThree = response;
        let data = this.sectionThree.filter(f => f.answer == 'Y');
        if (data.length == 0) {
          this.sectionThree.forEach(f => f.answer = '');
          this.model.sectionThree = 'NA';
        } else {
          this.model.sectionThree = data[0].uniqueId;
        }
        resolve(true);
      });
    });
  }

  setGAMPCategory(json, event, add) {
    this.sectionThree.forEach(e => {
      if (json.uniqueId == e.uniqueId) {
        e.answer = 'Y';
        this.model.sectionThree = e.uniqueId;
        event.srcElement.checked = add;
        this.setMatrix();
      } else {
        e.answer = 'N';
      }
    })
  }

  loadsectionFour() {
    return new Promise<any>((resolve) => {
      this.loadSection(4, this.projectId).then(response => {
        this.sectionFour = response;
         if (this.model.sectionFirst == 'Non-GxP') {
          this.sectionFour.forEach(f => f.answer = '');
         }
        this.setSystemRisk();
        resolve(true);
      });
    });
  }

  loadsectionFive() {
    return new Promise<any>((resolve) => {
      this.loadSection(5, this.projectId).then(response => {
        this.sectionFive = response;
        if (this.sectionFive.filter(f => f.answer == 'N').length == this.sectionFive.length){
          this.sectionFive.forEach(f => f.answer = '');
        }
        this.setSystemClassification();
        resolve(true);
      });
    });
  }

  setSystemClassification() {
    this.model.gdprConclusion = "";
    if (this.sectionFive.filter(f => f.answer == '').length == 0) {
      this.model.gdprConclusion= this.sectionFive[0].answer=="Y"?"OPEN System":"CLOSED System";
    }
  }
  loadsectionSix() {
    return new Promise<any>((resolve) => {
      this.loadSection(6, this.projectId).then(response => {
        this.sectionSix = response;
        resolve(true);
      });
    });
  }

  setSectionFour(q, event) {
    if (this.model.sectionFour == q.uniqueId) {
      event.srcElement.checked = true;
      q.answer = 'Y';
    } else {
      this.sectionFour.forEach(f => f.answer = (q.uniqueId == f.uniqueId) ? 'Y' : 'N');
    }
    this.model.sectionFour = q.uniqueId
    this.setMatrix();
  }

  setSectionFive(json, event, add) {
    this.sectionFive.forEach(e => {
      if (json.uniqueId == e.uniqueId) {
        e.answer = 'Y';
        event.srcElement.checked = add;
      } else {
        e.answer = 'N';
      }
      this.model.gdprConclusion= this.sectionFive[0].answer=="Y"?"OPEN System":"CLOSED System";
    })
  }

  createMatrix() {
    this.configService.HTTPPostAPI({ projectId: this.projectId }, 'projectsetup/loadGAMPCriticalMatrix').subscribe(resp => {
      this.matrixList = resp;
      this.adminComponent.spinnerFlag = false;
      this.matrixList.forEach(element => {
        element.list.forEach(e => {
          if (e.checked) {
            e.checked = true;
            this.model.sectionFive = e.keyValue;
            this.model.criticalLevelId = e.criticalLevelId;
            this.model.matrixId = e.id;
          } else {
            e.checked = false;
          }
        });
      })
    }, err => {
      this.adminComponent.spinnerFlag = false;
    });
  }

  loadMatrixConclusion() {
    this.configService.HTTPPostAPI({ "categoryName": "gampmatrixconclusion", "orgId": 0 }, "lookup/getCategoryItemByName").subscribe(result => {
      this.matrixConclusionList = result.response;
      ;
    });
  }

  setMatrix() {
    this.model.sectionFive = 'NA';
    this.matrixList.forEach(element => {
      element.list.forEach(e => {
        if (this.model.sectionThree == e.gampId && this.model.sectionFour == e.criticalLevelName && this.model.sectionFirst == "GxP") {
          e.checked = true;
          this.model.sectionFive = e.keyValue;
          this.model.criticalLevelId = e.criticalLevelId;
          this.model.matrixId = e.id;
        } else {
          e.checked = false;
        }
      });
    })
  }

  saveOrUpdateGxPForm() {
    if (this.helper.isEmpty(this.model.section1Remarks)) {
      this.message('Please Enter Remarks in Section:- 1 GxP Impact Assessment');
      return;
    }
    if (!this.model.gdprConclusion || this.model.gdprConclusion == "NA") {
      this.message('Please select any one in Section:- 2 System Classification');
      return;
    }
    if (this.helper.isEmpty(this.model.section5Remarks)) {
      this.message('Please Enter Remarks in Section:- 2 System Classification');
      return;
    }
    if (this.model.sectionFirst == "GxP") {
      if (!this.model.sectionSecond || this.model.sectionSecond == "NA") {
        this.message('Please select any one in Section:- 3 ERES Assessment');
        return;
      }
      if (!this.model.sectionThree || this.model.sectionThree == "NA") {
        this.message('Please select any one in Section:- 4 System GAMP Category Classification');
        return;
      }
      if (!this.model.sectionFour || this.model.sectionFour == "NA") {
        this.message('Please select any one in Section:- 5 System level Risk Assessment (SLRA)');
        return;
      }
    }
    if (this.helper.isEmpty(this.model.section2Remarks)) {
      this.message('Please Enter Remarks in Section:- 3 ERES Assessment');
      return;
    }
    if (this.helper.isEmpty(this.model.section3Remarks)) {
      this.message('Please Enter Remarks in Section:- 4 System GAMP Category Classification');
      return;
    }
    if (this.helper.isEmpty(this.model.section4Remarks)) {
      this.message('Please Enter Remarks in Section:- 5 System Level Risk Assessment ');
      return;
    }
    if (this.helper.isEmpty(this.model.section6Remarks)) {
      this.message('Please Enter Remarks in Section:- Summary');
      return;
    }
    if (this.id != 0) {
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
            this.save(userRemarks)
          } else {
            swal({
              title: '',
              text: 'Comments is requried',
              type: 'info',
              timer: 3000,
              showConfirmButton: false,
            });
          }
        });
    } else {
      this.save('');
    }
  }

  save(userRemarks) {
    this.model.sectionFirstList = this.sectionOne
    this.model.sectionSecondList = this.sectionTwo;
    this.model.sectionThreeList = this.sectionThree;
    this.model.sectionFourList = this.sectionFour;
    this.model.sectionFiveList = this.sectionFive;
    this.model.sectionSixList = this.sectionSix;
    this.model['userRemarks'] = userRemarks;
    this.model.projectId = this.projectId;
    this.configService.HTTPPostAPI(this.model, 'projectsetup/saveOrUpdateGxPForm').subscribe(resp => {
      if (resp.result) {
        this.ngOnInit();
        swal({
          title: 'Success',
          text: resp.message,
          type: 'success',
          timer: 3000, showConfirmButton: false,
          onClose: () => {
            this.refreshData();
          }
        });
      } else {
        swal({
          title: 'Error',
          text: resp.message,
          type: 'error',
          timer: 3000,
          showConfirmButton: false,
          onClose: () => {
            this.refreshData();
          }
        });
      }
    }, err => {
      swal({
        title: 'Error',
        text: "error",
        type: 'error',
        timer: 3000,
        showConfirmButton: false,
        onClose: () => {
          this.refreshData();
        }
      });
    });
  }

  message(string) {
    swal({
      title: '',
      text: string,
      type: 'info',
      timer: 3000,
      showConfirmButton: false,
    });
  }

  openModal(projectName) {
    this.formVerification.openMyModal(100, '', this.projectId, true, projectName);
  }

  freeze() {
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
          this.freezeSave(userRemarks);
        } else {
          swal({
            title: '',
            text: 'Comments is requried',
            type: 'info',
            timer: 3000,
            showConfirmButton: false,
          });
        }
      });
  }

  freezeSave(remarks) {
    this.adminComponent.spinnerFlag = true;
    this.configService.HTTPPostAPI({ projectId: this.projectId, remarks: remarks }, 'projectsetup/freezeGxPForm').subscribe(resp => {
      this.adminComponent.spinnerFlag = false;
      if (resp.result) {
        this.onFreeze.emit(true);
        this.ngOnInit();
        swal({
          title: 'Success',
          text: resp.message,
          type: 'success',
          timer: 3000, showConfirmButton: false,
          onClose: () => {
            this.refreshData();
          }
        });
      } else {
        swal({
          title: 'Error',
          text: resp.message,
          type: 'error',
          timer: 3000,
          showConfirmButton: false,
          onClose: () => {
            this.refreshData();
          }
        });
      }
    }, err => {
      swal({
        title: 'Error',
        text: "error",
        type: 'error',
        timer: 3000,
        showConfirmButton: false,
        onClose: () => {
          this.refreshData();
        }
      });
    });
  }

  refreshData() {
    this.adminComponent.spinnerFlag = false;
    this.load.emit(true);
  }

  download() {
    this.adminComponent.spinnerFlag = true;
    this.configService.HTTPPostAPIFile('projectsetup/downloadGxPForm', this.projectId).subscribe(resp => {
      this.adminComponent.previewByBlob("GxP_Assessment.pdf", resp, false);
      this.adminComponent.spinnerFlag = false;
    });
  }

  viewDocumentForGxP() {
    this.categoryName = '';
    this.documentList = new Array();
    this.adminComponent.spinnerFlag = true;
    this.configService.HTTPPostAPI(
      { gampId: this.model.sectionThree, criticalLevelId: this.model.criticalLevelId },
      'projectsetup/viewDocumentForGxP').subscribe(resp => {
        this.adminComponent.spinnerFlag = false;
        this.documentList = resp.list;
        this.categoryName = resp.categoryName;
        this.infoGxPDocument.show();
      });
  }

  openCopyPdfSettingsModal() {
    this.copyPdfSettingsModal.show();
    this.adminComponent.spinnerFlag = true;
    this.configService.HTTPGetAPI("pdfSetting/loadPdfSettingsForGXPClone/" + this.projectId).subscribe(resp => {
      this.ImportprojectsList = resp.result;
      this.adminComponent.spinnerFlag = false;
    });
  }

  closeCopyPdfSettingsModal() {
    this.copyPdfSettingsModal.hide();
  }

  onClickCopy(row) {
    var obj = this;
    swal({
      title: 'Are you sure?', text: 'You want import settings', type: 'warning',
      showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, import it!', cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success m-r-10', cancelButtonClass: 'btn btn-danger', allowOutsideClick: false,
      buttonsStyling: false
    }).then(function () {
      obj.configService.HTTPGetAPI("pdfSetting/clonePdfSettingsForGXP/" + obj.projectId + "/" + row.key).subscribe(resp => {
        swal({
          title: 'Success',
          text: resp.message,
          type: 'success',
          timer: 3000, showConfirmButton: false,
        });
      });
    });
  }
}