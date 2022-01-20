import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { ExternalApprovalDTO} from '../../models/model';
import { ConfigService } from '../../shared/config.service';
import { externalApprovalErrorTypes } from '../../shared/constants';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-external-form-modal',
  templateUrl: './external-form-modal.component.html',
  styleUrls: ['./external-form-modal.component.css']
})
export class ExternalFormModalComponent implements OnInit {
  @ViewChild('externalApprovalmodal') externalApprovalmodal:ModalBasicComponent;
  public onExternalApprovalForm: FormGroup;
  externalApprovalDTO:ExternalApprovalDTO;
  public spinnerFlag: Boolean = false;
  constructor(public config: ConfigService,public fb: FormBuilder,public externalApprovalErrorTypes:externalApprovalErrorTypes) { }

  ngOnInit(): void {
    this.onExternalApprovalForm = this.fb.group({
      name: ['', Validators.compose([
        Validators.required
      ])],
      email: ['', Validators.compose([
        Validators.required,Validators.pattern('[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')
      ])],
      remarks: ['', Validators.compose([
        Validators.required
      ])],
      validity: ['', Validators.compose([
        Validators.required
      ])]
    });
  }
  onClickExternalApproval(dynamicFormId){
    this.onExternalApprovalForm.reset();
    this.onExternalApprovalForm.get("validity").setValue(2);
    this.externalApprovalDTO=new ExternalApprovalDTO();
    this.externalApprovalDTO.levelId=dynamicFormId;
    this.externalApprovalmodal.show();
  }
  onClickSave(){
    if (this.onExternalApprovalForm.valid) {
      this.spinnerFlag=true;
      this.externalApprovalDTO.email = this.onExternalApprovalForm.get("email").value;
      this.externalApprovalDTO.validity = this.onExternalApprovalForm.get("validity").value;
      this.externalApprovalDTO.remarks = this.onExternalApprovalForm.get("remarks").value;
      this.externalApprovalDTO.name = this.onExternalApprovalForm.get("name").value;
      this.config.HTTPPostAPI(this.externalApprovalDTO, 'externalApproval/saveExternalFormDetails').subscribe(response => {
        this.spinnerFlag=false;
        this.externalApprovalmodal.hide();
        swal({
          title: '',
          text: 'Success',
          type: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      });
    }else {
      Object.keys(this.onExternalApprovalForm.controls).forEach(field => {
        const control = this.onExternalApprovalForm.get(field);            
        control.markAsTouched({ onlySelf: true });      
      });
    }
  }
}
