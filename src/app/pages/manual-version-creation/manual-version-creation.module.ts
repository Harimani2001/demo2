import { NgModule } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ng2-ui-switch';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from './../../shared/SharedCommonModule';
import { ManualVersionCreationComponent } from './manual-version-creation.component';



@NgModule({
  declarations: [ManualVersionCreationComponent],
  imports: [
    SharedCommonModule,
    NgxDatatableModule,
    SharedModule,
    UiSwitchModule
  ],
  exports:[ManualVersionCreationComponent]
})
export class ManualVersionCreationModule { }
