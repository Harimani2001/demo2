import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IOption } from 'ng-select';
import { Permissions } from '../../../shared/config';
import swal from 'sweetalert2';
import { CleanRoomInfo, CleanRoomSpecificationDTO, CleanRoomStatusDTO, SpecificationTableDataDTO, SpecificationUpdatedTableDTO, SpecificationTableSubDataDTO, SpecificationSubCatTableDTO } from '../../../models/model';
import { ConfigService } from '../../../shared/config.service';
import { Helper } from '../../../shared/helper';
import { EquipmentService } from '../../equipment/equipment.service';
import { FileUploadForDocComponent } from '../../file-upload-for-doc/file-upload-for-doc.component';
import { LocationService } from '../../location/location.service';
import { LookUpService } from '../../LookUpCategory/lookup.service';
import { projectsetupService } from '../../projectsetup/projectsetup.service';
import { CleanRoomService } from '../clean-room.service';
import { ModalBasicComponent } from '../../../shared/modal-basic/modal-basic.component';
import { FileUploader } from 'ng2-file-upload';
import { IndividualDocumentItemWorkflowComponent } from '../../individual-document-item-workflow/individual-document-item-workflow.component';
import { DepartmentService } from '../../department/department.service';
import { AdminComponent } from '../../../layout/admin/admin.component';

