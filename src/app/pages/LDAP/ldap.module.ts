import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { DataTableModule } from 'angular2-datatable';
import { UiSwitchModule } from 'ng2-ui-switch';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';
import { SharedModule } from './../../shared/shared.module';
import { LDAPComponent } from './master-data-setup/ldap.component';

export const employeeRoutes: Routes = [
    {
        path: '',
        canActivate: [ AuthGuardService ],
        data: {
            status: false
        },
        children: [
            {
                path: 'ldap-master',
                component:LDAPComponent
            }

        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(employeeRoutes),
        SharedModule,
        FormsModule,
        HttpModule,
        DataTableModule,
        ReactiveFormsModule,
        UiSwitchModule,
    ],
    declarations: [LDAPComponent],
    providers: [ModalBasicComponent ]
})
export class LDAPModule { }


