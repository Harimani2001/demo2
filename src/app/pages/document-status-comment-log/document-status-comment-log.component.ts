import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../../shared/config.service';
import { Helper } from './../../shared/helper';

@Component({
  selector: 'app-document-status-comment-log',
  templateUrl: './document-status-comment-log.component.html',
  styleUrls: ['./document-status-comment-log.component.css']
})
export class DocumentStatusCommentLogComponent implements OnInit {

  modalSpinner :boolean = false;
  public currentDocType:any;
  public currentDocStatus:any;
  public currentCreatedBy:any;
  public currentModifiedDate:any;
  statusLog:any;
  commentLog :any = null;
  @ViewChild('documentcommentsmodal') modalOverflow:any;
  ftpFolderSize: any;
  constructor(public helper: Helper,public permissionService: ConfigService) {  }
  isMappedForms : boolean = false;
  ngOnInit() {
  }

  close(){
    this.modalOverflow.hide();
    this.commentLog = null;
  }

  loadDocumentCommentLog(row){
    this.commentLog = row;
    if(this.commentLog!=null){
      if(this.commentLog.mapping != undefined){
        if(this.commentLog.mapping === true){
          this.commentLog.id = this.commentLog.uniqueId;
        }
      }
        this.modalSpinner=true;
        this.currentDocStatus=this.commentLog.status;
        if(this.commentLog.approvedStatus!=undefined){
          this.currentDocStatus=this.commentLog.approvedStatus;
        }
        this.currentCreatedBy=this.commentLog.createdBy;
        this.currentModifiedDate=this.commentLog.displayUpdatedTime;
        this.statusLog=[];
        
      this.permissionService.loadDocumentCommentLog(this.commentLog.id,this.commentLog.constantName,this.commentLog.formMappingId,this.commentLog.projectName).subscribe(result=>{
        this.modalOverflow.show();
        if(result.ftpSize)
            this.ftpFolderSize = result.ftpSize;
        if(result.list!=null){
          this.statusLog=result.list;
        }
        if(this.commentLog.mapping != undefined){
          if(this.commentLog.mapping === true){
            this.isMappedForms = true;
          }else{
            this.isMappedForms = false;
          }
          this.currentDocType = this.commentLog.templateName;
        }else{
          this.currentDocType = result.document;
          this.isMappedForms = false;
        }
        this.modalSpinner=false;
      }); 
    }
  }

}
