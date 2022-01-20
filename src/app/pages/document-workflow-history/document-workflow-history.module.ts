import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Helper } from '../../shared/helper';
import { DocumentWorkflowHistoryComponent } from './document-workflow-history.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ng2-ui-switch';
import { ConfigService } from '../../shared/config.service';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,NgxDatatableModule,UiSwitchModule,
    FormsModule,
    CommonModule,
    SharedModule,
    SharedCommonModule,
    NgxDatatableModule
  ],
  exports:[DocumentWorkflowHistoryComponent],
  declarations: [DocumentWorkflowHistoryComponent],
  providers : [Helper,ConfigService],
})
export class DocumentWorkflowHistoryModule { }
