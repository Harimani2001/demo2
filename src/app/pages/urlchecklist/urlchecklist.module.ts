import { NgModule } from '@angular/core';
import { SharedCommonModule } from '../../shared/SharedCommonModule';
import { UrlchecklistComponent } from './urlchecklist.component';

@NgModule({
  declarations: [UrlchecklistComponent],
  imports: [
    SharedCommonModule,
  ],
  exports:[UrlchecklistComponent]
})
export class UrlchecklistModule { }
