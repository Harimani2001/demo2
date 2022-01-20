import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { AdminComponent } from '../../layout/admin/admin.component';
import { Permissions } from '../../shared/config';
import { Helper } from '../../shared/helper';
import { FileUploadForDocComponent } from '../file-upload-for-doc/file-upload-for-doc.component';
import { RiskAssessmentService } from '../risk-assessment/risk-assessment.service';
import { UrlchecklistComponent } from '../urlchecklist/urlchecklist.component';
import { CheckListTestCaseDTO, TestCaseModel } from './../../models/model';
import { ConfigService } from './../../shared/config.service';
import { FormExtendedComponent } from './../form-extended/form-extended.component';
import { IQTCService } from './../iqtc/iqtc.service';
import { UrsService } from './../urs/urs.service';
import { LocationService } from '../location/location.service';

@Component({
  selector: 'app-test-case-edit',
  templateUrl: './test-case-edit.component.html',
  styleUrls: ['./test-case-edit.component.css']
})
export class TestCaseEditComponent implements OnInit, AfterViewInit {
  @ViewChild('formExtendedId') private formExtendedComponent: FormExtendedComponent;
  @ViewChild('fileupload') private file: FileUploadForDocComponent;
  @ViewChild('testCaseForm') private form: any;
  @ViewChild('ursAndSpecificationModal') private ursAndSpecificationModal: any;
  @ViewChild('selectDataTable') selectDataTable: any;
  @ViewChild('riskModal') private riskModal: any;
  @ViewChild('checkListImageModal') checkListImageModal: any;
  @ViewChild('modalSmall') imageModal: any;
  @ViewChild('urlchecklist') urlchecklist: any;
  @ViewChild('checkListURL') checkListURL: UrlchecklistComponent;
  public withCategory = true;
  categoryList = new Array();
  public backUrl: any = '/MainMenu';
  public inputField: any = [];
  id: number = 0;
  category: string = '';
  categoryName: String
  filterQuery: any = '';
  submitted: boolean;
  permissionModal = new Permissions(this.category, false);
  public simpleOption: Array<any> = new Array<any>();
  riskList: any[];
  selectedUrsIds: any[] = new Array();
  selectedSpecUrsId: any[] = new Array();
  selectedRiskUrsId: any[] = new Array();
  selectedSPIds: any[] = new Array();
  selectedRiskIds: any[] = new Array();
  ursIdsForView: any[] = new Array();
  enviroments: any[] = new Array();
  testCaseModal: TestCaseModel;
  isCheckListEntered: boolean = false;
  isValidDocumentOrder: boolean = false;
  validateUrs: boolean = false;
  totalSize
  currentDoc
  processedImages: any[] = new Array();
  isImageDispaly: boolean = false;
  editorSwap: boolean;
  freeze: boolean = false;
  freezeSFAbutton: boolean = false;
  isSelectedPublishData: boolean = false;
  isWorkflowDocumentOrderSequence: string;
  addTestCaseComponentSubscription: any;
  processedChecklistImages: any[] = new Array();
  selectedCheckList: any;
  checkListImages: Array<any> = [];
  images: Array<any> = [];
  ursDetailedView: boolean;
  ursAndSpecList: any[] = new Array();
  selectedUrsDetails: any[] = new Array();
  referenceFlag: boolean = false;
  roleBack;
  locationsList: any[] = new Array();
  projectList: any[] = new Array();
  dropdownSettings = {
    singleSelection: true,
    text: "Select Project",
    enableSearchFilter: true,
    classes: "myclass custom-class",
  };
  locationId: any = 0;
  projectId: any;
  testcaseDocumentList: any[] = new Array();
  isAnyFieldEdited: boolean = false;
  spinnerFlag: boolean = false;
  constructor(private activeRouter: ActivatedRoute, public permissionService: ConfigService,
    public service: IQTCService, public router: Router, private adminComponent: AdminComponent,
    private ursService: UrsService,
    private riskService: RiskAssessmentService, public helper: Helper, public locationService: LocationService) {

    this.addTestCaseComponentSubscription = permissionService.subscription(router);
  }

  ngOnInit(): void {
    if (this.activeRouter.snapshot.params["id"]) {
      this.id = +this.activeRouter.snapshot.params["id"];
    } else {
      this.id = 0;
    }
    if (this.activeRouter.snapshot.params["type"]) {
      this.withCategory = true;
      this.category = this.activeRouter.snapshot.params["type"];
      this.categoryName = this.permissionService.helper.getTestCaseName(this.category);
    } else {
      this.withCategory = false;
      this.loadTestCaseCategory();
    }
    this.activeRouter.queryParams.subscribe(query => {
      if (query.status) {
        this.backUrl = query.status;
      }
      if (query.roleBack) {
        this.roleBack = query.roleBack;
      }

      let ursId = query.ursForTest;
      if (ursId) {
        this.selectedUrsIds.push(+ursId);
      }
      let specId = query.specForTest;
      if (specId) {
        this.selectedSPIds.push(+specId);
      }
      let riskId = query.riskForTest;
      if (riskId) {
        this.selectedRiskIds.push(+riskId);
      }
    });
    this.spinnerFlag = true;
    this.loadPermission(this.category);
    this.loadEnvironments();
    this.loadUrs();
    this.loadUrsAndSpecDetails().then(() => {
      this.populateRisk(this.selectedRiskIds.length > 0 ? this.selectedRiskIds[0] : undefined).then(resp => {
        this.loadBasedOnId(this.id);
      })
    })
    this.isImageDispaly = false;
  }

  ngAfterViewInit(): void {
    this.spinnerFlag = true;
    let interval = setInterval(() => {
      if (this.file && this.testCaseModal.id != 0) {
        this.file.loadFileListForEdit(this.testCaseModal.id, this.testCaseModal.testCaseCode);
        clearInterval(interval);
      } else {
        if (this.testCaseModal && this.testCaseModal.id == 0) {
          clearInterval(interval);
        }
      }
    }, 1000);
  }

