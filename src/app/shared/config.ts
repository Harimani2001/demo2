import { CommonModel } from "../models/model";

export class CategoryItem {
    code: string;
    value: string;
}

export class Config {
    permissions: Permissions[] = new Array();
    categories: {
        [name: string]: CategoryItem[];
    };
    dynamicForm: any;
    dynamicTemplate: any;
}

export class Permissions extends CommonModel {
    permissionValue: string
    permissionTitle: string
    viewButtonFlag: boolean
    createButtonFlag: boolean
    updateButtonFlag: boolean
    deleteButtonFlag: boolean
    importButtonFlag: boolean
    exportButtonFlag: boolean
    workFlowButtonFlag: boolean
    publishButtonFlag: boolean;
    userInWorkFlow: boolean
    constructor(type, disableFlag) {
        super();
        this.permissionValue = type;
        this.viewButtonFlag = disableFlag;
        this.createButtonFlag = disableFlag;
        this.updateButtonFlag = disableFlag;
        this.deleteButtonFlag = disableFlag;
        this.importButtonFlag = disableFlag;
        this.exportButtonFlag = disableFlag;
        this.workFlowButtonFlag = disableFlag;
    }

}
