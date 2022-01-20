import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Helper } from '../../shared/helper';
import { HttpModule } from '@angular/http';
import { AuthGuardService } from '../../layout/auth/AuthGuardService';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { MainmenuComponent } from './mainmenu.component';
import { projectsetupService } from '../projectsetup/projectsetup.service';
import { ExpansionPanelsModule } from 'ng2-expansion-panels';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { ChartsModule } from 'ng2-charts';
import { SqueezeBoxModule } from 'squeezebox';
import { DataTableModule } from 'angular2-datatable';

export const MainMenuRoutes: Routes = [
    {
        path: '',
        component: MainmenuComponent,
        canActivate: [AuthGuardService],
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(MainMenuRoutes),
        SharedModule,
        FormsModule,
        HttpModule,
        SharedCommonModule,
        SqueezeBoxModule,DataTableModule,ExpansionPanelsModule,ChartsModule,Ng2GoogleChartsModule

    ],
    declarations: [MainmenuComponent],
    providers: [Helper, projectsetupService]
})

export class MainMenuModule { }