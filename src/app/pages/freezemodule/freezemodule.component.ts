import swal from 'sweetalert2';

import { freezeModule } from './../../models/model';
import { freezeModuleService } from './freezemodule.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-freezemodule',
  templateUrl: './freezemodule.component.html',
  styleUrls: ['./freezemodule.component.css', './../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None,
})
export class FreezemoduleComponent implements OnInit {
modalSpinner=false;
public freezeModule:freezeModule[]= new Array<freezeModule>();
public seeComments:any[]= new Array();
public today:any;
public comments:any;
public moduleFlag:any;
public previousId:any;
public valdiatedDocument:any=null;
  constructor(public service:freezeModuleService) { }

  ngOnInit() {

    this.today= Date.now();
    this.loadall()

    }

    loadall(){
      this.comments='';
      this.service.loadAllOrgs().subscribe(resp => {
        this.freezeModule=resp
        this.freezeModule.sort((a, b) => (a.orderId > b.orderId) ? 1 : -1)
        });
    }
    onremovecheckComment(row,rowId){
if(null!=this.previousId)
{
  this.freezeModule[this.previousId].flag=!this.freezeModule[this.previousId].flag;
}
this.previousId=rowId;
      this.moduleFlag= row.flag;
      this.valdiatedDocument=row.documentName;
    }
    loadDocumentCommentLog(row) {
      this.seeComments=row.commentsHistory;
    }

    saveAndGoTo(){
      this.freezeModule[this.previousId].comment=this.comments;
      this.previousId=null
      this.service.saveOrUpdate(this.freezeModule).subscribe(resp => {
        swal({
          title:' Success!',
          text:' freeze Module Has been Updated.',
          type:'success',
          timer:2000
        }

        ).then(responseMsg => {
          this.loadall()
         // this.loadTemplate();
        });


        });
    }

}
