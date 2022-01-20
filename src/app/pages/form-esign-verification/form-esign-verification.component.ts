import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import swal from 'sweetalert2';
import { ConfigService } from '../../shared/config.service';
import { EsignAgreementMessege, eSignErrorTypes } from '../../shared/constants';
import { ModalAnimationComponent } from '../../shared/modal-animation/modal-animation.component';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-form-esign-verification',
  templateUrl: './form-esign-verification.component.html',
  styleUrls: ['./form-esign-verification.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'
  ]
})
export class FormEsignVerificationComponent implements OnInit {
  @Input('org') org;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  @ViewChild('formVerification') formVerificationModal: ModalAnimationComponent;
  modal :any={};
  errorMessage = '';
  verificationFormBuilder: FormGroup = null;
  submitted = false;
  viewSignature = false;
  public signaturePadOptions: Object = {
    'minWidth': 1,
    'canvasWidth': 540,
    'canvasHeight': 100,
  };
  agreementCheck: boolean = false;
  title: String;
  currentUserNameOrEmail: any;
  
  constructor(public formBuilder: FormBuilder, private config: ConfigService, private errorMessageHelper: eSignErrorTypes,
    public esignAgreementMessage: EsignAgreementMessege) { }

  ngOnInit() {
    this.config.loadCurrentUserDetails().subscribe(jsonResp => {
      this.currentUserNameOrEmail = jsonResp.email;
    });
      this.modal.comments = '';
      this.verificationFormBuilder = this.formBuilder.group({
        emailOrUserName: [this.modal.emailOrUserName, [Validators.required]],
        password: [this.modal.password, [Validators.required]],
        comments: [this.modal.comments],
        signature: [this.modal.signature]
      });
  }

  openMyModal(documentType, documentCode, documentId, orgSpecific?,projectName?:string) {
    $("#acceptCheckBox").prop("checked", false);
    this.agreementCheck = false;
    this.modal = {
      emailOrUserName: '',
      password: '',
      comments: '',
      documentCode: documentCode,
      documentId: documentId,
      documentType: documentType,
      signature: '',
      orgSpecific: orgSpecific ? orgSpecific : false,
      projectName:projectName
    }
    this.verificationFormBuilder.reset();
    this.verificationFormBuilder.get('emailOrUserName').setValue(this.currentUserNameOrEmail);
    this.submitted = false;
    this.errorMessage = '';
    try {
      document.querySelector('#effect-1').classList.add('md-show');
      this.viewSignature = false;
      this.clearSignature();
    } catch (error) {
    }
    setTimeout(() => {
      $('#formVerificationComments').focus();
    }, 1000);
  }

  openNewMyModal(documentType, documentCode, documentId, year:any) {
    $("#acceptCheckBox").prop("checked", false);
    this.agreementCheck = false;
    this.modal = {
      emailOrUserName: '',
      password: '',
      comments: '',
      documentCode: documentCode,
      documentId: documentId,
      documentType: documentType,
      signature: '',
      orgSpecific: false,
      inventoryYear: year
    }
    this.verificationFormBuilder.reset();
    this.verificationFormBuilder.get('emailOrUserName').setValue(this.currentUserNameOrEmail);
    this.submitted = false;
    this.errorMessage = '';
    try {
      document.querySelector('#effect-1').classList.add('md-show');
      this.viewSignature = false;
      this.clearSignature();
    } catch (error) {
    }
    setTimeout(() => {
      $('#formVerificationComments').focus();
    }, 1000);
  }

  closeMyModal() {
    return new Promise<any>((resolve) => {
      try {
        this.agreementCheck = false;
        this.verificationFormBuilder.reset();
        document.querySelector('#effect-1').classList.remove('md-show');
        resolve('');
      } catch (error) {
        resolve('');
      }
    })
  }

  onSubmit(valid) {
    this.submitted = true;
    if (valid) {
      this.formVerificationModal.spinnerShow();
      this.modal.emailOrUserName = this.verificationFormBuilder.get('emailOrUserName').value;
      this.modal.password = this.verificationFormBuilder.get('password').value;
      this.modal.comments = this.verificationFormBuilder.get('comments').value;
      this.modal.signature = this.verificationFormBuilder.get('signature').value;
      this.config.HTTPPostAPI(this.modal, 'dynamicForm/verifyFromWithSignature').subscribe(resp => {
        this.formVerificationModal.spinnerHide();
        if (resp) {
          this.errorMessage = resp.message;
          if (resp.result == 'success') {
            if (resp.message == '') {
              this.closeMyModal().then(() => {
                swal({
                  title: '',
                  text: 'Verification Done Successfully',
                  type: 'success',
                  timer: this.config.helper.swalTimer,
                  showConfirmButton: false
                });
              })
            }
          }
        }
      }, err => this.formVerificationModal.spinnerHide());
    }
  }

  signatureComplete() {
    this.verificationFormBuilder.get('signature').setValue(this.signaturePad.toDataURL());
  }

  clearSignature() {
    this.verificationFormBuilder.get('signature').setValue('');
    this.signaturePad.clear();
  }

}
