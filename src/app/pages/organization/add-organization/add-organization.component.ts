import swal from 'sweetalert2';
import { Component, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Helper } from '../../../shared/helper';
import { OrganizationDetails } from '../../../models/model';
import { OraganizationService } from "../organization.service";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { NgbDateISOParserFormatter } from "@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-parser-formatter";
import { LookUpService } from '../../LookUpCategory/lookup.service';
import { IOption } from 'ng-select';
import { AdminComponent } from '../../../layout/admin/admin.component';
import { locationValidationMsg } from '../../../shared/constants';

@Component({
    selector: 'app-add-organization',
    templateUrl: './add-organization.component.html',
    styleUrls: ['./add-organization.component.css', '../../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
    encapsulation: ViewEncapsulation.None
})
export class AddOrganizationComponent implements OnInit {
    valadationMessage: string = "";
    organizationModel: OrganizationDetails = new OrganizationDetails();
    isLoading: boolean = false;
    submitted: boolean = false;
    successMessage: string = "";
    errorMessage: string = "";
    receivedId: string;
    isUpdate: boolean = false;
    isExhausted: boolean = false;
    public today: NgbDateStruct;
    public validTillDate: NgbDateStruct;
    public dynamicId: any;
    public isClicked: boolean = false;
    licenseExpired: boolean = false;
    public isFlag: boolean = false;
    public notifyMsg: string = "A new Company has been added";
    public loginUser: string;
    public pinCode: string;
    lookUpItemList: any[] = new Array();
    selectedModules: Array<String> = new Array();
    module: boolean = false;
    timeZoneList: Array<IOption> = new Array<IOption>();
    dateFormatList: any[] = new Array();
    installationPlans: any[] = new Array();
    error: string = "";

    constructor(private adminComponent: AdminComponent, public lookUpService: LookUpService, private _eref: ElementRef, public helper: Helper, private route: ActivatedRoute, private routers: Router, private comanyService: OraganizationService, private locationValMsg: locationValidationMsg) { }
    
    ngOnInit() {
        this.adminComponent.setUpModuleForHelpContent("99");
        this.adminComponent.taskDocType = "99";
        this.adminComponent.taskDocTypeUniqueId = "";
        this.adminComponent.taskEquipmentId = 0;
        this.getTimeZoneList();
        this.lookUpService.getlookUpItemsBasedOnCategory("SaaSInstallationPlans").subscribe(result => {
            this.installationPlans = result.response;
        });
        this.lookUpService.getlookUpItemsBasedOnCategory("orgDocumentList").subscribe(result => {
            this.lookUpItemList = result.response;
            this.lookUpItemList.forEach(element => {
                if (element.key === '140')
                    element.selected = true;
                else
                    element.selected = false;
            });
            let now = new Date();
        let tempData = new NgbDateISOParserFormatter;
        this.today = tempData.parse(now.toISOString());
        this.receivedId = this.route.snapshot.params["id"];
        this.validTillDate = this.today;
        this.organizationModel.comapnyLicenseValidTill = this.today;
        if (this.receivedId !== undefined) {
            this.isUpdate = true;
            this.organizationModel.id = +this.receivedId;
            this.comanyService.getDataForEdit(this.organizationModel.id).subscribe(
                jsonResp => {
                    this.loadDateFormatsOfOrganization(this.organizationModel.id);
                    this.organizationModel = jsonResp.Organization;
                    if (this.organizationModel.pincode == 0)
                        this.organizationModel.pincode = null;
                    if (this.organizationModel.organizationLicense + '' == this.organizationModel.organizationLicenseUsed)
                        this.isExhausted = true;
                    if (this.organizationModel.comapnyLicenseValidTill != null) {
                        let dateString = this.organizationModel.comapnyLicenseValidTill.split("/");
                        let validDate = new Date();
                        validDate.setDate(dateString[0]);
                        validDate.setMonth(dateString[1] - 1);
                        validDate.setFullYear(dateString[2]);
                        this.organizationModel.comapnyLicenseValidTill = tempData.parse(validDate.toISOString());
                        let today = new Date();

                        var dd = today.getDate();
                        var mm = today.getMonth() + 1; //January is 0!
                        var yyyy = today.getFullYear();

                        if (this.organizationModel.comapnyLicenseValidTill.year < yyyy)
                            this.licenseExpired = true;
                        else if (this.organizationModel.comapnyLicenseValidTill.year == yyyy
                            && this.organizationModel.comapnyLicenseValidTill.month < mm)
                            this.licenseExpired = true;
                        else if (this.organizationModel.comapnyLicenseValidTill.year == yyyy
                            && this.organizationModel.comapnyLicenseValidTill.month == mm
                            && this.organizationModel.comapnyLicenseValidTill.day < dd)
                            this.licenseExpired = true;
                    }
                    if (!this.helper.isEmpty(jsonResp.Organization.orgModule)) {
                        this.lookUpItemList.forEach(element => {
                            jsonResp.Organization.orgModule.forEach(data => {
                                if (element.key === data) {
                                    element.selected = true;
                                }
                            });
                        });
                    }
                },
                err => {
                }
            );
        }
        else {
            this.organizationModel = new OrganizationDetails();
            if (this.organizationModel.organizationLicense + '' == this.organizationModel.organizationLicenseUsed)
                this.isExhausted = true;
            if (this.organizationModel.comapnyLicenseValidTill != null) {
                let dateString = this.organizationModel.comapnyLicenseValidTill.split("/");
                let validDate = new Date();
                validDate.setDate(dateString[0]);
                validDate.setMonth(dateString[0] - 1);
                validDate.setFullYear(dateString[2]);
                this.organizationModel.comapnyLicenseValidTill = tempData.parse(validDate.toISOString());
            }
            this.loadDateFormatsOfOrganization(0);
        }
        });
    }

    getTimeZoneList() {
        this.comanyService.getTimezoneList().subscribe(result => {
            this.timeZoneList = result.map(option => ({ value: option.key, label: option.key }));
        });

    }

    loadDateFormatsOfOrganization(id) {
        this.adminComponent.configService.HTTPPostAPI(id, "lookup/loadDateFormatForOrganization").subscribe(result => {
            this.dateFormatList = result;
        });
    }

    saveAndGoto(formIsValid: any, value: any) {
        if (this.organizationModel.activeUserSessions <= this.organizationModel.organizationLicense) {
            this.submitted = true;
            this.isLoading = true;
            let timerInterval;
            this.isFlag = true;
            if (!formIsValid) {
                this.submitted = true;
                this.isLoading = false;
                this.isFlag = false;
                return;
            }
            if (this.valadationMessage != "") {
                this.submitted = true;
                this.isLoading = false;
                this.isFlag = false;
                return;
            }
            this.validTillDate = this.organizationModel.comapnyLicenseValidTill;
            this.organizationModel.comapnyLicenseValidTill = this.validTillDate.day + "/"
                + this.validTillDate.month + "/"
                + this.validTillDate.year;
            this.organizationModel.isDefault = "false";
            if (this.receivedId !== undefined) {
                this.organizationModel.id = + this.receivedId;
            } else { this.organizationModel.id = 0; }

            this.selectedModules = new Array();
            this.lookUpItemList.forEach(element => {
                if (element.selected)
                    this.selectedModules.push(element.key);
            });
            this.organizationModel.selectedModules = this.selectedModules;

            this.comanyService.saveOrgDetailsInLicenseDb(this.organizationModel).subscribe(result => {
                if (result) {
                    this.organizationModel.comapnyLicenseValidTill = this.validTillDate.day + "/"+ this.validTillDate.month + "/"+ this.validTillDate.year;
                    this.isLoading = false;
                    this.isFlag = false;
                    if(this.organizationModel.id !=0){
                        this.completeInstallation(this.organizationModel);
                    }else{
                        swal({
                            title: value + ' Successfully!',
                            text: this.organizationModel.organizationName + ' Details has been ' + value,
                            type: 'success',
                            timer: this.helper.swalTimer,
                            showConfirmButton: false,
                            onClose: () => {
                                this.organizationModel.id = 1;
    
                                if (this.routers.url.search("masterControl") != -1) {
                                    this.routers.navigate(["/masterControl"]);
                                } else {
                                    this.routers.navigate(["/organization/view-organization"]);
                                }
                                clearInterval(timerInterval);
                            }
                        });
                    }
                } else {
                    this.isLoading = false;
                    this.submitted = false;
                    this.isUpdate = false;
                    this.isFlag = false;
                    swal({
                        title: 'Error in Saving!',
                        text: this.organizationModel.organizationName + ' Company Details has not  been saved.',
                        type: 'error',
                        timer: this.helper.swalTimer,
                        showConfirmButton: false
                    });
                }

            });
            this.organizationModel.comapnyLicenseValidTill = this.validTillDate;
        } else {
            this.submitted = true;
        }
    }

    addData(data: any) {
        if (data == '139') {
            this.module = true;
        }
        this.selectedModules.push(data);
        this.organizationModel.selectedModules = this.selectedModules;
    }

    onlyNumber(event: any) {
        const pattern = /[0-9\\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    showNext = (() => {
        var timer: any = 2;
        return () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                this.comanyService.checkEmailExists(this.organizationModel.organizationEmail).subscribe(
                    jsonResp => {
                        let responseMsg: boolean = jsonResp;
                        if (responseMsg == true) {
                            this.valadationMessage = "Email is Already Registered";
                        } else {
                            this.valadationMessage = "";
                        }
                    }
                );
            }, 600);
        }
    })();

    orgNameExist = (() => {
        var timer: any = 2;
        return () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                this.comanyService.checkNameExists(this.organizationModel.organizationName).subscribe(
                    jsonResp => {
                        let responseMsg: boolean = jsonResp;
                        if (responseMsg == true) {
                            this.error = "Organization is Already Registered";
                        } else {
                            this.error = "";
                        }
                    }
                );
            }, 600);
        }
    })();

    openDatepicker(id) {
        this.dynamicId = id;
        this.isClicked = true;
    }

    onClick(event) {
        let path = event.path;
        let check = false;
        for (var index = 0; index < path.length; index++) {
            if (path[index].id == "inputgroup") {
                check = true;
                break;
            }
        }
        if (this.isClicked && !check) {
            this.dynamicId.close();
        }
        if (this.dynamicId == undefined) {
        }
        else if (!this._eref.nativeElement.contains(event.target)) {
            let self = this;
            setTimeout(function () {
                self.dynamicId.close();
            }, 10);
        }
    }

    checkCopyEmailRule() {
        if (this.organizationModel.emailRuleDefault) {
            this.lookUpItemList.forEach(element => {
                if (element.key === '107') {
                    if (!element.selected)
                        element.selected = true;
                }
            });
        }
    }

    checkOnly(event) {
        var k;
        k = event.charCode;
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
      }
      completeInstallation(dataObj) {
        this.organizationModel.selectedModules = dataObj.orgModule;
        this.organizationModel.timeZone = dataObj.timeZone;
        this.organizationModel.dateFormat = dataObj.dateFormat;
        this.organizationModel.organizationName = dataObj.organizationName;
        this.organizationModel.organizationLicense = dataObj.organizationLicense;
        this.organizationModel.activeUserSessions = dataObj.activeUserSessions;
        this.organizationModel.comapnyLicenseValidTill = dataObj.comapnyLicenseValidTill;
        this.organizationModel.organizationEmail = dataObj.organizationEmail;
        this.organizationModel.equipmentCount = dataObj.equipmentCount;
        this.organizationModel.isDefault = dataObj.isDefault;
        this.organizationModel.locationCode =dataObj.locationCode;
        this.organizationModel.locationName =dataObj.locationName;
        this.organizationModel.storageSpace = dataObj.storageSpace;
    
        this.organizationModel.equipmentCount = dataObj.equipmentCount;
        this.organizationModel.isDefault = dataObj.isDefault;
        this.organizationModel.storageSpace = dataObj.storageSpace;
        this.organizationModel.country = dataObj.country;
        this.organizationModel.state = dataObj.state;
        this.organizationModel.pincode = dataObj.pincode;
        this.organizationModel.street = dataObj.street;
        this.organizationModel.termsAndConditions = dataObj.termsAndConditions;
        this.organizationModel.district = dataObj.district;
        this.organizationModel.formCount = dataObj.formCount;
        this.organizationModel.projectCount = dataObj.projectCount;
        this.organizationModel.periodicDuration=dataObj.periodicDuration;
        this.organizationModel.installationPlan=dataObj.installationPlan;
        this.isFlag = true;
        this.comanyService.saveAndGoto(this.organizationModel).subscribe(result => {
          let responseMsg: string = result.result;
          if (responseMsg === "success") {
            this.isFlag = false;
            swal({
              title: 'Creation' + ' Successfully!',
              text: ' Details has been ',
              type: 'success',
              timer: this.helper.swalTimer,
              showConfirmButton: false,
            });
          } else {
            this.isFlag = false;
            swal({
              title: 'Error in Saving!',
              text: ' Company Details has not  been saved.',
              type: 'error',
              timer: this.helper.swalTimer,
              showConfirmButton: false
            });
          }
        },
          err => {
            this.isFlag = false;
            swal({
              title: 'Error in Saving!',
              text: '"Oops, something went wrong" Please delete the organization and try again!.. ',
              type: 'error',
              timer: this.helper.swalTimer,
              showConfirmButton: false
            });
          }
        );
      }
}