import { Component, OnInit, EventEmitter, ViewChild, Output} from '@angular/core';
import { ConfigService } from '../../shared/config.service';
@Component({
  selector: 'app-project-checklist',
  templateUrl: './project-checklist.component.html',
  styleUrls: ['./project-checklist.component.css']
})
export class ProjectChecklistComponent implements OnInit {
  @ViewChild("ProjectChecklistModal") projectChecklistModal:any;
  projectCheckList:any=new Array();
  filterProjectCheckList:any=new Array();
  spinnerFlag:boolean=false;
  @Output() onClose = new EventEmitter();
  projectChecklistPercentage:number;
  projectChecklistStatus:string="";
  isHideCheckedItems:boolean=false;
  hideButtonText:string="Hide checked items";
  constructor(public configService: ConfigService) { }
  ngOnInit() {
  }
  showModalView(projectId:any){
    this.spinnerFlag=true;
    this.configService.HTTPGetAPI("projectsetup/loadProjectCheckList/"+projectId).subscribe(res =>{
      this.projectCheckList=res;
      this.filterProjectCheckList=res;
      this.onChange();
      this.spinnerFlag=false;
    });
    this.projectChecklistModal.show();
  }
  onCloseProjectChecklistModal(){
    this.spinnerFlag=true;
    this.configService.HTTPPostAPI(this.projectCheckList,"projectsetup/changeProjectCheckListStatus").subscribe(res =>{
      this.spinnerFlag=false;
      this.onClose.emit(true);
      this.projectChecklistModal.hide();
    });
  }
  onChange(){
    let complete=this.projectCheckList.filter(f => f.completed).length;
    this.projectChecklistStatus=complete+"/"+this.projectCheckList.length;
    this.projectChecklistPercentage=Math.floor(complete*100/this.projectCheckList.length);
  }
  onClickHide(){
    this.isHideCheckedItems=!this.isHideCheckedItems;
    if(this.isHideCheckedItems){
      this.filterProjectCheckList=this.projectCheckList.filter(f => !f.completed);
      this.hideButtonText="Show checked items ("+(this.projectCheckList.filter(f => f.completed)).length+")";
    }else{
      this.filterProjectCheckList=this.projectCheckList;
      this.hideButtonText="Hide checked items";
    }
  }
}
