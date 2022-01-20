import { Component, OnInit, ViewEncapsulation, Renderer2, ViewChild } from '@angular/core';
import { Priority } from '../../models/model';
import { priorityService } from './priority.service';
import swal from 'sweetalert2';
import { Router } from '../../../../node_modules/@angular/router';
import { Helper } from '../../shared/helper';
import { AdminComponent } from '../../layout/admin/admin.component';
import { ConfigService } from '../../shared/config.service';
import { Permissions } from '../../shared/config';
@Component({
  selector: 'app-priority',
  templateUrl: './priority.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./priority.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css']
})

export class PriorityComponent implements OnInit {
  modal: Priority = new Priority();
  submitted: boolean = false;
  data: any;
  updateFlag: boolean = false;
  showButtonFlag: boolean = false;
  rowId: any;
  spinnerFlag: boolean = false;
  permisionModal: Permissions = new Permissions("105", false);
  public filterQuery = '';
  @ViewChild('mydatatable') table: any;
  @ViewChild('priorityName') priorityName: any;

  constructor(public permissionService: ConfigService, private comp: AdminComponent, public priorityService: priorityService, public routers: Router, public helper: Helper, public renderer: Renderer2) { }

  ngOnInit() {
    this.showButtonFlag = true;
    this.loadAll();
    this.comp.setUpModuleForHelpContent("105");
    this.comp.taskDocType = "105";
    this.comp.taskDocTypeUniqueId = "";
    this.comp.taskEquipmentId = 0;
    this.permissionService.loadPermissionsBasedOnModule("105").subscribe(resp => {
      this.permisionModal = resp
    });
    var timer = setInterval(() => {
      if (this.priorityName) {
        this.priorityName.nativeElement.focus();
        clearInterval(timer);
      }
    })
  }

  public onEventLog(event: string, data: any): void {
    this.modal.priorityColor = data.color;
  }

  onsubmit(formIsValid) {
    if (!this.spinnerFlag) {
      let timerInterval
      this.submitted = true;
      if (formIsValid) {
        this.submitted = false;
        if (this.helper.isEmpty(this.rowId)) {
          this.modal.id = 0;
        }
        this.spinnerFlag = true;
        this.priorityService.createPriority(this.modal).subscribe(jsonResp => {
          this.spinnerFlag = false;
          let responseMsg: string = jsonResp.result;
          if (responseMsg === "success") {
            let mes = 'Priority is created Successfully';
            if (this.updateFlag) {
              mes = "Priority is updated"
            }
            swal({
              title: 'success',
              text: mes,
              type: 'success',
              timer: this.helper.swalTimer,
              showConfirmButton: false,
              onClose: () => {
                if (this.routers.url.search("masterControl") != -1) {
                  this.routers.navigate(["/masterControl"]);
                  this.showButtonFlag = false;
                } else {
                  this.priorityService.loadAllPriority().subscribe(response => {
                    this.modal = new Priority();
                    if (response.result != null) {
                      this.data = response.result
                      this.updateFlag = false;
                      this.submitted = false;
                    }
                  });
                }
                clearInterval(timerInterval)
              }
            });
          } else if (responseMsg === "failure") {
            this.spinnerFlag = false;
            this.submitted = false;
            swal({
              title: 'error',
              text: 'Something went Wrong ...Try Again',
              type: 'error',
              timer: this.helper.swalTimer,
              showConfirmButton: false
            })
          } else {
            this.spinnerFlag = false;
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
            this.spinnerFlag = false;
          }
        );
      }
      else {
        this.spinnerFlag = false;
        return;
      }
    }
  }

  editPriority(id: any) {
    this.rowId = id;
    this.updateFlag = true;
    this.priorityService.loadPriorityBasedOnId(id).subscribe(response => {
      if (response.result != null) {
        this.modal = response.result;
        this.showButtonFlag = true;
        var timer = setInterval(() => {
          if (this.priorityName) {
            this.priorityName.nativeElement.focus();
            clearInterval(timer);
          }
        })
      }
    });
  }

  loadAll() {
    this.spinnerFlag = true;
    this.priorityService.loadAllPriority().subscribe(response => {
      if (response.result != null) {
        this.data = response.result
      }
      this.spinnerFlag = false;
    });
  }

  checkDefaultPriority(name) {
    if (name == 'Low' || name == 'Medium' || name == 'High' || name == 'Minor' || name == 'Moderate' || name == 'Major' || name == 'Critical')
      return false;
    else
      return true;
  }

  openSuccessCancelSwal(dataObj, id) {
    this.priorityService.checkPriority(id).subscribe((resp) => {
      let responseMsg: string = resp.result;
      if (responseMsg == "success") {
        swal({
          title: '',
          text: 'Cannot be deleted as it is mapped to the existing document',
          type: 'warning',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        });
        this.spinnerFlag = false
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
    });
  }

  deleteCategory(dataObj, id): string {
    let timerInterval
    let status = '';
    this.spinnerFlag = true;
    let priority = new Priority();
    priority.id = id;
    priority.userRemarks = dataObj.userRemarks;
    this.priorityService.deletePriorityBasedOnId(priority)
      .subscribe((response) => {
        this.spinnerFlag = false
        if (response == true) {
          status = "success";
          swal({
            title: 'Deleted!',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false,
            onClose: () => {
              this.loadAll();
              clearInterval(timerInterval)
            }
          });
        } else {
          status = "failure";
          swal({
            title: 'Not Deleted!',
            text: dataObj.priorityName + '  has not been deleted.',
            type: 'error'
          }
          );
        }
      }, (err) => {
        this.spinnerFlag = false;
        status = "failure";
        swal({
          title: 'Not Deleted!',
          text: dataObj.priorityName + 'has  not been deleted.',
          type: 'error',
          timer: 2000
        });
      });
    return status;
  }

  checkName(name: any) {
    if (this.modal.id != 0) {
      let result: boolean = false;
      if (name == 'Low' || name == 'Medium' || name == 'High' || name == 'Minor' || name == 'Moderate' || name == 'Major' || name == 'Critical')
        return result = true;
      else
        return result;
    }
  }

  onClickCancel() {
    this.updateFlag = false;
    this.modal = new Priority();
  }

}

