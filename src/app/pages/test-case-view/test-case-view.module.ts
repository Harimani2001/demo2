import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { IQTCService } from '../iqtc/iqtc.service';
import { TestCaseViewComponent } from './test-case-view.component';

export const viewRoutes: Routes = [{
  path: '',
  component: TestCaseViewComponent,
  data: {
    breadcrumb: 'Test Case View',
    icon: 'icofont icofont-blood-test bg-c-orange'
  }
}];

@NgModule({
  declarations: [TestCaseViewComponent],
  imports: [
    RouterModule.forChild(viewRoutes),
    SharedModule,
    SharedCommonModule,
    FormsModule,
    NgxDatatableModule,
  ],
  exports: [TestCaseViewComponent],
  providers: [IQTCService]
})
export class TestCaseViewModule { }
