import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToastyModule } from 'ng2-toasty';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { SharedModule } from './../../shared/shared.module';
import { DocumentNumberingComponent } from './document-numbering.component';

export const childRoute: Routes = [{
  path: '',
  component: DocumentNumberingComponent,
  data: {
    breadcrumb: 'Document Numbering',
    icon: 'icofont icofont-blood-test bg-c-orange'
  }
}];

@NgModule({
  declarations: [DocumentNumberingComponent],
  imports: [
    RouterModule.forChild(childRoute),
    SharedModule, 
    SharedCommonModule,
    ToastyModule.forRoot(),
  ],
  exports:[DocumentNumberingComponent]
})
export class DocumentNumberingModule { }
