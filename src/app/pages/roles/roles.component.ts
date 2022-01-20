import { Component, OnInit, ViewEncapsulation,ViewChild } from '@angular/core';
import { Rolemodal, RolePermissionSave, Roles } from '../../models/model';
import { RolesService } from './roles.service';
import { Helper } from '../../shared/helper';
import swal from 'sweetalert2';
import { userRoleservice } from '../role-management/role-management.service';
import { AdminComponent } from '../../layout/admin/admin.component';

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class RolesComponent implements OnInit {
    filterQuery='';
    modal: RolePermissionSave = new RolePermissionSave();
    loading: boolean = false;
    toggleEditoractualresult = false;
    submitted: boolean = false;
    valadationMessage: string;
    data: Roles[] = new Array();
    roleName: string;
    roleId: number = 0;

    updateFlag: boolean = false;
    @ViewChild('myTable') table: any;
    constructor( private adminComponent: AdminComponent,public service: RolesService, public helper: Helper, public getRoleservice: userRoleservice) { }

    ngOnInit() {
        this.loadAll();
        this.adminComponent.setUpModuleForHelpContent("");
    }
    onsubmit(formIsValid) {
        if (formIsValid) {
            this.service.createRoles(this.roleName, this.roleId).subscribe(result => {
                if (result.result === "success") {
                    this.valadationMessage = "Roles Saved Successfully";
                    this.loadAll();
                } else {
                    this.valadationMessage = "Error Occured";
                }
            });
        }
        else {
            this.loading = false;
            this.submitted = true;
            return;
        }
    }

    editrole(roleName: any, roleId: any) {
        this.roleName = roleName;
        this.roleId = roleId;
    }

    loadAll() {
        this.getRoleservice.loadroles().subscribe(result => {
            for (let key in result) {
                let value = result[key];
                let temproles = new Roles(key, value);
                this.data.push(temproles);
            }
        });

    }
}