  loadTestCaseCategory() {
    this.categoryList = new Array();
    return new Promise<any>(resolve => {
      this.permissionService.loadDocBasedOnProject().subscribe(resp => {
        resp.forEach(element => {
          if (element.key == "108" || element.key == "109" || element.key == "110" || element.key == "207" || element.key == "208") {
            this.categoryList.push({ 'id': element.key, 'itemName': this.permissionService.helper.getTestCaseName(element.key) });
          }
        });
        resolve('');
      }, err => resolve(''));
    })
  }

  loadPermission(category) {
    // this.isWorkflowDocumentOrderSequence=false;
    if (category) {
      this.permissionService.loadPermissionsBasedOnModule(category).subscribe(resp => {
        this.permissionModal = resp;
      });
      this.permissionService.isWorkflowDocumentOrderSequence(category).subscribe(resp => {
        this.isWorkflowDocumentOrderSequence = resp;
      });
      this.adminComponent.setUpModuleForHelpContent(category);
      this.adminComponent.taskEquipmentId = 0;
      this.adminComponent.taskDocType = category;
      this.adminComponent.taskEnbleFlag = true;
    } else {
      this.permissionModal = new Permissions('', false);
    }
  }

  loadUrs() {
    this.ursService.getUsrListForProject().subscribe(jsonResp => {
      this.simpleOption = jsonResp.result.map(option => ({ value: +option.id, label: option.ursCode }));
    });
  }

