import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { SharedModule } from './../../shared/shared.module';
import { ImportSettingComponent } from './import-setting.component';



@NgModule({
  declarations: [ImportSettingComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    AngularMultiSelectModule,
  ],
  exports:[ImportSettingComponent]
})
export class ImportSettingModule { }
