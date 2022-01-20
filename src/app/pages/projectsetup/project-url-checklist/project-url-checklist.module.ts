import { NgModule } from '@angular/core';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { UiSwitchModule } from 'ng2-ui-switch';
import { SharedCommonModule } from './../../../shared/SharedCommonModule';
import { ProjectUrlChecklistComponent } from './project-url-checklist.component';



@NgModule({
  declarations: [ProjectUrlChecklistComponent],
  imports: [
    SharedCommonModule,
    UiSwitchModule,
    AngularMultiSelectModule
  ],
  exports:[ProjectUrlChecklistComponent]
})
export class ProjectUrlChecklistModule { }
