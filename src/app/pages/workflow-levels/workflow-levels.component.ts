import { Component, OnInit,ViewEncapsulation} from '@angular/core';
import { WorkFlowLevelsService } from './workflow-levels.service';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { WorkFlowLevelDTO } from '../../models/model';
import { Helper } from '../../shared/helper';
import { AdminComponent } from '../../layout/admin/admin.component';
import { ConfigService } from '../../shared/config.service';
import { Permissions } from '../../shared/config';
@Component({
  selector: 'app-workflow-levels',
  templateUrl: './workflow-levels.component.html',
  styleUrls: ['./workflow-levels.component.css', '../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class WorkflowLevelsComponent implements OnInit {
  workFlowLevelList: WorkFlowLevelDTO[] = new Array();
  workFlowLevelDTO: WorkFlowLevelDTO = new WorkFlowLevelDTO();
  filterQuery = '';
  submitted: boolean = false;
  iserrorinSaving: boolean = false;
  isSuccessinSaving: boolean = false;
  lookUpkeyExists: boolean = false;
  categoryKeyExists: boolean = false;
  addItemAlreadyclicked: boolean = false;
  isFieldsFilled: boolean = false;
  isdocumentlist = false;
  public rowsOnPage = 10;
  public sortBy = '';
  public sortOrder = 'desc';
  public isLoading: boolean = false;
  isUpdating: boolean = false;
  isDeleting: boolean = false;
  isCancel: boolean = false;
  public isisLoading = false;
  pleaseFill: string = "Please Fill";
  rows = [];
  editing = {};
  docItemList: any;
  permissionModal: Permissions = new Permissions("154", false);
  spinnerFlag:boolean = false;
  isSave:boolean = false;
  isLevelUsed: boolean=false;
  constructor( public permissionService: ConfigService,
    private adminComponent: AdminComponent,public service:WorkFlowLevelsService, public helper: Helper) { }

  ngOnInit() {
    this.permissionService.loadPermissionsBasedOnModule("154").subscribe(resp => {
      this.permissionModal = resp
    });
   this. loadWorkFlowLevels();
   this.adminComponent.setUpModuleForHelpContent("154");
  }

  loadWorkFlowLevels(){
      this.service.loadAllWorkFlow().subscribe((resp) => {
        this.workFlowLevelList=resp.list;
      });
  }
  addItemClick() {
    this.addItemAlreadyclicked = true;
    let lookUpItemListDuplicate = new Array();
    let curLookUp = new WorkFlowLevelDTO();
    curLookUp.workFlowLevelName = "";
    curLookUp.activeFlag = "Y";
    curLookUp.id = 0;
    for (var i = 1; i <= this.workFlowLevelList.length; i++) {
      lookUpItemListDuplicate[i] = this.workFlowLevelList[i - 1];
    }
    lookUpItemListDuplicate[0] = Object.assign({}, curLookUp);
    this.workFlowLevelList = lookUpItemListDuplicate;
    this.editing[0] = true;
    this.isCancel=true;
  }
  editRow(rowIndex) {
    this.isCancel=true;
    for (let index = 0; index < this.workFlowLevelList.length; index++) {
      if (rowIndex == index){
        this.editing[index] = true;
      }
      else
        this.editing[index] = false;
    }
  }
  updateValue(event, cell, cellValue, row) {
    let keyCount: number = 0;
    this.isLevelUsed = false;
    if(cell === "activeFlag" && event.target.value==="N"){
      this.service.isExist(row.id).subscribe((resp) => {
        let responseMsg: string = resp.result;
        if (responseMsg === "success") {
          this.isLevelUsed = true;
          swal({
            title:'Info',
            text:'Cannot deactivate this level as it is used in a workflow',
            type:'warning',
            timer:this.helper.swalTimer,
            showConfirmButton:false,
          });
          this.editing[row.$$index] = false;
          this.loadWorkFlowLevels();
        }else
        this.workFlowLevelList[row.$$index][cell] = event.target.value;
      });
    }else
    this.workFlowLevelList[row.$$index][cell] = event.target.value;
    this.lookUpkeyExists = this.checkIfLookUpKeysExist(event.target.value);
    if (!this.lookUpkeyExists) {
      this.workFlowLevelList[row.$$index][cell] = event.target.value;
    }
  }
  updateRow(row, index, id) {
    setTimeout(() => {
      if(!this.isLevelUsed){
      this.spinnerFlag = true;
    // var duplacateValueFilterValue: any[] = this.workFlowLevelList.filter(data => data.workFlowLevelName === row.workFlowLevelName && data.activeFlag.includes(row.activeFlag));
    // var duplacateValue = duplacateValueFilterValue.filter(val => val.id!==0);
    if(row.workFlowLevelName.length > 20){
    this.spinnerFlag = false;
    swal({
      title:'Warning!',
      text:'Level name should not be more than 18 Characters',
      type:'info',
      timer:this.helper.swalTimer,
      showConfirmButton:false,
    });
     return
    }
//     if(duplacateValue.length != 0){
//       this.spinnerFlag = false;
//         swal({
//           title:'Info',
//           text:"Workflow Level Name Exists",
//           type:'warning',
//           timer:this.helper.swalTimer,
//           showConfirmButton:false,
//         });
//   return
// }
    if(row.workFlowLevelName!=""){
    this.editing[index] = false;
    this.isFieldsFilled = false;
    this.workFlowLevelDTO.workFlowLevelName = row.workFlowLevelName;
    this.workFlowLevelDTO.activeFlag = row.activeFlag;
    this.workFlowLevelDTO.id = row.id;
    let keyBoolean: boolean = this.checkIfLookUpKeysExist(row.key);
    let fillBoolean: boolean = this.checkIfFieldsAreFilled(this.workFlowLevelDTO);
    if (!keyBoolean && !fillBoolean) {
      this.service.saveWorkFlow(this.workFlowLevelDTO).subscribe((resp) => {
        let responseMsg: string = resp.result;
        if (responseMsg === "success") {
          this.spinnerFlag = false;
          swal({
            title:'Success',
            text:'Level Saved Successfully',
            type:'success',
            timer:this.helper.swalTimer,
            showConfirmButton:false,
          });
          this.addItemAlreadyclicked = false;
          this. loadWorkFlowLevels();
        }else if (responseMsg === "Work Flow Level Name Exists") {
          this.spinnerFlag = false;
          swal({
            title:'Info',
            text:"Workflow Level Name Exists",
            type:'warning',
            timer:this.helper.swalTimer,
            showConfirmButton:false,
          });
          this.addItemAlreadyclicked = false;
          this. loadWorkFlowLevels();
        }
        else {
          this.spinnerFlag = false;
          swal({
            title:'Not Updated!',
            text:'Please enter valid value',
            type:'error',
            timer:this.helper.swalTimer,
            showConfirmButton:false,
          });
          this.addItemAlreadyclicked = false;
          this. loadWorkFlowLevels();
        }
      },
        err => {
          this.spinnerFlag = false;
          swal({
            title:'Not Updated!',
            text:'Please enter valid value',
            type:'error',
            timer:this.helper.swalTimer,
            showConfirmButton:false,
          });
          this.addItemAlreadyclicked = false;
          this. loadWorkFlowLevels();
        }
      );
    }
  }
  else {
    this.spinnerFlag = false;
    swal({
      title:'Please Fill All Details!',
      text:'',
      type:'error',
      timer:this.helper.swalTimer,
      showConfirmButton:false,
    }
    );
  }
}
    }, 1000);

  }

  checkIfFieldsAreFilled(workFlowLevelDTO: WorkFlowLevelDTO): boolean {
    let fieldBoolean: boolean = false;
    if (this.workFlowLevelDTO.id == 0) {
      if (this.workFlowLevelDTO.workFlowLevelName === this.pleaseFill) {
        fieldBoolean = true;
        this.isFieldsFilled = true;
      }
    }
    return fieldBoolean;

  }
  openSuccessCancelSwal(deleteObj, index) {
    var classObject = this;
    swal({
      title: 'Are you sure?',
      text: 'You wont be able to revert',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonClass: 'btn btn-success m-r-10',
      cancelButtonClass: 'btn btn-danger',
      allowOutsideClick: false,
      buttonsStyling: false
    }).then(function () {
      classObject.deleteLookUp(deleteObj, index);
    });
  }
  deleteLookUp(dataObj, i) {


  }
  resetFormValues(form?: NgForm) {
    this.categoryKeyExists = false;
    if (form != null || form != undefined) {
      this.submitted = false;
      form.reset();
    }
  }
  checkIfLookUpKeysExist(workFlowLevelName: string): boolean {
    let retBoolean: boolean = false;
    let keyCount = 0;
    this.workFlowLevelList.forEach(element => {
      if (element.workFlowLevelName === workFlowLevelName) {
        keyCount++;
      }
      if (keyCount >= 2) {
        retBoolean = true;
      } else {
        retBoolean = false;
      }

    });
    return retBoolean;
  }

  cancel(index){
    this.isCancel=false;
    this.lookUpkeyExists=false;
    this.addItemAlreadyclicked = false;
    this.editing[index] = false;
    this.isFieldsFilled = false;
    this. loadWorkFlowLevels();
  }
}
