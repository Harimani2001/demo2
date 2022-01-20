import { Injectable } from '@angular/core';
import { ConfigService } from '../config.service';
import { Router } from '@angular/router';
import { LookUpService } from '../../pages/LookUpCategory/lookup.service';
import { Helper } from '../helper';

export interface BadgeItem {
    type: string;
    value: string;
}

export class ChildrenItems {
    state: string;
    target?: boolean;
    name: string;
    type?: string;
    children?: ChildrenItems[];
}

export class MainMenuItems {
    state: string;
    short_label?: string;
    main_state?: string;
    target?: boolean;
    name: string;
    type: string;
    icon: string;
    badge?: BadgeItem[];
    children?: ChildrenItems[];
    displayOrder: any;
}

export class Menu {
    label: string;
    main: MainMenuItems[];
}

const MENUITEMS = [
    {
        label: 'Admin',
        main: [],
    }
];

@Injectable()
export class MenuItems {

    menuList: Menu[] = new Array();
    staticDocsList: any;
    constructor(public helper: Helper, private configService: ConfigService,
         public router: Router, public lookUpService: LookUpService) { }

    //Dashboard  //link
    dashboardLinks(): MainMenuItems {
        let label: 'Admin'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "dashboard";
        menuItem.short_label = "DS";
        menuItem.name = "DashBoard";
        menuItem.type = "link";
        menuItem.icon = "ti-blackboard";
        return menuItem;
    }
    //AuditTrails //link
    auditTrailLinks(): MainMenuItems {
        let label: 'Admin'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "auditTrail";
        menuItem.short_label = "A";
        menuItem.name = "AuditTrial";
        menuItem.type = "link";
        menuItem.icon = "ti-eye";
        return menuItem;
    }
    knowledgeBaseLinks(): MainMenuItems {
        let label: 'Admin'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "knowledgeBase/view-knowledgeBase";
        menuItem.short_label = "K";
        menuItem.name = "Knowledge Base";
        menuItem.type = "link";
        menuItem.icon = "ti-book";
        return menuItem;
    }
    advancedSearch(): MainMenuItems {
        let label: 'adventsysSearch'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "search";
        menuItem.short_label = "S";
        menuItem.name = "Search";
        menuItem.type = "link";
        menuItem.icon = "ti-search";
        return menuItem;
    }
    discrepancy(): MainMenuItems {
        let label: 'df'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "df";
        menuItem.short_label = "S";
        menuItem.name = "Discrepancy Form";
        menuItem.type = "sub";
        menuItem.icon = "ti-receipt";
        let childArray: ChildrenItems[] = new Array();
        for (var i = 0; i < 1; i++) {
            let childItem = new ChildrenItems();
            switch (i) {
                case 0:
                    childItem.state = "view-df";
                    childItem.name = "View-df";
                    childItem.type = "link";
                    break;
            }
            childArray.push(childItem);
        }
        menuItem.children = childArray;
        return menuItem;
    }

    validationSummary(): MainMenuItems {
        let label: 'df'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "Summary-Report";
        menuItem.short_label = "SRV";
        menuItem.name = "Validation Summary Report";
        menuItem.type = "sub";
        menuItem.icon = "ti-receipt";
        let childArray: ChildrenItems[] = new Array();
        for (var i = 0; i < 1; i++) {
            let childItem = new ChildrenItems();
            switch (i) {
                case 0:
                    childItem.state = "create-summary-report";
                    childItem.name = "Create & View VS report";
                    childItem.type = "link";
                    break;
            }
            childArray.push(childItem);
        }
        menuItem.children = childArray;
        return menuItem;
    }

    pdfPreferencesLinks(): MainMenuItems {
        let label: 'pdfPreference'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "pdfPreference";
        menuItem.short_label = "P";
        menuItem.name = "PdfPreference";
        menuItem.type = "link";
        menuItem.icon = "ti-write";
        return menuItem;
    }

    masterdatasetupLinks(): MainMenuItems {
        let label: 'masterdatasetup'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "Masterdatasetup";
        menuItem.short_label = "P";
        menuItem.name = "Master data setup";
        menuItem.type = "link";
        menuItem.icon = "ti-write";
        return menuItem;
    }

