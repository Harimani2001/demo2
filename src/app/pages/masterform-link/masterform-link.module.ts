import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SelectModule } from 'ng-select';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { DynamicFormService } from '../dynamic-form/dynamic-form.service';
import { MasterformLinkComponent } from './masterform-link.component';

@NgModule({
  imports: [
    CommonModule,
    SharedCommonModule,
    SharedModule,
    SelectModule
  ],
  declarations: [MasterformLinkComponent],
  exports:[MasterformLinkComponent],
  providers:[DynamicFormService]
})
export class MasterformLinkModule { }
