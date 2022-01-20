import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import swal from 'sweetalert2';
import { isNullOrUndefined } from 'util';
import { Permissions } from '../../shared/config';
import { AdminComponent } from './../../layout/admin/admin.component';
import { DocumentNumberingDTO } from './../../models/model';
import { ConfigService } from './../../shared/config.service';
import { Helper } from './../../shared/helper';

@Component({
  selector: 'app-document-numbering',
  templateUrl: './document-numbering.component.html',
  styleUrls: ['./document-numbering.component.css',
    '../../../../node_modules/sweetalert2/dist/sweetalert2.min.css',
    '../../../../node_modules/ng2-toasty/style-bootstrap.css',
    '../../../../node_modules/ng2-toasty/style-default.css',
    '../../../../node_modules/ng2-toasty/style-material.css'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentNumberingComponent implements OnInit {
  documentList = new Array();
  documentNumberingDTO = new DocumentNumberingDTO();
  sequenceNumberLimitArray = new Array();
  previewData: any;
  previewDataVersion:any;
  permissionModal=new Permissions('',false);
  constructor(public adminComponent: AdminComponent, public configService: ConfigService, private helper: Helper, private toastyService: ToastyService) { }

  ngOnInit(): void {
    this.loadData();
    this.loadPermission();
  }

  loadData() {
    this.adminComponent.spinnerFlag = true;
    this.configService.HTTPPostAPI('', 'workflowConfiguration/loadDocumentNumberingConfig').subscribe(rep => {
      this.adminComponent.spinnerFlag = false;
      if (rep.result) {
        this.documentNumberingDTO = rep.result;
        this.preview(rep);
      }
      this.csscal(this.documentNumberingDTO.serialNumberLength);
    })
  }
  loadPermission() {
    this.configService.loadPermissionsBasedOnModule('106').subscribe(resp => {
      this.permissionModal = resp;
    });
  }

  updateWithComments(formIsValid) {
    if(!this.permissionModal.updateButtonFlag){
      swal({
        title: 'Warning!', type: 'warning', timer: this.helper.swalTimer, showConfirmButton: false,
        text:"You don't have update permission. Please contact admin!.",
    });
    }else{
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
              this.documentNumberingDTO.userRemarks = "Comments : " + value;
              this.saveOrUpdate(formIsValid);
            } else {
              swal({
                title: '',
                text: 'Comments is requried',
                type: 'info',
                timer: this.helper.swalTimer,
                showConfirmButton: false,
                onClose: () => {
                  this.updateWithComments(formIsValid);
                }
              });
            }
          });
      }
    }
  }

  save(formValid){
    if(this.permissionModal.createButtonFlag){
      this.saveOrUpdate(formValid);
    }else{
      swal({
        title: 'Warning!', type: 'warning', timer: this.helper.swalTimer, showConfirmButton: false,
        text:"You don't have create permission. Please contact admin!.",
    });
    }

  }

  saveOrUpdate(formValid) {

    if (formValid) {
      this.adminComponent.spinnerFlag = true;
      this.documentNumberingDTO.versionPrefix=this.documentNumberingDTO.versionPrefix.toUpperCase();
      this.configService.HTTPPostAPI(this.documentNumberingDTO,
        'workflowConfiguration/saveDocumentNumberingConfig').subscribe(resp => {
          this.adminComponent.spinnerFlag = false;
          if (resp.result) {
            swal({
              title: ' Success!',
              text: (this.documentNumberingDTO.id == 0 ? 'Saved' : 'Updated') + ' Successfully',
              type: 'success',
              timer: this.helper.swalTimer,
              showConfirmButton: false,
            });
            this.loadData();
          } else {
            swal({
              title: 'Error!',
              text: 'Error in saving',
              type: 'error',
              timer: this.helper.swalTimer,
              showConfirmButton: false,
            });
          }
        }, err => this.adminComponent.spinnerFlag = false);
    } else {
      return;
    }
  }

  copyInputMessage(val: string) {
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.addToast({ title: val + ' copied to clipboard!', timeout: 3000, theme: 'bootstrap', position: 'bottom-right', type: 'success' })
  }

  newArraySequenceNumber(length) {
    this.sequenceNumberLimitArray = new Array(length);
  }

  /** Toast Message */
  addToast(options) {
    if (options.closeOther) {
      this.toastyService.clearAll();
    }
    const toastOptions: ToastOptions = {
      title: options.title,
      msg: options.msg,
      showClose: options.showClose,
      timeout: options.timeout,
      theme: options.theme,
      onAdd: (toast: ToastData) => {
        /* added */
      },
      onRemove: (toast: ToastData) => {
        /* removed */
      }
    };

    switch (options.type) {
      case 'default': this.toastyService.default(toastOptions); break;
      case 'info': this.toastyService.info(toastOptions); break;
      case 'success': this.toastyService.success(toastOptions); break;
      case 'wait': this.toastyService.wait(toastOptions); break;
      case 'error': this.toastyService.error(toastOptions); break;
      case 'warning': this.toastyService.warning(toastOptions); break;
    }
  }

  preview(dto: DocumentNumberingDTO) {
    this.previewData = '';
    this.previewDataVersion='';
    if (dto.prefix)
      this.previewData = dto.prefix;

    this.previewData += this.paddingString(
      !isNullOrUndefined(dto.serialNumberStartForm) ? '' + (dto.serialNumberStartForm) : '',
      "0", dto.serialNumberLength);

    if (dto.suffix)
      this.previewData += dto.suffix;

    if(dto.versionPrefix)
    this.previewDataVersion=dto.versionPrefix.toUpperCase()+dto.versionStartFrom;





  }

  paddingString(inputString: string, padding: string, length: number): string {
    try {
      if (!inputString)
        inputString = padding;

      if (!padding)
        return inputString;

      if (inputString.length >= length)
        return inputString;

      if (inputString.length < length) {
        return this.paddingString(padding + inputString, padding, length);
      }

    } catch (error) {
      return "";
    }
    return "";
  }

  csscal(value) {
    const range: any = document.getElementById('range');
    let interval = setInterval(() => {
      if (range) {
        var rangeV = document.getElementById('range-tooltip-id');
        let newValue = Number((range.value - range.min) * 100 / (range.max - range.min));
        let newPosition = 10 - (newValue * 0.2);
        rangeV.innerHTML = `<span>${value}</span>`;
        rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`;
        clearInterval(interval);
      }
    })
  }
}