const URL_For_Upload = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'app-add-clean-room',
  templateUrl: './add-clean-room.component.html',
  styleUrls: ['./add-clean-room.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AddCleanRoomComponent implements OnInit {

  @ViewChild('formWizard') formWizard: any;
  @ViewChild('bulkSpecificationModal') public bulkSpecificationModal: ModalBasicComponent;
  @ViewChild('fileupload') private file: FileUploadForDocComponent;
  @ViewChild('viewFileupload') private viewFileupload: FileUploadForDocComponent;
  @ViewChild('roomStatusModal') roomStatusModal: any;
  @ViewChild("individualDocumentItemWorkflow") individualDocumentItemWorkflow: IndividualDocumentItemWorkflowComponent;
  @ViewChild('myTable') table: any;
  permissionModal: Permissions = new Permissions(this.helper.CLEAN_ROOM_VALUE, false);
  spinnerFlag: boolean = false;
  title: string = 'Basic Information';
  submitted: boolean = false;
  locationList: any[] = new Array();
  departmentList: any[] = new Array();
  projectList: any[] = new Array();
  departmentDropdownSettings = {
    singleSelection: false,
    text: "Select Department",
    enableSearchFilter: true,
    badgeShowLimit: 2,
    classes: "myclass custom-class",
  };
  projectDropdownSettings = {
    singleSelection: true,
    text: "Select Project",
    enableSearchFilter: true,
    badgeShowLimit: 1,
    classes: "myclass custom-class",
  };
  classificationList: any[] = new Array();
  cleenRoomInfo: CleanRoomInfo = new CleanRoomInfo();
  equipmentList: Array<IOption> = new Array<IOption>();
  specificationInfo: CleanRoomSpecificationDTO = new CleanRoomSpecificationDTO();
  filterQuery = '';
  isUploaded: boolean = false;
  excelData: SpecificationTableDataDTO[] = new Array<SpecificationTableDataDTO>();
  updatedData: SpecificationUpdatedTableDTO[] = new Array<SpecificationUpdatedTableDTO>();
  tableDataDto: SpecificationUpdatedTableDTO = new SpecificationUpdatedTableDTO();
  public validationMessage: string = "";
  fileList: any;
  public uploader: FileUploader = new FileUploader({
    url: URL_For_Upload,
    isHTML5: true
  });
  enableImportButton: boolean = false;
  rows = [];
  public editingTest : any[][][] = [];
  editCategory = {};
  editSubCategory: any[][] =[];
  disableAddButton = {};
  validationStatusList = new Array();
  cleanRoomStatusDTO: CleanRoomStatusDTO = new CleanRoomStatusDTO();
  validSpecificationTable: boolean = true;
  fileFlag: boolean = false;
  getStatus: any[] = new Array();
  dataIndex: number = 0;
  disableAddCategory: boolean;
  disableAddSubCategory: boolean;

  constructor(public helper: Helper, public permissionService: ConfigService, public projectService: projectsetupService,
    public locationService: LocationService, public lookUpService: LookUpService, public equipmentService: EquipmentService,
    public cleanRoomService: CleanRoomService, private route: ActivatedRoute, private router: Router,
    public departmentService: DepartmentService, private configService: ConfigService, private adminComponent: AdminComponent) { }

  ngOnInit() {
    this.permissionService.loadPermissionsBasedOnModule(this.helper.CLEAN_ROOM_VALUE).subscribe(result => {
      this.permissionModal = result;
    });
    this.loadAllActiveLocations();
    this.loadRoomClassifications();
    let rowId = this.route.snapshot.params["id"];
    if (rowId)
      this.loadDataOnEdit(rowId);
    else
      this.loadCurrentLocationOfProject();
  }

  ngAfterView() {
  }

  loadAllActiveLocations() {
    this.locationService.loadAllActiveLocations().subscribe(jsonResp => {
      this.locationList = jsonResp.result;
    });
  }

  loadRoomClassifications() {
    this.lookUpService.getlookUpItemsBasedOnCategory("cleanroomClassification").subscribe(jsonResp => {
      if (jsonResp.result == "success") {
        this.classificationList = jsonResp.response;
      }
    });
  }

  loadCurrentLocationOfProject() {
    this.projectService.loadCurrentLocationOfProject().subscribe(jsonResp => {
      if (jsonResp.result) {
        this.cleenRoomInfo.locationId = jsonResp.result.id;
        this.onChangeLocation(jsonResp.result.id);
      }
    });
  }

  navigatePrevious() {
    this.formWizard.previous();
  }

  navigateNext() {
    this.formWizard.next();
  }

  onStepChange(event) {
    this.title = event.title;
    this.submitted = false;
    switch (this.title) {
      case 'Specification':
        setTimeout(() => {
          $('#specLength').focus();
        }, 600);
        break;
      case 'Workflow Configurtion':
        this.loadDocumentTimeline(this.cleenRoomInfo.id);
        break;
      case 'Summary':
        let timer = setInterval(() => {
          if (this.viewFileupload) {
            this.viewFileupload.loadFileListForEdit(this.cleenRoomInfo.id, this.cleenRoomInfo.cleanRoomCode).then((result) => {
              this.fileFlag = result;
              clearInterval(timer);
            }).catch((err) => {
              clearInterval(timer);
            });
          }
        }, 1000);
        break;
      default:
        break;
    }
  }

  loadDocumentTimeline(id) {
    this.spinnerFlag = true;
    this.getStatus = [];
    this.permissionService.HTTPGetAPI("individualDocumentFlow/loadApproveTimeLine/" + id + "/" + this.helper.CLEAN_ROOM_VALUE).subscribe((resp) => {
      this.spinnerFlag = false;
      this.getStatus = resp;
    }, (err) => {
      this.spinnerFlag = false;
    });
  }

  onChangeLocation(locId) {
    if (locId) {
      this.cleenRoomInfo.departments = [];
      this.cleenRoomInfo.project = [];
      this.cleenRoomInfo.equipments = [];
      this.loadDepartmentsOnLocation(locId);
      this.loadProjectsOnLocation(locId);
      this.loadEquipmentsOnLocation(locId);
    }
  }

  loadDepartmentsOnLocation(locId) {
    this.departmentService.loadDepartmentOnLocation(locId).subscribe(jsonResp => {
      this.departmentList = jsonResp.result.map(m => ({ id: m.id, itemName: m.value }));
    })
  }

  loadProjectsOnLocation(locId) {
    this.permissionService.HTTPGetAPI("projectsetup/loadProjectsOfUserAndCreatorForLocationAndProjectType/" + locId + '/' + this.helper.PROJECT_TYPE_CLEAN_ROOM).subscribe(response => {
      this.projectList = response.projectList.map(option => ({ id: option.id, itemName: option.projectName }));
    });
  }

  loadEquipmentsOnLocation(locId) {
    let ids = [];
    ids.push(locId);
    this.equipmentService.loadActiveEquipmentsForLocations(ids).subscribe(jsonResp => {
      this.equipmentList = jsonResp.result.map(m => ({ value: m.id, label: m.name }));
    });
  }

  saveBasicInfo(formIsValid, userRemarks?) {
    this.submitted = true;
    if (formIsValid) {
      this.spinnerFlag = true;
      // get location Name
      let location = this.locationList.filter(f => this.cleenRoomInfo.locationId == f.id).map(m => m.name);
      if (location.length > 0)
        this.cleenRoomInfo.locationName = location[0];
      // get department Name
      this.cleenRoomInfo.departmentName = this.cleenRoomInfo.departments.map(m => ' ' + m.itemName).toString();
      // get project Name
      this.cleenRoomInfo.projectId = this.cleenRoomInfo.project.map(m => m.id)[0];
      let project = this.projectList.filter(f => this.cleenRoomInfo.projectId == f.id).map(m => m.itemName);
      if (project.length > 0)
        this.cleenRoomInfo.projectName = project[0];
      this.cleenRoomInfo.userRemarks = userRemarks;
      this.cleenRoomInfo.specificationInfo = this.specificationInfo
      this.cleanRoomService.saveOrUpdateRoom(this.cleenRoomInfo).subscribe(jsonResp => {
        this.submitted = false;
        this.spinnerFlag = false;
        if (jsonResp.result) {
          if (this.cleenRoomInfo.id == 0) {
            swal({
              title: 'Success',
              text: this.cleenRoomInfo.roomName + ' created successfully',
              type: 'success',
              timer: 2000, showConfirmButton: false
            });
            this.cleenRoomInfo = jsonResp.result;
            this.specificationInfo = this.cleenRoomInfo.specificationInfo 
            this.specificationInfo.specificationTableData = jsonResp.result.sampleSpecTableData;
            this.specificationInfo.specificationTableInfo = jsonResp.result.newSampleSpecTableData;
            for(let i=0; i<this.specificationInfo.specificationTableInfo.length; i++){
              this.editSubCategory[i] = [];
              this.editingTest[i] = [];
              for(let j=0; j<this.specificationInfo.specificationTableInfo[i].subCategoryList.length; j++){
                this.editSubCategory[i][j] = false;
                this.editingTest[i][j]=[];
                for(let k=0; k<this.specificationInfo.specificationTableInfo[i].subCategoryList[j].specificationTableSubData.length; k++){
                  this.editingTest[i][j][k] = true;
                }
              }
            }
          } else {
            swal({
              title: 'Success',
              text: this.cleenRoomInfo.roomName + ' updated successfully',
              type: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            this.cleenRoomInfo = jsonResp.result;
          }
          this.cleenRoomInfo.project = [{ id: jsonResp.result.projectId, itemName: jsonResp.result.projectName }];
          this.navigateNext();
        } else {
          swal({
            title: 'Error',
            text: 'Error in ' + (this.cleenRoomInfo.id == 0 ? "saving" : "updating") + ' Room ' + this.cleenRoomInfo.roomName,
            type: 'error',
            timer: 2000, showConfirmButton: false
          })
        }
      }, error => {
        this.spinnerFlag = false;
      })
    }
  }

  onlyNumber(event) {
    const pattern = /[0-9]$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 5 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
    if (event.keyCode == 189 || event.keyCode == 187)
      event.preventDefault();
    this.calculateArea();
  }

  calculateArea() {
    if (this.specificationInfo.length && this.specificationInfo.width && this.specificationInfo.height) {
      this.specificationInfo.totalArea = this.specificationInfo.length * this.specificationInfo.width * this.specificationInfo.height;
    } else {
      this.specificationInfo.totalArea = '';
    }
  }

  resetBulk() {
    this.validationMessage = "";
    this.uploader.queue = new Array();
  }

  closeBulkSpecificationModel() {
    this.isUploaded = false;
    this.excelData = [];
    this.updatedData = [];
    this.ngOnInit();
  }

  sampleSpecificationDownload() {
    this.bulkSpecificationModal.spinnerShow();
    this.cleanRoomService.downloadSampleSpecification(this.cleenRoomInfo).subscribe(res => {
      this.bulkSpecificationModal.spinnerHide();
      var blob: Blob = this.helper.b64toBlob(res.body, 'application/xls');
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, 'sampleRoomSpecification.xls');
      } else {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'sampleRoomSpecification.xls';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }, err => this.bulkSpecificationModal.spinnerHide());
  }

  extractFile(event: any) {
    this.validationMessage = "";
    if (event.target.files[0].name.match('.xls')) {
      this.fileList = event.target.files;
      if (this.uploader.queue.length > 1) {
        this.uploader.queue = new Array(this.uploader.queue[1]);
      }
      this.onClickOfUploadButton();
      event.target.value = '';
    } else {
      this.validationMessage = "Please upload .xls file";
    }
  }

  onClickOfUploadButton() {
    this.bulkSpecificationModal.spinnerShow();
    if (this.fileList.length > 0) {
      let file: File = this.fileList[0];
      let formData: FormData = new FormData();
      formData.append('file', file, file.name);
      formData.append('classification', this.cleenRoomInfo.classification);
      this.cleanRoomService.extractExcelFile(formData).subscribe(resp => {
        this.bulkSpecificationModal.spinnerHide();
        let dataList = resp.list;
        if (!this.helper.isEmpty(dataList)) {
          this.validationMessage = file.name + " file read successfully done";
          this.excelData = dataList;
          this.excelData.forEach(u => {
            this.checkDescription(this.excelData, u);
          });
          this.isUploaded = true;
          this.disableImportButton(this.excelData);
        }
      }, err => {
        this.validationMessage = 'Error in Excel File';
        this.bulkSpecificationModal.spinnerHide();
      }
      );
    }
  }

  checkDescription(list: any[], rowData) {
    if (!this.helper.isEmpty(list) && rowData.field)
      rowData.fieldValMsg = '';
    else
      rowData.fieldValMsg = 'Description is required';
    this.disableImportButton(list);
  }

  disableImportButton(list) {
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if (this.helper.isEmpty(element.fieldValMsg)) {
        this.enableImportButton = false;
      } else {
        this.enableImportButton = true;
        break;
      }
    }
  }

  importData() {
    let uploadDto = new CleanRoomSpecificationDTO();
    uploadDto = this.specificationInfo
    uploadDto.specificationTableData = this.excelData;
    this.cleanRoomService.uploadExcelFile(uploadDto).subscribe(resp => {
      this.spinnerFlag = true;
      if (resp.successFlag) {
        this.updatedData = resp.data.specificationTableInfo;
        this.specificationInfo.newOrUpdatedRecord = resp.data.newOrUpdatedRecord;
        if (this.updatedData.length > 0) {
          var oldLength = this.specificationInfo.specificationTableInfo.length;
          this.updatedData.forEach(item => {
            this.specificationInfo.specificationTableInfo.push(item);
          })
          for(let i = oldLength; i<this.specificationInfo.specificationTableInfo.length; i++){
            this.editSubCategory[i] = [];
            this.editingTest[i] = [];
            for(let j=0; j<this.specificationInfo.specificationTableInfo[i].subCategoryList.length; j++){
              this.editSubCategory[i][j] = false;
              this.editingTest[i][j]=[];
              for(let k=0; k<this.specificationInfo.specificationTableInfo[i].subCategoryList[j].specificationTableSubData.length; k++){
                this.editingTest[i][j][k] = false;
              }
            }
          }
          this.spinnerFlag = false;
          this.bulkSpecificationModal.hide();
          swal({
            title: 'Success',
            text: 'Specification table data imported successfully',
            type: 'success',
            timer: 2000, showConfirmButton: false,
            onClose: () => {
              this.excelData = new Array();
              this.updatedData = new Array();
            }
          });   
        }
      } else {
        this.spinnerFlag = false;
          swal({
            title: 'Error',
            text: 'Error in uploading the data',
            type: 'error',
            timer: 2000, showConfirmButton: false
          })
         
      }
    }, err => {
      this.bulkSpecificationModal.spinnerHide();
      this.spinnerFlag = false;
    });
  }

  addItemCategory() {
    let index = this.specificationInfo.specificationTableInfo.length;
    let subIndex = this.specificationInfo.specificationTableInfo[index-1].subCategoryList.length;
    let length = this.specificationInfo.specificationTableInfo.filter(f => this.helper.isEmpty(f.category)).length;
    if (length == 0) {
      let dto = new SpecificationUpdatedTableDTO();
      let subCat = new SpecificationSubCatTableDTO();
      let subDto = new SpecificationTableSubDataDTO();
      if(index != 0)
        subCat.order = this.specificationInfo.specificationTableInfo[index-1].subCategoryList[subIndex-1].order+1;
      else
        subCat.order = 1;
      subDto.order = 1;
      subCat.specificationTableSubData.push(subDto);
      dto.subCategoryList.push(subCat)
      this.specificationInfo.specificationTableInfo.push(dto);
      this.disableAddCategory = false;
      for(let i=0; i<this.specificationInfo.specificationTableInfo.length; i++){
        this.editSubCategory[i] = [];
        this.editingTest[i] = [];
        if(i == this.specificationInfo.specificationTableInfo.length-1)
          this.editCategory[i] = true;
        for(let j=0; j<this.specificationInfo.specificationTableInfo[i].subCategoryList.length; j++){
          if(i==this.specificationInfo.specificationTableInfo.length-1 && j == this.specificationInfo.specificationTableInfo[i].subCategoryList.length-1)
            this.editSubCategory[i][j] = true;
          else
            this.editSubCategory[i][j] = false;
          this.editingTest[i][j]=[];
          for(let k=0; k<this.specificationInfo.specificationTableInfo[i].subCategoryList[j].specificationTableSubData.length; k++){
            if(i==this.specificationInfo.specificationTableInfo.length-1 && j==this.specificationInfo.specificationTableInfo[i].subCategoryList.length-1 && k==0)
              this.editingTest[i][j][k] = true;
            else
              this.editingTest[i][j][k] = false; 
          }
        }
      }
      if (index != 0)
        this.editCategory[index - 1] = false;
      setTimeout(() => {
        $('#category_' + index).focus();
      }, 200);
    } else {
      this.disableAddCategory = true;
    }
  }

  addItemClick(catIndex, subCatIndex, rowIndex) {
    let index = this.specificationInfo.specificationTableInfo[catIndex].subCategoryList[subCatIndex].specificationTableSubData.length;
    let dto = new SpecificationTableSubDataDTO();
    dto.id = 0;
    dto.order = this.specificationInfo.specificationTableInfo[catIndex].subCategoryList[subCatIndex].specificationTableSubData[rowIndex].order+1;
    this.specificationInfo.specificationTableInfo[catIndex].subCategoryList[subCatIndex].specificationTableSubData.push(dto);
    this.disableAddButton[catIndex] = false;
    if (index == 0)
      for(let i=0; i<this.specificationInfo.specificationTableInfo.length; i++){
        this.editingTest[i] = [];
        for(let j=0; j<this.specificationInfo.specificationTableInfo[i].subCategoryList.length; j++){
          this.editingTest[i][j]=[];
          for(let k=0; k<this.specificationInfo.specificationTableInfo[i].subCategoryList[j].specificationTableSubData.length; k++){
            this.editingTest[i][j][k] = false;
          }
        }
      }
      
    this.editingTest[catIndex][subCatIndex][index] = true;

    if (index != 0)
      this.editingTest[catIndex][subCatIndex][index - 1] = false;
    setTimeout(() => {
      $('#subCategory_' + catIndex + subCatIndex).focus();
    }, 200);
  }

  editCategoryRow(rowIndex, element) {
    for (let index = 0; index < this.specificationInfo.specificationTableInfo.length; index++) {
      if (rowIndex == index) {
        this.editCategory[index] = true;
      } else
        this.editCategory[index] = false;
    }
    setTimeout(() => {
      $('#' + element + '_' + rowIndex).focus();
    }, 200);
  }

  editSubCategoryRow(categoryIndex, rowIndex, element) {
    for (let index = 0; index < this.specificationInfo.specificationTableInfo[categoryIndex].subCategoryList.length; index++) {
      if (rowIndex == index) {
        this.editSubCategory[categoryIndex][index] = true;
      } else
        this.editSubCategory[categoryIndex][index] = false;
    }
    setTimeout(() => {
      $('#' + element + '_' + categoryIndex + rowIndex).focus();
    }, 200);
  }

  editRow(categoryIndex, rowIndex, subCatIndex, element) {
    this.validSpecificationTable = true;
    for (let index = 0; index < this.specificationInfo.specificationTableInfo[categoryIndex].subCategoryList[subCatIndex].specificationTableSubData.length; index++) {
      if (rowIndex == index) {
        this.editingTest[categoryIndex][subCatIndex][index] = true;
      } else
        this.editingTest[categoryIndex][subCatIndex][index] = false;
    }
    setTimeout(() => {
      $('#' + element + '_' + categoryIndex + subCatIndex + rowIndex).focus();
    }, 200);
  }

  updateCategory(event, rowIndex, cell) {
    this.specificationInfo.specificationTableInfo[rowIndex][cell] = event.target.value;
    let length = this.specificationInfo.specificationTableInfo.filter(f => this.helper.isEmpty(f.category)).length;
    if (length == 0) {
      this.disableAddCategory = false;
      this.validSpecificationTable = true;
    } else {
      this.disableAddCategory = true;
      this.validSpecificationTable = false;
    }
  }

  updateSubCategory(event, catIndex, rowIndex, cell) {
    this.specificationInfo.specificationTableInfo[catIndex].subCategoryList[rowIndex][cell] = event.target.value;
  }

  updateValue(event, rowIndex, subCatIndex, cell, row) {
    this.specificationInfo.specificationTableInfo[rowIndex].subCategoryList[subCatIndex].specificationTableSubData[row.$$index][cell] = event.target.value;
    let length = this.specificationInfo.specificationTableInfo[rowIndex].subCategoryList[subCatIndex].specificationTableSubData.filter(f => this.helper.isEmpty(f.field)).length;
    if (length == 0) {
      this.disableAddButton[rowIndex] = false;
      this.validSpecificationTable = true;
    } else {
      this.disableAddButton[rowIndex] = true;
      this.validSpecificationTable = false;
    }
  }

  onclickDelete(catIndex, subCatIndex, index) {
    //Finding the sub array in specificationTable and deleting the data
    let length = this.specificationInfo.specificationTableInfo[catIndex].subCategoryList[subCatIndex].specificationTableSubData.length;
    if(length > 1) {
      this.specificationInfo.specificationTableInfo[catIndex].subCategoryList[subCatIndex].specificationTableSubData.splice(index, 1);
      this.disableAddButton[catIndex] = false;
    }
  }

  deleteCategory(catIndex) {
    let length = this.specificationInfo.specificationTableInfo.length;
    if(length > 1) {
      this.specificationInfo.specificationTableInfo.splice(catIndex, 1);
      this.disableAddButton[catIndex] = false;
    }
  }

  deleteSubCategory(catIndex, subIndex) {
    //Finding the sub array in specificationTable and deleting the data
    let length = this.specificationInfo.specificationTableInfo[catIndex].subCategoryList.length;
    if(length > 1) {
      this.specificationInfo.specificationTableInfo[catIndex].subCategoryList.splice(subIndex, 1);
      this.disableAddButton[catIndex] = false;
    }
  }

  saveSpecification(userRemarks?) {
    this.submitted = true;
    var length = 0; 
    length = this.specificationInfo.specificationTableInfo.filter(f => this.helper.isEmpty(f.category)).length;
    for(let i=0; i< this.specificationInfo.specificationTableInfo.length; i++) {
        for(let j=0; j< this.specificationInfo.specificationTableInfo[i].subCategoryList.length; j++) {
          length = length + this.specificationInfo.specificationTableInfo[i].subCategoryList[j].specificationTableSubData.filter(f => this.helper.isEmpty(f.field)).length;
        }
    }
    this.validSpecificationTable = length == 0 ? true : false;
    if (this.validSpecificationTable) {
      //Only the specification table data is changed and specification is moved to Basic Information Tab
      this.spinnerFlag = true;
      this.specificationInfo.userRemarks = userRemarks;
      this.cleanRoomService.saveOrUpdateRoomSpecification(this.specificationInfo).subscribe(jsonResp => {
        this.submitted = false;
        this.filterQuery = '';
        this.editCategory = [];
        this.editSubCategory = [];
        this.editingTest = [];
        this.disableAddButton = [];
        this.spinnerFlag = false;
        if (jsonResp.successFlag) {
          this.filterQuery = '';
          this.editSubCategory = [];
          this.editingTest = [];
          this.editCategory = [];
          this.disableAddButton = [];
          if (this.specificationInfo.id == 0) {
            swal({
              title: 'Success',
              text: 'Specification created successfully',
              type: 'success',
              timer: 2000, showConfirmButton: false
            });
          } else {
            swal({
              title: 'Success',
              text: 'Specification updated successfully',
              type: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          }
          this.specificationInfo = jsonResp.data;
          for(let i=0; i<this.specificationInfo.specificationTableInfo.length; i++){
            this.editSubCategory[i] = [];
            this.editingTest[i] = [];
            for(let j=0; j<this.specificationInfo.specificationTableInfo[i].subCategoryList.length; j++){
              this.editSubCategory[i][j] = false;
              this.editingTest[i][j]=[];
              for(let k=0; k<this.specificationInfo.specificationTableInfo[i].subCategoryList[j].specificationTableSubData.length; k++){
                this.editingTest[i][j][k] = false;
              }
            }
          }
        } else {
          swal({
            title: 'Error',
            text: 'Error in ' + (this.specificationInfo.id == 0 ? "saving" : "updating") + ' Specification',
            type: 'error',
            timer: 2000, showConfirmButton: false
          })
        }
      }, error => {
        this.spinnerFlag = false;
      })
    }
  }

  openSuccessCancelSwal(type, formIsValid) {
    this.submitted = true;
    let flag = true;
    if (type == 'tab2') {
      var length = 0;
      length = this.specificationInfo.specificationTableInfo.filter(f => this.helper.isEmpty(f.category)).length;
      for(let i=0; i< this.specificationInfo.specificationTableInfo.length; i++) {
          for(let j=0; j< this.specificationInfo.specificationTableInfo[i].subCategoryList.length; j++) {
            length = length + this.specificationInfo.specificationTableInfo[i].subCategoryList[j].specificationTableSubData.filter(f => this.helper.isEmpty(f.field)).length;
          }
      }
      flag = length == 0 ? true : false;
      this.validSpecificationTable = flag;
    }
    if (flag) {
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
            if (type == "tab1") {
              if(formIsValid)
                this.saveBasicInfo(formIsValid, userRemarks);
            } else  
              this.saveSpecification(userRemarks);
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

  
  loadSpecificationOnId(rowId) {
    if (rowId) {
      this.spinnerFlag = true;
      this.permissionService.HTTPGetAPI("cleanroom/loadSpecificationDataBasedOnId/" + rowId).subscribe(jsonResp => {
        if (jsonResp.result) {
          // this.specificationInfo.specificationTableData = jsonResp.result.specificationTableData;
          this.specificationInfo.specificationTableInfo = jsonResp.result.specificationTableInfo;
          this.spinnerFlag = false;
        }
      }, error => {
        this.spinnerFlag = false;
      });
    }
  }

  loadDataOnEdit(rowId) {
    this.spinnerFlag = true;
    this.cleanRoomService.loadRoomInfoOnId(rowId).subscribe(jsonResp => {
      if (jsonResp.result) {
        this.cleenRoomInfo = jsonResp.result;
        this.cleenRoomInfo.departmentName = this.cleenRoomInfo.departments.map(m => ' ' + m.itemName).toString();
        this.cleenRoomInfo.project = [{ id: jsonResp.result.projectId, itemName: jsonResp.result.projectName }];
        if (jsonResp.result.specification)
          this.specificationInfo = jsonResp.result.specification;
        for(let i=0; i<this.specificationInfo.specificationTableInfo.length; i++){
          this.editSubCategory[i] =[];
          this.editingTest[i] = [];
          for(let j=0; j<this.specificationInfo.specificationTableInfo[i].subCategoryList.length; j++){
            this.editSubCategory[i][j] = false;
            this.editingTest[i][j]=[];
            for(let k=0; k<this.specificationInfo.specificationTableInfo[i].subCategoryList[j].specificationTableSubData.length; k++){
              this.editingTest[i][j][k] = false;
            }
          }
        }
        this.loadDepartmentsOnLocation(this.cleenRoomInfo.locationId);
        this.loadProjectsOnLocation(this.cleenRoomInfo.locationId);
        this.loadEquipmentsOnLocation(this.cleenRoomInfo.locationId);
        this.file.loadFileListForEdit(this.cleenRoomInfo.id, this.cleenRoomInfo.cleanRoomCode).then(() => this.spinnerFlag = false);
        this.spinnerFlag = false;
      }
    }, error => {
      this.spinnerFlag = false;
    })
  }

  saveAttachments() {
    this.file.uploadFileList(this.cleenRoomInfo, this.helper.CLEAN_ROOM_VALUE, this.cleenRoomInfo.cleanRoomCode).then(resp => {
      let msg = resp ? 'File(s) uploaded successfully' : 'File(s) removed successfully';
      swal({
        title: 'Success',
        text: msg,
        type: 'success',
        timer: 2000, showConfirmButton: false
      });
    });
  }

  equipmentRedirection(rowId) {
    this.router.navigate(["equipment"], { queryParams: { id: rowId, url: window.location.pathname } })
  }

  onClickRoomStatusModal() {
    this.loadValidationStatus();
    this.cleanRoomStatusDTO = new CleanRoomStatusDTO();
    this.cleanRoomStatusDTO.validationStatus = this.cleenRoomInfo.validationStatus;
    this.cleanRoomStatusDTO.comments = "";
    this.roomStatusModal.show();
  }

  loadValidationStatus() {
    this.permissionService.HTTPPostAPI({ "categoryName": "projectSetupValidationStatus", "orgId": 0 }, "lookup/getCategoryItemByName").subscribe(result => {
      this.validationStatusList = result.response;
    });
  }

  onCloseRoomStatusModal() {
    this.roomStatusModal.hide();
  }

  saveValidationStatus() {
    this.spinnerFlag = true;
    this.cleenRoomInfo.validationStatus = this.cleanRoomStatusDTO.validationStatus;
    this.cleenRoomInfo.userRemarks = this.cleanRoomStatusDTO.comments;
    this.permissionService.HTTPPostAPI(this.cleenRoomInfo, "cleanroom/saveCleanRoomValidationStatus").subscribe(resp => {
      this.spinnerFlag = false;
      this.roomStatusModal.hide();
    }, error => {
      this.spinnerFlag = false;
      this.roomStatusModal.hide();
    });
  }

  publishCleanRoom() {
    let ids = [];
    ids.push(this.cleenRoomInfo.id);
    if (ids.length > 0) {
      this.spinnerFlag = true;
      this.cleanRoomService.bulkRoomItemPublish(ids).subscribe(jsonResp => {
        if (jsonResp.successFlag) {
          this.spinnerFlag = false;
          swal({
            title: 'Success',
            text: jsonResp.message,
            type: 'success',
            timer: 2000, showConfirmButton: false
          });
          this.router.navigate(["Clean-room/view-cleanroom"]);
        }
      }, error => {
        this.spinnerFlag = false;
      })
    }
  }

  onClickProject(projectId: any) {
    this.router.navigate(['/Project-setup/view-projectsetup'], { queryParams: { id: projectId, status: document.location.pathname }, skipLocationChange: true });
  }

  openIndividualWorkflowSetup() {
    this.individualDocumentItemWorkflow.openModal(this.cleenRoomInfo.id, this.cleenRoomInfo.cleanRoomCode);
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  refreshSearch() {
    this.filterQuery = '';
  }

}