    projectPlan(): MainMenuItems {
        let label: 'ProjectPlan'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "projectplan";
        menuItem.short_label = "P";
        menuItem.name = "ProjectPlan";
        menuItem.type = "sub";
        menuItem.icon = "ti-write";
        let childArray: ChildrenItems[] = new Array();
        for (var i = 0; i < 1; i++) {
            let childItem = new ChildrenItems();
            switch (i) {
                // case 0:
                //     childItem.state = "add-organization";
                //     childItem.name = "Add-Organisation";
                //     childItem.type = "link";
                //     break;
                case 0:
                    childItem.state = "view-projectplan";
                    childItem.name = "View-projectplan";
                    childItem.type = "link";
                    break;
            }
            childArray.push(childItem);
        }
        menuItem.children = childArray;
        return menuItem;
    }

    //department //link
    departmentLinks(): MainMenuItems {
        let label: 'Admin'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "department";
        menuItem.short_label = "DS";
        menuItem.name = "Department";
        menuItem.type = "link";
        menuItem.icon = "ti-blackboard";
        return menuItem;
    }
    //riskAssessment //doc
    riskAssessmentDocument(): MainMenuItems {
        let label: 'Admin'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "riskAssessment";
        menuItem.short_label = "DS";
        menuItem.name = "Risk-Assessment";
        menuItem.type = "link";
        menuItem.icon = "ti-blackboard";
        return menuItem;
    }
    //riskAssessmentTemplate //doc
    riskAssessmentTemplateDocument(): MainMenuItems {
        let label: 'Admin'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "riskAssessmentTemplate";
        menuItem.short_label = "RAT";
        menuItem.name = "Risk-Assessment-Template";
        menuItem.type = "link";
        menuItem.icon = "ti-blackboard";
        return menuItem;
    }

    //rolesManagement //link
    rolesManagementLinks(): MainMenuItems {
        let label: 'Admin'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "rolesManagement";
        menuItem.short_label = "RM";
        menuItem.name = "Role-Management";
        menuItem.type = "link";
        menuItem.icon = "ti-blackboard";
        return menuItem;
    }

    //Priority //link
    priorityLinks(): MainMenuItems {
        let label: 'Admin'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "Priority";
        menuItem.short_label = "RAT";
        menuItem.name = "Priority";
        menuItem.type = "link";
        menuItem.icon = "ti-blackboard";
        return menuItem;
    }

    //category //link
    categoryLinks(): MainMenuItems {
        let label: 'Admin'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "category";
        menuItem.short_label = "RAT";
        menuItem.name = "Category";
        menuItem.type = "link";
        menuItem.icon = "ti-blackboard";
        return menuItem;
    }
    //Traceability matrix //link
    traceability(): MainMenuItems {
        let label: 'Admin'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "traceability";
        menuItem.short_label = "Traceability Matrix";
        menuItem.name = "Traceability Matrix";
        menuItem.type = "link";
        menuItem.icon = "ti-blackboard";
        return menuItem;
    }
    //Status //link
    statusLinks(): MainMenuItems {
        let label: 'Admin'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "DocStatus";
        menuItem.short_label = "RAT";
        menuItem.name = "Document Status";
        menuItem.type = "link";
        menuItem.icon = "ti-blackboard";
        return menuItem;
    }


    //organisation //superadmin
    organisationLinks(): MainMenuItems {
        //organisation
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "organization";
        menuItem.short_label = "O";
        menuItem.name = "Organisation";
        menuItem.type = "sub";
        menuItem.icon = "ti-home";

        //Preparing childs
        let childArray: ChildrenItems[] = new Array();
        for (var i = 0; i < 1; i++) {
            let childItem = new ChildrenItems();
            switch (i) {
                // case 0:
                //     childItem.state = "add-organization";
                //     childItem.name = "Add-Organisation";
                //     childItem.type = "link";
                //     break;
                case 0:
                    childItem.state = "view-organization";
                    childItem.name = "View-Organisation";
                    childItem.type = "link";
                    break;
            }
            childArray.push(childItem);
        }
        menuItem.children = childArray;
        return menuItem;
    }

