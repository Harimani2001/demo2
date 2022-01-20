import { Component, OnInit, ViewEncapsulation,ViewChild } from '@angular/core';
import { LookUpService } from '../lookup.service';
import { LookUpCategory, LookUpItem } from '../../../models/model';
import swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Helper } from '../../../shared/helper';
import { AdminComponent } from '../../../layout/admin/admin.component';


@Component({
  selector: 'app-lookup-item',
  templateUrl: './lookup-item.component.html',
  styleUrls: ['./lookup-item.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class LookupItemComponent implements OnInit {
  lookUpCategoryList: LookUpCategory[] = new Array();
  selectedCategory: number = 0;
  model: LookUpCategory = new LookUpCategory();
  lookUpItemList: LookUpItem[] = new Array();
  updatabaleLookUpItem: LookUpItem = new LookUpItem();
  filterQuery = '';
  addCategoryModel: LookUpCategory = new LookUpCategory();
  submitted: boolean = false;
  iserrorinSaving: boolean = false;
  isSuccessinSaving: boolean = false;
  lookUpkeyExists: boolean = false;
  categoryKeyExists: boolean = false;
  addItemAlreadyclicked: boolean = false;
  isFieldsFilled: boolean = false;
  isdocumentlist=false;
  public rowsOnPage = 10;
  public sortBy = '';
  public sortOrder = 'desc';
  public isLoading: boolean = false;
  isUpdating: boolean = false;
  isDeleting: boolean = false;
  public isisLoading = false;
  public lookUpItem: LookUpItem = new LookUpItem()
  pleaseFill: string = "Please Fill";
  rows = [];
  editing = {};
  docItemList:any;
  @ViewChild('mydatatable') table: any;
  constructor(private comp: AdminComponent,private lookUpService: LookUpService, public helper: Helper) {
  }
  ngOnInit() {
    this.getCategoriesList();
    this.comp.setUpModuleForHelpContent("111");
  }
  getCategoriesList() {
    this.lookUpService.getCategoryList().subscribe((resp) => {
      let responseMsg: string = resp.result;
      if (responseMsg === "success") {
        this.lookUpCategoryList = resp.response;
      }
    },
      err => {
      }
    );
  }
  
  categoryChanged(newCategory) {
    this.lookUpkeyExists = false;
    if (newCategory !== "0") {
      this.selectedCategory = newCategory;
      this.model.id = +newCategory;
      this.lookUpCategoryList.forEach(ele=>{
        if(ele.id==this.model.id){
          this.model.name=ele.name
        }
      })
      this.getLookUpItemsBasedOnCategory();
    } else {
      this.selectedCategory = 0;
    }

  }

editRow(rowIndex){
  for (let index = 0; index < this.lookUpItemList.length; index++) {
    if(rowIndex == index)
      this.editing[index] = true;
    else
      this.editing[index] = false;
  }
}
  getLookUpItemsBasedOnCategory() {
    this.lookUpService.getlookUpItems(this.model).subscribe((resp) => {
      let responseMsg: string = resp.result;
      if (responseMsg === "success") {
        this.lookUpItemList = resp.response;
        for(var i=0 ; i < this.lookUpItemList.length ; i++)
          this.editing[i] = false;
      }
    },
      err => {
      }
    );
  }

  updateValue(event, cell, cellValue, row) {
    let keyCount: number = 0;
    this.lookUpItemList[row.$$index][cell] = event.target.value;
    if (cell === "key") {
      this.lookUpkeyExists = this.checkIfLookUpKeysExist(row.key);
    }

  }
  updateRow(row, index, id) {
    this.editing[index] = false; 
    let keyCount: number = 0;
    this.isFieldsFilled = false;
    this.updatabaleLookUpItem.id = row.id;
    this.updatabaleLookUpItem.categoryId = row.categoryId;
    this.updatabaleLookUpItem.key = row.key;
    this.updatabaleLookUpItem.value = row.value;
    this.updatabaleLookUpItem.displayOrder = row.displayOrder;
    this.updatabaleLookUpItem.activeFlag = row.activeFlag;
    let keyBoolean: boolean = this.checkIfLookUpKeysExist(row.key);
    let fillBoolean: boolean = this.checkIfFieldsAreFilled(this.updatabaleLookUpItem);
    if (!keyBoolean && !fillBoolean) {
      this.lookUpService.updateCategoryItem(this.updatabaleLookUpItem).subscribe((resp) => {
        let responseMsg: string = resp.result;

        if (responseMsg === "success") {
          this.getLookUpItemsBasedOnCategory();

          swal(
            'Success',
            'Category Item Saved Successfully',
            'success'
          );
          this.addItemAlreadyclicked = false;

        } else {
          swal(
            'Not Updated!',
            'has  not been Updated',
            'error'
          );
        }
      },
        err => {
          swal(
            'Not Updated!',
            'has  not been Updated.',
            'error'
          );
        }
      );
    }
  }
  
  checkIfFieldsAreFilled(updatabaleLookUpItem: LookUpItem): boolean {
    let fieldBoolean: boolean = false;
    if (this.updatabaleLookUpItem.id == 0) {
      if (this.updatabaleLookUpItem.key === this.pleaseFill
        || this.updatabaleLookUpItem.value === this.pleaseFill
        || this.updatabaleLookUpItem.displayOrder === this.pleaseFill) {
        fieldBoolean = true;
        this.isFieldsFilled = true;
      }
    }
    return fieldBoolean;

  }
  openSuccessCancelSwal(deleteObj, index) {
    swal({
      title:"Write your comments here:",
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Delete',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
    })
    .then((value) => {
      if(value){
        deleteObj.userRemarks="Comments : " + value;
        this.deleteLookUp(deleteObj,index);
      }else{
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
  deleteLookUp(dataObj, i): string {
    this.isFieldsFilled = false;
    this.lookUpItem.id = dataObj.id;
    if (this.lookUpItem.id == 0) {
      swal(
        'Deleted!',
        ' Record has been deleted.',
        'success'
      ).then(responseMsg => {
        this.lookUpItemList.splice(i, 1);
      });
      this.addItemAlreadyclicked = false;
    } else {
      this.lookUpService.deleteCategoryItem(this.lookUpItem)
        .subscribe((resp) => {
          let responseMsg: string = resp.result;
          if (responseMsg === "success") {
            status = "success";
            swal(
              'Deleted!',
              ' Record has been deleted.',
              'success'
            ).then(responseMsg => {
              this.lookUpItemList.splice(i, 1);
            });
            this.addItemAlreadyclicked = false;
          } else {
            status = "failure";

            swal(
              'Not Deleted!',
              'has  not been deleted.',
              'error'
            );
          }
        }, (err) => {
          status = "failure";
          swal(
            'Not Deleted!',
            'has  not been deleted.',
            'error'
          );
        });
    }
    return status;
  }

  addCategoryClick(isFormValid) {
    this.submitted = true;
    this.isLoading = true;
    if (!isFormValid) {
      this.submitted = true;
      this.isLoading = false;
      return;
    }
    let keyTest: boolean = this.checkIfCategoryKeyExists();
    if (!keyTest) {
      this.lookUpService.addCategory(this.addCategoryModel).subscribe(result => {
        let responseMsg: string = result.result;
        if (responseMsg === "success") {
          this.isLoading = false;
          this.getCategoriesList();
          let element: HTMLElement = document.getElementById('popUpCloseId') as HTMLElement;
          element.click();

          setTimeout(() => {
            swal(
              'Saved Successfully!',
              'Category has been saved',
              'success'
            ).then(responseMsg => {

            });
          }, 200);

        } else {
          this.isLoading = false;
          this.submitted = true;
          this.iserrorinSaving = true;
        }
      },
        err => {
          this.isLoading = false;
          this.submitted = true;
          this.iserrorinSaving = true;
        }
      );

    }
  }

  addItemClick() {
    this.addItemAlreadyclicked = true;
    let lookUpItemListDuplicate = new Array();
    let curLookUp = new LookUpItem();
    curLookUp.displayOrder = this.pleaseFill;
    curLookUp.key = this.pleaseFill;
    curLookUp.value = this.pleaseFill;
    curLookUp.activeFlag = "Y";
    curLookUp.id = 0;
    curLookUp.categoryId = this.selectedCategory;
    for (var i = 1; i <= this.lookUpItemList.length; i++) {
      lookUpItemListDuplicate[i] = this.lookUpItemList[i - 1];
    }
    lookUpItemListDuplicate[0] = Object.assign({}, curLookUp);
    this.lookUpItemList = lookUpItemListDuplicate;
  }

  openMyModal(event) {
    document.querySelector('#' + event).classList.add('md-show');
  }

  resetFormValues(form?: NgForm) {

    this.categoryKeyExists = false;
    if (form != null || form != undefined) {
      this.submitted = false;
      form.reset();
    }
  }

  closeMyModal(event) {
    ((event.target.parentElement.parentElement).parentElement).classList.remove('md-show');
  }

  checkIfLookUpKeysExist(key: string): boolean {
    let retBoolean: boolean = false;
    let keyCount = 0;
    this.lookUpItemList.forEach(element => {
      if (element.key === key) {
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

  checkIfCategoryKeyExists(): boolean {
    let keyCount: number = 0;
    let retBoolean: boolean = false;
    this.lookUpCategoryList.forEach(element => {
      if (element.name === this.addCategoryModel.name) {
        keyCount++;
      }
      if (keyCount >= 1) {
        retBoolean = true;
      } else {
        retBoolean = false;
      }
    });
    this.categoryKeyExists = retBoolean;
    return retBoolean;
  }
}
