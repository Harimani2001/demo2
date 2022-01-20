import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AdminComponent } from './../../layout/admin/admin.component';
import { ConfigService } from './../../shared/config.service';

@Component({
  selector: 'app-urs-view',
  templateUrl: './urs-view.component.html',
  styleUrls: ['./urs-view.component.css']
})
export class UrsViewComponent implements OnInit,OnChanges {

  @Input() public  ursList:any;
  @Input() public  id:any;
  @Input() public url:any;
  @Input() public documentCode:any;
  @Input() public  ursIds:any[]=new Array();
  @Input() public  specIds:any[]=new Array();

  constructor(private adminComponent:AdminComponent,public router: Router,private configService:ConfigService) { }
  

  ngOnInit() {
    if (this.ursIds.length > 0 || this.specIds.length > 0) {
      this.loadDataForDetailView(this.ursIds, this.specIds);
    }
       
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ursIds && (JSON.stringify(changes.ursIds.previousValue) != JSON.stringify(changes.ursIds.currentValue))
      || changes.specIds && (JSON.stringify(changes.specIds.previousValue) != JSON.stringify(changes.specIds.currentValue))) {
      this.loadDataForDetailView(this.ursIds, this.specIds);
    }
  }

  loadDataForDetailView(ursIds: any, specIds: any) {
    this.adminComponent.spinnerFlag = true;
    let formData: FormData = new FormData();
    formData.append('ursIds', ursIds);
    formData.append('specIds', specIds);
    this.configService.HTTPPostAPI(formData, 'urs/getUrsAndSpecificationDetails').subscribe(resp => {
      this.adminComponent.spinnerFlag = false;
      this.ursList = resp.result;
    },
      err => {
        this.adminComponent.spinnerFlag = false;
      })
  }

  urlRedirection(id){
    this.router.navigate(['/URS/view-urs'], { queryParams: { id: id,status:this.url,roleBack:this.id}, skipLocationChange: true });
  }

}