    //projectsetup //link
    projectSetupLinks(): MainMenuItems {
        //projectsetup
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "Project-setup";
        menuItem.short_label = "D";
        menuItem.name = "ProjectSetup";
        menuItem.type = "sub";
        menuItem.icon = "ti-home";

        //Preparing childs
        let childArray: ChildrenItems[] = new Array();
        for (var i = 0; i < 1; i++) {
            let childItem = new ChildrenItems();
            switch (i) {
                // case 0:
                //     childItem.state = "add-projectsetup";
                //     childItem.name = "Add-projectsetup";
                //     childItem.type = "link";
                //     break;
                case 0:
                    childItem.state = "view-projectsetup";
                    childItem.name = "View-projectsetup";
                    childItem.type = "link";
                    break;
            }
            childArray.push(childItem);
        }
        menuItem.children = childArray;
        return menuItem;
    }

    //urs //doc
    ursDoc(): MainMenuItems {
        //urs
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "URS";
        menuItem.short_label = "URS";
        menuItem.name = "URS";
        menuItem.type = "sub";
        menuItem.icon = "ti-home";

        //Preparing childs
        let childArray: ChildrenItems[] = new Array();
        for (var i = 0; i < 1; i++) {
            let childItem = new ChildrenItems();
            switch (i) {
                // case 0:
                //     childItem.state = "add-urs";
                //     childItem.name = "Add-URS";
                //     childItem.type = "link";
                //     break;
                case 0:
                    childItem.state = "view-urs";
                    childItem.name = "View-URS";
                    childItem.type = "link";
                    break;
            }
            childArray.push(childItem);
        }
        menuItem.children = childArray;
        return menuItem;
    }

    newStatusLinks(): MainMenuItems {
        let label: 'Admin'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "newDocumentStatus";
        menuItem.short_label = "RAT";
        menuItem.name = "Document Status";
        menuItem.type = "link";
        menuItem.icon = "ti-blackboard";
        return menuItem;
    }
    //Iqtc //doc
    iqtcDoc(): MainMenuItems {
        //Iqtc
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "iqtc";
        menuItem.short_label = "IQTC";
        menuItem.name = "IQ Test Case";
        menuItem.type = "sub";
        menuItem.icon = "ti-home";

        //Preparing childs
        let childArray: ChildrenItems[] = new Array();
        for (var i = 0; i < 1; i++) {
            let childItem = new ChildrenItems();
            switch (i) {
                // case 0:
                //     childItem.state = "add-iqtc";
                //     childItem.name = "Add-IQTC";
                //     childItem.type = "link";
                //     break;
                case 0:
                    childItem.state = "view-iqtc";
                    childItem.name = "View-IQTC";
                    childItem.type = "link";
                    break;
            }
            childArray.push(childItem);
        }
        menuItem.children = childArray;
        return menuItem;
    }

    TestCaseExecution(): MainMenuItems {
        //Iqtc
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();

        menuItem.name = "Test Case Execution";
        menuItem.type = "sub";
        menuItem.icon = "ti-home";
        menuItem.state = "test";
        menuItem.short_label = "Test";
        //Preparing childs
        let childArray: ChildrenItems[] = new Array();
        for (var i = 0; i < 3; i++) {
            let childItem = new ChildrenItems();
            switch (i) {

                case 0:
                    childItem.state = "view-iqtc";
                    childItem.name = "View-IQTC";
                    childItem.type = "link";
                    if (this.configService.getPermssionsExists("108")) {
                        childArray.push(childItem);
                        menuItem.children = childArray;
                    }
                    break;
                case 1:
                    menuItem.short_label = "OQTC";
                    childItem.state = "view-oqtc";
                    childItem.name = "View-OQTC";
                    childItem.type = "link";
                    if (this.configService.getPermssionsExists("110")) {
                        childArray.push(childItem);
                        menuItem.children = childArray;
                    }
                    break;
                case 2:
                    childItem.state = "view-pqtc";
                    childItem.name = "View-PQTC";
                    childItem.type = "link";
                    if (this.configService.getPermssionsExists("109")) {
                        childArray.push(childItem);
                        menuItem.children = childArray;
                    }
                    break;
                case 3:
                    childItem.state = "view-pqtc";
                    childItem.name = "View-PQTC";
                    childItem.type = "link";
                    if (this.configService.getPermssionsExists("109")) {
                        childArray.push(childItem);
                        menuItem.children = childArray;
                    }
                    break;
                case 4:
                    childItem.state = "view-pqtc";
                    childItem.name = "View-PQTC";
                    childItem.type = "link";
                    if (this.configService.getPermssionsExists("109")) {
                        childArray.push(childItem);
                        menuItem.children = childArray;
                    }
                    break;
            }
            //childArray.push(childItem);
        }
        // menuItem.children = childArray;
        return menuItem;
    }

