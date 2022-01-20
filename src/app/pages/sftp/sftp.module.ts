import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { Helper } from '../../shared/helper';
import { TreeModule } from 'angular-tree-component';
import { SftpComponent } from './sftp.component';
import { DMSService } from '../dms/dms.service';

export const SftpRoutes: Routes = [{
  path: '',
  component: SftpComponent,
  data: {
    breadcrumb: 'Sftp',
    icon: 'icofont icofont-file-document bg-c-pink'
  }
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SftpRoutes),
    SharedModule,
    FormsModule,
    TreeModule,
  ],
  declarations: [SftpComponent],
  providers: [DMSService, Helper]
})

export class SftpModule { }