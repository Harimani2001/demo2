import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TreeModule } from 'angular-tree-component';

import { ConfigService } from '../../shared/config.service';
import { Helper } from '../../shared/helper';
import { SharedModule } from '../../shared/shared.module';
import { TemplatebuilderComponent } from './templatebuilder.component';
import { TemplateBuiderService } from './templatebuilder.service';
import { SelectModule } from 'ng-select';
import { UserService } from '../userManagement/user.service';

export const templateRoutes: Routes = [{
  path: '',
  component: TemplatebuilderComponent,
  data: {
    breadcrumb: 'Dms',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(templateRoutes),
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    TreeModule,
    NgxDatatableModule,
    SelectModule
  ],
  declarations: [TemplatebuilderComponent],
  providers : [Helper,UserService, ConfigService,TemplateBuiderService]
})
// tslint:disable-next-line: class-name
export class templateBuilderModule { }