    //oqtc //doc
    oqtcDoc(): MainMenuItems {
        //oqtc
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "oqtc";
        menuItem.short_label = "OQTC";
        menuItem.name = "OQ Test Case";
        menuItem.type = "sub";
        menuItem.icon = "ti-home";

        //Preparing childs
        let childArray: ChildrenItems[] = new Array();
        for (var i = 0; i < 1; i++) {
            let childItem = new ChildrenItems();
            switch (i) {
                // case 0:
                //     childItem.state = "add-oqtc";
                //     childItem.name = "Add-OQTC";
                //     childItem.type = "link";
                //     break;
                case 0:
                    childItem.state = "view-oqtc";
                    childItem.name = "View-OQTC";
                    childItem.type = "link";
                    break;
            }
            childArray.push(childItem);
        }
        menuItem.children = childArray;
        return menuItem;
    }

    //pqtc //doc
    pqtcDoc(): MainMenuItems {
        //pqtc
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "pqtc";
        menuItem.short_label = "PQTC";
        menuItem.name = "PQ Test Case";
        menuItem.type = "sub";
        menuItem.icon = "ti-home";

        //Preparing childs
        let childArray: ChildrenItems[] = new Array();
        for (var i = 0; i < 1; i++) {
            let childItem = new ChildrenItems();
            switch (i) {
                // case 0:
                //     childItem.state = "add-pqtc";
                //     childItem.name = "Add-PQTC";
                //     childItem.type = "link";
                //     break;
                case 0:
                    childItem.state = "view-pqtc";
                    childItem.name = "View-PQTC";
                    childItem.type = "link";
                    break;
            }
            childArray.push(childItem);
        }
        menuItem.children = childArray;
        return menuItem;
    }

    //lookup //link
    lookUpLink(): MainMenuItems {
        //lookup
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "look-up";
        menuItem.short_label = "LU";
        menuItem.name = "Look-Up";
        menuItem.type = "sub";
        menuItem.icon = "ti-settings";

        //Preparing childs
        let childArray: ChildrenItems[] = new Array();
        for (var i = 0; i < 1; i++) {
            let childItem = new ChildrenItems();
            switch (i) {
                case 0:
                    childItem.state = "lookup-item";
                    childItem.name = "lookup-item";
                    childItem.type = "link";
                    break;
            }
            childArray.push(childItem);
        }
        menuItem.children = childArray;
        return menuItem;
    }

    //userManagement //link
    userManagementLink(): MainMenuItems {
        //lookup

        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "userManagement";
        menuItem.short_label = "P";
        menuItem.name = "User Management";
        menuItem.type = "sub";
        menuItem.icon = "ti-eye";

        //Preparing childs
        let childArray: ChildrenItems[] = new Array();
        for (var i = 0; i < 1; i++) {
            let childItem = new ChildrenItems();
            switch (i) {
                // case 0:
                //     childItem.state = "add-user";
                //     childItem.name = "Add-user";
                //     childItem.type = "link";
                //     break;
                case 0:
                    childItem.state = "view-user";
                    childItem.name = "View-user";
                    childItem.type = "link";
                    break;
            }
            childArray.push(childItem);
        }
        menuItem.children = childArray;
        return menuItem;
    }

    masterControl(): MainMenuItems {
        let label: 'Admin'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "masterControl";
        menuItem.short_label = "RAT";
        menuItem.name = "Templates";
        menuItem.type = "link";
        menuItem.icon = "ti-blackboard";
        return menuItem;
    }
    dmsMenu(): MainMenuItems {
        let label: 'Admin'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "dms";
        menuItem.short_label = "DMS";
        menuItem.name = "DMS";
        menuItem.type = "link";
        menuItem.icon = "ti-layout-media-overlay";
        return menuItem;
    }
    templatesMenu(): MainMenuItems {
        let label: 'Admin'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "templates";
        menuItem.short_label = "Templates";
        menuItem.name = "Templates";
        menuItem.type = "link";
        menuItem.icon = "ti-layout-media-overlay";
        return menuItem;
    }
    newDynamicTemplate(): MainMenuItems {
        let label: 'Admin'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "newDynamicTemplate";
        menuItem.short_label = "newDynamicTemplate";
        menuItem.name = "Dynamic Template";
        menuItem.type = "link";
        menuItem.icon = "ti-layout-media-overlay";
        return menuItem;
    }

