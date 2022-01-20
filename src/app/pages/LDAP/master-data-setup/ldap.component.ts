import swal from "sweetalert2";
import { Component, OnInit, ViewChild, ViewEncapsulation } from "../../../../../node_modules/@angular/core";
import { FormBuilder, FormGroup, Validators } from "../../../../../node_modules/@angular/forms";
import { AdminComponent } from "../../../layout/admin/admin.component";
import { LDAPMasterData } from "../../../models/model";
import { Permissions } from '../../../shared/config';
import { ConfigService } from './../../../shared/config.service';
import { ModalBasicComponent } from './../../../shared/modal-basic/modal-basic.component';

@Component({
    selector: 'ldap-selector',
    templateUrl: './ldap.component.html',
    styleUrls: ['./ldap.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
    encapsulation: ViewEncapsulation.None
})
export class LDAPComponent implements OnInit {
    @ViewChild('testADSetup') testADSetup:ModalBasicComponent;
    list=new Array();
    permission=new Permissions("157",false);
    model: LDAPMasterData = new LDAPMasterData();
    hostNameValidMessage;
    testADBuilder:FormGroup;
    passwordVisible=false;
    
    constructor(private configService:ConfigService,private adminComponent: AdminComponent,private formBuilder:FormBuilder) {
    }

    ngOnInit() {
        this.adminComponent.setUpModuleForHelpContent("");
        this.loadByOrgId();
        this.configService.loadPermissionsBasedOnModule('157').subscribe(resp => {
            this.permission = resp;
        })
    }

    

    save(form) {
        this.adminComponent.spinnerFlag = true;
        if (!form.valid && !this.hostNameValidMessage) {
            this.adminComponent.spinnerFlag = false;
            return;
        }else{
            this.configService.HTTPPostAPI(this.model,"ldap/saveOrUpdate").subscribe(respnse=>{
                this.adminComponent.spinnerFlag = false;
                if(respnse.result){
                    let message=this.model.id?'LDAP updated Successfully':'LDAP saved Successfully';
                    swal({
                        title: 'Success',
                        text: message,
                        type: 'success',
                        timer: this.configService.helper.swalTimer,
                        showConfirmButton: false
                      });
                }else{
                    swal({
                        title: 'Error',
                        text: 'LDAP setting has not been configured. Please contact admin',
                        type: 'error',
                        timer: this.configService.helper.swalTimer,
                        showConfirmButton: false,
                        onClose: () => {
                        }
                      });
                }
                this.loadByOrgId();
            })
            
        }
    }

    loadByOrgId() {
        this.adminComponent.spinnerFlag = true;
        this.configService.HTTPPostAPI("", "ldap/loadByOrgId").subscribe(resp => {
            this.adminComponent.spinnerFlag = false;
            if(resp.data){
                this.model=resp.data;
            }else{
                this.model=new LDAPMasterData();
            }
        });
    }

    clearForm() {
    }

    validateIPAddress(ipaddress) {
        this.hostNameValidMessage='';
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
            return (true)
        }else{
            this.hostNameValidMessage="You have entered an invalid IP address!";
            return (false)
        }
    }

    openTestADSetUp() {
        if(this.testADBuilder)
        this.testADBuilder.reset();
        if (this.model.type == 'localAD') {
            this.testADBuilder = this.formBuilder.group({
                emailOrUserName: [this.model.clientUserName, [Validators.required]],
                password: [this.model.clientPassword, [Validators.required]],
            });
            this.testADBuilder.get('emailOrUserName').disable();
            this.testADBuilder.get('password').disable();
        } else {
            this.testADBuilder = this.formBuilder.group({
                emailOrUserName: ['', [Validators.required]],
                password: ['', [Validators.required]],
            });
        }
        this.testADSetup.show();
    }

    testSetup() {
        this.testADSetup.spinnerShow();
        if(this.model.type == 'azureAD'){
            this.model.clientUserName=this.testADBuilder.get('emailOrUserName').value;
            this.model.clientPassword=this.testADBuilder.get('password').value;
        }
        
        this.configService.HTTPPostAPI(this.model, "ldap/testLDAPSetUp").subscribe(resp => {
            this.testADSetup.spinnerHide();
            swal({
                title: 'Info',
                text: !resp.message?"Success":resp.message,
                type: 'info',
                timer: this.configService.helper.swalTimer,
                showConfirmButton: false,
                onClose: () => {
                    this.closeTestADSetup();
                }
              });
        },error=>{
            this.testADSetup.spinnerHide();
        });
    }

    closeTestADSetup() {
        if (this.testADBuilder) {
            this.testADBuilder.reset();
            this.testADBuilder=null;
        }
        this.testADSetup.hide();
    }
}