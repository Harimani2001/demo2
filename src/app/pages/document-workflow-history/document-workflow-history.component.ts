import { Component, OnInit, EventEmitter, ViewChild, Output, Input, ViewEncapsulation } from '@angular/core';
import { ConfigService } from '../../shared/config.service';
import swal from 'sweetalert2';
import { Helper } from '../../shared/helper';
import { StepperClass } from '../../models/model';
@Component({
  selector: 'app-document-workflow-history',
  templateUrl: './document-workflow-history.component.html',
  styleUrls: ['./document-workflow-history.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DocumentWorkflowHistoryComponent implements OnInit {
  @Input() permissionConstant:string="";
  @ViewChild('levelHistroyModal') levelHistroyModal;
  @ViewChild('workFlowHistoryModal') workFlowHistoryModal;
  spinnerFlag:boolean=false;
  public stepperData: any = [];
  levelApprovalHistory: any = [];
  constructor(private helper: Helper, private configService: ConfigService) { }
  ngOnInit() {
  }
  showModalView() {
    this.spinnerFlag=true;
    const stepperModule: StepperClass = new StepperClass()
    stepperModule.constantName = this.permissionConstant;
    this.configService.HTTPPostAPI(stepperModule,"workFlow/getDocumentWorkflowData").subscribe(res =>{
      this.stepperData=res;
      this.stepperData.forEach(element=> {
        if (element.allUserApproval && element.userApprovalList.length > 0) {
          element.workFlowCompleted=element.userApprovalList.filter(f => this.helper.isEmpty(f.comments)).length == 0;
        } else if(!element.pendingDocumentsFlag && element.comments!=null && element.comments !='not applicable'){
          element.workFlowCompleted = true;
        }
        this.configService.HTTPGetAPI("workFlow/getLevelApprovalHistory/"+element.levelId).subscribe(res =>{
          element.levelApprovalHistory=res;
        });
      });
      this.spinnerFlag=false;
      this.workFlowHistoryModal.show();
    })
  }

  loadLevelHistory(data){
    this.levelApprovalHistory=new Array();
    this.levelApprovalHistory=data.levelApprovalHistory;
    this.levelHistroyModal.show();
  }

}
