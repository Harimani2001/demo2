import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ConfigService } from '../../shared/config.service';
import { ModalBasicComponent } from '../../shared/modal-basic/modal-basic.component';
@Component({
  selector: 'app-veification-history',
  templateUrl: './veification-history.component.html',
  styleUrls: ['./veification-history.component.css']
})
export class veificationHistoryComponent implements OnInit {
  @ViewChild('verificationHistroyModal') verificationHistroyModal:ModalBasicComponent;
  @Input() permissionConstant: string = "";
  @Input() projectId: number = 0;
  public spinnerFlag: Boolean = false;
  constructor(public config: ConfigService) { }
  verificationHistory:any=new Array();
  ngOnInit(): void {
   
  }
  showVerificationHistoryModal(){
    this.verificationHistory=new Array();
    this.spinnerFlag=true;
   this.config.HTTPGetAPI("common/loadVerificationHistory/"+this.permissionConstant+"/"+this.projectId).subscribe(res =>{
     this.verificationHistory=res.result;
     this.spinnerFlag=false;
     this.verificationHistroyModal.show();
   });
  }
}
