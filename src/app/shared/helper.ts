import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { IOption } from 'ng-select';
import { BehaviorSubject, Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { multipleSelectDropDownValue } from '../models/model';
import swal from 'sweetalert2';
@Injectable()

export class Helper {
    private messageSource = new BehaviorSubject("no data");
    currentMessage = this.messageSource.asObservable();
    workFlowDropDownSelection: any = null;
    workflowGridOrTable: any = null;
    workflowCompletedOrPending: any = null;
    equipmentStatusGridOrTable: any = null;
    SUCCESS_RESULT_MESSAGE = 'success';
    private IdmessageSource = new BehaviorSubject("no data");
    public stepper = new BehaviorSubject("no data");
    private individualWorkflow = new BehaviorSubject("no data");
    public steppermodel = this.stepper.asObservable();
    currentId = this.IdmessageSource.asObservable();
    individualWorkflowData = this.individualWorkflow.asObservable();
    private headers = new Headers({ 'Content-Type': 'application/json', 'Cache-Control': 'no-cache', 'Pragma': 'no-cache', 'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT' });
    //this "number" is alows only the numeric values
    number: (string | RegExp)[] = [/\d/];
    //this "number" is alows only the numeric values
    mask_phone: (string | RegExp)[] = [/[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    numbers: string = "^[0-9]*$";
    email_pattern: string = "[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}";
    url_pattern = /(http?|https):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|in|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    mobileNumberPattern: string = "[6789][0-9]{9}";
    PERMISSION_CATEGORY_DOCUMENT = "Document";
    PERMISSION_CATEGORY_FORM = "Form";
    PERMISSION_CATEGORY_TEMPLATE = "Template";
    PERMISSION_CATEGORY_LINK = "Link";
    PERMISSION_CATEGORY_FORM_GROUP = "FormGroup";
    common_URL: string = environment.common_URL;
    saas_URL: string = environment.saas_URL;
    cookieInvalidateValue = "redirect";
    Approve: string = "3";
    Rejected: string = "5";
    ReviewCompeletedOrApprovePending: string = "2";
    ReviewPending: string = "1";
    RejectedByReviewer = "4";
    APPLICATION_ADMIN = "A"
    SUPER_ADMIN = "Y";
    Reviewer: string = "2";
    Approver: string = "3";
    Admin: string = "1";
    CompletedStatus: string = "Completed";
    VENDOR_VALIDATION_NAME: string = "VENDOR VALIDATION";
    E_SIGNATURE_NAME = "E SIGNATURE VALIDATION";
    URS_NAME: string = "URS";
    VSR_NAME = 'VSR';
    IQTC_NAME: string = "IQTC";
    OQTC_NAME: string = "OQTC";
    PQTC_NAME: string = "PQTC";
    IOQTC_NAME: string = "IOQTC";
    OPQTC_NAME: string = "OPQTC";
    RISK_ASSESSMENT_NAME: string = "RISK ASSESSMENT";
    KNOWLEDGEBASE = "160";
    MAIN_MENU = "91";
    PROJECT_SETUP_VALUE = "100";
    Dashboard = "101";
    AUDIT_TRAIL_VALUE = "102";
    URS_VALUE: string = "107";
    SP_VALUE: string = "200";
    IQTC_VALUE: string = "108";
    PQTC_VALUE: string = "109";
    OQTC_VALUE: string = "110";
    IOQTC_VALUE: string = "207";
    OPQTC_VALUE: string = "208";
    USER_MANAGEMENT: string = "112";
    RISK_ASSESSMENT_VALUE: string = "113";
    TEST_CASE_CREATION_VALUE: string = "150";
    PROJECTPLAN = "116";
    DISCREPANCY_VALUE = "134";
    ROLE_MANAGEMENT = "125";
    DocumentStatus = "126";
    VENDOR_VALIDATION_VALUE = "128";
    E_SIGNATURE_VALUE = "225";
    TEMPLATE_LIBRARY_VALUE = "230";
    Traceability = "129";
    DYNAMIC_TEMPLATE_VALUE = "132";
    MASTER_DYNAMIC_TEMPLATE_WORKFLOW = '133';
    VSR_VALUE = '137';
    TEMPLATE_VALUE: string = "138";
    MASTER_DYNAMIC_FORM = '139';
    BATCH_CREATION_VALUE = '163';
    EQUIPMENT_VALUE = '141';
    STATUS_UPDATE_VALUE = '166';
    EMAIL_TEMPLATE_CONFIG = '169';
    LOG_MAPPING = '168';
    USER_MAPPING = '175';
    SMTP_MASTER_SETUP = '171';
    HOLIDAY_PLANNER = '173';
    CALENDAR_VIEW = '179';
    DATE_FORMAT = '189';
    TASK_CREATION = '190';
    CHANGE_CONTROL = '191';
    PERIODIC_REVIEW = "192";
    Unscripted_Value = "201";
    MyTask_Value = "195";
    Inventory_Report_Value = "203";
    Compliance_Report_Value = "233"
    IQTC_Discrepancy_Form = "121";
    OQTC_Discrepancy_Form = "122";
    PQTC_Discrepancy_Form = "123";
    IOQTC_Discrepancy_Form = "209";
    OPQTC_Discrepancy_Form = "210";
    DMS_Value = "136";
    SFTP_Value = "211";
    User_Acceptance = "206";
    CLEAN_ROOM_VALUE = "219";
    STATISTICAL_PROCESS_CONTROL = "220";
    COMPLIANCE_ASSESSMENT_VALUE = "231";
    SYSTEM_CERTIFICATE_VALUE = "235";
    PAGE_SIZE = 10;
    permissionsfromlocalstorage: any;
    swalTimer: number = 2000;
    AlphaNumericAndUnderscore_pattern = "^[a-zA-Z]{1,1}[a-zA-Z0-9_]*$";
    onlyCharacter_pattern = "^[a-zA-Z]*$";
    characterAndSpace_pattern = "^[a-zA-Z]{1,1}[a-zA-Z \w]*$";
    AlphaNumericUnderscoreAndSpace_pattern = "^[a-zA-Z]{1,1}[a-zA-Z0-9_ -]*$"

    // ProjectType
    PROJECT_TYPE_CLEAN_ROOM = "Clean room";

    routelinks: any = {
        "107": "/URS/view-urs",
        "108": "/tc-execution/108",
        "109": "/tc-execution/109",
        "110": "/tc-execution/110",
        "207": "/tc-execution/207",
        "208": "/tc-execution/208",
        "113": "/riskAssessment",
        "128": "/vendor/view-vendor",
        "101": "/dashboard",
        "126": "/DocStatus",
        "100": "/Project-setup/view-projectsetup",
        "129": "/traceability",
        "102": "/auditTrail",
        "137": "/Summary-Report/create-summary-report",
        "190": "/taskCreation"
    };
    categoryLink: string = "Link";
    categoryDocumentList: string = "DocumentList";

    options = {
        allowNegative: false,
        precision: 2,
        thousands: ',',
        decimal: '.',
        prefix: '$ ',
        suffix: ''
    };
    //public model: Permissions = new Permissions();
    public viewQuillOptions = {
        readOnly: true, placeholder: '', theme: 'bubble', boundary: document.body,
        modules: { toolbar: [] }
    };

    public editQuillOptions = {
        readOnly: false, placeholder: 'Insert text here ...', theme: 'snow', boundary: document.body,
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': new Array<any>() }, { 'background': new Array<any>() }],
                [{ 'font': new Array<any>() }],
                [{ 'align': new Array<any>() }],
                ['clean'],
            ]
        }
    }

    public editConfigOfCkEditior = {
        removeButtons: 'Save,Source,Preview,NewPage,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Language,CreateDiv,About,ShowBlocks,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Anchor,spellchecker,Link,Unlink'
    }

    public viewConfigOfCkEditior = {
        removeButtons: 'Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,find,selection,spellchecker,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Bold,Italic,Underline,Strike,Subscript,Superscript,CopyFormatting,RemoveFormat,list,indent,blocks,align,bidi,NumberedList,BulletedList,Outdent,Indent,Blockquote,CreateDiv,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,Format,Font,FontSize,TextColor,BGColor,ShowBlocks,About',
        readOnly: true
    }

    constructor(private _location: Location, public http: Http) { }

    setworkflowdropdownValues(workflow) {
        this.workFlowDropDownSelection = workflow
    }

    getworkflowdropdownValues() {
        return this.workFlowDropDownSelection
    }

    setworkflowGridorTable(workflow) {
        this.workflowGridOrTable = workflow
    }

    getworkflowGridorTable() {
        return this.workflowGridOrTable
    }

    setEquipmentStatusGridorTable(value) {
        this.equipmentStatusGridOrTable = value;
    }

    getEquipmentStatusGridorTable() {
        return this.equipmentStatusGridOrTable;
    }

    setworkflowcompletedOrPending(workflow) {
        this.workflowCompletedOrPending = workflow
    }

    getworkflowcompletedOrPending() {
        return this.workflowCompletedOrPending
    }

    backClicked($event) {
        $event.preventDefault();
        this._location.back();
    }

    dateToString(date: Object): string {
        if (date == "" || date == null || date == undefined) return null;
        return date['date'].year.toString() + '-' + ('0' + date['date'].month.toString()).slice(-2) + '-' + ('0' + date['date'].day.toString()).slice(-2);
    }

    stringToDate(date: string): Object {
        if (date == "" || date == null || date == undefined) return null;
        let dateSplit: string[] = date.split("-");
        return { date: { year: dateSplit[0], month: dateSplit[1], day: dateSplit[2] } };
    }

    isNumeric(obj): boolean {
        return !isNaN(parseFloat(obj)) && isFinite(obj);
    }

    handleErrorAndRedirect(error: any) {
        if (error != "dashBoard")
            window.location.href = this._location.prepareExternalUrl('login');
        else if (error == "search")
            window.location.href = this._location.prepareExternalUrl('search');
    }

    logMessage(messageMark: string, content: any) {
    }

    // this method is for chking null value
    isEmpty(value: any) {
        if (value === undefined || value === "undefined" || value === null || value === "" || value === "null" || value.length === 0 || value === "0")
            return true;
        return false;
    }

    isEmptyWithoutZeroCheck(value: any) {
        if (value === undefined || value === null || value === "" || value === "null" || value.length === 0)
            return true;
        return false;
    }

    // this method is for temporary fix
    isValidateMonths(value: string, page: number) {
        if (page == 5 && Number(value.substring(3)) > 11) {
            return false;
        } else if (page == 2 && (Number(value.substring(0, 2)) > 12 || Number(value.substring(0, 2)) == 0)) {
            return false;
        }
        return true;
    }

    yearList() {
        var max = new Date().getFullYear();
        var applicantYearsList = new Object();
        for (var min = 1940; min <= max; min) {
            applicantYearsList[min] = min;
        }
        return applicantYearsList;
    }

    monthsList() {
        var applicantMonthsList = new Object();
        applicantMonthsList = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        return applicantMonthsList;
    }

    checkvalidPasswordOrNot(password: string): string {
        var errorMessagePassword;
        var re = /^.{8,100}$/;
        if (!re.test(password)) {
            errorMessagePassword = "Password should be at least 8 characters long";
        }
        else {
            errorMessagePassword = "";
        }
        return errorMessagePassword;
    }

    convertBooleanToString(paramValueFlag: boolean) {
        if (paramValueFlag)
            return "Y";
        else
            return "N";
    }

    convertStringToBoolean(paramValue: string) {
        if (paramValue == "Y")
            return true;
        else if (paramValue == "N")
            return false;
    }

    encode(data: string) {
        return btoa(data);
    }

    decode(data: string) {
        return atob(data);
    }

    getDay(date) {
        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        var n = weekday[date.getDay()];
        return n;
    }

    removeCommonValuesFromLists(list1: any, list2: any) {
        let A = list1;
        let B = list2
        let C = A.filter(function (val) {
            return B.indexOf(val) == -1;
        });
    }

    setBaseURL() {
        return this.http.post(this.common_URL + "user/baseURL", document.location.origin)
            .map((resp) => resp.json())
            .catch(res => {
                return Observable.throw(res.json());
            });
    }

    shareSessionBetweenTabs() {
        // listen for changes to localStorage
        if (window.addEventListener) {
            window.addEventListener("storage", this.sessionStorage_transfer, false);
        }
        // Ask other tabs for session storage (this is ONLY to trigger event)
        if (!sessionStorage.length) {
            localStorage.setItem('getSessionStorage', 'foobar');
        };
    }

    // transfers sessionStorage from one tab to another
    sessionStorage_transfer = function (event) {
        if (!event) { event = window.event; }
        if (!event.newValue) return;          // do nothing if no value to work with
        if (event.key == 'getSessionStorage') {
            // another tab asked for the sessionStorage -> send it
            localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
            // the other tab should now have it, so we're done with it.
            localStorage.removeItem('sessionStorage'); // <- could do short timeout as well.
        } else if (event.key == 'sessionStorage' && !sessionStorage.length) {
            // another tab sent data <- get it
            var data = JSON.parse(event.newValue);
            for (var key in data) {
                sessionStorage.setItem(key, data[key]);
            }
        }
    };

    clearLocalStorage() {
        localStorage.clear();
    }

    b64toBlob(b64Data, contentType) {
        contentType = contentType || '';
        var sliceSize = sliceSize || 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    public cloneOptions(options: Array<multipleSelectDropDownValue>): Array<IOption> {
        let list = new Array<IOption>();
        list = options.map(option => ({ value: option.displayOrder, label: option.value }));
        return list;
    }

    getPermssionsExists(permissionValue): any {
        // let model: Permissions = new Permissions();

        // if (this.permissionsfromlocalstorage != null || this.permissionsfromlocalstorage != undefined) {
        //   for (var i = 0; i < this.permissionsfromlocalstorage.length; i) {

        //     if (this.permissionsfromlocalstorage[i].permissionValue == permissionValue) {
        //          ;
        //       if (this.permissionsfromlocalstorage[i].esignButtonFlag === true) {
        //         model.esignButtonFlag = true;
        //       }
        //       if (this.permissionsfromlocalstorage[i].approvedButtonFlag === true) {
        //           model.approvedButtonFlag = true;
        //         }
        //       if (this.permissionsfromlocalstorage[i].viewButtonFlag === true) {
        //        model.viewButtonFlag = true;
        //       }
        //       if (this.permissionsfromlocalstorage[i].deleteButtonFlag === true) {
        //         model.deleteButtonFlag = true;
        //       }
        //       if (this.permissionsfromlocalstorage[i].updateButtonFlag === true) {
        //         model.updateButtonFlag = true;
        //       }
        //       if (this.permissionsfromlocalstorage[i].importButtonFlag === true) {
        //         model.importButtonFlag = false;
        //       }
        //       if (this.permissionsfromlocalstorage[i].createButtonFlag === true) {
        //         model.createButtonFlag = true;
        //       }

        //     }
        //       ("helper",model);
        //     return model;
        //   }
        // }
    }

    changeMessage(message: any) {
        this.messageSource.next(message)
    }

    changeMessageforId(message: string) {
        this.IdmessageSource.next(message)
    }

    setIndividulaWorkflowData(message: any) {
        this.individualWorkflow.next(message)
    }

    stepperchange(message: any) {
        this.stepper.next(message)
    }

    private _listners = new Subject<any>();
    private _Idlistners = new Subject<any>();

    listen(): Observable<any> {
        return this._listners.asObservable();
    }

    Idlisten(): Observable<any> {
        return this._Idlistners.asObservable();
    }

    filter(filterBy: string) {
        this._listners.next(filterBy);
    }

    Idfilter(filterBy: string) {
        this._Idlistners.next(filterBy);
    }

    //templatebuilder lookup ids
    userSuggestionId = 30;
    documentSuggestionId = 31;
    equipmentSuggestionId = 43;
    Settingsid = 38;

    toggleView(tabKey, id) {
        localStorage.setItem(tabKey, this.encode(id));
    }

    isEmptyWithoutZero(value: any) {
        if (value == undefined || value == null || value == "" || value == "null")
            return true;
        return false;
    }

    dateToSaveInDB(date: NgbDate): string {
        let stringDate = ''
        if (!this.isEmpty(date)) {
            let month = date['month'].toLocaleString().length == 1 ? '0' + date['month'] : date['month']
            let day = date['day'].toLocaleString().length == 1 ? '0' + date['day'] : date['day']
            stringDate = date['year'] + "-" + month + "-" + day
        }
        return stringDate;
    }

    getMaxDecimalPoint(x: number, y: number): number {
        let fixed = 0;
        try {
            let xDeci = x.toString().split(".");
            let yDeci = y.toString().split(".");
            if (xDeci.length >= 2 && yDeci.length >= 2) {//if decimal exists
                if (xDeci[xDeci.length - 1].length >= yDeci[yDeci.length - 1].length)
                    fixed = xDeci[xDeci.length - 1].length
                else {
                    fixed = yDeci[yDeci.length - 1].length
                }
            } else if (xDeci.length >= 2) {
                fixed = xDeci[xDeci.length - 1].length
            } else if (yDeci.length >= 2) {
                fixed = yDeci[yDeci.length - 1].length
            }
        } catch (error) {
            return 0;
        }
        return fixed
    }

    arrayCreationForNumbers(length: number): Array<any> {
        if (length >= 0) {
            return new Array(length);
        } else {
            new Array();
        }
    }

    onlyNumber(event: any): boolean {
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 5 && !pattern.test(inputChar)) {
            event.preventDefault();
            return false;
        }
        return true;
    }

    onlyString(event: any): boolean {
        const pattern = /[a-zA-Z]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 5 && !pattern.test(inputChar)) {
            event.preventDefault();
            return false;
        }
        return true;
    }

    onlyNumberWithLimit(event, lLimit, uLimit, value) {
        let inputChar = String.fromCharCode(event.charCode);
        if (this.onlyNumber(event)) {
            let num = Number.parseInt(inputChar);
            if (isNaN(num)) {
                event.preventDefault();
                return;
            } else {
                num = Number.parseInt(value ? value : '' + "" + num);
                if (isNaN(num)) {
                    event.preventDefault();
                    return;
                } else {
                    if (!(num > lLimit && num <= uLimit)) {
                        event.preventDefault();
                        return;
                    }
                }
            }
        }
    }

    remove(list: any[], index: number, count: number) {
        list.splice(index, count)
    }

    getDFForTestCase(testcaseType: any): any {
        switch ("" + testcaseType) {
            case "108":
                return this.IQTC_Discrepancy_Form;
            case "109":
                return this.PQTC_Discrepancy_Form
            case "110":
                return this.OQTC_Discrepancy_Form
            case "207":
                return this.IOQTC_Discrepancy_Form
            case "208":
                return this.OPQTC_Discrepancy_Form
            default:
                break;
        }
    }

    getTRForTestcase(constant) {
        switch ("" + constant) {
            case "108":
                return "216";
            case "110":
                return "212"
            case "109":
                return "213"
            case "207":
                return "214"
            case "208":
                return "215"
            default:
                break;
        }
    }

    getTestCaseId(testcaseType: any): any {
        switch ("" + testcaseType) {
            case this.IQTC_VALUE:
                return "1";
            case this.OQTC_VALUE:
                return "2"
            case this.PQTC_VALUE:
                return "3"
            case this.IOQTC_VALUE:
                return "4"
            case this.OPQTC_VALUE:
                return "5"
            default:
                break;
        }
    }

    getTestCaseName(testcaseType: any): any {
        switch ("" + testcaseType) {
            case this.IQTC_VALUE:
                return this.IQTC_NAME;
            case this.PQTC_VALUE:
                return this.PQTC_NAME;
            case this.OQTC_VALUE:
                return this.OQTC_NAME;
            case this.IOQTC_VALUE:
                return this.IOQTC_NAME;
            case this.OPQTC_VALUE:
                return this.OPQTC_NAME;
            default:
                break;
        }
    }

    isTestCase(constant) {
        return (this.IQTC_VALUE == constant || this.PQTC_VALUE == constant ||
            this.OQTC_VALUE == constant || this.IOQTC_VALUE == constant || this.OPQTC_VALUE == constant)
    }

    isNonWorkFlowDocument(constant) {
        return ("102" == constant || "203" == constant || "129" == constant);
    }

    getTestCaseStatusColors(status) {
        switch (status) {
            case 'In-Progress':
                return '#ebe834 ';
            case 'Pass':
                return '#3D8B37';
            case 'Fail':
                return '#eb5334';
            case 'NA':
                return '#87CEFA'
            default:
                return '#f54296'
        }
    }

    isValidUrl(url: string) {
        if (this.url_pattern.test(url)) {
            return true
        } else {
            return false;
        }
    }

    navigateExternalURL(url: string) {
        if (this.isValidUrl(url)) {
            window.open(url, '_blank');
        } else {
            window.open('http://' + url, '_blank');
        }
    }

    setPaginator(table: any) {
        table.offset = 0;
    }

    getWorkValidationMessage(flag) {
        if (!flag) {
            return "Note*:You are not in workflow. Please contact admin!.";
        }
        return "";
    }

    setJsonToDate(json: { year, month, day }) {
        return new Date(json.year, json.month - 1, json.day, 0, 0, 0, 0);
    }

    fileSizeWarning(filenName?: string) {
        swal({
            title: 'Warning', type: 'warning', timer: this.swalTimer, showConfirmButton: false,
            text: (this.isEmpty(filenName) ? '' : filenName + ' ') + 'File size exceeds maximum limit 10 MB.',
        });
    }
}
