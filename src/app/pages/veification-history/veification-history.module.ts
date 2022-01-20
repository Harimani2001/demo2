import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { veificationHistoryComponent } from './veification-history.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [veificationHistoryComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxDatatableModule
  ],
  exports:[veificationHistoryComponent],
  providers : [],
})
export class veificationHistoryModule { }
