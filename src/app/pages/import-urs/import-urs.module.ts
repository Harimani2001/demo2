import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Helper } from '../../shared/helper';
import { ImportUrsComponent } from './import-urs.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LocationService } from '../location/location.service';
import { UiSwitchModule } from 'ng2-ui-switch';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,NgxDatatableModule,UiSwitchModule
  ],
  exports:[ImportUrsComponent],
  declarations: [ImportUrsComponent],
  providers : [Helper,LocationService],
})
export class ImportUrsModule { }
