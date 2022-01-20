import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { CategoryService } from './category.service';
import { Router } from '../../../../node_modules/@angular/router';
import swal from 'sweetalert2';
import { Helper } from '../../shared/helper';
import { Category } from '../../models/model';
import { AdminComponent } from '../../layout/admin/admin.component';
import { Permissions } from '../../shared/config';
import { ConfigService } from '../../shared/config.service';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./category.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css']
})
export class CategoryComponent implements OnInit {
  @ViewChild('categoryName') categoryName: any;
  @ViewChild('myTable') table: any;
  modal: Category
  loading: boolean = false;
  toggleEditoractualresult = false;
  submitted: boolean = false;
  valadationMessage: string;
  data: any;
  updateFlag: boolean = false;
  public sortOrder = 'desc';
  isDefault: boolean = false;
  rowId: any = "";
  isFlag: boolean = false;
  permissionData: any;
  permisionModal: Permissions = new Permissions("104", false);
  public filterQuery = '';

  constructor(public permissionService: ConfigService, private comp: AdminComponent, public categoryService: CategoryService, public helper: Helper, private routers: Router) { }

  ngOnInit() {
    this.modal = new Category();
    this.loadAll();
    this.comp.setUpModuleForHelpContent("104");
    this.comp.taskDocType = "104";
    this.comp.taskDocTypeUniqueId = "";
    this.comp.taskEquipmentId = 0;
    this.comp.taskEnbleFlag = true;
    this.permissionService.loadPermissionsBasedOnModule("104").subscribe(resp => {
      this.permisionModal = resp
    });
    var timer = setInterval(() => {
      if (this.categoryName) {
        this.categoryName.nativeElement.focus();
        clearInterval(timer);
      }
    }, 600)
  }

  onsubmit(formIsValid) {
    this.submitted = true;
    if (formIsValid) {
      this.isFlag = true;
      if (this.helper.isEmpty(this.rowId)) {
        this.modal.id = 0;
      }
      this.categoryService.createCategory(this.modal).subscribe(jsonResp => {
        this.isFlag = false;
        let timerInterval;
        let responseMsg = jsonResp.result;
        if (responseMsg === "success") {
          this.isFlag = false;
          this.submitted = false;
          let mes = 'New category ' + this.modal.categoryName + ' is created';
          if (this.updateFlag) {
            mes = "category is updated"
          }
          swal({
            title: '',
            text: mes,
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              if (this.routers.url.search("masterControl") != -1) {
                this.routers.navigate(["/masterControl"]);
              } else {
                this.categoryService.loadCategory().subscribe(response => {
                  if (response.result != null) {
                    this.data = response.result
                    this.updateFlag = false;
                    this.modal.categoryName = '';
                    this.modal = new Category();
                  }
                });
              }
              clearInterval(timerInterval)
            }
          });
        } else if (responseMsg === "failure") {
          this.isFlag = false;
          this.submitted = false;
          swal({
            title: '',
            text: 'Something went Wrong ...Try Again',
            type: 'error',
            timer: this.helper.swalTimer,
            showConfirmButton: false
          })
        } else {
          this.isFlag = false;
          this.submitted = false;
          swal({
            title: 'Duplicate Record',
            text: responseMsg,
            type: 'info',
            timer: this.helper.swalTimer,
            showConfirmButton: false
          })
        }
      },
        err => {
          this.isFlag = false;
          swal({
            title: 'error',
            text: 'Something went Wrong ...Try Again',
            type: 'error',
            timer: this.helper.swalTimer,
            showConfirmButton: false
          })
        }
      );
    }
    else {
      this.isFlag = false;
      return;
    }
  }

  editcategory(id: any) {
    this.rowId = id;
    this.updateFlag = true;
    this.isFlag = true;
    this.categoryService.editCategory(id).subscribe(response => {
      this.isFlag = false;
      if (response.result != null) {
        this.modal = response.result;
        var timer = setInterval(() => {
          if (this.categoryName) {
            this.categoryName.nativeElement.focus();
            clearInterval(timer);
          }
        }, 600)
      }
    });
  }

  loadAll() {
    this.isFlag = true;
    this.categoryService.loadCategory().subscribe(response => {
      if (response.result != null) {
        this.data = response.result
      }
      this.isFlag = false;
    });
  }

  openSuccessCancelSwal(dataObj, id) {
    this.categoryService.checkCategory(id).subscribe((resp) => {
      let responseMsg: string = resp.result;
      if (responseMsg == "success") {
        swal({
          title: '',
          text: 'Cannot be deleted as it is mapped to the existing document',
          type: 'warning',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        });
      } else {
        swal({
          title: "Write your comments here:",
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
            if (value) {
              dataObj.userRemarks = "Comments : " + value;
              this.deleteCategory(dataObj, id);
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
    })
  }

  deleteCategory(dataObj, id): string {
    let timerInterval;
    let status = '';
    let category = new Category();
    category.id = id;
    category.userRemarks = dataObj.userRemarks;
    this.categoryService.deleteCategory(category)
      .subscribe((resp) => {
        let responseMsg: string = resp.result;
        if (responseMsg == "success") {
          this.updateFlag = false;
          status = "success";
          swal({
            title: 'Deleted!',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              this.loadAll();
              this.modal.categoryName = "";
              clearInterval(timerInterval)
            }
          });
        } else {
          status = "failure";
          swal({
            title: 'Not Deleted!',
            text: dataObj.categoryName + '  has not been deleted.',
            type: 'error',
            timer: this.helper.swalTimer,
            showConfirmButton: false
          });
        }
      }, (err) => {
        status = "failure";
        swal({
          title: 'Not Deleted!',
          text: dataObj.categoryName + 'has  not been deleted.',
          type: 'error',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        });
      });
    return status;
  }

  onClickCancel() {
    this.updateFlag = false;
    this.modal = new Category();
  }

}