    bulkUploadMenu(): MainMenuItems {
        let label: 'Admin'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "bulkUpload";
        menuItem.short_label = "Bulk Upload";
        menuItem.name = "Bulk Upload";
        menuItem.type = "link";
        menuItem.icon = "ti-layout-media-overlay";
        return menuItem;
    }
    masterdatamenu(): MainMenuItems {
        let label: 'Admin'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "MainMenu";
        menuItem.short_label = "Home";
        menuItem.name = "Home";
        menuItem.type = "link";
        menuItem.icon = "ti-blackboard";
        menuItem.displayOrder = 1;
        return menuItem;
    }

    testCaseCreation(): MainMenuItems {
        let label: 'Admin'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "testCaseCreation";
        menuItem.short_label = "testCaseCreation";
        menuItem.name = "Test Case Creation";
        menuItem.type = "link";
        menuItem.icon = "ti-blackboard";
        return menuItem;
    }

    vendorDocumentLink(): MainMenuItems {
        //lookup
        let label: 'Vendor'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "vendor";
        menuItem.short_label = "V";
        menuItem.name = "Validation Documents";
        menuItem.type = "sub";
        menuItem.icon = "ti-joomla";
        //Preparing childs
        let childArray: ChildrenItems[] = new Array();
        for (var i = 0; i < 1; i++) {
            let childItem = new ChildrenItems();
            switch (i) {
                // case 0:
                //     childItem.state = "add-vendor";
                //     childItem.name = "Add-Vendor";
                //     childItem.type = "link";
                //     break;
                case 0:
                    childItem.state = "view-vendor";
                    childItem.name = "View-Validation Documents";
                    childItem.type = "link";
                    break;
            }
            childArray.push(childItem);
        }
        menuItem.children = childArray;
        return menuItem;
    }

    dynamicTemplateLink(): MainMenuItems {
        //lookup
        let label: 'dynamicTemplate'
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "dynamicTemplate";
        menuItem.short_label = "D";
        menuItem.name = "Document Templates";
        menuItem.type = "sub";
        menuItem.icon = "ti-joomla";
        //Preparing childs
        let childArray: ChildrenItems[] = new Array();
        for (var i = 0; i < 1; i++) {
            let childItem = new ChildrenItems();
            switch (i) {
                // case 0:
                //     childItem.state = "add-dynamicTemplate";
                //     childItem.name = "Add-Dynamic Template";
                //     childItem.type = "link";
                //     break;
                case 0:
                    childItem.state = "view-dynamicTemplate";
                    childItem.name = "View-Document Templates";
                    childItem.type = "link";
                    break;
            }
            childArray.push(childItem);
        }
        menuItem.children = childArray;
        return menuItem;
    }

    masterForm(): MainMenuItems {
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "workFlowMasterDynamicForm";
        menuItem.short_label = "MDFWF";
        menuItem.name = "Forms";
        menuItem.type = "link";
        menuItem.icon = "ti-trello";
        return menuItem;
    }
    masterFormReports(): MainMenuItems {
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "formReports";
        menuItem.short_label = "F";
        menuItem.name = "Form Reports";
        menuItem.type = "link";
        menuItem.icon = "ti-trello";
        return menuItem;
    }

    masterTemplateWorkFlow(): MainMenuItems {
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = "workFlowMasterDynamicTemplate";
        menuItem.short_label = "MDFWF";
        menuItem.name = "Dynamic Template Work Flow";
        menuItem.type = "link";
        menuItem.icon = "ti-stats-up";
        return menuItem;
    }
    populateDynamicForms(element: any): MainMenuItems {
        let menuItem: MainMenuItems = new MainMenuItems();
        menuItem = new MainMenuItems();
        menuItem.state = element.state;
        menuItem.short_label = element.short_label;
        menuItem.name = element.name;
        menuItem.type = element.type;
        menuItem.icon = element.icon;
        menuItem.displayOrder = element.displayOrder
        return menuItem;
    }

}