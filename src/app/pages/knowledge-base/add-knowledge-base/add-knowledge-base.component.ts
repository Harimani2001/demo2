import { FileUploadForDocComponent } from './../../file-upload-for-doc/file-upload-for-doc.component';
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { KnowledgeBaseCategory, KnowledgeBaseSubCategory, KnowledgeBaseContent, UserPrincipalDTO } from '../../../models/model';
import swal from 'sweetalert2';
import { KnowledgeBaseService } from '../knowledge-base.service';
import { Helper } from '../../../shared/helper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VendorService } from '../../vendor/vendor.service';
import { ConfigService } from '../../../shared/config.service';
import { Permissions } from '../../../shared/config';
import { AdminComponent } from '../../../layout/admin/admin.component';
@Component({
  selector: 'app-add-knowledge-base',
  templateUrl: './add-knowledge-base.component.html',
  styleUrls: ['./add-knowledge-base.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddKnowledgeBaseComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  public onContentForm: FormGroup;
  categoryList: KnowledgeBaseCategory[] = new Array();
  subcategoryList: KnowledgeBaseSubCategory[] = new Array();
  contentList: KnowledgeBaseContent[] = new Array();
  addcategoryclicked: boolean = false;
  pleaseFill: string = "Please Fill";
  editing = {};
  orgId: any;
  permissionData: any;
  permisionModal: Permissions = new Permissions('161', false);
  categoryExists: boolean = false;
  isFieldsFilled: boolean = false;
  addSubCategoryclicked: boolean = false;
  subEditing = {};
  subCategoryExists: boolean = false;
  isSubFieldsFilled: boolean = false;
  receivedId: string;
  selectedCategory: string = "";
  selectedSubCategory: string = "";
  editorSwappurposescope = false;
  knowledgeBaseContent = new KnowledgeBaseContent();
  isAddContent: boolean = false;
  isAddFile: boolean = false;
  content: string = "";
  isLoading: boolean = false;
  spinnerFlag = false;
  fileName = "";
  validationMessage: any = "";
  uploadFile: any;
  file: any;
  @ViewChild('fileupload') private fileupload: FileUploadForDocComponent;
  selecetdImage: any;
  isViewImage: boolean = false;
  modulesList: any;
  isModuleExist: any;
  existingModules: string = "";
  selectedRow: any;
  ckeConfig = {
    allowedContent: false,
    forcePasteAsPlainText: true,
    removeButtons: 'Save,NewPage,Preview,Print,Templates,Source'
  };
  currentUser: UserPrincipalDTO = new UserPrincipalDTO();
  submitted: boolean = false;
  isUpdate: boolean = false;
  categoryListforSubcategory: KnowledgeBaseCategory[] = new Array();
  subcategoryListForContent: KnowledgeBaseSubCategory[] = new Array();
  isCancel: boolean = false;
  isSubCategoryCancel: boolean = false;
  selectedImageName : any;
  subCategoryDisp: string;
  categoryDisp: any;
  constructor(public configService: ConfigService, public fb: FormBuilder, private knowledgeBaseService: KnowledgeBaseService, public helper: Helper, public vendorService: VendorService, private adminComponent: AdminComponent) { }

  public editorOptions = {
    theme: 'snow',
    modules: {
      toolbar: {
        container:
          [
            [{ 'placeholder': ['[GuestName]', '[HotelName]'] }], // my custom dropdown
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],

            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction

            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],

            ['clean']                                    // remove formatting button

          ],
        handlers: {
          "placeholder": function (value) {
            if (value) {
              const cursorPosition = this.quill.getSelection().index;
              this.quill.insertText(cursorPosition, value);
              this.quill.setSelection(cursorPosition + value.length);
            }
          }
        }
      }
    }
  };
  ngOnInit() {
    this.adminComponent.setUpModuleForHelpContent("161");
    this.configService.loadCurrentUserDetails().subscribe(response => {
      this.currentUser = response;
      if (this.helper.APPLICATION_ADMIN === this.currentUser.adminFlag) {
        this.permissionForRootUser();
      } else {
        this.configService.loadPermissionsBasedOnModule("161").subscribe(resp => {
          this.permisionModal = resp
        });
      }
    })
    this.configService.loadCurrentUserDetails().subscribe(resp => {
      this.currentUser = resp;
      this.loadAllCategories();
      this.loadAllContentByOrgId();
      this.loadAllPermissionsList();
    });
    this.onContentForm = this.fb.group({
      categoryId: ['', Validators.compose([
        Validators.required
      ])],
      subCategoryId: ['', Validators.compose([
        Validators.required
      ])],
      content: ['', Validators.compose([
        Validators.required
      ])],
      file: [],
      selectedmodules: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  loadAllContentByOrgId() {
    if (this.helper.APPLICATION_ADMIN != this.currentUser.adminFlag) {
      this.orgId = this.currentUser.orgId;
    } else {
      this.orgId = 0;
    }
    this.knowledgeBaseService.callAPI("knowledgebase/loadAllContentByOrgId", this.orgId).subscribe((resp) => {
      this.contentList = resp.list;
    });
  }
  addContent() {
    this.isAddContent = true;
  }

  onEditorBlured(quill) {
  }

  onEditorFocused(quill) {
  }

  onEditorCreated(quill) {

  }

  onContentChanged({ quill, html, text }) {
  }
  toggleEditorpurpose() {
    if (this.editorSwappurposescope === false) {
      this.editorSwappurposescope = true;
    } else {
      this.editorSwappurposescope = false;
    }
  }
  loadAllCategories() {
    if (this.helper.APPLICATION_ADMIN != this.currentUser.adminFlag) {
      this.orgId = this.currentUser.orgId;
    } else {
      this.orgId = 0;
    }
    this.knowledgeBaseService.callAPI("knowledgebase/loadCategories", this.orgId).subscribe((resp) => {
      // this.categoryListforSubcategory = JSON.parse(JSON.stringify(resp.list));
      this.categoryList = resp.list;
    });
    this.loadActiveCategoryDropDownList(this.orgId);
  }
  loadAllPermissionsList() {
    this.knowledgeBaseService.callAPI("common/loadPermissions", '').subscribe((resp) => {
      this.modulesList = resp.list.map(option => ({ value: option.key, label: option.value }));
    });
  }
  addCategory() {
    this.addcategoryclicked = true;
    let categoryListDuplicate = new Array();
    let addCategory = new KnowledgeBaseCategory();
    addCategory.displayorder = this.pleaseFill;
    addCategory.activeFlag = "Y";
    addCategory.id = 0;
    addCategory.category = this.pleaseFill;
    addCategory.icon = "";
    for (var i = 1; i <= this.categoryList.length; i++) {
      categoryListDuplicate[i] = this.categoryList[i - 1];
    }
    categoryListDuplicate[0] = Object.assign({}, addCategory);
    this.categoryList = categoryListDuplicate;
    this.editing[0] = true;
    this.isCancel = true;
  }
  editRow(rowIndex) {
    this.isCancel = true;
    for (let index = 0; index < this.categoryList.length; index++) {
      if (rowIndex == index){
        this.editing[index] = true;
        this.categoryDisp = this.categoryList[index].displayorder
      }
      else
        this.editing[index] = false;
    }
  }
  updateValue(event, cell, cellValue, row) {
    if (cell === "displayorder"  &&  this.categoryDisp !=event.target.value) {
      let category = new KnowledgeBaseCategory();
      category.id = row.id;
      category.category = row.category;
      category.displayorder =  event.target.value;
      category.activeFlag = row.activeFlag;
      category.loginUserId = this.currentUser.id;
      if (this.helper.APPLICATION_ADMIN != this.currentUser.adminFlag) {
        category.organizationOfLoginUser = this.currentUser.orgId;
      }
      this.knowledgeBaseService.checkDisplayISExist(category).subscribe((resp) => {
        let responseMsg: string = resp.result;
        if (responseMsg == "success") {
          // swal({
          //   title: '',
          //   text: 'Display order is already exist',
          //   type: 'warning',
          //   timer: this.helper.swalTimer,
          //   showConfirmButton: false
          // });
          this.isFieldsFilled = true;
          this.categoryList[row.$$index][cell] = row.id ==0 ? "" : row.displayorder.toString();
        } else {
          this.isFieldsFilled = false;
          this.categoryList[row.$$index][cell] = event.target.value;
          if (cell === "category") {
            this.categoryExists = this.checkIfCategoryExist(row.category);
          }
        }
      });
    }
    else {
      this.categoryList[row.$$index][cell] = event.target.value;
      if (cell === "category") {
        this.categoryExists = this.checkIfCategoryExist(row.category);
      }
    }
  }

  checkIfCategoryExist(category: string): boolean {
    let retBoolean: boolean = false;
    let keyCount = 0;
    this.categoryList.forEach(element => {
      if (element.category === category) {
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

  saveCategory(row, index, id) {
    if (row.category != "" && row.displayorder != "") {
      this.editing[index] = false;
      this.isFieldsFilled = false;
      let category = new KnowledgeBaseCategory();
      category.id = row.id;
      category.category = row.category;
      category.displayorder = row.displayorder;
      category.activeFlag = row.activeFlag;
      category.loginUserId = this.currentUser.id;
      if (this.helper.APPLICATION_ADMIN != this.currentUser.adminFlag) {
        category.organizationOfLoginUser = this.currentUser.orgId;
      }
      category.icon = this.selecetdImage;
      category.selectedImageName = this.selectedImageName;
      let keyBoolean: boolean = this.checkIfCategoryExist(row.category);
      let fillBoolean: boolean = this.checkIfFieldsAreFilled(category);
      if (!keyBoolean && !fillBoolean) {
        this.knowledgeBaseService.callAPI("knowledgebase/saveCategory", category).subscribe((resp) => {
          let responseMsg: string = resp.result;
          if (responseMsg === "success") {
            this.loadAllCategories();
            this.loadAllContentByOrgId();
            swal({
              title: 'Success',
              text: 'Category Saved Successfully',
              type: 'success',
              timer: this.helper.swalTimer,
              showConfirmButton: false,
            });
            this.addcategoryclicked = false;
          } else {
            swal({
              title: 'Not Updated!',
              text: 'has not been Updated',
              type: 'error',
              timer: this.helper.swalTimer,
              showConfirmButton: false,
            }

            );
          }
        },
          err => {
            swal({
              title: 'Not Updated!',
              text: 'has not been Updated.',
              type: 'error',
              timer: this.helper.swalTimer,
              showConfirmButton: false,
            }

            );
          }
        );
      }

    } else {
      swal({
        title: 'Please Fill All Details!',
        text: '',
        type: 'error',
        timer: this.helper.swalTimer,
        showConfirmButton: false,
      }
      );
    }
  }

  checkIfFieldsAreFilled(knowledgeBase: KnowledgeBaseCategory): boolean {
    let fieldBoolean: boolean = false;
    if (knowledgeBase.id == 0) {
      if (knowledgeBase.category === this.pleaseFill || knowledgeBase.displayorder === this.pleaseFill) {
        fieldBoolean = true;
        this.isFieldsFilled = true;
      }
    }
    return fieldBoolean;
  }
  onChangeCategory() {
    if (!this.helper.isEmpty(this.selectedCategory)) {
      this.knowledgeBaseService.callAPI("knowledgebase/loadSubCategories", this.selectedCategory).subscribe((resp) => {
        this.subcategoryList = resp.list;
      });
    }
    if (this.isAddContent) {
      this.spinnerFlag = true;
      var timer = setInterval(() => {
        if (this.fileupload) {
          this.fileupload.loadFileListForEdit(this.receivedId, this.helper.KNOWLEDGEBASE).then((result) => {
            this.spinnerFlag = false;
          }).catch((err) => {
            this.spinnerFlag = false;
          });
          clearInterval(timer);
        }
      }, 1000)
      
      this.spinnerFlag = false;
    }
  }
  onChangeFormCategory() {
    this.selectedCategory = this.onContentForm.get("categoryId").value;
    this.onChangeCategory();
    this.loadActiveSubCategory(this.selectedCategory);
  }
  onChangeSubCategory() {
    this.selectedCategory = this.onContentForm.get("categoryId").value;
    this.selectedSubCategory = this.onContentForm.get("subCategoryId").value;
    this.knowledgeBaseService.callAPI("knowledgebase/loadSubCategoryContent", this.selectedSubCategory).subscribe((resp) => {
      if (resp.data != null) {
        this.knowledgeBaseContent = resp.data;
        this.onContentForm.get("categoryId").setValue(this.knowledgeBaseContent.categoryId);
        this.onContentForm.get("subCategoryId").setValue(this.knowledgeBaseContent.subCategoryId);
        this.onContentForm.get("content").setValue(this.knowledgeBaseContent.content);
      } else {
        this.knowledgeBaseContent = new KnowledgeBaseContent();
        this.onContentForm.get("content").setValue("");
      }
    });
  }
  populateContentDetails() {
    this.onContentForm.get("categoryId").setValue(this.knowledgeBaseContent.categoryId);
    this.onContentForm.get("subCategoryId").setValue(this.knowledgeBaseContent.subCategoryId);
    this.onContentForm.get("content").setValue(this.knowledgeBaseContent.content);
    this.onContentForm.get("selectedmodules").setValue(this.knowledgeBaseContent.modulesList);
  }
  addSubCategory() {
    this.addSubCategoryclicked = true;
    let categoryListDuplicate = new Array();
    let subCategory = new KnowledgeBaseSubCategory();
    subCategory.id = 0;
    subCategory.subCategoryName = this.pleaseFill;
    subCategory.displayorder = this.pleaseFill;
    subCategory.activeFlag = "Y";
    for (var i = 1; i <= this.subcategoryList.length; i++) {
      categoryListDuplicate[i] = this.subcategoryList[i - 1];
    }
    categoryListDuplicate[0] = Object.assign({}, subCategory);
    this.subcategoryList = categoryListDuplicate;
    this.subEditing[0] = true;
    this.isSubCategoryCancel = true;
  }
  editSubCategoryRow(rowIndex) {
    this.isSubCategoryCancel = true;
    for (let index = 0; index < this.subcategoryList.length; index++) {
      if (rowIndex == index){
        this.subEditing[index] = true;
        this.subCategoryDisp  =  this.subcategoryList[index].displayorder;
      }
      else
        this.subEditing[index] = false;
    }
  }
  updateSubcategoryValue(event, cell, cellValue, row) {
    if (cell === "displayorder"   &&  this.subCategoryDisp != event.target.value) {
      let subCategory = new KnowledgeBaseSubCategory();
      subCategory.id = row.id;
      subCategory.subCategoryName = row.subCategoryName;
      subCategory.displayorder = event.target.value;
      subCategory.activeFlag = row.activeFlag;
      subCategory.loginUserId = this.currentUser.id;
      subCategory.categoryId = +this.selectedCategory;
      this.knowledgeBaseService.checkSubCategoryDisplayISExist(subCategory).subscribe((resp) => {
        let responseMsg: string = resp.result;
        if (responseMsg == "success") {
          // swal({
          //   title: '',
          //   text: 'Display order is already exist',
          //   type: 'warning',
          //   timer: this.helper.swalTimer,
          //   showConfirmButton: false
          // });
          this.isSubFieldsFilled = true;
          this.subcategoryList[row.$$index][cell] = row.id ==0 ? "" : row.displayorder.toString();
        }
        else {
          this.isSubFieldsFilled = false;
          this.subcategoryList[row.$$index][cell] = event.target.value;
          if (cell === "subCategoryName") {
            this.subCategoryExists = this.checkIfSubCategoryExist(row.subCategoryName);
          }
        }
      });
    } else {
      this.subcategoryList[row.$$index][cell] = event.target.value;
      if (cell === "subCategoryName") {
        this.subCategoryExists = this.checkIfSubCategoryExist(row.subCategoryName);
      }
    }
  }

  checkIfSubCategoryExist(subCategory: string): boolean {
    let retBoolean: boolean = false;
    let keyCount = 0;
    this.subcategoryList.forEach(element => {
      if (element.subCategoryName === subCategory) {
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
  saveSubCategory(row, index, id) {
    if (row.subCategoryName != "" && row.displayorder != "") {
      this.subEditing[index] = false;
      this.isSubFieldsFilled = false;
      let subCategory = new KnowledgeBaseSubCategory();
      subCategory.id = row.id;
      subCategory.subCategoryName = row.subCategoryName;
      subCategory.displayorder = row.displayorder;
      subCategory.activeFlag = row.activeFlag;
      subCategory.loginUserId = this.currentUser.id;
      subCategory.categoryId = +this.selectedCategory;
      if (this.helper.APPLICATION_ADMIN != this.currentUser.adminFlag) {
        subCategory.organizationOfLoginUser = this.currentUser.orgId;
      }
      let keyBoolean: boolean = this.checkIfSubCategoryExist(row.subCategoryName);
      let fillBoolean: boolean = this.checkIfSubFieldsAreFilled(subCategory);
      if (!keyBoolean && !fillBoolean) {
        this.knowledgeBaseService.callAPI("knowledgebase/saveSubCategory", subCategory).subscribe((resp) => {
          let responseMsg: string = resp.result;
          if (responseMsg === "success") {
            this.onChangeCategory();
            this.loadAllContentByOrgId();
            swal({
              title: 'Success',
              text: 'Sub Category Saved Successfully',
              type: 'success',
              timer: this.helper.swalTimer,
              showConfirmButton: false,
            }

            );
            this.addSubCategoryclicked = false;
          } else {
            swal({
              title: 'Not Updated!',
              text: 'has not been Updated',
              type: 'error',
              timer: this.helper.swalTimer,
              showConfirmButton: false,
            }

            );
          }
        },
          err => {
            swal({
              title: 'Not Updated!',
              text: 'has not been Updated.',
              type: 'error',
              timer: this.helper.swalTimer,
              showConfirmButton: false,
            }

            );
          }
        );
      }

    } else {
      swal({
        title: 'Please Fill All Details!',
        text: '',
        type: 'error',
        timer: this.helper.swalTimer,
        showConfirmButton: false,
      }
      );
    }
  }
  checkIfSubFieldsAreFilled(knowledgeBase: KnowledgeBaseSubCategory): boolean {
    let fieldBoolean: boolean = false;
    if (knowledgeBase.id == 0) {
      if (knowledgeBase.subCategoryName === this.pleaseFill || knowledgeBase.displayorder === this.pleaseFill) {
        fieldBoolean = true;
        this.isSubFieldsFilled = true;
      }
    }
    return fieldBoolean;
  }
  saveContent() {
    if (this.onContentForm.valid) {
      this.spinnerFlag = true;
      this.submitted = false;
      this.knowledgeBaseContent.subCategoryId = this.onContentForm.get("subCategoryId").value;
      this.knowledgeBaseContent.content = this.onContentForm.get("content").value;
      this.knowledgeBaseContent.loginUserId = this.currentUser.id;
      if (this.helper.APPLICATION_ADMIN != this.currentUser.adminFlag) {
        this.knowledgeBaseContent.organizationOfLoginUser = this.currentUser.orgId;
      }
      this.knowledgeBaseContent.modulesList = this.onContentForm.get("selectedmodules").value;
      this.isLoading = true;
      let file = this.onContentForm.get("file").value;
      // if (file == null) {
      this.knowledgeBaseService.callAPI("knowledgebase/saveSubCategoryContent", this.knowledgeBaseContent).subscribe((resp) => {
        let responseMsg: any = resp.result;
        if (responseMsg.status === "success") {
          this.isLoading = false;
          this.fileupload.uploadFileList(responseMsg, this.helper.KNOWLEDGEBASE).then((result) => {
            this.spinnerFlag = false;
            swal({
              title: 'Success',
              text: 'Content Saved Successfully',
              type: 'success',
              timer: this.helper.swalTimer,
              showConfirmButton: false,
            });
            this.addSubCategoryclicked = false;
            this.loadAllContentByOrgId()
            this.reset();
          })
        } else {
          swal({
            title: 'Not Updated!',
            text: 'has not been Updated',
            type: 'error',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
          }

          );
        }
      },
        err => {
          this.isLoading = false;
          swal({
            title: 'Not Updated!',
            text: 'has not been Updated.',
            type: 'error',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
          }

          );
        }
      );
      // } 
      // else {
      //   let timerInterval;
      //   let formData: FormData = new FormData();
      //   formData.append('file', this.file, this.file.name);
      //   formData.append('knowledgebaseContentDTO', JSON.stringify(this.knowledgeBaseContent));
      //   let headers = new Headers();
      //   headers.append('Content-Type', 'multipart/form-data');
      //   headers.append('Accept', 'application/json');
      //   headers.append('Authorization', 'Bearer ' + localStorage.getItem("token"))
      //   this.knowledgeBaseService.saveFile(formData, headers).subscribe(resp => {
      //     this.isLoading = false;
      //     if (resp == true) {
      //       this.reset();
      //       this.loadAllContentByOrgId();
      //       swal({
      //         title: 'Success',
      //         text: 'Document Saved Successfully',
      //         type: 'success',
      //         timer: this.helper.swalTimer,
      //         showConfirmButton: false,
      //       }

      //       )
      //     } else {
      //       swal({
      //         title: 'Error',
      //         text: 'Error in Saving Document',
      //         type: 'error',
      //         timer: this.helper.swalTimer,
      //         showConfirmButton: false,
      //         onClose: () => {
      //           this.isLoading = false;
      //           clearInterval(timerInterval)
      //         }
      //       });
      //     }
      //   });
      // }
    } else {
      this.submitted = true;
      Object.keys(this.onContentForm.controls).forEach(field => {
        const control = this.onContentForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }
  reset() {
    this.receivedId = "0";
    this.onChangeCategory();
    this.onContentForm.reset();
    this.isAddContent = false;
    this.isAddFile = false;

  }
  editContentDetails(row) {
    this.isUpdate = true;
    this.receivedId = row.id;
    this.isModuleExist = false;
    this.knowledgeBaseContent = row;
    this.populateContentDetails();
    this.isAddContent = true;
    this.onChangeFormCategory();
    this.selectedRow = row;
  }
  viewContentDetails(row: any) {
    this.content = row.content;
  }
  addFile() {
    this.isAddFile = true;
    this.isAddContent = true;
  }
  viewFile(event) {
    this.validationMessage = "";
    this.file = event.target.files[0];
  }
  convertBase64ToPdfFile(dataURI) {
    var binary = atob(dataURI);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: 'application/pdf'
    });
  }

  onFileChangeLargeImage(event) {
    this.selecetdImage = event.target.files[0];
    this.selectedImageName = event.target.files[0].name;
    const reader = new FileReader();
    reader.onload = () => {
      this.selecetdImage = reader.result;
      this.isViewImage = true;
    };
    reader.readAsDataURL(this.selecetdImage);
  }
  viewImage(row: any) {
    this.myInputVariable.nativeElement.value = "";
    if (!this.helper.isEmpty(row.icon)) {
      this.selecetdImage = row.icon;
      this.isViewImage = true;
    } else {
      this.selecetdImage = "";
      this.isViewImage = false;
    }
  }
  onChangeModules() {
    // this.isModuleExist=false;
    // this.existingModules="";
    // this.contentList.forEach(data =>{
    //   if(this.selectedRow.id != data.id){
    //     data.modulesList.forEach((module, index) => {
    //       this.selectedmodules.forEach(element => {
    //         if(module ===element ){
    //           this.existingModules=data.modulesNames[index]+","+this.existingModules
    //           this.isModuleExist=true;
    //         }
    //       });
    //     });
    //   }
    // });
    // this.existingModules = this.existingModules.substr(0, this.existingModules.length - 1);
  }

  openSuccessCancelSwal(dataObj,id) {
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
        dataObj.userRemarks="Comments : " + value;
        this.deleteOrg(dataObj);
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

  deleteOrg(dataObj): string {
    let timerInterval;
    this.knowledgeBaseService.deleteKbContent(dataObj)
      .subscribe((resp) => {
        let responseMsg: string = resp.result;
        if (responseMsg === "success") {
          status = "success";
          swal({
            title: 'Deleted!',
            text: 'Knowledge base content has been deleted.',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              clearInterval(timerInterval)
            }
          });
          this.ngOnInit();
        } else {
          status = "failure";
          swal({
            title: 'Not Deleted!',
            text: 'Knowledge base content has not been deleted.',
            type: 'error',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
          });

        }

      }, (err) => {
        status = "failure";
        swal(
          'Not Deleted!',
          'Knowledge base content has not been deleted.',
          'error'
        );

      });
    return status;
  }

  permissionForRootUser() {
    this.permisionModal.workFlowButtonFlag = true;
    this.permisionModal.viewButtonFlag = true;
    this.permisionModal.deleteButtonFlag = true;
    this.permisionModal.updateButtonFlag = true;
    this.permisionModal.createButtonFlag = true;
    this.permisionModal.publishButtonFlag = true;
  }

  cancel(index) {
    this.isCancel = false;
    this.addcategoryclicked = false;
    this.editing[index] = false;
    this.isFieldsFilled = false;
    this.loadAllCategories();
  }

  subCategoryCancel(index) {
    this.isSubCategoryCancel = false;
    this.addSubCategoryclicked = false;
    this.subEditing[index] = false;
    this.isSubFieldsFilled = false;
    this.onChangeCategory();
  }

loadActiveCategoryDropDownList(orgid){
  this.knowledgeBaseService.loadforDropDownList(orgid).subscribe(result => {
  this.categoryListforSubcategory = JSON.parse(JSON.stringify(result.list));
  });
}

loadActiveSubCategory(selectedCategory) {
    this.knowledgeBaseService.loadActiveSubCategory(selectedCategory).subscribe((resp) => {
      this.subcategoryListForContent = resp.list;
    });
  }
}