  loadUrsAndSpecDetails() {
    return new Promise(resolve => {
      this.ursService.getUrsAndSpecForProject().subscribe(jsonResp => {
        this.ursAndSpecList = jsonResp.result;
        if (this.selectedSPIds) {
          this.selectedSpecUrsId = new Array();
          this.ursAndSpecList.forEach(row => {
            row.childList.filter(f => (this.selectedSPIds.includes(f.id))).forEach(element => {
              this.selectedSpecUrsId.push(element.ursId);
              element.selected = true;
            });
          })
          resolve(true)
        } else {
          resolve(true);
        }
      }, err => resolve(true));
    });
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
        isSelected ?(data.selected = false) : (data.selected = true);
      });
    })
  }

  onCloseUrsAndSpecPopup(flag) {
    let specList = new Array();
    if (flag) {
      this.selectedSPIds = new Array();
      this.selectedUrsIds = this.ursAndSpecList.filter(f => f.selected).map(m => m.id);
      this.ursAndSpecList.forEach(row => {
        specList.push(...row.childList);
        row.childList.forEach(data => {
          if (data.selected) {
            this.selectedSPIds.push(data.id);
          }
        });
      })
      this.selectedSpecUrsId = specList.filter(s => this.selectedSPIds.includes(s.id)).map(s => s.ursId);

    } else {
      this.ursAndSpecList.filter(f => (!this.selectedUrsIds.includes(f.id))).forEach(element => element.selected = false);
      this.ursAndSpecList.forEach(row => {
        row.childList.filter(f => (!this.selectedSPIds.includes(f.id))).forEach(element => element.selected = false);
      })
    }
    this.ursViewIdSet();
    this.ursAndSpecificationModal.hide();
  }


  ursViewIdSet() {
    this.ursIdsForView = new Array();
    this.ursIdsForView.push(... this.selectedUrsIds);
    this.ursIdsForView.push(...this.selectedSpecUrsId);
    this.ursIdsForView.push(...this.selectedRiskUrsId);
    this.ursIdsForView = this.ursIdsForView.filter((value, index, self) => self.indexOf(value) === index);
    this.validateUrs = !(this.ursIdsForView && this.ursIdsForView.length > 0);
    this.ursService.getSelectedUrsAndSpecAndRiskDetails({
      "ursIds": this.selectedUrsIds,
      "specIds": this.selectedSPIds,
      "riskIds": this.selectedRiskIds
    }).subscribe(resp => {
      this.selectedUrsDetails = resp.result;
    });
  }

  loadBasedOnId(id) {
    if (id && id != 0) {
      this.spinnerFlag = true;
      this.service.getDataForEdit(id, false).subscribe(jsonResp => {
        this.totalSize = jsonResp.total;
        this.currentDoc = jsonResp.current;
        this.setData(jsonResp.result);
      }, err => {
      });
    } else {
      this.spinnerFlag = false;
      this.testCaseModal = new TestCaseModel();
      this.testCaseModal.checklist = new Array();
      this.testCaseModal.id = 0;
      this.loadFormExtend(this.category);
      this.ursViewIdSet();
    }
  }

  onClickClose() {
    if (this.isAnyFieldEdited || this.file.isAnyFieldEdited) {
      swal({
        title: 'Do you want to leave?',
        text: 'Changes you made may not be saved.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success m-r-10',
        cancelButtonClass: 'btn btn-danger',
        allowOutsideClick: false,
        buttonsStyling: false
      }).then((data) => {
        if (this.roleBack) {
          this.router.navigate([this.backUrl], { queryParams: { id: this.roleBack }, skipLocationChange: true });
        } else {
          this.router.navigate([this.backUrl]);
        }
      })
    } else {
      if (this.roleBack) {
        this.router.navigate([this.backUrl], { queryParams: { id: this.roleBack }, skipLocationChange: true });
      } else {
        this.router.navigate([this.backUrl]);
      }
    }
  }

  setData(data: any) {
    this.ursIdsForView = [];
    this.spinnerFlag = true;
    this.testCaseModal = new TestCaseModel();
    this.testCaseModal.checklist = new Array();
    this.freeze = false;
    this.submitted = false;
    this.freezeSFAbutton = false;
    if (data.id != 0) {
      this.adminComponent.taskDocTypeUniqueId = data.id;
      this.testCaseModal = data;
      debugger
      this.id = data.id;
      if (this.testCaseModal.status === 'Fail')
        this.freeze = true;
      if (!this.testCaseModal.status || this.testCaseModal.status === 'In-Progress')
        this.freezeSFAbutton = true;

      if (this.testCaseModal.executionFlag && !this.testCaseModal.publishedflag) {
        this.isSelectedPublishData = true;
      } else {
        this.isSelectedPublishData = false;
      }
      this.testCaseModal.organizationName = data.orgName;
      if (data.files && data.files.length != 0) {
        this.testCaseModal.files[0].visible = true;
        this.isImageDispaly = true;
      }
      this.processedImages = this.testCaseModal.files;
      this.images = this.processedImages;

      this.selectedUrsIds = data["ursIds"];
      // this.selectedUrsIds = data["ursListData"].map(d=>+d);
      this.ursAndSpecList.forEach(element => {
        element.selected = this.selectedUrsIds.includes(element.id)
      });
      this.selectedSPIds = data["specificationIds"].map(d => +d);
      this.selectedSpecUrsId = new Array();
      this.ursAndSpecList.forEach(row => {
        row.childList.forEach(element => {
          if (this.selectedSPIds.includes(element.id)) {
            element.selected = true
            this.selectedSpecUrsId.push(element.ursId);
          }
        });
      })

      this.selectedRiskIds = data["riskIds"].map(d => +d);
      this.riskList.filter(element => this.selectedRiskIds.includes(element.id)).forEach(element => {
        element.selected = true
        element.ursIdList.forEach(u => {
          this.selectedRiskUrsId.push(+u);
        });
      })
      if (this.file && this.testCaseModal.id != 0) {
        this.file.loadFileListForEdit(this.testCaseModal.id, this.testCaseModal.testCaseCode);
      }
      this.ursViewIdSet();
      if (!this.permissionService.helper.isEmpty(this.testCaseModal.actualResult) && (this.testCaseModal.actualResult.includes('<p>')))
        this.editorSwap = true;
      if (data.jsonExtraData)
        this.inputField = JSON.parse(data.jsonExtraData);
    } else {
      this.testCaseModal.constantName = this.category
    }
    this.spinnerFlag = false;
  }

  /** PDF Preview */
  /**
  * @param flag => view or download
  * @param extention =>doc/docx
  */
  documentPreview(flag, extention, data) {
    this.spinnerFlag = true;
    data.downloadDocType = extention;
    this.service.loadPreviewDocument(data).subscribe(resp => {
      this.spinnerFlag = false;
      if (resp != null) {
        this.adminComponent.previewByBlob(data.testCaseCode + '.' + extention, resp, flag,
          this.permissionService.helper.getTestCaseName(this.category) + ' Preview');
      }
    }, err => this.spinnerFlag = false);
  }

  publishOrSubmitForApprove(data) {
    var classObject = this;
    swal({
      title: 'Are you sure?',
      text: 'You wont be able to revert',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success m-r-10',
      cancelButtonClass: 'btn btn-danger',
      allowOutsideClick: false,
      buttonsStyling: false
    }).then(function () {
      classObject.publishIndividualData(data);
    });
  }

  publishIndividualData(data) {
    this.spinnerFlag = true;
    if (!data.publishedflag && !data.executionFlag) {
      data.masterFlag = true;
      this.service.publishTestCaseToMaster(data).subscribe(resp => {
        if (resp.result)
          this.setData(resp.result);
        else
          this.onClickClose();
        this.spinnerFlag = false;
      });
    } else
      if (!data.publishedflag && data.executionFlag) {
        data.publishedflag = true;
        this.service.publishTestCase(data).subscribe(resp => {
          this.isSelectedPublishData = false;
          if (resp.result)
            this.setData(resp.result);
          else
            this.onClickClose();
          this.spinnerFlag = false;
        });
      }
  }

  /** Click on Next and Previous */

  restData() {
    this.ursIdsForView = new Array();
    this.selectedUrsIds = new Array();
    this.selectedSpecUrsId = new Array();
    this.selectedRiskUrsId = new Array();
    this.selectedSPIds = new Array();
    this.selectedRiskIds = new Array();
    this.validateUrs = false;
    this.isAnyFieldEdited = false;
    if (this.file)
      this.file.isAnyFieldEdited = false;
    if (this.checkListURL)
      this.checkListURL.isAnyFieldEdited = false;
  }
  onclickFirst(data) {
    if (this.isAnyFieldEdited || this.file.isAnyFieldEdited) {
      swal({
        title: 'Do you want to leave?',
        text: 'Changes you made may not be saved.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success m-r-10',
        cancelButtonClass: 'btn btn-danger',
        allowOutsideClick: false,
        buttonsStyling: false
      }).then((res) => {
        if (!data.navigationPreviousEnds) {
          this.spinnerFlag = true;
          this.service.getFirstData(data.id, false).subscribe(jsonResp => {
            this.restData();
            this.totalSize = jsonResp.total;
            this.currentDoc = jsonResp.current;
            if (jsonResp.result)
              this.setData(jsonResp.result);
            this.spinnerFlag = false;
          },
            err => {
            }
          );
        }
      })
    } else {
      if (!data.navigationPreviousEnds) {
        this.spinnerFlag = true;
        this.service.getFirstData(data.id, false).subscribe(jsonResp => {
          this.restData();
          this.totalSize = jsonResp.total;
          this.currentDoc = jsonResp.current;
          if (jsonResp.result)
            this.setData(jsonResp.result);
          this.spinnerFlag = false;
        },
          err => {
          }
        );
      }
    }

  }

  onclickPrevious(data) {
    if (this.isAnyFieldEdited || this.file.isAnyFieldEdited) {
      swal({
        title: 'Do you want to leave?',
        text: 'Changes you made may not be saved.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success m-r-10',
        cancelButtonClass: 'btn btn-danger',
        allowOutsideClick: false,
        buttonsStyling: false
      }).then((res) => {
        if (!data.navigationPreviousEnds) {
          this.spinnerFlag = true;
          this.service.getPreviousData(data.id, false).subscribe(jsonResp => {
            this.restData();
            this.totalSize = jsonResp.total;
            this.currentDoc = jsonResp.current;
            if (jsonResp.result)
              this.setData(jsonResp.result);
            this.spinnerFlag = false;
          },
            err => {
            }
          );
        }
      })
    } else {
      if (!data.navigationPreviousEnds) {
        this.spinnerFlag = true;
        this.service.getPreviousData(data.id, false).subscribe(jsonResp => {
          this.restData();
          this.totalSize = jsonResp.total;
          this.currentDoc = jsonResp.current;
          if (jsonResp.result)
            this.setData(jsonResp.result);
          this.spinnerFlag = false;
        },
          err => {
          }
        );
      }
    }

  }

  onclickNext(data) {
    if (this.isAnyFieldEdited || this.file.isAnyFieldEdited) {
      swal({
        title: 'Do you want to leave?',
        text: 'Changes you made may not be saved.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success m-r-10',
        cancelButtonClass: 'btn btn-danger',
        allowOutsideClick: false,
        buttonsStyling: false
      }).then((res) => {
        if (!data.navigationNextEnds) {
          this.spinnerFlag = true;
          this.service.getNextData(data.id, false).subscribe(jsonResp => {
            this.restData();
            this.totalSize = jsonResp.total;
            this.currentDoc = jsonResp.current;
            if (jsonResp.result)
              this.setData(jsonResp.result);
            this.spinnerFlag = false;
          },
            err => {
            }
          );
        }
      })
    } else {
      if (!data.navigationNextEnds) {
        this.spinnerFlag = true;
        this.service.getNextData(data.id, false).subscribe(jsonResp => {
          this.restData();
          this.totalSize = jsonResp.total;
          this.currentDoc = jsonResp.current;
          if (jsonResp.result)
            this.setData(jsonResp.result);
          this.spinnerFlag = false;
        },
          err => {
          }
        );
      }
    }

  }

  onclickLast(data) {
    if (this.isAnyFieldEdited || this.file.isAnyFieldEdited) {
      swal({
        title: 'Do you want to leave?',
        text: 'Changes you made may not be saved.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success m-r-10',
        cancelButtonClass: 'btn btn-danger',
        allowOutsideClick: false,
        buttonsStyling: false
      }).then((res) => {
        if (!data.navigationNextEnds) {
          this.spinnerFlag = true;
          this.service.getLastData(data.id, false).subscribe(jsonResp => {
            this.restData();
            this.totalSize = jsonResp.total;
            this.currentDoc = jsonResp.current;
            if (jsonResp.result)
              this.setData(jsonResp.result);
            this.spinnerFlag = false;
          },
            err => {
            }
          );
        }
      })
    } else {
      if (!data.navigationNextEnds) {
        this.spinnerFlag = true;
        this.service.getLastData(data.id, false).subscribe(jsonResp => {
          this.restData();
          this.totalSize = jsonResp.total;
          this.currentDoc = jsonResp.current;
          if (jsonResp.result)
            this.setData(jsonResp.result);
          this.spinnerFlag = false;
        },
          err => {
          }
        );
      }
    }

  }

  /** Click on Next and Previous */

  loadFormExtend(category) {
    if (category) {
      this.permissionService.HTTPPostAPI(category, 'formExtend/loadJsonOfDocumentIfActive').subscribe(res => {
        if (res && res.dto)
          this.inputField = JSON.parse(res.dto.jsonStructure);
        else
          this.inputField = [];
      })
    } else {
      this.inputField = [];
    }

  }

  loadEnvironments() {
    this.permissionService.HTTPPostAPI({ "categoryName": "Environment", "orgId": 0 }, "lookup/getCategoryItemByName").subscribe(result => {
      this.enviroments = result.response;
    });
  }

  /**
   * Checklist
   */
  addChecklistItem() {
    this.isCheckListEntered = false;
    this.testCaseModal.checklist.forEach(checkList => {
      if (this.permissionService.helper.isEmpty(checkList.checklistName) || this.permissionService.helper.isEmpty(checkList.displayOrder))
        this.isCheckListEntered = true;
    });
    if (!this.isCheckListEntered) {
      let data = new CheckListTestCaseDTO();
      data.id = 0;
      data.checklistName = "";
      data.expectedResult = "";
      data.displayOrder = this.testCaseModal.checklist.length + 1;
      this.testCaseModal.checklist.push(data);
    }
    setTimeout(() => {
      $('#check_list_name_id_' + (this.testCaseModal.checklist.length - 1)).focus();
    }, 600);
  }

  onChangecheckList() {
    this.isCheckListEntered = false;
    this.testCaseModal.checklist.forEach(checkList => {
      if (this.permissionService.helper.isEmpty(checkList.checklistName))
        this.isCheckListEntered = true;
    });
  }

  /**
 * Risk
 */
  populateRisk(riskId?) {
    return new Promise(resolve => {
      this.riskService.loadAllPublishedRiskData().subscribe(jsonResp => {
        this.riskList = jsonResp.result;
        if (riskId) {
          this.riskList.filter(f => riskId == f.id).forEach(data => {
            data.ursIdList.forEach(element => {
              this.selectedRiskUrsId.push(+element);
            });
          });
          resolve(true);
        } else {
          resolve(true);
        }
      }, err => resolve(true));
    });
  }

  loadMultipleSelectRisk() {
    if (!this.testCaseModal.executionFlag) {
      this.riskList.forEach(data => data.selected = this.selectedRiskIds.includes(data.id) ? true : false);
      this.riskModal.show();
      this.filterQuery = '';
    }
  }

  onCloseRiskPopup(flag) {
    if (flag) {
      this.selectedRiskUrsId = new Array();
      this.selectedRiskIds = this.riskList.filter(f => f.selected).map(m => m.id);

      this.riskList.filter(f => f.selected).forEach(data => {
        data.ursIdList.forEach(element => {
          this.selectedRiskUrsId.push(+element);
        });
      })
    } else {
      this.riskList.filter(f => (!this.selectedRiskIds.includes(f.id))).forEach(element => element.selected = false);
    }
    this.ursViewIdSet();
    this.riskModal.hide();
  }

  onDeSelectRisk(data) {
    if (!data.selected) {
      data.ursIdList.forEach(element => {
        if (this.selectedUrsIds.includes(Number(element))) {
          const index: number = this.selectedUrsIds.indexOf(Number(element));
          if (index !== -1)
            this.selectedUrsIds.splice(index, 1);
        }
        if (this.ursIdsForView.includes(Number(element))) {
          const index: number = this.ursIdsForView.indexOf(Number(element));
          if (index !== -1)
            this.ursIdsForView.splice(index, 1);
        }
      });
    }
  }

  openSuccessUpdateSwal(formIsValid) {
    this.submitted = true;
    if (!this.permissionService.helper.isEmpty(this.selectedUrsIds) || !this.permissionService.helper.isEmpty(this.selectedSPIds) || !this.permissionService.helper.isEmpty(this.selectedRiskIds)) {
      this.isCheckListEntered = false;
      this.testCaseModal.checklist.forEach(checkList => {
        if (this.permissionService.helper.isEmpty(checkList.checklistName) || this.permissionService.helper.isEmpty(checkList.displayOrder))
          this.isCheckListEntered = true;
      });
      let valueArr = this.testCaseModal.checklist.map(function (item) { return String(item.displayOrder) });
      this.isValidDocumentOrder = valueArr.some(function (item, idx) {
        return valueArr.indexOf(item) != idx
      });
      if (!formIsValid || !this.formExtendedComponent.validateChildForm()) {
        return;
      }
      if (this.isCheckListEntered || this.isValidDocumentOrder) {
        return;
      }
      if (formIsValid) {
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
              this.saveTestCases(formIsValid, userRemarks);
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
    } else {
      this.validateUrs = true;
      this.submitted = true;
    }
  }

  saveTestCases(formIsValid, userRemarks?) {
    this.submitted = true;
    if (!this.permissionService.helper.isEmpty(this.selectedUrsIds) || !this.permissionService.helper.isEmpty(this.selectedSPIds) || !this.permissionService.helper.isEmpty(this.selectedRiskIds)) {
      this.isCheckListEntered = false;
      let i = 1;
      this.testCaseModal.checklist.forEach(checkList => {
        checkList.displayOrder = i;
        ++i
        if (this.permissionService.helper.isEmpty(checkList.checklistName))
          this.isCheckListEntered = true;
      });
      let valueArr = this.testCaseModal.checklist.map(function (item) { return String(item.displayOrder) });
      this.isValidDocumentOrder = valueArr.some(function (item, idx) {
        return valueArr.indexOf(item) != idx
      });
      if (!formIsValid || !this.formExtendedComponent.validateChildForm()) {
        return;
      }
      if (this.isCheckListEntered || this.isValidDocumentOrder) {
        return;
      }
      this.testCaseModal.files = this.processedImages;
      this.testCaseModal.flag = true;
      this.testCaseModal.jsonExtraData = JSON.stringify(this.inputField);
      this.testCaseModal.ursIds = this.selectedUrsIds;
      this.testCaseModal.ursListData = this.selectedUrsIds;
      this.testCaseModal.constantName = this.category;
      this.testCaseModal.specificationIds = this.selectedSPIds;
      this.testCaseModal.riskIds = this.selectedRiskIds;
      this.testCaseModal.id = this.id;
      this.testCaseModal.userRemarks = userRemarks;
      this.spinnerFlag = true;
      this.service.createIQTC(this.testCaseModal).subscribe(jsonResp => {
        this.isAnyFieldEdited = false;
        if (this.file)
          this.file.isAnyFieldEdited = false;
        if (this.checkListURL)
          this.checkListURL.isAnyFieldEdited = false;
        let responseMsg: string = jsonResp.result;
        if (responseMsg === "success") {
          this.file.uploadFileList(jsonResp.iqtcDTO, this.category, jsonResp.testCasecode).then(re => {
            this.spinnerFlag = false;
            if (responseMsg === "success") {
              if (this.id == 0) {
                swal({
                  title: 'Success',
                  text: 'Test Case Created Successfully',
                  type: 'success',
                  timer: this.permissionService.helper.swalTimer,
                  showConfirmButton: false,
                  onClose: () => {
                    if (this.backUrl == '/tc-creation' || this.backUrl == '/tc-execution') {
                      this.backUrl = this.backUrl + "/" + this.category;
                    }
                    this.router.navigate([this.backUrl]);
                  }
                });
              } else {
                swal({
                  title: 'Success',
                  text: 'Test Case Updated Successfully',
                  type: 'success',
                  timer: this.permissionService.helper.swalTimer,
                  showConfirmButton: false,
                  onClose: () => {
                    this.loadBasedOnId(this.id);
                  }
                });
              }
            } else {
              this.submitted = false;
              swal({
                title: 'Error!',
                text: 'Oops something went Worng..',
                type: 'error',
                timer: this.permissionService.helper.swalTimer,
                showConfirmButton: false,
              });
            }
          },
            err => {
              this.spinnerFlag = false;
            });
        }
        else {
          swal({
            title: 'Error!',
            text: responseMsg,
            type: 'error',
            timer: this.permissionService.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              if (this.id)
                this.loadBasedOnId(this.id);
            }
          });
          this.spinnerFlag = false;
        }
      }, err => this.spinnerFlag = false
      );
    } else {
      this.validateUrs = true;
      this.submitted = true;
    }
  }

  // copy image to clip board
  copyImageToClipboard(event) {
    // use event.originalEvent.clipboard for newer chrome versions
    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
    // find pasted image among pasted items
    var blob = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") === 0) {
        blob = items[i].getAsFile();
      }
    }
    // load image if there is a pasted image
    if (blob !== null) {
      this.service.getFileNameAndURL(blob).then((res) => {
        let image = { visible: false, fileName: "Screenshot_" + new Date(), imageDataUrl: res };
        this.processedImages.push(image);
        this.processedImages[0].visible = true;
        this.isImageDispaly = true;
          this.spinnerFlag = true;
          let imagesToSave=new Array();
          imagesToSave.push(image);
          this.testCaseModal.imagesCount=this.processedImages.length;
          this.permissionService.HTTPPostAPI(imagesToSave,"testCase/saveTestcaseExecutionImages/"+this.id+"/Testcase").subscribe(jsonResp => {
            this.spinnerFlag = false
          }, err => this.spinnerFlag = false
          );
      });
    }
  }

  deleteCheckListImages(item) {
    item.files = new Array();
    item.filesCount=0;
  }

  show() {
    this.adminComponent.openModalForScreenrecording(this.testCaseModal, null, this.backUrl, this.id, false);
  }

  deleteCheckList(data) {
    this.testCaseModal.checklist = this.testCaseModal.checklist.filter(event => event !== data);
  }

  onChangestatus(event: any, item: any) {
    item.completedFlag = true;
  }

  deleteSlide() {
    let index = this.processedImages.findIndex(function (element) {
      return element.visible === true;
    });
    this.spinnerFlag=true;
   this.permissionService.HTTPGetAPI("testCase/deleteTestcaseExecutionImage/"+this.processedImages[index].id+"/Testcase").subscribe(resp =>{
    this.spinnerFlag=false;
    this.processedImages.splice(index, 1);
    if (this.processedImages.length > 0) {
      this.processedImages.forEach(value => {
        value.visible = false;
      });
      this.processedImages[0].visible = true;
      this.testCaseModal.imagesCount=this.processedImages.length;
    } else {
      this.imageModal.hide();
      this.testCaseModal.imagesCount=this.processedImages.length;
    }
   });
  }

  deleteAllSlides() {
    this.processedImages = new Array();
    this.testCaseModal.imagesCount=this.processedImages.length;
  }

  onChangeCheckListImage(event, item) {
    item.completedFlag = true;
    let imagesToSave=new Array();
    this.processedChecklistImages = new Array();
    this.checkListImages = new Array();
    for (let index = 0; index < event.target.files.length; index++) {
      const file: File = event.target.files[index];
      this.service.getFileNameAndURL(file).then((res) => {
        let image = { visible: false, fileName: file.name, imageDataUrl: res };
        item.files.push(image);
        imagesToSave.push(image);
        item.filesCount= item.files.length;
        if(imagesToSave.length == event.target.files.length){
          this.spinnerFlag = true;
          this.permissionService.HTTPPostAPI(imagesToSave,"testCase/saveTestcaseExecutionImages/"+item.id+"/Teststep").subscribe(jsonResp => {
            this.spinnerFlag = false;
            event.target.value = null;
          }, err => this.spinnerFlag = false
          );
        }
      });
    }
   
  }

  copyChecklistImage(event, item) {
    // use event.originalEvent.clipboard for newer chrome versions
    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
    // find pasted image among pasted items
    var blob = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") === 0) {
        blob = items[i].getAsFile();
      }
    }
    // load image if there is a pasted image
    if (blob !== null) {
      this.service.getFileNameAndURL(blob).then((res) => {
        let image = { visible: false, fileName: "Screenshot_" + new Date(), imageDataUrl: res };
        item.files.push(image);
        let imagesToSave=new Array();
        imagesToSave.push(image);
        item.filesCount= item.files.length;
        this.spinnerFlag = true;
        this.permissionService.HTTPPostAPI(imagesToSave,"testCase/saveTestcaseExecutionImages/"+item.id+"/Teststep").subscribe(jsonResp => {
          this.spinnerFlag = false;
        }, err => this.spinnerFlag = false
        );
      });
    }
  }


  onFileChangeLargeImage(event) {
    this.images = new Array();
    let imagesToSave=new Array();
     
    for (let index = 0; index < event.target.files.length; index++) {
      const file: File = event.target.files[index];
      this.service.getFileNameAndURL(file).then((res) => {
        let image = { visible: false, fileName: file.name, imageDataUrl: res };
        this.processedImages.push(image);
        this.processedImages[0].visible = true;
        this.isImageDispaly = true;
        imagesToSave.push(image);
        this.testCaseModal.imagesCount=this.processedImages.length;
        if(imagesToSave.length == event.target.files.length){
          this.spinnerFlag = true;
          this.permissionService.HTTPPostAPI(imagesToSave,"testCase/saveTestcaseExecutionImages/"+this.id+"/Testcase").subscribe(jsonResp => {
            this.spinnerFlag = false;
            event.target.value = null;
          }, err => this.spinnerFlag = false
          );
        }
      });
    }
  }

  plusSlides(n) {
    let index = this.processedImages.findIndex(function (element) {
      return element.visible === true;
    });
    if (n == 1) {
      let next = index + 1;
      if (next < this.processedImages.length) {
        this.processedImages[index].visible = false;
        this.processedImages[++index].visible = true;
      } else {
        this.processedImages[index].visible = false;
        this.processedImages[0].visible = true;
        index = 0;
      }
    } else {
      let prev = index - 1;
      let next = index;
      if (prev < 0) {
        this.processedImages[index].visible = false;
        this.processedImages[this.processedImages.length - 1].visible = true;
        index = this.processedImages.length - 1;
      } else {
        this.processedImages[prev].visible = true;
        this.processedImages[next].visible = false;
        index = prev;
      }
    }
  }


  plusCheckListSlides(n) {
    let index = this.processedChecklistImages.findIndex(function (element) {
      return element.visible === true;
    });
    if (n == 1) {
      let next = index + 1;
      if (next < this.processedChecklistImages.length) {
        this.processedChecklistImages[index].visible = false;
        this.processedChecklistImages[++index].visible = true;
      } else {
        this.processedChecklistImages[index].visible = false;
        this.processedChecklistImages[0].visible = true;
        index = 0;
      }
    } else {
      let prev = index - 1;
      let next = index;
      if (prev < 0) {
        this.processedChecklistImages[index].visible = false;
        this.processedChecklistImages[this.processedChecklistImages.length - 1].visible = true;
        index = this.processedChecklistImages.length - 1;
      } else {
        this.processedChecklistImages[prev].visible = true;
        this.processedChecklistImages[next].visible = false;
        index = prev;
      }
    }
  }

  showCheckListModal(item: any) {
    this.selectedCheckList = item;
    this.permissionService.HTTPGetAPI("testCase/loadTestcaseChildData/"+item.id+"/testStepsImages").subscribe(resp =>{
      this.selectedCheckList.files=resp.result;
      item.files=resp.result;
      this.checkListImages = this.selectedCheckList.files;
      this.processedChecklistImages = this.selectedCheckList.files;
      if (this.processedChecklistImages.length > 0) {
        this.processedChecklistImages.forEach(element => {
          element.visible = false;
        })
        this.processedChecklistImages[0].visible = true;
        this.checkListImageModal.show();
      }
    })
  }

  deleteCheckListSlide() {
    let index = this.processedChecklistImages.findIndex(function (element) {
      return element.visible === true;
    });
    this.spinnerFlag=true;
   this.permissionService.HTTPGetAPI("testCase/deleteTestcaseExecutionImage/"+this.processedChecklistImages[index].id+"/Teststep").subscribe(resp =>{
    this.processedChecklistImages.splice(index, 1);
    if (this.processedChecklistImages.length > 0) {
      this.processedChecklistImages.forEach(value => {
        value.visible = false;
      });
      this.processedChecklistImages[0].visible = true;
    } else {
      this.checkListImageModal.hide();
    }
    this.selectedCheckList.files = this.processedChecklistImages;
    this.selectedCheckList.filesCount=this.processedChecklistImages.length;
    this.spinnerFlag=false;
   });
  }

  urlRedirection(id, testCaseId) {
    this.router.navigate(['/URS/view-urs'], { queryParams: { id: id, status: this.backUrl + "/" + testCaseId }, skipLocationChange: true });
  }

  updateValue(item: any) {
    item.completedFlag = true;
  }

  loadMultipleSelectUrsAndSpec() {
    this.ursAndSpecList.forEach(row => {
      row.selected = this.selectedUrsIds.includes(row.id) ? true : false;
      if (this.selectedSpecUrsId.includes(row.id))
        row.childList.forEach(data => data.selected = this.selectedSPIds.includes(data.id) ? true : false);
    });
    this.ursAndSpecificationModal.show();
    this.filterQuery = '';
  }

  toggleExpandRow(row) {
    this.selectDataTable.rowDetail.toggleExpandRow(row);
  }

  validateReference(list) {
    if (this.checkListURL.validateList(list)) {
      this.urlchecklist.hide();
      this.referenceFlag = false;
    }
    this.isAnyFieldEdited = this.checkListURL.isAnyFieldEdited;
  }

  closereference(list) {
    this.testCaseModal.urlChecklist = this.checkListURL.removeChecklist(list);
    this.urlchecklist.hide();
    this.referenceFlag = false;
  }
  loadTestCasesForImport() {
    this.locationService.loadAllActiveLocations().subscribe(response => {
      this.locationsList = response.result
    });
    // this.permissionService.HTTPGetAPI("testCase/getAllTestcasesForImport/").subscribe(resp => {

    // });
  }

  loadProjects() {
    this.projectList = [];
    this.permissionService.loadprojectOfUserAndCreatorForLocation(this.locationId).subscribe(response => {
      this.projectList = response.projectList.map(option => ({ id: option.id, itemName: option.projectName }));
    });
  }
  onProjectChange(event) {
    let url = "testCase/getAllTestcasesForImport/" + event[0].id + "/" + this.category;
    this.permissionService.HTTPGetAPI(url).subscribe(response => {
      this.testcaseDocumentList = response;
    });
  }
  onClickTestCases(row) {
    this.testCaseModal.description = row.description;
    this.testCaseModal.environment = row.environment;
    this.testCaseModal.acceptanceCriteria = row.acceptanceCriteria;
    this.testCaseModal.preRequisites = row.preRequisites;
    this.testCaseModal.expectedResult = row.expectedResult;
    this.testCaseModal.checklist = new Array();
    this.testCaseModal.urlChecklist = new Array();
    row.checklist.forEach(element => {
      let data = new CheckListTestCaseDTO();
      data.id = 0;
      data.checklistName = element.checklistName;
      data.expectedResult = element.expectedResult;
      data.displayOrder = this.testCaseModal.checklist.length + 1;
      this.testCaseModal.checklist.push(data);
    });
    row.urlChecklist.forEach(element => {
      let json = {
        formFlag: false,
        title: element.title,
        url: element.url,
        documentType: new Array(),
        formId: new Array(),
        formList: new Array()
      }
      this.testCaseModal.urlChecklist.push(json);
    });
  }
  onClickTestCasesModal() {
    this.testcaseDocumentList = [];
    this.locationId = 0;
    this.projectId = [];
    this.projectList = [];
  }
  onEditAnyData() {
    this.isAnyFieldEdited = true;
  }

  loadReorderImages() {
    this.spinnerFlag=true;
    this.permissionService.HTTPGetAPI("testCase/loadTestcaseChildData/"+this.id+"/images").subscribe(resp =>{
      this.spinnerFlag=false;
      this.processedImages =resp.result;
      this.images = this.processedImages;
      this.reOrderImages();
    });
  }

  reOrderImages() {
    let index = 1;
    this.processedImages.forEach(e => e.displayOrder = index++);
  }
  onclickReOrderChecklistImages(item: any) {
    this.selectedCheckList = item;
    this.permissionService.HTTPGetAPI("testCase/loadTestcaseChildData/"+item.id+"/testStepsImages").subscribe(resp =>{
      this.selectedCheckList.files=resp.result;
      item.files=resp.result;
      this.processedChecklistImages = this.selectedCheckList.files;
      this.reOrderChecklistImages();
    });
  }
  reOrderChecklistImages() {
    let index = 1;
    this.processedChecklistImages.forEach(e => e.displayOrder = index++);
  }

  moveUpOrDown(list: any[], index, upFlag) {
    let i: number = -1;
    if (upFlag) {
      i = index - 1;
    } else {
      i = index + 1;
    }
    if (i != -1) {
      let element = list[index];
      list[index] = list[i];
      list[index].displayOrder = index + 1;
      list[i] = element;
      list[i].displayOrder = i + 1;
    }
  }

  onSubmitChecklistImagesOrder() {
    this.selectedCheckList.files = this.processedChecklistImages;
    this.spinnerFlag=true;
    this.permissionService.HTTPPostAPI(this.processedChecklistImages,"testCase/reorderTestcaseExecutionImages/Teststep").subscribe(resp =>{
      this.spinnerFlag=false;
    })
  }

  /** Screenshot or Image */
  view(path, isImage) {
    if (isImage)
      this.adminComponent.downloadOrViewFile('temp.png', path, true, 'ScreenShot Image');
    else
      this.adminComponent.downloadOrViewFile('temp.webm', path, true, 'Recorded Video');
  }

  updateExecutionData(formIsValid) {
    debugger
    this.submitted = true;
      if (!formIsValid || !this.formExtendedComponent.validateChildForm()) {
        return;
      }
      if (formIsValid) {
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
              this.saveExecutionData(userRemarks);
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
  saveExecutionData(userRemarks) {
    let data={id:this.id,jsonExtraData:JSON.stringify(this.inputField),userRemarks:userRemarks,environment:this.testCaseModal.environment,actualResult: this.testCaseModal.actualResult,status:this.testCaseModal.status}
      this.spinnerFlag = true;
      this.permissionService.HTTPPostAPI(data,"testCase/saveTestcaseExecution").subscribe(jsonResp => {
        this.spinnerFlag = false
        this.isAnyFieldEdited = false;
          swal({
            title: 'Success',
            text: 'Test Case Updated Successfully',
            type: 'success',
            timer: this.permissionService.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              //this.loadBasedOnId(this.id);
            }
          });
      }, err => this.spinnerFlag = false
      );
  }
  saveTestStep(checklist) {
    this.saveTestSetpData("",checklist);
    // swal({
    //   title: "Write your comments here:",
    //   input: 'textarea',
    //   inputAttributes: {
    //     autocapitalize: 'off'
    //   },
    //   showCancelButton: true,
    //   confirmButtonText: 'Update',
    //   showLoaderOnConfirm: true,
    //   allowOutsideClick: false,
    // })
    //   .then((value) => {
    //     if (value) {
    //       let userRemarks = "Comments : " + value;
          
    //     } else {
    //       swal({
    //         title: '',
    //         text: 'Comments is requried',
    //         type: 'info',
    //         timer: this.helper.swalTimer,
    //         showConfirmButton: false,
    //       });
    //     }
    //   }); 
  }
  saveTestSetpData(userRemarks,checklist) {
    let data={id:checklist.id,userRemarks:userRemarks,completedFlag:checklist.completedFlag,actualResult: checklist.actualResult,status:checklist.status,remarks:checklist.remarks,files:checklist.files}
      this.spinnerFlag = true;
      this.permissionService.HTTPPostAPI(data,"testCase/saveTeststepExecution").subscribe(jsonResp => {
        this.spinnerFlag = false
        this.isAnyFieldEdited = false;
          swal({
            title: 'Success',
            text: 'Test Step Updated Successfully',
            type: 'success',
            timer: this.permissionService.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              //this.loadBasedOnId(this.id);
            }
          });
      }, err => this.spinnerFlag = false
      );
  }
  onTCFileChange(event){
    this.file.uploadFileList(this.testCaseModal, this.category, this.testCaseModal.testCaseCode).then(re => {
      this.spinnerFlag = false;
      this.file.isAnyFieldEdited = false;
      swal({
        title: 'Success',
        text: 'Test Case Updated Successfully',
        type: 'success',
        timer: this.permissionService.helper.swalTimer,
        showConfirmButton: false,
        onClose: () => {
          this.loadBasedOnId(this.id);
        }
      });     
    },
      err => {
        this.spinnerFlag = false;
      });
  }
  onTCFileDelete(event){
    this.spinnerFlag = true;
    this.permissionService.HTTPPostAPI(event,"fileUploadForDoc/deleteFile").subscribe(re => {
      this.spinnerFlag = false;    
    },
      err => {
        this.spinnerFlag = false;
      });
  }
  saveReOrderImages(){
    this.spinnerFlag=true;
    this.permissionService.HTTPPostAPI(this.processedImages,"testCase/reorderTestcaseExecutionImages/Testcase").subscribe(resp =>{
      this.spinnerFlag=false;
    })
  }

  saveReference(list) {
    if (this.checkListURL.validateList(list)) {
      this.spinnerFlag=true;
      this.permissionService.HTTPPostAPI(list,"testCase/saveURLCheckList/"+this.id).subscribe(resp =>{
        this.spinnerFlag=false;
        this.urlchecklist.hide();
        this.referenceFlag = false;
      });
    }
  }
  loadTestcaseImages(){
    this.spinnerFlag=true;
    this.permissionService.HTTPGetAPI("testCase/loadTestcaseChildData/"+this.id+"/images").subscribe(resp =>{
      this.spinnerFlag=false;
      this.processedImages =resp.result;
      this.images = this.processedImages;
      this.processedImages[0].visible = true;
    });
  }
}
