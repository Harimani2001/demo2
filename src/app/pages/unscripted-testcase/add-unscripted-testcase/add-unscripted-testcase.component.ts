import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IOption } from 'ng-select';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { AdhocTestCase, UserPrincipalDTO,CheckListTestCaseDTO } from '../../../models/model';
import { Permissions } from '../../../shared/config';
import { ConfigService } from '../../../shared/config.service';
import { Helper } from '../../../shared/helper';
import { FileUploadForDocComponent } from '../../file-upload-for-doc/file-upload-for-doc.component';
import { FormExtendedComponent } from '../../form-extended/form-extended.component';
import { LookUpService } from '../../LookUpCategory/lookup.service';
import { MasterControlService } from '../../master-control/master-control.service';
import { SpecificationMasterService } from '../../specification-master/specification-master.service';
import { UrsService } from '../../urs/urs.service';
import { UnscriptedService } from '../unscripted-testcase.service';
import { RiskAssessmentService } from '../../risk-assessment/risk-assessment.service';
import { IQTCService } from '../../iqtc/iqtc.service';
import { UrlchecklistComponent } from '../../urlchecklist/urlchecklist.component';
declare function initilizer(): any;

@Component({
    selector: 'app-add-unscripted-testcase',
    templateUrl: './add-unscripted-testcase.component.html',
    styleUrls: ['./add-unscripted-testcase.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
    encapsulation: ViewEncapsulation.None
})
export class AddUnscriptedComponent implements OnInit, AfterViewInit {
    @ViewChild('formExtendedId') private formExtendedComponent: FormExtendedComponent;
    @ViewChild('ursAndSpecificationModal') private ursAndSpecificationModal: any;
    @ViewChild('myTable') table: any;
    @ViewChild('selectDataTable') selectDataTable: any;
    public inputField: any;
    filterQuery = '';
    modal: AdhocTestCase = new AdhocTestCase();
    @ViewChild('fileupload') private file: FileUploadForDocComponent;
    model: Permissions = new Permissions(this.helper.Unscripted_Value, false)
    submitted: boolean = false;
    ursList: any[];
    simpleOption: Array<IOption> = new Array<IOption>();
    receivedId: string = "";
    isReadOnly: boolean = false;
    spinnerFlag = false;
    showAppCard: boolean = true;
    currentUser: UserPrincipalDTO = new UserPrincipalDTO();
    selectedUrsIds: any[] = new Array();
    selectedSpecUrsId:any[]=new Array();
    selectedRiskUrsId:any[]=new Array();
    selectedSPIds: any[] = new Array();
    selectedRiskIds: any[] = new Array();
    ursIdsForView: any[] = new Array();
    selectedUrsDetails: any[] = new Array();
    testingTypeList: any[] = Array();
    enviroments: any[] = Array();
    isLoading: false;
    validateUrs: boolean = false;
    ursAndSpecList: any[] = new Array();
    riskList: any[] = new Array();
    @ViewChild('riskModal') private riskModal: any;
    ursDetailedView: boolean;
    backURL:any='/Ad-hoc/view-Ad-hoc-testcase';
    isCheckListEntered: boolean = false;
    images: Array<any> = [];
    processedImages: any[] = new Array();
    isImageDispaly: boolean = false;
    @ViewChild('urlchecklist') urlchecklist: any;
    @ViewChild('checkListURL') checkListURL: UrlchecklistComponent;
    referenceFlag: boolean = false;
    processedChecklistImages: any[] = new Array();
    checkListImages: Array<any> = [];
    selectedCheckList: any;
    @ViewChild('checkListImageModal') checkListImageModal: any;
    @ViewChild('modalSmall') modalSmall:any;
    files:any;
    constructor(private comp: AdminComponent, public helper: Helper, public router: Router, public iqtcServices: UnscriptedService, public ursService: UrsService,
        private route: ActivatedRoute, public permissionService: ConfigService, public spService: SpecificationMasterService,
        private masterControlService: MasterControlService, public lookUpService: LookUpService,private riskService: RiskAssessmentService,public service: IQTCService) {
        this.masterControlService.loadJsonOfDocumentIfActive(this.helper.Unscripted_Value).subscribe(res => {
            this.inputField = [];
            if (res != null)
                this.inputField = JSON.parse(res.jsonStructure);
        });
    }

    ngAfterViewInit(): void {
        if (this.spinnerFlag)
            this.spinnerFlag = false;
    }

    ngOnInit() {
      this.route.queryParams.subscribe(query => {
        if (query.status) {
          this.backURL = query.status;
        }
      });
        this.permissionService.loadPermissionsBasedOnModule(this.helper.Unscripted_Value).subscribe(resp => {
            this.model = resp;
        });
        this.getTestingType();
        this.loadEnvironments();
        this.loadURS();
        this.modal.id = 0;
        this.comp.setUpModuleForHelpContent(this.helper.Unscripted_Value);
        this.comp.taskEquipmentId = 0;
        this.comp.taskDocType = this.helper.Unscripted_Value;
        this.comp.taskEnbleFlag = true;
    }

    loadUrsAndSpecDetails() {
      return new Promise(resolve => {
        this.spinnerFlag=true;
        this.ursService.getUrsAndSpecForProject().subscribe(jsonResp => {
          this.spinnerFlag=false;
          this.ursAndSpecList = jsonResp.result;
          if (this.selectedSPIds) {
            this.selectedSpecUrsId=new Array();
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
        }, err => {
          this.spinnerFlag=false;
          resolve(true);
        });
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
          isSelected ? (data.selected = false) : (data.selected = true);
        });
      })
    }
  
    onCloseUrsAndSpecPopup(flag) {
      
      let specList =new Array();
      if (flag) {
        this.selectedSPIds=new Array();
        this.selectedUrsIds =  this.ursAndSpecList.filter(f => f.selected).map(m => m.id);
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
          row.childList.filter(f => (!this.selectedSPIds.includes(f.id))).forEach(element => element.selected = false);
        })
      }
      this.ursViewIdSet();
      this.ursAndSpecificationModal.hide();
    }
  
  
    ursViewIdSet(){
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

    loadURS() {
      this.spinnerFlag=true;
        this.ursService.getUsrListForProject().subscribe(jsonResp => {
          this.spinnerFlag=false;
            if (!this.helper.isEmpty(jsonResp.result)) {
                this.ursList = jsonResp.result;
                this.simpleOption = jsonResp.result.map(option => ({ value: +option.id, label: option.ursCode }));
                this.receivedId = this.route.snapshot.params["id"];
                if (this.receivedId !== undefined) {
                  this.loadDataById();
                }
                this.route.queryParams.subscribe(query => {
                    let ursId = query.ursForAdHoc;
                    if (ursId) {
                      this.selectedUrsIds.push(+ursId); 
                      this.ursIdsForView.push(+ursId);
                    }
                    let specId = query.specForAdHoc;
                    if (specId) {
                      this.selectedSPIds.push(+specId);
                    }
                    if(query.status)
                    this.backURL=query.status;

                    let riskId = query.riskForTest;
                    if (riskId) {
                      this.selectedRiskIds.push(+riskId);
                    }
                  });
                  this.loadUrsAndSpecDetails().then(() => {
                    this.populateRisk(this.selectedRiskIds.length > 0 ? this.selectedRiskIds[0] : undefined).then(resp => {
                      this.ursViewIdSet();
                    })
                  })
            }
        });
    }

    loadDataById(){
      this.spinnerFlag=true;
      this.iqtcServices.loadDataById(this.receivedId).subscribe(jsonResp => {
          this.modal = jsonResp.result;
          this.selectedUrsIds = jsonResp.result["ursListData"].map(d => +d);
          this.ursIdsForView = this.selectedUrsIds;
          this.ursAndSpecList.filter(f => (this.selectedUrsIds.includes(f.id))).forEach(element => element.selected = true);
          if (jsonResp.result.files && jsonResp.result.files.length != 0) {
              this.modal.files[0].visible = true;
              this.isImageDispaly = true;
            }
            if (jsonResp.result.jsonExtraData != null && jsonResp.result.jsonExtraData != '[]')
                this.inputField = JSON.parse(jsonResp.result.jsonExtraData);
            this.processedImages = this.modal.files;
            this.images = this.processedImages;
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
        this.spinnerFlag = true;
        this.ursService.getSelectedUrsAndSpecAndRiskDetails({ "ursIds": this.selectedUrsIds, "specIds": this.selectedSPIds, "riskIds": this.selectedRiskIds }).subscribe(resp => {
          this.spinnerFlag = false;  
          this.selectedUrsDetails = resp.result;
        });
          this.selectedRiskIds = jsonResp.result["riskIds"].map(d => +d);
          this.riskList.filter(element => this.selectedRiskIds.includes(element.id)).forEach(element => {
              element.selected = true
              element.ursIdList.forEach(u => {
              this.selectedRiskUrsId.push(+u);
              });
          })
          this.ursViewIdSet();
          this.file.loadFileListForEdit(this.receivedId, this.modal.testCaseCode).then(() => this.spinnerFlag = false);
          this.spinnerFlag = false;
      }, err => {
          this.spinnerFlag = false;
      });
    }
    getTestingType() {
      this.lookUpService.getlookUpItemsBasedOnCategory("testingType").subscribe(resp => {
        if (resp.result == "success") {
          this.testingTypeList = resp.response;
        }
      });
    }

    loadEnvironments() {
        this.lookUpService.getlookUpItemsBasedOnCategory("Environment").subscribe(result => {
            this.enviroments = result.response;
        });
    }

    openSuccessUpdateSwal(formIsValid) {
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
                        this.onsubmit(formIsValid, userRemarks);
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
      this.modal.files= this.processedImages;
      if (!this.permissionService.helper.isEmpty(this.selectedUrsIds) || !this.permissionService.helper.isEmpty(this.selectedSPIds) || !this.permissionService.helper.isEmpty(this.selectedRiskIds)) {
            this.submitted = true;
            this.spinnerFlag = true;
            this.isCheckListEntered = false;
            let i = 1;
            this.modal.checklist.forEach(checkList => {
                checkList.displayOrder = i;
                ++i
                if (this.permissionService.helper.isEmpty(checkList.checklistName))
                this.isCheckListEntered = true;
            });
            if (!formIsValid || !this.formExtendedComponent.validateChildForm()) {
                this.submitted = true;
                this.spinnerFlag = false;
                return;
            }
            if (this.isCheckListEntered) {
                this.submitted = true;
                this.spinnerFlag = false;
                return;
              }
            this.modal.ursListData = this.selectedUrsIds;
            this.modal.specificationIds = this.selectedSPIds;
            this.modal.riskIds=this.selectedRiskIds;
            this.modal.jsonExtraData = JSON.stringify(this.inputField);
            this.modal.isDefault = "false";
            if (this.receivedId !== undefined) {
                this.modal.id = + this.receivedId;
            }
            this.modal.userRemarks = userRemarks;
            this.iqtcServices.createIQTC(this.modal).subscribe(jsonResp => {
                    let responseMsg: string = jsonResp.result;
                    if(this.modal.id == 0){
                      this.modal=jsonResp.unscriptDTO;
                      if(this.files){
                        this.spinnerFlag = false;
                        this.onTCFileChange(this.files,true);
                      }else{
                        if (responseMsg === "success") {
                          this.submitted = false;
                          this.spinnerFlag = false;
                          swal({
                              title: 'Success',
                              text: 'Unscripted Testing Testcase Updated',
                              type: 'success',
                              timer: this.helper.swalTimer,
                              showConfirmButton: false,
                              onClose: () => {
                                  // if(!this.backURL){
                                  //     this.backURL='/Ad-hoc/view-Ad-hoc-testcase';
                                  //    }
                                  //   this.router.navigate([this.backURL]);
                              }
                          });
                      } else {
                          this.spinnerFlag = false;
                          this.submitted = false;
                          swal({
                              title: 'Error!',
                              text: 'Oops something went Worng..',
                              type: 'error',
                              timer: this.helper.swalTimer,
                              showConfirmButton: false
                          }
                          );
                      }
                      }
                    }else{
                      if (responseMsg === "success") {
                        this.submitted = false;
                        this.spinnerFlag = false;
                        swal({
                            title: 'Success',
                            text: 'Unscripted Testing Testcase Updated',
                            type: 'success',
                            timer: this.helper.swalTimer,
                            showConfirmButton: false,
                            onClose: () => {
                                if(!this.backURL){
                                    this.backURL='/Ad-hoc/view-Ad-hoc-testcase';
                                   }
                                  this.router.navigate([this.backURL]);
                            }
                        });
                    } else {
                        this.spinnerFlag = false;
                        this.submitted = false;
                        swal({
                            title: 'Error!',
                            text: 'Oops something went Worng..',
                            type: 'error',
                            timer: this.helper.swalTimer,
                            showConfirmButton: false
                        }
                        );
                    }
                    }
            }
            );
        } else
            this.validateUrs = true;
        this.submitted = true;
    }

    onClickClose() {
      if(this.helper.isEmpty(this.backURL))
        this.backURL='/Ad-hoc/view-Ad-hoc-testcase';
       else
        this.router.navigate([this.backURL]);
    }

    loadMultipleSelectUrsAndSpec() {
        this.ursAndSpecList.forEach(data => data.selected = this.selectedUrsIds.includes(data.id) ? true : false);
        this.ursAndSpecList.forEach(row => {
            row.childList.forEach(data => data.selected = this.selectedSPIds.includes(data.id) ? true : false);
        });
        this.ursAndSpecificationModal.show();
        this.filterQuery = '';
    }

    toggleExpandRow(row) {
        this.selectDataTable.rowDetail.toggleExpandRow(row);
    }

   /**
 * Risk
 */
  populateRisk(riskId?) {
    return new Promise(resolve => {
      this.spinnerFlag=true;
      this.riskService.loadAllPublishedRiskData().subscribe(jsonResp => {
        this.spinnerFlag=false;
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
      }, err => {
        resolve(true);
        this.spinnerFlag=false;
      });
    });
  }

  loadMultipleSelectRisk() {
    this.riskList.forEach(data => data.selected = this.selectedRiskIds.includes(data.id) ? true : false);
      this.riskModal.show();
      this.filterQuery = '';  
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

  /**
   * Checklist
   */
  addChecklistItem() {
    this.isCheckListEntered = false;
    this.modal.checklist.forEach(checkList => {
      if (this.permissionService.helper.isEmpty(checkList.checklistName) || this.permissionService.helper.isEmpty(checkList.displayOrder))
        this.isCheckListEntered = true;
    });
    if (!this.isCheckListEntered) {
      let data = new CheckListTestCaseDTO();
      data.id = 0;
      data.checklistName = "";
      data.expectedResult = "";
      data.displayOrder = this.modal.checklist.length + 1;
      this.modal.checklist.push(data);
    }
    setTimeout(() => {
      $('#check_list_name_id_' + (this.modal.checklist.length - 1)).focus();
    }, 600);
  }

  onChangecheckList() {
    this.isCheckListEntered = false;
    this.modal.checklist.forEach(checkList => {
      if (this.permissionService.helper.isEmpty(checkList.checklistName))
        this.isCheckListEntered = true;
    });
  }
  onFileChangeLargeImage(event) {
    this.images = new Array();
    let imagesToSave=new Array();
    for (let index = 0; index < event.target.files.length; index++) {
      const file: File = event.target.files[index];
      this.service.getFileNameAndURL(file).then((res) => {
        let image = { visible: false, fileName: file.name, imageDataUrl: res };
        this.processedImages.push(image);
        imagesToSave.push(image);
        this.processedImages[0].visible = true;
        this.modal.fileName = event.target.files[0].name;
        this.isImageDispaly = true;
        this.modal.imagesCount=this.processedImages.length;
        if(imagesToSave.length == event.target.files.length){
          this.spinnerFlag = true;
          this.permissionService.HTTPPostAPI(imagesToSave,"unscripted/saveUnscriptedImages/"+this.modal.id+"/Testcase").subscribe(jsonResp => {
            this.spinnerFlag = false;
            event.target.value = null;
          }, err => this.spinnerFlag = false
          );
        }
      });
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
          this.modal.imagesCount=this.processedImages.length;
          this.permissionService.HTTPPostAPI(imagesToSave,"unscripted/saveUnscriptedImages/"+this.modal.id+"/Testcase").subscribe(jsonResp => {
            this.spinnerFlag = false
          }, err => this.spinnerFlag = false
          );
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
  deleteSlide(){
    let index = this.processedImages.findIndex(function (element) {
      return element.visible === true;
    });
    this.spinnerFlag=true;
   this.permissionService.HTTPGetAPI("unscripted/deleteUnscriptedImage/"+this.processedImages[index].id+"/Testcase").subscribe(resp =>{
    this.spinnerFlag=false;
    this.processedImages.splice(index, 1);
    if (this.processedImages.length > 0) {
      this.processedImages.forEach(value => {
        value.visible = false;
      });
      this.processedImages[0].visible = true;
      this.modal.imagesCount=this.processedImages.length;
    } else {
      this.modalSmall.hide();
      this.modal.imagesCount=this.processedImages.length;
    }
   });
  }

  deleteAllSlides(){
    this.processedImages=new Array();
  }
  validateReference(list) {
    if (this.checkListURL.validateList(list)){
      this.urlchecklist.hide();
      this.referenceFlag = false;
    }
     
  }

  closereference(list) {
    this.modal.urlChecklist=this.checkListURL.removeChecklist(list);
    this.urlchecklist.hide();
    this.referenceFlag = false;
  }
  show() {
    this.comp.openModalForScreenrecording(this.modal, null, this.route.url, this.modal.id,false);
  }

  deleteCheckList(data) {
    this.modal.checklist = this.modal.checklist.filter(event => event !== data);
    if(data.id !=0){
      this.spinnerFlag=true;
      this.permissionService.HTTPGetAPI("unscripted/deleteUnscriptedStep/"+data.id).subscribe(resp =>{
        this.spinnerFlag=false;
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
        this.permissionService.HTTPPostAPI(imagesToSave,"unscripted/saveUnscriptedImages/"+item.id+"/Teststep").subscribe(jsonResp => {
          this.spinnerFlag = false;
        }, err => this.spinnerFlag = false
        );
      });
    }
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
          this.permissionService.HTTPPostAPI(imagesToSave,"unscripted/saveUnscriptedImages/"+item.id+"/Teststep").subscribe(jsonResp => {
            this.spinnerFlag = false;
            event.target.value = null;
          }, err => this.spinnerFlag = false
          );
        }
      });
    }
  }
  onChangestatus(event: any, item: any) {
    item.completedFlag = true;
  }
  showCheckListModal(item: any) {
    this.selectedCheckList = item;
    if(item.id !=0){
      this.permissionService.HTTPGetAPI("unscripted/loadUnscriptedChildData/"+item.id+"/testStepsImages").subscribe(resp =>{
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
    }else{
      this.checkListImages = this.selectedCheckList.files;
      this.processedChecklistImages = this.selectedCheckList.files;
      if (this.processedChecklistImages.length > 0) {
        this.processedChecklistImages.forEach(element => {
          element.visible = false;
        })
        this.processedChecklistImages[0].visible = true;
        this.checkListImageModal.show();
      }
    }
  }

  deleteCheckListSlide() {
    let index = this.processedChecklistImages.findIndex(function (element) {
      return element.visible === true;
    });
    this.spinnerFlag=true;
   this.permissionService.HTTPGetAPI("unscripted/deleteUnscriptedImage/"+this.processedChecklistImages[index].id+"/Teststep").subscribe(resp =>{
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
  updateValue(item: any) {
    item.completedFlag = true;
  }
  reOrderImages(){
    let index = 1;
    this.processedImages.forEach(e => e.displayOrder = index++);
  }
  onclickReOrderChecklistImages(item: any) {
    this.selectedCheckList = item;
    this.permissionService.HTTPGetAPI("unscripted/loadUnscriptedChildData/"+item.id+"/testStepsImages").subscribe(resp =>{
      this.selectedCheckList.files=resp.result;
      item.files=resp.result;
      this.processedChecklistImages = this.selectedCheckList.files;
      this.reOrderChecklistImages();
    });
  }
  reOrderChecklistImages(){
    let index = 1;
    this.processedChecklistImages.forEach(e => e.displayOrder = index++);
  }

  moveUpOrDown(list: any[], index, upFlag) {
    let i:number=-1;
    if (upFlag) {
      i = index - 1;
    } else {
      i = index + 1;
    }
    if (i!=-1) {
      let element = list[index];
      list[index] = list[i];
      list[index].displayOrder=index+1;
      list[i] = element;
      list[i].displayOrder=i+1;
    }
  }

  onSubmitChecklistImagesOrder() {
    this.selectedCheckList.files = this.processedChecklistImages;
    this.spinnerFlag=true;
    this.permissionService.HTTPPostAPI(this.processedChecklistImages,"unscripted/reorderUnscriptedImages/Teststep").subscribe(resp =>{
      this.spinnerFlag=false;
    })
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
      this.spinnerFlag = true;
      checklist.userRemarks=userRemarks;
      debugger
      this.permissionService.HTTPPostAPI(checklist,"unscripted/saveUnscriptedStep/"+this.modal.id).subscribe(jsonResp => {
        this.spinnerFlag = false;
        checklist=jsonResp.result
          swal({
            title: 'Success',
            text: 'Test Step Updated Successfully',
            type: 'success',
            timer: this.permissionService.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              // this.loadDataById();
            }
          });
      }, err => this.spinnerFlag = false
      );
  }

  loadTestcaseImages(){
    this.spinnerFlag=true;
    this.permissionService.HTTPGetAPI("unscripted/loadUnscriptedChildData/"+this.modal.id+"/images").subscribe(resp =>{
      this.spinnerFlag=false;
      this.processedImages =resp.result;
      this.images = this.processedImages;
      this.processedImages[0].visible = true;
    });
  }

  loadReorderImages() {
    this.spinnerFlag=true;
    this.permissionService.HTTPGetAPI("unscripted/loadUnscriptedChildData/"+this.modal.id+"/images").subscribe(resp =>{
      this.spinnerFlag=false;
      this.processedImages =resp.result;
      this.images = this.processedImages;
      this.reOrderImages();
    });
  }

  saveReOrderImages(){
    this.spinnerFlag=true;
    this.permissionService.HTTPPostAPI(this.processedImages,"unscripted/reorderUnscriptedImages/Testcase").subscribe(resp =>{
      this.spinnerFlag=false;
    })
  }
  onTCFileChange(event,isRedirect:boolean){
    this.files=event;
    if(this.modal.id != 0 ){
      this.file.uploadFileList(this.modal, this.helper.Unscripted_Value, this.modal.testCaseCode).then(re => {
        this.spinnerFlag = false;
        if(isRedirect){
          swal({
            title: 'Success',
            text: 'Unscripted Testing Testcase Updated',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
                if(!this.backURL){
                    this.backURL='/Ad-hoc/view-Ad-hoc-testcase';
                   }
                  this.router.navigate([this.backURL]);
            }
        });
        }else{
          swal({
            title: 'Success',
            text: 'Test Case Updated Successfully',
            type: 'success',
            timer: this.permissionService.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              this.loadDataById();
            }
          });
        }
      },
        err => {
          this.spinnerFlag = false;
        });
    }
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
  saveReference(list) {
    if (this.checkListURL.validateList(list)) {
      this.spinnerFlag=true;
      this.permissionService.HTTPPostAPI(list,"unscripted/saveURLCheckList/"+this.modal.id).subscribe(resp =>{
        this.spinnerFlag=false;
        this.urlchecklist.hide();
        this.referenceFlag = false;
      });
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
}
