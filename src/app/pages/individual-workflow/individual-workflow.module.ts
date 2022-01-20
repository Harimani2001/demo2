import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SqueezeBoxModule } from 'squeezebox';
import { SharedModule } from '../../shared/shared.module';
import { IndividualWorkflowComponent } from './individual-workflow.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';




@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,NgbModule,
    SqueezeBoxModule

  ],
  declarations: [IndividualWorkflowComponent],
  providers:[],
  exports:[IndividualWorkflowComponent]
})
export class individualWorkflowModuleModule { }
