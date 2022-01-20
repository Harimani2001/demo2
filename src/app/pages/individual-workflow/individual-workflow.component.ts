import { Component, Input, OnInit, ViewChild } from '@angular/core';

import swal from 'sweetalert2';
import { WorkflowDocumentStatusDTO } from '../../models/model';
import { Helper } from '../../shared/helper';
import { DashBoardService } from './../dashboard/dashboard.service';
@Component({
  selector: 'app-individual-workflow',
  templateUrl: './individual-workflow.component.html',
  styleUrls: ['./individual-workflow.component.css' ,'../../../../node_modules/sweetalert2/dist/sweetalert2.min.css']
  ,
})
export class IndividualWorkflowComponent implements OnInit {
  subscription: any;
  public workflowFlag: any;
  public modeldata: any;
  public comments: any;
  public indiSpinnerFlag=false;
  @Input() data: any;
  @Input() isIcon: boolean = false;
  public model: WorkflowDocumentStatusDTO = new WorkflowDocumentStatusDTO();
  public modelList: WorkflowDocumentStatusDTO[] = new Array <WorkflowDocumentStatusDTO>();
  @ViewChild('effect-9') modal: any;
  @Input() closeFlag = true;
  constructor(public helper: Helper, public dashboardService: DashBoardService) {
    this.model.workflowAccess = false;
   }

  ngOnInit() {
    this.comments = null;
    if (null != this.data) {
     const result = this.data.filter(t => t.lastEntry);
     if (null != result) {
      this.model =  result[0].workflowDto;
      this.model.levelName = result[0].levelName;
      this.model.actionTypeName = "Approval";
     }
    }
  }

  openMyModal(event) {
    if(this.closeFlag)
    document.querySelector('#' + event).classList.add('md-show');
    setTimeout(() => {
      $('#approvalCommentId').focus();
    }, 1000);
  }

  closeMyModal(event) {
      document.querySelector('#' + event).classList.remove('md-show');
  }

  approve($event) {
    this.closeFlag = false;
    this.model.approvedFlag = true;
    this.workflowload()
  }

  reject($event) {
    this.closeFlag = false;
    this.model.approvedFlag = false;
    this.workflowload()
  }

  workflowload( ){
    this.indiSpinnerFlag=true;
    this.model.comments =  this.comments;
    this.modelList.push(this.model);
    this.dashboardService.SetIndividualWorkflow(this.modelList).subscribe(response => {
      this.comments = null;
      this.helper.filter(this.model.documentId);
      this.indiSpinnerFlag=false;
      if (response.dataType  === 'Multiple access for same Data') {
        swal({
          title: '',
          text: 'Multiple access for same Data reload the page',
          type: 'warning',
          timer: this.helper.swalTimer,
          showConfirmButton: false
        }); } else {
          swal({
            title: '',
            text: 'Success!',
            type: 'success',
            timer: this.helper.swalTimer,
            showConfirmButton: false
          });
        }
      if(this.model.approvedFlag){
        this.model.workflowAccess=false;
      }
    },
      err => {
        this.comments = null;
      });
  }
}
